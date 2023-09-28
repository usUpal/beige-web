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
    console.log(myShoots);
    useEffect(() => {
        getAllMyShoots();
    }, []);
    const getAllMyShoots = async () => {
        try {
            const response = await fetch(
                `https://api.beigecorporation.io/v1/orders?sortBy=createdAt:desc&cp_id=648eceebf2cac1a3da9f72c7`,
            );
            const allShots = await response.json();
            setMyShoots(prevShoots => {
                const newShoots = allShots.results.filter(
                    shoot => !prevShoots.some(prevShoot => prevShoot.id === shoot.id),
                );
                return [...prevShoots, ...newShoots];
            });
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
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                                        <p className="whitespace-nowrap">
                                            Video Shoot
                                            <span className="block text-xs text-[#888EA8]">10 Jan 01:15 PM</span>
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td className="text-success">Available</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Completed</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/cs.svg" alt="avatar" />
                                        <p className="whitespace-nowrap">
                                            Commercial Shoot
                                            <span className="block text-xs text-[#888EA8]">10 Jan 01:15 PM</span>
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <Link href="/apps/invoice/preview">#76894</Link>
                                </td>
                                <td>$126.04</td>
                                <td className="text-success">Available</td>
                                <td>
                                    <span className="badge bg-primary shadow-md dark:group-hover:bg-transparent">Post Production</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/is.svg" alt="avatar" />
                                        <p className="whitespace-nowrap">
                                            Photo Shoot
                                            <span className="block text-xs text-[#888EA8]">10 Jan 01:15 PM</span>
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <Link href="/apps/invoice/preview">#66894</Link>
                                </td>
                                <td>$56.07</td>
                                <td className="text-warning">Not Uploaded</td>
                                <td>
                                    <span className="badge bg-dark shadow-md dark:group-hover:bg-transparent">Canceled</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ws.svg" alt="avatar" />
                                        <p className="whitespace-nowrap">
                                            Wedding Shoot
                                            <span className="block text-xs text-[#888EA8]">10 Jan 01:15 PM</span>
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <button type="button">#75844</button>
                                </td>
                                <td>$110.00</td>
                                <td className="text-success">Available</td>
                                <td>
                                    <span className="badge bg-danger shadow-md dark:group-hover:bg-transparent">In Dispute</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/cs.svg" alt="avatar" />
                                        <p className="whitespace-nowrap">
                                            Commercial Shoot
                                            <span className="block text-xs text-[#888EA8]">10 Jan 01:15 PM</span>
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td className="text-warning">Not Uploaded</td>
                                <td>
                                    <span className="badge bg-[#C5965C] shadow-md dark:group-hover:bg-transparent">Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Shoots;
