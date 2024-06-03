import React, { useEffect, useState, Fragment, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import Pagination from '@/components/Pagination';
import StatusBg from '@/components/Status/StatusBg';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useDateFormat from '@/hooks/useDateFormat';

const Meeting = () => {
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  // console.log("🚀 ~ Meeting ~ totalPagesCount:", totalPagesCount)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [myMeetings, setMyMeetings] = useState<MeetingResponsTypes[]>([]);
  const [rescheduleMeetingTime, setrescheduleMeetingTime] = useState('');
  const [meetingInfo, setMeetingInfo] = useState<any>({});
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [meetingModal, setmeetingModal] = useState(false);
  const { userData } = useAuth();
  const dispatch = useDispatch();

  // --> All SVG files imports

  // times and date
  const myInputDate = (meetingInfo?.meeting_date_time);
  const myFormattedDateTime = useDateFormat(myInputDate);
  
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
        // console.log(response);
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
  // left only for table
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
  // console.log(myMeetings);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Orders */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Meeting List</h5>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr className=''>
                <th className='font-semibold text-[16px]'>Order Name</th>
                <th className='font-semibold text-[16px]'>Meeting Date / Time</th>
                <th className='font-semibold text-[16px]'>Attendings</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md font-semibold text-[16px]">Status</th>
                <th className='font-semibold text-[16px]'>View</th>
              </tr>
            </thead>
            <div>

            </div>
            <tbody>
              {myMeetings?.map((meeting) => (
                <tr key={meeting.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td className=" min-w-[150px] text-black dark:text-white">
                    <div className="flex items-center">
                      <p className="whitespace-nowrap break-words" >{(meeting?.order?.name).length > 10 ? (meeting?.order?.name) : 'less than 10 character'}</p>
                    </div>
                  </td>

                  <td>
                    {/* {myFormattedDateTime?.date} */}

                    <span className='ps-2'>Date:{makeDateFormat(meeting?.meeting_date_time)?.date}
                    </span>
                    <span className='ps-2'>Time:{makeDateFormat(meeting?.meeting_date_time)?.time}
                    </span>
                    {/* <span className='ps-2'>Time: {myFormattedDateTime?.time}</span> */}
                    {/* {useDateFormat(meeting?.meeting_date_time)} */}


                  </td>

                  <td>
                    <p className="whitespace-nowrap">
                      {meeting?.client?.name} with
                      <span className='ps-1'>{
                        (meeting?.cps[1]?.name) ?
                          (meeting?.cps[1]?.name) : (meeting?.cps[0]?.name)
                      }
                      </span>
                    </p>
                  </td>

                  <td>
                    <div>
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
            <div className="flex min-h-screen items-start justify-center md:px-4 ">
              <Dialog.Panel as="div" className="panel my-24 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">

                <div className="flex my-2 items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                  <div className="text-[22px] font-bold capitalize leading-none text-[#000000] ms-3">Meeting Details</div>
                  <button type="button" className="text-white-dark hover:text-dark" onClick={() => setmeetingModal(false)}>

                    {allSvgs.closeModalSvg}

                  </button>
                </div>

                <div className="basis-[50%]">

                  <h2 className="mx-6 mb-[12px] text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Meeting with <span className='text-[#ACA686] capitalize'>{meetingInfo?.client?.name}</span></h2>

                  <div className='mx-6 pb-6'>
                    <p>
                      <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                        Order : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{meetingInfo?.order?.name}</span>
                      </span>
                    </p>

                    <div className='md:flex justify-between mb-[7px]'>
                      <p>
                        <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                          Time : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'> {myFormattedDateTime?.time}</span>
                        </span>
                      </p>
                      <p>
                        <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                          Date : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'> {myFormattedDateTime?.date}</span>
                        </span>
                      </p>

                    </div>

                    <div className="flex justify-between">

                      <span className=" text-[16px] font-bold leading-none capitalize text-[#000000]">
                        Status: <span className='ps-2 text-[#0E1726] font-semibold'><StatusBg>{meetingInfo?.meeting_status}</StatusBg></span>
                      </span>

                      {meetingInfo.link ?
                        <span className=" block font-sans text-[16px] leading-[18.2px] text-[#000000]">
                          Link: {meetingInfo.link}
                        </span>
                        : ''
                      }

                    </div>

                    {/* Resheduling */}
                    <div className=''>
                      <div className='flex flex-col items-start mt-5'>
                        <h2 className=" mb-[15px] mt-[30px] text-[16px] font-bold capitalize leading-none text-[#000000]">Reschedule Meeting</h2>
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

                      <button onClick={() => setmeetingModal(false)} type="submit" className="btn bg-black font-sans text-white mx-auto md:me-0 mt-0 hidden md:block">
                        Close
                      </button>

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
