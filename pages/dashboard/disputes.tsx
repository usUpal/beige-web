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
import PreLoader from '@/components/ProfileImage/PreLoader';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

import { useGetAllDisputesQuery, useLazyGetDisputesDetailsQuery } from '@/Redux/features/dispute/disputeApi';
import AccessDenied from '@/components/errors/AccessDenied';
const Disputes = () => {
  const [disputeModal, setDisputeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [desputes, setDesputes] = useState<MeetingResponsTypes[]>([]);
  const [disputeInfo, setDisputeInfo] = useState<any>({});
  const { userData,authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('disputes_page');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Disputes'));
  });

  const query = {
    currentPage,
    userData,
  }
  const { data: allDisputes, isLoading: getAllDisputesLoading } = useGetAllDisputesQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const [getDisputesDetails, { isLoading: getDisputeDetailsLoading }] = useLazyGetDisputesDetailsQuery();

  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  const getSingleDesputeDetails = async (disputeId: string) => {
    const res = await getDisputesDetails(disputeId);
    setDisputeModal(true);
    setDisputeInfo(res?.data);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // get Time Hooks
  const inputedDesputeDate = disputeInfo?.createdAt;
  const formattedDateTime = useDateFormat(inputedDesputeDate);


  if (!isHavePermission) {
    return (
      <AccessDenied />
    );
  }


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
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

              {getAllDisputesLoading ? (
                <>
                  <PreLoader></PreLoader>
                </>
              ) : (
                <>
                  {allDisputes?.results && allDisputes?.results.length > 0 ? (
                    allDisputes?.results?.map((dispute: any) => (
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

                </>
              )}

            </tbody>
          </table>

          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={allDisputes?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
          </div>
        </div>
      </div>

      {/* Dispute Detailss */}
      <Transition appear show={disputeModal} as={Fragment}>
        <Dialog as="div" open={disputeModal} onClose={() => setDisputeModal(false)}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-4/6 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark md:w-3/6 2xl:w-2/6">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className=" ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Addons Details </h2>

                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setDisputeModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                <div className="mt-5 px-5">
                  {/* <h2 className="mb-[20px] text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Shoot Name: {disputeInfo?.order_id?.order_name}</h2> */}
                  {/*  */}
                  <div className="justify-between md:flex">
                    <div>
                      <div className="mb-[5px]">
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Reason : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{disputeInfo?.reason}</span>
                        </span>
                      </div>

                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Amount : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{disputeInfo?.order_id ? disputeInfo?.order_id?.shoot_cost : 0}</span>
                        </span>
                      </p>

                      <span className="my-[10px] block text-[16px] font-bold leading-[18.2px] text-[#000000]">
                        Status:
                        <span className="ps-1 text-[14px] font-semibold">
                          <StatusBg>{disputeInfo?.status}</StatusBg>
                        </span>
                      </span>
                    </div>

                    <div>
                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Time : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{formattedDateTime?.time}</span>
                        </span>
                      </p>

                      <p>
                        <span className="text-[16px] font-bold capitalize leading-none text-[#000000]">
                          Date : <span className="text-[16px] font-semibold leading-[28px] text-[#000000]">{formattedDateTime?.date}</span>
                        </span>
                      </p>
                      {/* <DefaultButton onClick={() => setDisputeModal(false)} css=''>Close</DefaultButton> */}
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
