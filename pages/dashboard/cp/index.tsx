import { useAuth } from '@/contexts/authContext';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import AccessDenied from '@/components/errors/AccessDenied';
import { truncateLongText } from '@/utils/stringAssistant/truncateLongText';
import SixRowSingleLineSkeleton from '@/components/SharedComponent/Skeletons/TransactionSkeleton';
const CpUsers = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('content_provider');

  const router = useRouter();
  const query = {
    page: currentPage,
    role: 'cp',
  };
  const { data: allCpUsers, isLoading: allCpIsLoading } = useGetAllUserQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  // routing
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('User Management'));
  });

  // for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="h-[90vh]">
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
                          <th className="">User ID</th>
                          <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                          <th className="">Email</th>
                          <th className="">Role</th>
                          <th className=" ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                          {authPermissions?.includes('edit_content_provider') && <th className="">Edit</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {allCpIsLoading ? (
                          <>
                            {Array.from({ length: 8 }).map((_, index) => (
                              <SixRowSingleLineSkeleton key={index} />
                            ))}
                          </>
                        ) : (
                          allCpUsers?.results?.map((cpUser: any) => (
                            <tr key={cpUser.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center break-all ">{cpUser?.id}</div>
                              </td>
                              <td> {truncateLongText(cpUser?.name, 30)}</td>
                              <td className="min-w-[150px] break-all">{truncateLongText(cpUser?.email, 40)}</td>
                              <td className="font-sans text-success">{cpUser?.role}</td>

                              <td>
                                <span className={`badge text-md w-12 ${!cpUser?.isEmailVerified ? 'bg-slate-300' : 'bg-success'} text-center`}>
                                  {cpUser?.isEmailVerified === true ? 'Verified' : 'Unverified'}
                                </span>
                              </td>

                              {authPermissions?.includes('edit_content_provider') && (
                                <td>
                                  <Link href={`cp/${cpUser?.id}`}>
                                    <button type="button" className="p-0">
                                      {allSvgs.editPen}
                                    </button>
                                  </Link>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="mt-8 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={allCpUsers?.totalPages} onPageChange={handlePageChange} maxWidth={400} />
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
