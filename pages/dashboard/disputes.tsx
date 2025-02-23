import DefaultButton from '@/components/SharedComponent/DefaultButton';
import StatusBg from '@/components/Status/StatusBg';
import { useAuth } from '@/contexts/authContext';
import useDateFormat from '@/hooks/useDateFormat';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';

import AccessDenied from '@/components/errors/AccessDenied';
import CommonSkeleton from '@/components/skeletons/CommonSkeleton';
import { useGetAllDisputesQuery, useLazyGetDisputesDetailsQuery, useUpdateDisputeStatusMutation } from '@/Redux/features/dispute/disputeApi';
import { IRootState } from '@/store';
import { toast } from 'react-toastify';
const Disputes = () => {
  const [disputeModal, setDisputeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [desputes, setDesputes] = useState<MeetingResponsTypes[]>([]);
  const [disputeInfo, setDisputeInfo] = useState<any>({});
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('disputes_page');
  const dispatch = useDispatch();
  const statusRef = useRef(null);
  useEffect(() => {
    dispatch(setPageTitle('Disputes'));
  });

  const query = {
    currentPage,
    userData,
  };
  const {
    data: allDisputes,
    isLoading: getAllDisputesLoading,
    refetch,
  } = useGetAllDisputesQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const [getDisputesDetails, { isLoading: getDisputeDetailsLoading }] = useLazyGetDisputesDetailsQuery();

  const [updateDisputeStatus, { isLoading: updateDisputeStatusLoading, isError: updateDisputeStatusError }] = useUpdateDisputeStatusMutation();

  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  const getSingleDesputeDetails = async (disputeId: string) => {
    const res = await getDisputesDetails(disputeId);
    setDisputeModal(true);
    setDisputeInfo(res?.data);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateStatusSubmit = async (id: string) => {
    try {
      const selectedStatus = statusRef.current?.value;
      const result = await updateDisputeStatus({ id, status: selectedStatus });

      toast.success('Dispute status updated successfully');
      setDisputeModal(false);
      refetch();
    } catch (error) {
      toast.error('Something went wrong!');
      // console.error('Patch error:', error);
    }
  };

  // get Time Hooks
  const inputedDesputeDate = disputeInfo?.createdAt;
  const formattedDateTime = useDateFormat(inputedDesputeDate);

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid h-[90vh] grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-slate-400">All Disputes</h5>
        </div>
        <div className=" h-[75vh]">
          <table>
            <thead>
              <tr className="text-black dark:text-white-dark">
                <th className="text-[16px] font-semibold">Reason</th>
                <th className="text-[16px] font-semibold">Created Date </th>
                <th className="text-[16px] font-semibold">Status</th>
                <th className="text-[16px] font-semibold">View</th>
              </tr>
            </thead>
            <tbody className="min-h-screen">
              {getAllDisputesLoading ? (
                <>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <CommonSkeleton key={index} col={3} />
                  ))}
                </>
              ) : (
                <>
                  {allDisputes?.results && allDisputes?.results.length > 0 ? (
                    allDisputes?.results?.map((dispute: any) => (
                      <tr key={dispute.id ? dispute?.id : dispute?._id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className=" min-w-[150px] text-black group-hover:text-dark-light dark:text-white-dark">
                          <p className="whitespace-nowrap break-words dark:text-slate-300 group-hover:dark:text-white-light/90 ">{dispute?.reason}</p>
                        </td>

                        <td>
                          {new Date(dispute?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} , Time:{' '}
                          {new Date(dispute?.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
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
                            {/* <Image className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" width={24} height={24} /> */}
                            {allSvgs.eyeIcon}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={50} className="text-center">
                        <span className="flex justify-center font-semibold text-[red]"> No desputes found </span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
          <ResponsivePagination current={currentPage} total={allDisputes?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
        </div>
      </div>

      {/* Dispute Detailss */}
      <Transition appear show={disputeModal} as={Fragment}>
        <Dialog as="div" open={disputeModal} onClose={() => setDisputeModal(false)}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-5/6 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark lg:w-3/6 2xl:w-2/6">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className=" ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000] dark:text-slate-400">Dispute Details </h2>

                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark-light" onClick={() => setDisputeModal(false)}>
                    {allSvgs.closeIconSvg}
                  </button>
                </div>

                <div className="mt-5 px-5">
                  {/*  */}
                  <div className="justify-between md:flex">
                    <div>
                      <div className="mb-[5px]">
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000] dark:text-white-dark">
                          Reason : <span className="text-[16px] font-semibold leading-[28px] text-[#000000] dark:text-white-dark">{disputeInfo?.reason}</span>
                        </span>
                      </div>

                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000] dark:text-white-dark">
                          Time : <span className="text-[16px] font-semibold leading-[28px] text-[#000000] dark:text-white-dark">{formattedDateTime?.time}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000] dark:text-white-dark">
                          Date : <span className="text-[16px] font-semibold leading-[28px] text-[#000000] dark:text-white-dark">{formattedDateTime?.date}</span>
                        </span>
                      </p>
                    </div>

                    <div>
                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000] dark:text-white-dark">
                          Amount : <span className="text-[16px] font-semibold leading-[28px] text-[#000000] dark:text-white-dark">{disputeInfo?.order_id ? disputeInfo?.order_id?.shoot_cost : 0}</span>
                        </span>
                      </p>

                      <div className="flex flex-col md:mt-0">
                        {userRole === 'admin' ? (
                          <>
                            <span className="my-[5px] block text-[16px] font-bold leading-[18.2px] text-[#000000] dark:text-white-dark">Status</span>
                            <select
                              ref={statusRef}
                              className="- h-9 w-auto rounded border border-gray-300 bg-slate-100 p-1 text-[13px] text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-slate-400 dark:placeholder-gray-500 dark:focus:ring-indigo-500  md:ms-0 md:w-72"
                              name="status"
                              defaultValue={disputeInfo?.status}
                            >
                              <option value={'pending'}>Pending</option>
                              <option value={'approved'}>Approved</option>
                              <option value={'rejected'}>Rejected</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <span className="my-[5px] block text-[16px] font-bold leading-[18.2px] text-[#000000]">Status:</span>
                            <StatusBg>{disputeInfo?.status}</StatusBg>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mr-0 mt-8 flex justify-center md:mr-5 md:justify-end">
                  {userRole === 'admin' && (
                    <DefaultButton onClick={() => handleUpdateStatusSubmit(disputeInfo?.id)} css="h-9" type="submit">
                      Update
                    </DefaultButton>
                  )}
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
