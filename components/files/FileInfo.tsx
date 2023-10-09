import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faHardDrive, faTimesCircle, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { API_ENDPOINT } from '@/config';
import { toast } from 'react-toastify';

const FileInfo = (props: {
  fileDetailsModal: boolean,
  setFileDetailsModal: any,
  fileInfoData: any
}) => {

  const { fileDetailsModal, setFileDetailsModal, fileInfoData } = props;
  const [gettingSignedURL, setGettingSignedURL] = useState(false);

  const getSignedURL = async () => {
    const fetchErrorMessage = 'An error occurred processing file download';
    try {
      const response = await fetch(
        `${API_ENDPOINT}files/url/${fileInfoData?.metaData?.file_id}`
      );
      if (response.ok) {
        const data = await response.json();
        const downloadUrl = data.download_url;

        // Create an anchor element for downloading
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = fileInfoData?.metaData?.file_name || 'file'; // Set the desired file name

        // Trigger a click event to start the download
        anchor.click();

        setGettingSignedURL(false);
      } else {
        toast.error(fetchErrorMessage, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (error) {
      toast.error(fetchErrorMessage, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleFileDownload = async () => {
    setGettingSignedURL(true);
    await getSignedURL();
  };

  return (
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
                <div className='flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3 h-12'>
                  <div className='text-md font-bold'>{fileInfoData?.metaData?.file_name}</div>
                  <button onClick={() => setFileDetailsModal(false)}><FontAwesomeIcon size='sm' icon={faTimesCircle} />
                  </button>
                </div>
                <div className='p-5'>
                  <div className={`flex justify-between items-center gap-3`}>
                    <div className='flex flex-column items-center gap-2 p-5 rounded-sm bg-amber-50 w-2/4'>
                      <FontAwesomeIcon icon={faHardDrive} size='3x' />
                      <div>
                        <p>{fileInfoData?.size}</p>
                        <span className='font-semibold'>File Size</span>
                      </div>
                    </div>
                    <div className='flex flex-column items-center gap-2 p-5 rounded-sm bg-amber-50 w-2/4'>
                      <FontAwesomeIcon icon={faSquareCheck} size='3x' />
                      <div>
                        <p>{fileInfoData?.metaData?.review_status}</p>
                        <span className='font-semibold text-gray-800'>Review Status</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-end items-center gap-2 mt-8'>
                    <button type='button' className='btn btn-danger'
                            title='Delete File'
                            onClick={() => setFileDetailsModal(false)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    <button type='button' className='btn btn-success'
                            title='Download File'
                            disabled={gettingSignedURL}
                            onClick={handleFileDownload}>
                      <FontAwesomeIcon icon={faDownload} bounce={gettingSignedURL} />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FileInfo;
