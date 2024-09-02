/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../../contexts/authContext';
import Image from 'next/image';

const Menu = ({ setFileUploadOpen, setFolderCreatorOpen, setSettingsOpen, path }) => {
  const { userData } = useAuth();

  return (
    <div className="flex items-start justify-between">
      <div className="mr-48 flex items-center justify-between gap-6">
        {path.length > 0 && userData?.role !== 'user' && (
          <>
            <h6 className="flex items-center gap-2 rounded-md px-4 py-2 text-lg cursor-pointer" onClick={() => setFileUploadOpen(true)}>
              <Image src="/assets/icons/uploadCloud.png" alt="refresh" width={18} height={18} />
              Upload Files
            </h6>
            <h6 className="rounded-mdx-4 flex items-center gap-2 py-2 text-lg cursor-pointer" onClick={() => setFolderCreatorOpen(true)}>
              <Image src="/assets/icons/create-folder.png" alt="refresh" width={18} height={18} />
              Create Folder
            </h6>
          </>
        )}

        {userData?.role === 'admin' && (
          <h6 className="flex items-center gap-2 rounded-md px-4 py-2 text-lg cursor-pointer" onClick={() => setSettingsOpen(true)}>
            <Image src="/assets/icons/setting.png" alt="refresh" width={18} height={18} />
            File Settings
          </h6>
        )}
      </div>
    </div>
  );
};

export default Menu;
