import 'tippy.js/dist/tippy.css';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setPageTitle} from '../../store/themeConfigSlice';

const Meeting = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Disputes'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

            {/* Recent Orders */}
            <div className="panel h-full w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">All Disputes</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Shoot Name:</th>
                                <th>Shoot Date:</th>
                                <th>Disputed Ammount</th>
                                <th>Status</th>
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
                                <td>Corporate photo shoot</td>
                                <td>23/09/2023</td>
                                <td className="text-success">$3400</td>
                                <td>
                                    <span className='text-[#C91E1E] text-[16px] font-medium leading-[20px] capitalize bg-[#FFEAEA] rounded-[30px] px-[15px] py-[5px]'>open</span>
                                </td>
                                <td>
                                    <Link href={`/dashboard/disputeDetails/id`}>
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
                                    <span className='text-[#000000] text-[16px] font-medium leading-[20px] capitalize bg-[#E0E0E0] rounded-[30px] px-[15px] py-[5px]'>Closed</span>
                                </td>
                                <td>
                                    <Link href={`/dashboard/disputeDetails/id`}>
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
                                    <span className='text-[#000000] text-[16px] font-medium leading-[20px] capitalize bg-[#E0E0E0] rounded-[30px] px-[15px] py-[5px]'>Closed</span>
                                </td>
                                <td>
                                    <Link href={`/dashboard/disputeDetails/id`}>
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
