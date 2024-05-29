import 'tippy.js/dist/tippy.css';
import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Pagination from '@/components/Pagination';
import StatusBg from '@/components/Status/StatusBg';

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
            // console.log("Clicked allDusputes");

        } catch (error) {
            console.error(error);
        }
    };

    // console.log("----->", desputes);

    // get single despute dynamically
    const getSingleDesputeDetails = async (disputeId: string) => {
        // setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}disputes/${disputeId}`);
            const disputeDetailsRes = await response.json();


            if (!disputeDetailsRes) {
                console.log(response);
                // setShowError(true);
                // setLoading(false);
            } else {
                // console.log("Single Dispute Clicked.", disputeDetailsRes);
                disputeModal(true);
                setDisputeInfo(disputeDetailsRes);

                // setMeetingInfo(meetingDetailsRes);
                // setLoading(false);
                // handleNext();
            }
        } catch (error) {
            console.error(error);
            //   setLoading(false);
        }
    };

    // console.log(`Dispute Single Data Details: ${JSON.stringify(disputeInfo)}`);
    console.log(disputeInfo);


    // previous code
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 
    // const shootEndTime = disputeInfo?.order_id?.shoot_datetimes[0].end_date_time;
    const shootStartTime = disputeInfo?.createdAt;
    // console.log(shootEndTime);


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

                                    {/* <td>
                                        {new Date(despute?.createdAt).toLocaleString()}
                                    </td> */}
                                    <td>
                                        {new Date(dispute?.updatedAt).toLocaleString()}
                                    </td>

                                    <td className={((dispute?.status) == 'pending') ? `text-orange-400` : 'text-success'}>
                                        {dispute?.status}
                                    </td>
                                    {/*  getMeetingDetails(meeting.id) */}
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
                            <Dialog.Panel as="div" className="panel my-8 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pt-8 pb-16">
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
                                    <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>Shoot Name: {disputeInfo?.order_id?.order_name}</h2>
                                    {/*  */}
                                    <div className='flex justify-between'>


                                        {/* -----------------> */}
                                        <div className=''>

                                            <div className="my-[5px]">
                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[6px]">Reason for dispute</h2>
                                                <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>{disputeInfo?.reason}</p>
                                            </div>


                                            <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[6px]">Dispute Orders Info</h2>
                                            <span className='text-[14px] leading-[18.2px] text-[#000000] my-[10px] block '>Status:
                                                <span className='ps-1 text-[12px]'>
                                                    <StatusBg>{disputeInfo?.status}</StatusBg>
                                                </span>
                                            </span>

                                            <span className='text-[14px] leading-[18.2px] text-[#000000] block'>Dispute Amount:
                                                ${disputeInfo?.order_id?.shoot_cost}
                                            </span>
                                        </div>

                                        <div>
                                            {/* -----------------> */}

                                            {/* ---------- */}
                                            <div className="md:pe-40">
                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[10px]">Dispute Timings:</h2>
                                                <span className='text-[14px] leading-[18.2px] text-[#000000] mb-[10px] block'> Created at :
                                                    <span className='ps-1'>
                                                        {makeDateFormat(shootStartTime)?.time} of
                                                    </span>
                                                    <span className='ps-1'>
                                                        {makeDateFormat(shootStartTime)?.date}
                                                    </span>
                                                </span>

                                                <h2 className="text-[16px] font-bold leading-none capitalize text-[#000000] mb-[6px]">decision</h2>
                                                <p className='text-[14px] font-regular leading-[28px] text-[#000000]'>
                                                    {disputeInfo?.order_id?.order_status}
                                                </p>

                                                <button onClick={() => disputeModal(false)} type="submit" className="btn mt-22  bg-black font-sans text-white float-right">
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
