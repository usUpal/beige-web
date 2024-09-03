import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import StatusBg from '@/components/Status/StatusBg';
import { Dialog, Transition } from '@headlessui/react';
import useDateFormat from '@/hooks/useDateFormat';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import ResponsivePagination from 'react-responsive-pagination';

const Users = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [backupFootage, setBackupFootage] = useState<string>();

  // time formation
  const inputDate = userInfo?.createdAt;
  // console.log("🚀 ~ Users ~ inputDate:", inputDate)
  const formattedDateTime = useDateFormat(inputDate);

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  // All Users
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}users?limit=10&page=${currentPage}`);
      const users = await response.json();
      setTotalPagesCount(users?.totalPages);
      setAllUsers(users.results);
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();
  // User Single
  // Also unUsed Function For APi
  const getUserDetails = async (singleUserId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}users/${singleUserId}`);
      const userDetailsRes = await response.json();

      if (!userDetailsRes) {
        setShowError(true);
        setLoading(false);
      } else {
        setUserInfo(userDetailsRes);
        setLoading(false);
        // if the user is cp then route to cp details router
        if (userDetailsRes.role === 'cp') {
          const cpRoute = `cp/${userDetailsRes?.id}`;
          router.push(cpRoute);
        } else {
          setUserModal(true);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Client Dashboard'));
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // for pagination
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
    console.log('🚀 ~ onSubmit ~ updatedUserDetails:', updatedUserDetails);
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
            <span>All Users</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">All Users</h5>
              <div className="flex gap-2">
                <Link href="/manager/create-user">
                  <button className="rounded-md border-2 border-[#b7aa85] px-4 py-1 text-[#b7aa85]">Create New User</button>
                </Link>
                <button className=" rounded-md border-2 border-[#b7aa85] px-4 py-1 text-[#b7aa85]"> Create New Cp</button>
              </div>
            </div>
            <div className="mb-5">
              <div className="inline-block w-full">
                <div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="hidden font-mono md:block">User ID</th>
                          <th className="font-mono ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="font-mono">Email</th>
                          <th className="font-mono">Role</th>
                          <th className="hidden font-mono ltr:rounded-r-md rtl:rounded-l-md md:block">Status</th>
                          <th className="font-mono">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers?.map((user) => (
                          <tr key={user.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="hidden min-w-[150px] font-sans text-black dark:text-white md:block">
                              <div className="flex items-center">
                                <p className="whitespace-nowrap">{user?.id}</p>
                              </div>
                            </td>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                            <td className="font-sans text-success">{user?.role}</td>
                            <td className="hidden md:block">
                              <div className="font-sans ">
                                {/* <StatusBg>{user?.isEmailVerified === true ? 'Verified' : 'Unverified'}</StatusBg> */}
                                <span className={`badge text-md w-12 ${!user?.isEmailVerified ? 'bg-slate-300' : 'bg-success'} text-center`}>
                                  {user?.isEmailVerified === true ? 'Verified' : 'Unverified'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <button onClick={() => getUserDetails(user.id)} type="button" className="p-0">
                                {allSvgs.pencilIconForEdit}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/*  */}
                    {/* <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} /> */}

                    <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
                  </div>

                  {/* modal Starts*/}
                  <Transition appear show={userModal} as={Fragment}>
                    <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                      <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center md:px-4">
                          <Dialog.Panel as="div" className="panel my-24 w-10/12 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:w-3/5 xl:w-3/6 2xl:w-2/6">
                            <div className="my-2 flex items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                              <div className="ms-3 text-[22px] font-bold capitalize leading-none text-[#000000]"> users details </div>
                              <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModal(false)}>
                                {allSvgs.closeModalSvg}
                              </button>
                            </div>
                            <div className="">
                              {/* <div className='mx-6 pb-6'> */}
                              <form onSubmit={handleSubmit(onSubmit)} className="mx-6 pb-6">
                                <div className="mx-auto mt-2 box-border gap-5 space-y-5 pb-6 md:flex md:space-y-0 ">
                                  <div className="left w-full  space-y-4">
                                    <div className="mt-[5px] w-full">
                                      <label htmlFor="id" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        User id
                                      </label>
                                      <p className="focus:border-gray-400mt-1 rounded border p-3 text-gray-600 focus:outline-none">{userInfo?.id}</p>
                                    </div>
                                    <div className="w-full">
                                      <label htmlFor="name" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        Name
                                      </label>
                                      <p className="mt-1 rounded border p-3 text-gray-600 focus:border-gray-400  focus:outline-none">{userInfo?.name}</p>
                                    </div>

                                    <div className="w-full">
                                      <label htmlFor="email" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        email
                                      </label>
                                      <p className="mt-1 rounded border p-3 text-gray-600 focus:border-gray-400  focus:outline-none">{userInfo?.email}</p>
                                    </div>
                                  </div>

                                  <div className="right w-full space-y-4">
                                    <div className="w-full">
                                      <label htmlFor="isEmailVerified" className="mb-0 w-1/4 font-sans text-[14px] capitalize rtl:ml-2 md:w-full">
                                        Email Verified
                                      </label>
                                      <p className="ms-12 mt-1 w-full rounded border p-3 text-gray-600 md:ms-0">{userInfo?.isEmailVerified === 'true' ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className="w-full">
                                      <label htmlFor="role" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        role
                                      </label>
                                      <p className="ms-12 mt-1 w-full rounded border p-3 text-gray-600 md:ms-0">{userInfo?.role}</p>
                                    </div>

                                    <div className="w-full">
                                      <label htmlFor="location" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        Address
                                      </label>
                                      <p className="mt-1 rounded border p-3 text-gray-600">{userInfo?.location}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button type="submit" className="btn bg-black font-sans capitalize  text-white md:block ">
                                    Save
                                  </button>
                                </div>
                              </form>
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
