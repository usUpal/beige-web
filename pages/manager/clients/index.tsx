import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import useDateFormat from '@/hooks/useDateFormat';
import StatusBg from '@/components/Status/StatusBg';

const Users = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [userModalClient, setUserModalClient] = useState(false);
    const [allClients, setAllClients] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [clientUserInfo, setClientUserInfo] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({
        geo_location: {
            type: 'Point',
            coordinates: [-122.4711, 37.7745],
        },
        content_type: ['wedding', 'portrait'],
        content_verticals: ['modern', 'romanticasaa'],
        vst: ['modern wedding', 'romantic wedding'],
        shoot_availability: ['weekends', 'afternoons'],
        successful_beige_shoots: 8,
        trust_score: 4.7,
        average_rating: 4.9,
        avg_response_time: 1.5,
        equipment: ['camera', 'lens', 'tripod'],
        equipment_specific: ['Sony a7 III', 'Sony FE 85mm f/1.8'],
        portfolio: ['https://example.com/portfolio5', 'https://example.com/portfolio6'],
        total_earnings: 8000,
        backup_footage: ['https://example.com/backup5', 'https://example.com/backup6'],
        travel_to_distant_shoots: true,
        experience_with_post_production_edit: true,
        customer_service_skills_experience: true,
        team_player: false,
        avg_response_time_to_new_shoot_inquiry: 1,
        num_declined_shoots: 0,
        num_accepted_shoots: 8,
        num_no_shows: 1,
        review_status: 'rejected',
        userId: '6527c39992e911feecc30b18',
        city: 'Texas',
        neighborhood: 'Mission District',
        zip_code: '94110',
        last_beige_shoot: '61d8f4b4c8d9e6a4a8c3f7d5',
        timezone: 'PST',
        own_transportation_method: true,
        reference: 'Bob Johnson',
        created_at: '2023-10-12T10:12:23.602Z',
        createdAt: '2023-10-12T10:12:23.605Z',
        updatedAt: '2023-11-14T10:56:45.303Z',
        id: '6527c687756ec2096cac7ab2',
    });
    //   const [backupFootage, setBackupFootage] = useState<string>();

    // time formation
    const inputDate = (clientUserInfo?.createdAt);
    const formattedDateTime = useDateFormat(inputDate);

    useEffect(() => {
        getAllClients();
    }, [currentPage]);

    // All Users
    const getAllClients = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}users`);
            const users = await response.json();
            setTotalPagesCount(users?.totalPages);
            setAllClients(users.results);
        } catch (error) {
            console.error(error);
        }
    };

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
                setClientUserInfo(userDetailsRes);
                setLoading(false);
                setUserModalClient(true);
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

    // Fixing handleChange Function version --1
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prevFormData: any) => {
            // Checking For Duplicate Value
            if (Array.isArray(prevFormData[name]) && prevFormData[name].includes(value)) {
                // Deleting Duplicate Value
                const updatedArray = prevFormData[name].filter((item: any) => item !== value);
                return {
                    ...prevFormData,
                    [name]: updatedArray,
                };
            } else {
                return {
                    ...prevFormData,
                    [name]: Array.isArray(prevFormData[name]) ? [...prevFormData[name], value] : value,
                };
            }
        });
    };

    {
        clientUserInfo?.content_verticals &&
            clientUserInfo.content_verticals.map((content_vertical: string) => (
                <div className="mb-2" key={content_vertical}>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            value={content_vertical}
                            id={`checkbox_${content_vertical}`}
                            name={`checkbox_${content_vertical}`}
                            onChange={(e) => handleChange('content_verticals')}
                        />
                        <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
                    </label>
                </div>
            ));
    }

    // Success Toast
    const coloredToast = (color: any) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`,
            },
        });
        toast.fire({
            title: 'User updated successfully!',
        });
    };

    // Insert Footage
    const [newData, insertNewData] = useState<any>({});

    const addHandler = (e: any) => {
        let inputName = e.target.name;
        let val = e.target.value;

        insertNewData((prevData: any) => ({
            ...prevData,
            [inputName]: [val],
        }));
        return newData;
    };

    // console.log(newData);

    // unUsed Function For Api
    const submitData = async (e: any) => {
        // console.log("ADDING", addHandler(e));
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${clientUserInfo.userId}?role=manager`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addHandler(e)),
            });

            const updateNew = await response.json();

            // Handle the response as needed
            coloredToast('success');
        } catch (error) {
            console.error(error);
        }
    };

    // UnUsed Function for Api
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_ENDPOINT}cp/${clientUserInfo.userId}?role=manager`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const updatedUserDetails = await response.json();
            // console.log(updatedUserDetails);
            // console.log('UPDATE', formData);

            // Handle the response as needed
            coloredToast('success');
        } catch (error) {
            console.error(error);
        }
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
                                                    <th className="font-mono">User ID</th>
                                                    <th className="font-mono ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                                    <th className="font-mono">Email</th>
                                                    <th className="font-mono">Role</th>
                                                    <th className="font-mono ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                                    <th className="font-mono">Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allClients.filter((user) => {
                                                    return user.role === 'user';
                                                })
                                                    ?.map((userClient) => (
                                                        <tr key={userClient.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                            <td className="min-w-[150px] font-sans text-black dark:text-white">
                                                                <div className="flex items-center">
                                                                    <p className="whitespace-nowrap">{userClient?.id}</p>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {userClient?.name}
                                                            </td>
                                                            <td>
                                                                {userClient?.email}
                                                            </td>

                                                            <td className="font-sans text-success">
                                                                {userClient?.role}
                                                            </td>

                                                            <td>
                                                                <div className="font-sans">
                                                                    <StatusBg>{userClient?.isEmailVerified === true ? 'Verified' : 'Unverified'}</StatusBg>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <button type="button" className="p-0" onClick={() => getUserDetails(userClient.id)}>
                                                                    {allSvgs.pencilIconForEdit}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* modal Starts*/}
                                    <Transition appear show={userModalClient} as={Fragment}>
                                        <Dialog as="div" open={userModalClient} onClose={() => setUserModalClient(false)}>
                                            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                                <div className="flex min-h-screen items-start justify-center md:px-4 ">
                                                    <Dialog.Panel as="div" className="panel my-24 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">

                                                        <div className="flex my-2 items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                                                            <div className="text-[22px] font-bold capitalize leading-none text-[#000000] ms-3">Client </div>
                                                            <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModalClient(false)}>
                                                                {allSvgs.closeModalSvg}
                                                            </button>
                                                        </div>

                                                        <div className="basis-[50%]">
                                                            <h2 className="mx-6 mb-[12px] text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Detail Information of {clientUserInfo?.name} </h2>

                                                            <div className='mx-6 pb-6'>
                                                                <div className='flex justify-between'>
                                                                    <div className="left">
                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                                                Name :<span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{clientUserInfo?.name}</span>
                                                                            </span>
                                                                        </p>
                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none text-[#000000]'>
                                                                                Email :<span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{clientUserInfo?.email}</span>
                                                                            </span>
                                                                        </p>
                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none text-[#000000] capitalize'>
                                                                                Role :<span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{clientUserInfo?.role}</span>
                                                                            </span>
                                                                        </p>

                                                                    </div>

                                                                    <div className="right">

                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none text-[#000000]'>
                                                                                Time :
                                                                                <span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{formattedDateTime?.time}</span>
                                                                            </span>
                                                                        </p>
                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none text-[#000000] capitalize'>
                                                                                Date :
                                                                                <span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{formattedDateTime?.date}</span>
                                                                            </span>
                                                                        </p>
                                                                        <p>
                                                                            <span className='text-[16px] font-bold leading-none text-[#000000] capitalize'>
                                                                                Address :<span className='ps-1 text-[16px] font-semibold leading-[28px] text-[#000000]'>{clientUserInfo?.location}</span>
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="btn-group flex">
                                                                    <button onClick={() => setUserModalClient(false)} type="submit" className="btn bg-black font-sans text-white mx-auto md:me-0 mt-12 hidden md:block">
                                                                        Close
                                                                    </button>

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
