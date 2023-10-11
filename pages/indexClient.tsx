import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Link from 'next/link';
import StatusBg from '@/components/Status/StatusBg';
import { API_ENDPOINT } from '@/config';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';

const IndexClient = () => {
    const [date2, setDate2] = useState<any>('2022-07-05 12:00');
    const [isMounted, setIsMounted] = useState(false);
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });

    useEffect(() => {
        setIsMounted(true);
    });

    const [userId, setUserId] = useState<any>('');
    useEffect(() => {
        getUserId();
    }, []);

    const getUserId = async () => {
        try {
            if (typeof window !== 'undefined') {
                setUserId(localStorage && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') as string).id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    return (
        <>
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link href="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Book Now</span>
                    </li>
                </ul>

                <div className="pt-5">
                    <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                        {/* Horizontal */}
                        <div className="panel" id="horizontal_form">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Booking Process</h5>
                            </div>
                            <div className="mb-5">
                                <form className="space-y-5">

                                    {/* Shoot Type */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                                        <div className="flex-1">
                                            <div className="mb-2">
                                                <label className="mt-1 inline-flex cursor-pointer">
                                                    <input type="radio" name="segements" className="form-radio" />
                                                    <span className="text-white-dark">Video</span>
                                                </label>
                                            </div>
                                            <div className="mb-2">
                                                <label className="mt-1 inline-flex cursor-pointer">
                                                    <input type="radio" name="segements" className="form-radio" />
                                                    <span className="text-white-dark">Photo</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="horizontalPassword" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                            Category
                                        </label>
                                        <select className="form-select text-white-dark">
                                            <option>Select Category</option>
                                            <option>Business</option>
                                            <option>Personal</option>
                                            <option>Wedding</option>
                                        </select>
                                    </div>

                                    {/* Order Name */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="orderName" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Order Name</label>
                                        <input id="orderName" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                    </div>

                                    {/* Location */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="location" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Location</label>
                                        <input id="location" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                    </div>

                                    {/* Date and Time */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="location" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Date and Time</label>
                                        <Flatpickr
                                            data-enable-time
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'Y-m-d H:i',
                                            }}
                                            defaultValue={date2}
                                            className="form-input"
                                            onChange={(date2) => setDate2(date2)}
                                        />
                                    </div>

                                    {/* Budget */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                            Budget
                                        </label>
                                        <select className="form-select text-white-dark">
                                            <option>What is your budget?</option>
                                            <option>$750-$999</option>
                                            <option>$1,000-$1,499</option>
                                            <option>$1,500-$2,499</option>
                                            <option>$2,500-$3,499</option>
                                            <option>$3,500-$4,499</option>
                                        </select>
                                    </div>

                                    {/* References */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">References</label>
                                        <input id="references" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                    </div>

                                    {/* Add Image */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="addImage" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Image</label>
                                        <input id="addImage" type="file" className="form-input" />
                                    </div>

                                    {/* Special Note */}
                                    <div className="flex flex-col sm:flex-row">
                                        <label htmlFor="specialNote" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Special Note</label>
                                        <textarea id="specialNote" rows={3} className="form-textarea" placeholder="Type your note here..." required></textarea>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IndexClient;
