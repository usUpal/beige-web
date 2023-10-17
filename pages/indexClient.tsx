import { useEffect, useState, Fragment, useRef } from 'react';
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
import 'flatpickr/dist/flatpickr.css';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormData {
    content_type: number;
    content_vertical: string;
    order_name: string;
    location: string;
    shoot_datetimes: string;
    start_date_time: string;
    end_date_time: string;
    references: string;
    budget: string;
    description: string;
    min_budget: number;
    max_budget: number;
}

const IndexClient = () => {
    const [date2, setDate2] = useState<any>('2022-07-05 12:00');
    const [isMounted, setIsMounted] = useState(false);
    const [startDateTime, setstartDateTime] = useState('');
    const [endDateTime, setendDateTime] = useState('');
    const max_budgetNumber = 69;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Client Dashboard'));
    });

    useEffect(() => {
        setIsMounted(true);
    });

    // Getting dateTime value
    const start_date_time_ref:any = useRef(null);

    const start_date_time_handleButtonChange = () => {
        const dateTimeValue = start_date_time_ref.current.value;
        const selectedDate = new Date(dateTimeValue);
        const scheduleDate = selectedDate.toISOString();
        setstartDateTime(scheduleDate);
        // console.log("START DATE", startDateTime)
    }

    const end_date_time_ref:any = useRef(null);

    const end_date_time_handleButtonChange = () => {
        const dateTimeValue = end_date_time_ref.current.value;
        const selectedDate = new Date(dateTimeValue);
        const scheduleDate = selectedDate.toISOString();
        setendDateTime(scheduleDate);
        // console.log("END DATE", endDateTime)
    }

    function onSubmit(data: any) {

        const orderData= {
            "content_type": data.content_type,
            "content_vertical": data.content_vertical,
            "order_name": data.order_name,
            "location": data.location,
            "references": data.references,
            "budget": {
                        "max":data.max_budget,
                        "min": data.min_budget
                    },
            "description": data.description,
            "shoot_duration": 32,
            "shoot_datetimes": [
                {
                    "start_date_time": startDateTime,
                    "end_date_time": endDateTime,
                    "duration": 12,
                    "date_status": "confirmed"
                },
                {
                    "start_date_time": startDateTime,
                    "end_date_time": endDateTime,
                    "duration": 20,
                    "date_status": "confirmed"
                }
            ],
        }

        console.log("BOOKING FORM DATA", orderData);
        // {

        //     "client_id": "648eceb5f2cac1a3da9f72c0",

        //     "cp_id": "648eceebf2cac1a3da9f72c7",
        // }



        // content_type: data.content_type
        // content_vertical: data.content_vertical
        // description: data.description
        // start_date_time: data.start_date_time
        // end_date_time: data.end_date_time
        // location: data.location
        // max_budget: data.max_budget
        // min_budget: data.min_budget
        // order_name: data.order_name
        // references: data.references
    }

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
                                <h5 className="text-lg font-semibold dark:text-white-light">Book Now</h5>
                            </div>
                            <div className="mb-5">
                                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                                    <div className='flex justify-between items-center'>
                                        {/* Shoot Type */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                                            <div className="flex-1">
                                                {/* Video */}
                                                <div className="mb-2">
                                                    <label className="flex items-center">
                                                        <input type="checkbox" className="form-checkbox" defaultValue="Video" id='videoShootType' {...register('content_type')}/>
                                                        <span className="text-white-dark">Video</span>
                                                    </label>
                                                </div>
                                                {/* Photo */}
                                                <div className="mb-2">
                                                    <label className="flex items-center">
                                                        <input type="checkbox" className="form-checkbox" defaultValue="Photo" id='photoShootType' {...register('content_type')}/>
                                                        <span className="text-white-dark">Photo</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="content_vertical" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                Category
                                            </label>
                                            <select className="form-select text-white-dark" id='content_vertical' {...register('content_vertical')}>
                                                <option>Select Category</option>
                                                <option value="Business" selected>Business</option>
                                                <option value="Personal">Personal</option>
                                                <option value="Wedding">Wedding</option>
                                            </select>
                                            {errors.content_vertical && <p className="text-danger">{errors?.content_vertical.message}</p>}
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        {/* Order Name */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="order_name" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Order Name</label>
                                            <input id="order_name" type="text" defaultValue="Order One" className="form-input" {...register('order_name')}/>
                                            {errors.order_name && <p className="text-danger">{errors?.order_name.message}</p>}
                                        </div>

                                        {/* Location */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="location" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Location</label>
                                            <input id="location" type="text" placeholder="Enter location" defaultValue="LA" className="form-input" {...register('location')}/>
                                            {errors.location && <p className="text-danger">{errors?.location.message}</p>}
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        {/* Starting Date and Time */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="start_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Starting Date</label>
                                            <input type="datetime-local" name="dateTime" id="datetime" ref={start_date_time_ref} onChange={start_date_time_handleButtonChange}/>
                                        </div>
                                        {/* Ending Date and Time */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="end_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Ending Date</label>
                                            <input type="datetime-local" name="end_date_time" id="end_date_time" ref={end_date_time_ref} onChange={end_date_time_handleButtonChange}/>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        {/* references */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">References</label>
                                            <input id="references" type="text" placeholder="https://sitename.com" defaultValue="https://sitename.com" className="form-input" {...register('references')}/>
                                            {errors.references && <p className="text-danger">{errors?.references.message}</p>}
                                        </div>

                                        {/* Add Image */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="images" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Add Image</label>
                                            <input id="images" type="file" className="form-input" multiple/>
                                            </div>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            {/* min_budget budget */}
                                            <div className="flex flex-col sm:flex-row basis-[45%]">
                                                <label htmlFor="min_budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Min Budget</label>
                                                <input id="min_budget" type="number" placeholder="$75" defaultValue="$75" className="form-input" {...register('min_budget')}/>
                                                {errors.min_budget && <p className="text-danger">{errors?.min_budget.message}</p>}
                                            </div>

                                            {/* max_budget budget */}
                                            <div className="flex flex-col sm:flex-row basis-[45%]">
                                                <label htmlFor="max_budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Max Budget</label>
                                                <input id="max_budget" type="number" placeholder="$500" defaultValue="$500" className="form-input" {...register('max_budget')}/>
                                                {errors.max_budget && <p className="text-danger">{errors?.max_budget.message}</p>}
                                            </div>
                                        </div>
                                    <div className='flex justify-between items-center'>
                                        {/* Special Note */}
                                        <div className="flex flex-col sm:flex-row basis-[45%]">
                                            <label htmlFor="description" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Special Note</label>
                                            <textarea id="description" rows={3} className="form-textarea" placeholder="Type your note here..." required {...register('description')}></textarea>
                                            {errors.description && <p className="text-danger">{errors?.description.message}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-warning mt-6">Next</button>

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
