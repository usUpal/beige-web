/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import FileCard from '../FileCard/FileCard';
import { formatBytes, formatDatetime } from '../util/fileutil';
import api from '../api/storage';
import config from '../../config';
import Menu from '../Menu/Menu';
import { useAuth } from '../../contexts/authContext';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition, Tab } from '@headlessui/react';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import Image from 'next/image';

const FileExplorer = ({ idToken, setExplorerPath, doRefresh, didRefresh, setFileUploadOpen, setFolderCreatorOpen, setSettingsOpen }) => {
  const { userData } = useAuth();
  const [state, setState] = useState({
    loading: false,
    loadingError: false,
    bucketName: 'objects',
  });

  const [path, setPathState] = useState([]);
  const [files, setFiles] = useState([]); // All file objects
  const [view, setView] = useState('list');

  const [modal, setModal] = useState(false);

  const [ignoringFileStructure, setIgnoringFileStructure] = useState(false);

  const [deletionState, setDeletionState] = useState({
    open: false,
    saving: false,
    error: false,
    file: '',
    isFolder: false,
  });

  const [fileToRename, setFileToRename] = useState<any>({});
  const [renameInputValue, setRenameInputValue] = useState('');

  const [fileToMove, setFileToMove] = useState({});
  const [fileMoveDestination, setFileMoveDestination] = useState({});
  const [isFileActive, setIsFileActive] = useState(false);
  const [selectFileIds, setSelecFileIds] = useState([]);

  const setPath = (p: any) => {
    setPathState(p);
    setExplorerPath(p);
  };

  const filesInPath = (p = path, ignoreFileStructure: any) =>
    files // Files and folders in current path, excluding full path in names, sorted with folders first.
      .map((file) => {
        const isFolder = file.path.endsWith('/');
        const splitPath = isFolder ? file.path.slice(0, -1).split('/') : file.path.split('/');
        return {
          ...file,
          isFolder,
          splitPath,
          name: splitPath[splitPath.length - 1],
        };
      })
      .filter((file) => {
        if (ignoreFileStructure) return true; // Don't filter if ignoring file structure
        if (file.splitPath === p || file.name.includes('.bucket.')) return false; // If it's the folder itself or is a hidden file
        if (!p.length && file.splitPath.length === 1) return true; // This is a root file in the root path
        return !!(file.splitPath.slice(0, -1).toString() === p.toString() && p.length); // If the file is in the right path, return true
      })
      .sort((first, second) => {
        return second.isFolder - first.isFolder; // Sort objects so that folders are first
      });

  const getFiles = () => {
    setState({ ...state, loading: true, loadingError: false });
    api
      .getFiles(userData?.id)
      .then(({ data }) => {
        setFiles(data.files);
        setState({ ...state, loadingError: false, loading: false, bucketName: data.bucket });
      })
      .catch(() => setState({ ...state, loading: false, loadingError: true }));
  };

  useEffect(() => {
    // When idToken and doRefresh are set, refresh the files
    // if (!idToken || idToken.length < 3 || !doRefresh) return;
    setState({ ...state, loading: true });

    getFiles();
    // didRefresh();
  }, [idToken, doRefresh]);

  const deleteFile = () => {
    setDeletionState({ ...deletionState, saving: true });
    api
      .deleteFile(deletionState.file)
      .then((res) => {
        setModal(false);
        toast(`❗ ${deletionState.isFolder ? 'Folder' : 'File'} deleted`);
        if (res.data.deleted) setDeletionState({ ...deletionState, open: false, error: false, saving: false });
        getFiles();
      })
      .catch((err) => {
        setDeletionState({ ...deletionState, error: true, saving: false });
      });
  };

  const renameFile = () => {
    let newFilePath = fileToRename.path.split('/');
    newFilePath[fileToRename.path.split('/').length - 1] = renameInputValue;
    api
      .moveFile(fileToRename.path, newFilePath.join('/'))
      .then((data) => {
        if (!data.success) return Promise.reject();
        toast('🖊 File renamed!');
        setRenameInputValue('');
        getFiles();
      })
      .catch(() => toast(`❗ Couldn't rename file. Make sure a file with the same name doesn't already exist.`));
    setFileToRename({});
  };

  const moveFile = (moveToParent: any) => {
    let destFolder = fileMoveDestination.splitPath;
    if (moveToParent) destFolder = fileToMove.splitPath.slice(0, -2);
    api
      .moveFile(fileToMove.path, destFolder.concat(fileToMove.name).join('/'))
      .then((data) => {
        if (!data.success) return Promise.reject();
        toast('🚚 File moved!');
        setPath(destFolder);
        getFiles();
      })
      .catch(() => toast(`❗ Couldn't move file. Make sure a file with the same name doesn't already exist in that folder.`));
    setFileToMove({});
  };
  const fileCards = () => {
    return filesInPath(path, ignoringFileStructure).map((file) => (
      <FileCard
        key={file.id}
        id={file.id}
        selectFileIds={selectFileIds}
        path={path}
        cardType={view}
        fileType={file.contentType}
        isFolder={file.isFolder}
        lastMod={formatDatetime(file.updated)}
        name={ignoringFileStructure ? file.path : file.name}
        size={formatBytes(file.size)}
        isDimmed={!!fileToMove.path && !file.isFolder}
        onDelete={() => {
          // If the folder isn't empty then don't delete (TODO recursive folder deletion)
          // if (file.isFolder && filesInPath(file.path.split('/').slice(0, -1)).length) return toast('❌ You must delete all files from this folder first.');
          setDeletionState({ ...deletionState, open: true, file: file.path, isFolder: file.isFolder });
        }}
        onRename={() => {
          setFileToRename(file);
          setRenameInputValue(file.name);
        }}
        onMove={() => {
          setFileToMove(file);
          setFileMoveDestination({});
        }}
        onClickItem={async () => {
          if (!!fileToMove.path) setFileMoveDestination(file);
          else if (file.isFolder) {
            setIgnoringFileStructure(false);
            setPath(file.path.slice(0, -1).split('/'));
          } else {
            if (await api.checkIsPublic(file.path)) {
              navigator.clipboard
                .writeText(config.CDN_URL + file.path)
                .then(() => {
                  toast('📋 File URL copied to clipboard');
                })
                .catch(() => {
                  toast(`File URL: ${config.CDN_URL + file.path}`, {
                    position: 'top-center',
                    draggable: false,
                    closeOnClick: false,
                    autoClose: 10000,
                  });
                });
            } else {
              const { url, duration } = await api.getSharableUrl(file.path, true);
              if (!url) toast("🚫 Couldn't get sharable URL. Try making the file public instead.");
              navigator.clipboard
                .writeText(url)
                .then(() => {
                  toast(`🔗 Sharable URL copied to clipboard. It will expire in ${duration} days. Make this file public to get a permanent public link.`, {
                    autoClose: 2000,
                  });
                })
                .catch(() => {
                  toast(`Sharable URL (will expire in ${duration} days): ${url}`, {
                    position: 'top-center',
                    draggable: false,
                    closeOnClick: false,
                    autoClose: 2000,
                  });
                });
            }
          }
        }}
        // ==========

        onDownload={async (publicDownload: any) => {
          if (publicDownload) {
            window.open(file.downloadLink, '_blank');
          } else {
            if (file.isFolder) {
              // If it's a folder, request the ZIP file from the backend
              try {
                await api.downloadFolder(file.path);
              } catch (error) {
                // console.error('There was an error downloading the folder:', error);
              }
            } else {
              // If it's a file, get the sharable URL and open it
              const { url } = await api.getSharableUrl(file.path, true);
              window.open(url, '_blank');
            }
          }
        }}
        // ==========
        checkIsPublic={() => api.checkIsPublic(file.path)}
        onSetPublic={(pub: any) => {
          api
            .setPublicOrPrivate(file.path, pub)
            .then(() => {
              toast(pub ? '🌎 File is now publicly accessible' : '🔑 File is now private');
            })
            .catch(() => {
              toast('❓ Something went wrong');
            });
        }}
        handleDropDown={handleDropDown}
      />
    ));
  };
  // show dropdown

  const handleDropDown = (id: any) => {
    if (selectFileIds.includes(id)) {
      setSelecFileIds([]);
    } else {
      setSelecFileIds([id]);
    }
  };

  const [showMenus, setShowMenus] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Example breakpoint for mobile

  useEffect(() => {
    // Update the isMobile state on window resize
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCancelRename = () => {
    setFileToRename({});
    setRenameInputValue('');
  };

  return (
    <div>
      <div>
        <p className="my-8 text-2xl">Files</p>
      </div>

      <div className="flex items-center  justify-between gap-4 lg:justify-start">
        {/* <label className="flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 border-black text-black focus:outline-black"
            checked={ignoringFileStructure}
            onChange={() => setIgnoringFileStructure(!ignoringFileStructure)}
          />
          <span className="ml-2 text-lg font-normal text-gray-900">Ignore Folder Structure</span>
        </label> */}

        <div className="mb-0 flex cursor-pointer items-center gap-3 text-lg " onClick={getFiles}>
          <div className={`hidden md:block`}>
            <Menu setFileUploadOpen={setFileUploadOpen} setFolderCreatorOpen={setFolderCreatorOpen} setSettingsOpen={setSettingsOpen} path={path} />
          </div>
          <span className="flex items-center gap-2 rounded-md border border-[#ddd] text-black dark:text-black px-6 py-1 " style={{ backgroundColor: '#93c5fd' }}>
            <Image src="/allSvg/refresh.svg" alt="refresh" className="size-6" width={24} height={24} />
            Refresh
          </span>
        </div>

        {/* Menu for mobile devices */}
        <div className="block lg:hidden">
          <span className={`block md:hidden`} onClick={() => setShowMenus(!showMenus)}>
            {allSvgs.threeDotMenuIcon}
          </span>
        </div>
      </div>

      <div className={`mt-3 flex md:mt-0 md:hidden`}>
        {showMenus && <Menu setFileUploadOpen={setFileUploadOpen} setFolderCreatorOpen={setFolderCreatorOpen} setSettingsOpen={setSettingsOpen} path={path} />}
      </div>

      {/* Folder breadcrumbs */}
      <div className="">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="mb-5 mt-3 flex items-center">
            <li className="mr-2">
              <span className="text-gray-500">{allSvgs.folderIcon}</span>
            </li>

            <li>
              <a href="#" className={`text-gray-500 ${!path.length ? 'font-bold' : 'hover:text-blue-600'}`} onClick={() => setPath([])}>
                {state.bucketName ? 'Beige' : ''}
              </a>
            </li>

            {path.length > 0 && (
              <>
                <li className="mx-2">
                  <span className="text-gray-300">/</span>
                </li>

                {path.map((folderName, folderDepth) => (
                  <li key={folderDepth}>
                    <a href="#" className={`text-gray-500 ${path.length === folderDepth + 1 ? 'font-bold' : 'hover:text-blue-600'}`} onClick={() => setPath(path.slice(0, folderDepth + 1))}>
                      {folderName}
                    </a>
                    {folderDepth !== path.length - 1 && <span className="mx-2 text-gray-300">/</span>}
                  </li>
                ))}
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* File Explorer */}
      <div className="files">
        <div className="message">
          {state.loading && (
            <div className="  relative mb-10 flex items-center rounded border px-4 py-3" role="alert">
              <div className="h-12 w-20">
                <div className="h-12 w-12">{allSvgs.roundSpinIcon}</div>
              </div>
              <div className="mt-2">
                <span className="block font-bold sm:inline">Please wait...</span>
                <span className="block sm:inline">We are gathering your files... </span>
              </div>
            </div>
          )}

          {state.loadingError && (
            <div className=" relative mb-10 flex items-center rounded border px-4 py-3" role="alert">
              <div className="h-12 w-20">
                <div className=" flex h-12 w-12 items-center justify-center">{allSvgs.invalidIcon}</div>
              </div>
              <div className="mt-2">
                <span className="block font-bold sm:inline">Something went wrong.</span>
                <span className="block pe-4 sm:inline">
                  Either the request failed or you are not authorized to access these files.
                  <a href="#" className="ps-6" onClick={getFiles}>
                    Try again.
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* {ignoringFileStructure && (
          <p className="mb-4 w-full border py-3 px-6 sm:py-4 sm:px-8 text-warning ">
            Files that contain the text .bucket. may store dashboard settings or other information, so be careful when deleting or renaming them.
          </p>
        )} */}

        {!filesInPath().length && !state.loading && !ignoringFileStructure && <p>There are no files here : </p>}

        <div className="">
          {view === 'list' ? (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {fileCards().map((card, index) => (
                <li key={index} className="relative">
                  {card}
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 ">
              {fileCards().map((card, index) => (
                <div key={index} className="file-card relative rounded-lg shadow-md">
                  {card}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <>
        {/* Delete Modal */}
        <div className="mb-5">
          <Transition appear show={deletionState.open} as={Fragment}>
            <Dialog
              as="div"
              open={deletionState.open}
              onClose={() => {
                setDeletionState({ ...deletionState, open: false, error: false, saving: false });
              }}
            >
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
                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                      <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                        <div className="text-lg font-bold capitalize text-red-600">Delete {deletionState.isFolder ? 'folder' : 'file'}</div>
                        <button
                          type="button"
                          className="text-[16px] text-white-dark hover:text-dark"
                          onClick={() => {
                            setDeletionState({ ...deletionState, open: false, error: false, saving: false });
                          }}
                        >
                          {allSvgs.closeIconSvg}
                        </button>
                      </div>
                      <div className="p-5 ">
                        {' '}
                        {/* Added flex and items-center classes here */}
                        <p className="flex flex-col items-center bg-rose-100 text-danger">{allSvgs.trashIcon}</p>
                        <p className=" font-semibold">
                          {' '}
                          {/* Added text-red-600 class for red color */}
                          Are you sure you want to delete <span className="text-danger"> {deletionState.file}</span>?
                        </p>
                        <div className="mt-8 flex items-center justify-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger text-[16px]"
                            onClick={() => {
                              setDeletionState({ ...deletionState, open: false, error: false, saving: false });
                            }}
                          >
                            No
                          </button>

                          <button type="button" className="btn btn-primary text-[16px] ltr:ml-4 rtl:mr-4" onClick={() => deleteFile()}>
                            {deletionState.saving ? 'Deleting...' : 'Yes'}
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

      <Transition appear show={!!fileToRename.path} as={Fragment}>
        <Dialog as="div" open={!!fileToRename.path} onClose={() => setFileToRename({})}>
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
                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <h5 className="text-lg font-bold">Rename</h5>
                    <button
                      type="button"
                      className="text-[16px] text-white-dark hover:text-dark"
                      onClick={() => {
                        setFileToRename({});
                        setRenameInputValue('');
                      }}
                    >
                      {allSvgs.closeBtnCp}
                    </button>
                  </div>
                  <div className="flex flex-col items-center px-5 pb-5">
                    <p className="flex flex-col items-center text-info">{allSvgs.docEditIcon}</p>
                    <p className="font-semibold">
                      Rename <span className="text-blue-400"> {fileToRename.name}</span>
                    </p>
                    <p>
                      <input
                        className="rounded border p-3 capitalize focus:border-gray-600 focus:outline-none"
                        placeholder="New name"
                        value={renameInputValue}
                        onChange={(e) => setRenameInputValue(e.target.value)}
                      />
                    </p>

                    <div className="mt-8 flex items-center justify-end">
                      <button type="button" className="btn btn-danger text-[16px]" onClick={handleCancelRename}>
                        Cancel
                      </button>

                      <DefaultButton onClick={renameFile} css="ltr:ml-4 rtl:mr-4">
                        Rename
                      </DefaultButton>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* File Move Popup*/}
      {/*  <Portal open={!!fileToMove.path} onClose={() => setFileToMove({})} closeOnDocumentClick={false}>
        <div className="file-move-portal" style={{ position: 'fixed' }}>
          <Segment className="file-move-portal-segment">
            <p>{!fileMoveDestination.name ? `Select the folder you want to move this file into.` : `Move ${fileToMove.name} into ${fileMoveDestination.name}?`}</p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ display: 'inline-block' }} size="small" content="Cancel" color="purple" onClick={() => setFileToMove({})} />
              {!fileMoveDestination.path && fileToMove.path && fileToMove.path.length > 1 && (
                <Button style={{ display: 'inline-block' }} size="small" content="Move up to parent" color="blue" onClick={() => moveFile(true)} />
              )}
              {fileMoveDestination.name && <Button style={{ display: 'inline-block' }} size="small" content="Confirm" color="green" onClick={() => moveFile()} />}
            </div>
          </Segment>
        </div>
      </Portal> */}
    </div>
  );
};

export default FileExplorer;
