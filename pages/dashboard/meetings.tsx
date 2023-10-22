import React, { useEffect, useState, Fragment, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';

const Meeting = () => {
  const [myMeetings, setMyMeetings] = useState<MeetingResponsTypes[]>([]);
  const [rescheduleMeetingTime, setrescheduleMeetingTime] = useState('');
  const [meetingInfo, setMeetingInfo] = useState<any>({});
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [meetingModal, setmeetingModal] = useState(false);

  const { userData } = useAuth();

  useEffect(() => {
    getAllMyMeetings();
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
      const response = await fetch(`${API_ENDPOINT}meetings/user/${userData?.id}?sortBy=createdAt:desc&limit=18`);
      const allMeetings = await response.json();
      setMyMeetings((prevMeetings) => {
        const newMeetings = allMeetings.results.filter((meeting: MeetingResponsTypes) => !prevMeetings.some((prevMeeting) => prevMeeting.id === meeting.id));
        return [...prevMeetings, ...newMeetings];
      });
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Meetings'));
  });

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
                <th>Order ID</th>
                <th>Meeting Date</th>
                <th>Meeting Time</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {myMeetings?.map((meeting) => (
                <tr key={meeting.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td className="min-w-[150px] text-black dark:text-white">
                    <div className="flex items-center">
                      <p className="whitespace-nowrap">{meeting.order.id}</p>
                    </div>
                  </td>
                  <td>{new Date(meeting?.meeting_date_time).toDateString()}</td>
                  <td>{new Date(meeting?.meeting_date_time).toTimeString()}</td>
                  <td className="text-success">{meeting?.meeting_status}</td>
                  <td>
                    <button type="button" className="p-0" onClick={() => getMeetingDetails(meeting.id)}>
                      <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="m-auto mt-5 inline-flex items-center space-x-1 rtl:space-x-reverse">
            <li>
              <button
                type="button"
                className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                  <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
              >
                1
              </button>
            </li>
            <li>
              <button type="button" className="flex justify-center rounded bg-[#ACA686] px-3.5 py-2 font-semibold text-white transition dark:bg-[#ACA686] dark:text-white-light">
                2
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
              >
                3
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                  <path d="M11 19L17 12L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <Transition appear show={meetingModal} as={Fragment}>
        <Dialog as="div" open={meetingModal} onClose={() => setmeetingModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-8 w-2/3 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <div className="cFont text-[24px] font-medium capitalize leading-none text-[#000000]">Meeting Details</div>
                  <button type="button" className="text-white-dark hover:text-dark" onClick={() => setmeetingModal(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="basis-[50%]">
                    <h2 className="mb-[20px] font-mono text-[26px] font-bold capitalize leading-[28.6px] text-[#ACA686]">meeting with {meetingInfo?.client?.name}</h2>
                    <div>
                      <span className="mb-[10px] block font-sans text-[14px] leading-[18.2px] text-[#000000]">
                        Meeting Date:
                        <strong>{new Date(meetingInfo?.meeting_date_time).toDateString()}</strong>
                      </span>
                      <span className="block font-sans text-[14px] leading-[18.2px] text-[#000000]">
                        Meeting Time: <strong>{new Date(meetingInfo?.meeting_date_time).toTimeString()}</strong>
                      </span>
                    </div>
                    <h2 className="mb-[15px] mt-[30px] font-mono text-[16px] font-bold capitalize leading-none text-[#000000]">Reschedule Meeting</h2>
                    <form action="">
                      <input
                        className="rounded-[10px] border border-solid border-[#dddddd] bg-white px-[15px] py-[10px] font-sans text-[14px] font-medium leading-none text-[#000000] focus:border-[#dddddd]"
                        type="datetime-local"
                        name="dateTime"
                        id="datetime"
                        ref={dateTimeRef}
                        onChange={handleButtonChange}
                      />
                    </form>
                  </div>
                  <div className="customWave relative basis-[50%]">
                    <img src="/assets/images/lightbox4.jpeg" alt="bg-img" className="h-full rounded-[15px] object-cover" />
                    <div className="glass absolute left-1/2 top-1/2 h-[260px] w-11/12 -translate-x-1/2 -translate-y-1/2">
                      <p className="absolute left-1/2 top-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 p-5 text-center font-sans text-[15px] font-medium leading-[28px] text-[#ffffff]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestias. Ipsa esse suscipit quos voluptatibus et soluta itaque consequatur!
                      </p>
                    </div>

                    <div className="ribbon">
                      <span>Meeting Note</span>
                    </div>
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
