import React, { useEffect, useState, Fragment, useRef, useMemo } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/authContext';
import StatusBg from '@/components/Status/StatusBg';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useDateFormat from '@/hooks/useDateFormat';
import ResponsivePagination from 'react-responsive-pagination';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import PreLoader from '@/components/ProfileImage/PreLoader';
import { useGetAllMeetingsQuery, useLazyGetMeetingDetailsQuery, useUpdateRescheduleMutation } from '@/Redux/features/meeting/meetingApi';

const Meeting = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meetingInfo, setMeetingInfo] = useState<any>({});
  const [meetingModal, setMeetingModal] = useState(false);
  const { userData, authPermissions } = useAuth();
  const dispatch = useDispatch();
  const [metingDate, setMetingDate] = useState();
  const myInputDate = meetingInfo?.meeting_date_time;
  const myFormattedDateTime = useDateFormat(myInputDate);
  const [query, setQuery] = useState('');


  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      ...(userData?.role === 'user' && { client_id: userData.id }),
      ...(userData?.role === 'cp' && { cp_id: userData.id }),
      search: query,
    }),
    [currentPage, userData, query]
  );
  const { data: allMeetings, isLoading: getAllMeetingLoading, isFetching } = useGetAllMeetingsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  })
  const [getMeetingDetails, { data: meetingDetails, isLoading: isMeetingDetailsLoading }] = useLazyGetMeetingDetailsQuery();
  const [updateReschedule, { isLoading: isUpdateRescheduleLoading }] = useUpdateRescheduleMutation();

  useEffect(() => {
    dispatch(setPageTitle('Meetings'));
  });

  const handelMeetingDetails = async (meetingId: string) => {
    const result = await getMeetingDetails(meetingId);
    if (result?.data) {
      setMeetingInfo(result?.data);
      setMeetingModal(true)
    } else {
      toast.error("Something want wrong....!")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function makeDateFormat(inputDate: any) {
    const date = new Date(inputDate);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

    const formattedDate = `${month} ${day}, ${year}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }


  const handelRescheduleMeeting = async (id: any) => {
    if (!metingDate) {
      toast.error('Please select Meting Date & Time...!');
      return;
    }

    try {
      const data = {
        id: id,
        requestBody: {
          "requested_by": userData?.role,
          "requested_time": metingDate
        }
      }
      const result = await updateReschedule(data)
      console.log("🚀 ~ handelRescheduleMeeting ~ result:", result)
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }


  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Meeting List</h5>
          <input type="text" onChange={(event) => setQuery(event.target.value)} value={query} className='px-3 py-1 rounded border border-black focus:border-black focus:outline-none' placeholder='Search...' />
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr className="">
                <th className="text-[16px] font-semibold">Shoot Name</th>
                <th className="text-[16px] font-semibold">Meeting Date / Time</th>
                <th className="text-[16px] font-semibold">Attendings</th>
                <th className="text-[16px] font-semibold ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                {authPermissions?.includes('meeting_details') && (
                  <th className="text-[16px] font-semibold">View</th>
                )}
              </tr>
            </thead>

            <tbody>

              {getAllMeetingLoading ? (
                <>
                  <PreLoader></PreLoader>
                </>
              ) : (
                <>


                  {allMeetings?.results && allMeetings?.results?.length > 0 ? (
                    allMeetings?.results?.map((meeting: any) => (
                      <tr key={meeting.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className=" min-w-[150px] text-black dark:text-white">
                          <div className="flex items-center">
                            <p className="whitespace-nowrap break-words">{(meeting?.order?.name).length > 10 ? meeting?.order?.name : 'less than 10 character'}</p>
                          </div>
                        </td>

                        <td>
                          <span className="ps-2">{makeDateFormat(meeting?.meeting_date_time)?.date}</span>
                          <span className="ps-2"> {makeDateFormat(meeting?.meeting_date_time)?.time}</span>
                        </td>

                        <td>
                          <p className="whitespace-nowrap">
                            {meeting?.client?.name} with
                            <span className="ps-1">{meeting?.cps[1]?.name ? meeting?.cps[1]?.name : meeting?.cps[0]?.name}</span>
                          </p>
                        </td>

                        <td>
                          <div>
                            <StatusBg>{meeting?.meeting_status}</StatusBg>
                          </div>
                        </td>
                        {authPermissions?.includes('meeting_details') && (
                          <td>
                            <button type="button" className="p-0" onClick={() => handelMeetingDetails(meeting?.id)}>
                              <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))

                  ) : (
                    <tr>
                      <td colSpan={50} className="text-center">
                        <span className="text-[red] font-semibold flex justify-center"> No meetings found </span>
                      </td>
                    </tr>
                  )}

                </>
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={allMeetings?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
          </div>
        </div>
      </div>

      <Transition appear show={meetingModal} as={Fragment}>
        <Dialog as="div" open={meetingModal} onClose={() => setMeetingModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center md:px-4 ">
              <Dialog.Panel as="div" className="panel my-24 w-2/5 space-x-6 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="my-2 flex items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                  <div className="ms-6 text-[22px] font-bold capitalize leading-none text-[#000000]">Meeting Details</div>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setMeetingModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                <div className="basis-[100%]">
                  {/* <h2 className=" text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">
                    Meeting with <span className="capitalize text-[#ACA686]">{meetingInfo?.client?.name}</span>
                  </h2> */}

                  <div className={`${meetingInfo?.meeting_status === 'pending' && 'md:flex'}  w-full justify-between space-y-6 pb-6 `}>
                    <div className="leftdata">
                      <p>
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000] ">
                          Shoot : <span className="text-[14px] font-normal text-[#000000]">{meetingInfo?.order?.name}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[14px]  capitalize leading-none text-[#000000] font-bold">
                          Meeting Link :{' '}
                          <a href={meetingInfo?.meetLink || ''} target={0} className="text-[14px] font-normal text-blue-600 underline">
                            {meetingInfo?.meetLink}
                          </a>
                        </span>
                      </p>

                      <p className="mt-2">
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000]">
                          Time : <span className="text-[14px] font-normal leading-[28px] text-[#000000]"> {myFormattedDateTime?.time}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000]">
                          Date : <span className="text-[14px] font-normal leading-[28px] text-[#000000]"> {myFormattedDateTime?.date}</span>
                        </span>
                      </p>
                      <div className="mt-3 flex justify-between">
                        <span className=" text-[14px]  capitalize leading-none text-[#000000] font-bold">
                          Status:{' '}
                          <span className="ps-2 font-normal text-[#0E1726]">
                            <StatusBg>{meetingInfo?.meeting_status}</StatusBg>
                          </span>
                        </span>
                        {meetingInfo.link ? <span className=" block font-sans text-[14px] leading-[18.2px] text-[#000000] font-bold">Link: {meetingInfo.link}</span> : ''}
                      </div>
                    </div>

                    {/* Resheduling */}
                    <div className='mr-4'>
                      {authPermissions?.includes('meeting_details_reschedule') && (
                        <>
                          {meetingInfo?.meeting_status === 'pending' && userData?.role === "cp" && (
                            <div className="flex flex-col items-start">
                              <h2 className="text-[14px] font-semibold capitalize leading-none text-[#000000] mb-3">Reschedule Meeting</h2>
                              <div className="flex flex-col">
                                <Flatpickr
                                  id="meeting_time"
                                  className={`w-60 rounded-md border border-solid border-[#dddddd] bg-white px-[15px] py-[10px] font-sans text-[14px] font-medium leading-none text-[#000000] focus:border-[#dddddd]`}
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

                                <button onClick={() => handelRescheduleMeeting(meetingInfo?.id)} className="btn float-left my-5 w-60 bg-black font-sans font-bold text-sm  capitalize text-white">
                                  Reschedule Request
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Resheduling */}
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Meeting;
