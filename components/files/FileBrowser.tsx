import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCamera, faFileVideo, faFolder, faFolderPlus, faFileImage } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';
import { Fragment, useState } from 'react';
import Select from 'react-select';
import { API_ENDPOINT } from '@/config';
import FileInfo from '@/components/files/FileInfo';
interface SelectedOption {
    value: string;
    // other properties if there are any
}
const FileBrowser = (props: any) => {
    const { shootsData } = props;

    const [currentFileData, setCurrentFileData] = useState<any>({});
    const [currentPath, setCurrentPath] = useState('');
    const [shootSelected, setShootSelected] = useState(false);
    const [isFilesLoading, setIsFilesLoading] = useState(false);
    const [isNoContent, setIsNoContent] = useState(false);
    const [fileDetailsModal, setFileDetailsModal] = useState(false);
    const [fileInfoData, setFileInfoData] = useState(null);

    function getFileType(extension: string) {
        const supportedExtensions = [
            'jpg',
            'jpeg',
            'png',
            'tiff',
            'raw',
            'nef',
            'cr2',
            'arw',
            'orf',
            'dng',
            'bmp',
            'mp4',
            'mov',
            'avi',
            'mkv',
            'webm',
            'mpg',
            'mpeg',
            'wmv',
            'flv',
            'gif',
            'ogg',
            '3gp',
        ];

        // Convert the extension to lowercase for case-insensitive matching
        const lowercaseExtension = extension.toLowerCase();

        // Check if the extension is in the list of supported extensions
        if (supportedExtensions.includes(lowercaseExtension)) {
            // Check if it's a photo extension
            if (lowercaseExtension.match(/(jpg|jpeg|png|tiff|raw|nef|cr2|arw|orf|dng|bmp|gif)/)) {
                return 'photo';
            } else if (lowercaseExtension.match(/(mp4|mov|avi|mkv|webm|mpg|mpeg|wmv|flv|ogg|3gp)/)) {
                return 'video';
            }
        }
        return 'unknown';
    }

    const fetchFileData = async (shootId: string) => {
        const path = shootId + '/';
        setCurrentPath(path);
        setIsFilesLoading(true);
        const fetchErrorMessage = 'An error occurred while fetching shoot data';
        try {
            const response = await fetch(`${API_ENDPOINT}files/directory?target_path=${encodeURIComponent(path)}`);

            if (response.ok) {
                const data = await response.json();
                if (data[shootId]) {
                    setCurrentFileData(data[shootId].items);
                    setIsNoContent(false);
                } else {
                    setIsNoContent(true);
                }
                setIsFilesLoading(false);
            } else {
                toast.error(fetchErrorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsFilesLoading(false);
            }
        } catch (error) {
            // console.log(error);
            toast.error('error ' + fetchErrorMessage, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setIsFilesLoading(false);
        }
    };

    const handleShootSelect = async (selectedOption: SelectedOption | null) => {
        if (selectedOption) {
            const shootId = selectedOption.value;
            setShootSelected(true);
            await fetchFileData(shootId);
        }
    };

    const renderFileOrFolder = (name: any, itemObject: any) => {
        const { type, path } = itemObject;

        // Truncate name if it is too long
        const truncatedName = name.length > 25 ? name.substring(0, 22) + '...' : name;

        // Function to handle directory double click
        const handleDirectoryClick = () => {
            if (currentFileData) {
                setCurrentFileData(currentFileData[name].items);
                setCurrentPath(currentFileData[name].path.substring(1));
            }
        };

        // Function to handle file double click
        const handleFileClick = () => {
            const filePath = '/' + currentPath + '/' + name;
            setFileInfoData(itemObject);
            setFileDetailsModal(true);
            // console.log(itemObject);
        };

        if (type === 'directory') {
            return (
                <div title={name} className="flex w-min flex-col items-start" onDoubleClick={handleDirectoryClick}>
                    <FontAwesomeIcon icon={faFolder} size="5x" color="#ACA686" className="cursor-pointer" />
                    <div className="whitespace-no-wrap flex w-full justify-center overflow-hidden overflow-ellipsis font-semibold">
                        <span className="break-all text-center">{truncatedName}</span>
                    </div>
                </div>
            );
        } else if (type === 'file') {
            const fileName = itemObject?.metaData?.file_name;
            const fileType = getFileType(fileName.split('.').pop());

            const truncatedFileName = fileName.length > 25 ? fileName.substring(0, 22) + '...' : fileName;
            // Assuming you have access to the file name
            return (
                <div title={fileName} className="flex w-min flex-col items-start" onDoubleClick={handleFileClick}>
                    <FontAwesomeIcon icon={fileType === 'video' ? faFileVideo : faFileImage} size="5x" color="#333434" className="cursor-pointer" />
                    <div className="whitespace-no-wrap flex w-full justify-center overflow-hidden overflow-ellipsis font-semibold">
                        <span className="break-all text-center">{truncatedFileName}</span>
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
                        <button className={`hover:text-gray-500/70 dark:hover:text-white-dark/70 ${i === pathParts.length ? 'font-extrabold' : ''}`}>&nbsp;{pathPart}</button>
                    </li>
                );
            }

            // Add a separator (slash) between breadcrumb elements
            if (i < pathParts.length - 1) {
                breadcrumbs.push(<li key={`separator-${currentFullPath}`} className="before:px-1.5 before:content-['/']"></li>);
            }
        }

        return (
            <ol className="flex items-center font-semibold text-gray-500 dark:text-white-dark">
                <li>
                    <button className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <FontAwesomeIcon icon={faCamera} /> /
                    </button>
                </li>
                {breadcrumbs}
            </ol>
        );
    };

    return (
        <div className={`h-[70vh] overflow-y-auto`}>
            <FileInfo fileDetailsModal={fileDetailsModal} setFileDetailsModal={setFileDetailsModal} fileInfoData={fileInfoData} />
            <div className="pt-5">
                <div className="flex flex-col flex-wrap items-center justify-between md:flex-row xl:w-auto">
                    {renderPathBreadcrumb(currentPath)}
                    <div className="flex-1 md:flex-auto">
                        <div className="flex items-center justify-center gap-3 md:justify-end">
                            <div className="w-48">
                                <Select options={shootsData} isSearchable={true} onChange={handleShootSelect} />
                            </div>
                            <button
                                type="button"
                                title="Create Folder"
                                className={`rounded-md bg-[#f4f4f4] p-1 ${shootSelected ? 'enabled:hover:bg-primary-light' : 'disabled cursor-not-allowed opacity-60'} dark:bg-white-dark/20 ${
                                    shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                                }`}
                                disabled={!shootSelected}
                            >
                                <FontAwesomeIcon icon={faFolderPlus} color="#2196f3" size="lg" className="cursor-pointer" />
                            </button>
                            <button
                                type="button"
                                className={`rounded-md bg-[#f4f4f4] p-1 ${shootSelected ? 'enabled:hover:bg-primary-light' : 'disabled cursor-not-allowed opacity-60'} dark:bg-white-dark/20 ${
                                    shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                                }`}
                                disabled={!shootSelected}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} className="cursor-pointer" />
                            </button>
                            <button
                                type="button"
                                className={`rounded-md bg-[#f4f4f4] p-1 ${shootSelected ? 'enabled:hover:bg-primary-light' : 'disabled cursor-not-allowed opacity-60'} dark:bg-white-dark/20 ${
                                    shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                                }`}
                                disabled={!shootSelected}
                            >
                                <FontAwesomeIcon icon={faAngleRight} className="cursor-pointer" />
                            </button>
                        </div>
                    </div>
                </div>

                {currentFileData && !isNoContent && !isFilesLoading && (
                    <div className="mt-5 flex flex-wrap justify-normal gap-6">
                        {Object.keys(currentFileData).map((itemKey) => {
                            const item = currentFileData[itemKey];
                            return <Fragment key={itemKey}>{renderFileOrFolder(itemKey, item)}</Fragment>;
                        })}
                    </div>
                )}

                {!isFilesLoading && !currentFileData && !isNoContent && (
                    <div className={`mt-5 text-center`}>
                        <span>Select a shoot to browsing</span>
                    </div>
                )}

                {!isFilesLoading && isNoContent && (
                    <div className={`mt-5 text-center`}>
                        <span>No content found in this directory</span>
                    </div>
                )}

                {isFilesLoading && (
                    <div className={`mt-5`}>
                        <div className="m-auto mb-5 h-4 w-4">
                            <span className="inline-flex h-full w-full animate-ping rounded-full bg-warning"></span>
                        </div>
                        <div className={`text-center`}>
                            <span className={`animate-pulse`}>Loading shoot files</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default FileBrowser;
