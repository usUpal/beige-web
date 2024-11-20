/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../../contexts/authContext';
import Image from 'next/image';

const Menu = ({ setFileUploadOpen, setFolderCreatorOpen, setSettingsOpen, path }) => {
  const { userData } = useAuth();

  return (
    <div className="flex items-start justify-between">
      <div className="mr-48 flex items-center justify-between gap-3">
        {path.length > 0 && (userData?.role !== 'admin' || userData?.role !== 'post_production_manager' || userData?.role !== 'user') && (
          <>
            <h6 className="text-md flex items-center gap-2 rounded-md px-2 py-1 text-black dark:text-black" style={{ backgroundColor: '#9EDF9C' }} onClick={() => setFileUploadOpen(true)}>
              <Image src="/assets/icons/uploadCloud.png" alt=" Upload Files" width={18} height={18} />
              Upload Files
            </h6>
            <h6 className="text-md flex items-center gap-2 rounded-md px-2 py-1 text-black dark:text-black" style={{ backgroundColor: '#36C2CE' }} onClick={() => setFolderCreatorOpen(true)}>
              <Image src="/assets/icons/create-folder.png" alt="Create Folder" width={18} height={18} />
              Create Folder
            </h6>
          </>
        )}

        {userData?.role === 'admin' && (
          <h6 className="text-md flex cursor-pointer items-center gap-2 rounded-md bg-gray-300 px-2 py-1 text-black dark:text-black" onClick={() => setSettingsOpen(true)}>
            <Image src="/assets/icons/setting.png" alt="File Settings" width={18} height={18} />
            File Settings
          </h6>
        )}
      </div>
    </div>
  );
};

export default Menu;
