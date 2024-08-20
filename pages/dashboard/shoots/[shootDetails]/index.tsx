/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { API_ENDPOINT, MAPAPIKEY } from '@/config';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/authContext';
import { swalToast } from '@/utils/Toast/SwalToast';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAllCp from '@/hooks/useAllCp';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ResponsivePagination from 'react-responsive-pagination';
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';

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
  const [allCpUsers, totalPagesCount, currentPage, setCurrentPage, getUserDetails, query, setQuery] = useAllCp();
  const [cp_ids, setCp_ids] = useState([]);
  const [loadingSubmitMeting, setLoadingSubmitMeting] = useState(false);

  const allStatus = [
    {
      key: 'pending',
      value: 'Pending',
    },
    {
      key: 'pre_production',
      value: 'Pre Production',
    },
    {
      key: 'production',
      value: 'Production',
    },
    {
      key: 'post_production',
      value: 'Post Production',
    },
    {
      key: 'revision',
      value: 'Revision',
    },
    {
      key: 'completed',
      value: 'Completed',
    },
    {
      key: 'cancelled',
      value: 'Cancelled',
    },
    {
      key: 'in_dispute',
      value: 'In Dispute',
    },
  ];

  const orderStatusArray = ['Pending', 'Pre_production', 'Production', 'Post_production', 'Revision', 'Completed'];
  const rejectStatus = ['In_dispute', 'Cancelled'];

  // Convert order_status to lowercase for comparison
  const status = 'Post_production';
  const lowerCaseOrderStatus = shootInfo?.order_status?.toLowerCase();
  const currentIndex = orderStatusArray.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);
  const cancelIndex = rejectStatus.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);

  const getShootDetails = async (shootId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}?populate=cp_ids`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusp}`);
      }
      const shootDetailsRes = await response.json();
      setShootInfo(shootDetailsRes);
    } catch (error) {
      console.error('Error fetching shoot details:', error);
    }
  };

  const createEvent = () => {
    const requestData = {
      summary: shootInfo?.order_name ? shootInfo?.order_name : 'Beige Meeting',
      location: 'Online',
      description: `Meeting to discuss ${shootInfo?.order_name ? shootInfo?.order_name : 'Beige'} order.`,
      startDateTime: metingDate,
      endDateTime: metingDate,
      orderId: shootId,
    };

    axios
      .post(`${API_ENDPOINT}create-event?userId=${userData?.id}`, requestData)
      .then((response) => {
        if (response.data.authUrl) {
          console.log('🚀  createEvent  authUrl:', response.data.authUrl);
          // Linking.openURL(response.data.authUrl);
        } else {
          setMeetLink(response.data.meetLink);
        }
      })
      .catch((error) => {
        console.log('Error creating event:', error.message);
      })
      .finally(() => {
        console.log('Meet Link Create Success');
      });
  };

  const submitNewMeting = async () => {
    setLoadingSubmitMeting(true);
    if (!metingDate) {
      return swalToast('danger', 'Please select Meting Date & Time!');
    }

    const requestData = {
      summary: shootInfo?.order_name ? shootInfo?.order_name : 'Beige Meeting',
      location: 'Online',
      description: `Meeting to discuss ${shootInfo?.order_name ? shootInfo?.order_name : 'Beige'} order.`,
      startDateTime: metingDate,
      endDateTime: metingDate,
      orderId: shootId,
    };

    const response = await axios.post(`${API_ENDPOINT}create-event?userId=${userData?.id}`, requestData);
    const myMeetLink = response?.data?.meetLink;

    if (!myMeetLink) {
      console.log("Doesn't create meet link");
      return swalToast('danger', 'Something went wrong!');
    }

    try {
      const requestBody = {
        meeting_date_time: metingDate,
        meeting_status: 'pending',
        meeting_type: 'pre_production',
        order_id: shootId,
        meetLink: myMeetLink,
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
      console.log('🚀 ~ submitNewMeting ~ updateShootDetails:', updateShootDetails);
      setMetingDate('');
      setShowNewMetingBox(false);
      getShootDetails(shootId);
      swalToast('success', 'Schedule Meeting Success!');
      setLoadingSubmitMeting(false);
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
      };

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
  };

  useEffect(() => {
    if (shootId) {
      getShootDetails(shootId);
    }
  }, [shootId]);

  const getCps = () => {
    setCpModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const updateCps = async () => {
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
          cp_ids: cp_ids,
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
      setQuery('');
      swalToast('success', 'Assign CP Success!');
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  };

  const statusMessage = (status) => {
    switch (status) {
      case 'Pending':
        return 'The task is awaiting action and has not started yet';
        break;

      case 'Pre_production':
        return 'Preparations are being made before production begins';
        break;

      case 'Production':
        return 'The task is currently in progress';
        break;

      case 'Post_production':
        return 'The task is completed and in the final stages of review';
        break;

      case 'Revision':
        return 'The task requires revisions or corrections';
        break;

      case 'Completed':
        return 'The task has been successfully finished';
        break;

      case 'In_dispute':
        return 'There are issues or disagreements that need to be resolved';
        break;

      case 'Cancelled':
        return 'The task has been stopped and will not be completed';
        break;
      default:
        break;
    }
  };
  const coordinates = shootInfo?.geo_location?.coordinates;
  const isLocationAvailable = coordinates && coordinates.length === 2;

  const cancelCp = async (cp) => {
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
      getShootDetails(shootId);

      swalToast('success', 'CP cancelled successfully.');
    } catch (error) {
      console.error('Error occurred while sending PATCH request:', error);
    }
  };


  const AccordionItem = ({ id, title, content, selected, setSelected }) => {
    const contentRef = useRef(null);

    const handleClick = () => {
      setSelected(selected !== id ? id : null);
    };

    return (
      <li className="relative border-b border-gray-200">
        <button
          type="button"
          className="w-full p-2 text-left"
          onClick={handleClick}
        >
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${selected === id ? "rotate-180" : ""
                }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        <div
          ref={contentRef}
          className="relative overflow-hidden transition-all duration-700"
          style={{
            maxHeight: selected === id ? `${contentRef.current.scrollHeight}px` : "0px",
          }}
        >
          <div className="p-2">{content}</div>
        </div>
      </li>
    );
  };

  const Accordion = () => {
    const [selected, setSelected] = useState(null);

    return (
      <div className="bg-white max-w-full mx-auto border border-gray-200">
        <ul className="shadow-box">
          <AccordionItem
            id={3}
            title="When will I receive my seats?"
            content="Game day seats are rentals will be in place for the first game of the season, unless you are in sections 409-421. Those sections will have game day seats mid way through the football season."
            selected={selected}
            setSelected={setSelected}
          />
        </ul>
      </div>
    );
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
                <span className="font-sans capitalize text-black">{shootInfo?.order_name ?? ''}</span>
              </div>

              {/* Content Vertical */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                  Content Vertical
                </label>
                <span className="font-sans capitalize text-black">{shootInfo?.content_vertical ?? ''}</span>
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
                        {shootInfo?.budget?.min && (
                          <li className="">
                            <span className="font-sans capitalize text-black">Min : ${shootInfo?.budget?.min ?? ''}</span>
                          </li>
                        )}

                        {shootInfo?.budget?.max && (
                          <li>
                            <span className="font-sans capitalize text-black">Max : ${shootInfo?.budget?.max ?? ''}</span>
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
                  <span className="font-sans capitalize text-black">{shootInfo?.location ?? ''}</span>
                </div>
              </div>
            </div>

            <div className="md:mb-4 md:flex md:items-center md:justify-between">
              {/* Shoot Date & Time */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="reference" className="mb-0 mt-2 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                  Shoot Date & Time
                </label>
                {shootInfo?.shoot_datetimes && (
                  <div className="flex-row">
                    {shootInfo?.shoot_datetimes?.map((time, key) => (
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
                <div style={{ height: '200px', width: '50%' }}>
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
                  <span className="font-sans capitalize text-black">${shootInfo?.shoot_cost ?? ''}</span>
                </div>
              </div>
              {/* Shoot Duration */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Duration</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">{shootInfo?.shoot_duration ?? ''} Hours</span>
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Payment Status */}
              <div className="basis-[45%] space-y-4">
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Payment Status</label>
                  {shootInfo?.payment?.payment_status && (
                    <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                      <StatusBg>{shootInfo?.payment?.payment_status}</StatusBg>
                    </div>
                  )}
                </div>
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Current Order Status</label>
                  {shootInfo?.order_status && (
                    <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                      <StatusBg>{shootInfo?.order_status}</StatusBg>
                    </div>
                  )}
                </div>
              </div>
              {/* Description */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Description</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black">{shootInfo?.description ?? ''}</span>
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Schedule Meeting */}
              <div className="mb-4 basis-[45%] flex-row space-y-5">
                <div className="flex space-x-3">
                  <button className="rounded-sm bg-black px-3 py-1 font-sans font-semibold text-white lg:w-44" onClick={() => setShowNewMetingBox(!showNewMetingBox)}>
                    Schedule Meeting
                  </button>
                  {showNewMetingBox && (
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
                        disabled={loadingSubmitMeting === true ? true : false}
                        onClick={submitNewMeting}
                        className="flex items-center justify-center rounded-sm border border-black bg-black px-1 text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {userData?.role === 'manager' && (
                  <div className="flex space-x-3">
                    <button className="rounded-sm bg-black px-3 py-1 font-sans font-semibold text-white lg:w-44" onClick={() => setShowNewStatusBox(!showNewStatusBox)}>
                      Change Status
                    </button>
                    {showNewStatusBox && (
                      <div className="flex space-x-2">
                        <select name="" id="" onChange={(event) => setStatusDate(event?.target?.value)} className="rounded-sm border border-black px-2 lg:w-[240px]">
                          {allStatus?.map((status, key) => (
                            <option key={key} value={status?.key}>
                              {status?.value}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={statusData.length ? false : true}
                          onClick={submitUpdateStatus}
                          className="flex items-center justify-center rounded-sm border border-black bg-black px-1 text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Assigned Cp's */}
              <div className="mb-4 basis-[45%]">
                <div className='flex items-center justify-between w-full mb-3'>
                  <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Assign CP's</label>
                  <div className='flex gap-3'>
                    <button onClick={getCps} className='bg-violet-600 text-white rounded-md px-3 py-0.5 text-sm'>Add CP</button>
                  </div>
                </div>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  {shootInfo?.cp_ids?.length > 0 && (
                    <div className="scrollbar max-h-[250px] overflow-y-auto overflow-x-hidden border border-slate-100 rounded">
                      <table className="w-full table-auto">
                        <thead>
                          <tr>
                            <th className="border-b px-4 py-2">Name</th>
                            <th className="border-b px-4 py-2">Decision</th>
                            <th className="border-b px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shootInfo?.cp_ids?.map((cp, key) => (
                            <tr key={key}>
                              <td className="border-b px-4 py-2 font-bold">{cp?.id?.name ?? ''}</td>
                              <td className="border-b px-4 py-2">
                                <StatusBg>{cp?.decision ?? ''}</StatusBg>
                              </td>
                              <td className="border-b px-4 py-2">
                                <button onClick={() => cancelCp(cp)} className="rounded bg-red-500 p-[5px] text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {/* <Accordion/> */}
                {/* <div className="mb-0 flex items-center gap-4 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">
                  <div>Assigned Cp's</div>
                  {userData?.role === 'manager' && (
                    <div className="">
                      <button onClick={getCps} type="button" className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                        {allSvgs.plusForAddCp}
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">

                  {shootInfo?.cp_ids?.length > 0 && (
                    <div className="scrollbar max-h-[250px] overflow-y-auto overflow-x-hidden">
                      <table className="w-full table-auto">
                        <thead>
                          <tr>
                            <th className="border-b px-4 py-2">Name</th>
                            <th className="border-b px-4 py-2">Decision</th>
                            <th className="border-b px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shootInfo?.cp_ids?.map((cp, key) => (
                            <tr key={key}>
                              <td className="border-b px-4 py-2 font-bold">{cp?.id?.name ?? ''}</td>
                              <td className="border-b px-4 py-2">
                                <StatusBg>{cp?.decision ?? ''}</StatusBg>
                              </td>
                              <td className="border-b px-4 py-2">
                                <button onClick={() => cancelCp(cp)} className="rounded bg-red-500 p-[5px] text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div> */}
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
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                          className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200" />
                      </>
                    )}

                    <div className="ml-6 lg:ml-0 lg:mt-10">
                      <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">{status}</h3>

                      <h4 className="mt-2 text-base text-gray-700">{statusMessage(status)}</h4>
                    </div>
                  </li>
                ))}

                {rejectStatus.map((status, index) => (
                  <div key={status}>
                    <li key={status} className="flex-start group relative flex lg:flex-col">
                      {index < cancelIndex && (
                        <>
                          <span
                            className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                            className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                            className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200 " />
                        </>
                      )}

                      <div className="ml-6 lg:ml-0 lg:mt-10">
                        <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">{status}</h3>
                        <h4 className="mt-2 text-base text-gray-700">{statusMessage(status)}</h4>
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
                      {allCpUsers?.length > 0 ? (
                        allCpUsers?.map((cp) => {
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
                                {/* <Link href={`cp/${cp?.userId?._id}`}>
                                  <p className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-lg bg-black px-3 py-2 font-sans capitalize leading-none text-white">
                                    view profile
                                  </p>
                                </Link> */}
                                {/* ${isSelected ? 'border-[#eb5656] bg-white text-red-500' : 'border-[#C4C4C4] bg-white text-black'
                                  } */}
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
                      {/* pagination */}
                      <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                        <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
                      </div>
                      <button onClick={updateCps} className="mt-5 rounded-sm bg-black px-3 py-1 text-white">
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



