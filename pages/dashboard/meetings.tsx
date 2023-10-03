import {useEffect, useState} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setPageTitle} from '../../store/themeConfigSlice';


import Link from 'next/link';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Meetings'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

            {/* Recent Orders */}
            <div className="panel h-full w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Meeting List</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Meeting Date</th>
                            <th>Meeting Time</th>
                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                            <th>View</th>
                        </tr>
                        </thead>
                        <tbody>

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">13245</p>
                                    </div>
                                </td>
                                <td>23/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <Link href={`/dashboard/meetingDetails/id`}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </Link>
                                </td>
                            </tr>

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">6789</p>
                                    </div>
                                </td>
                                <td>25/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <Link href={`/dashboard/meetingDetails/id`}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </Link>
                                </td>
                            </tr>

                            <tr
                                className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">98765</p>
                                    </div>
                                </td>
                                <td>27/09/2022</td>
                                <td>09:30 PM</td>
                                <td className="text-success">Pending</td>
                                <td>
                                    <Link href={`/dashboard/meetingDetails/id`}>
                                        <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon"/>
                                    </Link>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Meeting;
