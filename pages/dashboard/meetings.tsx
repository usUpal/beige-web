import AccessDenied from '@/components/errors/AccessDenied';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import CommonSkeleton from '@/components/skeletons/CommonSkeleton';
import StatusBg from '@/components/Status/StatusBg';
import { useAuth } from '@/contexts/authContext';
import { useGetAllMeetingsQuery, useLazyGetMeetingDetailsQuery, useUpdateRescheduleMutation } from '@/Redux/features/meeting/meetingApi';
import { IRootState } from '@/store';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { truncateLongText } from '@/utils/stringAssistant/truncateLongText';
import formatDateAndTime from '@/utils/UiAssistMethods/formatDateTime';
import { Dialog, Transition } from '@headlessui/react';
import { format, isValid, parseISO } from 'date-fns';
import flatpickr from 'flatpickr';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';

const Meeting = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meetingInfo, setMeetingInfo] = useState<any>({});
  const [meetingModal, setMeetingModal] = useState(false);
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('meeting_page');
  const dispatch = useDispatch();
  const myInputDate = meetingInfo?.meeting_date_time;

  // formatted date times
  const myFormattedDateTime = formatDateAndTime(myInputDate);

  // const myFormattedDateTime = useDateFormat(myInputDate);
  const [query, setQuery] = useState('');
  const [formattedMeetingTime, setFormattedMeetingTime] = useState('');

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
  const {
    data: allMeetings,
    isLoading: getAllMeetingLoading,
    isFetching,
  } = useGetAllMeetingsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [getMeetingDetails, { data: meetingDetails, isLoading: isMeetingDetailsLoading }] = useLazyGetMeetingDetailsQuery();
  const [updateReschedule, { isLoading: isUpdateRescheduleLoading }] = useUpdateRescheduleMutation();

  useEffect(() => {
    dispatch(setPageTitle('Meetings'));
  });

  const handelMeetingDetails = async (meetingId: string) => {
    const result = await getMeetingDetails(meetingId);
    if (result?.data) {
      setMeetingInfo(result?.data);
      setMeetingModal(true);
    } else {
      toast.error('Something want wrong....!');
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
  //
  const meetingDateTimeRef = useRef(null);
  let flatpickrInstance = useRef(null);

  useEffect(() => {
    if (meetingDateTimeRef.current) {
      // Initialize flatpickr and store the instance
      flatpickrInstance.current = flatpickr(meetingDateTimeRef.current, {
        altInput: true,
        altFormat: 'F j, Y h:i K',
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        time_24hr: false,
        minDate: 'today',
        onClose: (selectedDates, dateStr) => {
          handleOnMeetingDateTimeChange(dateStr);
        },
      });
    }

    // Cleanup function to destroy flatpickr instance
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  });

  const handleOnMeetingDateTimeChange = (dateStr) => {
    try {
      const e_time = parseISO(dateStr);
      if (!isValid(e_time)) {
        return;
      }
      const formattedTime = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setFormattedMeetingTime(formattedTime);
    } catch (error) {
      // console.error('Date parsing error', error);
    }
  };
  // ========
  //
  const handelRescheduleMeeting = async (id: any) => {
    if (!formattedMeetingTime) {
      toast.error('Please select Meting Date & Time...!');
      return;
    }

    try {
      const data = {
        id: id,
        requestBody: {
          requested_by: userData?.role,
          requested_time: formattedMeetingTime,
        },
      };
      const result = await updateReschedule(data);
    } catch (error) {
      console.error('Error occurred while sending POST request:', error);
    }
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid h-[90vh] grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 items-center justify-between md:flex ">
          <h5 className="text-xl font-bold dark:text-slate-300">Meeting List</h5>
          <input
            type="text"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            className={` rounded border border-solid border-[#dddddd] bg-white p-[10px] font-sans text-[14px]
              font-medium leading-none text-black focus:border-[#888888] 
              dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-white dark:focus:border-[#4b5563]`}
            placeholder="Search..."
          />
        </div>
        <div className="table-responsive h-[75vh]">
          <table>
            <thead>
              <tr className="text-black dark:text-white-dark">
                <th className="text-[16px] font-semibold">Shoot Name</th>
                <th className="text-[16px] font-semibold">Meeting Date / Time</th>
                <th className="text-[16px] font-semibold">Attendings</th>
                <th className="text-[16px] font-semibold ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                {authPermissions?.includes('meeting_details') && <th className="text-[16px] font-semibold">View</th>}
              </tr>
            </thead>

            <tbody>
              {getAllMeetingLoading ? (
                <>
                  {/* <PreLoader></PreLoader> */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <CommonSkeleton key={index} col={4} />
                  ))}
                </>
              ) : (
                <>
                  {allMeetings?.results && allMeetings.results.length > 0 ? (
                    allMeetings.results.map((meeting: any) => {
                      const { date, time } = formatDateAndTime(meeting?.meeting_date_time) || { date: '', time: '' };

                      return (
                        <tr key={meeting.id} className="group text-white-dark hover:text-black dark:hover:text-dark-light">
                          <td className="min-w-[150px] text-black dark:text-slate-300 group-hover:dark:text-dark-light">
                            <div className="flex items-center">
                              <p>{truncateLongText(meeting?.order?.name, 30)}</p>
                            </div>
                          </td>

                          <td>
                            {date}
                            <span> at {time}</span>
                          </td>

                          <td>
                            <p>
                              {meeting?.client?.name} with
                              <span className="ps-1">{truncateLongText(meeting?.cps[1]?.name || meeting?.cps[0]?.name, 40)}</span>
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
                                {/* <Image className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" width={24} height={24} /> */}
                                {allSvgs.eyeIcon}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={50} className="text-center">
                        <span className="flex justify-center font-semibold text-[red]">No meetings found</span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
          <ResponsivePagination current={currentPage} total={allMeetings?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
        </div>
      </div>

      <Transition appear show={meetingModal} as={Fragment}>
        <Dialog as="div" open={meetingModal} onClose={() => setMeetingModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center md:px-4 ">
              <Dialog.Panel as="div" className="panel my-32 w-5/6 space-x-6 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:w-4/6 lg:w-3/6 2xl:w-2/6">
                <div className="my-2 flex items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                  <div className="ms-6 text-[22px] font-bold capitalize leading-none text-[#000000] dark:text-slate-300">Meeting Details</div>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark-light " onClick={() => setMeetingModal(false)}>
                    {allSvgs.closeIconSvg}
                  </button>
                </div>

                <div className="basis-[100%]">
                  <div className={`${meetingInfo?.meeting_status === 'pending' && 'md:flex'}  w-full justify-between space-y-6 pb-6 `}>
                    <div className="leftdata">
                      <p>
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000] dark:text-slate-400 ">
                          Shoot : <span className="text-[14px] font-normal text-[#000000] dark:text-slate-400">{meetingInfo?.order?.name}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000] dark:text-slate-400">
                          Meeting Link :{' '}
                          <a href={meetingInfo?.meetLink || ''} target={0} className="text-[14px] font-normal text-blue-600 underline ">
                            {meetingInfo?.meetLink}
                          </a>
                        </span>
                      </p>

                      <p className="mt-2 ">
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000] dark:text-slate-400 ">
                          Time : <span className="text-[14px] font-normal leading-[28px] text-[#000000] dark:text-slate-400"> {myFormattedDateTime?.time}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[14px] font-bold capitalize leading-none text-[#000000] dark:text-slate-400">
                          Date : <span className="text-[14px] font-normal leading-[28px] text-[#000000] dark:text-slate-400"> {myFormattedDateTime?.date}</span>
                        </span>
                      </p>
                      <div className="mt-3 flex justify-between">
                        <span className=" text-[14px]  font-bold capitalize leading-none text-[#000000] dark:text-slate-400">
                          Status:{' '}
                          <span className="ps-2 font-normal text-[#0E1726]">
                            <StatusBg>{meetingInfo?.meeting_status}</StatusBg>
                          </span>
                        </span>
                        {meetingInfo.link ? <span className=" block font-sans text-[14px] font-bold leading-[18.2px] text-[#000000]">Link: {meetingInfo.link}</span> : ''}
                      </div>
                    </div>

                    {/* Resheduling */}
                    <div className="mr-4">
                      {authPermissions?.includes('meeting_details_reschedule') && (
                        <>
                          {meetingInfo?.meeting_status === 'pending' && (userData?.role === 'cp' || 'admin') && (
                            <div className="ml-2 flex flex-col items-start">
                              <h2 className="mb-3 text-[14px] font-semibold capitalize leading-none text-[#000000] dark:text-slate-400">Reschedule Meeting</h2>
                              <div className="flex flex-col">
                                <input
                                  type="text"
                                  id="meeting_time_shoot_details"
                                  ref={meetingDateTimeRef}
                                  // className={`w-64 rounded-md border border-solid border-[#dddddd] bg-white  p-[10px] font-sans text-[14px] font-medium leading-none text-[#000000] focus:border-[#dddddd]`}
                                  className={`w-64 rounded-md border border-solid border-[#dddddd] bg-white p-[10px] font-sans text-[14px] font-medium leading-none text-[#000000] focus:border-[#888888] dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-400 dark:focus:border-[#4b5563]`}
                                  placeholder="Meeting time"
                                  required={formattedMeetingTime}
                                />

                                {/* <button onClick={() => handelRescheduleMeeting(meetingInfo?.id)} className="btn float-left my-5 w-60 bg-black font-sans text-sm font-bold  capitalize text-white">
                                  Reschedule Request
                                </button> */}
                                <DefaultButton onClick={() => handelRescheduleMeeting(meetingInfo?.id)} css="mt-2 w-64 h-9" type={'submit'}>
                                  {' '}
                                  Reschedule Request
                                </DefaultButton>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Resheduling */}
                  </div>
                  <div className="me-7 flex justify-end pb-7 md:me-5">
                    <DefaultButton onClick={() => setMeetingModal(false)} css="h-9">
                      Cancel
                    </DefaultButton>
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
