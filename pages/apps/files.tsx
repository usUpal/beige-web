import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Select from 'react-select';
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_ENDPOINT = 'http://localhost:3000/upload';

const FILE_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PAUSED: 'paused',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

const shootsData = [
  { value: 'orange', label: 'Orange' },
  { value: 'white', label: 'White' },
  { value: 'purple', label: 'Purple' }
];

const contentTypes = [
  { value: 'Photo', label: 'Photo' },
  { value: 'Video', label: 'Video' }
];

const fileTypes = [
  { value: 'Raw', label: 'Raw' },
  { value: 'Edited', label: 'Edited' }
];

const Files = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('File Manager'));
  });
  const [codeArr, setCodeArr] = useState<string[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  const [selectedShoot, setSelectedShoot] = useState(null);
  const [selectedShootDate, setSelectedShootDate] = useState('');
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [isFileSelectButtonDisabled, setIsFileSelectButtonDisabled] = useState(false);

  useEffect(() => {

    // Check if all required inputs have values
    if (selectedShoot && selectedShootDate && selectedContentType && selectedFileType) {

      setIsFileSelectButtonDisabled(false);
      console.log('Enable Button');
    } else {
      setIsFileSelectButtonDisabled(true);
      console.log('Disable Button');
    }

  }, [selectedShoot, selectedShootDate, selectedContentType, selectedFileType]);

  const handleShootChange = (selectedOption) => {
    console.log(selectedOption.value);
    setSelectedShoot(selectedOption.value);
  };

  const handleShootDateChange = (event) => {
    setSelectedShootDate(event.target.value);
  };

  const handleContentTypeChange = (selectedOption) => {
    setSelectedContentType(selectedOption.value);
  };

  const handleFileTypeChange = (selectedOption) => {
    setSelectedFileType(selectedOption.value);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});

  const onFileInputChange = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
    event.target.value = ''; // Reset File Input
  };

  const retryFileUpload = async (file) => {
    // Implement retry logic here
  };

  const pauseFileUpload = (file) => {
    // Implement pause logic here
  };

  const resumeFileUpload = async (file) => {
    // Implement resume logic here
  };

  const cancelFileUpload = async (file) => {
    // Implement cancel logic here
  };

  const fileUploadElements = selectedFiles.map((file) => {

    const fileStatus = fileStatuses[file.name] || FILE_STATUS.PENDING;

    return (
      <div key={file.name} className='fileUploadElement'>
        {/* Existing code for file name and progress bar */}
          <div
            className='flex flex-wrap flex-col justify-between align-center bg-white p-3 gap-3 rounded-2 shadow-sm mb-3'>
            <div className='flex flex-col'>
              <div className='flex justify-between'>
                <span className='font-semibold'>{file.name}</span>
                <span className='text-sm text-gray-500'>60%</span>
              </div>
              <div className='mt-2 h-2 bg-gray-200'>
                <div className='h-full bg-green-500 bg-success' style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className='flex flex-wrap justify-between align-center'>
              <div className='flex justify-center flex-col'>
                <span className='font-thin'>40 MB / {(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className='flex flex-wrap items-center space-x-1'>

                <button
                  title='Retry Upload'
                  className='btn btn-success actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                >
                  <i className='fa-solid fa-arrow-up-from-bracket'></i>
                </button>
                <button
                  title='Pause Upload'
                  className='btn btn-secondary actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                >
                  <i className='fa-solid fa-pause'></i>
                </button>
                <button
                  title='Resume Upload'
                  className='btn btn-primary actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                >
                  <i className='fa-solid fa-play'></i>
                </button>
                <button
                  title='Cancel Upload'
                  className='btn btn-danger actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                >
                  <i className='fa-solid fa-ban'></i>
                </button>
                <button
                  title='Delete File'
                  className='btn btn-danger actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                >
                  <i className='fa-solid fa-trash-can'></i>
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  });

  return (
    <div className='space-y-8 pt-5 w-full'>
      <div className='panel' id='pills'>
        <div className='mb-5'>
          {isMounted && (
            <Tab.Group>
              <Tab.List className='mt-3 flex flex-wrap'>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? 'bg-primary text-white !outline-none' : ''}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                    >
                      Upload
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${
                        selected ? 'bg-primary text-white !outline-none' : ''
                      } -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                    >
                      Browse
                    </button>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className='pt-5'>
                    <div
                      className='flex flex-col md:flex-row gap-4 items-center max-w-[900px] mx-auto'>
                      <div className='flex-1 w-full my-2'>
                        <label>Select Shoot</label>
                        <Select onChange={handleShootChange} defaultValue={shootsData[0]}
                                options={shootsData} isSearchable={true} />
                      </div>
                      <div className='flex-1 w-full'>
                        <label>Shoot Date</label>
                        <input onChange={handleShootDateChange} type='date'
                               className='form-input' />
                      </div>
                      <div className='flex-1 w-full'>
                        <label>Content Type</label>
                        <Select onChange={handleContentTypeChange}
                                defaultValue={contentTypes[0]} options={contentTypes}
                                isSearchable={true} />
                      </div>
                      <div className='flex-1 w-full'>
                        <label>File Type</label>
                        <Select onChange={handleFileTypeChange} defaultValue={fileTypes[0]}
                                options={fileTypes} isSearchable={true} />
                      </div>
                    </div>
                    <div className='active pt-5'>
                      <label className='btn btn-info w-48 btn-lg m-auto cursor-pointer'
                             disabled={isFileSelectButtonDisabled}>
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'
                             xmlns='http://www.w3.org/2000/svg'>

                          <path
                            d='M20.3116 12.6473L20.8293 10.7154C21.4335 8.46034 21.7356 7.3328 21.5081 6.35703C21.3285 5.58657 20.9244 4.88668 20.347 4.34587C19.6157 3.66095 18.4881 3.35883 16.2331 2.75458C13.978 2.15033 12.8504 1.84821 11.8747 2.07573C11.1042 2.25537 10.4043 2.65945 9.86351 3.23687C9.27709 3.86298 8.97128 4.77957 8.51621 6.44561C8.43979 6.7254 8.35915 7.02633 8.27227 7.35057L8.27222 7.35077L7.75458 9.28263C7.15033 11.5377 6.84821 12.6652 7.07573 13.641C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 10.0957 16.6392 12.3508 17.2435L12.3508 17.2435C14.3834 17.7881 15.4999 18.0873 16.415 17.9744C16.5152 17.9621 16.6129 17.9448 16.7092 17.9223C17.4796 17.7427 18.1795 17.3386 18.7203 16.7612C19.4052 16.0299 19.7074 14.9024 20.3116 12.6473Z'
                            stroke='currentColor' stroke-width='1.5'></path>
                          <path
                            d='M16.415 17.9741C16.2065 18.6126 15.8399 19.1902 15.347 19.6519C14.6157 20.3368 13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1495 6.87466 21.922C6.10421 21.7424 5.40432 21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7151C2.15033 12.46 1.84821 11.3325 2.07573 10.3567C2.25537 9.58627 2.65945 8.88638 3.23687 8.34557C3.96815 7.66065 5.09569 7.35853 7.35077 6.75428C7.77741 6.63996 8.16368 6.53646 8.51621 6.44531'
                            stroke='currentColor' stroke-width='1.5'></path>
                          <path d='M11.7769 10L16.6065 11.2941' stroke='currentColor'
                                stroke-width='1.5' stroke-linecap='round'></path>
                          <path d='M11 12.8975L13.8978 13.6739' stroke='currentColor'
                                stroke-width='1.5' stroke-linecap='round'></path>
                        </svg>
                        &nbsp;Select Files
                        <input type='file' className='hidden' multiple id='selectFileInput'
                               disabled={isFileSelectButtonDisabled} onChange={onFileInputChange} />
                      </label>
                      <div className='max-w-[900px] mx-auto'>
                        {fileUploadElements}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className='pt-5'>
                    <div className='flex gap-4 items-center max-w-[900px] mx-auto'>
                      <FontAwesomeIcon icon="fa-solid fa-folder" />
                      test
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
