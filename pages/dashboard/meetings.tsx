import React, { useEffect, useState, Fragment, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import { useForm } from 'react-hook-form';

const Meeting = () => {
    const [myMeetings, setMyMeetings] = useState<MeetingResponsTypes[]>([]);
    const [userId, setUserId] = useState('');
    const [rescheduleMeetingTime, setrescheduleMeetingTime] = useState('');
    const [meetingInfo, setMeetingInfo] = useState<any>({});
    const [showError, setShowError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [meetingModal, setmeetingModal] = useState(false);

    useEffect(() => {
        getAllMyMeetings();
    }, [userId]);
    useEffect(() => {
        getUserId();
    }, []);

    // Getting dateTime value
    const dateTimeRef:any = useRef(null);

    const handleButtonChange = () => {
        const dateTimeValue = dateTimeRef.current.value;
        const selectedDate = new Date(dateTimeValue);
        const scheduleDate = selectedDate.toISOString();
        setrescheduleMeetingTime(scheduleDate);
    }
    const requestData = {
        requested_by: 'cp',
        requested_time:rescheduleMeetingTime,
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

            if (userId) {
                const response = await fetch(
                    `${API_ENDPOINT}meetings?sortBy=createdAt:desc&limit=30&user=${userId}`,
                );
                const allShots = await response.json();
                setMyMeetings(prevMeetings => {
                    const newMeetings = allShots.results.filter(
                        (meeting:MeetingResponsTypes) => !prevMeetings.some(prevMeeting => prevMeeting.id === meeting.id),
                    );
                    return [...prevMeetings, ...newMeetings];
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getUserId = async () => {
        try {
            if (typeof window !== 'undefined') {
                setUserId(localStorage && (localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') as string).id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Meeting Single
    const router = useRouter();

    const getMeetingDetails = async (meetingId:string) => {
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
                setmeetingModal(true)
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

                            {
                                myMeetings?.map(meeting =>
                                    <tr
                                        key={meeting.id}
                                        className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                        <td className="min-w-[150px] text-black dark:text-white">
                                            <div className="flex items-center">
                                                <p className="whitespace-nowrap">{meeting.order.id}</p>
                                            </div>
                                        </td>
                                        <td>
                                            {new Date(meeting?.meeting_date_time,).toDateString()}
                                        </td>
                                        <td>
                                            {new Date(meeting?.meeting_date_time,).toTimeString()}
                                        </td>
                                        <td className="text-success">{meeting?.meeting_status}</td>
                                        <td>
                                            <button type="button" className="p-0" onClick={() => getMeetingDetails(meeting.id)}>
                                                <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>

                    <ul className="m-auto inline-flex items-center space-x-1 rtl:space-x-reverse mt-5">
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                                    <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                1
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-[#C5965C] px-3.5 py-2 font-semibold text-white transition dark:bg-[#C5965C] dark:text-white-light">
                                2
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                3
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                                    <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
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
                                    <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">Meeting Details</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setmeetingModal(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>meeting with {meetingInfo?.client?.name}</h2>
                                    <div>
                                        <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'>Meeting Date:
                                            <strong>{new Date(meetingInfo?.meeting_date_time).toDateString()}</strong>
                                        </span>
                                        <span className='text-[14px] leading-[18.2px] text-[#000000] block'>Meeting Time: <strong>{new Date(meetingInfo?.meeting_date_time,).toTimeString()}</strong></span>
                                    </div>
                                    <div className="mt-[30px]">
                                        <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">meeting note</h2>
                                        <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestias. Ipsa esse suscipit quos voluptatibus et soluta itaque consequatur! Rerum aperiam rem possimus amet aspernatur beatae maxime aliquam architecto repellendus dolorem. Officiis, similique quidem. Sed, at quis. Perferendis commodi excepturi explicabo! Nisi iure ad dolorum totam ducimus eaque necessitatibus ab?</p>
                                    </div>
                                    <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[15px] mt-[30px]">Reschedule Meeting</h2>
                                    <form action="">
                                        <input className='text-[#000000] text-[14px] font-medium leading-none py-[10px] px-[15px] border border-solid border-[#dddddd] rounded-[10px] bg-white focus:border-[#dddddd]' type="datetime-local" name="dateTime" id="datetime" ref={dateTimeRef} onChange={handleButtonChange} />
                                    </form>
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
