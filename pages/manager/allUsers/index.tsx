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
import Pagination from '@/components/Pagination';
import { useForm } from 'react-hook-form';

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
    const inputDate = (userInfo?.createdAt);
    console.log("🚀 ~ Users ~ inputDate:", inputDate)
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
            [key]: value
        });
    }

    const { register, handleSubmit } = useForm();
    const onSubmit = (data: any) => {
        const updatedUserDetails = {
            id: userInfo?.id || data?.id,
            name: userInfo?.name || data?.name,
            email: userInfo?.email || data?.email,
            role: userInfo?.role || data?.role,
            location: userInfo?.location || data?.location,
            isEmailVerified: userInfo?.isEmailVerified || data?.isEmailVerified,
        }
        console.log("🚀 ~ onSubmit ~ updatedUserDetails:", updatedUserDetails);
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
                        </div>
                        <div className="mb-5">
                            <div className="inline-block w-full">
                                <div>
                                    <div className="table-responsive">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className="font-mono hidden md:block">User ID</th>
                                                    <th className="font-mono ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                                    <th className="font-mono">Email</th>
                                                    <th className="font-mono">Role</th>
                                                    <th className="font-mono ltr:rounded-r-md rtl:rounded-l-md hidden md:block">Status</th>
                                                    <th className="font-mono">Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsers
                                                    ?.map((user) => (
                                                        <tr key={user.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                            <td className="min-w-[150px] font-sans text-black dark:text-white hidden md:block">
                                                                <div className="flex items-center">
                                                                    <p className="whitespace-nowrap">{user?.id}</p>
                                                                </div>
                                                            </td>
                                                            <td>{user?.name}</td>
                                                            <td>{user?.email}</td>
                                                            <td className="font-sans text-success">{user?.role}</td>
                                                            <td className='hidden md:block'>
                                                                <div className="font-sans ">
                                                                    <StatusBg>{user?.isEmailVerified === true ? 'Verified' : 'Unverified'}</StatusBg>
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
                                        <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} />
                                    </div>

                                    {/* modal Starts*/}
                                    <Transition appear show={userModal} as={Fragment}>
                                        <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                                            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                                <div className="flex min-h-screen items-start justify-center md:px-4">

                                                    <Dialog.Panel as="div" className="panel my-32 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark w-10/12 md:w-3/5 xl:w-3/6 2xl:w-2/6"
                                                    >
                                                        <div className="flex my-2 items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                                                            <div className="text-[22px] font-bold capitalize leading-none text-[#000000] ms-3"> users details </div>
                                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModal(false)}>
                                                                {allSvgs.closeModalSvg}
                                                            </button>
                                                        </div>
                                                        <div className="">
                                                            <h2 className="mx-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Detail Information of {userInfo?.name} </h2>
                                                            {/* <div className='mx-6 pb-6'> */}
                                                            <form onSubmit={handleSubmit(onSubmit)} className='mx-6 pb-6'>
                                                                <div
                                                                    className='md:flex justify-between mx-auto pb-6 space-y-5 md:space-y-0 box-border px-6'>
                                                                    <div className="left space-y-4 ">
                                                                        {/* Id */}
                                                                        <div className="">
                                                                            <label htmlFor="id" className=" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize">
                                                                                User id
                                                                            </label>
                                                                            <input
                                                                                {...register("id")}
                                                                                defaultValue={userInfo?.id}
                                                                                className='border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400 mt-1 bg-gray-200'
                                                                                onChange={(e) => handleInputChange('id', e.target.value)}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                        {/* Name */}
                                                                        <div className="">
                                                                            <label htmlFor="name" className=" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize">
                                                                                Name
                                                                            </label>
                                                                            <input
                                                                                {...register("name")}
                                                                                defaultValue={userInfo?.name}
                                                                                className='border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1'
                                                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                                            />
                                                                        </div>

                                                                        {/*Email*/}
                                                                        <div className="">
                                                                            <label htmlFor="email" className=" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize">
                                                                                email
                                                                            </label>
                                                                            <input
                                                                                {...register("email")}
                                                                                defaultValue={userInfo?.email}
                                                                                className='border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1'
                                                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="right space-y-4">
                                                                        {/*Email Varified*/}
                                                                        <div className="">
                                                                            <label htmlFor="isEmailVerified" className="mb-0 font-sans text-[14px] rtl:ml-2 w-1/4 md:w-full capitalize"
                                                                            >
                                                                                Email Verified
                                                                            </label>
                                                                            <select
                                                                                className='border rounded p-3 focus:outline-none focus:border-gray-400 ms-12 md:ms-0 mt-1 w-56'
                                                                                id="isEmailVerified"
                                                                                defaultValue={userInfo?.isEmailVerified}
                                                                                {...register('isEmailVerified')}
                                                                                onChange={(e) => handleInputChange('isEmailVerified', e.target.value)}
                                                                            >
                                                                                <option value="true">Yes</option>
                                                                                <option value="false">No</option>
                                                                            </select>
                                                                        </div>
                                                                        {/*Role*/}
                                                                        <div className="">
                                                                            <label htmlFor="role" className=" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize"
                                                                            >
                                                                                role
                                                                            </label>
                                                                            <select
                                                                                className='border rounded p-3 focus:outline-none focus:border-gray-400 ms-12 md:ms-0 mt-1 w-56'
                                                                                id="role"
                                                                                defaultValue={userInfo?.role}
                                                                                {...register('role')}
                                                                                onChange={(e) => handleInputChange('role', e.target.value)}
                                                                            >
                                                                                <option value="manager">Manager</option>
                                                                                <option value="user">User</option>
                                                                                <option value="cp">Cp</option>
                                                                            </select>
                                                                        </div>

                                                                        {/*Address*/}
                                                                        <div className="">
                                                                            <label htmlFor="location" className=" mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize">
                                                                                Address
                                                                            </label>
                                                                            <input
                                                                                {...register("location")}
                                                                                defaultValue={userInfo?.location}
                                                                                className='border rounded p-3 focus:outline-none text-gray-600 focus:border-gray-400  mt-1 '
                                                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                                            />
                                                                        </div>

                                                                        <div className="">
                                                                            <button type="submit" className="btn bg-black font-sans text-white mb-4 capitalize md:block mt-5">
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </div>
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
