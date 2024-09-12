import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { API_ENDPOINT } from '@/config';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import useDateFormat from '@/hooks/useDateFormat';
import StatusBg from '@/components/Status/StatusBg';
import { useAuth } from '@/contexts/authContext';
import Swal from 'sweetalert2';
import ResponsivePagination from 'react-responsive-pagination';
import PreLoader from '@/components/ProfileImage/PreLoader';
import { useGetAllTransactionQuery, useUpdateTransactionStatusMutation } from '@/Redux/features/transaction/transactionApi';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

const Transactions = () => {
  const dispatch = useDispatch();
  const { userData, authPermissions } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutInfo, setPayoutInfo] = useState<any>({});
  const [selectedPayoutInfo, setSelectedPayoutInfo] = useState<Payouts | null>(null);
  const statusRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeArr, setCodeArr] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setPageTitle('Transactions'));
  });

  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      search: query,
      userData
    }),
    [currentPage, query, userData]
  );

  const { data: allPayments, isLoading: isAllPaymentLoading, refetch } = useGetAllTransactionQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  })
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

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
      {/* Simple */}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Transactions Table</h5>
        </div>
        <div className="table-responsive mb-5">
          <table>
            <thead>
              <tr>
                <th>Account / Card Number</th>
                <th>Account Type</th>
                <th>Account Holder</th>
                <th>Withdraw Ammount</th>
                <th>Status</th>
                {userRole === 'admin' && authPermissions?.includes('edit_transactions') && (
                  <th className="text-center">Edit</th>
                )}
              </tr>
            </thead>

            <tbody>
              {isAllPaymentLoading ? (
                <>
                  <PreLoader></PreLoader>
                </>
              ) : (
                <>
                  {allPayments?.results && allPayments?.results?.length > 0 ? (
                    allPayments?.results?.map((data: any) => {
                      return (
                        <tr key={data.id}>
                          <td>
                            <div className="whitespace-nowrap">{data?.cardNumber ? data?.cardNumber : data?.accountNumber}</div>
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
                        <span className="text-[red] font-semibold flex justify-center"> No transactions found </span>
                      </td>
                    </tr>
                  )}

                </>
              )}


            </tbody>
          </table>

          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination
              current={currentPage}
              total={allPayments?.totalPages || 1}
              onPageChange={handlePageChange}
              maxWidth={400}
            />
          </div>

        </div>
        {/* show code part  starts */}
      </div>

      {/* details show for each payouts edit */}
      <Transition appear show={payoutModal} as={Fragment}>
        <Dialog as="div" open={payoutModal} onClose={() => setPayoutModal(false)}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-4/5 md:w-5/6 lg:w-4/6 2xl:w-2/5 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark ">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className="ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Payout Details</h2>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setPayoutModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                {/* show content */}
                <div className="basis-[49%]">
                  <div className={`w-12/12 justify-between `}>
                    <div className="w-12/12 mx-6 space-y-2 dark:text-white">
                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Holder</span>
                          <input
                            value={selectedPayoutInfo?.accountHolder}
                            className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.accountNumber ? (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Number</span>
                            <input
                              value={selectedPayoutInfo?.accountNumber}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">card Number</span>
                            <input
                              value={selectedPayoutInfo?.cardNumber}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Type </span>
                          <input
                            value={selectedPayoutInfo?.accountType == 'debitCard' ? 'Card' : 'Bank'}
                            className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.bankName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Bank Name</span>
                            <input
                              value={selectedPayoutInfo?.bankName}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.branchName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Branch Name </span>
                            <input
                              value={selectedPayoutInfo?.branchName}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}
                      </div>
                      {/*  */}
                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Withdraw Amount</span>
                          <input
                            value={selectedPayoutInfo?.withdrawAmount}
                            className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        <div className="mt-3 flex flex-col md:mt-0">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Status</span>
                          <select
                            ref={statusRef}
                            className=" h-9 w-54 rounded border border-gray-300 bg-gray-50 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0"
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
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Phone Number</span>
                            <input
                              value={selectedPayoutInfo?.phoneNumber}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.cvc && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">CVC</span>
                            <input
                              value={selectedPayoutInfo?.cvc}
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">date</span>
                          <input
                            // value={selectedPayoutInfo?.date}
                            value={payoutDate?.date}
                            className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
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
                              className=" h-9 w-54 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex justify-center md:justify-end md:mt-0">
                        <DefaultButton onClick={() => handleUpdateTestSubmit(selectedPayoutInfo?.id)} type="submit">Update</DefaultButton>
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
