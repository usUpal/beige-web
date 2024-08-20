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
import { useAuth } from '@/contexts/authContext';

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

  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;
  //   console.log(userData);

  // all disputes user base
  const getAllDusputes = async () => {
    let url = `${API_ENDPOINT}disputes?sortBy=createdAt:desc&limit=10&page=${currentPage}`;
    if (userRole === 'client' || userRole === 'cp') {
      url = `${API_ENDPOINT}disputes/user/${userData?.id}?sortBy=createdAt:desc&limit=10&page=${currentPage}`;
    }
    // console.log('🚀 ~ getAllMyShoots ~ url:', url);
    try {
      const response = await fetch(url);
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
        // console.log(response);
      } else {
        setDisputeModal(true);
        setDisputeInfo(disputeDetailsRes);
        console.log('disputeDetailsRes', disputeDetailsRes);
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
                <th className="text-[16px] font-semibold">Reason</th>
                <th className="text-[16px] font-semibold">Created Date </th>
                <th className="text-[16px] font-semibold">Status</th>
                <th className="text-[16px] font-semibold">View</th>
              </tr>
            </thead>
            <tbody>

              {desputes && desputes.length > 0 ? (

                desputes?.map((dispute) => (
                  <tr key={dispute.id ? dispute?.id : dispute?._id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className=" min-w-[150px] text-black dark:text-white">
                      <div className="flex items-center">
                        <p className="whitespace-nowrap break-words">{dispute?.reason}</p>
                      </div>
                    </td>

                    <td>
                      {new Date(dispute?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}{' '} ,
                      Time: {new Date(dispute?.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                    </td>



                    <td className="">
                      <StatusBg>{dispute?.status}</StatusBg>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="p-0"
                        onClick={() => {
                          dispute?.id ? getSingleDesputeDetails(dispute?.id) : getSingleDesputeDetails(dispute?._id);
                        }}
                      >
                        <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                      </button>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan={50} className="text-center">
                    <span className="text-[red] font-semibold flex justify-center"> No desputes found </span>
                  </td>
                </tr>
              )}



            </tbody>
          </table>

          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
          </div>
        </div>
      </div>

      {/* Dispute Detailss */}
      <Transition appear show={disputeModal} as={Fragment}>
        <Dialog as="div" open={disputeModal} onClose={() => setDisputeModal(false)}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-3/6 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark md:w-3/6 2xl:w-2/6">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className=" ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Addons Details </h2>

                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setDisputeModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                <div className=" px-5">
                  {/* <h2 className="mb-[20px] text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Shoot Name: {disputeInfo?.order_id?.order_name}</h2> */}
                  {/*  */}
                  <div className="flex gap-5 mt-0 mx-auto  space-y-5 md:space-y-0 box-border">
                    <div className='left space-y-4 w-full'>
                      <div className="mb-[5px]  w-full">
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px] w-full">
                          <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Reason </span>
                          <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{disputeInfo?.reason}</span>
                        </span>
                      </div>

                      {/* <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px]">
                        <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"'> Client Id  </span>
                        <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{clientUserInfo?.id}</span>
                      </span> */}

                      <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px] w-full">
                        <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'>  Amount  </span>
                        <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{disputeInfo?.order_id ? disputeInfo?.order_id?.shoot_cost : 0}</span>
                      </span>

                      {/* <span className="my-[10px] block text-[16px] font-bold leading-[18.2px] text-[#000000]">
                        Status:
                        <span className="ps-1 text-[14px] font-semibold">
                          <StatusBg>{disputeInfo?.status}</StatusBg>
                        </span>
                      </span> */}
                    </div>

                    <div className='right space-y-4 w-full'>

                      <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px] w-full">
                        <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'>  Amount  </span>
                        <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{disputeInfo?.status}</span>
                      </span>
                      {/* <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Time : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{formattedDateTime?.time}</span>
                        </span>
                      </p> */}

                      <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px] w-full">
                        <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'>  Amount  </span>
                        <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{formattedDateTime?.time}</span>
                      </span>

                      {/* <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Date : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{formattedDateTime?.date}</span>
                        </span>
                      </p> */}
                      {/* </div> */}
                    </div>
                  </div>
                  <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px] w-full">
                    <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'>  Amount  </span>
                    <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600 ms-12 md:ms-0  w-full">{formattedDateTime?.date}</span>
                  </span>

                  <button onClick={() => setDisputeModal(false)} type="submit" className="btn flex justify-end bg-black font-sans text-white md:me-0 md:mt-[35px] ml-auto">
                    Close
                  </button>
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
