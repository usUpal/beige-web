import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import StatusBg from '@/components/Status/StatusBg';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import ResponsivePagination from 'react-responsive-pagination';
import PreLoader from '@/components/ProfileImage/PreLoader';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

interface supportsType {
  title: string;
  description: string;
  userId: number | string;
  status: string;
}

const support = () => {
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [supports, setSupports] = useState<supportsType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [createSupport, setCreateSupport] = useState(false);

  const { userData } = useAuth();

  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  useEffect(() => {
    getAllSupports();
  }, [currentPage]);

  // All Supports - user base and here need to implement the support api
  const getAllSupports = async () => {
    setIsLoading(true);
    let url = `${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=10&page=${currentPage}`;
    if (userRole === 'client') {
      url = `${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=10&page=${currentPage}&client_id=${userData?.id}`;
    } else if (userRole === 'cp') {
      url = `${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=10&page=${currentPage}&cp_id=${userData?.id}`;
    }
    try {
      const response = await fetch(url);
      const allShots = await response.json();
      setTotalPagesCount(allShots?.totalPages);
      setSupports(allShots?.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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

  const { register, handleSubmit, reset } = useForm();

  const onCreateSupportSubmit = (data: any) => {
    const newSupport = {
      title: data?.title,
      description: data?.description,
      userId: userData?.id,
    };

    console.log('newSupport', newSupport);
    reset();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-start justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Recent Supports</h5>
          <div className="create-support-token btn btn-primary w-48 cursor-pointer capitalize" onClick={() => setCreateSupport(true)}>
            <h3> create Support token </h3>
          </div>
        </div>

        {supports.length !== 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="text-[16px] font-semibold ltr:rounded-l-md rtl:rounded-r-md">Title</th>
                  <th className="text-[16px] font-semibold">Description</th>
                  <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    <PreLoader></PreLoader>
                  </>
                ) : (
                  <>
                    {supports && supports.length > 0 ? (
                      supports?.map((support) => (
                        <tr key={support?.id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                          <td className="min-w-[150px] text-black dark:text-white">
                            <div className="flex items-center">
                              <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                              <p className="whitespace-nowrap">
                                {/* {support?.title} */}
                                {support?.order_name}
                                {/* <span className="block text-xs text-[#888EA8]">{new Date(support?.shoot_datetimes[0]?.start_date_time).toDateString()}</span> */}
                              </p>
                            </div>
                          </td>
                          <td>
                            {/* $ {support?.description} */}$ {support?.shoot_cost}
                          </td>
                          <td>
                            <div className="">
                              {/* <StatusBg>{support?.status}</StatusBg> */}
                              <StatusBg>{support?.order_status}</StatusBg>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={50} className="text-center">
                          <span className="flex justify-center font-semibold text-[red]"> No support found </span>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>

            <div className="mt-4 flex justify-center md:justify-between lg:mr-5 2xl:mr-16">
              <ResponsivePagination current={currentPage} total={totalPagesCount} onPageChange={handlePageChange} maxWidth={400} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="flex justify-center font-semibold text-[red]"> No data found </span>
          </div>
        )}
      </div>

      {/*  modal-starts */}
      <div>
        {/* <button type="button" onClick={() => setCreateSupport(true)} className="btn btn-warning">
          Login
        </button> */}
        <Transition appear show={createSupport} as={Fragment}>
          <Dialog as="div" open={createSupport} onClose={() => setCreateSupport(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0" />
            </Transition.Child>
            <div id="login_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
              <div className="flex min-h-screen items-start justify-center px-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="panel my-24 w-full max-w-sm overflow-hidden rounded-lg border-0 px-4 py-1 pb-4 text-black dark:text-white-dark">
                    <div className=" flex items-center justify-between bg-[#fbfbfb] py-3 dark:bg-[#121c2c]">
                      <h2 className=" ps-2 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Create Support Token </h2>

                      <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setCreateSupport(false)}>
                        {allSvgs.closeModalSvg}
                      </button>
                    </div>

                    <div className="px-2 py-2">
                      <form onSubmit={handleSubmit(onCreateSupportSubmit)} className="flex flex-col space-y-3">
                        <p className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Title</span>
                          <input {...register('title')} className=" h-9 w-full rounded border border-gray-300 bg-white p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0" />
                        </p>

                        <p className="flex flex-col">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Description</span>
                          <textarea
                            {...register('description')}
                            className="h-24 w-full rounded border border-gray-300 bg-white p-2 text-[14px] focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your description here"
                          />
                        </p>

                        {/* <div className="mt-3 flex flex-col pb-3 md:mt-0">
                          <span className="text-[14px] font-light capitalize leading-none text-[#000000]">Status</span>
                          <select {...register('status')} className=" h-9 w-full rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0 ">
                            <option className=" capitalize" defaultValue="selectStauts">
                              Select a status
                            </option>
                            <option className="capitalize" value="dissmiss">
                              Dismiss
                            </option>
                            <option className="capitalize" value="Complete">
                              Complete
                            </option>
                            <option className="capitalize" value="pending">
                              Pending
                            </option>
                          </select>
                        </div> */}

                        <div className="mt-8 flex justify-end ">
                          <button type="submit" className="btn flex items-center justify-center rounded-lg bg-black text-[13px] font-bold capitalize text-white">
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>

      {/* again start of modal */}
    </div>
  );
};

export default support;
