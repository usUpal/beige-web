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
  const [formData, setFormData] = useState<any>({});

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
      console.log("userInfo", formData);

      // Handle the response as needed
      coloredToast('success')
    } catch (error) {
      console.error(error);
    }

  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
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
                          <th className='font-mono'>User ID</th>
                          <th className="ltr:rounded-l-md rtl:rounded-r-md font-mono">Name</th>
                          <th className='font-mono'>Email</th>
                          <th className='font-mono'>Role</th>
                          <th className="ltr:rounded-r-md rtl:rounded-l-md font-mono">Status</th>
                          <th className='font-mono'>Edit</th>
                        </tr>
                      </thead>
                      <tbody>

                        {allUsers?.filter(user => user.role === 'cp').map((user) => (
                          <tr key={user.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="min-w-[150px] text-black dark:text-white font-sans">
                              <div className="flex items-center">
                                <p className="whitespace-nowrap">{user?.id}</p>
                              </div>
                            </td>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                            <td className="text-success font-sans">{user?.role}</td>
                            <td>
                              <div className="font-sans">
                                {user?.isEmailVerified === true ? "Verified" : "Unverified"}
                              </div>
                            </td>
                            <td>
                              <button type="button" className="p-0" onClick={() => getUserDetails(user.id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.4001 18.1612L11.4001 18.1612L18.796 10.7653C17.7894 10.3464 16.5972 9.6582 15.4697 8.53068C14.342 7.40298 13.6537 6.21058 13.2348 5.2039L5.83882 12.5999L5.83879 12.5999C5.26166 13.1771 4.97307 13.4657 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L7.47918 20.5844C8.25351 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5343 19.0269 10.823 18.7383 11.4001 18.1612Z" fill="currentColor"></path>
                                  <path d="M20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178L14.3999 4.03882C14.4121 4.0755 14.4246 4.11268 14.4377 4.15035C14.7628 5.0875 15.3763 6.31601 16.5303 7.47002C17.6843 8.62403 18.9128 9.23749 19.85 9.56262C19.8875 9.57563 19.9245 9.58817 19.961 9.60026L20.8482 8.71306Z" fill="currentColor"></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                        }

                      </tbody>
                    </table>
                  </div>
                  <Transition appear show={userModal} as={Fragment}>
                    <Dialog as="div" open={userModal} onClose={() => setUserModal(false)}>
                      <div className="fixed inset-0 w-full" />
                      <div className="w-full fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4 w-full">
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
                                  strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                            <div className="p-5">
                              <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="flex items-center justify-between">
                                  {/* Content Vertical */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="content_verticals" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      content vertical
                                    </label>
                                    <select name="content_verticals" className="form-select text-white-dark capitalize font-sans" id="content_verticals" defaultValue="Modern" onChange={handleChange}>
                                      {userInfo?.content_verticals && userInfo.content_verticals.map((content_vertical : string) => (
                                        <option key={content_vertical} value={content_vertical} className='capitalize font-sans'>
                                          {content_vertical}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Successful Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="successful_beige_shoots" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      Successful Shoots
                                    </label>
                                    <input id="successful_beige_shoots" type="number" defaultValue={userInfo?.successful_beige_shoots} className="form-input" name="successful_beige_shoots" onChange={handleChange} />
                                  </div>
                                  {/* Trust Score */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="trust_score" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      trust score
                                    </label>
                                    <input id="trust_score" type="number" defaultValue={userInfo?.trust_score} className="form-input" name="trust_score" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* References */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="reference" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                      Reference
                                    </label>
                                    <input id="reference" type="text" placeholder="John Doe" defaultValue={userInfo?.reference} className="form-input capitalize" name="reference" onChange={handleChange} />
                                  </div>
                                  {/* Average Rating */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="trust_score" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      average rating
                                    </label>
                                    <input id="average_rating" type="number" defaultValue={userInfo?.average_rating} className="form-input" name="average_rating" onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Avg Res Time */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="avg_response_time" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize font-sans">
                                      avg response time
                                    </label>
                                    <input id="avg_response_time" type="number" defaultValue={userInfo?.avg_response_time} className="form-input block" name='avg_response_time' onChange={handleChange} />
                                  </div>
                                  {/* Total Earnings */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="total_earnings" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize font-sans">
                                      total earnings ($)
                                    </label>
                                    <input id="total_earnings" type="number" defaultValue={userInfo?.total_earnings} className="form-input" name='total_earnings' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Equipement */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="equipment" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      equipment
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="equipment" defaultValue="Camera" name='equipment' onChange={handleChange}>
                                      {userInfo?.equipment && userInfo.equipment.map((equipmentItem : string) => (
                                        <option key={equipmentItem} value={equipmentItem}>
                                          {equipmentItem}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* Portfolio */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="portfolio" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      portfolio
                                    </label>
                                    <select className="form-select text-white-dark font-sans" id="portfolio" defaultValue="https://example.com/portfolio5" name='portfolio' onChange={handleChange}>
                                      {userInfo?.portfolio && userInfo.portfolio.map((portfolioItem : string) => (
                                        <option key={portfolioItem} value={portfolioItem}>
                                          {portfolioItem}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Travel to diostant */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="travel_to_distant_shoots" className="text-[14px] capitalize mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                      travel to distant shoots
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="travel_to_distant_shoots" defaultValue={formData.travel_to_distant_shoots} name='travel_to_distant_shoots' onChange={handleChange}>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Experience with Post Production */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="experience_with_post_production_edit" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      experience with post production
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="experience_with_post_production_edit" defaultValue={formData.experience_with_post_production_edit} name='experience_with_post_production_edit' onChange={handleChange}>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Customer Service Skills Experience */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="customer_service_skills_experience" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      customer service skills experience
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="customer_service_skills_experience" defaultValue={formData.customer_service_skills_experience}  name='customer_service_skills_experience' onChange={handleChange}>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Team Player */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="team_player" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      team player
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="team_player" defaultValue={formData.team_player}   name='team_player' onChange={handleChange}>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Avg Res Time to New Shoot Inquiry */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      avg response time to new shoot inquiry
                                    </label>
                                    <input id="avg_response_time_to_new_shoot_inquiry" type="number" defaultValue={userInfo?.avg_response_time_to_new_shoot_inquiry} className="form-input block font-sans" name='avg_response_time_to_new_shoot_inquiry' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Num Declined Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_declined_shoots" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      num declined shoots
                                    </label>
                                    <input id="num_declined_shoots" type="number" defaultValue={userInfo?.num_declined_shoots} className="form-input block" name='num_declined_shoots' onChange={handleChange} />
                                  </div>
                                  {/* Num accepted Shoots */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_accepted_shoots" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      num accepted shoots
                                    </label>
                                    <input id="num_accepted_shoots" type="number" defaultValue={userInfo?.num_accepted_shoots} className="form-input block" name='num_accepted_shoots' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Num no Shows */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="num_dnum_no_showseclined_shoots" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      num no shows
                                    </label>
                                    <input id="num_no_shows" type="number" defaultValue={userInfo?.num_no_shows} className="form-input block font-sans" name='num_no_shows' onChange={handleChange} />
                                  </div>
                                  {/* Email Verified */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="isEmailVerified" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      Email Verified
                                    </label>
                                    <input id="isEmailVerified" type="text" defaultValue={userInfo?.userId.role} className="form-input block font-sans" name='isEmailVerified' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* City */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="city" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      city
                                    </label>
                                    <input id="city" type="text" defaultValue={userInfo?.city} className="form-input block" name='city' onChange={handleChange} />
                                  </div>
                                  {/* Neighbourhood */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="neighborhood" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      neighborhood
                                    </label>
                                    <input id="neighborhood" defaultValue={userInfo?.neighborhood} type="text" className="form-input block font-sans" name='neighborhood' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Zip code */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="zip_code" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      zip code
                                    </label>
                                    <input id="zip_code" type="text" defaultValue={userInfo?.zip_code} className="form-input block" name='zip_code' onChange={handleChange} />
                                  </div>
                                  {/* Content Type */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="content_type" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      content type
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="content_type" defaultValue="Wedding" name='content_type' onChange={handleChange}>
                                      {userInfo?.content_type && userInfo.content_type.map((c_type : string) => (
                                        <option key={c_type} value={c_type} className='capitalize font-sans'>
                                          {c_type}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* VST */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="vst" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      vst
                                    </label>
                                    <select className="form-select text-white-dark font-sans" id="vst" defaultValue="Business" name='vst' onChange={handleChange}>
                                      {userInfo?.vst && userInfo.vst.map((vst_item : string) => (
                                        <option key={vst_item} value={vst_item} className='capitalize font-sans'>
                                          {vst_item}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* Shoot availability */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="shoot_availability" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      shoot availability
                                    </label>
                                    <select className="form-select text-white-dark font-sans capitalize" id="shoot_availability" defaultValue="Business" name='shoot_availability' onChange={handleChange}>
                                      {userInfo?.shoot_availability && userInfo.shoot_availability.map((available_shoot : string) => (
                                        <option key={available_shoot} value={available_shoot} className='capitalize font-sans'>
                                          {available_shoot}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Equipment Specific */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="equipment_specific" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      equipment specific
                                    </label>
                                    <select className="form-select text-white-dark font-sans" id="equipment_specific" defaultValue="Wedding" name='equipment_specific' onChange={handleChange}>
                                      {userInfo?.equipment_specific && userInfo.equipment_specific.map((equipment : string) => (
                                        <option key={equipment} value={equipment} className='capitalize font-sans'>
                                          {equipment}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* Last Beige Shoot */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="last_beige_shoot" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      last beige shoot
                                    </label>
                                    <input id="last_beige_shoot" type="text" defaultValue={userInfo?.last_beige_shoot} className="form-input block" name='last_beige_shoot' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Backup Footage */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      backup footage
                                    </label>
                                    <div className="flex-1">

                                      {userInfo?.backup_footage && userInfo.backup_footage.map((footage : string) => (
                                        <div className="mb-2">
                                          <label className="flex items-center" key={footage}>
                                            <input type="checkbox" className="form-checkbox" value={footage} id="backup_footage" name="backup_footage" onChange={handleChange} />
                                            <span className="text-white-dark font-sans">{footage}</span>
                                          </label>
                                        </div>
                                      ))}

                                    </div>
                                  </div>
                                  {/* Timezone */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="timezone" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      timezone
                                    </label>
                                    <input id="timezone" type="text" defaultValue={userInfo?.timezone} className="form-input block" name='timezone' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  {/* Own Transportation Method */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="own_transportation_method" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      own transportation method
                                    </label>
                                    <select className="form-select text-white-dark font-sans" id="own_transportation_method" defaultValue={formData.own_transportation_method} name='own_transportation_method' onChange={handleChange}>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  </div>
                                  {/* Review Status */}
                                  <div className="flex basis-[45%] flex-col sm:flex-row">
                                    <label htmlFor="review_status" className="text-[14px] mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans capitalize">
                                      review status
                                    </label>
                                    <input id="review_status" type="text" defaultValue={userInfo?.review_status} className="form-input block capitalize" name='review_status' onChange={handleChange} />
                                  </div>
                                </div>
                                <div className="mt-8 flex items-center justify-end">
                                  <button type="button" className="btn btn-dark font-sans" onClick={() => setUserModal(false)}>
                                    Close
                                  </button>
                                  <button type="submit" className="btn btn-success ltr:ml-4 rtl:mr-4 font-sans">
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
