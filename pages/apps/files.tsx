import {Tab} from '@headlessui/react';
import {Fragment, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setPageTitle} from '@/store/themeConfigSlice';
import Select from 'react-select';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpFromBracket, faBan, faFolderOpen, faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import FileBrowser from '@/components/files/FileBrowser';

let userId: any;
if (typeof window !== 'undefined') {
    // Code using localStorage should only run on the client side
    userId = localStorage && (localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') as string).id);
    // Rest of your code
}

const FILE_STATUS = {
    PENDING: 'pending',
    UPLOADING: 'uploading',
    PAUSED: 'paused',
    UPLOADED: 'uploaded',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

const contentTypes = [
    {value: 'Photo', label: 'Photo'},
    {value: 'Video', label: 'Video'}
];

const fileTypes = [
    {value: 'Raw', label: 'Raw'},
    {value: 'Edited', label: 'Edited'}
];

const Files = () => {

    const dispatch = useDispatch();

    //Start theme functionality
    useEffect(() => {
        dispatch(setPageTitle('File Manager'));
    });

    const [codeArr, setCodeArr] = useState<string[]>([]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });
    //End theme functionality

    const [selectedShoot, setSelectedShoot] = useState(null);
    const [shootsData, setShootsData] = useState([]);
    const [selectedShootDate, setSelectedShootDate] = useState(null);
    const [selectedContentType, setSelectedContentType] = useState('Photo');
    const [selectedFileType, setSelectedFileType] = useState('Raw');
    const [isFileSelectButtonDisabled, setIsFileSelectButtonDisabled] = useState(false);

    // Define a function to construct the accept attribute based on state values
    const getAcceptAttribute = () => {
        // Determine the allowed file types based on selectedContentType and selectedFileType
        let allowedTypes = [];
        if (selectedContentType === 'Photo') {
            allowedTypes.push('image/*');
        } else if (selectedContentType === 'Video') {
            allowedTypes.push('video/*');
        }

        // If selectedFileType is 'Raw', allow raw image formats
        if (selectedFileType === 'Raw') {
            allowedTypes.push('.raw');
            allowedTypes.push('.nef'); // Add more raw formats as needed
        }

        // Combine the allowed types into a comma-separated string
        return allowedTypes.join(',');
    };

    const fetchOrdersForCP = () => {
        const url = `http://localhost:5000/v1/orders?sortBy=createdAt:desc&cp_id=${userId}&limit=5`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer <token>'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Extract the orders data from the response and format it for Select2
                const orderData = data.results;
                const formattedOrders = orderData.map((order) => ({
                    value: order?.id,
                    label: order?.order_name
                }));
                setShootsData(formattedOrders);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    };

    useEffect(() => {
        // Fetch orders for the specific cp_id when the component mounts
        fetchOrdersForCP();
    }, []);


    useEffect(() => {
        // Check if shoot date is selected
        if (selectedShootDate) {
            setIsFileSelectButtonDisabled(false);
        } else {
            setIsFileSelectButtonDisabled(true);
        }

    }, [selectedShootDate]);

    const handleShootChange = (selectedOption: object) => {
        setSelectedShoot(selectedOption.value);
    };

    const handleShootDateChange = (event: object) => {
        setSelectedShootDate(event.target.value);
    };

    const handleContentTypeChange = (selectedOption: object) => {
        setSelectedContentType(selectedOption.value);
    };

    const handleFileTypeChange = (selectedOption: object) => {
        setSelectedFileType(selectedOption.value);
    };

    /*Start file upload functions*/
    //const API_ENDPOINT = 'http://localhost:5000/v1/files/upload';
    const API_ENDPOINT = 'https://api.beigecorporation.io/v1/files/upload';

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
    const [bytecount, setByteCount] = useState(0)

    const updateFileMapData = (file: any, updatedData: any) => {
        setSelectedFilesMap((prev) => prev.set(
            file,
            {...prev.get(file), ...updatedData}
        ));
    }

    const updateFileRequestMapData = (file: object, updatedData: any) => {
        setFileUploadRequestMap((prev) => prev.set(
            file,
            {...prev.get(file), ...updatedData}
        ));
    }
    const requestFileUpload = async (file: object) => {

        // Create a map to store file upload data
        const fileMapData = {
            size: file.size,
            status: FILE_STATUS.PENDING,
            progress: 0,
            uploadedChunks: 0,
            fileObject: file
        };

        // Add file upload data to the map
        updateFileMapData(file, fileMapData);

        try {
            const response = await fetch(ENDPOINTS.UPLOAD_REQUEST.URL, {
                method: ENDPOINTS.UPLOAD_REQUEST.METHOD,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileExt: file.name.substring(file.name.lastIndexOf('.')),
                    orderId: selectedShoot,
                    shootDate: selectedShootDate,
                    contentType: selectedContentType,
                    fileType: selectedFileType
                })
            });
            const initiatedFileData = await response.json();

            updateFileMapData(file, {
                id: initiatedFileData.id
            });

            updateFileRequestMapData(file, {
                request: null,
                options: initiatedFileData,
            });

            uploadFileChunk(file, initiatedFileData.id, initiatedFileData.size);
        } catch (error) {
            console.error(error);
        }
    };

    const uploadFileChunk = (file: object, fileId: string | Blob, startingByte: any) => {

        const formData = new FormData();
        const request = new XMLHttpRequest();
        const fileChunk = file.slice(startingByte);

        formData.append('fileId', fileId);
        formData.append('file', fileChunk);

        request.open(ENDPOINTS.UPLOAD.METHOD, ENDPOINTS.UPLOAD.URL, true);
        request.setRequestHeader('Content-Range',
            `bytes ${startingByte}-${startingByte + fileChunk.size}/${file.size}`);
        request.setRequestHeader('X-File-Id', fileId);

        request.onload = () => {
            if (request.status === 200) {
                updateFileMapData(file, {
                    status: FILE_STATUS.UPLOADED
                });
            } else {
                updateFileMapData(file, {
                    status: FILE_STATUS.FAILED
                });
            }
        }

        request.ontimeout = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.FAILED
            });
        }

        request.onabort = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.PAUSED
            });
            setByteCount(5)
        }

        request.onerror = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.FAILED
            });
        }

        request.upload.onprogress = (event) => {
            const byteLoaded = startingByte + event.loaded;
            setByteCount(byteLoaded)

            // Add file upload data to the map
            updateFileMapData(file, {
                status: FILE_STATUS.UPLOADING,
                progress: Math.round((byteLoaded / file.size) * 100),
                uploadedChunks: byteLoaded
            });
        }

        updateFileRequestMapData(file, {
            request: request
        });

        request.send(formData);

    }


    const retryFileUpload = async (file: object) => {
        console.log(file.name);
    };

    const pauseFileUpload = (file: object) => {
        const fileRequest = fileUploadRequestsMap.get(file);
        if (fileRequest && fileRequest.request) {
            fileRequest.request.abort();
            return true;
        }
        return false;
    };

    // Get uploaded file size
    const getUploadedFileInfo = async (file: any) => {
        const fileId = selectedFilesMap.get(file).id;
        console.log(fileId);
        try {
            const fileInfo = await fetch(
                `${ENDPOINTS.UPLOAD_STATUS.URL}?fileId=${fileId}`
            );
            return await fileInfo.json();
        } catch (error) {
            return 0;
        }
    }

    const resumeFileUpload = async (file: object) => {

        const uploadedFileInfo = await getUploadedFileInfo(file);
        console.log(uploadedFileInfo);
        const uploadedFileSize = uploadedFileInfo.size;

        if (!uploadedFileSize || uploadedFileSize === 0) {
            alert('Cannot resume file upload');
        } else {
            uploadFileChunk(file, uploadedFileInfo.id, uploadedFileSize);
        }
    }

    const cancelFileUpload = async (file: object) => {
        console.log(file.name);
    };

    const bytesToMegaBytes = (bytes: number) => {
        const megabytes = bytes / 1024 / 1024;
        return Math.round(megabytes);
    };

    const fileUploadElements = selectedFiles.map((file) => {

        let status = selectedFilesMap.get(file)?.status;

        return (
            <div key={file.name} className='fileUploadElement'>
                <div
                    className='flex flex-wrap flex-col justify-between align-center bg-white p-3 gap-3 rounded-2 shadow-sm mb-3'>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <span className='font-semibold'>{file?.name}</span>
                            <span className='text-sm text-gray-500'>{selectedFilesMap.get(file)?.progress}%</span>
                        </div>
                        <div className='mt-2 h-2 bg-gray-200'>
                            <div className='h-full bg-green-500 bg-success'
                                 style={{width: `${selectedFilesMap.get(file)?.progress}%`}}></div>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-between align-center'>
                        <div className='flex justify-center flex-col'>
                        <span className='font-thin'>
                            {bytesToMegaBytes(selectedFilesMap.get(file)?.uploadedChunks)} MB / {bytesToMegaBytes(file?.size)} MB
                        </span>
                        </div>
                        <div className='flex flex-wrap items-center space-x-1'>
                            {selectedFilesMap.get(file)?.status === FILE_STATUS.UPLOADING && (
                                <>
                                    <button
                                        title='Pause Upload' onClick={() => pauseFileUpload(file)}
                                        className='btn btn-warning actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                                    >
                                        <FontAwesomeIcon icon={faPause} />
                                    </button>
                                    <button
                                        title='Cancel Upload' onClick={() => cancelFileUpload(file)}
                                        className='btn btn-danger actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                                    >
                                        <FontAwesomeIcon icon={faBan} />
                                        <i className='fa-solid fa-ban'></i>
                                    </button>
                                </>
                            )}
                            {selectedFilesMap.get(file)?.status === FILE_STATUS.PAUSED && (
                                <button
                                    title='Resume Upload' onClick={() => resumeFileUpload(file)}
                                    className='btn btn-primary actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                                >
                                    <FontAwesomeIcon icon={faPlay} />
                                </button>
                            )}
                            {selectedFilesMap.get(file)?.status === FILE_STATUS.FAILED && (
                                <button
                                    title='Retry Upload' onClick={() => retryFileUpload(file)}
                                    className='btn btn-success actionBtn rounded-full flex items-center justify-center w-8 h-8 p-0'
                                >
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const onFileInputChange = (event: {
        target: {
            files: any;
            value: any;
        };
    }) => {
        const files = event.target.files;
        [...files].forEach(requestFileUpload);
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
                                    {({selected}) => (
                                        <button
                                            className={`${selected ? 'bg-primary text-white !outline-none' : ''}
                                                    ' -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2`}
                                        >
                                            Upload
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({selected}) => (
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
                                                        options={shootsData} isSearchable={true}/>
                                            </div>
                                            <div className='flex-1 w-full'>
                                                <label>Shoot Date</label>
                                                <input onChange={handleShootDateChange} type='date'
                                                       className='form-input'/>
                                            </div>
                                            <div className='flex-1 w-full'>
                                                <label>Content Type</label>
                                                <Select onChange={handleContentTypeChange}
                                                        defaultValue={contentTypes[0]} options={contentTypes}
                                                        isSearchable={true}/>
                                            </div>
                                            <div className='flex-1 w-full'>
                                                <label>File Type</label>
                                                <Select onChange={handleFileTypeChange} defaultValue={fileTypes[0]}
                                                        options={fileTypes} isSearchable={true}/>
                                            </div>
                                        </div>
                                        <div className='active pt-5'>
                                            <label className='btn btn-info w-48 btn-lg m-auto cursor-pointer'
                                                   disabled={isFileSelectButtonDisabled}>
                                                <FontAwesomeIcon icon={faFolderOpen}/>
                                                &nbsp;Select Files
                                                <input type='file' className='hidden' multiple id='selectFileInput'
                                                       disabled={isFileSelectButtonDisabled}
                                                       accept={getAcceptAttribute()}
                                                       onChange={onFileInputChange}/>
                                            </label>
                                            <div className='max-w-[900px] mx-auto'>
                                                {fileUploadElements}
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <FileBrowser/>
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
