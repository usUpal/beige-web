import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import ResponsivePagination from 'react-responsive-pagination';
import { useAuth } from '@/contexts/authContext';

const CpUsers = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [allCpUsers, setAllCpUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const { authPermissions } = useAuth();
  useEffect(() => {
    getAllCpUsers();
  }, [currentPage]);

  // useEffect(() => {
  //     dispatch(setPageTitle('Meetings'));
  //   }, []);

  // All Users
  const getAllCpUsers = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}cp?limit=10&page=${currentPage}`);
      const users = await response.json();
      setAllCpUsers(users.results);
      setTotalPagesCount(users?.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  // routing
  const router = useRouter();

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
            <div className="mb-1">
              <div className="inline-block w-full">
                <div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="font-mono">User ID</th>
                          <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="font-mono">Email</th>
                          <th className="font-mono">Role</th>
                          <th className="font-mono ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                          {authPermissions?.includes('edit_content_provider') && (
                            <th className="font-mono">Edit</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {allCpUsers?.map(
                          (cpUser) => (
                            console.log(' ---> ', cpUser),
                            (
                              <tr key={cpUser.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] font-sans text-black dark:text-white">
                                  <div className="flex items-center">
                                    <p className="whitespace-nowrap">{cpUser?.userId?._id}</p>
                                  </div>
                                </td>
                                <td>{cpUser?.userId?.name}</td>
                                <td>{cpUser?.userId?.email}</td>
                                <td className="font-sans text-success">{cpUser?.userId?.role}</td>

                            <td>
                              <div className="font-sans">
                                <div className="font-sans">
                                  <StatusBg>{cpUser?.isEmailVerified === true ? 'Verified' : 'Unverified'}</StatusBg>
                                </div>
                              </div>
                            </td>
                            {authPermissions?.includes('edit_content_provider') && (
                              <td>
                                <Link href={`cp/${cpUser?.userId?._id}`}>
                                  <button type="button" className="p-0">
                                    {allSvgs.pencilIconForEdit}
                                  </button>
                                </Link>
                              </td>
                            )}
                          </tr>
                        )))}
                      </tbody>
                    </table>

                    <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
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
