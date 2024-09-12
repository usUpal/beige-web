import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { useAuth } from '@/contexts/authContext';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useRouter } from 'next/router';
const Users = () => {
  const [userModalClient, setUserModalClient] = useState(false);
  const { authPermissions, userData } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientUserInfo, setClientUserInfo] = useState<any | null>(null);
  const router = useRouter();
  const query = {
    page: currentPage,
    role: 'user',
  };
  const { data: allClients } = useGetAllUserQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (!authPermissions?.includes('client_page') || userData?.role === 'user' || userData?.role === 'cp') {
      router.push('/errors/access-denied');
    }
  }, [authPermissions, userData, router]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('User Management'));
  });

  // for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-warning hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Clients</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Clients</h5>
            </div>
            <div className="mb-5">
              <div className="inline-block w-full">
                <div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="">User ID</th>
                          <th className=" ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="">Email</th>
                          <th className="">Role</th>
                          <th className=" ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                          {authPermissions?.includes('client_edit') && <th className="">View</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {allClients?.results
                          ?.filter((user: any) => {
                            return user.role === 'user';
                          })
                          ?.map((userClient: any) => (
                            <tr key={userClient.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  {/* whitespace-nowrap */}
                                  <p className="break-all">{userClient?.id}</p>
                                </div>
                              </td>

                              <td>{userClient?.name}</td>
                              <td className="min-w-[150px] break-all">{userClient?.email}</td>

                              <td className="font-sans text-success">{userClient?.role}</td>

                              <td>
                                <span className={`badge text-md w-12 ${!userClient?.isEmailVerified ? 'bg-slate-300' : 'bg-success'} text-center`}>
                                  {userClient?.isEmailVerified === true ? 'Verified' : 'Unverified'}
                                </span>
                              </td>
                              {authPermissions?.includes('client_edit') && (
                                <td>
                                  <button
                                    type="button"
                                    className="p-0"
                                    onClick={() => {
                                      setClientUserInfo(userClient);
                                      setUserModalClient(true);
                                    }}
                                  >
                                    {/* {allSvgs.editPen} */}
                                    {allSvgs.details}
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={allClients?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
                  </div>
                  {/* modal Starts*/}
                  <Transition appear show={userModalClient} as={Fragment}>
                    <Dialog as="div" open={userModalClient} onClose={() => setUserModalClient(false)}>
                      <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center md:px-4 ">
                          <Dialog.Panel as="div" className="panel my-24 w-10/12 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:w-3/5 xl:w-3/6 2xl:w-2/6">
                            <div className="my-2 flex items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                              <div className="ms-3 text-[22px] font-bold capitalize leading-none text-[#000000]">Client </div>
                              <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModalClient(false)}>
                                {allSvgs.closeModalSvg}
                              </button>
                            </div>

                            <div className="basis-[50%]">
                              <div className="mx-6 pb-6">
                                <div className="mx-auto mt-0 box-border flex-col gap-5 space-y-5  md:flex md:flex-row md:space-y-0 ">
                                  <div className="left w-full space-y-4">
                                    <span className="m-0 mt-[9px] flex flex-col text-[16px] font-bold capitalize leading-none text-[#000000]">
                                      <span className="ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"> Client Id </span>
                                      <span className="w-full rounded border  p-3 text-[16px] font-semibold leading-[28px]   text-gray-600">{clientUserInfo?.id}</span>
                                    </span>
                                    <span className="mt-0 flex flex-col text-[16px] font-bold capitalize leading-none text-[#000000] md:mt-[12px]">
                                      <span className="ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"> Name </span>
                                      <span className="w-full rounded border  p-3 text-[16px] font-semibold leading-[28px]   text-gray-600">{clientUserInfo?.name}</span>
                                    </span>
                                  </div>

                                  <div className="right w-full space-y-0 md:space-y-4">
                                    <span className="m-0 mt-1 flex flex-col gap-1 text-[16px] font-bold capitalize leading-none text-[#000000]">
                                      <span className="ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"> Role </span>
                                      <span className=" w-full rounded border  p-3 text-[16px] font-semibold leading-[28px]   text-gray-600">{clientUserInfo?.role}</span>
                                    </span>

                                    <span className="m-0 mt-1 flex flex-col gap-1 text-[16px] font-bold leading-none text-[#000000]">
                                      <span className="ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"> Address </span>
                                      <span className=" w-full rounded border  p-3 text-[16px] font-semibold leading-[28px]   text-gray-600">{clientUserInfo?.location}</span>
                                    </span>
                                  </div>
                                </div>
                                <span className="flex flex-col gap-1 text-[16px] font-bold leading-none text-[#000000]">
                                  <span className="ps-1 text-[16px] font-bold leading-[28px] text-[#000000]"> Email </span>
                                  <span className="w-full rounded border  p-3 text-[16px] font-semibold leading-[28px]   text-gray-600">{clientUserInfo?.email}</span>
                                </span>
                                <div className="btn-group flex justify-end">
                                  <DefaultButton onClick={() => setUserModalClient(false)} css="font-semibold mt-10">
                                    Close
                                  </DefaultButton>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                  {/* modal ends*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
