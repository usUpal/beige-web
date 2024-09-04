/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import PreLoader from '@/components/ProfileImage/PreLoader';
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

const Shoots = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const { userData, authPermissions } = useAuth();

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

  // Memoize handlePageChange
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Recent Shoots</h5>
          <input
            type="text"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            className="rounded border border-black px-3 py-1 focus:border-black focus:outline-none"
            placeholder="Search..."
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="text-[16px] font-semibold ltr:rounded-l-md rtl:rounded-r-md">Shoot Name</th>
                <th className="text-[16px] font-semibold">Shoot ID</th>
                <th className="text-[16px] font-semibold">Price</th>
                {authPermissions?.includes('shoot_download') && <th className="text-[16px] font-semibold">Files</th>}
                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                {authPermissions?.includes('shoot_show_details') && <th className="text-[16px] font-semibold">View</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <PreLoader />
              ) : data?.results?.length > 0 ? (
                data.results.map((shoot) => (
                  <tr key={shoot.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td className="min-w-[150px] text-black dark:text-white">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                        <p className="whitespace-nowrap">
                          {shoot.order_name}
                          <span className="block text-xs text-[#888EA8]">{new Date(shoot.shoot_datetimes[0]?.start_date_time).toDateString()}</span>
                        </p>
                      </div>
                    </td>
                    <td>{shoot.id}</td>
                    <td>$ {shoot.shoot_cost}</td>
                    {authPermissions?.includes('shoot_download') && (
                      <td className="text-success">
                        {shoot.file_path?.status ? (
                          <span
                            onClick={async () => {
                              await api.downloadFolder(`${shoot.file_path.dir_name}`);
                            }}
                            className="badge text-md w-12 bg-success text-center"
                          >
                            Download
                          </span>
                        ) : (
                          <span
                            onClick={async () => {
                              await api.downloadFolder(`${shoot.file_path.dir_name}`);
                            }}
                            className="badge text-md w-12 bg-gray-200 text-center text-gray-500"
                          >
                            Unavailable
                          </span>
                        )}
                      </td>
                    )}

                    <td>
                      <StatusBg>{shoot.order_status}</StatusBg>
                    </td>
                    {authPermissions?.includes('shoot_show_details') && (
                      <td>
                        <Link href={`shoots/${shoot.id}`}>
                          <button type="button" className="p-0">
                            <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                          </button>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    <span className="flex justify-center font-semibold text-[red]">No shoots found</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination current={currentPage} total={data?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shoots;
