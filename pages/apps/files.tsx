import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFolderOpen,
  faFileVideo,
  faFileImage,
  faAngleLeft,
  faAngleRight,
  faFolderPlus,
  faCamera,
  faArrowUpFromBracket,
  faPause,
  faPlay,
  faBan
} from '@fortawesome/free-solid-svg-icons';

const API_ENDPOINT = 'http://localhost:3000/upload';

const FILE_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  PAUSED: 'paused',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

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

  //Start Test Data
  const shootsData = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' }
  ];

  const filesData = {
    'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd': {
      'type': 'directory',
      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/',
      'items': {
        '2nd Jul 2023': {
          'type': 'directory',
          'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/',
          'items': {
            'Photo': {
              'type': 'directory',
              'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Photo/',
              'items': {
                'Raw': {
                  'type': 'directory',
                  'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Photo/Raw/',
                  'items': {
                    '1433db38-f906-40bc-abb3-30d98cab802e.jpg': {
                      'type': 'file',
                      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Photo/Raw/1433db38-f906-40bc-abb3-30d98cab802e.jpg/'
                    }
                  }
                }
              }
            },
            'Video': {
              'type': 'directory',
              'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/',
              'items': {
                'Edited': {
                  'type': 'directory',
                  'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Edited/',
                  'items': {
                    'ae3db718-cf13-4bf0-8767-326b7f9a66cb.mp4': {
                      'type': 'file',
                      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Edited/ae3db718-cf13-4bf0-8767-326b7f9a66cb.mp4/'
                    },
                    'f0ca86b1-f7db-49e9-b641-fc99e542c4e4.mp4': {
                      'type': 'file',
                      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Edited/f0ca86b1-f7db-49e9-b641-fc99e542c4e4.mp4/'
                    },
                    'f7b09cc6-da04-459b-97dc-377f547c3952.mp4': {
                      'type': 'file',
                      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Edited/f7b09cc6-da04-459b-97dc-377f547c3952.mp4/'
                    }
                  }
                },
                'Raw': {
                  'type': 'directory',
                  'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Raw/',
                  'items': {
                    '26a30337-a1af-4a30-8f90-c8f733945f3a.mp4': {
                      'type': 'file',
                      'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/2nd Jul 2023/Video/Raw/26a30337-a1af-4a30-8f90-c8f733945f3a.mp4/'
                    }
                  }
                }
              }
            }
          }
        },
        'TEST': {
          'type': 'directory',
          'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/TEST/',
          'items': {
            '': {
              'type': 'file',
              'path': 'Anindo\'s Marriage Ceremony - 64f6c4f8afff69753e19e1bd/TEST//'
            }
          }
        }
      }
    }
  };
//End Test Data

  const [selectedShoot, setSelectedShoot] = useState(null);
  const [selectedShootDate, setSelectedShootDate] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState('Photo');
  const [selectedFileType, setSelectedFileType] = useState('Raw');
  const [isFileSelectButtonDisabled, setIsFileSelectButtonDisabled] = useState(false);

  const [currentFileData, setCurrentFileData] = useState(filesData);
  const [currentPath, setCurrentPath] = useState('');

  const renderFileOrFolder = (name: string, type: string, path: any) => {

    // Truncate name if it is too long
    const truncatedName = name.length > 25 ? name.substring(0, 22) + '...' : name;

    // Define a function to handle double click
    const handleDoubleClick = () => {
      setCurrentFileData(currentFileData[name].items);
      setCurrentPath(currentFileData[name].path);
    };

    if (type === 'directory') {
      return (
        <div title={name} className='flex flex-col w-min items-start' onDoubleClick={handleDoubleClick}>
          <FontAwesomeIcon icon={faFolder} size='5x' color='#C5965C' className='cursor-pointer' />
          <div
            className='flex justify-center w-full whitespace-no-wrap overflow-hidden overflow-ellipsis font-semibold'>
            <span className='break-all text-center'>{truncatedName}</span>
          </div>
        </div>
      );
    } else if (type === 'file') {
      // Assuming you have access to the file name
      return (
        <div title={name} className='flex flex-col w-min items-start' onDoubleClick={handleDoubleClick}>
          <FontAwesomeIcon icon={faFileVideo} size='5x' color='#333434' className='cursor-pointer' />
          <div
            className='flex justify-center w-full whitespace-no-wrap overflow-hidden overflow-ellipsis font-semibold'>
            <span className='break-all text-center'>{truncatedName}</span>
          </div>
        </div>
      );
    }
  };

  const renderPathBreadcrumb = (currentPath: string) => {

    // Split the path into individual parts
    const pathParts = currentPath.split('/');

    // Initialize an array to hold the breadcrumb elements
    const breadcrumbs = [];

    // Iterate through the path parts to create breadcrumb elements
    let currentFullPath = '';

    for (let i = 0; i < pathParts.length; i++) {

      const pathPart = pathParts[i];
      currentFullPath += pathPart;

      if (pathPart !== '') {
        // Create a breadcrumb element for the current path part
        breadcrumbs.push(
          <li key={currentFullPath}>
            <button
              className={`hover:text-gray-500/70 dark:hover:text-white-dark/70 ${i === pathParts.length ? 'font-extrabold' : ''}`}>
              &nbsp;{pathPart}
            </button>
          </li>
        );
      }

      // Add a separator (slash) between breadcrumb elements
      if (i < pathParts.length - 1) {
        breadcrumbs.push(
          <li key={`separator-${currentFullPath}`} className="before:px-1.5 before:content-['/']"></li>
        );
      }

    }

    return (
      <ol className='flex items-center font-semibold text-gray-500 dark:text-white-dark'>
        <li>
          <button className='hover:text-gray-500/70 dark:hover:text-white-dark/70'>
            <FontAwesomeIcon icon={faCamera} /> /
          </button>
        </li>
        {breadcrumbs}
      </ol>
    );
  };


  useEffect(() => {
    // Check if shoot date is selected
    if (selectedShootDate) {
      setIsFileSelectButtonDisabled(false);
    } else {
      setIsFileSelectButtonDisabled(true);
    }

  }, [selectedShootDate]);

  const handleShootChange = (selectedOption) => {
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

  /*Start file upload functions*/

  const API_ENDPOINT = 'http://localhost:5000/v1/files/upload';

  const ENDPOINTS = {
    UPLOAD: {
      URL: API_ENDPOINT,
      METHOD: 'PUT'
    },
    UPLOAD_STATUS: {
      URL: API_ENDPOINT,
      METHOD: 'GET'
    },
    UPLOAD_REQUEST: {
      URL: API_ENDPOINT,
      METHOD: 'POST'
    },
    UPLOAD_CANCEL: {
      URL: API_ENDPOINT,
      METHOD: 'DELETE'
    }
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesMap, setSelectedFilesMap] = useState(new Map());
  const [fileUploadRequestsMap, setFileUploadRequestMap] = useState(new WeakMap());

  useEffect(() => {

    selectedFiles.forEach((file) => {

      // Create a map to store file upload data
      const fileMapData = {
        size: file.size,
        status: FILE_STATUS.PENDING,
        progress: 0,
        uploadedChunks: 0
      };

      // Add file upload data to the map
      setSelectedFilesMap((prev) => prev.set(file, fileMapData));
    });

  }, [selectedFiles]);

  const requestFileUpload = (file: object) => {
    return fetch(ENDPOINTS.UPLOAD_REQUEST.URL, {
      method: ENDPOINTS.UPLOAD_REQUEST.METHOD,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,
        fileExt: file.name.substring(file.name.lastIndexOf('.'))
      })
    }).then(response => response.json())
      .then(response => {
        setFileUploadRequestMap((prev) => prev.set(file, {
          request: null,
          options: response
        }));
        //uploadFileChunk(file, options);
      })
      .catch(error => {
        console.error(error);
      });
  };


  const retryFileUpload = async (file: object) => {
    console.log(file.name);
  };

  const pauseFileUpload = (file: object) => {
    console.log(file.name);
  };

  const resumeFileUpload = async (file: object) => {
    console.log(file.name);
  };

  const cancelFileUpload = async (file: object) => {
    console.log(file.name);
  };

  const bytesToMegaBytes = (bytes: number) => {
    const megabytes = bytes / 1024 / 1024;
    return megabytes.toFixed(2);
  };

  const fileUploadElements = selectedFiles.map((file) => {

    // Get file upload data from the map
    let fileUploadData = selectedFilesMap.get(file);

    return (
      <div key={file.name} className='fileUploadElement'>
        {/* Existing code for file name and progress bar */}
        <div
          className='flex flex-wrap flex-col justify-between align-center bg-white p-3 gap-3 rounded-2 shadow-sm mb-3'>
          <div className='flex flex-col'>
            <div className='flex justify-between'>
              <span className='font-semibold'>{file?.name}</span>
              <span className='text-sm text-gray-500'>{fileUploadData.progress}%</span>
            </div>
            <div className='mt-2 h-2 bg-gray-200'>
              <div className='h-full bg-green-500 bg-success' style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className='flex flex-wrap justify-between align-center'>
            <div className='flex justify-center flex-col'>
              <span
                className='font-thin'>{bytesToMegaBytes(fileUploadData.uploadedChunks)} MB / {bytesToMegaBytes(file.size)} MB</span>
            </div>
            <div className='flex flex-wrap items-center space-x-1'>

              <button
                title='Retry Upload' onClick={() => retryFileUpload(file)}
                className='btn btn-success actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
              >
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
              </button>
              <button
                title='Pause Upload' onClick={() => pauseFileUpload(file)}
                className='btn btn-warning actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
              >
                <FontAwesomeIcon icon={faPause} />
              </button>
              <button
                title='Resume Upload' onClick={() => resumeFileUpload(file)}
                className='btn btn-primary actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                title='Cancel Upload' onClick={() => cancelFileUpload(file)}
                className='btn btn-danger actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
              >
                <FontAwesomeIcon icon={faBan} />
                <i className='fa-solid fa-ban'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const onFileInputChange = (event: { target: { files: any; value: any; }; }) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
    event.target.value = ''; // Reset File Input
  };

  //End file upload functions

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
                        <FontAwesomeIcon icon={faFolderOpen} />
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
                    <div className='flex flex-col flex-wrap items-center justify-between md:flex-row xl:w-auto'>
                      {renderPathBreadcrumb(currentPath)}
                      <div className='flex-1 md:flex-auto'>
                        <div className='flex items-center justify-center md:justify-end'>
                          <button type='button' title='Create Folder'
                                  className='rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30'>
                            <FontAwesomeIcon icon={faFolderPlus} color='#2196f3' size='lg' className='cursor-pointer' />
                          </button>
                          <button type='button'
                                  className='rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30'>
                            <FontAwesomeIcon icon={faAngleLeft} className='cursor-pointer' />
                          </button>
                          <button type='button'
                                  className='rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30'>
                            <FontAwesomeIcon icon={faAngleRight} className='cursor-pointer' />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-6 flex-wrap justify-normal mt-5'>

                      {Object.keys(currentFileData).map((itemKey) => {
                        const item = currentFileData[itemKey];
                        return (
                          <Fragment key={itemKey}>
                            {renderFileOrFolder(itemKey, item.type || 'directory', item.path)}
                          </Fragment>
                        );
                      })}
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
