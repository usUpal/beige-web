import 'tippy.js/dist/tippy.css';
import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Pagination from '@/components/Pagination';
import StatusBg from '@/components/Status/StatusBg';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
// import allSvgs from '@/utils/allsvgs/allSvgs';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Disputes'));
    });

    const [meetingModal, disputeModal] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [desputes, setDesputes] = useState<MeetingResponsTypes[]>([]);
    const [disputeInfo, setDisputeInfo] = useState<any>({});

    // all svg imports
    // const [closeModalSvg] = allSvgs();


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
                disputeModal(true);
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

    const shootStartTime = disputeInfo?.createdAt;
    const shootUpdatedTime = disputeInfo?.updatedAt;

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
                                <th>Status</th>
                                <th>View</th>
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
                                        {new Date(dispute?.updatedAt).toLocaleString()}
                                    </td>

                                    <td className={((dispute?.status) == 'pending') ? `text-orange-400` : 'text-success'}>
                                        {dispute?.status}
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

                    <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} />
                </div>
            </div>

            <Transition appear show={meetingModal} as={Fragment}>
                <Dialog as="div" open={meetingModal} onClose={() => disputeModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel as="div" className="panel my-24 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pt-8  pb-6">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 dark:bg-[#121c2c]">

                                    <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">Dispute Details</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => disputeModal(false)}>
                                        {allSvgs.closeModalSvg}
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>Shoot Name: {disputeInfo?.order_id?.order_name}</h2>
                                    {/*  */}
                                    <div className='flex justify-between'>
                                        <div>
                                            <div className="my-[5px]">
                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[6px]">Reason for dispute</h2>
                                                <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>{disputeInfo?.reason}</p>
                                            </div>

                                            <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[6px]">Dispute Orders Info</h2>

                                            <span className='text-[14px] my-[10px] leading-[18.2px] text-[#000000] block'>Dispute Amount:
                                                ${disputeInfo?.order_id?.shoot_cost}
                                            </span>

                                            <span className='text-[14px] leading-[18.2px] text-[#000000] my-[10px] block '>Status:
                                                <span className='ps-1 text-[12px]'>
                                                    <StatusBg>{disputeInfo?.status}</StatusBg>
                                                </span>
                                            </span>
                                        </div>

                                        <div>
                                            <div className="md:pe-40">
                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">Dispute Timings:</h2>
                                                <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block '> Created at :

                                                    <span className=''>
                                                        <span className='ps-1'>
                                                            {makeDateFormat(shootUpdatedTime)?.time} of
                                                        </span>
                                                        <span className='ps-1'>
                                                            {makeDateFormat(shootUpdatedTime)?.date}
                                                        </span>
                                                    </span>

                                                    <div className='mt-[8px]'>
                                                        <span >
                                                            Updated at :
                                                            <span className='ps-1'>
                                                                {makeDateFormat(shootStartTime)?.time} of
                                                            </span>
                                                            <span className='ps-1'>
                                                                {makeDateFormat(shootStartTime)?.date}
                                                            </span>
                                                        </span>
                                                    </div>

                                                </span>

                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mt-4">decision</h2>
                                                <p className='text-[14px] font-regular leading-[28px] text-[#000000] mt-1 mb-8'>
                                                    {disputeInfo?.order_id?.order_status}
                                                </p>

                                                <button onClick={() => disputeModal(false)} type="submit" className="btn mt-22  bg-black font-sans text-white">
                                                    Close
                                                </button>
                                            </div>
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
