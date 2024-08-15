import React from 'react';
import Link from 'next/link';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/authContext';

const ShootDetails = () => {
  const [shootInfo, setShootInfo] = useState<ShootTypes | null>(null);
  const [metingDate, setMetingDate] = useState<string>('');
  const [statusData, setStatusDate] = useState<string>('');

  const [showNewMetingBox, setShowNewMetingBox] = useState<boolean>(false);
  const [showNewStatusBox, setShowNewStatusBox] = useState<boolean>(false);
  const router = useRouter();
  const shootId = router.query.shootDetails as string;
  const { userData } = useAuth();
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

  console.log("Auth Data", userData?.role);

  const getShootDetails = async (shootId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const shootDetailsRes = await response.json();
      setShootInfo(shootDetailsRes);
    } catch (error) {
      console.error('Error fetching shoot details:', error);
    }
  };

  const submitNewMeting = async () => {
    if (!metingDate) {
      alert('Meeting date is required');
      return;
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
        throw new Error(`Error: ${response.statusText}`);
      }
      const updateShootDetails = await response.json();
      setMetingDate('')
      setShowNewMetingBox(false);
      getShootDetails(shootId);
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  };

  const submitUpdateStatus = async () => {
    try {
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
        throw new Error(`Error: ${response.statusText}`);
      }

      const updateStatusDetails = await response.json();
      console.log('updateStatusDetails', updateStatusDetails);
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
  return (
    <div className="pb-5 pl-5 pr-5">
      <div className='md:flex md:flex-row flex flex-col bg-white shadow-lg rounded-lg overflow-hidden mt-10'>
        <div className="w-full mx-auto ">
          <div className="px-4 py-4">
            <h3 className="text-base font-semibold mb-4">Shoot name: {shootInfo?.order_name}</h3>
            <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Content Type:</p>
                  <p className="font-bold text-[#aca686]">{shootInfo?.content_type[0]}</p>
                </div>
              </div>
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Content Vertical:</p>
                  <p className="font-bold text-[#aca686]">{shootInfo?.content_vertical}</p>
                </div>
              </div>
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Budget:</p>
                  <p className="font-bold text-[#aca686]">Min : ${shootInfo?.budget?.min}</p>
                  <p className="font-bold text-[#aca686]">Max : ${shootInfo?.budget?.max}</p>
                </div>
              </div>
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Estimate Hours:</p>
                  <p className="font-bold text-[#aca686]">{shootInfo?.shoot_datetimes[0]?.duration} Hours</p>
                </div>
              </div>
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Date & Time:</p>
                  {/* <p className="font-semibold">04-08-2023</p> */}
                  <p className="font-semibold">{shootInfo?.shoot_datetimes[0]?.start_date_time} TO {shootInfo?.shoot_datetimes[0]?.start_date_time} </p>
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#252323] font-bold">Location :</p>
                  <p className="font-semibold">{shootInfo?.location}</p>
                </div>
              </div>
              {/* <div className='w-full mt-3'>
                <p className="text-[#252323] font-bold">Location : {shootInfo?.geo_location?.coordinates}</p>
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14596.899807208923!2d90.3654215!3d23.8461445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1723613743569!5m2!1sen!2sbd" width="100%" height="350" ></iframe>
              </div> */}
            </div>

            <div className="">
              <div className="flex justify-between items-center">
                <span>Meting Information</span>
                {userData?.role === 'manager' && (
                  <span>
                    {showNewMetingBox === true ? (
                      <button type="button" onClick={() => setShowNewMetingBox(false)} className="text-bold text-[#f23636] p-0 font-bold cursor-pointer rounded-full">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="font-bold w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <button type="button" onClick={() => setShowNewMetingBox(true)} className="text-bold text-white-dark p-0 font-sans cursor-pointer">
                        <span>
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <title>Show or Add</title>
                              <path d="M24,3A21,21,0,1,0,45,24,21,21,0,0,0,24,3Z" fill="#deeff7"></path>
                              <path d="M32,26H16a2,2,0,0,1,0-4H32A2,2,0,0,1,32,26Z" fill="#36b6f2"></path>
                              <path d="M24,34a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0V32A2,2,0,0,1,24,34Z" fill="#36b6f2"></path>
                            </g>
                          </svg>
                        </span>
                      </button>
                    )}
                  </span>
                )}
              </div>
              {showNewMetingBox && (
                <div className="flex justify-between items-center gap-5 mt-4">
                  <input
                    id="start_date_time"
                    type="datetime-local"
                    onChange={(event) => setMetingDate(event.target.value)}
                    value={metingDate}
                    className="border border-green-600 w-full rounded-sm p-1"
                  />
                  <button
                    onClick={submitNewMeting}
                    className='text-bold text-slate-500 border border-green-600 bg-green-300 px-2 py-1 font-sans cursor-pointer rounded-sm'
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {shootInfo?.meeting_date_times?.length > 0 ? (
              <div className="mb-4 text-sm mt-5">
                <ul>
                  {shootInfo?.meeting_date_times?.map((meting) => (
                    <li key={meting} className='my-1'>{meting}</li>
                  ))}
                </ul>
              </div>
            ) : ''}

            {shootInfo?.references && (
              <div className="mb-4 text-sm">
                <p className="text-[#252323] font-bold">References:
                  <span className="font-semibold"> {shootInfo?.references}</span>
                </p>
              </div>
            )}

            {/* <div className="mb-4 text-sm">
              <p className="text-[#252323] font-bold">Purpose: <span className="font-semibold">For my new shop</span></p>
            </div>

            <div className="text-sm bg-[#cecece9d] p-3 rounded-md">
              <div className='flex gap-2'>
                <svg fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 493.636 493.636" transform="rotate(180)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M421.428,72.476C374.868,25.84,312.86,0.104,246.724,0.044C110.792,0.044,0.112,110.624,0,246.548 c-0.068,65.912,25.544,127.944,72.1,174.584c46.564,46.644,108.492,72.46,174.4,72.46h0.58v-0.048 c134.956,0,246.428-110.608,246.556-246.532C493.7,181.12,468,119.124,421.428,72.476z M257.516,377.292 c-2.852,2.856-6.844,4.5-10.904,4.5c-4.052,0-8.044-1.66-10.932-4.516c-2.856-2.864-4.496-6.852-4.492-10.916 c0.004-4.072,1.876-8.044,4.732-10.884c2.884-2.86,7.218-4.511,11.047-4.542c3.992,0.038,7.811,1.689,10.677,4.562 c2.872,2.848,4.46,6.816,4.456,10.884C262.096,370.46,260.404,374.432,257.516,377.292z M262.112,304.692 c-0.008,8.508-6.928,15.404-15.448,15.404c-8.5-0.008-15.42-6.916-15.416-15.432L231.528,135 c0.004-8.484,3.975-15.387,15.488-15.414c4.093,0.021,7.895,1.613,10.78,4.522c2.912,2.916,4.476,6.788,4.472,10.912 L262.112,304.692z"></path> </g> </g> </g></svg>
                <div>
                  <p className="text-[#252323] font-bold">Additional Information:</p>
                  <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply du</p>
                </div>
              </div>

            </div> */}
          </div>

          <div className="px-4 py-4">
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold text-sm">Find Producer</button>
          </div>
        </div>
        {/* //! Another div */}
        <div className="w-full mx-auto ">
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Addons Information</h1>

            <div className="space-y-2 mb-4">
              <p><span className="font-semibold">Addons Cost:</span> {shootInfo?.addOns_cost}</p>
              <div>
                {shootInfo?.addOns?.map((adon) => (
                  <div key={adon?._id}>
                    <span>{adon?.title}</span>
                    <small>Hours: {adon?.hours}</small>
                    <small>Rate: {adon?.rate}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              {/* <img src="map_placeholder.jpg" alt="Location Map" className="w-full h-40 object-cover rounded-lg" />/ */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14596.899807208923!2d90.3654215!3d23.8461445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1723613743569!5m2!1sen!2sbd" width="100%" height="350" ></iframe>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className='font-bold'><span className="font-bold text-[#646262]">Payment Info:</span> ${shootInfo?.payment?.amount_paid}</p>
              <span className="text-green-500 font-semibold bg-[#a8ff6e34] py-1 px-3 rounded-[25px]">
                {shootInfo?.payment?.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shot status</span>
              {userData?.role === 'manager' && (
                <span>
                  {showNewStatusBox === true ? (
                    <button type="button" onClick={() => setShowNewStatusBox(false)} className="text-bold text-[#f23636] p-0 font-bold cursor-pointer rounded-full">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="font-bold w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <button type="button" onClick={() => setShowNewStatusBox(true)} className="text-bold text-white-dark p-0 font-sans cursor-pointer">
                      <span>
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 48 48"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <title>Show or Add</title>
                            <path d="M24,3A21,21,0,1,0,45,24,21,21,0,0,0,24,3Z" fill="#deeff7"></path>
                            <path d="M32,26H16a2,2,0,0,1,0-4H32A2,2,0,0,1,32,26Z" fill="#36b6f2"></path>
                            <path d="M24,34a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0V32A2,2,0,0,1,24,34Z" fill="#36b6f2"></path>
                          </g>
                        </svg>
                      </span>
                    </button>
                  )}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Here's the status of your shoot:</p>
            {showNewStatusBox && (
              <div className="flex justify-between items-center gap-5 mt-4">
                <select name="" id="" className='border border-green-600 w-full rounded-sm p-1' onChange={(event) => setStatusDate(event.target.value)}>
                  {allStatus?.map((status) => (
                    <option key={status?.key} value={status?.key}>{status?.value}</option>
                  ))}
                </select>
                <button
                  onClick={submitUpdateStatus}
                  className='text-bold text-slate-500 border border-green-600 bg-green-300 px-2 py-1 font-sans cursor-pointer rounded-sm'
                >
                  Save
                </button>
              </div>
            )}
            {/* Timeline */}
            <div className=" pt-10 xl:grid-cols-2">
              <div className="mb-5">
                <div className="sm:flex">
                  <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                    <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="z-3 relative top-[-10px] mb-7 rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                      <style jsx global>{`
                        .hello {
                        border-left-color: #aca686;
                        border-right-color: transparent;
                        border-bottom-color: #aca686;
                        border-top-color: transparent;
                        }
                        `}</style>
                      <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                      <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">{shootInfo?.order_status}</h6>
                      <p className="font-sans text-[16px] text-[#000000]">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-bold mb-2 text-[#646262]">File link</p>
              <div className='shadow-sm rounded-lg p-4 border border-[#ddd'>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className=''>
                      <svg className="bg-[#a39c9c4b] h-[50px] w-[50px] p-1 flex justify-center items-center rounded-md text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Corporate Video Shoot</p>
                      <p className="text-sm text-gray-600">Last update: Aug 30 </p>
                      <p className="text-sm text-black">Folder: <strong>03</strong> <strong className='text-yellow-700'>•</strong> items: <strong>20</strong> <strong className='text-yellow-700'>•</strong> Used: <strong>2 GB</strong> </p>
                    </div>
                  </div>
                </div>
                <div className='mt-3 flex gap-2'>
                  <button className="bg-[#a86f231c] text-black font-bold px-4 py-2 rounded-lg text-sm shadow-sm">open a Dispute</button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Request for revision</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShootDetails;
