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

                <div className="pt-1">
                    <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-1">
                        {/* Horizontal */}
                        <div className="panel" id="horizontal_form">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">Booking Process</h5>
                            </div>
                            <div className="mb-5">
                                <form className="space-y-5">

                                    <div className='flex justify-between items-center'>
                                        {/* Shoot Type */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                                            <div className="flex-1">
                                                <div className="mb-2">
                                                    <label className="flex items-center">
                                                        <input type="checkbox" className="form-checkbox" />
                                                        <span className="text-white-dark">Video</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="flex items-center">
                                                        <input type="checkbox" className="form-checkbox" />
                                                        <span className="text-white-dark">Photo</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="horizontalPassword" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                Category
                                            </label>
                                            <select className="form-select text-white-dark">
                                                <option>Select Category</option>
                                                <option>Business</option>
                                                <option>Personal</option>
                                                <option>Wedding</option>
                                                <option>Others</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className='flex justify-between items-center'>
                                        {/* Order Name */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="orderName" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Order Name</label>
                                            <input id="orderName" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                        </div>

                                        {/* Location */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="location" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Location</label>
                                            <input id="location" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                        </div>
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        {/* Date and Time */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
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
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                Budget
                                            </label>
                                            <select className="form-select text-white-dark">
                                                <option>What is your budget?</option>
                                                <option defaultValue="75">$750-$999</option>
                                                <option defaultValue="85">$1,000-$1,499</option>
                                                <option defaultValue="95">$1,500-$2,499</option>
                                                <option defaultValue="65">$2,500-$3,499</option>
                                                <option defaultValue="55">$3,500-$4,499</option>
                                                <option defaultValue="Custom">Custom</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        {/* References */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">References</label>
                                            <input id="references" type="text" placeholder="Enter Full Name" defaultValue="Order One" className="form-input" />
                                        </div>

                                        {/* Add Image */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="addImage" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Image</label>
                                            <input id="addImage" type="file" className="form-input" />
                                        </div>
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        {/* Special Note */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="specialNote" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Special Note</label>
                                            <textarea id="specialNote" rows={3} className="form-textarea" placeholder="Type your note here..." required></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-warning mt-6">Book</button>
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
