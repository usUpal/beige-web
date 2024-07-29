import { useEffect, useState } from 'react';
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
import Swal from 'sweetalert2';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useAddons from '@/hooks/useAddons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';



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
    const [search, setSearch] = useState(false);

    useEffect(() => {
        const storedDateTimes = JSON.parse(localStorage.getItem('dateTimes')!) || [];
        setDateTimes(storedDateTimes);
    }, []);

    const handleChangeStartDateTime = (e: ChangeEvent<HTMLInputElement>) => {
        const s_time = parseISO(e.target.value);
        const starting_date = format(s_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        setStartDateTime(starting_date);
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

    // date and time format convarsion
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
                    console.log("Clicked safe --- formattedData-->", formattedData);

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

    const [selectedFilteredAddons, setSelectedFilteredAddons] = useState([]);
    const [allRates, setAllRates] = useState(0);
    const [hours, setHours] = useState({});
    const [computedRates, setComputedRates] = useState({});
    const [finalSelectedAddons, setFinalSelectedAddons] = useState([]);

    // ---> ---> test log starts
    const consoleLog = () => {
        if (selectedFilteredAddons.length !== 0) {
            // setFinalSelectedAddons([...selectedFilteredAddons, updatedAddon]);
            console.log("🚀 ~ BookNow ~ selectedFilteredAddons:", selectedFilteredAddons);
        }
    }
    consoleLog();
    // ---> ---> test log ends

    const handleHoursOnChange = (addonId: string, hoursInput: number) => {
        if (hoursInput >= 0) {
            setHours((prevHours) => ({ ...prevHours, [addonId]: Number(hoursInput) }));
        }
        else { return; }
    };

    // 
    /* const calculateUpdatedRate = (addon: addonTypes) => {
        const addonHours = hours[addon?._id] || 0;
        const newRate = addon?.rate + (addon?.ExtendRateType ? addonHours * addon?.ExtendRate : 0);
        // return addon?.rate + (addon?.ExtendRateType ? addonHours * addon?.ExtendRate : 0);
        // return { addonHours, newRate };
        return newRate;
    }; */

    const handleCheckboxChange = (addon: addonTypes) => {
        const isAddonSelected = selectedFilteredAddons.some((selectedAddon: addonTypes) => selectedAddon?._id === addon?._id);
        if (!isAddonSelected) {
            // const updatedAddon = { ...addon, computedRate: calculateUpdatedRate(addon), hours: hours[addon?._id] };
            const updatedAddon = {
                // ...addon,
                _id: addon?._id,
                title: addon?.title,
                rate: addon?.rate,
                ExtendRate: addon?.ExtendRate,
                status: addon?.status,
                // computedRate: calculateUpdatedRate(addon),
                hours: hours[addon?._id]
            };
            // console.log("------------------>", updatedAddon);

            setSelectedFilteredAddons([...selectedFilteredAddons, updatedAddon]);
        } else {

            setSelectedFilteredAddons(selectedFilteredAddons.filter((selectedAddon) => selectedAddon._id !== addon._id));
        }
    };

    const calculateUpdatedRate = (addon: addonTypes) => {
        const addonHours = hours[addon?._id] || 0;
        const newRate = addon?.rate + (addon?.ExtendRateType ? addonHours * addon?.ExtendRate : 0);
        // return addon?.rate + (addon?.ExtendRateType ? addonHours * addon?.ExtendRate : 0);
        // return { addonHours, newRate };
        return newRate;
    };

    /* useEffect(() => {
        const calculateUpdatedRate = (addon) => {
            if (!addon) return 0;
            const addonHours = hours[addon._id] || 0;
            const newRate = addon.rate + (addon.ExtendRateType ? (addonHours * addon.ExtendRate) : 0);
            return newRate;
        };

        const updatedComputedRates = filteredAddonsData.reduce((prevAddon, addon) => {
            if (!addon || !addon._id) {
                console.error("Invalid addon or addon ID:", addon);
                return prevAddon;
            }
            prevAddon[addon._id] = calculateUpdatedRate(addon);
            return prevAddon;
        }, {});

        console.log("Updated Computed Rates:", updatedComputedRates);
        setComputedRates(updatedComputedRates);

        const updatedTotalAddonRates = selectedFilteredAddons.reduce((previousAddon, addon) => {
            if (!addon || !addon._id) {
                console.error("Invalid addon or addon ID:", addon);
                return previousAddon;
            }
            previousAddon[addon._id] = calculateUpdatedRate(addon);
            return previousAddon;
        }, {});

        console.log("Updated Total Addon Rates:", updatedTotalAddonRates);

        const totalRate = Object.values(updatedTotalAddonRates).reduce((prevValue, currentValue) => prevValue + currentValue, 0);

        console.log("Total Rate:", totalRate);
        setAllRates(totalRate);

    }, [selectedFilteredAddons, filteredAddonsData, hours, setComputedRates, setAllRates]); */


     useEffect(() => {
 
 
         const updatedComputedRates = filteredAddonsData.reduce((prevAddon: any, addon: addonTypes) => {
             prevAddon[addon?._id] = calculateUpdatedRate(addon);
             return prevAddon;
         }, {});
 
         setComputedRates(updatedComputedRates);
 
         const updatedTotalAddonRates: UpdatedAddonRates = selectedFilteredAddons.reduce((previousAddon: any, addon: addonTypes) => {
             // previousAddon[addon?._id] = calculateUpdatedRate(addon);
             previousAddon[addon?._id] = calculateUpdatedRate(addon);
             return previousAddon;
         }, {} as UpdatedAddonRates);
         console.log("🚀🚀🚀🚀", updatedTotalAddonRates);
 
         const totalRate = Object.values(updatedTotalAddonRates).reduce((acc, currentValue) => acc + currentValue, 0);
         setAllRates(totalRate);
 
     }, [selectedFilteredAddons, filteredAddonsData, hours]);

    /* useEffect(() => {
        const calculateUpdatedRate = (addon: addonTypes) => {
            const addonHours = hours[addon?._id] || 0;
            const newRate = addon?.rate + (addon?.ExtendRateType ? (addonHours * addon?.ExtendRate) : 0);
            return newRate;
        };

        const updatedComputedRates = filteredAddonsData.reduce((prevAddon: any, addon: addonTypes) => {
            prevAddon[addon?._id] = calculateUpdatedRate(addon);
            return prevAddon;
        }, {});

        setComputedRates(updatedComputedRates);

        const updatedTotalAddonRates: UpdatedAddonRates = selectedFilteredAddons.reduce((previousAddon: any, addon: addonTypes) => {
            previousAddon[addon?._id] = calculateUpdatedRate(addon);
            return previousAddon;
        }, {} as UpdatedAddonRates);
        console.log("🚀 🚀🚀🚀🚀~ .reduce ~ updatedTotalAddonRates:", updatedTotalAddonRates);

        const totalRate = Object.values(updatedTotalAddonRates).reduce((prevValue, currentValue) => prevValue + currentValue, 0);
        setAllRates(totalRate);

    }, [selectedFilteredAddons, filteredAddonsData, hours]); */

    // onFinalSubmit
    const onFinalSubmit = async (data: any) => {
        if (data.content_type == false) {
            coloredToast('danger', 'Please select content type!');
            const order = [...selectedFilteredAddons,]
        }
        else {
            try {
                console.log("finalSubmit");
            } catch (error) {
                coloredToast('danger', 'error');
            }
        }
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
                                </div>

                                {activeTab3 === 1 &&
                                    <button type="submit" className="btn border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l font-sans ltr:ml-auto rtl:mr-auto">
                                        Next
                                    </button>
                                }
                            </form>

                            <form className="space-y-5" onSubmit={handleSubmit(onFinalSubmit)}>
                                <div className="mb-5">
                                    {activeTab3 === 2 && (
                                        <div>
                                            <div
                                                className='mb-5 basis-[49%] rounded-[10px]  px-7 pb-1 pt-4'
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
                                                                    {filteredAddonsData?.map((addon: addonTypes, index) => (
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
                                                                                {addon.ExtendRateType ? (
                                                                                    <input
                                                                                        name='hour'
                                                                                        type='number'
                                                                                        className="bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 text-[13px] border-gray-300 md:w-16 w-12"
                                                                                        defaultValue={(hours[addon?._id] || 0)}
                                                                                        min="0"
                                                                                        onChange={(e) => handleHoursOnChange(addon._id, parseInt(e.target.value))}
                                                                                    // disabled={disableInput}
                                                                                    />
                                                                                ) : "N/A"}
                                                                            </td>
                                                                            <td className="px-4 py-2 min-w-[120px]">
                                                                                {computedRates[addon?._id] || addon?.rate}
                                                                            </td>
                                                                        </tr>
                                                                    ))}

                                                                    {/* Horizontal border */}
                                                                    <tr>
                                                                        <td colSpan={6} className=" border-t border-gray-500 w-full ">
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-600 w-full mt-[-10px]">
                                                                        <td className="px-4 py-2 min-w-[20px]"></td>
                                                                        <td className="px-4 py-2 min-w-[120px]">
                                                                            <h2 className="text-[16px] font-semibold">Total Addons Cost</h2>
                                                                        </td>
                                                                        <td className="px-4 py-2 min-w-[120px]"></td>
                                                                        <td className="px-4 py-2 min-w-[120px]"></td>
                                                                        <td className="px-4 py-2 min-w-[120px]">{allRates} </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <div className=''>
                                                    <h2 className="mb-[20px] font-sans text-[24px] capitalize text-black">matching producer</h2>
                                                    <div className="mb-[30px]">
                                                        <h3 className="mb-2 font-sans text-[18px] capitalize leading-none text-black">found few matches</h3>
                                                        <p className="text-[14px] capitalize leading-none text-[#838383]">choose your beige photographer/videographer</p>
                                                    </div>
                                                </div>
                                                {/* search */}
                                                <div className="search me-12">
                                                    <div className=" items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2 mt-[30px]">
                                                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                                                            {/* <form
                                                                    className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                                                                    onSubmit={() => setSearch(false)}
                                                                > */}
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pr-9 rtl:pl-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4 w-64"
                                                                    placeholder="Search..."
                                                                />
                                                                <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                                                    <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                                                        <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                </button>
                                                                <button type="button" className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden"
                                                                    onClick={() => setSearch(false)}
                                                                >
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            {/* </form> */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setSearch(!search)}
                                                                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
                                                            >
                                                                <svg className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* search ends */}
                                            </div>

                                            {/* <div className="flex flex-wrap items-start justify-between"> */}
                                            <div className="grid grid-cols-3 2xl:grid-cols-4 gap-6">
                                                {/* match single */}
                                                <div className="single-match  mb-6 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                                    <div className="flex items-start justify-start">
                                                        <div className="media relative">
                                                            <Image
                                                                src="/assets/images/producer-profile.png"
                                                                className='mr-3 h-14 w-14 rounded-full'
                                                                alt="Description of the image"
                                                                width={500}
                                                                height={300}
                                                                layout="responsive" />

                                                            <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                                        </div>
                                                        <div className="content ms-2">
                                                            <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                            <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                            <div className="location mt-2 flex items-center justify-start">

                                                                {allSvgs.locationIcon}
                                                                <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                            </div>

                                                            <div className="ratings mt-2">
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="mt-[30px] flex">
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[20px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                view profile
                                                            </span>
                                                        </Link>
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                select
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="single-match  mb-6 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                                    <div className="flex items-start justify-start">

                                                        <div className="media relative">
                                                            <Image
                                                                src="/assets/images/producer-profile.png"
                                                                className='mr-3 h-14 w-14 rounded-full'
                                                                alt="Description of the image"
                                                                width={500}
                                                                height={300}
                                                                layout="responsive" />

                                                            <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                                        </div>

                                                        <div className="content ms-1">
                                                            <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                            <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                            <div className="location mt-2 flex items-center justify-start">
                                                                <span className=''>
                                                                    {allSvgs.locationIcon}
                                                                </span>
                                                                <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                            </div>

                                                            <div className="ratings mt-2">
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-[30px] flex">
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[20px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                view profile
                                                            </span>
                                                        </Link>
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                select
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="single-match  mb-6 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                                    <div className="flex items-start justify-start">

                                                        <div className="media relative">
                                                            <Image
                                                                src="/assets/images/producer-profile.png"
                                                                className='mr-3 h-14 w-14 rounded-full'
                                                                alt="Description of the image"
                                                                width={500}
                                                                height={300}
                                                                layout="responsive" />
                                                            <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                                        </div>

                                                        <div className="content ms-2">
                                                            <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                            <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                            <div className="location mt-2 flex items-center justify-start">
                                                                {/* <img src="assets/images/location.svg" alt="location" className="mr-1" /> */}
                                                                {allSvgs.locationIcon}
                                                                <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                            </div>
                                                            <div className="ratings mt-2">
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-[30px] flex">
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[20px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                view profile
                                                            </span>
                                                        </Link>
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                select
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* match single */}
                                                <div className="single-match  mb-6 basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                                    <div className="flex items-start justify-start">
                                                        <div className="media relative">
                                                            <Image
                                                                src="/assets/images/producer-profile.png"
                                                                className='mr-3 h-14 w-14 rounded-full'
                                                                alt="Description of the image"
                                                                width={500}
                                                                height={300}
                                                                layout="responsive" />

                                                            <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                                        </div>
                                                        <div className="content ms-2">
                                                            <h4 className="font-sans text-[16px] capitalize leading-none text-black">michel backford</h4>
                                                            <span className="profession text-[12px] capitalize leading-none text-[#838383]">beige producer</span>
                                                            <div className="location mt-2 flex items-center justify-start">

                                                                {allSvgs.locationIcon}
                                                                <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">los angeles, CA</span>
                                                            </div>

                                                            <div className="ratings mt-2">
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                                <FontAwesomeIcon icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="mt-[30px] flex">
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn mr-[15px] inline-block cursor-pointer rounded-[10px] bg-black px-[20px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-white">
                                                                view profile
                                                            </span>
                                                        </Link>
                                                        <Link href={'/'}>
                                                            <span className="single-match-btn inline-block cursor-pointer rounded-[10px] border border-solid border-[#C4C4C4] bg-white px-[30px] py-[12px] font-sans text-[16px] font-medium capitalize leading-none text-black">
                                                                select
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <button type="button" className={`btn border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l font-sans ${activeTab3 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab3(activeTab3 === 2 && 1)}>
                                        Back
                                    </button>

                                    {activeTab3 === 2 &&
                                        <button type="submit" className="btn border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l font-sans ltr:ml-auto rtl:mr-auto">
                                            Place Order
                                        </button>
                                    }
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