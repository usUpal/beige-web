import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faBan, faFolderOpen, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { API_ENDPOINT } from '@/config';
import FileBrowser from '@/components/files/FileBrowser';
import { toast } from 'react-toastify';

let userId: any;

if (typeof window !== 'undefined') {
    // Code using localStorage should only run on the client side
    userId = localStorage && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') as string).id;
    // Rest of your code
}

const FILE_STATUS = {
    PENDING: 'pending',
    UPLOADING: 'uploading',
    PAUSED: 'paused',
    UPLOADED: 'uploaded',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
};

const contentTypes = [
    { value: 'Photo', label: 'Photo' },
    { value: 'Video', label: 'Video' },
];

const fileTypes = [
    { value: 'Raw', label: 'Raw' },
    { value: 'Edited', label: 'Edited' },
];

const Files = () => {
    const dispatch = useDispatch();

    //Start theme functionality
    useEffect(() => {
        dispatch(setPageTitle('File Manager'));
    });

    const [codeArr, setCodeArr] = useState<string[]>([]);

    const [isMounted, setIsMounted] = useState<any>(false);
    useEffect(() => {
        setIsMounted(true);
    });
    //End theme functionality

    const [selectedShoot, setSelectedShoot] = useState<any>(null);
    const [shootsData, setShootsData] = useState<any>([]);
    const [selectedShootDate, setSelectedShootDate] = useState<any>(null);
    const [selectedContentType, setSelectedContentType] = useState<any>('Photo');
    const [selectedFileType, setSelectedFileType] = useState<any>('Raw');
    const [isFileSelectButtonDisabled, setIsFileSelectButtonDisabled] = useState<any>(false);

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
        const url = `${API_ENDPOINT}orders?sortBy=createdAt:desc&cp_id=${userId}&limit=5`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer <token>',
            },
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
                const formattedOrders = orderData.map((order: any) => ({
                    value: order?.id,
                    label: order?.order_name,
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

    const handleShootChange = (selectedOption: any) => {
        setSelectedShoot(selectedOption.value);
    };

    const handleShootDateChange = (event: any) => {
        setSelectedShootDate(event.target.value);
    };

    const handleContentTypeChange = (selectedOption: any) => {
        setSelectedContentType(selectedOption.value);
    };

    const handleFileTypeChange = (selectedOption: any) => {
        setSelectedFileType(selectedOption.value);
    };

    /*Start file upload functions*/
    const API_API_ENDPOINT = `${API_ENDPOINT}files/upload`;

    const API_ENDPOINTS = {
        UPLOAD: {
            URL: API_API_ENDPOINT,
            METHOD: 'PUT',
        },
        UPLOAD_STATUS: {
            URL: API_API_ENDPOINT,
            METHOD: 'GET',
        },
        UPLOAD_REQUEST: {
            URL: API_API_ENDPOINT,
            METHOD: 'POST',
        },
        UPLOAD_CANCEL: {
            URL: API_API_ENDPOINT,
            METHOD: 'DELETE',
        },
    };

    const [selectedFiles, setSelectedFiles] = useState<any>([]);
    const [selectedFilesMap, setSelectedFilesMap] = useState<any>(new Map());
    const [fileUploadRequestsMap, setFileUploadRequestMap] = useState<any>(new WeakMap());
    const [bytecount, setByteCount] = useState<any>(0);

    const updateFileMapData = (file: any, updatedData: any) => {
        setSelectedFilesMap((prev: any) => prev.set(file, { ...prev.get(file), ...updatedData }));
    };

    const updateFileRequestMapData = (file: any, updatedData: any) => {
        setFileUploadRequestMap((prev: any) => prev.set(file, { ...prev.get(file), ...updatedData }));
    };
    const requestFileUpload = async (file: any) => {
        // Create a map to store file upload data
        const fileMapData = {
            size: file.size,
            status: FILE_STATUS.PENDING,
            progress: 0,
            uploadedChunks: 0,
            fileObject: file,
        };

        // Add file upload data to the map
        // Add file upload data to the map
        updateFileMapData(file, fileMapData);

        try {
            const response = await fetch(API_ENDPOINTS.UPLOAD_REQUEST.URL, {
                method: API_ENDPOINTS.UPLOAD_REQUEST.METHOD,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileExt: file.name.substring(file.name.lastIndexOf('.')),
                    orderId: selectedShoot,
                    shootDate: selectedShootDate,
                    contentType: selectedContentType,
                    fileType: selectedFileType,
                }),
            });
            const initiatedFileData = await response.json();

            updateFileMapData(file, {
                id: initiatedFileData.id,
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

    const uploadFileChunk = (file: any, fileId: any, startingByte: any) => {
        const formData = new FormData();
        const request = new XMLHttpRequest();
        const fileChunk = file.slice(startingByte);

        formData.append('fileId', fileId);
        formData.append('file', fileChunk);

        request.open(API_ENDPOINTS.UPLOAD.METHOD, API_ENDPOINTS.UPLOAD.URL, true);
        request.setRequestHeader('Content-Range', `bytes ${startingByte}-${startingByte + fileChunk.size}/${file.size}`);
        request.setRequestHeader('X-File-Id', fileId);

        request.onload = () => {
            if (request.status === 200) {
                updateFileMapData(file, {
                    status: FILE_STATUS.UPLOADED,
                });
            } else {
                updateFileMapData(file, {
                    status: FILE_STATUS.FAILED,
                });
            }
            setByteCount(Math.floor(Math.random() * 1000000));
        };

        request.ontimeout = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.FAILED,
            });
            setByteCount(Math.floor(Math.random() * 1000000));
        };

        request.onabort = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.PAUSED,
            });
            setByteCount(Math.floor(Math.random() * 1000000));
        };

        request.onerror = () => {
            updateFileMapData(file, {
                status: FILE_STATUS.FAILED,
            });
            setByteCount(Math.floor(Math.random() * 1000000));
        };

        request.upload.onprogress = (event) => {
            setByteCount(Math.floor(Math.random() * 1000000));

            const byteLoaded = startingByte + event.loaded;

            // Ensure that byteLoaded does not exceed the file size
            const loadedBytes = Math.min(byteLoaded, file.size);

            // Calculate progress based on loadedBytes and file size
            const progress = Math.round((loadedBytes / file.size) * 100);

            // Add file upload data to the map
            updateFileMapData(file, {
                status: FILE_STATUS.UPLOADING,
                progress,
                uploadedChunks: loadedBytes,
            });
        };

        updateFileRequestMapData(file, {
            request: request,
        });

        request.send(formData);
    };

    // Get uploaded file size
    const getUploadedFileInfo = async (file: any) => {
        const fileId = selectedFilesMap.get(file).id;
        console.log(fileId);
        try {
            const fileInfo = await fetch(`${API_ENDPOINTS.UPLOAD_STATUS.URL}?fileId=${fileId}`);
            return await fileInfo.json();
        } catch (error) {
            return 0;
        }
    };

    const pauseFileUpload = (file: object) => {
        const fileRequest = fileUploadRequestsMap.get(file);
        if (fileRequest && fileRequest.request) {
            fileRequest.request.abort();
            return true;
        }
        return false;
    };

    const resumeFileUpload = async (file: object) => {
        const uploadedFileInfo = await getUploadedFileInfo(file);
        const uploadedFileSize = uploadedFileInfo.size;

        if (!uploadedFileSize || uploadedFileSize === 0) {
            alert('Cannot resume file upload');
        } else {
            uploadFileChunk(file, uploadedFileInfo.id, uploadedFileSize);
        }
    };

    const retryFileUpload = async (file: object) => {
        const uploadedFileInfo = await getUploadedFileInfo(file);
        const uploadedFileSize = uploadedFileInfo.size;
        if (!uploadedFileSize) {
            toast.error('Cannot retry file upload! Please try again', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        uploadFileChunk(file, uploadedFileInfo.id, uploadedFileSize);
    };

    const cancelFileUpload = async (file: object) => {
        if (pauseFileUpload(file)) {
            updateFileMapData(file, {
                status: FILE_STATUS.CANCELLED,
            });
        }
        fileUploadRequestsMap.delete(file);
        selectedFilesMap.delete(file);
    };

    /**
     * Converts bytes to kilobytes.
     *
     * @param {number} bytes - The number of bytes to convert.
     * @returns {number} - The equivalent size in kilobytes.
     */
    const bytesToKilobytes = (bytes: any) => {
        const kilobytes = bytes / 1024;
        return Math.round(kilobytes);
    };

    const fileUploadElements = selectedFiles.map((file: any) => {
        let status = selectedFilesMap.get(file)?.status;

        return (
            status !== 'cancelled' && (
                <div key={file.name} className="fileUploadElement">
                    {status}
                    <div className="align-center rounded-2 mb-3 flex flex-col flex-wrap justify-between gap-3 bg-white p-3 shadow-sm">
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="font-semibold">{file?.name}</span>
                                <span className="text-sm text-gray-500">{selectedFilesMap.get(file)?.progress}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-gray-200">
                                <div className="h-full bg-green-500 bg-success" style={{ width: `${selectedFilesMap.get(file)?.progress}%` }}></div>
                            </div>
                        </div>
                        <div className="align-center flex flex-wrap justify-between">
                            <div className="flex flex-col justify-center">
                                <span className="font-thin">
                                    {bytesToKilobytes(selectedFilesMap.get(file)?.uploadedChunks)} KB / {bytesToKilobytes(file?.size)} KB
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center space-x-1">
                                {selectedFilesMap.get(file)?.status === FILE_STATUS.UPLOADING && (
                                    <>
                                        <button
                                            title="Pause Upload"
                                            onClick={() => pauseFileUpload(file)}
                                            className="btn btn-warning actionBtn flex h-8 w-8 items-center justify-center rounded-full p-0"
                                        >
                                            <FontAwesomeIcon icon={faPause} />
                                        </button>
                                        <button
                                            title="Cancel Upload"
                                            onClick={() => cancelFileUpload(file)}
                                            className="btn btn-danger actionBtn flex h-8 w-8 items-center justify-center rounded-full p-0"
                                        >
                                            <FontAwesomeIcon icon={faBan} />
                                            <i className="fa-solid fa-ban"></i>
                                        </button>
                                    </>
                                )}
                                {selectedFilesMap.get(file)?.status === FILE_STATUS.PAUSED && (
                                    <button
                                        title="Resume Upload"
                                        onClick={() => resumeFileUpload(file)}
                                        className="btn btn-primary actionBtn flex h-8 w-8 items-center justify-center rounded-full p-0"
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                    </button>
                                )}
                                {selectedFilesMap.get(file)?.status === FILE_STATUS.FAILED && (
                                    <button title="Retry Upload" onClick={() => retryFileUpload(file)} className="btn btn-success actionBtn flex h-8 w-8 items-center justify-center rounded-full p-0">
                                        <FontAwesomeIcon icon={faArrowUpFromBracket} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
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
        event.target.value = '';
    };

    //End file upload functions

    return (
        <div className="w-full space-y-8 pt-5">
            <div className="panel" id="pills">
                <div className="mb-5">
                    {isMounted && (
                        <Tab.Group>
                            <Tab.List className="mt-3 flex flex-wrap">
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
                                    <div className="pt-5">
                                        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 md:flex-row">
                                            <div className="my-2 w-full flex-1">
                                                <label>Select Shoot</label>
                                                <Select onChange={handleShootChange} defaultValue={shootsData[0]} options={shootsData} isSearchable={true} />
                                            </div>
                                            <div className="w-full flex-1">
                                                <label>Shoot Date</label>
                                                <input onChange={handleShootDateChange} type="date" className="form-input" />
                                            </div>
                                            <div className="w-full flex-1">
                                                <label>Content Type</label>
                                                <Select onChange={handleContentTypeChange} defaultValue={contentTypes[0]} options={contentTypes} isSearchable={true} />
                                            </div>
                                            <div className="w-full flex-1">
                                                <label>File Type</label>
                                                <Select onChange={handleFileTypeChange} defaultValue={fileTypes[0]} options={fileTypes} isSearchable={true} />
                                            </div>
                                        </div>
                                        {/*  */}

                                        <div className={`active pt-5 ${isFileSelectButtonDisabled ? 'disabled' : ''}`}>
                                            {isFileSelectButtonDisabled ? (
                                                <div className="bg-slate-300 btn-lg m-auto w-48 rounded-lg text-slate-400 text-center">
                                                    <FontAwesomeIcon icon={faFolderOpen} />
                                                    &nbsp;Select Files
                                                </div>
                                            ) : (
                                                <label className="btn btn-info btn-lg m-auto w-48 cursor-pointer">
                                                    <FontAwesomeIcon icon={faFolderOpen} />
                                                    &nbsp;Select Files
                                                    <input type="file" className="hidden" multiple id="selectFileInput" accept={getAcceptAttribute()} onChange={onFileInputChange} />
                                                </label>
                                            )}
                                            <div className="mx-auto max-w-[900px]">{fileUploadElements}</div>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <FileBrowser shootsData={shootsData} />
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
