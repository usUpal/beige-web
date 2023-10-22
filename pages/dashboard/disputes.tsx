import 'tippy.js/dist/tippy.css';
import {useEffect, useState, Fragment} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch} from 'react-redux';
import {setPageTitle} from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Disputes'));
    });

    const [meetingModal, disputeModal] = useState(false);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

            {/* Recent Orders */}
            <div className="panel h-full w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">All Disputes</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Shoot Name:</th>
                                <th>Shoot Date:</th>
                                <th>Disputed Ammount</th>
                                <th>Status</th>
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
                                <td>Corporate photo shoot</td>
                                <td>23/09/2023</td>
                                <td className="text-success">$3400</td>
                                <td>
                                    <span className='text-[#C91E1E] text-[16px] font-medium leading-[20px] capitalize bg-[#FFEAEA] rounded-[30px] px-[15px] py-[5px]'>open</span>
                                </td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => disputeModal(true)}>
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
                                    <span className='text-[#000000] text-[16px] font-medium leading-[20px] capitalize bg-[#E0E0E0] rounded-[30px] px-[15px] py-[5px]'>Closed</span>
                                </td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => disputeModal(true)}>
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
                                    <span className='text-[#000000] text-[16px] font-medium leading-[20px] capitalize bg-[#E0E0E0] rounded-[30px] px-[15px] py-[5px]'>Closed</span>
                                </td>
                                <td>
                                    <button type="button" className="p-0" onClick={() => disputeModal(true)}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                    <ul className="m-auto inline-flex items-center space-x-1 rtl:space-x-reverse mt-5">
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                                    <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]">
                                1
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-[#ACA686] px-3.5 py-2 font-semibold text-white transition dark:bg-[#ACA686] dark:text-white-light">
                                2
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]">
                                3
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]">
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
                <Dialog as="div" open={meetingModal} onClose={() => disputeModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">Dispute Details</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => disputeModal(false)}>
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
                                        <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>Shoot Name: corporate photo shoot</h2>
                                        <div>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'>ID#: <strong>1219001</strong></span>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'>Shoot Date: <strong>23/09/2023</strong></span>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] block'>Dispute Amount: <strong>$3400</strong></span>
                                        </div>

                                        <div className="mt-[30px]">
                                            <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">Reason for dispute</h2>
                                            <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestias. Ipsa esse suscipit quos voluptatibus et soluta itaque consequatur! Rerum aperiam rem possimus amet aspernatur beatae maxime aliquam architecto repellendus dolorem. Officiis, similique quidem. Sed, at quis. Perferendis commodi excepturi explicabo! Nisi iure ad dolorum totam ducimus eaque necessitatibus ab?</p>
                                        </div>

                                        <div className="mt-[30px]">
                                            <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">decision</h2>
                                            <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, molestias. Ipsa esse suscipit quos voluptatibus et soluta itaque consequatur!</p>
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
