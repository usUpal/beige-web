import React, { useEffect, useState, Fragment, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import Pagination from '@/components/Pagination';
import StatusBg from '@/components/Status/StatusBg';
import { log } from 'console';

const Meeting = () => {
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [myMeetings, setMyMeetings] = useState<MeetingResponsTypes[]>([]);
  const [rescheduleMeetingTime, setrescheduleMeetingTime] = useState('');
  const [meetingInfo, setMeetingInfo] = useState<any>({});
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [meetingModal, setmeetingModal] = useState(false);
  const { userData } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMyMeetings();
  }, [currentPage]);

  useEffect(() => {
    dispatch(setPageTitle('Meetings'));
  }, []);

  // Getting dateTime value
  const dateTimeRef: any = useRef(null);

  const handleButtonChange = () => {
    const dateTimeValue = dateTimeRef.current.value;
    const selectedDate = new Date(dateTimeValue);
    const scheduleDate = selectedDate.toISOString();
    setrescheduleMeetingTime(scheduleDate);
  };
  const requestData = {
    requested_by: 'cp',
    requested_time: rescheduleMeetingTime,
  };
  // API
  const handleNext = async () => {
    if (rescheduleMeetingTime) {
      const url = `${API_ENDPOINT}meetings/schedule/${meetingInfo?.id}`;

      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // All Meetings
  const getAllMyMeetings = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}meetings?sortBy=createdAt:desc&limit=10&page=${currentPage}`);
      const allMeetings = await response.json();
      setTotalPagesCount(allMeetings?.totalPages);
      setMyMeetings(allMeetings.results);
    } catch (error) {
      console.error(error);
    }
  };

  // Meeting Single
  const router = useRouter();

  const getMeetingDetails = async (meetingId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}meetings/${meetingId}`);
      const meetingDetailsRes = await response.json();

      if (!meetingDetailsRes) {
        console.log(response);
        setShowError(true);
        setLoading(false);
      } else {
        setMeetingInfo(meetingDetailsRes);
        setLoading(false);
        setmeetingModal(true);
        handleNext();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // previous code
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // get date format
  function makeDateFormat(inputDate) {
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
      time: formattedTime
    };
  }

  const inputDate = '2024-05-29T21:00:00.000Z';
  const formattedDateTime = makeDateFormat(inputDate);

  // order string split 
  



  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Orders */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Meeting List</h5>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order Name</th>
                <th>Meeting Date / Time</th>
                <th>Meeting Client</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {myMeetings?.map((meeting) => (
                <tr key={meeting.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td className=" min-w-[150px] text-black dark:text-white">
                    <div className="flex items-center">
                      <p className="whitespace-nowrap break-words" >{(meeting?.order?.name)}</p> 
                    </div>
                  </td>

                  <td>
                    {makeDateFormat(meeting?.meeting_date_time)?.date}
                    <span className='ps-2'>Time: {makeDateFormat(meeting?.meeting_date_time)?.time}</span>
                  </td>

                  <td>
                    <p className="whitespace-nowrap">{meeting?.client?.name}</p>
                  </td>

                  <td>
                    <div className="">
                      <StatusBg>{meeting?.meeting_status}</StatusBg>
                    </div>
                  </td>

                  <td>
                    <button type="button" className="p-0" onClick={() => getMeetingDetails(meeting.id)}>
                      <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} />
        </div>
      </div>

      <Transition appear show={meetingModal} as={Fragment}>
        <Dialog as="div" open={meetingModal} onClose={() => setmeetingModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4 ">
              <Dialog.Panel as="div" className="panel my-8 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">

                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <div className="text-[22px] font-medium capitalize leading-none text-[#000000] ms-3">Meeting Details</div>
                  <button type="button" className="text-white-dark hover:text-dark" onClick={() => setmeetingModal(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="basis-[50%]">

                  <h2 className="mx-8 mb-[12px] text-[18px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Meeting with <span className='text-[#0E1726]'>   {meetingInfo?.client?.name}</span></h2>

                  <div className='mx-8 pb-6'>
                    <span className="mb-[12px] block font-sans text-[16px] leading-[18.2px] text-[#000000] font-normal">
                      Order:
                      <span className='ps-2 text-[#0E1726]'>{meetingInfo?.order?.name}</span>
                    </span>

                    {/*  */}
                    <div className='flex  justify-between mb-[12px]'>
                      <span className=" block font-sans text-[16px] leading-[18.2px] text-[#000000]" >
                        Time:
                        <span className='font-semibold ps-2'>
                          {makeDateFormat(meetingInfo?.meeting_date_time)?.time}
                        </span>
                      </span>

                      <span className=" block font-sans text-[16px] leading-[18.2px] text-[#000000]">
                        Date:
                        <span className='ps-2 text-[#0E1726] font-semibold'>
                          {makeDateFormat(meetingInfo?.meeting_date_time)?.date}
                        </span>
                      </span>
                    </div>

                    {/*  */}
                    <div className="flex justify-between">
                      <span className="  block font-sans text-[16px] leading-[18.2px] text-[#000000]">
                        Status: <span className='text-[12px]'><StatusBg>{meetingInfo?.meeting_status}</StatusBg></span>
                      </span>
                      <span className=" block font-sans text-[16px] leading-[18.2px] text-[#000000]">
                        Link: [not valid now]
                      </span>

                    </div>

                    {/* Resheduling */}
                    <div className='flex flex-col items-start mt-8'>
                      <h2 className=" mb-[15px] mt-[30px] font-mono text-[16px] font-bold capitalize leading-none text-[#000000]">Reschedule Meeting</h2>
                      <form action="" className='flex flex-col'>
                        <input
                          className="rounded-[10px] border border-solid border-[#dddddd] bg-white px-[15px] py-[10px] font-sans text-[16px] font-medium leading-none text-[#000000] focus:border-[#dddddd] w-60"
                          type="datetime-local"
                          name="dateTime"
                          id="datetime"
                          ref={dateTimeRef}
                          onChange={handleButtonChange}
                        />

                        <button type="submit" className="btn my-5 bg-black font-sans text-white float-left w-60">
                          Save
                        </button>
                      </form>
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
