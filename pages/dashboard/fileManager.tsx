import { useState } from 'react';
import FileExplorer from '../../FileManager/FileExplorer/FileExplorer';
import FileUploadModal from '../../FileManager/FileUploadModal/FileUploadModal';
import FolderCreationModal from '../../FileManager/FolderCreationModal/FolderCreationModal';
import SettingsModal from '../../FileManager/SettingsModal/SettingsModal';

const FileManager = () => {
  const [idToken, setIdToken] = useState('');
  const [profile, setProfile] = useState({});

  const [explorerPath, setExplorerPath] = useState(''); // Current file explorer path
  const [doRefresh, refreshExplorer] = useState(true);

  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [folderCreatorOpen, setFolderCreatorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="">
      <section className="">
        <FileExplorer
          setFileUploadOpen={setFileUploadOpen}
          setFolderCreatorOpen={setFolderCreatorOpen}
          setSettingsOpen={setSettingsOpen}
          idToken={idToken}
          profile={profile}
          setExplorerPath={setExplorerPath}
          doRefresh={doRefresh}
          didRefresh={() => refreshExplorer(false)}
        />
      </section>
      <FileUploadModal
        open={fileUploadOpen}
        closeModal={() => {
          setFileUploadOpen(false);
          refreshExplorer(true);
        }}
        path={explorerPath}
        onSuccess={() => {
          setFileUploadOpen(false);
          refreshExplorer(true);
        }}
      />
      <FolderCreationModal
        open={folderCreatorOpen}
        closeModal={() => setFolderCreatorOpen(false)}
        path={explorerPath}
        onSuccess={() => {
          setFolderCreatorOpen(false);
          refreshExplorer(true);
        }}
      />
      <SettingsModal open={settingsOpen} closeModal={() => setSettingsOpen(false)} />
    </div>
  );
};

export default FileManager;
