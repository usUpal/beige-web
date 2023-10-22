import { useEffect, useState, Fragment } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';
import { API_ENDPOINT } from '@/config';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';

const Shoots = () => {
  // All Shoots
  const [myShoots, setMyShoots] = useState<ShootTypes[]>([]);
  const { userData } = useAuth();

  const userRole = userData?.role === 'user' ? 'client' : 'cp';



  useEffect(() => {
    getAllMyShoots();
  }, [userData?.id]);

  const getAllMyShoots = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=30&${userRole}_id=${userData?.id}`);
      const allShots = await response.json();
      setMyShoots((prevShoots) => {
        const newShoots = allShots.results.filter((shoot: ShootTypes) => !prevShoots.some((prevShoot) => prevShoot.id === shoot.id));
        return [...prevShoots, ...newShoots];
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Shoot Single
  const [shootInfo, setShootInfo] = useState<ShootTypes | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  const getShootDetails = async (shootId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`);
      const shootDetailsRes = await response.json();

      if (!shootDetailsRes) {
        console.log(response);
        setShowError(true);
        setLoading(false);
      } else {
        setShootInfo(shootDetailsRes);
        setLoading(false);
        setshootModal(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // previous code
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Shoots'));
  });

  const [shootModal, setshootModal] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Orders */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="ltr:rounded-l-md rtl:rounded-r-md">Order Name</th>
                <th>Order ID</th>
                <th>Price</th>
                <th>Files</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                <th>View</th>
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

                  <td className="text-success"><Link href="/dashboard/files" className='border border-solid border-[#ddd] py-1 px-2 rounded-[10px] ring-1 ring-success'>Available</Link></td>
                  <td>
                    <div className="">
                      <StatusBg>{shoot?.order_status}</StatusBg>
                    </div>
                  </td>
                  <td>
                    <button type="button" className="p-0" onClick={() => getShootDetails(shoot.id)}>
                      <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination />
        </div>
      </div>

      <Transition appear show={shootModal} as={Fragment}>
        <Dialog as="div" open={shootModal} onClose={() => setshootModal(false)}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel as="div" className="panel my-8 w-2/3 overflow-hidden rounded-lg border-0 p-0 text-white dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#ACA686] px-5 py-3 dark:bg-[#121c2c]">
                  <div className="cFont text-[24px] font-medium capitalize leading-none text-[#ffffff]">shoot Details</div>
                  <button type="button" className="text-white hover:text-dark" onClick={() => setshootModal(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="pb-5 pl-5 pr-5">
                  <div className="mt-5 flex items-center justify-between">
                    <div className="basis-[40%] pr-8">
                      <h2 className="mb-[15px] mt-[30px] font-mono text-[22px] font-bold capitalize leading-none text-[#000000]">{shootInfo?.order_name}</h2>
                      <div>
                        <span className="shootDate mb-[10px] block border-b-[1px] border-t-[1px] border-b-[#ACA686] border-t-[#ACA686] pb-[10px] pt-[10px] font-sans  leading-[18.2px] text-[#000000] text-[16x]">
                          <strong>Date: </strong>
                          {shootInfo?.shoot_datetimes?.map((ShootDatetime, idx) => (
                            <span key={idx}>{new Date(ShootDatetime?.start_date_time).toDateString()}</span>
                          ))}
                        </span>
                        <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
                          <strong>Shoot Type: </strong>
                          {shootInfo?.content_type}
                        </span>
                        <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
                          <strong>Location: </strong>
                          {shootInfo?.location}
                        </span>
                        <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
                          <strong>Files: </strong>
                          <Link href="/dashboard/files" className='border border-solid border-[#111] py-1 px-2 rounded-[10px] leading-none uppercase'>Available</Link>
                        </span>
                      </div>
                    </div>
                    <div className="basis-[60%] rounded-[15px] border border-solid border-[#ACA686]">
                      <iframe
                        className="rounded-[15px]"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.8194623228624!2d90.36562207597385!3d23.82501808590643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c131a95e3afd%3A0x78b320e2234f87bc!2sRd%20No.%2012%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1696151396090!5m2!1sen!2sbd"
                        width="100%"
                        height="300"
                        style={{ border: '0' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                  <div className="mb-[30px] mt-[30px]">
                    <div className="flex items-center justify-start">
                      <div className="flex items-center justify-start">
                        <span className="mr-3 inline-block font-mono text-[20px] font-bold leading-none text-[#545454]">Payout:</span>
                        <span className="font-mono text-[28px] font-bold text-[#ACA686]">$23.33</span>
                      </div>
                      <div className="relative ml-[260px] border-[#000] py-[10px] font-sans text-[16px] font-medium capitalize">
                        <StatusBg>{shootInfo?.order_status}</StatusBg>
                        <span className="absolute left-[20px] top-[-7px] inline-block rounded-[3px] border border-solid border-[#8FD0AD] bg-[#ffffff] px-[5px] py-[1px] text-[10px] leading-none text-[#000000]">
                          Status
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-[10px] font-mono text-[20px] font-bold leading-none text-[#545454]">Shot status</h2>
                    <p className="font-regular mr-[15px] text-[16px] text-[#6b6b6b]">{shootInfo?.description}</p>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 gap-6 pt-10 xl:grid-cols-2">
                    <div className="mb-5">
                      <div className="sm:flex">
                        <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                          <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="z-3 relative top-[-10px] mb-10 rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                            <style jsx global>{`
                              .hello {
                                border-left-color: #aca686;
                                border-right-color: transparent;
                                border-bottom-color: #aca686;
                                border-top-color: transparent;
                              }
                            `}</style>
                            <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                            <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">pending</h6>
                            <p className="font-sans text-[16px] text-[#000000]">
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="sm:flex">
                        <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                          <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="z-3 relative top-[-10px] mb-10 rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                            <style jsx global>{`
                              .hello {
                                border-left-color: #aca686;
                                border-right-color: transparent;
                                border-bottom-color: #aca686;
                                border-top-color: transparent;
                              }
                            `}</style>
                            <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                            <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">production</h6>
                            <p className="font-sans text-[16px] text-[#000000]">
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="sm:flex">
                        <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                          <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="z-3 relative top-[-10px] rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                            <style jsx global>{`
                              .hello {
                                border-left-color: #aca686;
                                border-right-color: transparent;
                                border-bottom-color: #aca686;
                                border-top-color: transparent;
                              }
                            `}</style>
                            <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                            <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">pre-production</h6>
                            <p className="font-sans text-[16px] text-[#000000]">
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Manager */}
                  <h2 className="mb-[15px] mt-[30px] font-mono text-[20px] font-bold leading-none text-[#545454]">File link</h2>
                  <div className="flex items-center justify-start rounded-[10px] border border-solid border-[#f1f4f5] p-[15px] md:w-1/2">
                    <img src="/assets/images/file.svg" alt="file-icon" className="mr-[15px] rounded-[10px]" />
                    <div className="">
                      <h3 className="font-mono text-[18px] font-bold capitalize leading-[1.2em] text-[#1b1b1b]">corporate video shoot</h3>
                      <span className="font-sans text-[16px] capitalize leading-none text-[#6b6b6b]">last update: aug 20 2021</span>
                      <ul className="mt-[10px] flex items-center justify-start">
                        <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
                          folder: <strong>00</strong>
                        </li>
                        <span className="mx-[10px] inline-block h-[8px] w-[8px] rounded-full bg-[#ACA686]"></span>
                        <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
                          items: <strong>00</strong>
                        </li>
                        <span className="mx-[10px] inline-block h-[8px] w-[8px] rounded-full bg-[#ACA686]"></span>
                        <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
                          used: <strong>0 GB</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Shoots;
