import AccessDenied from '@/components/errors/AccessDenied';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import CommonSkeleton from '@/components/skeletons/CommonSkeleton';
import { useAuth } from '@/contexts/authContext';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';
import { IRootState } from '@/store';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';

const Users = () => {
  const [userModal, setUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const router = useRouter();
  const { authPermissions, userData } = useAuth();
  const isHavePermission = authPermissions?.includes('all_users');

  const query = {
    page: currentPage,
  };
  const {
    data: getAllUser,
    isLoading: allUserIsLoading,
    error: allUserError,
  } = useGetAllUserQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('User Management'));
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (key: any, value: any) => {
    setUserInfo({
      ...userInfo,
      [key]: value,
    });
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    const updatedUserDetails = {
      id: userInfo?.id || data?.id,
      name: userInfo?.name || data?.name,
      email: userInfo?.email || data?.email,
      role: userInfo?.role || data?.role,
      location: userInfo?.location || data?.location,
      isEmailVerified: userInfo?.isEmailVerified || data?.isEmailVerified,
    };
    setUserModal(false);
  };

  const handleCreateNewCp = () => {
    // toast.warning('This page is under Development.');
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="h-[90vh]">
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-slate-400">All Users</h5>
              <div className="flex gap-2">
                <Link href="/dashboard/create-user">
                  <DefaultButton css="text-[12px] box-border md:pb-1">Create New User</DefaultButton>
                </Link>
                <Link href="/dashboard/CreateCp">
                  <DefaultButton onClick={handleCreateNewCp} css="text-[12px] box-border md:pb-1">
                    Create New Cp
                  </DefaultButton>
                </Link>
              </div>
            </div>
            <div className="">
              <div className="inline-block w-full">
                <div className="">
                  <div className="table-responsive h-[70vh]">
                    <table>
                      <thead>
                        <tr className=" text-black dark:text-white-dark">
                          <th className=" hidden md:block">User ID</th>
                          <th className=" ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="">Email</th>
                          <th className="">Role</th>
                          <th className=" hidden ltr:rounded-r-md rtl:rounded-l-md md:block">Status</th>
                          {authPermissions?.includes('edit_all_users') && <th className="">View</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {allUserIsLoading ? (
                          <>
                            {Array.from({ length: 8 }).map((_, index) => (
                              <CommonSkeleton key={index} col={5} />
                            ))}
                          </>
                        ) : (
                          getAllUser?.results?.map((user: any) => (
                            <tr key={user.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-slate-300 group-hover:dark:text-dark-light">
                                <p className="flex items-center break-all">{user?.id}</p>
                              </td>
                              <td>{user?.name}</td>
                              <td className="min-w-[150px] break-all">{user?.email}</td>
                              <td className="font-sans text-success">{user?.role}</td>
                              <td className="hidden md:block">
                                <div className="font-sans ">
                                  {/* <StatusBg>{user?.isEmailVerified === true ? 'Verified' : 'Unverified'}</StatusBg> */}
                                  <span className={`badge text-md w-12 ${!user?.isEmailVerified ? 'bg-slate-300' : 'bg-success'} text-center`}>
                                    {user?.isEmailVerified === true ? 'Verified' : 'Unverified'}
                                  </span>
                                </div>
                              </td>
                              {authPermissions?.includes('edit_all_users') && (
                                <td>
                                  <button
                                    onClick={() => {
                                      if (user?.role === 'cp') {
                                        router.push(`/dashboard/cp/${user?.id}`);
                                      } else {
                                        setUserInfo(user);
                                        setUserModal(true);
                                      }
                                    }}
                                    type="button"
                                    className="p-0"
                                  >
                                    {allSvgs.eyeIcon}
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {/*  */}
                    {/* <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} /> */}
                  </div>
                  <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                    <ResponsivePagination current={currentPage} total={getAllUser?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
                  </div>
                </div>

                {/* modal Starts*/}
                <Transition appear show={userModal} as={Fragment}>
                  <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                      <div className="flex min-h-screen items-start justify-center md:px-4">
                        <Dialog.Panel as="div" className="panel my-24 w-10/12 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:w-3/5 xl:w-3/6 2xl:w-2/6">
                          <div className="my-2 flex items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                            <div className="ms-3 text-[22px] font-bold capitalize leading-none text-[#000000] dark:text-slate-300"> users details </div>
                            <button type="button" className="text-white-dark hover:text-dark-light" onClick={() => setUserModal(false)}>
                              {allSvgs.closeIconSvg}
                            </button>
                          </div>
                          <div className="">
                            {/* <div className='mx-6 pb-6'> */}
                            <form onSubmit={handleSubmit(onSubmit)} className="mx-6 pb-6 text-black dark:text-white-dark">
                              <div className="mx-auto mt-2 box-border gap-5 space-y-5 pb-6 md:flex md:space-y-0 ">
                                <div className="left w-full  space-y-4">
                                  <div className="mt-[5px] w-full">
                                    <label htmlFor="id" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      User id
                                    </label>
                                    <p className="focus:border-gray-400mt-1 rounded border p-3 text-black focus:outline-none dark:border-gray-600 dark:text-slate-400 ">{userInfo?.id}</p>
                                  </div>
                                  <div className="w-full">
                                    <label htmlFor="name" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      Name
                                    </label>
                                    <p className="mt-1 rounded border p-3 text-black focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:text-slate-400">{userInfo?.name}</p>
                                  </div>

                                  <div className="w-full">
                                    <label htmlFor="email" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      email
                                    </label>
                                    <p className="mt-1 rounded border p-3 text-black focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:text-slate-400 ">{userInfo?.email}</p>
                                  </div>
                                </div>

                                <div className="right w-full space-y-4">
                                  <div className="w-full">
                                    <label htmlFor="isEmailVerified" className="mb-0 w-1/4 font-sans text-[14px] capitalize rtl:ml-2 md:w-full">
                                      Email Verified
                                    </label>
                                    <p className="mt-1 w-full rounded border p-3 text-black dark:border-gray-600 dark:text-slate-400">{userInfo?.isEmailVerified === 'true' ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div className="w-full">
                                    <label htmlFor="role" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      role
                                    </label>
                                    <p className="mt-1 w-full rounded border p-3 text-black dark:border-gray-600 dark:text-slate-400">{userInfo?.role}</p>
                                  </div>

                                  <div className="w-full">
                                    <label htmlFor="location" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      Address
                                    </label>
                                    <p className="mt-1 rounded border p-3 text-black dark:border-gray-600 dark:text-slate-400">{userInfo?.location}</p>
                                  </div>
                                </div>
                              </div>
                            </form>

                            {/* <div>
                              <DefaultButton css="mb-5 h-9 float-right me-[4%]">close</DefaultButton>
                            </div> */}
                          </div>
                        </Dialog.Panel>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
                {/* modal ends*/}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
