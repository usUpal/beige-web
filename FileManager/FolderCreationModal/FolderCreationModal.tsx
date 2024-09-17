import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import api from '../api/storage';
import { Dialog, Transition } from '@headlessui/react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

const FolderUploadModal = ({ open, closeModal, path, onSuccess }) => {
  const [folderPath, setFolderPath] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const createFolder = () => {
    setSaving(true);
    api
      .addFolder(folderPath)
      .then((res) => {
        setSaving(false);
        setError(false);
        if (!res.data.saved) return;
        onSuccess();
        toast.success('📁 Folder created!');
      })
      .catch((err) => {
        setSaving(false);
        setError(true);
      });
  };

  const close = () => {
    setError(false);
    setSaving(false);
    closeModal();
  };

  return (
    <div>
      <>
        <div className="mb-5">
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={close}>
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
                    <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                      <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                        <h5 className="font-bold text-lg">Create folder</h5>

                        <button type="button" className="text-white-dark hover:text-dark text-[16px]" onClick={close}>
                          {allSvgs.closeBtnCp}
                        </button>
                      </div>

                      <div className="p-5">
                        <p>
                          Your new folder will be created in the current directory.
                        </p>

                        <div className="mb-5">
                          <label htmlFor="url">Folder</label>
                          <div className="flex">
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] ">
                              {(path[path.length - 1] || '') + '/'}
                            </div>
                            <input
                              onChange={(e) => setFolderPath((path.length ? path.join('/') + '/' : '') + e.target.value)}
                              id="new_folder"
                              type="text"
                              placeholder="New Folder Name"
                              className="form-input ltr:rounded-l-none rtl:rounded-r-none " />

                            {error && <p style={{ color: 'red', margin: '10px 0' }}>Something went wrong and we couldn't create that folder.</p>}
                          </div>
                        </div>


                        <div className="flex justify-end items-center mt-8">
                          <button type="button" className="btn btn-danger text-[16px] mr-2" onClick={close}>
                            Discard
                          </button>

                          <DefaultButton onClick={createFolder} type='button'>
                            {saving ? 'Adding...' : 'Add Folder'}
                          </DefaultButton>
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

export default FolderUploadModal;
