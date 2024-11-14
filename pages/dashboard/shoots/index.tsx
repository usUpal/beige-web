/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import StatusBg from '@/components/Status/StatusBg';
import { useAuth } from '@/contexts/authContext';
import { useGetAllShootQuery } from '@/Redux/features/shoot/shootApi';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import api from '../../../FileManager/api/storage';
import { truncateLongText } from '@/utils/stringAssistant/truncateLongText';
import AccessDenied from '@/components/errors/AccessDenied';
import Image from 'next/image';
import ShootSkeleton from '@/components/SharedComponent/Skeletons/ShootSkeleton';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const Shoots = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('shoot_page');

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle('Shoots'));
  }, []);

  // Memoize queryParams
  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      ...(userData?.role === 'user' && { client_id: userData.id }),
      ...(userData?.role === 'cp' && { cp_id: userData.id }),
      search: query,
    }),
    [currentPage, userData, query]
  );

  // Fetch data based on query parameters
  const { data, error, isFetching, isLoading, refetch } = useGetAllShootQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="grid  grid-cols-1 gap-6 lg:grid-cols-1">
        {/* Recent Shoots */}
        <div className="panel h-full w-full">
          <div className="my-5 mb-5 items-center justify-between md:my-0 md:mb-4 md:flex">
            <h5 className="text-xl font-bold dark:text-white-light">Recent Shoots</h5>
            <input
              type="text"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              className="rounded border border-black px-3 py-1 focus:border-black focus:outline-none"
              placeholder="Search..."
            />
          </div>

          <div className="table-responsive h-[75vh]">
            <table>
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800">
                  <th className="text-[16px] font-semibold text-black ltr:rounded-l-md rtl:rounded-r-md dark:text-white">Shoot Name</th>
                  <th className="text-[16px] font-semibold text-black dark:text-white">Shoot ID</th>
                  <th className="text-[16px] font-semibold text-black dark:text-white">Price</th>
                  {authPermissions?.includes('shoot_download') && <th className="text-[16px] font-semibold text-black dark:text-white">Files</th>}
                  <th className="text-black ltr:rounded-r-md rtl:rounded-l-md dark:text-white">Status</th>
                  {authPermissions?.includes('shoot_show_details') && <th className="text-[16px] font-semibold text-black dark:text-white">View</th>}
                </tr>
              </thead>

              <tbody>
                {(isFetching && data) || isLoading ? (
                  <>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <ShootSkeleton key={index} />
                    ))}
                  </>
                ) : data?.results?.length > 0 ? (
                  data.results.map((shoot: shootsData) => (
                    <tr key={shoot.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="min-w-[150px] text-black dark:text-white">
                        <div className="flex items-center">
                          <Image className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" width={32} height={32} />
                          <p>
                            {truncateLongText(shoot?.order_name, 33)}
                            <span className="block text-xs text-[#888EA8]">{new Date(shoot.shoot_datetimes[0]?.start_date_time).toDateString()}</span>
                          </p>
                        </div>
                      </td>

                      <td className="min-w-[140px]">
                        <p className="break-all">{shoot?.id}</p>
                      </td>

                      <td>
                        <p>${shoot.shoot_cost}</p>
                      </td>

                      {authPermissions?.includes('shoot_download') && (
                        <td className="text-success">
                          {shoot?.file_path?.status ? (
                            <span
                              onClick={async () => {
                                await api.downloadFolder(shoot?.file_path.dir_name);
                              }}
                              className="badge text-md w-12 cursor-pointer bg-success text-center"
                            >
                              Download
                            </span>
                          ) : (
                            <span className="badge text-md w-12 bg-gray-200 text-center text-gray-500">Unavailable</span>
                          )}
                        </td>
                      )}

                      <td>
                        <StatusBg>{shoot.order_status}</StatusBg>
                      </td>

                      {authPermissions?.includes('shoot_show_details') && (
                        <td>
                          <Link href={`shoots/${shoot.id}`}>
                            {/* <button type="button" className="p-0">
                              <Image className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" width={24} height={24} />
                            </button> */}
                            {allSvgs.eyeIcon}
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <span className="flex justify-center font-semibold text-red-500">No shoots found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={data?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
          </div> */}

          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={data?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shoots;
