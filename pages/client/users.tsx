import { useEffect, useRef, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
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
  const [isData, setData] = useState<any>(null);
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
  });

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

  // Old function
  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData: any) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // }

  // Working but duplicating  ---there are some problem in this function----
  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData: any) => ({
  //     ...prevFormData,
  //     [name]: Array.isArray(prevFormData[name]) ? [...prevFormData[name], value] : value,
  //   }));
  // };

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

  // Usage example:
  // Assuming you have a checkboxGroup named 'content_verticals'
  // and each checkbox in this group has a unique value

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

  // Version 1
  // {
  //   userInfo?.content_verticals &&
  //     userInfo.content_verticals.map((content_vertical: string) => (
  //       <div className="mb-2" key={content_vertical}>
  //         <label className="flex items-center">
  //           <input type="checkbox" className="form-checkbox" value={content_vertical} id="content_verticals" name="content_verticals" onChange={(e) => handleChange(e, 'content_verticals')} />
  //           <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
  //         </label>
  //       </div>
  //     ));
  // }

  // Not Working
  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;

  //   // Use Set to remove duplicates
  //   const uniquePortfolio = new Set([...userInfo?.portfolio, value]);

  //   setUserInfo((prevUserInfo: any) => ({
  //     ...prevUserInfo,
  //     portfolio: Array.from(uniquePortfolio),
  //   }));

  //   setFormData((prevFormData: any) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // Not Working
  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;

  //   // Check if the field is "portfolio" and the value is not already in the array
  //   if (name === "portfolio" && formData[name].indexOf(value) === -1) {
  //     setFormData((prevFormData: any) => ({
  //       ...prevFormData,
  //       [name]: [...prevFormData[name], value], // Add the new value to the array
  //     }));
  //   } else {
  //     setFormData((prevFormData: any) => ({
  //       ...prevFormData,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;

  //   setFormData((prevFormData: any) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));

  //   if (name === 'portfolio') {
  //     setUserInfo((prevUserInfo: any) => ({
  //       ...prevUserInfo,
  //       portfolio: Array.from(new Set([...prevUserInfo.portfolio, value])),
  //     }));
  //   }
  // }

  // Inserting data

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
                                <button type="button" className="p-0" onClick={() => getUserDetails(user.id)}>
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
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <Transition appear show={userModal} as={Fragment}>
                    <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                      <div className="fixed inset-0 w-full" />
                      <div className="fixed inset-0 z-[999] w-full overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen w-full items-start justify-center px-4">
                          <Dialog.Panel as="div" className="panel my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                              <div className="text-lg font-bold">Edit User</div>
                              <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModal(false)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                            <div className="p-5">
                              <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="flex items-center justify-between">
                                  {/* Add Content Vertical */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Content.V</label>
                                    <input type="text" className="form-input ml-2" name="content_verticals" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>

                                  {/* Content Vertical */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Vertical</label>
                                    <div className="flex-1">
                                      {userInfo?.content_verticals &&
                                        userInfo.content_verticals.map((content_vertical: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={content_vertical}>
                                              <input type="checkbox" className="form-checkbox" value={content_vertical} id="content_verticals" name="content_verticals" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Successful Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="successful_beige_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      Successful Shoots
                                    </label>
                                    <input
                                      id="successful_beige_shoots"
                                      type="number"
                                      defaultValue={userInfo?.successful_beige_shoots}
                                      className="form-input"
                                      name="successful_beige_shoots"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  {/* Trust Score */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      trust score
                                    </label>
                                    <input id="trust_score" type="number" defaultValue={userInfo?.trust_score} className="form-input" name="trust_score" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* References */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="reference" className="mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      Reference
                                    </label>
                                    <input
                                      id="reference"
                                      type="text"
                                      placeholder="John Doe"
                                      defaultValue={userInfo?.reference}
                                      className="form-input capitalize"
                                      name="reference"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  {/* Average Rating */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      average rating
                                    </label>
                                    <input id="average_rating" type="number" defaultValue={userInfo?.average_rating} className="form-input" name="average_rating" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Avg Res Time */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="avg_response_time" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      avg response time
                                    </label>
                                    <input
                                      id="avg_response_time"
                                      type="number"
                                      defaultValue={userInfo?.avg_response_time}
                                      className="form-input block"
                                      name="avg_response_time"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  {/* Total Earnings */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      total earnings ($)
                                    </label>
                                    <input id="total_earnings" type="number" defaultValue={userInfo?.total_earnings} className="form-input" name="total_earnings" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Equipment */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Equipment</label>
                                    <input type="text" className="form-input ml-2" name="equipment" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>
                                  {/* Equipement */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipement</label>
                                    <div className="flex-1">
                                      {userInfo?.equipment &&
                                        userInfo.equipment.map((equipmentItem: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={equipmentItem}>
                                              <input type="checkbox" className="form-checkbox" value={equipmentItem} id="equipment" name="equipment" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{equipmentItem}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Portfolio */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Potfolio</label>
                                    <input type="text" className="form-input ml-2" name="portfolio" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>
                                  {/* Portfolio */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Portfolio</label>
                                    <div className="flex-1">
                                      {userInfo?.portfolio &&
                                        userInfo.portfolio.map((portfolioItem: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={portfolioItem}>
                                              <input type="checkbox" className="form-checkbox" value={portfolioItem} id="portfolio" name="portfolio" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{portfolioItem}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Travel to diostant */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="travel_to_distant_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      travel to distant shoots
                                    </label>
                                    <select
                                      className="form-select font-sans capitalize text-white-dark"
                                      id="travel_to_distant_shoots"
                                      defaultValue={formData.travel_to_distant_shoots}
                                      name="travel_to_distant_shoots"
                                      onChange={handleChange}
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Experience with Post Production */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="experience_with_post_production_edit" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      experience with post production
                                    </label>
                                    <select
                                      className="form-select font-sans capitalize text-white-dark"
                                      id="experience_with_post_production_edit"
                                      defaultValue={formData.experience_with_post_production_edit}
                                      name="experience_with_post_production_edit"
                                      onChange={handleChange}
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Customer Service Skills Experience */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="customer_service_skills_experience" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      customer service skills experience
                                    </label>
                                    <select
                                      className="form-select font-sans capitalize text-white-dark"
                                      id="customer_service_skills_experience"
                                      defaultValue={formData.customer_service_skills_experience}
                                      name="customer_service_skills_experience"
                                      onChange={handleChange}
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Team Player */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="team_player" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      team player
                                    </label>
                                    <select
                                      className="form-select font-sans capitalize text-white-dark"
                                      id="team_player"
                                      defaultValue={formData.team_player}
                                      name="team_player"
                                      onChange={handleChange}
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Avg Res Time to New Shoot Inquiry */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      avg response time to new shoot inquiry
                                    </label>
                                    <input
                                      id="avg_response_time_to_new_shoot_inquiry"
                                      type="number"
                                      defaultValue={userInfo?.avg_response_time_to_new_shoot_inquiry}
                                      className="form-input block font-sans"
                                      name="avg_response_time_to_new_shoot_inquiry"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Num Declined Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_declined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      num declined shoots
                                    </label>
                                    <input
                                      id="num_declined_shoots"
                                      type="number"
                                      defaultValue={userInfo?.num_declined_shoots}
                                      className="form-input block"
                                      name="num_declined_shoots"
                                      onChange={handleChange}
                                    />
                                  </div>
                                  {/* Num accepted Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_accepted_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      num accepted shoots
                                    </label>
                                    <input
                                      id="num_accepted_shoots"
                                      type="number"
                                      defaultValue={userInfo?.num_accepted_shoots}
                                      className="form-input block"
                                      name="num_accepted_shoots"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Num no Shows */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_dnum_no_showseclined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      num no shows
                                    </label>
                                    <input id="num_no_shows" type="number" defaultValue={userInfo?.num_no_shows} className="form-input block font-sans" name="num_no_shows" onChange={handleChange} />
                                  </div>
                                  {/* Timezone */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="timezone" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      timezone
                                    </label>
                                    <input id="timezone" type="text" defaultValue={userInfo?.timezone} className="form-input block" name="timezone" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* City */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="city" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      city
                                    </label>
                                    <input id="city" type="text" defaultValue={userInfo?.city} className="form-input block" name="city" onChange={handleChange} />
                                  </div>
                                  {/* Neighbourhood */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="neighborhood" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      neighborhood
                                    </label>
                                    <input id="neighborhood" defaultValue={userInfo?.neighborhood} type="text" className="form-input block font-sans" name="neighborhood" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Zip code */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="zip_code" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      zip code
                                    </label>
                                    <input id="zip_code" type="text" defaultValue={userInfo?.zip_code} className="form-input block" name="zip_code" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Content Type */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Content.T</label>
                                    <input type="text" className="form-input ml-2" name="content_type" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>
                                  {/* Content Type */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                                    <div className="flex-1">
                                      {userInfo?.content_type &&
                                        userInfo.content_type.map((c_type: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={c_type}>
                                              <input type="checkbox" className="form-checkbox" value={c_type} id="content_type" name="content_type" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{c_type}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add VST */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add VST</label>
                                    <input type="text" className="form-input ml-2" name="vst" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>

                                  {/* VST */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">VST</label>
                                    <div className="flex-1">
                                      {userInfo?.vst &&
                                        userInfo.vst.map((vst_item: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={vst_item}>
                                              <input type="checkbox" className="form-checkbox" value={vst_item} id="vst" name="vst" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{vst_item}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Shoot Availability */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Shoot.A</label>
                                    <input type="text" className="form-input ml-2" name="shoot_availability" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>

                                  {/* Shoot availability */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">shoot availability</label>
                                    <div className="flex-1">
                                      {userInfo?.shoot_availability &&
                                        userInfo.shoot_availability.map((available_shoot: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={available_shoot}>
                                              <input type="checkbox" className="form-checkbox" value={available_shoot} id="shoot_availability" name="shoot_availability" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{available_shoot}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Equipment Specific */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Equipment</label>
                                    <input type="text" className="form-input ml-2" name="equipment_specific" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>

                                  {/* Equipment Specific */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipment Specific</label>
                                    <div className="flex-1">
                                      {userInfo?.equipment_specific &&
                                        userInfo.equipment_specific.map((equipment: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={equipment}>
                                              <input type="checkbox" className="form-checkbox" value={equipment} id="equipment_specific" name="equipment_specific" onChange={handleChange} />
                                              <span className="font-sans capitalize text-white-dark">{equipment}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Last Beige Shoot */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="last_beige_shoot" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      last beige shoot
                                    </label>
                                    <input id="last_beige_shoot" type="text" defaultValue={userInfo?.last_beige_shoot} className="form-input block" name="last_beige_shoot" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Add Footage */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add footage</label>
                                    <input type="text" className="form-input ml-2" name="backup_footage" onChange={addHandler} />
                                    <button type="button" className="btn btn-success ml-2" onClick={submitData}>
                                      Add
                                    </button>
                                  </div>

                                  {/* Backup Footage */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">backup footage</label>
                                    <div className="flex-1">
                                      {userInfo?.backup_footage &&
                                        userInfo.backup_footage.map((footage: string) => (
                                          <div className="mb-2">
                                            <label className="flex items-center" key={footage}>
                                              <input type="checkbox" className="form-checkbox" value={footage} id="backup_footage" name="backup_footage" onChange={handleChange} />
                                              <span className="font-sans text-white-dark">{footage}</span>
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Own Transportation Method */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="own_transportation_method" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      own transportation method
                                    </label>
                                    <select
                                      className="form-select font-sans text-white-dark"
                                      id="own_transportation_method"
                                      defaultValue={formData.own_transportation_method}
                                      name="own_transportation_method"
                                      onChange={handleChange}
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Review Status */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="review_status" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                      review status
                                    </label>
                                    <input id="review_status" type="text" defaultValue={userInfo?.review_status} className="form-input block capitalize" name="review_status" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="mt-8 flex items-center justify-end">
                                  <button type="button" className="btn btn-dark font-sans" onClick={() => setUserModal(false)}>
                                    Close
                                  </button>
                                  <button type="submit" className="btn btn-success font-sans ltr:ml-4 rtl:mr-4">
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
