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

  console.log(settings);

  return (
    <div>
      {/* settings starts */}
      <div className="mb-5">
        <Transition appear show={open} as={Fragment}>
          <Dialog as="div" open={open} onClose={close}>
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
                  <Dialog.Panel as="div" className="panel my-24 w-2/5 overflow-hidden rounded-lg border-0 p-0 pb-2 text-black dark:text-white-dark md:w-3/5">
                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                      <div className="text-lg font-bold capitalize">Options & Settings</div>
                      <button
                        type="button"
                        className="text-[16px] text-white-dark hover:text-dark"
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        {allSvgs.closeModalSvg}
                      </button>
                    </div>

                    <div className="p-5 ">
                      <p>Your settings will be saved in a file in your storage bucket.</p>
                      <div className="">
                        <label>Default File Privacy</label>

                        <p className="flex items-center">
                          <label
                            className="relative h-6 w-12"
                            // onClick={() => dispatch({ type: 'switchFolderUpload' })} checked={settings.defaultPublicFiles}
                            onClick={() => setSettings({ ...settings, defaultPublicFiles: !settings.defaultPublicFiles })}
                          >
                            <input
                              type="checkbox"
                              className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                              id="custom_switch_checkbox1"
                              checked={settings.defaultPublicFiles}
                            />
                            <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                          </label>

                          <span className="pb-2 ps-2 ">{`Uploaded files are ${settings.defaultPublicFiles ? 'public' : 'private'} by default`}</span>
                        </p>
                      </div>

                      <p className=" mb-4 mt-2 font-semibold">
                        <div className="flex flex-col">
                          <span className="">Private URL Expiration</span>
                          <span className="text-[13px] font-normal">Shared links for private files will expire after</span>
                        </div>
                        {/* input */}
                        <form action="" onChange={(e) => setSettings({ ...settings, privateUrlExpiration: e.currentTarget.value })}>
                          <div className="mt-2 flex w-72">
                            <input
                              type="number"
                              placeholder=""
                              className="form-input flex-1 ltr:rounded-l-md ltr:rounded-r-none rtl:rounded-l-none rtl:rounded-r-md"
                              value={settings.privateUrlExpiration}
                              onChange={(e) => setSettings({ ...settings, privateUrlExpiration: e.currentTarget.value })}
                            />
                            <div className="flex items-center justify-center rounded-none border border-white-light bg-[#eee] px-3 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ">days</div>
                          </div>
                        </form>
                      </p>

                      <div className="w-10/12">
                        <p className="flex flex-col">
                          <span className="font-semibold">CDN Admins</span>
                          <p>
                            Every email you add to this comma-separated list <strong>(no spaces)</strong> will have <strong>full read and write access to the storage bucket</strong> and settings. They
                            will be able to sign into this dashboard with their Google account.
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

                        <div className="">
                          <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-input"
                            onChange={(e) => setSettings({ ...settings, cdnAdmins: e.currentTarget.value })}
                            value={settings.cdnAdmins}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-end">
                        <button className="btn btn-outline-darkness relative flex items-center text-[16px] text-black hover:text-white" onClick={close}>
                          Save
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
      {/* settings ends */}
    </div>
  );
};

export default SettingsModal;
