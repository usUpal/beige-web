import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const CpUsers = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [allCpUsers, setAllCpUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any | null>(null);
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
    // console.log('🚀 ~ file: users.tsx:60 ~ Users ~ formData:', formData);
    //   const [backupFootage, setBackupFootage] = useState<string>();

    useEffect(() => {
        getAllCpUsers();
    }, [currentPage]);

    // All Users
    const getAllCpUsers = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}cp`);
            const users = await response.json();
            setTotalPagesCount(users?.totalPages);
            setAllCpUsers(users.results);
            console.log(users.results);

        } catch (error) {
            console.error(error);
        }
    };

    // User Single
    // Also unUsed Function For APi
    const getUserDetails = async (singleUserId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${singleUserId}`);
            const userDetailsRes = await response.json();

            if (!userDetailsRes) {
                setShowError(true);
                setLoading(false);
            } else {
                setUserInfo(userDetailsRes);
                setLoading(false);
                setUserModal(true);
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
        userInfo?.content_verticals &&
            userInfo.content_verticals.map((content_vertical: string) => (
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

    console.log(newData);

    // unUsed Function For Api
    const submitData = async (e: any) => {
        // console.log("ADDING", addHandler(e));
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${userInfo.userId}?role=manager`, {
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
            const response = await fetch(`${API_ENDPOINT}cp/${userInfo.userId}?role=manager`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const updatedUserDetails = await response.json();
            console.log(updatedUserDetails);
            console.log('UPDATE', formData);

            // Handle the response as needed
            coloredToast('success');
        } catch (error) {
            console.error(error);
        }
    };
    console.log("==>", allCpUsers);

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
                        <span>CP</span>
                    </li>
                </ul>

                <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Content Provider</h5>
                        </div>
                        <div className="mb-5">
                            <div className="inline-block w-full">
                                <div>
                                    <div className="table-responsive">
                                        <table>
                                            <thead>
                                                <tr>
                                                    {/* <th className="font-mono">User ID</th> */}
                                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                                    <th className="font-mono">Email</th>
                                                    <th className="font-mono">Role</th>
                                                    <th className="font-mono ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                                    <th className="font-mono">Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allCpUsers
                                                    ?.map((cpUser) => (
                                                        <tr key={cpUser.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                            {/* <td className="min-w-[150px] font-sans text-black dark:text-white">
                                                                <div className="flex items-center">
                                                                    <p className="whitespace-nowrap">{cpUser?.id}</p>
                                                                </div>
                                                            </td> */}
                                                            <td>{cpUser?.userId?.name}</td>
                                                            <td>{cpUser?.userId?.email}</td>
                                                            {/* <td>{cpUser?.email}</td> */}
                                                            <td className="font-sans text-success">{cpUser?.userId?.role}</td>

                                                            <td>
                                                                <div className="font-sans">{cpUser?.isEmailVerified === true ? 'Verified' : 'Unverified'}</div>
                                                            </td>

                                                            <td>
                                                                <Link href={`cp/${cpUser?.id}`}>
                                                                    <button type="button" className="p-0">
                                                                        {allSvgs.pencilIconForEdit}
                                                                    </button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CpUsers;
