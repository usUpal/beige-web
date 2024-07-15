import 'tippy.js/dist/tippy.css';
import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import StatusBg from '@/components/Status/StatusBg';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useDateFormat from '@/hooks/useDateFormat';
import ResponsivePagination from 'react-responsive-pagination';


const Disputes = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Disputes'));
    });

    const [disputeModal, setDisputeModal] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [desputes, setDesputes] = useState<MeetingResponsTypes[]>([]);
    const [disputeInfo, setDisputeInfo] = useState<any>({});

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

        } catch (error) {
            console.error(error);
        }
    };

    // get single despute dynamically
    const getSingleDesputeDetails = async (disputeId: string) => {

        try {
            const response = await fetch(`${API_ENDPOINT}disputes/${disputeId}`);
            const disputeDetailsRes = await response.json();

            if (!disputeDetailsRes) {
                console.log(response);
            } else {
                setDisputeModal(true);
                setDisputeInfo(disputeDetailsRes);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // previous code
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // get Time Hooks
    const inputedDesputeDate = disputeInfo?.createdAt;
    const formattedDateTime = useDateFormat(inputedDesputeDate);

        return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

            {/* Recent Orders */}
            <div className="panel h-full w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-xl font-bold dark:text-white-light">All Disputes</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th className='font-semibold text-[16px]'>Reason</th>
                                <th className='font-semibold text-[16px]'>Created Date</th>
                                <th className='font-semibold text-[16px]'>Status</th>
                                <th className='font-semibold text-[16px]'>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {desputes?.map((dispute) => (
                                <tr key={dispute.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className=" min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <p className="whitespace-nowrap break-words" >{(dispute?.reason)}</p>
                                        </div>
                                    </td>

                                    <td>
                                        {new Date(dispute?.createdAt).toLocaleString()}
                                    </td>

                                    <td className="">
                                        <StatusBg>
                                            {dispute?.status}
                                        </StatusBg>
                                    </td>
                                    <td>
                                        <button type="button" className="p-0" onClick={() => getSingleDesputeDetails(dispute?.id)}>
                                            <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                    {/* <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} /> */}

                    <div className='mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16'>
                        <ResponsivePagination
                            current={currentPage}
                            total={totalPagesCount}
                            onPageChange={handlePageChange}
                            maxWidth={400}
                        />
                    </div>
                </div>
            </div>

            <Transition appear show={disputeModal} as={Fragment}>
                <Dialog as="div" open={disputeModal} onClose={() => setDisputeModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel as="div" className="panel my-24 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pt-8 pb-6">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 dark:bg-[#121c2c]">

                                    <div className="text-[22px] font-bold leading-none capitalize text-[#000000]">Dispute Details</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setDisputeModal(false)}>
                                        {allSvgs.closeModalSvg}
                                    </button>
                                </div>
                                <div className="px-5 mt-5">
                                    <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>Shoot Name: {disputeInfo?.order_id?.order_name}</h2>
                                    {/*  */}
                                    <div className='md:flex justify-between'>
                                        <div>
                                            <div className="mb-[5px]">

                                                <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                    Reason : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{disputeInfo?.reason}</span>
                                                </span>
                                            </div>

                                            <p>
                                                <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                    Amount : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{disputeInfo?.order_id?.shoot_cost}</span>
                                                </span>
                                            </p>

                                            <span className='text-[16px] leading-[18.2px] text-[#000000] my-[10px] block font-bold'>Status:
                                                <span className='ps-1 text-[14px] font-semibold'>
                                                    <StatusBg>{disputeInfo?.status}</StatusBg>
                                                </span>
                                            </span>
                                        </div>

                                        <div>
                                            <p>
                                                <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                    Time : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{formattedDateTime?.time}</span>
                                                </span>
                                            </p>

                                            <p>
                                                <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                    Date : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{formattedDateTime?.date}</span>
                                                </span>
                                            </p>

                                            <button onClick={() => setDisputeModal(false)} type="submit" className="btn md:mt-24 mt-8  bg-black font-sans text-white mx-auto md:me-0">
                                                Close
                                            </button>
                                            {/* </div> */}
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

export default Disputes;
