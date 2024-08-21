import React from 'react'
import StatusBg from '@/components/Status/StatusBg';


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
  const statusMessage = (status)=> {
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


  return (
    <>
      <div className="panel">
        <div className="mb-5">
          <h2 className='capitalize font-semibold text-slate-950'>User's Business Videography</h2>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className="rounded-sm border border-slate-200 p-3">
            <h3>Shoot Information</h3>

            <div className="mt-4 space-y-1">
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
          </div>

          <div className="rounded-sm border border-slate-200 p-3">
            <h3>Location Information</h3>

            <div className="mt-4 space-y-1">
              <div className="">
                <b>Location : </b> <span>Dhaka University, Nilkhet Road, Dhaka, Bangladesh</span>
              </div>

              <div>
              <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7298.405077158279!2d90.38216309560319!3d23.84694062734523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6a4cd8b5419%3A0x5ac8cf3c96294625!2sBaunia%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1723962056481!5m2!1sen!2sbd" loading="lazy"></iframe>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-slate-200 p-3">
            <h3>Status</h3>

            <div className="mt-4 space-y-3">
              <div className="">
                <b>Payment Status: </b> <span>
                  <StatusBg>pending</StatusBg>
                </span>
              </div>
              <div className="">
                <b>Current Shoot Status: </b> <span>
                  <StatusBg>pre_production</StatusBg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 rounded-sm border border-slate-200 p-3'>
          <div className="mx-auto">
            <ul className="mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 sm:mt-16">
              {orderStatusArray.map((status, index) => (
                <li key={status} className="flex-start group relative flex lg:flex-col">
                  {index < currentIndex && (
                    <>
                      <span
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-[-30px] lg:left-auto lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
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
