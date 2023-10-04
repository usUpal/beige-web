import {useEffect, useState, Fragment} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch} from 'react-redux';
import {setPageTitle} from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Meetings'));
    });

    const [meetingModal, setmeetingModal] = useState(false);

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

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">13245</p>
                                    </div>
                                </td>
                                <td>23/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => setmeetingModal(true)}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </button>
                                </td>
                            </tr>

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">6789</p>
                                    </div>
                                </td>
                                <td>25/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => setmeetingModal(true)}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </button>
                                </td>
                            </tr>

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">98765</p>
                                    </div>
                                </td>
                                <td>27/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => setmeetingModal(true)}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <Transition appear show={meetingModal} as={Fragment}>
                <Dialog as="div" open={meetingModal} onClose={() => setmeetingModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
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
                                        <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>meeting with mr brian</h2>
                                        <div>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'>Order ID: <strong>21345</strong></span>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'>Meeting Date: <strong>23/09/2023</strong></span>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] block'>Meeting Time: <strong>09:30 PM</strong></span>
                                        </div>
                                        <div className="mt-[30px]">
                                            <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">meeting note</h2>
                                            <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestias. Ipsa esse suscipit quos voluptatibus et soluta itaque consequatur! Rerum aperiam rem possimus amet aspernatur beatae maxime aliquam architecto repellendus dolorem. Officiis, similique quidem. Sed, at quis. Perferendis commodi excepturi explicabo! Nisi iure ad dolorum totam ducimus eaque necessitatibus ab?</p>
                                        </div>
                                        <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[15px] mt-[30px]">Reschedule Meeting</h2>
                                        <input className='text-[#000000] text-[18px] font-medium leading-none py-[15px] px-[30px] border border-solid border-[#000000] rounded-[15px] bg-white' type="datetime-local" name="dateTime" id="datetime" />
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
