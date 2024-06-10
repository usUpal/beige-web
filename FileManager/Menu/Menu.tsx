import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAuth } from '../../contexts/authContext';

const Menu = ({ setFileUploadOpen, setFolderCreatorOpen, setSettingsOpen, path }) => {
  const { userData } = useAuth();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h2>Files</h2>
      </div>
      <div className="mr-48 flex items-center justify-between gap-6">
        {path.length > 0 && (
          <>
            <h6 className="text-md rounded-md border border-yellow-500  px-4 py-2 font-bold text-yellow-600	" onClick={() => setFileUploadOpen(true)}>
              <Icon name="cloud upload" /> Upload Files
            </h6>
            <h6 className="text-md rounded-md border  border-lime-500 px-4 py-2 font-bold text-lime-600	" onClick={() => setFolderCreatorOpen(true)}>
              <Icon name="plus circle" />
              Create Folder
            </h6>
          </>
        )}

        {userData?.role === 'manager' && (
          <h6 className="text-md rounded-md border border-green-500  px-4 py-2 font-bold text-green-600" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" />
            File Settings
          </h6>
        )}
      </div>
    </div>
  );
};

export default Menu;
