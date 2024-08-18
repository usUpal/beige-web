import { Fragment, useEffect, useRef, useState } from 'react';
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

const Transactions = () => {
  const dispatch = useDispatch();
  const { userData } = useAuth();
  console.log(userData);
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [allPayouts, setAllPayouts] = useState<Payouts[]>([]);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutInfo, setPayoutInfo] = useState<any>({});
  const [selectedPayoutInfo, setSelectedPayoutInfo] = useState<Payouts | null>(null);
  const statusRef = useRef(null);

  useEffect(() => {
    getAllPayouts();
  }, [currentPage]);

  // 2024-07-03T12:22:20.145Z

  const getAllPayouts = async () => {
    let url;
    if (userRole == 'manager'){
      url = `${API_ENDPOINT}payout`;
    }else{
      url = `${API_ENDPOINT}payout?userId=${userData?.id}`;
    }

    try {
      const response = await fetch(url);
      const myAllPayouts = await response.json();
      setTotalPagesCount(myAllPayouts?.totalPages);
      setAllPayouts(myAllPayouts?.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle('Transactions'));
  });

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const [codeArr, setCodeArr] = useState<string[]>([]);
  const toggleCode = (name: string) => {
    if (codeArr.includes(name)) {
      setCodeArr((value) => value.filter((d) => d !== name));
    } else {
      setCodeArr([...codeArr, name]);
    }
  };

  // taking solo or single payout details to a state
  const getSoloPayoutDetails = (id: string) => {
    const selectedPayout = allPayouts?.find((payout) => payout?.id === id);

    if (selectedPayout) {
      setSelectedPayoutInfo(selectedPayout);
      setPayoutModal(true);
    }
  };

  // TIME FORMATING
  const createdAtDate = useDateFormat(selectedPayoutInfo?.createdAt);
  const payoutDate = useDateFormat(selectedPayoutInfo?.date);
  const updatedDate = useDateFormat(selectedPayoutInfo?.updatedAt);

  console.log(selectedPayoutInfo?.updatedAt);

  // update the status-only
  const handleUpdateTestSubmit = async (id: string) => {
    const selectedStatus = statusRef.current?.value;

    try {
      const patchResponse = await fetch(`${API_ENDPOINT}payout/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!patchResponse.ok) {
        throw new Error('Failed to patch data');
      }

      const updatedPayoutRes = await patchResponse.json();

      // console.log(updatedPayoutRes);

      setAllPayouts((prevPayouts) => {
        return prevPayouts.map((payout) => (payout.id === id ? { ...payout, status: updatedPayoutRes.status } : payout));
      });
      setPayoutModal(false);
      coloredToast('success', 'Payment status update successfully');
    } catch (error) {
      console.error('Patch error:', error);
    }
  };

  const coloredToast = (color: any, message: string) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`,
      },
    });
    toast.fire({
      title: message,
    });
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
                { (userRole === 'manager') ? <th className="text-center">Edit</th> : null } 
              </tr>
            </thead>

            <tbody>
              {allPayouts.map((data) => {
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
                    {(userRole === 'manager') ?
                    <td className="text-center">
                      <button type="button" onClick={() => getSoloPayoutDetails(data?.id)}>
                        {allSvgs.pencilIconForEdit}
                      </button>
                    </td> : null }
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* show code part  starts */}
      </div>

      {/* details show for each payouts edit */}
      <Transition appear show={payoutModal} as={Fragment}>
        <Dialog as="div" open={payoutModal} onClose={() => setPayoutModal(false)}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-24 w-3/6 overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark md:w-3/6 2xl:w-3/6">
                <div className="flex items-center justify-between bg-[#fbfbfb] py-4 dark:bg-[#121c2c]">
                  <h2 className="ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Payout Details</h2>
                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setPayoutModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                {/* show content */}
                <div className="basis-[49%]">
                  <div className={`w-12/12 me-6 justify-between `}>
                    <div className="w-12/12 mx-6 space-y-2 pb-5 dark:text-white">
                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Holder</span>
                          <input
                            value={selectedPayoutInfo?.accountHolder}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
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
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">card Number</span>
                            <input
                              value={selectedPayoutInfo?.cardNumber}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Type </span>
                          <input
                            value={selectedPayoutInfo?.accountType == 'debitCard' ? 'Card' : 'Bank'} 
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
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
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.branchName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Branch Name </span>
                            <input
                              value={selectedPayoutInfo?.branchName}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
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
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        <div className="mt-3 flex flex-col md:mt-0">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Status</span>
                          <select
                            ref={statusRef}
                            className=" h-9 w-72 rounded border border-gray-300 bg-gray-50 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0"
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
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        {selectedPayoutInfo?.cvc && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">CVC</span>
                            <input
                              value={selectedPayoutInfo?.cvc}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      {/* <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">user Id</span>
                          <input
                            value={selectedPayoutInfo?.userId}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">id</span>
                          <input
                            value={selectedPayoutInfo?.id}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div> */}

                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">date</span>
                          <input
                            // value={selectedPayoutInfo?.date}
                            value={payoutDate?.date}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        {/* <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">created date</span>
                          <input
                            // value={selectedPayoutInfo?.createdAt}
                            value={createdAtDate?.date}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div> */}

                      </div>
                      {/*  */}
                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        {selectedPayoutInfo?.expireDate && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">expireDate</span>
                            <input
                              value={selectedPayoutInfo?.expireDate}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        {/* <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">updatedAt</span>
                          <input
                            // value={selectedPayoutInfo?.updatedAt}
                            value={updatedDate?.date}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div> */}

                      </div>

                      <div className="mt-8 flex justify-end md:mt-0">
                        <button
                          type="submit"
                          className="btn flex items-center justify-center rounded-lg bg-black text-[13px] font-bold capitalize text-white"
                          onClick={() => handleUpdateTestSubmit(selectedPayoutInfo?.id)}
                        >
                          Update
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

export default Transactions;
