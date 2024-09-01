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
import Loader from '@/components/SharedComponent/Loader';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


const ShootDetails = () => {
  const [shootInfo, setShootInfo] = useState<ShootTypes | null>({
    "geo_location": {
      "coordinates": [
        -85.7584557,
        38.2526647
      ],
      "type": "Point"
    },
    "budget": {
      "min": 1000,
      "max": 1500
    },
    "payment": {
      "payment_type": "full",
      "payment_status": "pending",
      "amount_paid": 0,
      "payment_ids": [
        "66c7244eb61922f6300bfaef"
      ]
    },
    "file_path": {
      "status": false
    },
    "chat_room_id": "66c7244db61922f6300bfae6",
    "order_status": "pre_production",
    "content_type": [
      "video"
    ],
    "vst": [],
    "order_name": "Sajib's Music Videography",
    "meeting_date_times": [
      "66c72452b61922f6300bfaf6"
    ],
    "review_status": false,
    "client_id": {
      "role": "user",
      "isEmailVerified": false,
      "name": "Sajib",
      "email": "sajib@gmail.com",
      "createdAt": "2024-04-16T09:58:32.997Z",
      "updatedAt": "2024-04-16T09:58:32.997Z",
      "id": "661e4bc86970067f1739f642"
    },
    "content_vertical": "Music",
    "description": "Special Note",
    "location": "Louisville, KY, USA",
    "references": "This is new references",
    "shoot_datetimes": [
      {
        "_id": "66c7244db61922f6300bfadb",
        "start_date_time": "2024-08-22T12:00:00.000Z",
        "end_date_time": "2024-08-23T12:00:00.000Z",
        "duration": 24,
        "date_status": "confirmed"
      }
    ],
    "shoot_duration": 24,
    "addOns": [],
    "cp_ids": [
      {
        "decision": "accepted",
        "_id": "66c7244db61922f6300bfadc",
        "id": {
          "role": "cp",
          "isEmailVerified": false,
          "name": "Prity",
          "email": "prity@gmail.com",
          "createdAt": "2024-04-16T09:57:51.103Z",
          "updatedAt": "2024-04-16T10:17:28.874Z",
          "id": "661e4b9f6970067f1739f638"
        }
      }
    ],
    "addOns_cost": 0,
    "shoot_cost": 6000,
    "createdAt": "2024-08-22T11:43:09.011Z",
    "updatedAt": "2024-08-22T11:43:14.496Z",
    "id": "66c7244db61922f6300bfada"
  });
  console.log("🚀 ~ ShootDetails ~ shootInfo:", shootInfo)
  const [metingDate, setMetingDate] = useState<string>('');
  const [statusData, setStatusDate] = useState<string>('');

  const [showInput, setShowInput] = useState<boolean>(false);
  const [showSelect, setShowSelect] = useState<boolean>(false);

  const router = useRouter();
  const shootId = '66c7244db61922f6300bfae6' as string;
  const { userData } = useAuth();
  const [cpModal, setCpModal] = useState(false);
  const [allCpUsers, totalPagesCount, currentPage, setCurrentPage, getUserDetails, query, setQuery] = useAllCp();
  const [cp_ids, setCp_ids] = useState([]);
  const [loadingSubmitMeting, setLoadingSubmitMeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!metingDate) {
      return swalToast('danger', 'Please select Meting Date & Time!');
    }
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  };


  const submitUpdateStatus = async () => {
    try {
      if (!statusData) {
        return swalToast('danger', 'Please select a status!');
      }

      setIsLoading(true);
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
      setIsLoading(false);
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
    setIsLoading(true);
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
      setIsLoading(false);
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

  return (
    <>
      <div className="panel">
        <div className="mb-5">
          <h2 className='capitalize font-semibold text-slate-950'>{shootInfo?.order_name ?? ''}</h2>
        </div>

        <div className='grid grid-cols-1 md:grid md:grid-cols-2 gap-4 '>
          <div className="">
            <h3 className='font-bold'>Shoot Information</h3>

            <div className="mt-4 space-y-4">
              <div className="">
                <b>Budget : </b> <span>Min- ${shootInfo?.budget?.min ?? ''} , Max- ${shootInfo?.budget?.max ?? ''}</span>
              </div>
              <div className="">
                <b>Content Type : </b> <span>{shootInfo?.content_type ?? ''}</span>
              </div>
              <div>
                <b>Shoot Duration : </b> <span>{shootInfo?.shoot_duration ?? ''} Hours</span>
              </div>
              <div>
                <b>Shoot Cost : </b> <span>${shootInfo?.shoot_cost ?? ''}</span>
              </div>
              <div>
                <b>Description : </b> <span>{shootInfo?.description ?? ''}</span>
              </div>
            </div>

            <div className="flex gap-1 mb-5 mt-3">
              <b className='inline-block w-[170px] '>Shoot Status: </b> <span>
                <StatusBg>{shootInfo?.order_status ?? ''}</StatusBg>
              </span>
            </div>
            <div className="lg:flex lg:flex-row flex flex-col space-x-2 gap-2">
              <button className="rounded-lg bg-black px-3 text-[12px] py-3 font-sans font-semibold text-white w-full lg:w-[20%]"
                onClick={() => setShowSelect(!showSelect)}>
                Change Status
              </button>
              {showSelect && (
                <div className='flex gap-4 w-full'>
                  <select
                    name=""
                    id=""
                    onChange={(event) => setStatusDate(event?.target?.value)}
                    className=" w-full rounded-md border border-[#b9b8b8] py-[8px] px-[15px] bg-transparent focus:outline-none  lg:w-[270px]">
                    {allStatus?.map((status, key) => (
                      <option key={key} value={status?.key}>
                        {status?.value}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={isLoading === true ? true : false}
                    onClick={submitUpdateStatus}
                    className="flex items-center justify-center rounded-lg border border-black  h-[40px] w-[40px] bg-black px-1 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className='mt-5 mb-3'>
              <div className="lg:flex lg:flex-row flex flex-col space-x-2 mb-3 gap-2">
                <button
                  className="rounded-lg bg-black px-3 py-3 font-sans text-[12px] font-semibold text-white w-full lg:w-[20%]"
                  onClick={() => setShowInput(!showInput)}
                >
                  Schedule Meeting
                </button>

                {showInput && (
                  <div className='flex gap-4 w-full'>
                    <Flatpickr
                      id="meeting_time"
                      className={`cursor-pointer w-full rounded-md border border-[#b9b8b8] py-[8px] px-[15px] focus:outline-none lg:w-[270px]`}
                      placeholder="Meeting time ..."
                      options={{
                        altInput: true,
                        altFormat: 'F j, Y h:i K',
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: false,
                        minDate: 'today',
                      }}
                    />
                    <button
                      className="flex items-center justify-center rounded-lg border h-[40px] w-[40px] border-black bg-black px-1 text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="mt-2">
            {/* <h3 className='font-bold'>Status</h3> */}

            <div className="mt-4 space-y-5">
              <div className="flex gap-1">
                <b className='inline-block w-[170px] '>Payment Status: </b> <span>
                  <StatusBg>pending</StatusBg>
                </span>
              </div>

            </div>
            <div className="mt-6 ">
              {/* <h3 className='font-bold'>Location Information</h3> */}

              <div className="mt-4 space-y-5">
                <div className="">
                  <b>Location : </b> <span>Dhaka University, Nilkhet Road, Dhaka, Bangladesh</span>
                </div>

                <div>
                  <iframe className='w-full h-[300px]' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7298.405077158279!2d90.38216309560319!3d23.84694062734523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6a4cd8b5419%3A0x5ac8cf3c96294625!2sBaunia%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1723962056481!5m2!1sen!2sbd" loading="lazy"></iframe>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-3 mb-2">
          <div className="mb-4 flex w-full items-center gap-2 ">
            <label className="mb-0 font-sans text-[14px] capitalize">Assign CP's</label>
            <div className="flex gap-3">
              <button className="flex items-center gap-1 rounded-md bg-black px-4 py-2 text-xs text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ddd" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-3 w-3 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add CP</span>
              </button>
            </div>
          </div>
          <div className="scrollbar  max-h-[250px] mt-3 overflow-y-auto overflow-x-hidden rounded border border-slate-100">
            <table className="w-full table-auto ">
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
                <tr >
                  <td className="border-b px-4 py-2 font-bold">
                    <div className="flex items-center justify-center">
                      <div className="relative m-1 mr-2 gap-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
                        <h4 className='text-black text-sm'>john</h4>
                      </div>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2">
                    <div className="flex justify-center">
                      <StatusBg>
                        <select name="" id="" className=" w-full max-w-[150px] rounded-md  py-[8px] px-0 bg-transparent focus:outline-none  lg:w-[270px]">
                          <option >
                            Pending
                          </option>
                          <option >
                            Pre_production
                          </option>
                          <option >
                            Production
                          </option>
                          <option >
                            Post_production
                          </option>
                          <option >
                            Revision
                          </option>
                          <option >
                            Completed
                          </option>
                          <option >
                            In_dispute
                          </option>
                        </select>
                      </StatusBg>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2 text-right">
                    <div className="flex justify-center gap-2">
                      <button className={`rounded bg-green-700 py-1 px-2 font-bold text-white`}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg> */}
                        Update Status
                      </button>
                      {/* <button className={`rounded bg-[#E8E8E8] p-1  text-black`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button> */}
                    </div>
                  </td>
                </tr>

                <tr >
                  <td className="border-b px-4 py-2 font-bold">
                    <div className="flex items-center justify-center">
                      <div className="relative m-1 mr-2 gap-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
                        <h4 className='text-black text-sm'>john</h4>
                      </div>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2">
                    <div className="flex justify-center">
                      <StatusBg>
                        <select name="" id="" className=" w-full max-w-[150px] rounded-md  py-[8px] px-0 bg-transparent focus:outline-none  lg:w-[270px]">
                          <option >
                            Pending
                          </option>
                          <option >
                            Pre_production
                          </option>
                          <option >
                            Production
                          </option>
                          <option >
                            Post_production
                          </option>
                          <option >
                            Revision
                          </option>
                          <option >
                            Completed
                          </option>
                          <option >
                            In_dispute
                          </option>
                        </select>
                      </StatusBg>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2 text-right">
                    <div className="flex justify-center gap-2">
                      <button className={`rounded bg-green-700 py-1 px-2 font-bold text-white`}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg> */}
                        Update Status
                      </button>
                      {/* <button className={`rounded bg-[#E8E8E8] p-1  text-black`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button> */}
                    </div>
                  </td>
                </tr>

                <tr >
                  <td className="border-b px-4 py-2 font-bold">
                    <div className="flex items-center justify-center">
                      <div className="relative m-1 mr-2 gap-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
                        <h4 className='text-black text-sm'>john</h4>
                      </div>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2">
                    <div className="flex justify-center">
                      <StatusBg>
                        <select name="" id="" className=" w-full max-w-[150px] rounded-md  py-[8px] px-0 bg-transparent focus:outline-none  lg:w-[270px]">
                          <option >
                            Pending
                          </option>
                          <option >
                            Pre_production
                          </option>
                          <option >
                            Production
                          </option>
                          <option >
                            Post_production
                          </option>
                          <option >
                            Revision
                          </option>
                          <option >
                            Completed
                          </option>
                          <option >
                            In_dispute
                          </option>
                        </select>
                      </StatusBg>
                    </div>
                  </td>
                  <td className="border-b px-4 py-2 text-right">
                    <div className="flex justify-center gap-2">
                      <button className={`rounded bg-green-700 py-1 px-2 font-bold text-white`}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg> */}
                        Update Status
                      </button>
                      {/* <button className={`rounded bg-[#E8E8E8] p-1  text-black`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button> */}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

        </div>


        <div className='mt-4 '>
          <div className="mx-auto">
            <ul className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 sm:mt-16">
              {orderStatusArray.map((status, index) => (
                <li key={status} className="flex-start group relative flex lg:flex-col">
                  {index < currentIndex && (
                    <>
                      <span
                        className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full  text-white border border-gray-300 bg-green-500 transition-all duration-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
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
                        className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 bg-green-500 transition-all duration-200 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
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
                        className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                        aria-hidden="true"
                      ></span>
                      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 transition-all duration-200" />
                    </>
                  )}

                  <div className="ml-6 lg:ml-0 lg:mt-10">
                    <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">
                      {status}
                    </h3>

                    <h4 className="mt-2 text-base text-gray-700">
                      {statusMessage(status)}
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
                          className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200">
                          {status === 'Cancelled' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          ) : null}
                        </div>
                      </>
                    )}

                    {index === cancelIndex && (
                      <>
                        <span
                          className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                          aria-hidden="true"
                        ></span>
                        <div className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 ${status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'} transition-all duration-200`}>
                          {status === 'Cancelled' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
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
                          className="absolute left-[11px] top-[36px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-3px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_36px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white border-gray-300 transition-all duration-200 " />
                      </>
                    )}

                    <div className="ml-6 lg:ml-0 lg:mt-10">
                      <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500">
                        {status}
                      </h3>
                      <h4 className="mt-2 text-base text-gray-700">
                        {statusMessage(status)}
                      </h4>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </>
  )
}

export default ShootDetails;
