import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import api from '../api/storage';
import { Dialog, Transition } from '@headlessui/react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const SettingsModal = ({ open, closeModal }) => {
  // const [saving, setSaving] = useState(false)
  // const [error, setError] = useState(false)

  const [settings, setSettings] = useState({});

  const [notLoaded, setNotLoaded] = useState(true);

  useEffect(() => {
    if (!open) return;
    setNotLoaded(true);
    api.getSettings().then((s) => {
      // Default settings:
      setSettings({
        ...s,
        useSettings: true, // Indicated that these aren't just the default settings
      });
      setNotLoaded(false);
    });
  }, [open]);

  const saveSettings = () => {
    // setSaving(true)
    // setError(false)
    api
      .saveSettings(settings)
      .then(() => toast('⚙️ Settings saved'))
      .catch((err) => toast(`❌ An error occurred and we couldn't save your settings`));
  };

  const close = () => {
    saveSettings();
    closeModal();
  };

  return (
    <div>
     

      {/* settings starts */}
      <div className="mb-5">
        <Transition appear show={open} as={Fragment}>
          <Dialog as="div" open={open} onClose={close} >
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
                  <Dialog.Panel as="div" className="panel my-24 w-2/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pt-8 pb-6">
                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                      <div className="text-lg font-bold capitalize">
                        {/* Upload {state.folderUpload ? 'a Folder' : 'Files'} */}
                        Options & Settings
                      </div>
                      <button type="button" className="text-white-dark hover:text-dark" onClick={() => {
                        closeModal();
                      }}>
                        {allSvgs.closeModalSvg}
                      </button>
                    </div>

                    <div className="p-5 ">
                      <p>
                        Your settings will be saved in a file in your storage bucket.
                      </p>
                      <div className=''>
                        <label>Default File Privacy</label>

                        <p className='flex items-center'>
                          <label
                            className="w-12 h-6 relative"
                            // onClick={() => dispatch({ type: 'switchFolderUpload' })} checked={settings.defaultPublicFiles}
                            onClick={() => setSettings({ ...settings, defaultPublicFiles: !settings.defaultPublicFiles })}
                          >
                            <input
                              type="checkbox"
                              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                              id="custom_switch_checkbox1"
                              // checked={state.folderUpload}
                              checked={settings.defaultPublicFiles}
                            />
                            <span
                              className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                            >
                            </span>
                          </label>

                          <span className='ps-2 pb-2 '>{`Uploaded files are ${settings.defaultPublicFiles ? 'public' : 'private'} by default`}</span>

                        </p>
                      </div>

                      <p className=" font-semibold mt-2">
                        <div className="flex flex-col">
                          <span className=''>
                            Private URL Expiration

                          </span>
                          <span className='font-normal text-[13px]'>
                            Shared links for private files will expire after
                          </span>
                        </div>
                        {/* input */}
                        <form action="" onChange={(e) => setSettings({ ...settings, privateUrlExpiration: e.currentTarget.value })}>
                          <div className="flex w-72 mt-2">
                            <input type="number" placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none flex-1 ltr:rounded-l-md rtl:rounded-r-md" value={settings.privateUrlExpiration} onChange={(e) => setSettings({ ...settings, privateUrlExpiration: e.currentTarget.value })} />
                            <div className="bg-[#eee] flex justify-center items-center rounded-none px-3 font-semibold border border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] " >
                              days

                            </div>
                          </div>
                        </form>
                      </p>

                      <p className='flex flex-col'>
                        <span className='font-semibold'>CDN Admins</span>
                        <p>
                          Every email you add to this comma-separated list <strong>(no spaces)</strong> will have <strong>full read and write access to the storage bucket</strong> and settings. They will be
                          able to sign into this dashboard with their Google account.
                        </p>
                      </p>

                      <p
                        style={{
                          textAlign: 'right',
                          marginRight: '30px',
                          // color: error ? 'red' : 'black',
                        }}
                      >
                        {/* <strong>{state.status}</strong> */}
                      </p>

                      <div>
                        <input type="email" placeholder="Enter Email" className="form-input" onChange={(e) => setSettings({ ...settings, cdnAdmins: e.currentTarget.value })} value={settings.cdnAdmins} />

                      </div>

                      <div className="flex justify-end items-center mt-8 bg-[#fbfbfb]">
                        <button
                          className='flex items-center btn btn-outline-dark relative'
                          onClick={close}>Save
                        </button>
                      </div>

                      <div>

                        {/* <p style={{ color: error ? 'red' : 'green', fontWeight: 'bold' }}> </p> */}
                        {/* {error ? `An error occurred.` : saving ? 'Saving your settings....' : 'Settings saved'} */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      {/* settings ends */}
    </div >
  );
};

export default SettingsModal;
