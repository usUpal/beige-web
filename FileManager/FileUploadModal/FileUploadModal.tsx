import React, { useReducer, createRef, Fragment } from 'react';
import { toast } from 'react-toastify';
import { formatBytes } from '../util/fileutil';
import api from '../api/storage';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

let uploadCancelFunc = () => { };

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
        status: action.error + ' (preceding files successfully uploaded)',
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
          .catch((err) => handleStepFail(err, `Unable to get upload policy for file ${i + 1}`));

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
          toast('🚀 All files uploaded!');
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
        console.log(fileParentFolder);
        if (!folderPaths.includes(fileParentFolder)) folderPaths.push(fileParentFolder);
      }
      folderPaths = folderPaths.map((folderName: any) => new File([''], folderName));
      fileArray = fileArray.concat(folderPaths);
      console.log(fileArray);
    }
    dispatch({ type: 'setFiles', files: fileArray });
  };

  const fileList = state.files.map((file: any) => ((console.log(file)
  ),
    <li key={file.name}>
      {/* <span className={styles.fileListName}>{file.name}</span> - {formatBytes(file.size)} */}
      <span>{file.name}</span> - {formatBytes(file.size)}
    </li>
  ));

  return (
    <div>

      {/* Delete Modal */}
      <>
        <div className="mb-5">
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={() => dispatch({ type: 'switchFolderUpload' })} >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0" />
              </Transition.Child>
              <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel as="div" className="panel my-24 w-3/6 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pb-6">
                      <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <div className="text-lg font-bold capitalize text-red-600">
                          Upload {state.folderUpload ? 'a Folder' : 'Files'}
                        </div>
                        <button type="button" className="text-white-dark hover:text-dark text-[16px]" onClick={() => {
                          dispatch({ type: 'reset' });
                          closeModal();
                        }}>
                          {allSvgs.closeModalSvg}
                        </button>
                      </div>

                      <div className="px-5">
                        <p className='flex items-center'>
                          <label
                            className="w-12 h-6 relative"
                            onClick={() => dispatch({ type: 'switchFolderUpload' })}
                          >
                            <input
                              type="checkbox"
                              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                              id="custom_switch_checkbox1"
                              checked={state.folderUpload}
                            />
                            <span
                              className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                            >
                            </span>
                          </label>
                          <span className='ms-3 '>Select {!state.folderUpload ? 'a Folder' : 'Files'}</span>
                        </p>

                        <p className=" font-semibold">
                          <p>You can select multiple files or a single folder to upload. If you upload a folder, file structure will be preserved. Files will be uploaded to {(path || []).join('/') + '/'}.</p>
                        </p>

                        {/* <div className={styles.fileInputContainer}> */}
                        <div>
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

                          <button type="button" className="btn btn-dark text-[18px]" style={{ display: 'block', margin: '15px auto' }}
                            onClick={() => fileInput.current.click()} disabled={state.uploading}
                          >
                            Select {state.folderUpload ? 'a Folder' : 'Files'}
                          </button>

                        </div>

                        {/* <div className={styles.fileList}> */}
                        <div >
                          <li className='list-none'>{fileList}</li>
                        </div>

                        {state.status && (
                          <div className="mb-5 space-y-5">
                            <div className="w-full h-4 bg-[#ebedf2] dark:bg-dark/40 rounded-full">

                              <div className={`bg-info h-4 rounded-full text-right text-white text-xs`} style={{ width: `${state.progress}%` }}>
                                {state.uploading ? `${state.progress}%` : state.error ? 'Error!' : `${state.progress}%`}
                              </div>
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

                        <div className="flex justify-end items-center mt-8">
                          <button
                            className='mr-3 btn btn-outline-dark text-[16px]'
                            color="black"
                            onClick={() => {
                              dispatch({ type: 'reset' });
                              closeModal();
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className=' flex items-center btn btn-outline-secondary relative text-[16px]'
                            onClick={startUpload}
                            disabled={!state.files.length || state.uploading}
                          >
                            <span className="flex items-center justify-center duration-300">
                              {allSvgs.uploadIcon}
                            </span>
                            {state.uploading ? 'Uploading...' : 'Start Upload'}
                          </button>
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
    </div >
  );
};

export default FileUploadModal;


