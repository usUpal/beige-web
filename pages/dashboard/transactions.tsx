import { Fragment, useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';

const tableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@yahoo.com',
    date: '10/08/2020',
    sale: 120,
    status: 'Complete',
    register: '5 min ago',
    progress: '40%',
    position: 'Developer',
    office: 'London',
  },
  {
    id: 2,
    name: 'Shaun Park',
    email: 'shaunpark@gmail.com',
    date: '11/08/2020',
    sale: 400,
    status: 'Pending',
    register: '11 min ago',
    progress: '23%',
    position: 'Designer',
    office: 'New York',
  },
  {
    id: 3,
    name: 'Alma Clarke',
    email: 'alma@gmail.com',
    date: '12/02/2020',
    sale: 310,
    status: 'In Progress',
    register: '1 hour ago',
    progress: '80%',
    position: 'Accountant',
    office: 'Amazon',
  },
  {
    id: 4,
    name: 'Vincent Carpenter',
    email: 'vincent@gmail.com',
    date: '13/08/2020',
    sale: 100,
    status: 'Canceled',
    register: '1 day ago',
    progress: '60%',
    position: 'Data Scientist',
    office: 'Canada',
  },
];

const Transactions = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [allPayouts, setAllPayouts] = useState<Payouts[]>([]);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutInfo, setPayoutInfo] = useState<any>({});

  //console.log(allPayouts);

  useEffect(() => {
    getAllPayouts();
  }, [currentPage]);

  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  //   payout?sortBy=createdAt:desc&userId=661e4b416970067f1739f61f&limit=1&page=2
  const getAllPayouts = async () => {
    let url = `${API_ENDPOINT}payout`;
    if (userRole === 'client' || userRole === 'cp') {
      // url = `${API_ENDPOINT}payout/user/${userData?.id}?sortBy=createdAt:desc&limit=10&page=${currentPage}`;
      //   url = `${API_ENDPOINT}payout?sortBy=createdAt:desc&${userData?.id}&limit=1&page=${currentPage}`;
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

  // get single payout dynamically
  const getSinglePayoutDetails = async (payoutId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}payout?sortBy=createdAt:desc&${payoutId}&limit=1&page=${currentPage}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const payoutDetailsRes = await response.json();

      if (payoutDetailsRes && payoutDetailsRes?.result) {
        setPayoutModal(true);
        setPayoutInfo(payoutDetailsRes?.result);
      } else {
        console.error('Unexpected response structure for payout details', payoutDetailsRes);
      }
    } catch (error) {
      console.error('Error fetching payout details:', error);
    }
  };

  //   const [selectedPayoutInfo, setSelectedPayoutInfo] = useState({});
  //   const getSoloPayoutDetails = (id: string) => {
  //     const filteredPayout: Payouts[] = allPayouts?.filter((payout) => payout?.id === id).map((payout) => payout);
  //     console.log(filteredPayout[0]);

  //     setSelectedPayoutInfo(filteredPayout[0]);
  //     setPayoutModal(true);
  //   };
  //   console.log(selectedPayoutInfo);

  const [selectedPayoutInfo, setSelectedPayoutInfo] = useState<Payouts | null>(null); // Assuming Payouts is the type of your payout object

  const getSoloPayoutDetails = (id: string) => {
    const selectedPayout = allPayouts?.find((payout) => payout?.id === id);

    if (selectedPayout) {
      setSelectedPayoutInfo(selectedPayout);
      setPayoutModal(true);
    }
  };

  // Optionally, you can use an effect to log `selectedPayoutInfo` when it changes
  useEffect(() => {
    console.log(selectedPayoutInfo);
  }, [selectedPayoutInfo]);
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
      {/* Simple */}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Transactions Table</h5>
          <button type="button" onClick={() => toggleCode('code1')} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
            <span className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                <path
                  d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Code
            </span>
          </button>
        </div>
        <div className="table-responsive mb-5">
          <table>
            <thead>
              <tr>
                <th>UserId</th>
                <th>Withdraw Ammount</th>

                <th>Account Type</th>
                <th>Account Holder</th>
                <th>Status</th>
                <th className="text-center">Edit</th>
              </tr>
            </thead>

            <tbody>
              {allPayouts.map((data) => {
                return (
                  <tr key={data.id}>
                    <td>
                      <div className="whitespace-nowrap">{data?.userId}</div>
                    </td>
                    <td>{data?.withdrawAmount}</td>
                    <td>{data?.accountType}</td>
                    <td>{data?.accountHolder}</td>

                    <td>
                      <div
                        className={`whitespace-nowrap ${
                          data.status === 'completed'
                            ? 'text-success'
                            : data.status === 'Pending'
                            ? 'text-secondary'
                            : data.status === 'In Progress'
                            ? 'text-info'
                            : data.status === 'Canceled'
                            ? 'text-danger'
                            : 'text-success'
                        }`}
                      >
                        {data.status}
                      </div>
                    </td>
                    <td className="text-center">
                      {/* <Tippy content="Edit"> */}
                      {/* <button type="button" onClick={() => getSinglePayoutDetails(data?.id)}>
                        {allSvgs.pencilIconForEdit}
                      </button> */}
                      {/* </Tippy> */}

                      <button
                        type="button"
                        //   onClick={() => getSinglePayoutDetails(data?.id)}
                        onClick={() => getSoloPayoutDetails(data?.id)}
                      >
                        {allSvgs.pencilIconForEdit}
                      </button>
                    </td>
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
                      {/* <h2 className="mb-[20px] text-[22px] font-bold capitalize leading-[28.6px] text-[#bcbaba]">Transaction of: {selectedPayoutInfo?.accountHolder}</h2> */}

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Holder</span>
                          <input
                            // {...register('accountHolder')}
                            value={selectedPayoutInfo?.accountHolder}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      {/*  */}

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.accountNumber ? (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Number</span>
                            <input
                              // {...register('accountNumber')}
                              value={selectedPayoutInfo?.accountNumber}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        ) : (
                          // {selectedPayoutInfo?.cardNumber && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">card Number</span>
                            <input
                              // {...register('cardNumber')}
                              value={selectedPayoutInfo?.cardNumber}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Account Type </span>
                          <input
                            // {...register('accountType')}
                            value={selectedPayoutInfo?.accountType}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      {/*  */}

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.bankName && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Bank Name</span>
                            <input
                              // {...register('bankName')}
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
                              // {...register('branchName')}
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
                            // {...register('withdrawAmount')}
                            value={selectedPayoutInfo?.withdrawAmount}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        <div className="mt-3 flex flex-col md:mt-0">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Status</span>
                          <select
                            {...register('status')}
                            className=" h-9 w-72 rounded border border-gray-300 bg-gray-50 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0"
                            // value={addonsInfo?.status || ''}
                            defaultValue={selectedPayoutInfo?.status}
                          >
                            <option value={'pending'}>Pending</option>
                            <option value={'cancel'}>Cancel</option>
                            <option value={'paid'}> Paid</option>
                          </select>
                        </div>
                      </div>

                      {/*  */}

                      <div className="mt-3 flex flex-col md:flex md:flex-row md:justify-between">
                        {selectedPayoutInfo?.phoneNumber && (
                          <div className="flex flex-col">
                            <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Phone Number</span>
                            <input
                              // {...register('phoneNumber')}
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
                              // {...register('cvc')}
                              value={selectedPayoutInfo?.cvc}
                              className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                              disabled
                            />
                          </div>
                        )}
                      </div>

                      {/*  */}

                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">user Id</span>
                          <input
                            // {...register('userId')}
                            value={selectedPayoutInfo?.userId}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        {/* {addonsInfo?.ExtendRateType && ( */}
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">id</span>
                          <input
                            // {...register('id')}
                            value={selectedPayoutInfo?.id}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      {/*  */}
                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">createdAt</span>
                          <input
                            // {...register('createdAt')}
                            value={selectedPayoutInfo?.createdAt}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        {/* {addonsInfo?.ExtendRateType && ( */}
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">expireDate</span>
                          <input
                            // {...register('expireDate')}
                            value={selectedPayoutInfo?.expireDate}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">date</span>
                          <input
                            // {...register('date')}
                            value={selectedPayoutInfo?.date}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>

                        {/* {addonsInfo?.ExtendRateType && ( */}
                        <div className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">updatedAt</span>
                          <input
                            // {...register('updatedAt')}
                            value={selectedPayoutInfo?.updatedAt}
                            className=" h-9 w-64 rounded border border-gray-300 bg-gray-200 p-1 text-[13px] text-gray-600 hover:text-gray-500 focus:border-gray-500 focus:outline-none md:ms-0 md:w-72"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end md:mt-0">
                        <button
                          type="submit"
                          className="btn flex items-center justify-center rounded-lg bg-black text-[13px] font-bold capitalize text-white"
                          // onClick={handleUpdateTestSubmit}
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
