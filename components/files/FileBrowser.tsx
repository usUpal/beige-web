import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faCamera,
  faFileVideo,
  faFolder,
  faFolderPlus
} from '@fortawesome/free-solid-svg-icons';
import { Fragment, useState } from 'react';

const FileBrowser = () => {

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


  return (
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
  );
};

export default FileBrowser;
