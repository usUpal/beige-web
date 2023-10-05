import {useEffect, useState} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch} from 'react-redux';
import {setPageTitle} from '../../store/themeConfigSlice';
import Link from 'next/link';
import StatusBg from '@/components/Status/StatusBg';

const Shoots = () => {

    const [myShoots, setMyShoots] = useState([]);
    const [userId, setUserId] = useState('');
    console.log(userId);
    console.log(myShoots);
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
                    `https://api.beigecorporation.io/v1/orders?sortBy=createdAt:desc&limit=30&cp_id=${userId}`,
                );
                const allShots = await response.json();
                setMyShoots(prevShoots => {
                    const newShoots = allShots.results.filter(
                        shoot => !prevShoots.some(prevShoot => prevShoot.id === shoot.id),
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
                                                    shoot?.shoot_datetimes[0]?.shoot_date_time,
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
                                        <Link href={`/dashboard/shootDetails/${shoot.id}`}>
                                            <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                        </Link>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>

                    <ul className="m-auto inline-flex items-center space-x-1 rtl:space-x-reverse mt-5">
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                                    <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                1
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-[#C5965C] px-3.5 py-2 font-semibold text-white transition dark:bg-[#C5965C] dark:text-white-light">
                                2
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                3
                            </button>
                        </li>
                        <li>
                            <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                                    <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </li>
                    </ul>
                    
                </div>
            </div>

        </div>
    );
};

export default Shoots;
