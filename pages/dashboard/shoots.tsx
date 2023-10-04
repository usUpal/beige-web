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
                </div>
            </div>

        </div>
    );
};

export default Shoots;
