/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, Fragment, useMemo, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { API_ENDPOINT, MAPAPIKEY } from '@/config';
import { useAuth } from '@/contexts/authContext';
import { swalToast } from '@/utils/Toast/SwalToast';
import { toast } from 'react-toastify';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ResponsivePagination from 'react-responsive-pagination';
import GoogleMapReact from 'google-map-react';
import Loader from '@/components/SharedComponent/Loader';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import { useAssignCpMutation, useGetShootDetailsQuery, useUpdateStatusMutation } from '@/Redux/features/shoot/shootApi';
import { useGetAllCpQuery } from '@/Redux/features/user/userApi';
import { shootStatusMessage, allStatus } from '@/utils/shootUtils/shootDetails';
import { useNewMeetLinkMutation, useNewMeetingMutation } from '@/Redux/features/meeting/meetingApi';

const ShootDetails = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const shootId = router.query.shootDetails as string;
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cpModal, setCpModal] = useState<boolean>(false);
  const [cp_ids, setCp_ids] = useState<number[]>([]);
  const [statusBox, setStatusBox] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [metingDate, setMetingDate] = useState<string>('');
  const [meetingBox, setMeetingBox] = useState<boolean>(false);

  const { data, error: shootDetailsError, isLoading: isDetailsLoading, refetch } = useGetShootDetailsQuery(shootId, {
    refetchOnMountOrArgChange: true
  });
  const [updateStatus, { isLoading: isStatusLoading }] = useUpdateStatusMutation();
  const [assignCp, { isLoading: isAssignCpLoading }] = useAssignCpMutation();
  const [newMeetLink, { isLoading: isNewMeetLinkLoading }] = useNewMeetLinkMutation();
  const [newMeeting, { isLoading: isNewMeetingLoading }] = useNewMeetingMutation();
  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      search: query,
    }),
    [currentPage, query]
  );
  const { data: allCp, error: getCpError, isLoading: isGetCpLoading } = useGetAllCpQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  })

  const coordinates = data?.geo_location?.coordinates;
  const isLocationAvailable = coordinates && coordinates.length === 2;
  const orderStatusArray = ['Pending', 'Pre_production', 'Production', 'Post_production', 'Revision', 'Completed'];
  const rejectStatus = ['In_dispute', 'Cancelled'];
  const lowerCaseOrderStatus = data?.order_status?.toLowerCase();
  const currentIndex = orderStatusArray.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);
  const cancelIndex = rejectStatus.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);


  const submitNewMeting = async () => {
    if (!metingDate) {
      toast.error("Input a meeting date...!");
      return;
    }

    const requestBody: any = {
      userId: userData?.id,
      requestData: {
        summary: data?.order_name ? data?.order_name : 'Beige Meeting',
        location: 'Online',
        description: `Meeting to discuss ${data?.order_name ? data?.order_name : 'Beige'} order.`,
        startDateTime: metingDate,
        endDateTime: metingDate,
        orderId: shootId,
      }
    };

    const response = await newMeetLink(requestBody)
    if (response?.data) {
      const requestBody = {
        meeting_date_time: metingDate,
        meeting_status: 'pending',
        meeting_type: 'pre_production',
        order_id: shootId,
        meetLink: response?.data?.meetLink,
      };
      const result = await newMeeting(requestBody);
      if (result?.data) {
        setMeetingBox(false);
        toast.success('Meeting create success.');
      } else {
        console.log("Don't create the meeting");
        toast.error('Something want wrong...!');
      }
    } else {
      console.log("Don't create the meeting link");
      toast.error('Something want wrong...!');
    }
  };


  const handelUpdateStatus = async () => {
    if (!status) {
      return toast.error('Please select a status!');
    }

    const data = {
      order_status: status,
      id: shootId
    }

    const result = await updateStatus(data);

    if (result?.data) {
      refetch();
      toast.success('Shoot status updated');
    }
  };

  const handleSelectProducer = (cp: any) => {
    const newCp = {
      id: cp?.userId?._id,
      decision: 'accepted',
    };

    const isCpSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
    if (isCpSelected) {
      const updatedCps = cp_ids.filter((item: any) => item.id !== cp?.userId?._id);
      setCp_ids(updatedCps);
    } else {
      const updatedCps = [...cp_ids, newCp];
      setCp_ids(updatedCps);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const updateCps = async () => {
    if (!cp_ids.length) {
      toast.error('Please select Cp...!')
      return;
    }
    const data = {
      cp_ids: cp_ids,
      id: shootId
    }
    const result = await assignCp(data);
    if(result?.data){
      refetch();
      toast.success('Cp assigned success...!')
      setCpModal(false);
    }
  };

  const cancelCp = async (cp: any) => {
    if (!cp || !cp._id) {
      return swalToast('danger', 'Invalid CP data.');
    }

    console.log('cp._id', cp);

    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cp_ids: [
            {
              id: cp.id.id,
              decision: 'cancelled',
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        swalToast('danger', `Error: ${errorMessage}`);
        throw new Error(`Error: ${response.status}`);
      }

      // Optionally: Get updated shoot details from the server if needed
      const updatedShootDetails = await response.json();
      setCp_ids((prevCpIds) => prevCpIds.filter((cpItem) => cpItem._id !== cp._id));
      //getShootDetails(shootId);

      swalToast('success', 'CP cancelled successfully.');
    } catch (error) {
      console.error('Error occurred while sending PATCH request:', error);
    }
  };

  return (
    <>
      <div className="panel">
        <div className="p-5 sm:p-2">
          <div className="flex flex-col">
            <div className="md:mb-4 md:flex md:items-center md:justify-between">
              {/* Shoot Name */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="reference" className="mb-0 mt-2 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                  Shoot Name
                </label>
                <span className="font-sans capitalize text-black">{data?.order_name ?? ''}</span>
              </div>

              {/* Content Vertical */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                  Content Vertical
                </label>
                <span className="font-sans capitalize text-black">{data?.content_vertical ?? ''}</span>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Budget */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 md:whitespace-nowrap">Budget</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <>
                    <div className="mb-2">
                      <ul className="group ms-6 w-48 list-disc flex-row items-center text-white-dark">
                        {data?.budget?.min && (
                          <li className="">
                            <span className="font-sans capitalize text-black">Min : ${data?.budget?.min ?? ''}</span>
                          </li>
                        )}

                        {data?.budget?.max && (
                          <li>
                            <span className="font-sans capitalize text-black">Max : ${data?.budget?.max ?? ''}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                </div>
              </div>
              {/* Location */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Location</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">{data?.location ?? ''}</span>
                </div>
              </div>
            </div>

            <div className="md:mb-4 md:flex md:items-center md:justify-between">
              {/* Shoot Date & Time */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="reference" className="mb-0 mt-2 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                  Shoot Date & Time
                </label>
                {data?.shoot_datetimes && (
                  <div className="flex-row">
                    {data?.shoot_datetimes?.map((time: any, key: number) => (
                      <div key={key} className="space-x-4">
                        <span className="font-sans capitalize text-black">{new Date(time?.start_date_time).toDateString() ?? ''} </span>
                        <span className="font-sans capitalize text-black">{new Date(time?.end_date_time).toDateString() ?? ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Geo Location */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <div style={{ height: '200px', width: '100%' }}>
                  {isLocationAvailable ? (
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: MAPAPIKEY }}
                      defaultCenter={{
                        lat: coordinates[1], // Latitude
                        lng: coordinates[0], // Longitude
                      }}
                      defaultZoom={11}

                    >
                      <div>
                        <img src="/assets/images/marker-icon.png" alt="Marker Icon" style={{ height: '25px', width: '20px' }} />
                      </div>
                    </GoogleMapReact>
                  ) : (
                    <p>Loading map...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Shoot Cost */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Cost</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">${data?.shoot_cost ?? ''}</span>
                </div>
              </div>
              {/* Shoot Duration */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Duration</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">{data?.shoot_duration ?? ''} Hours</span>
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Payment Status */}
              <div className="basis-[45%] space-y-4">
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Payment Status</label>
                  {data?.payment?.payment_status && (
                    <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                      <StatusBg>{data?.payment?.payment_status}</StatusBg>
                    </div>
                  )}
                </div>
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Current Shoot Status</label>
                  {data?.order_status && (
                    <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                      <StatusBg>{data?.order_status}</StatusBg>
                    </div>
                  )}
                </div>
              </div>
              {/* Description */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Description</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">{data?.description ?? ''}</span>
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Schedule Meeting */}
              <div className="mb-4 basis-[45%] flex-row space-y-5">
                <div className="flex space-x-3">
                  <button className="rounded-lg bg-black px-3 py-1 font-sans font-semibold text-white lg:w-44" onClick={() => setMeetingBox(!meetingBox)}>
                    Schedule Meeting
                  </button>
                  {meetingBox && (
                    <div className="flex space-x-2">
                      <Flatpickr
                        id="meeting_time"
                        className={`cursor-pointer rounded-sm border border-black px-2 lg:w-[240px]`}
                        value={metingDate}
                        placeholder="Meeting time ..."
                        options={{
                          altInput: true,
                          altFormat: 'F j, Y h:i K',
                          dateFormat: 'Y-m-d H:i',
                          enableTime: true,
                          time_24hr: false,
                          minDate: 'today',
                        }}
                        onChange={(date) => setMetingDate(date[0])}
                      />
                      <button
                        disabled={isNewMeetingLoading === true ? true : false}
                        onClick={submitNewMeting}
                        className="flex items-center justify-center rounded-lg border border-black bg-black px-1 text-white"
                      >
                        {isNewMeetingLoading === true ? (
                          <Loader />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {userData?.role === 'admin' && (
                  <div className="flex space-x-3">
                    <button className="rounded-lg bg-black px-3 py-1 font-sans font-semibold text-white lg:w-44" onClick={() => setStatusBox(!statusBox)}>
                      Change Status
                    </button>
                    {statusBox && (
                      <div className="flex space-x-2">
                        <select name="" id="" onChange={(event) => setStatus(event?.target?.value)} className="rounded-sm border border-black px-2 lg:w-[240px]">
                          {allStatus?.map((item, key) => (
                            <option
                              selected={item?.key === status ? true : false}
                              key={key}
                              value={item?.key}>
                              {item?.value}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={isStatusLoading === true ? true : false}
                          onClick={handelUpdateStatus}
                          className="flex items-center justify-center rounded-lg border border-black bg-black px-1 text-white"
                        >
                          {isStatusLoading === true ? (
                            <Loader />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Assigned Cp's */}
              <div className="mb-4 basis-[45%]">
                <div className="mb-3 flex w-full items-center gap-2">
                  <label className="mb-0 font-sans text-[14px] capitalize">Assign CP's</label>
                  {userData?.role === 'admin' && (
                    <div className="flex gap-3">
                      <button onClick={() => setCpModal(!cpModal)} className="flex items-center gap-1 rounded-md bg-black px-1 py-0.5 text-xs text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-3 w-3 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Add CP</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  {data?.cp_ids?.length > 0 && (
                    <div className="scrollbar max-h-[250px] overflow-y-auto overflow-x-hidden rounded border border-slate-100">
                      <table className="w-full table-auto">
                        <thead>
                          <tr>
                            <th className="border-b px-4 py-2">
                              <div className="flex justify-center">Name</div>
                            </th>
                            <th className="border-b px-4 py-2">
                              <div className="flex justify-center">Decision</div>
                            </th>
                            <th className="border-b px-4 py-2 text-right">
                              <div className="flex justify-center">Action</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.cp_ids?.map((cp, key) => (
                            <tr key={key}>
                              <td className="border-b px-4 py-2 font-bold">
                                <div className="flex items-center justify-center">
                                  <div className="relative m-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                                    <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
                                  </div>
                                  <div>{cp?.id?.name ?? ''}</div>
                                </div>
                              </td>
                              <td className="border-b px-4 py-2">
                                <div className="flex justify-center">
                                  <StatusBg>{cp?.decision ?? ''}</StatusBg>
                                </div>
                              </td>
                              <td className="border-b px-4 py-2 text-right">
                                <div className="flex justify-center">
                                  {userData?.role === 'manager' ? (
                                    <Tippy content="Cancel">
                                      <button onClick={() => cancelCp(cp)} className={`rounded bg-red-500 p-1 text-white`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </Tippy>
                                  ) : (
                                    <Tippy content="Only for admin">
                                      <button className={`rounded bg-[#E8E8E8] p-1  text-black`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </Tippy>
                                  )}
                                </div>
                              </td>
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
              <ul className="mx-auto grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                {orderStatusArray.map((status, index) => (
                  <li key={status} className="flex-start group relative flex lg:flex-col">
                    {index < currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full  border border-gray-300 bg-green-500 text-white transition-all duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </div>
                      </>
                    )}

                    {index === currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-green-500 text-white transition-all duration-200 ">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </div>
                      </>
                    )}
                    {index > currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200" />
                      </>
                    )}

                    <div className="ml-6 lg:ml-0 lg:mt-10">
                      <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">{status}</h3>

                      <h4 className="mt-2 text-base text-gray-700">{shootStatusMessage(status)}</h4>
                    </div>
                  </li>
                ))}

                {rejectStatus.map((status, index) => (
                  <div key={status}>
                    <li key={status} className="flex-start group relative flex lg:flex-col">
                      {index < cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200">
                            {status === 'Cancelled' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                            ) : null}
                          </div>
                        </>
                      )}

                      {index === cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white ${status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'
                              } transition-all duration-200`}
                          >
                            {status === 'Cancelled' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                        </>
                      )}

                      {index > cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200 " />
                        </>
                      )}

                      <div className="ml-6 lg:ml-0 lg:mt-10">
                        <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">{status}</h3>
                        <h4 className="mt-2 text-base text-gray-700">{shootStatusMessage(status)}</h4>
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
                  <div className="basis-[50%] px-5 py-2">
                    <div className="mb-2 flex justify-end">
                      <input
                        onChange={(event) => setQuery(event.target.value)}
                        type="search"
                        value={query}
                        className="w-[20%] rounded-lg border border-solid border-[#ACA686] px-3 py-2"
                        placeholder="Search"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-6 2xl:grid-cols-4">
                      {allCp?.results?.length > 0 ? (
                        allCp?.results?.map((cp: any) => {
                          const isSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
                          return (
                            <div key={cp?.userId?._id} className="rounded-lg border border-solid border-[#ACA686] p-3 shadow">
                              <div className="grid grid-cols-3 items-start justify-start">
                                <div className="media relative h-14 w-14 rounded-full">
                                  <img src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`} className="mr-3 h-full w-full rounded-full object-cover" alt="img" />
                                  <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                </div>

                                <div className="content col-span-2 ms-2 min-h-[115px]">
                                  <h4 className="font-sans text-[16px] capitalize leading-none text-black">{cp?.userId?.name}</h4>
                                  <span className="profession text-[12px] capitalize leading-none text-[#838383]">{cp?.userId?.role === 'cp' && 'beige producer'}</span>
                                  <div className="location mt-2 flex items-center justify-start">
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
                                <p
                                  onClick={() => handleSelectProducer(cp)}
                                  className={`single-match-btn inline-block cursor-pointer rounded-lg ${isSelected ? 'bg-red-500' : 'bg-black'
                                    } w-full py-2 text-center font-sans text-sm capitalize leading-none text-white`}
                                >
                                  {isSelected ? 'Remove' : 'Select'}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <div className="flex items-center justify-center">
                            <h3 className="text-center font-semibold">No Data Found</h3>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                        <ResponsivePagination current={currentPage} total={allCp?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
                      </div>
                      <button disabled={false} onClick={updateCps} className="mt-5 rounded-sm bg-black px-3 py-1 text-white">
                        Submit
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default ShootDetails;
