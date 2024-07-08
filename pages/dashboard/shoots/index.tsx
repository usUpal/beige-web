import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import StatusBg from '@/components/Status/StatusBg';
import Pagination from '@/components/Pagination';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';
import api from '../../../FileManager/api/storage';
import ResponsivePagination from 'react-responsive-pagination';

const Shoots = () => {
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [myShoots, setMyShoots] = useState<ShootTypes[]>([]);


  // All Shoots
  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : 'cp';

  useEffect(() => {
    getAllMyShoots();
  }, [currentPage]);

  // All Shoots
  const getAllMyShoots = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=10&page=${currentPage}`);
      const allShots = await response.json();
      console.log("🚀 ~ getAllMyShoots ~ allShots:", allShots);
      setTotalPagesCount(allShots?.totalPages);
      setMyShoots(allShots?.results);
    } catch (error) {
      console.error(error);
    }
  };

  // previous code
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // previous code
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Shoots'));
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Orders */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Recent Orders</h5>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="ltr:rounded-l-md rtl:rounded-r-md font-semibold text-[16px]">Order Name</th>
                <th className='text-[16px] font-semibold'>Order ID</th>
                <th className='text-[16px] font-semibold'>Price</th>
                <th className='text-[16px] font-semibold'>Files</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                <th className='text-[16px] font-semibold'>View</th>
              </tr>
            </thead>
            <tbody>
              {myShoots?.map((shoot) => (
                <tr key={shoot.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td className="min-w-[150px] text-black dark:text-white">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                      <p className="whitespace-nowrap">
                        {shoot?.order_name}
                        <span className="block text-xs text-[#888EA8]">{new Date(shoot?.shoot_datetimes[0]?.start_date_time).toDateString()}</span>
                      </p>
                    </div>
                  </td>
                  <td>{shoot.id}</td>
                  <td>$ {shoot?.budget?.max}</td>

                  <td className="text-success">
                    {shoot?.file_path && (
                      <p
                        onClick={async () => {
                          await api.downloadFolder(`${shoot.order_name}/`);
                        }}
                      >
                        Download file
                      </p>
                    )}
                    {/* <Link href="/dashboard/files" className="rounded-[10px] border border-solid border-[#ddd] px-2 py-1 ring-1 ring-success">
                      Available
                    </Link> */}
                  </td>
                  <td>
                    <div className="">
                      <StatusBg>{shoot?.order_status}</StatusBg>
                    </div>
                  </td>
                  <td>
                    <Link href={`shoots/${shoot?.id}`}>
                      <button type="button" className="p-0">
                        <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} /> */}
          <div className='mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16'>
            <ResponsivePagination
              current={currentPage}
              total={totalPagesCount}
              onPageChange={handlePageChange}
              maxWidth={400}
            // styles={styles}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shoots;
