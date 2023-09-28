import {useEffect, useState} from 'react';
import CodeHighlight from '../../components/Highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import Dropdown from '../../components/Dropdown';
import {setPageTitle} from '../../store/themeConfigSlice';
import coverLogin from "@/pages/auth/cover-login";


import Link from 'next/link';

const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        date: '10/08/2020',
        sale: 120,
        status: 'Complete',
        register: '5 min ago',
        progress: '40%',
        position: 'Developer',
        office: 'London',
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: 'shaunpark@gmail.com',
        date: '11/08/2020',
        sale: 400,
        status: 'Pending',
        register: '11 min ago',
        progress: '23%',
        position: 'Designer',
        office: 'New York',
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: 'alma@gmail.com',
        date: '12/02/2020',
        sale: 310,
        status: 'In Progress',
        register: '1 hour ago',
        progress: '80%',
        position: 'Accountant',
        office: 'Amazon',
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: 'vincent@gmail.com',
        date: '13/08/2020',
        sale: 100,
        status: 'Canceled',
        register: '1 day ago',
        progress: '60%',
        position: 'Data Scientist',
        office: 'Canada',
    },
];

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
        dispatch(setPageTitle('Tables'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [codeArr, setCodeArr] = useState<string[]>([]);
    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };
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
                        </tr>
                        </thead>
                        <tbody>
                        {
                            myShoots?.map(shoot => <tr
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
                                <td>
                                    <Link href="/apps/invoice/preview">{shoot.id}</Link>
                                </td>
                                <td>$ {shoot?.budget?.max}</td>
                                <td className="text-success">Available</td>
                                <td>
                                    <span
                                        className="badge bg-success shadow-md dark:group-hover:bg-transparent">{shoot?.order_status}</span>
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
