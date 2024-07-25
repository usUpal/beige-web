import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format, parseISO, differenceInHours } from 'date-fns';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import Link from 'next/link';
import 'flatpickr/dist/flatpickr.css';
import { useForm } from 'react-hook-form';
import ReactApexChart from 'react-apexcharts';
import Map from '@/components/Map';
import { ChangeEvent } from 'react';
import { useAuth } from '@/contexts/authContext';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useDateFormat from '@/hooks/useDateFormat';
import useAddons from '@/hooks/useAddons';
import { Span } from 'next/dist/trace';


interface FormData {
    content_type: string;
    content_vertical: string;
    order_name: string;
    shoot_datetimes: string;
    start_date_time: string;
    end_date_time: string;
    date_status: string;
    references: string;
    budget: string;
    description: string;
    min_budget: number;
    max_budget: number;
    duration: number;
    vst: string;
}
const BookNow = () => {

    const [activeTab3, setActiveTab3] = useState<any>(1);
    const [isMounted, setIsMounted] = useState(false);
    const [minBudget, setMinBudget] = useState<number>();
    const [minBudgetError, setMinBudgetError] = useState('');
    const [minBudgetErrorText, setMinBudgetErrorText] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [dateTimes, setDateTimes] = useState<FormData[]>([]);
    const [showDateTimes, setShowDateTimes] = useState<any>();
    const [getTotalDuration, setTotalDuration] = useState<any>();
    const [items, setItems] = useState<any>([
        {
            id: 1,
            title: '',
            description: '',
            rate: 0,
            quantity: 0,
            amount: 0,
        },
    ]);
    const { userData } = useAuth() as any;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({ defaultValues: {} });

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Client Dashboard'));
    });


    // formatted date time 
    /*  const formatDateAndTimes = (inputDateTime:any) => {
         // const formattedStartDateTime = useDateFormat(inputDateTime);
         // console.log("🚀 ~ BookNow ~ formattedStartDateTime:", formattedStartDateTime?.time, "Date:", formattedStartDateTime?.date)
         // const formattedEndDateTime = useDateFormat(endDateTime);
         // console.log("🚀 ~ BookNow ~ formattedEndDateTime:", formattedEndDateTime);
 
         // eslint-disable-next-line react-hooks/rules-of-hooks
         const formattedStartDateTime = useDateFormat(inputDateTime);
         console.log("input-date", formattedStartDateTime);
         return inputDateTime;
 
     } */

    // console.log(dateTimes);

    /*  const formatDateAndTime = (inputDateTime: any) => {
         dateTimes?.map()
         const formatedEnd_date_time = useDateFormat(inputDateTime);
         return formatedEnd_date_time;
     } */

    useEffect(() => {
        const storedDateTimes = JSON.parse(localStorage.getItem('dateTimes')!) || [];
        setDateTimes(storedDateTimes);
    }, []);

    const handleChangeStartDateTime = (e: ChangeEvent<HTMLInputElement>) => {
        const s_time = parseISO(e.target.value);
        const starting_date = format(s_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        setStartDateTime(starting_date);
        // console.log("🚀 ~ handleChangeStartDateTime ~ starting_date:", starting_date)
    };

    const handleChangeEndDateTime = (e: ChangeEvent<HTMLInputElement>) => {
        const e_time = parseISO(e.target.value);
        const ending_date = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        setEndDateTime(ending_date);
    };

    const calculateDuration = (start_date_time: string, end_date_time: string) => {
        const startDateTime = parseISO(start_date_time);
        const endDateTime = parseISO(end_date_time);
        const durationInHours = differenceInHours(endDateTime, startDateTime);
        // console.log(durationInHours);
        /* 
            let days = 0;
            let remainingHours = 0;
            if (durationInHours > 24) {
                days = Math.floor(durationInHours / 24);
                remainingHours = durationInHours % 24;
            } else {
                remainingHours = durationInHours;
            }
            console.log(`Days: ${days}, Hours: ${remainingHours}`);
            return {
                days,
                hours: remainingHours,
            }; 
        */
        return durationInHours;
    };

    /* const duration = calculateDuration('2024-3-17T15:14:00.000', '2024-07-17T13:30:00');
    console.log(duration); */

    const handleChangeMinBudget = (e: any) => {
        const value = e.target.value;
        setMinBudget(value);
        if (e.target.value < 1000) {
            setMinBudgetError('border-[#ff0000] focus:border-[#ff0000]');
            setMinBudgetErrorText('Minimum budget must be greater than $1000');
        } else {
            setMinBudgetError('');
            setMinBudgetErrorText('');
        }
    };

    const addDateTime = () => {
        const newDateTime: FormData = {
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            duration: calculateDuration(startDateTime, endDateTime),
            date_status: 'confirmed',
        };
        const newDateTimes = [...dateTimes, newDateTime];
        setDateTimes(newDateTimes);

        setShowDateTimes(JSON.stringify(newDateTimes));

        setStartDateTime('');
        setEndDateTime('');

        logTotalDuration(newDateTimes);
        console.log(newDateTime);
    };

    // time format convarsion
    function convertToEnglishDateFormat(inputDateString: any) {
        let date = new Date(inputDateString);

        let months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        let formattedDate = `${months[month]} ${day}, ${year}`;

        return formattedDate;
    }



    const logTotalDuration = (dateTimesArray: any[]) => {
        const totalDuration = dateTimesArray.reduce((acc, dateTime) => {
            const duration: number = calculateDuration(dateTime.start_date_time, dateTime.end_date_time);
            return acc + duration;
        }, 0);

        setTotalDuration(totalDuration);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // storing form one's data to this
    const [formDataPageOne, setFormDataPageOne] = useState({});
    // go to next
    const [isNext, setIsNext] = useState(false);

    const onSubmit = async (data: any) => {
        if (data.content_type == false) {
            coloredToast('danger', 'Please select content type!');
        }
        else {
            try {
                const formattedData = {
                    budget: {
                        max: parseFloat(data.max_budget),
                        min: parseFloat(data.min_budget),
                    },
                    client_id: userData.id,
                    content_type: data.content_type,
                    content_vertical: data.content_vertical,
                    description: data.description,
                    location: localStorage.getItem('location'),
                    order_name: data.order_name,
                    references: data.references,
                    shoot_datetimes: JSON.parse(showDateTimes),
                    geo_location: {
                        coordinates: [parseFloat(localStorage.getItem('longitude') || '0'), parseFloat(localStorage.getItem('latitude') || '0')],
                        type: 'Point',
                    },
                    shoot_duration: getTotalDuration,
                };
                if (Object.keys(formattedData).length > 0) {
                    setFormDataPageOne(formattedData);
                    setActiveTab3(activeTab3 === 1 && 2);
                    setIsNext(true);
                    reset();
                } else {
                    return false;
                }
            } catch (error) {
                coloredToast('danger', 'error');
            }
        }
    };

    // Toast
    const coloredToast = (color: any, message: string) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`,
            },
        });
        toast.fire({
            title: message,
        });
    };

    //Cost Breakdown
    const costingssByCategory: any = {
        series: [985, 737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: '#fff',
            },
            colors: ['#ACA686', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Team Crew Bill', 'Camera Cost', 'Transport'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    const tableData = [
        {
            id: 1,
            costings: 'Team Crew Bill',
            indicator: 1,
            price: 234,
        },
        {
            id: 2,
            costings: 'Camera Cost',
            indicator: 2,
            price: 789,
        },
        {
            id: 3,
            costings: 'Transport',
            indicator: 3,
            price: 29876,
        },
    ];


    // all addons show
    const [addonsData, setAddonsData, addonsCategories] = useAddons();
    const [filteredAddonsData, setFilteredAddonsData] = useState([]);


    const handleShowAddonsData = () => {
        let shoot_type = formDataPageOne?.content_vertical;
        const photography = formDataPageOne?.content_type?.includes('photo');
        const videography = formDataPageOne?.content_type?.includes('video');
        const photoAndVideoShootType = formDataPageOne?.content_type?.includes('photo') && formDataPageOne?.content_type?.includes('video');

        let categories: any = [];
        if (shoot_type === 'Wedding') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Wedding Photography'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Wedding Videography'];
            } else if (photoAndVideoShootType) {
                categories = ['Wedding Photography', 'Wedding Videography'];
            }
        } else if (shoot_type === 'Commercial') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Commercial Photo'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Commercial Video'];
            } else if (photoAndVideoShootType) {
                categories = ['Commercial Photo', 'Commercial Video'];
            }
        } else if (shoot_type === 'Corporate') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Corporate Photography'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Corporate Event Videography'];
            } else if (photoAndVideoShootType) {
                categories = ['Corporate Photography', 'Corporate Event Videography'];
            }
        } else if (shoot_type === 'Private') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Private Photography'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Private Videography'];
            } else if (photoAndVideoShootType) {
                categories = ['Private Photography', 'Private Videography'];
            }
        } else if (shoot_type === 'Music') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Music Photography'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Music Video'];
            } else if (photoAndVideoShootType) {
                categories = ['Music Photography', 'Music Video'];
            }
        } else if (shoot_type === 'Other') {
            if (photography && !photoAndVideoShootType) {
                categories = ['Other Photography'];
            } else if (videography && !photoAndVideoShootType) {
                categories = ['Other Videography'];
            } else if (photoAndVideoShootType) {
                categories = ['Other Photography', 'Other Videography'];
            }
        }
        if (categories.length > 0) {
            const seen = new Set();
            const uniqueAddOns = addonsData?.filter((addOn: any) => {
                const isInCategory = categories.includes(addOn?.category);
                const key = `${addOn.title}-${addOn.rate}`;
                if (isInCategory && !seen.has(key)) {
                    seen.add(key)
                        ;
                    return true;
                }
                return false;
            });
            setFilteredAddonsData(uniqueAddOns);
        }
    }

    useEffect(() => {
        if (formDataPageOne?.content_type?.length !== 0 && formDataPageOne?.content_vertical !== "") {
            handleShowAddonsData();
        }
    }, [formDataPageOne?.content_type?.length])


    // select unselect ADDONS -- steps -- form the checkbox
    const [selectedFilteredAddons, setSelectedFilteredAddons] = useState([]);
    console.log("🚀 ~ BookNow ~ selectedFilteredAddons:", selectedFilteredAddons);


    // hours
    const [hours, setHours] = useState(1);

    const handleHours = (addon: any, hoursInput: number) => {
        addon.hours = hoursInput;
        setHours(addon?.hours);
    }

    // Function to handle checkbox changes
    const handleCheckboxChange = (addon: any) => {
        addon.hours = hours;
        const isAddonSelected = selectedFilteredAddons.some((selectedAddon) => selectedAddon?._id === addon?._id);
        if (!isAddonSelected) {
            setSelectedFilteredAddons([...selectedFilteredAddons, addon]);
        } else {
            setSelectedFilteredAddons(selectedFilteredAddons.filter((selectedAddon) => selectedAddon?._id !== addon?._id));
        }
    };


    /* const handleTotalRate = () => {
        
        const rate = 0;
        let totalRate = selectedFilteredAddons.reduce((accumulator, currentValue) => {
            let total = 0;
            const hours = currentValue?.hours;
            total = (total + currentValue?.rate) * hours;
            return (total);
        }, 0);

        console.log("🚀 ~ totalRate ~ totalRate:", rate + totalRate);
    } */

    const [allRates, setAllRates] = useState([]);
    const handleTotalRate = () => {
        let totalRate = selectedFilteredAddons.reduce((accumulator, currentValue) => {

            const hours = currentValue?.hours || 0;
            const rate = currentValue?.rate || 0;

            const addonTotal = rate * hours;

            // return accumulator + addonTotal;
            setAllRates(accumulator + addonTotal);
        }, 0);

        // console.log("Total Rate:", totalRate);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-warning hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Book </span>
                </li>
            </ul>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
                {/* icon only */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light capitalize">Manual Booking By Manager</h5>
                    </div>
                    <div className="mb-5">
                        <div className="inline-block w-full">

                            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    {activeTab3 === 1 && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                {/* Content Type */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                                                    <div className="flex-1">
                                                        {/* Video */}
                                                        <div className="mb-2">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-checkbox"
                                                                    defaultValue="video" id="videoShootType"
                                                                    {...register('content_type', { required: `Select a Content-type` })}
                                                                />
                                                                <span className="text-white-dark">Video</span>
                                                            </label>
                                                        </div>
                                                        {/* Photo */}
                                                        <div className="mb-2">
                                                            <label className="flex items-center">
                                                                <input type="checkbox" className="form-checkbox" defaultValue="photo"
                                                                    id="photoShootType"
                                                                    {...register('content_type')}
                                                                />
                                                                <span className="text-white-dark">Photo</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Category || content vertical*/}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="content_vertical" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 capitalize">
                                                        Category
                                                        {/* content vertical */}
                                                    </label>
                                                    <select
                                                        className="form-select text-white-dark"
                                                        id="content_vertical"
                                                        defaultValue="selectCategory"
                                                        {...register('content_vertical')}
                                                    >
                                                        <option value="SelectCategory">Select Category</option>
                                                        <option value="Commercial">Commercial</option>
                                                        <option value="Corporate">Corporate</option>
                                                        <option value="Music">Music</option>
                                                        <option value="Private">Private</option>
                                                        <option value="Wedding">Wedding</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between">
                                                {/* Order Name */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="order_name" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        Order Name
                                                    </label>
                                                    <input id="order_name" type="text" defaultValue="Order One" className="form-input" {...register('order_name')} />
                                                    {errors.order_name && <p className="text-danger">{errors?.order_name.message}</p>}
                                                </div>

                                                {/* Location */}
                                                <div className="flex basis-[45%] flex-col flex-wrap sm:flex-row">
                                                    <label htmlFor="location" className="mb-3 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        Location
                                                    </label>
                                                    <Map />
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <div className="table-responsive">
                                                    <div className="md:flex items-center justify-between">
                                                        {/* Starting Date and Time */}
                                                        <div className="flex basis-[45%] flex-col sm:flex-row md:mb-0 mb-3">
                                                            <label htmlFor="start_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                                Starting Date
                                                            </label>
                                                            <input id="start_date_time" type="datetime-local" className="form-input" onChange={handleChangeStartDateTime} required />
                                                            {errors.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                                                        </div>

                                                        {/* Ending Date and Time */}
                                                        <div className="flex basis-[45%] flex-col sm:flex-row">
                                                            <label
                                                                htmlFor="end_date_time"
                                                                className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2"
                                                            >
                                                                Ending Date
                                                            </label>
                                                            <input id="end_date_time"
                                                                type="datetime-local"
                                                                className="form-input"
                                                                onChange={handleChangeEndDateTime}
                                                                onBlur={addDateTime}
                                                                required
                                                            />
                                                            {errors.end_date_time && <p className="text-danger">{errors?.end_date_time.message}</p>}
                                                        </div>

                                                    </div>

                                                    {/* DateTime Output Table */}
                                                    <div className="my-5">
                                                        <table className="table-auto">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Starting DateTime</th>
                                                                    <th>Ending DateTime</th>
                                                                    <th>Duration (Hours)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dateTimes.map((dateTime: FormData, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{convertToEnglishDateFormat(dateTime?.start_date_time)}</td>
                                                                        <td>{convertToEnglishDateFormat(dateTime?.end_date_time)} </td>
                                                                        <td>{calculateDuration(dateTime.start_date_time, dateTime.end_date_time)} Hour
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-5 flex items-center justify-between">
                                                {/* references */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        References
                                                    </label>
                                                    <input id="references" type="text" placeholder="https://sitename.com" className="form-input" {...register('references')} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {/* min_budget budget */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="min_budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        Min Budget
                                                    </label>
                                                    <input id="min_budget" type="number" className={`form-input block ${minBudgetError}`} {...register('min_budget')} onChange={handleChangeMinBudget} />
                                                    <p className="ml-5 text-danger">{minBudgetErrorText}</p>
                                                    {errors.min_budget && <p className="text-danger">{errors?.min_budget.message}</p>}
                                                </div>

                                                {/* max_budget budget */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="max_budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        Max Budget
                                                    </label>
                                                    <input id="max_budget" type="number" className="form-input" {...register('max_budget')} />
                                                    {errors.max_budget && <p className="text-danger">{errors?.max_budget.message}</p>}
                                                </div>
                                            </div>
                                            <div className="mt-5 flex items-center justify-between">
                                                {/* Special Note */}
                                                <div className="flex basis-[45%] flex-col sm:flex-row">
                                                    <label htmlFor="description" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                                        Special Note
                                                    </label>
                                                    <textarea id="description" rows={3} className="form-textarea" placeholder="Type your note here..." {...register('description')}></textarea>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-5">
                                        {activeTab3 === 2 && (
                                            <div>
                                                <div
                                                    className='mb-5 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-7 pb-7 pt-4'
                                                >
                                                    <label className="ml-2 sm:ml-0 sm:w-1/4 mr-2">Select Addons</label>
                                                    <div className="flex flex-col sm:flex-row">
                                                        <div className="flex-1">
                                                            <div className="table-responsive ">
                                                                <table className='w-full'>
                                                                    <thead>
                                                                        <tr className="bg-gray-200 dark:bg-gray-800">
                                                                            <th className="px-1 py-2 font-mono min-w-[20px]">Select</th>
                                                                            <th className="px-1 py-2 font-mono min-w-[120px]">Title</th>
                                                                            <th className="py-2 font-mono min-w-[20px]">Extend Rate Type</th>
                                                                            <th className="py-2 font-mono min-w-[20px]">Add Hour</th>
                                                                            <th className="px-1 py-2 font-mono min-w-[120px]">Rate</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {filteredAddonsData?.map((addon, index) => (
                                                                            <tr key={index} className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                                                <td className="px-4 py-2 min-w-[20px]">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox"
                                                                                        defaultValue={addon}
                                                                                        id={`addon_${index}`}
                                                                                        onChange={() => handleCheckboxChange(addon)}
                                                                                    />
                                                                                </td>
                                                                                <td className="px-4 py-2 min-w-[120px]">
                                                                                    {addon?.title}
                                                                                </td>

                                                                                <td className="px-4 py-2 min-w-[120px]">
                                                                                    {addon?.ExtendRateType ? addon?.ExtendRateType : "N/A"}
                                                                                </td>
                                                                                <td className="px-4 py-2 min-w-[120px]">
                                                                                    {addon?.ExtendRateType ? <span>
                                                                                        <input
                                                                                            name='hour'
                                                                                            type='number'

                                                                                            className={` bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 text-[13px] border-gray-300 md:w-16 w-12`}
                                                                                            defaultValue={hours}
                                                                                            onBlur={(e) => handleHours(addon, e.target.value)}
                                                                                            onChange={handleTotalRate}
                                                                                        />
                                                                                    </span> : "N/A"}
                                                                                </td>
                                                                                <td className="px-4 py-2 min-w-[120px]">
                                                                                    {addon?.rate}
                                                                                </td>
                                                                            </tr>
                                                                        ))}

                                                                        {/* Horizontal border */}

                                                                        <tr>
                                                                            <td colSpan="6" className=" border-t border-gray-500 w-full ">
                                                                            </td>
                                                                        </tr>
                                                                        <tr className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-600 w-full mt-[-10px]">
                                                                            <td className="px-4 py-2 min-w-[20px]"></td>
                                                                            <td className="px-4 py-2 min-w-[120px]">
                                                                                <h2 className="text-xl font-bold">Total Addons Cost</h2>
                                                                            </td>
                                                                            <td className="px-4 py-2 min-w-[120px]"></td>
                                                                            <td className="px-4 py-2 min-w-[120px]"></td>
                                                                            <td className="px-4 py-2 min-w-[120px]">TotalRates</td>
                                                                        </tr>

                                                                    </tbody>
                                                                </table>
                                                            </div>



                                                        </div>
                                                    </div>



                                                </div>

                                                <h2 className="mb-[30px] font-mono text-[24px] capitalize text-black">matching producer</h2>

                                                <div className="mb-[30px]">
                                                    <h3 className="mb-2 font-sans text-[18px] capitalize leading-none text-black">found few matches</h3>
                                                    <p className="text-[14px] capitalize leading-none text-[#838383]">choose your beige photographer/videographer</p>
                                                </div>

                                                <div className="flex flex-wrap items-start justify-between">
                                                    {/* match single */}
                                                    <div className="single-match  mb-5 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-7 pb-7 pt-4">
                                                        <div className="flex items-start justify-start">
                                                            <div className="media relative">
                                                                <img src="assets/images/producer-profile.png" alt="profile" className="mr-3 h-14 w-14 rounded-full" />
                                                                <span className="absolute bottom-0 right-4 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                                            </div>
                                                            <div className="content">
                                                                <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                                <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                                <div className="location mt-2 flex items-center justify-start">
                                                                    <img src="assets/images/location.svg" alt="location" className="mr-1" />
                                                                    <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                                </div>
                                                                <div className="ratings mt-2">
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-[30px]">
                                                            <Link href={'/'}>
                                                                <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[30px] py-[15px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                    view profile
                                                                </span>
                                                            </Link>
                                                            <Link href={'/'}>
                                                                <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[15px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                    select
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* match single */}
                                                    <div className="single-match  mb-5 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-7 pb-7 pt-4">
                                                        <div className="flex items-start justify-start">
                                                            <div className="media">
                                                                <img src="assets/images/producer-profile.png" alt="profile" className="mr-3 rounded-full" />
                                                                <span></span>
                                                            </div>
                                                            <div className="content">
                                                                <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                                <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                                <div className="location mt-2 flex items-center justify-start">
                                                                    <img src="assets/images/location.svg" alt="location" className="mr-1" />
                                                                    <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                                </div>
                                                                <div className="ratings mt-2">
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                    <i className="fa-solid fa-star mr-1 text-[#FFC700]"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-[30px]">
                                                            <Link href={'/'}>
                                                                <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[30px] py-[15px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                    view profile
                                                                </span>
                                                            </Link>
                                                            <Link href={'/'}>
                                                                <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[15px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                    select
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="flex justify-between">
                                    <span
                                        className={`btn btn-outline-dark h-10  border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l font-sans ${activeTab3 === 1 ? 'hidden' : ''}`}
                                        onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}
                                    >
                                        Back
                                    </span>
                                    <span
                                        className=" font-sans ltr:ml-auto rtl:mr-auto capitalize"
                                        
                                    >
                                        {
                                            activeTab3 === 2 ? <button
                                                type='submit'
                                                className='btn btn-outline-dark h-10 w-36 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l'
                                            >
                                                Place Order
                                            </button>
                                                :
                                                activeTab3 === 1 &&
                                                <span
                                                    // type='submit'
                                                    className='btn btn-outline-dark h-10 w-28 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l cursor-pointer'
                                                >
                                                    Next
                                                </span>
                                        }
                                    </span>
                                </div> */}

                                {/* <div className="flex justify-between">
                                    <span
                                        className={`btn btn-outline-dark h-10  border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l font-sans ${activeTab3 === 1 ? 'hidden' : ''}`}
                                        onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}
                                    >
                                        Back
                                    </span>
                                    <span
                                        className=" font-sans ltr:ml-auto rtl:mr-auto capitalize"

                                    >
                                        {
                                            activeTab3 === 2 ? <button
                                                type='submit'
                                                className='btn btn-outline-dark h-10 w-36 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l'
                                            >
                                                Place Order
                                            </button>
                                                :
                                                activeTab3 === 1 &&
                                                <button
                                                    type='submit'
                                                    className='btn btn-outline-dark h-10 w-28 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l cursor-pointer'
                                                    // onClick={() => setActiveTab3(activeTab3 === 1 ? 2 : 1)}
                                                >
                                                    Next
                                                </button>
                                        }
                                    </span>
                                </div> */}

                                <div className="flex justify-between">
                                    <button type="button" className={`btn btn-warning font-sans ${activeTab3 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab3(activeTab3 === 2 && 1)}>
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-warning font-sans ltr:ml-auto rtl:mr-auto">
                                        {activeTab3 === 2 ?
                                            <span>Place Order</span>
                                            :
                                            <span
                                            // onClick={() => handleToggleNext('nextBtn')}
                                            >Next</span>
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};



export default BookNow;