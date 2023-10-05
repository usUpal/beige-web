import { Dialog, Transition, Tab } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faCamera,
  faFileVideo,
  faFolder,
  faFolderPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Fragment, useState } from 'react';
import Select from 'react-select';

const FileBrowser = (props: { shootsData: object; }) => {

  const { shootsData } = props;
  //const endPoint = 'http://localhost:5000/v1/';
  const endPoint = 'https://api.beigecorporation.io/v1/';

  const [currentFileData, setCurrentFileData] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [shootSelected, setShootSelected] = useState(false);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [fileDetailsModal, setFileDetailsModal] = useState(false);

  const fetchFileData = async (shootId: string) => {
    const path = shootId + '/';
    setCurrentPath(path);
    setIsFilesLoading(true);
    const fetchErrorMessage = 'An error occurred while fetching shoot data';
    try {
      const response = await fetch(
        `${endPoint}files/directory?target_path=${encodeURIComponent(path)}`
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentFileData(data[shootId].items);
        setIsFilesLoading(false);
      } else {
        toast.error(fetchErrorMessage, {
          position: toast.POSITION.TOP_RIGHT
        });
        setIsFilesLoading(false);

      }
    } catch (error) {
      toast.error(fetchErrorMessage, {
        position: toast.POSITION.TOP_RIGHT
      });
      setIsFilesLoading(false);

    }
  };

  const handleShootSelect = async (selectedOption: object) => {
    const shootId = selectedOption.value;
    if (shootId) {
      setShootSelected(true);
      await fetchFileData(shootId);
    }
  };

  const renderFileOrFolder = (name: string, type: string, path: any) => {

    // Truncate name if it is too long
    const truncatedName = name.length > 25 ? name.substring(0, 22) + '...' : name;

    // Function to handle directory double click
    const handleDirectoryClick = () => {
      setCurrentFileData(currentFileData[name].items);
      setCurrentPath(currentFileData[name].path.substring(1));
    };

    // Function to handle file double click
    const handleFileClick = () => {
      const filePath = '/' + currentPath + '/' + name;
      setFileDetailsModal(true);
      console.log(filePath);
    };

    if (type === 'directory') {
      return (
        <div title={name} className='flex flex-col w-min items-start' onDoubleClick={handleDirectoryClick}>
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
        <div title={name} className='flex flex-col w-min items-start' onDoubleClick={handleFileClick}>
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

  return (
    <div>
      <Transition appear show={fileDetailsModal} as={Fragment}>
        <Dialog as='div' open={fileDetailsModal} onClose={() => setFileDetailsModal(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0' />
          </Transition.Child>
          <div className='fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto'>
            <div className='flex items-start justify-center min-h-screen px-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel as='div'
                              className='panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark'>
                  <div className='flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3'>
                    <div className='text-lg font-bold'>Modal Title</div>
                    <button type='button' className='text-white-dark hover:text-dark' onClick={() => setModal1(false)}>
                      <svg>...</svg>
                    </button>
                  </div>
                  <div className='p-5'>
                    <p>
                      Mauris mi tellus, pharetra vel mattis sed, tempus ultrices eros. Phasellus egestas sit amet velit
                      sed luctus. Orci varius natoque
                      penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse potenti. Vivamus
                      ultrices sed urna ac pulvinar. Ut sit
                      amet ullamcorper mi.
                    </p>
                    <div className='flex justify-end items-center mt-8'>
                      <button type='button' className='btn btn-outline-danger' onClick={() => setModal1(false)}>
                        Discard
                      </button>
                      <button type='button' className='btn btn-primary ltr:ml-4 rtl:mr-4'
                              onClick={() => setModal1(false)}>
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
      <div className='pt-5'>
        <div className='flex flex-col flex-wrap items-center justify-between md:flex-row xl:w-auto'>
          {renderPathBreadcrumb(currentPath)}
          <div className='flex-1 md:flex-auto'>

            <div className='flex items-center justify-center md:justify-end gap-3'>
              <div className='w-48'>
                <Select options={shootsData} isSearchable={true} onChange={handleShootSelect} />
              </div>
              <button
                type='button'
                title='Create Folder'
                className={`rounded-md bg-[#f4f4f4] p-1 ${
                  shootSelected
                    ? 'enabled:hover:bg-primary-light'
                    : 'disabled cursor-not-allowed opacity-60'
                } dark:bg-white-dark/20 ${
                  shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                }`}
                disabled={!shootSelected}
              >
                <FontAwesomeIcon
                  icon={faFolderPlus}
                  color='#2196f3'
                  size='lg'
                  className='cursor-pointer'
                />
              </button>
              <button
                type='button'
                className={`rounded-md bg-[#f4f4f4] p-1 ${
                  shootSelected
                    ? 'enabled:hover:bg-primary-light'
                    : 'disabled cursor-not-allowed opacity-60'
                } dark:bg-white-dark/20 ${
                  shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                }`}
                disabled={!shootSelected}
              >
                <FontAwesomeIcon icon={faAngleLeft} className='cursor-pointer' />
              </button>
              <button
                type='button'
                className={`rounded-md bg-[#f4f4f4] p-1 ${
                  shootSelected
                    ? 'enabled:hover:bg-primary-light'
                    : 'disabled cursor-not-allowed opacity-60'
                } dark:bg-white-dark/20 ${
                  shootSelected ? 'enabled:dark:hover:bg-white-dark/30' : ''
                }`}
                disabled={!shootSelected}
              >
                <FontAwesomeIcon icon={faAngleRight} className='cursor-pointer' />
              </button>
            </div>
          </div>
        </div>

        {(currentFileData) && (
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
        )}

        {(!isFilesLoading && !currentFileData) && (
          <div className={`text-center mt-5`}>
            <span>Select a shoot to  browsing</span>
          </div>
        )}

        {isFilesLoading && (
          <div className={`mt-5`}>
            <div className='m-auto mb-5 h-4 w-4'>
              <span className='animate-ping inline-flex h-full w-full rounded-full bg-warning'></span>
            </div>
            <div className={`text-center`}>
              <span className={`animate-pulse`}>Loading order files</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default FileBrowser;
