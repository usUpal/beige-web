import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import ResponsivePagination from 'react-responsive-pagination';
import { useAuth } from '@/contexts/authContext';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';

const Users = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userModalClient, setUserModalClient] = useState(false);
  const { authPermissions } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const inputDate = clientUserInfo?.createdAt;
  const query = {
    page : currentPage
  }
  const { data: allClients, isLoading: getAllClientsLoading } = useGetAllUserQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  console.log(' ~ allClients ~',allClients)

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

  // for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                          <th className="">User ID</th>
                          <th className=" ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="">Email</th>
                          <th className="">Role</th>
                          <th className=" ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                          {authPermissions?.includes('client_edit') && (
                            <th className="">Edit</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {allClients?.results
                          ?.filter((user : any) => {
                            return user.role === 'user';
                          })
                          ?.map((userClient : any) => (
                            <tr key={userClient.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  {/* whitespace-nowrap */}
                                  <p className="break-all">{userClient?.id}</p>
                                </div>
                              </td>

                              <td>{userClient?.name}</td>
                              <td className='break-all min-w-[150px]'>{userClient?.email}</td>

                              <td className="font-sans text-success">{userClient?.role}</td>

                              <td>
                                <span className={`badge text-md w-12 ${!userClient?.isEmailVerified ? 'bg-slate-300' : 'bg-success'} text-center`}>
                                  {userClient?.isEmailVerified === true ? 'Verified' : 'Unverified'}
                                </span>
                              </td>
                              {authPermissions?.includes('client_edit') && (
                                <td>
                                  <button type="button" className="p-0" onClick={() => getUserDetails(userClient.id)}>
                                    {allSvgs.editPen}
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
                          <Dialog.Panel as="div" className="panel my-24 w-10/12 md:w-3/5 xl:w-3/6 2xl:w-2/6 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <div className="my-2 flex items-center justify-between bg-[#fbfbfb] px-3 py-3 dark:bg-[#121c2c]">
                              <div className="ms-3 text-[22px] font-bold capitalize leading-none text-[#000000]">Client </div>
                              <button type="button" className="text-white-dark hover:text-dark" onClick={() => setUserModalClient(false)}>
                                {allSvgs.closeModalSvg}
                              </button>
                            </div>

                            <div className="basis-[50%]">
                              <div className="mx-6 pb-6">
                                <div className="md:flex md:flex-row flex-col gap-5 mt-0 mx-auto  space-y-5 md:space-y-0 box-border ">
                                  <div className="left space-y-4 w-full">
                                    <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col m-0 mt-[9px]">
                                      <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Client Id  </span>
                                      <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600   w-full">{clientUserInfo?.id}</span>
                                    </span>
                                    <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col mt-0 md:mt-[12px]">
                                      <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Name  </span>
                                      <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600   w-full">{clientUserInfo?.name}</span>
                                    </span>
                                  </div>

                                  <div className="right space-y-0 md:space-y-4 w-full">
                                    <span className="text-[16px] font-bold capitalize leading-none text-[#000000] flex flex-col gap-1 m-0 mt-1">
                                      <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Role </span>
                                      <span className=" text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600   w-full">{clientUserInfo?.role}</span>
                                    </span>

                                    <span className="text-[16px] font-bold leading-none text-[#000000] flex flex-col gap-1 m-0 mt-1">

                                      <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Address </span>
                                      <span className=" text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600   w-full">{clientUserInfo?.location}</span>
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[16px] font-bold leading-none text-[#000000] flex flex-col gap-1">
                                  <span className='ps-1 text-[16px] font-bold leading-[28px] text-[#000000]'> Email  </span>
                                  <span className="text-[16px] font-semibold leading-[28px]  border rounded p-3 text-gray-600   w-full">{clientUserInfo?.email}</span>
                                </span>
                                <div className="btn-group flex justify-end">
                                  <DefaultButton onClick={() => setUserModalClient(false)} css='font-semibold mt-10'>Close</DefaultButton>
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
