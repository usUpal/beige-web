import AccessDenied from '@/components/errors/AccessDenied';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import CommonSkeleton from '@/components/skeletons/CommonSkeleton';
import StatusBg from '@/components/Status/StatusBg';
import { useAuth } from '@/contexts/authContext';
import useDateFormat from '@/hooks/useDateFormat';
import { useGetAllTransactionQuery, useUpdateTransactionStatusMutation } from '@/Redux/features/transaction/transactionApi';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';

const Transactions = () => {
  const dispatch = useDispatch();
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('transactions_page');
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [payoutModal, setPayoutModal] = useState(false);
  const [selectedPayoutInfo, setSelectedPayoutInfo] = useState<Payouts | null>(null);
  const statusRef = useRef(null);

  useEffect(() => {
    dispatch(setPageTitle('Transactions'));
  });

  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      search: query,
      userData,
    }),
    [currentPage, query, userData]
  );

  const {
    data: allPayments,
    isLoading: isAllPaymentLoading,
    refetch,
  } = useGetAllTransactionQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [updateTransactionStatus, { isLoading: updateTransactionStatusLoading, isError: updateTransactionStatusError }] = useUpdateTransactionStatusMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getSoloPayoutDetails = (id: string) => {
    const selectedPayout = allPayments?.results?.find((payout: any) => payout?.id === id);
    if (selectedPayout) {
      setSelectedPayoutInfo(selectedPayout);
      setPayoutModal(true);
    }
  };

  // TIME FORMATING
  const createdAtDate = useDateFormat(selectedPayoutInfo?.createdAt);
  const payoutDate = useDateFormat(selectedPayoutInfo?.date);
  const updatedDate = useDateFormat(selectedPayoutInfo?.updatedAt);

  const handleUpdateTestSubmit = async (id: string) => {
    try {
      const selectedStatus = statusRef.current?.value;
      const result = updateTransactionStatus({ id, status: selectedStatus });

      setPayoutModal(false);
      refetch();
      toast.success('Payment status update successfully');
    } catch (error) {
      toast.error('Something want wrong...!');
      console.error('Patch error:', error);
    }
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid h-[90vh] grid-cols-1 gap-6 xl:grid-cols-1">
      {/* Simple */}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-slate-400">Transactions Table</h5>
        </div>
        <div className="table-responsive mb-5 h-[75vh]">
          <table className="">
            <thead>
              <tr className="text-black dark:text-white-dark">
                <th>Account / Card Number</th>
                <th>Account Type</th>
                <th>Account Holder</th>
                <th>Withdraw Ammount</th>
                <th>Status</th>
                {userRole === 'admin' && authPermissions?.includes('edit_transactions') && <th className="text-center">Edit</th>}
              </tr>
            </thead>

            <tbody className="">
              {isAllPaymentLoading ? (
                <>
                  {/* <PreLoader></PreLoader> */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <CommonSkeleton key={index} col={5} />
                  ))}
                </>
              ) : (
                <>
                  {allPayments?.results && allPayments?.results?.length > 0 ? (
                    allPayments?.results?.map((data: any) => {
                      return (
                        <tr key={data.id} className="group text-black dark:text-white-dark dark:hover:text-dark-light">
                          <td>
                            <div className="whitespace-nowrap dark:text-slate-300 group-hover:dark:text-dark-light">{data?.cardNumber ? data?.cardNumber : data?.accountNumber}</div>
                          </td>
                          <td>{data?.accountType == 'debitCard' ? 'Card' : 'Bank'}</td>
                          <td>{data?.accountHolder}</td>
                          <td>{data?.withdrawAmount}</td>

                          <td>
                            <StatusBg>{data?.status}</StatusBg>
                          </td>
                          {userRole === 'admin' && authPermissions?.includes('edit_transactions') && (
                            <td className="text-center">
                              <button type="button" onClick={() => getSoloPayoutDetails(data?.id)}>
                                {allSvgs.editPen}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={50} className="text-center">
                        <span className="flex justify-center font-semibold text-[red]"> No transactions found </span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
          <ResponsivePagination current={currentPage} total={allPayments?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
        </div>
        {/* show code part  starts */}
      </div>

      {/* details show for each payouts edit */}
      <Transition appear show={payoutModal} as={Fragment}>
        <Dialog as="div" open={payoutModal} onClose={() => setPayoutModal(false)}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-4/5 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark md:w-5/6 lg:w-4/6 2xl:w-2/5 ">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className="ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000] dark:text-white-dark">Payout Details</h2>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark-light" onClick={() => setPayoutModal(false)}>
                    {allSvgs.closeIconSvg}
                  </button>
                </div>

                {/* show content */}
                <div className="basis-[49%]">
                  <div className={`w-12/12 justify-between `}>
                    <div className="w-12/12 mx-6 space-y-2 dark:text-white">
                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Account Holder</span>
                          <input
                            value={selectedPayoutInfo?.accountHolder}
                            className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.accountNumber ? (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Account Number</span>
                            <input
                              value={selectedPayoutInfo?.accountNumber}
                              className="- w-54 h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">card Number</span>
                            <input
                              value={selectedPayoutInfo?.cardNumber}
                              className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Account Type </span>
                          <input
                            value={selectedPayoutInfo?.accountType == 'debitCard' ? 'Card' : 'Bank'}
                            className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500  focus:border-gray-500 focus:outline-none  dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.bankName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Bank Name</span>
                            <input
                              value={selectedPayoutInfo?.bankName}
                              className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.branchName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Branch Name </span>
                            <input
                              value={selectedPayoutInfo?.branchName}
                              className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none  dark:border-[#2a2e3e] dark:bg-[#1b2e4b]  dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}
                      </div>
                      {/*  */}
                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Withdraw Amount</span>
                          <input
                            value={selectedPayoutInfo?.withdrawAmount}
                            className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                            disabled
                          />
                        </div>

                        <div className="mt-3 flex flex-col md:mt-0">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Status</span>
                          <select
                            ref={statusRef}
                            className="- h-9  w-72 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0"
                            name="status"
                            defaultValue={selectedPayoutInfo?.status}
                          >
                            <option value={'pending'}>Pending</option>
                            <option value={'canceled'}>Canceled</option>
                            <option value={'paid'}>Paid</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.phoneNumber && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">Phone Number</span>
                            <input
                              value={selectedPayoutInfo?.phoneNumber}
                              className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.cvc && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">CVC</span>
                            <input
                              value={selectedPayoutInfo?.cvc}
                              className="- w-54 h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none  dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000] dark:text-white-dark">date</span>
                          <input
                            // value={selectedPayoutInfo?.date}
                            value={payoutDate?.date}
                            className="- w-54  h-9 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] text-black hover:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-[#2a2e3e] dark:bg-[#1b2e4b] dark:text-slate-300 md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        {selectedPayoutInfo?.expireDate && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">expireDate</span>
                            <input
                              value={selectedPayoutInfo?.expireDate}
                              className=" w-54 h-9 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72 "
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex justify-center md:mt-0 md:justify-end">
                        <DefaultButton onClick={() => handleUpdateTestSubmit(selectedPayoutInfo?.id)} type="submit" css="h-9">
                          Update
                        </DefaultButton>
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

export default Transactions;
