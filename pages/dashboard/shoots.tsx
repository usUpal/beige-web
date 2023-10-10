import {useEffect, useState, Fragment} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch} from 'react-redux';
import {setPageTitle} from '../../store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';
import { API_ENDPOINT } from '@/config';

const Shoots = () => {

    // All Shoots
    const [myShoots, setMyShoots] = useState<ShootTypes[]>([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        getAllMyShoots();
    }, [userId]);
    useEffect(() => {
        getUserId();
    }, []);

    const getAllMyShoots = async () => {
        try {
            if (userId) {
                const response = await fetch(
                    `${API_ENDPOINT}orders?sortBy=createdAt:desc&limit=30&cp_id=${userId}`,
                );
                const allShots = await response.json();
                setMyShoots(prevShoots => {
                    const newShoots = allShots.results.filter(
                        (shoot:ShootTypes) => !prevShoots.some(prevShoot => prevShoot.id === shoot.id),
                    );
                    return [...prevShoots, ...newShoots];
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getUserId = async () => {
        try {
            if (typeof window !== 'undefined') {
                setUserId(localStorage && (localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') as string).id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Shoot Single
    const [shootInfo, setShootInfo] = useState<ShootTypes | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);

    const getShootDetails = async (shootId:string) => {
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
            setshootModal(true)

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
                                <th>File Status</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myShoots?.map(shoot =>
                                <tr
                                    key={shoot.id}
                                    className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                                src="/assets/images/ps.svg" alt="avatar"/>
                                            <p className="whitespace-nowrap">
                                                {shoot?.order_name}
                                                <span className="block text-xs text-[#888EA8]">{new Date(
                                                    shoot?.shoot_datetimes[0]?.start_date_time,
                                                ).toDateString()}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td>{shoot.id}</td>
                                    <td>$ {shoot?.budget?.max}</td>

                                    <td className="text-success">Available</td>
                                    <td>
                                        <div className=''>
                                            <StatusBg>{shoot?.order_status}</StatusBg>
                                        </div>
                                    </td>
                                    <td>
                                        <button type="button" className="p-0" onClick={() => getShootDetails(shoot.id)}>
                                            <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                        </button>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>

                    <Pagination/>

                </div>
            </div>

            <Transition appear show={shootModal} as={Fragment}>
                <Dialog as="div" open={shootModal} onClose={() => setshootModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel as="div" className="panel my-8 w-2/3 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">shoot Details</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setshootModal(false)}>
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
                                    <div className="pb-5 pl-5 pr-5">
                                        <h2 className="text-[22px] font-bold leading-none capitalize text-[#000000] mb-[15px] mt-[30px]">{ shootInfo?.order_name }</h2>
                                        <div>
                                            <span className='shootDate text-[16x] leading-[18.2px] text-[#000000] mb-[10px] block'><strong>Date: </strong>
                                                {shootInfo?.shoot_datetimes?.map((ShootDatetime, idx) => (
                                                    <span key={idx}>
                                                        {new Date(ShootDatetime?.start_date_time).toDateString()}
                                                    </span>
                                                ))}
                                            </span>
                                            <span className='text-[16px] leading-[18.2px] text-[#000000] mb-[10px] block capitalize'><strong>Shoot Type: </strong>{ shootInfo?.content_type }</span>
                                            <span className='text-[16px] leading-[18.2px] text-[#000000] block capitalize'><strong>Location: </strong>{ shootInfo?.location }</span>
                                        </div>
                                        <div className="mt-[30px]">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.8194623228624!2d90.36562207597385!3d23.82501808590643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c131a95e3afd%3A0x78b320e2234f87bc!2sRd%20No.%2012%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1696151396090!5m2!1sen!2sbd"
                                                width="100%"
                                                height="300"
                                                style={{ border: '0' }}
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            >
                                            </iframe>
                                        </div>
                                        <div className="mt-[30px] mb-[30px]">
                                            <div className="flex justify-start items-center">
                                                <div className='flex justify-start items-center'>
                                                    <span className="text-[#545454] text-[20px] font-bold mr-3 leading-none inline-block">Payout:</span>
                                                    <span className="text-[#000000] text-[28px] font-bold">$23.33</span>
                                                </div>
                                                <div className="ml-[260px] relative text-[16px] font-medium capitalize py-[10px] border-[#000]">
                                                    <StatusBg>{ shootInfo?.order_status }</StatusBg>
                                                    <span className="inline-block absolute top-[-7px] left-[20px] text-[10px] text-[#000000] bg-[#ffffff] px-[5px] py-[1px] border border-solid border-[#8FD0AD] rounded-[3px] leading-none">Status</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className='text-[20px] font-bold text-[#545454] leading-none mb-[10px]'>Shot status</h2>
                                            <p className="text-[#6b6b6b] text-[16px] font-regular mr-[15px]">{ shootInfo?.description }</p>
                                        </div>

                                        {/* Timeline */}
                                        <div className="grid grid-cols-1 gap-6 pt-10 xl:grid-cols-2">

                                                <div className="mb-5">

                                                    <div className="sm:flex">
                                                        <div className="relative z-[2] mt-3 mx-auto before:absolute before:top-[15px] before:left-1/2 before:-bottom-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                            <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="mb-10 p-5 pl-7 border border-solid border-[#C5965C] rounded-[20px] relative z-3 bg-white top-[-10px]">
                                                                <style jsx global>{`
                                                                    .hello{
                                                                        border-left-color: #C5965C;
                                                                        border-right-color: transparent;
                                                                        border-bottom-color: #C5965C;
                                                                        border-top-color: transparent;
                                                                    }
                                                                `}</style>
                                                                <div className='hello absolute w-4 h-4 border border-solid bg-white rotate-45 top-6 -left-2'></div>
                                                                <h6 className="mb-2 font-semibold text-black text-2xl pb-2 border-b border-[#D9D9D9]">Trending Style</h6>
                                                                <p className="text-[16px] text-[#000000]">
                                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="sm:flex">
                                                        <div className="relative z-[2] mt-3 mx-auto before:absolute before:top-[15px] before:left-1/2 before:-bottom-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                            <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="mb-10 p-5 pl-7 border border-solid border-[#C5965C] rounded-[20px] relative z-3 bg-white top-[-10px]">
                                                                <style jsx global>{`
                                                                    .hello{
                                                                        border-left-color: #C5965C;
                                                                        border-right-color: transparent;
                                                                        border-bottom-color: #C5965C;
                                                                        border-top-color: transparent;
                                                                    }
                                                                `}</style>
                                                                <div className='hello absolute w-4 h-4 border border-solid bg-white rotate-45 top-6 -left-2'></div>
                                                                <h6 className="mb-2 font-semibold text-black text-2xl pb-2 border-b border-[#D9D9D9]">Trending Style</h6>
                                                                <p className="text-[16px] text-[#000000]">
                                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="sm:flex">
                                                        <div className="relative z-[2] mt-3 mx-auto before:absolute before:top-[15px] before:left-1/2 before:-bottom-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                                            <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="p-5 pl-7 border border-solid border-[#C5965C] rounded-[20px] relative z-3 bg-white top-[-10px]">
                                                                <style jsx global>{`
                                                                    .hello{
                                                                        border-left-color: #C5965C;
                                                                        border-right-color: transparent;
                                                                        border-bottom-color: #C5965C;
                                                                        border-top-color: transparent;
                                                                    }
                                                                `}</style>
                                                                <div className='hello absolute w-4 h-4 border border-solid bg-white rotate-45 top-6 -left-2'></div>
                                                                <h6 className="mb-2 font-semibold text-black text-2xl pb-2 border-b border-[#D9D9D9]">Trending Style</h6>
                                                                <p className="text-[16px] text-[#000000]">
                                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                        </div>

                                        <h2 className='text-[20px] font-bold text-[#545454] leading-none mt-[30px] mb-[15px]'>File link</h2>
                                        <div className='border border-solid border-[#f1f4f5] p-[15px] rounded-[10px] flex justify-start items-center md:w-1/2'>
                                            <img src="/assets/images/file.svg" alt="file-icon" className='rounded-[10px] mr-[15px]'/>
                                            <div className=''>
                                                <h3 className='text-[18px] text-[#1b1b1b] font-bold leading-[1.2em] capitalize'>corporate video shoot</h3>
                                                <span className='text-[16px] text-[#6b6b6b] leading-none capitalize'>last update: aug 20 2021</span>
                                                <ul className='mt-[10px] flex justify-start items-center'>
                                                    <li className='text-[16px] text-[#202020] capitalize font-regular'>folder: <strong>03</strong></li>
                                                    <span className='h-[8px] w-[8px] rounded-full bg-[#C5965C] mx-[10px] inline-block'></span>
                                                    <li className='text-[16px] text-[#202020] capitalize font-regular'>items: <strong>20</strong></li>
                                                    <span className='h-[8px] w-[8px] rounded-full bg-[#C5965C] mx-[10px] inline-block'></span>
                                                    <li className='text-[16px] text-[#202020] capitalize font-regular'>used: <strong>2 GB</strong></li>
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
