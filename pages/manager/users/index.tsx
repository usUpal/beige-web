import { useEffect, useRef, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Link from 'next/link';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';

const Users = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
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
  console.log('🚀 ~ file: users.tsx:60 ~ Users ~ formData:', formData);
  const [backupFootage, setBackupFootage] = useState<string>();

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  // All Users
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}users`);
      const users = await response.json();
      setTotalPagesCount(users?.totalPages);
      setAllUsers(users.results);
    } catch (error) {
      console.error(error);
    }
  };

  // User Single
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
            <span>Users</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Users</h5>
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
                        {allUsers
                          ?.filter((user) => {
                            console.log('🚀 ~ file: users.tsx:352 ~ Users ~ user:', user);
                            return user.role === 'cp';
                          })
                          .map((user) => (
                            <tr key={user.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{user?.id}</p>
                                </div>
                              </td>
                              <td>{user?.name}</td>
                              <td>{user?.email}</td>
                              <td className="font-sans text-success">{user?.role}</td>
                              <td>
                                <div className="font-sans">{user?.isEmailVerified === true ? 'Verified' : 'Unverified'}</div>
                              </td>
                              <td>
                                <Link href={`users/${user?.id}`}>
                                  <button type="button" className="p-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M11.4001 18.1612L11.4001 18.1612L18.796 10.7653C17.7894 10.3464 16.5972 9.6582 15.4697 8.53068C14.342 7.40298 13.6537 6.21058 13.2348 5.2039L5.83882 12.5999L5.83879 12.5999C5.26166 13.1771 4.97307 13.4657 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L7.47918 20.5844C8.25351 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5343 19.0269 10.823 18.7383 11.4001 18.1612Z"
                                        fill="currentColor"
                                      ></path>
                                      <path
                                        d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z"
                                        fill="currentColor"
                                      ></path>
                                    </svg>
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

export default Users;
