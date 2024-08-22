import React, { useState } from 'react';
import StatusBg from '@/components/Status/StatusBg';
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';


const ShootDetails = () => {
  const orderStatusArray = [
    'Pending',
    'Pre_production',
    'Production',
    'Post_production',
    'Revision',
    'Completed',
  ];
  const rejectStatus = ['In_dispute', 'Cancelled'];
  const statusMessage = (status) => {
    switch (status) {
      case "Pending":
        return 'The task is awaiting action and has not started yet'
        break;

      case "Pre_production":
        return 'Preparations are being made before production begins'
        break;

      case "Production":
        return 'The task is currently in progress'
        break;

      case "Post_production":
        return 'The task is completed and in the final stages of review'
        break;

      case "Revision":
        return 'The task requires revisions or corrections'
        break;

      case "Completed":
        return 'The task has been successfully finished'
        break;

      case "In_dispute":
        return 'There are issues or disagreements that need to be resolved'
        break;

      case "Cancelled":
        return 'The task has been stopped and will not be completed'
        break;
      default:
        break;
    }
  }
  // Convert order_status to lowercase for comparison
  const status = "Post_production";
  const lowerCaseOrderStatus = 'pending';
  const currentIndex = orderStatusArray.findIndex(
    status => status.toLowerCase() === lowerCaseOrderStatus,
  );
  const cancelIndex = rejectStatus.findIndex(
    status => status.toLowerCase() === lowerCaseOrderStatus,
  );

  const [showInput, setShowInput] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

  const handleButtonClick = () => {
    setShowInput(true);
  };




  return (
    <>
      <div className="panel">
        <div className="mb-5">
          <h2 className='capitalize font-semibold text-slate-950'>User's Business Videography</h2>
        </div>

        <div className='grid grid-cols-1 md:grid md:grid-cols-2 gap-4 '>
          <div className="">
            <h3 className='font-bold'>Shoot Information</h3>

            <div className="mt-4 space-y-4">
              <div className="">
                <b>Budget : </b> <span>Min- $2344 , Max- $3400</span>
              </div>
              <div className="">
                <b>Content Type : </b> <span>Business</span>
              </div>
              <div>
                <b>Shoot Duration : </b> <span>12 Hours</span>
              </div>
              <div>
                <b>Shoot Cost : </b> <span>$3500</span>
              </div>
              <div>
                <b>Description : </b> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit minus magnam amet! Ipsam, id mollitia in, tempora ut unde commodi amet nihil harum sit aperiam, architecto quod quasi excepturi laboriosam?</span>
              </div>
            </div>

            <div className="flex gap-1 mb-5 mt-3">
              <b className='inline-block w-[170px] '>Shoot Status: </b> <span>
                <StatusBg>pre_production</StatusBg>
              </span>
            </div>
            <div className="lg:flex lg:flex-row flex flex-col space-x-2 gap-2">

              <button className="rounded-lg bg-black px-3 text-[12px] py-3 font-sans font-semibold text-white w-full lg:w-[20%]"
                onClick={() => setShowSelect(!showSelect)}>
                Change Status
              </button>
              {showSelect && (
                <div className='flex gap-4 w-full'>
                  <select name="" id="" className=" w-full rounded-md border border-[#b9b8b8] py-[8px] px-[15px] bg-transparent focus:outline-none  lg:w-[270px]">
                    <option >
                      hell
                    </option>
                    <option >
                      hell2
                    </option>
                    <option >
                      hell3
                    </option>
                  </select>
                  <button
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
                      <div className="relative m-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
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
                      <div className="relative m-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
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
                      <div className="relative m-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                        <img src={'/assets/images/favicon.png'} className="h-full w-full rounded-full" />
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
