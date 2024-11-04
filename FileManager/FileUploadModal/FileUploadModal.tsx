import React, { useReducer, createRef, Fragment } from 'react';
import { toast } from 'react-toastify';
import { formatBytes } from '../util/fileutil';
import api from '../api/storage';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

let uploadCancelFunc = () => {};

const initialUploadState = {
  files: [],
  status: '',
  progress: 0,
  totalProgress: 0,
  totalUploadSize: 0,
  totalUploadedSize: 0,
  uploading: false,
  error: false,
  folderUpload: false,
  uploadCancelled: false,
};

function uploadStateReducer(state: any, action: any) {
  switch (action.type) {
    case 'reset':
      if (action.betweenSteps)
        return {
          ...state,
          status: action.status || '',
          progress: 0,
          error: false,
        };
      else {
        uploadCancelFunc(); // Cancel the current upload request.
        return { ...initialUploadState };
      }
    case 'setStatus':
      return { ...state, status: action.status };
    case 'uploadError':
      console.error(action.error);
      return {
        ...state,
        error: true,
        uploading: false,
        progress: 100,
        status: action.error,
      };
    case 'setUploading':
      return { ...state, uploading: action.uploading };
    case 'setProgress':
      return {
        ...state,
        progress: Math.round(action.rawProgress * 100 * 10) / 10,
      };
    case 'addUploadedAmount':
      const totalUploadedSize = state.totalUploadedSize + action.amount;
      return {
        ...state,
        totalUploadedSize,
        totalProgress: (totalUploadedSize / state.totalUploadSize) * 100,
      };
    case 'setFiles':
      let size = 0;
      for (const file of action.files) size += file.size || 0; // Count the total size of all the files
      return { ...state, files: action.files || [], totalUploadSize: size };
    case 'switchFolderUpload':
      return { ...state, folderUpload: !state.folderUpload };
  }
}

const FileUploadModal = ({ open, closeModal, path, onSuccess }) => {
  const fileInput = createRef();

  const [state, dispatch] = useReducer(uploadStateReducer, initialUploadState);

  const startUpload = async () => {
    const shouldBePublic = (await api.getSettings()).defaultPublicFiles;

    const handleStepFail = (err: any, message: any) => {
      console.error(err);
      // Return a rejection so that the catch block is called
      return Promise.reject(message);
    };

    for (const [i, file] of state.files.entries()) {
      try {
        dispatch({ type: 'setUploading', uploading: true });
        dispatch({
          type: 'reset',
          betweenSteps: true,
          status: 'Requesting upload policy...',
        });
        const uploadPolicy = await api
          .getNewUploadPolicy(file?.name, file?.type, file?.size) // Get upload policy for full file destination path.
          .catch((err) => handleStepFail(err, `Unable to get upload info for files ( Make sure the order is exist )`));
        dispatch({
          type: 'setStatus',
          status: `Uploading file ${i + 1} of ${state.files.length}...`,
        });

        const [uploadPromise, cancelFunc] = api.postFile(uploadPolicy, file, (p: any) => dispatch({ type: 'setProgress', rawProgress: p })); // Post file and set progress callback
        uploadCancelFunc = cancelFunc;
        let doBreak = false;
        await uploadPromise.catch((err: any) => {
          // If the error was an intentional axios cancel, don't handle it and instead exit the loop
          if (axios.isCancel(err)) {
            doBreak = true;
            return;
          }
          return handleStepFail(err, `Unable to upload file ${i + 1}`);
        });
        if (doBreak) break;

        dispatch({ type: 'addUploadedAmount', amount: file.size || 0 }); // File was successfully uploaded, add its size to the counter.

        dispatch({
          type: 'setStatus',
          status: `Setting file ${shouldBePublic ? 'public' : 'private'}...`,
        });
        // await api.setPublicOrPrivate(file.name, shouldBePublic)
        //   .catch(err => handleStepFail(err, `Unable to make file ${i+1} ${shouldBePublic ? 'public' : 'private'}`))

        if (i === state.files.length - 1) {
          // If that was the last file
          toast.success('Files uploaded successfully');
          dispatch({ type: 'reset' });
          setTimeout(onSuccess, 1000); // Wait one second before closing modal and refreshing explorer
        }
      } catch (errorMessage) {
        dispatch({ type: 'uploadError', error: errorMessage });
        break;
      }
    }
  };

  const onFilesChange = (event: any) => {
    const parentPath = path.length ? path.join('/') + '/' : ''; // Folder to upload files to
    let fileArray = Array.from(event.target.files).map((file: any) => {
      const fileName = parentPath + (state.folderUpload ? file.webkitRelativePath : file.name); // The absolute destination path of file. webkitRelativePath is the relative path of the file on the user's FS.
      const newFile = new File([file], fileName, { type: file.type });
      return newFile;
    });
    if (state.folderUpload) {
      // If it's a folder upload we also have to generate files for each folder so that they show up in the file manager
      let folderPaths: any = [];
      for (const file of fileArray) {
        const fileParentFolder = file.name.split('/').slice(0, -1).join('/') + '/';
        if (!folderPaths.includes(fileParentFolder)) folderPaths.push(fileParentFolder);
      }
      folderPaths = folderPaths.map((folderName: any) => new File([''], folderName));
      fileArray = fileArray.concat(folderPaths);
    }
    dispatch({ type: 'setFiles', files: fileArray });
  };

  const fileList = state.files.map((file: any) => (
    <li key={file.name}>
      <span>{file.name}</span> - {formatBytes(file.size)}
    </li>
  ));

  return (
    <div>
      {/* Delete Modal */}
      <>
        <div className="mb-5">
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={() => dispatch({ type: 'switchFolderUpload' })}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0" />
              </Transition.Child>
              <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                <div className="flex min-h-screen items-center justify-center px-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel as="div" className="panel my-24 w-5/6 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark md:w-3/6 2xl:w-2/5">
                      <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                        <div className="text-lg font-bold capitalize ">Upload {state.folderUpload ? 'a Folder' : 'Files'}</div>
                        <button
                          type="button"
                          className="text-[16px] text-white-dark hover:text-dark"
                          onClick={() => {
                            dispatch({ type: 'reset' });
                            closeModal();
                          }}
                        >
                          {allSvgs.closeIconSvg}
                        </button>
                      </div>

                      <div className="px-5">
                        <div onClick={() => dispatch({ type: 'switchFolderUpload' })} className="flex cursor-pointer items-center pt-5">
                          <input type="checkbox" className="form-checkbox border border-black" id="checkSwitchFolderUpload" checked={state.folderUpload} onChange={() => {}} />
                          <span className="ml-2 text-black">Select {!state.folderUpload ? 'a Folder' : 'Files'}</span>
                        </div>
                        {/* <div className="">
                          <label className="relative h-6 w-12" onClick={() => dispatch({ type: 'switchFolderUpload' })}>
                            <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" checked={state.folderUpload} />
                            <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                          </label>
                          <span className="ms-3 ">Select {!state.folderUpload ? 'a Folder' : 'Files'}</span>
                        </div> */}

                        <div className=" font-semibold">
                          <p>
                            You can select multiple files or a single folder to upload. If you upload a folder, file structure will be preserved. Files will be uploaded to{' '}
                            {(path || []).join('/') + '/'}.
                          </p>
                        </div>

                        {/* <div className={styles.fileInputContainer}> */}
                        <div className="w-full">
                          <input
                            style={{ display: 'none' }}
                            multiple
                            type="file"
                            webkitdirectory={state.folderUpload ? '' : undefined}
                            mozdirectory={state.folderUpload ? '' : undefined}
                            msdirectory={state.folderUpload ? '' : undefined}
                            odirectory={state.folderUpload ? '' : undefined}
                            directory={state.folderUpload ? '' : undefined}
                            ref={fileInput}
                            onChange={onFilesChange}
                          />

                          <div className="my-5 flex justify-center">
                            <span className="border-2 px-5 py-1 text-[18px] hover:shadow" style={{ borderRadius: '5px' }} onClick={() => fileInput.current.click()} disabled={state.uploading}>
                              Select {state.folderUpload ? 'a Folder' : 'Files'}
                            </span>

                            {/* <DefaultButton onClick={() => fileInput.current.click()} css='mx-auto' disabled={state.uploading}> Select {state.folderUpload ? 'a Folder' : 'Files'}</DefaultButton> */}
                          </div>
                        </div>

                        {/* <div className={styles.fileList}> */}
                        <div>
                          <li className="list-none">{fileList}</li>
                        </div>

                        {state.status && (
                          <div className="m-5 space-y-5">
                            <div className="relative h-6 w-full rounded-xl bg-[#ebedf2] text-center" style={{ borderRadius: '5px', backgroundColor: '#dbd2c3' }}>
                              {/* Progress bar */}

                              <div
                                className={`absolute left-0 top-0 h-6 rounded-xl`}
                                style={{
                                  // width: `60%`,
                                  width: `${state.progress}%`,
                                  backgroundColor: '#aa9b82',
                                  borderRadius: '5px',
                                }}
                              />
                              {/* Centered percentage text */}
                              <span className="text-md relative z-10 flex h-full items-center justify-center font-medium text-white">
                                {state.uploading ? `${state.progress}%` : state.error ? 'Error!' : `${state.progress}%`}
                              </span>
                            </div>
                          </div>
                        )}

                        <p
                          style={{
                            textAlign: 'right',
                            marginRight: '30px',
                            color: state.error ? 'red' : 'black',
                          }}
                        >
                          <strong>{state.status}</strong>
                        </p>

                        <div className="mt-8 flex items-center justify-end">
                          {/* <button
                            className="btn btn-danger mr-3 text-[16px] text-white"
                            color="black"
                            onClick={() => {
                              dispatch({ type: 'reset' });
                              closeModal();
                            }}
                          >
                            Cancel
                          </button> */}

                          <DefaultButton onClick={startUpload} disabled={!state.files.length || state.uploading}>
                            <span className="flex items-center justify-center gap-1 duration-300">
                              {allSvgs.uploadIcon}
                              {state.uploading ? 'Uploading...' : 'Start Upload'}
                            </span>
                          </DefaultButton>
                          {/* <button className=" btn btn-outline-secondary relative flex items-center text-[16px]" onClick={startUpload} disabled={!state.files.length || state.uploading}>
                            <span className="flex items-center justify-center duration-300">{allSvgs.uploadIcon}</span>
                            {state.uploading ? 'Uploading...' : 'Start Upload'}
                          </button> */}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </>
    </div>
  );
};

export default FileUploadModal;
