
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/authContext';
import { swalToast } from '@/utils/Toast/SwalToast';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAllCp from '@/hooks/useAllCp';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ResponsivePagination from 'react-responsive-pagination';


const ShootDetails = () => {
  const [shootInfo, setShootInfo] = useState<ShootTypes | null>(null);
  const [metingDate, setMetingDate] = useState<string>('');
  const [statusData, setStatusDate] = useState<string>('');

  const [showNewMetingBox, setShowNewMetingBox] = useState<boolean>(false);
  const [showNewStatusBox, setShowNewStatusBox] = useState<boolean>(false);
  const router = useRouter();
  const shootId = router.query.shootDetails as string;
  const { userData } = useAuth();
  const [cpModal, setCpModal] = useState(false);
  const [allCpUsers, totalPagesCount, currentPage, setCurrentPage, getUserDetails] = useAllCp();
  const [cp_ids, setCp_ids] = useState([]);

  const allStatus = [
    {
      key: "pending",
      value: 'Pending'
    }, {
      key: 'pre_production',
      value: 'Pre Production'
    }, {
      key: 'production',
      value: 'Production'
    }, {
      key: 'post_production',
      value: 'Post Production'
    }, {
      key: 'revision',
      value: 'Revision'
    }, {
      key: 'completed',
      value: 'Completed'
    }, {
      key: 'cancelled',
      value: 'Cancelled'
    }, {
      key: 'in_dispute',
      value: 'In Dispute'
    }
  ]

  const orderStatusArray = [
    'Pending',
    'Pre_production',
    'Production',
    'Post_production',
    'Revision',
    'Completed',
  ];
  const rejectStatus = ['In_dispute', 'Cancelled'];

  // Convert order_status to lowercase for comparison
  const status = "Post_production";
  const lowerCaseOrderStatus = shootInfo?.order_status?.toLowerCase();
  const currentIndex = orderStatusArray.findIndex(
    status => status.toLowerCase() === lowerCaseOrderStatus,
  );
  const cancelIndex = rejectStatus.findIndex(
    status => status.toLowerCase() === lowerCaseOrderStatus,
  );


  const getShootDetails = async (shootId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusp}`);
      }
      const shootDetailsRes = await response.json();
      setShootInfo(shootDetailsRes);
    } catch (error) {
      console.error('Error fetching shoot details:', error);
    }
  };

  const submitNewMeting = async () => {
    if (!metingDate) {
      return swalToast('danger', 'Please select Meting Date & Time!');
    }

    try {
      const requestBody = {
        meeting_date_time: metingDate,
        meeting_status: 'pending',
        meeting_type: 'pre_production',
        order_id: shootId,
      };
      const response = await fetch(`${API_ENDPOINT}meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        swalToast('danger', 'Something went wrong !');
        throw new Error(`Error: ${response.statusp}`);
      }
      const updateShootDetails = await response.json();
      setMetingDate('')
      setShowNewMetingBox(false);
      getShootDetails(shootId);
      swalToast('success', 'Schedule Meeting Success!');
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  };

  const submitUpdateStatus = async () => {
    try {

      if (!statusData) {
        return swalToast('danger', 'Please select a status!');
      }

      const requestBody = {
        order_status: statusData,
      }

      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        swalToast('danger', 'something want wrong!');
        throw new Error(`Error: ${response.statusp}`);
      }

      const updateStatusDetails = await response.json();
      console.log('updateStatusDetails', updateStatusDetails);
      swalToast('success', 'Status Update Successfully!');
      setStatusDate('');
      setShowNewStatusBox(false);
      getShootDetails(shootId);
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  }

  useEffect(() => {
    if (shootId) {
      getShootDetails(shootId);
    }
  }, [shootId]);

  const getCps = () => {
    setCpModal(true);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectProducer = (cp: any) => {
    const newCp = {
      id: cp?.userId?.id,
      decision: 'accepted',
    };
    const isCpSelected = cp_ids.some((item: any) => item?.id === cp?.userId?.id);
    if (isCpSelected) {
      const updatedCps = cp_ids.filter((item: any) => item.id !== cp?.userId?.id);
      setCp_ids(updatedCps);
    } else {
      const updatedCps = [...cp_ids, newCp];
      setCp_ids(updatedCps);
    }
  };

  const updateCps = async () => {
    console.log("cp Ids : ", cp_ids)
    if (!cp_ids.length) {
      return swalToast('danger', 'Please select Cp !');
    }

    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cp_ids: cp_ids
        }),
      });
      if (!response.ok) {
        swalToast('danger', 'Something went wrong !');
        throw new Error(`Error: ${response.statusp}`);
      }
      const updateShootDetails = await response.json();
      setCp_ids([]);
      setCpModal(false);
      getShootDetails(shootId);
      swalToast('success', 'Assign CP Success!');
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  }

  return (
    <>
      <div className="p-5 sm:p-2">
        <div className='flex flex-col'>
          <div className="md:flex md:items-center md:justify-between md:mb-4">
            {/* Shoot Name */}
            <div className="basis-[45%] md:flex items-center mb-6 md:mb-0">
              <label htmlFor="reference" className="mt-2 mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                Shoot Name
              </label>
              <span className="font-sans capitalize text-black">{shootInfo?.order_name ?? ''}</span>
            </div>

            {/* Content Vertical */}
            <div className="basis-[45%] md:flex items-center mb-6 md:mb-0">
              <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                Content Vertical
              </label>
              <span className="font-sans capitalize text-black">{shootInfo?.content_vertical ?? ''}</span>
            </div>
          </div>

          <div className="md:flex items-center justify-between md:mb-4">
            {/* Budget */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 md:whitespace-nowrap">Budget</label>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                <>
                  <div className="mb-2">
                    <ul className="flex-row items-center ms-6 list-disc w-48 text-white-dark group">
                      {shootInfo?.budget?.min && (
                        <li className=''>
                          <span className="font-sans capitalize text-black">Min : ${shootInfo?.budget?.min ?? ''}</span>
                        </li>
                      )}

                      {shootInfo?.budget?.max && (
                        <li >
                          <span className="font-sans capitalize text-black">Max : ${shootInfo?.budget?.max ?? ''}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              </div>
            </div>
            {/* Location */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Location</label>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                <span className="font-sans capitalize text-black">{shootInfo?.location ?? ''}</span>
              </div>
            </div>
          </div>

          <div className="md:flex md:items-center md:justify-between md:mb-4">
            {/* Shoot Date & Time */}
            <div className="basis-[45%] md:flex items-center mb-6 md:mb-0">
              <label htmlFor="reference" className="mt-2 mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                Shoot Date & Time
              </label>
              {shootInfo?.shoot_datetimes && (
                <div className="flex-row">
                  {shootInfo?.shoot_datetimes?.map((time, key) => (
                    <div key={key} className='space-x-4'>
                      <span className="font-sans capitalize text-black">{new Date(time?.start_date_time).toDateString() ?? ''} </span>
                      <span className="font-sans capitalize text-black">{new Date(time?.end_date_time).toDateString() ?? ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Geo Location */}
            <div className="basis-[45%] md:flex items-center mb-6 md:mb-0">
              <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7298.405077158279!2d90.38216309560319!3d23.84694062734523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6a4cd8b5419%3A0x5ac8cf3c96294625!2sBaunia%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1723962056481!5m2!1sen!2sbd" loading="lazy"></iframe>
            </div>
          </div>

          <div className="md:flex items-center justify-between md:mb-4">
            {/* Shoot Cost */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Cost</label>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                <span className="font-sans capitalize text-black">${shootInfo?.shoot_cost ?? ''}</span>
              </div>
            </div>
            {/* Shoot Duration */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Duration</label>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                <span className="font-sans capitalize text-black">{shootInfo?.shoot_duration ?? ''} Hours</span>
              </div>
            </div>
          </div>

          <div className="md:flex items-center justify-between md:mb-4">
            {/* Payment Status */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2 space-x-3">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Payment Status</label>
              {shootInfo?.payment?.payment_status && (
                <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                  <span className="text-green-500 font-semibold bg-[#a8ff6e34] py-1 px-3 rounded-[25px]">
                    {shootInfo?.payment?.payment_status}
                  </span>
                </div>
              )}

            </div>
            {/* Description */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Description</label>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                <span className="font-sans capitalize text-black">{shootInfo?.description ?? ''}</span>
              </div>
            </div>
          </div>

          <div className="md:flex items-center justify-between md:mb-4">
            {/* Schedule Meeting */}
            <div className="flex-row basis-[45%] mb-4 space-y-5">
              <div className='flex space-x-3'>
                <button className='px-3 py-1 rounded-sm bg-black text-white font-semibold font-sans lg:w-44' onClick={() => setShowNewMetingBox(!showNewMetingBox)} >Schedule Meeting</button>
                {showNewMetingBox && (
                  <div className="flex space-x-2">
                    <input
                      id="start_date_time"
                      type="datetime-local"
                      onChange={(event) => setMetingDate(event.target.value)}
                      value={metingDate}
                      className="border border-black rounded-sm px-2 lg:w-[240px]"
                    />
                    <button
                      disabled={metingDate.length ? false : true}
                      onClick={submitNewMeting}
                      className="bg-black border border-black text-white rounded-sm px-1 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {userData?.role === 'manager' && (
                <div className='flex space-x-3'>
                  <button className='px-3 py-1 rounded-sm bg-black text-white font-semibold font-sans lg:w-44' onClick={() => setShowNewStatusBox(!showNewStatusBox)} >Change Status</button>
                  {showNewStatusBox && (
                    <div className="flex space-x-2">
                      <select name="" id="" onChange={(event) => setStatusDate(event?.target?.value)} className="border border-black lg:w-[240px] rounded-sm px-2">
                        {allStatus?.map((status, key) => (
                          <option key={key} value={status?.key}>{status?.value}</option>
                        ))}
                      </select>
                      <button
                        disabled={statusData.length ? false : true}
                        onClick={submitUpdateStatus}
                        className="bg-black border border-black text-white rounded-sm px-1 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assigned Cp's */}
            <div className="md:flex basis-[45%] mb-4 md:mb-2">
              <div className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 flex items-center gap-4">
                <div>Assigned Cp's</div>
                {userData?.role === 'manager' && (
                  <div className="">
                    <button
                      onClick={getCps}
                      type="button"
                      className="border-none p-0 pb-2 font-sans cursor-pointer text-indigo-500 md:me-0"
                    >
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}

              </div>
              <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                {shootInfo?.cp_ids?.length > 0 && (
                  <div className="overflow-y-auto max-h-[250px] overflow-x-hidden scrollbar">
                    <table className="table-auto w-full">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Name</th>
                          <th className="py-2 px-4 border-b">Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shootInfo?.cp_ids?.map((cp, key) => (
                          <tr key={key}>
                            <td className="py-2 px-4 border-b">{cp?._id ?? ''}</td>
                            <td className="py-2 px-4 border-b">{cp?.decision ?? ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto">
            <ul className="mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 sm:mt-16">
              {orderStatusArray.map((status, index) => (
                <li key={status} className="flex-start group relative flex lg:flex-col">
                  {index < currentIndex && (
                    <>
                      <span
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300  lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full  text-white border border-gray-300 bg-green-500 transition-all duration-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    </>
                  )}

                  {index === currentIndex && (
                    <>
                      <span
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 bg-green-500 transition-all duration-200 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                  {index > currentIndex && (
                    <>
                      <span
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 transition-all duration-200" />
                    </>
                  )}

                  <div className="ml-6 lg:ml-0 lg:mt-10">
                    <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">
                      {status}
                    </h3>
                    <h4 className="mt-2 text-base text-gray-700">
                      Use your own Notion databases or duplicate ours.
                    </h4>
                  </div>
                </li>
              ))}

              {rejectStatus.map((status, index) => (
                <div key={status}>
                  <li key={status} className="flex-start group relative flex lg:flex-col">
                    {index < cancelIndex && (
                      <>
                        <span
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200">
                          {status === 'Cancelled' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          ) : null}
                        </div>
                      </>
                    )}

                    {index === cancelIndex && (
                      <>
                        <span
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                          aria-hidden="true"
                        ></span>
                        <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 ${status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'} transition-all duration-200`}>
                          {status === 'Cancelled' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </div>
                      </>
                    )}

                    {index > cancelIndex && (
                      <>
                        <span
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 transition-all duration-200 " />
                      </>
                    )}

                    <div className="ml-6 lg:ml-0 lg:mt-10">
                      <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">
                        {status}
                      </h3>
                      <h4 className="mt-2 text-base text-gray-700">
                        Use your own Notion databases or duplicate ours.
                      </h4>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Transition appear show={cpModal} as={Fragment}>
        <Dialog as="div" open={cpModal} onClose={() => setCpModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center md:px-4 ">
              <Dialog.Panel as="div" className="panel my-24 w-4/6 space-x-6 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="my-2 flex items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                  <div className="ms-6 text-[22px] font-bold capitalize leading-none text-[#000000]">Assign CP's </div>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setCpModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>
                <div className="basis-[50%] p-5">
                  <div className="flex justify-end mb-2">
                    <input type="search" className='px-3 py-2 w-[20%] border border-black rounded-sm' placeholder='Search' />
                  </div>
                  <div className="grid grid-cols-3 gap-6 2xl:grid-cols-4">
                    {allCpUsers?.length !== 0 &&
                      allCpUsers?.map((cp) => {
                        const isSelected = cp_ids.some((item: any) => item?.id === cp?.userId?.id);
                        return (
                          <div key={cp?.userId?.id} className="border border-black rounded-sm p-3">
                            <div className="flex items-start justify-start">
                              <div className="media relative h-14 w-14 rounded-full">
                                <img src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`} className="mr-3 w-full h-full rounded-full object-cover" alt="img" />
                                <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                              </div>

                              <div className="content ms-2 min-h-[115px]">
                                <h4 className="font-sans text-[16px] capitalize leading-none text-black">{cp?.userId?.name}</h4>
                                <span className="profession text-[12px] capitalize leading-none text-[#838383]">{cp?.userId?.role === 'cp' && 'beige producer'}</span>
                                <div className="location mt-2 flex items-center justify-start">
                                  {/* Your location icon here */}
                                  <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">{cp?.city}</span>
                                </div>
                                <div className="ratings mt-2">
                                  {[...Array(5)].map((_, index) => (
                                    <FontAwesomeIcon key={index} icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex">
                              <Link href={`cp/${cp?.userId?.id}`}>
                                <p className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-sm bg-black px-3 py-2 font-sans capitalize leading-none text-white">
                                  view profile
                                </p>
                              </Link>
                              {/* ${isSelected ? 'border-[#eb5656] bg-white text-red-500' : 'border-[#C4C4C4] bg-white text-black'
                                  } */}
                              <p
                                onClick={() => handleSelectProducer(cp)}
                                className={`single-match-btn inline-block cursor-pointer rounded-sm ${isSelected ? 'bg-red-500' : 'bg-black'} px-3 py-2 font-sans capitalize leading-none text-white`}
                              >
                                {isSelected ? 'Remove' : 'Select'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className='flex justify-between'>
                    {/* pagination */}
                    <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
                    <button onClick={updateCps} className='rounded-sm bg-black text-white px-3 py-1 mt-5'>Submit</button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShootDetails;
