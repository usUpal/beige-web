import 'tippy.js/dist/tippy.css';
import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Pagination from '@/components/Pagination';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Disputes'));
    });

    const [meetingModal, disputeModal] = useState(false);

    // --------------->
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [desputes, setDesputes] = useState<MeetingResponsTypes[]>([]);

    useEffect(() => {
        getAllDusputes();
    }, [currentPage]);

    // All Meetings
    const getAllDusputes = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}disputes?sortBy=createdAt:desc&limit=10&page=${currentPage}`);
            const allDusputes = await response.json();
            setTotalPagesCount(allDusputes?.totalPages);
            setDesputes(allDusputes.results);
            // console.log(allDusputes);

        } catch (error) {
            console.error(error);
        }
    };

    console.log("----->", desputes);


    // previous code
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                <th>Reason</th>
                                <th>Updated Date</th>
                                {/* <th>Shoot Date:</th> */}
                                {/* <th>Disputed Ammount</th> */}
                                <th>Status</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>

                            {desputes?.map((despute) => (
                                <tr key={despute.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className=" min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <p className="whitespace-nowrap break-words" >{(despute?.reason)}</p>
                                        </div>
                                    </td>

                                    {/* <td>
                                        {new Date(despute?.createdAt).toLocaleString()}
                                    </td> */}
                                    <td>
                                        {new Date(despute?.updatedAt).toLocaleString()}
                                    </td>

                                    <td className={((despute?.status) == 'pending') ? `text-orange-400` : 'text-success'}>
                                        {despute?.status}
                                    </td>

                                    <td>
                                        <button type="button" className="p-0" onClick={() => disputeModal(true)}>
                                            <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon" />
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
