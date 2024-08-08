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
}

const IndexClient = () => {
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

  const { userData } = useAuth() as any;

  useEffect(() => {
    Swal.fire({
      text: 'This Screen is under development',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okay',
    });
  }, []);
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

  // localStorage.removeItem('location')
  // localStorage.removeItem('latitude')
  // localStorage.removeItem('longitude')

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
  };

  const logTotalDuration = (dateTimesArray: any[]) => {
    const totalDuration = dateTimesArray.reduce((acc, dateTime) => {
      const duration: number = calculateDuration(dateTime.start_date_time, dateTime.end_date_time);
      return acc + duration;
    }, 0);

    setTotalDuration(totalDuration);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: {} });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Client Dashboard'));
  });

  useEffect(() => {
    setIsMounted(true);
  });

  const onSubmit = async (data: any) => {
    if (data.content_type == false) {
      coloredToast('danger', 'Please select shoot type!');
    } else if (data.content_vertical == '') {
      coloredToast('danger', 'Please select category!');
    } else if (localStorage.getItem('location') == null) {
      coloredToast('danger', 'Please enter your location!');
    } else if (JSON.parse(showDateTimes) == '') {
      coloredToast('danger', 'Please select date time!');
    } else if (parseFloat(data.min_budget) < 1000 && parseFloat(data.max_budget) < 1000) {
      coloredToast('danger', 'Please select your budget!');
    } else if (parseFloat(data.max_budget) < 1000) {
      coloredToast('danger', 'The maximum budget must be greater than $1000!');
    } else if (parseFloat(data.max_budget) < parseFloat(data.min_budget)) {
      coloredToast('danger', 'The maximum budget must be greater than the minimum budget!');
    } else if (data.description == '') {
      coloredToast('danger', 'Please write your special note!');
    } else if (
      data.content_type == false ||
      data.content_vertical == '' ||
      localStorage.getItem('location') == null ||
      JSON.parse(showDateTimes) == '' ||
      parseFloat(data.max_budget) < 1000 ||
      parseFloat(data.max_budget) < parseFloat(data.min_budget) ||
      data.description == ''
    ) {
      coloredToast('danger', 'Please select all fileds!');
    } else {
      try {
        // Format your data as needed
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
          shoot_duration: parseFloat(localStorage.getItem('totalDuration') || '0'),
        };

        // Send a POST request
        const response = await fetch(`${API_ENDPOINT}orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers your API requires
          },
          body: JSON.stringify(formattedData),
        });

        console.log('RESPOMSE', response.ok);
        if (response.ok) {
          const responseData = await response.json();
          console.log('POST request successful!', responseData);
          coloredToast('success', 'Form submitted!');
          setActiveTab3(activeTab3 === 1 ? 2 : 3);
        } else {
          console.error('Error:', response.statusText);
          coloredToast('danger', 'https://api.beigecorporation.io/v1/orders 500 (Internal Server Error)');
          // Handle errors
          console.log('FORM DATA', formattedData);
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

  // coloredToast('success');

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

  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-warning hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Book Now</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          {/* icon only */}
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Book Now</h5>
            </div>
            <div className="mb-5">
              <div className="inline-block w-full">
                <div className="relative z-[1] mb-5">
                  <div
                    className={`${activeTab3 === 1 ? 'w-[15%]' : activeTab3 === 2 ? 'w-[48%]' : activeTab3 === 3 ? 'w-[81%]' : ''}
                                            absolute top-[30px] -z-[1] m-auto h-1 w-[15%] bg-warning transition-[width] ltr:left-0 rtl:right-0`}
                  ></div>
                  <ul className="mb-5 grid grid-cols-3">
                    <li className="mx-auto">
                      <button
                        type="button"
                        className={`${activeTab3 === 1 ? '!border-warning !bg-warning text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                        onClick={() => setActiveTab3(1)}
                      >
                        {allSvgs.clientDashBoardBookSvg}
                      </button>
                    </li>
                    <li className="mx-auto">
                      <button
                        type="button"
                        className={`${activeTab3 === 2 ? '!border-warning !bg-warning text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                        onClick={() => setActiveTab3(2)}
                      >
                        {allSvgs.userLogoIconSvg}
                      </button>
                    </li>
                    <li className="mx-auto">
                      <button
                        type="button"
                        className={`${activeTab3 === 3 ? '!border-warning !bg-warning text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                        onClick={() => setActiveTab3(3)}
                      >
                        {allSvgs.bestOfLuckIconSvg}
                      </button>
                    </li>
                  </ul>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    {activeTab3 === 1 && (
                      <>
                        <div className="flex items-center justify-between">
                          {/* Shoot Type */}
                          <div className="flex basis-[45%] flex-col sm:flex-row">
                            <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                            <div className="flex-1">
                              {/* Video */}
                              <div className="mb-2">
                                <label className="flex items-center">
                                  <input type="checkbox" className="form-checkbox" defaultValue="video" id="videoShootType" {...register('content_type')} />
                                  <span className="text-white-dark">Video</span>
                                </label>
                              </div>
                              {/* Photo */}
                              <div className="mb-2">
                                <label className="flex items-center">
                                  <input type="checkbox" className="form-checkbox" defaultValue="photo" id="photoShootType" {...register('content_type')} />
                                  <span className="text-white-dark">Photo</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Category */}
                          <div className="flex basis-[45%] flex-col sm:flex-row">
                            <label htmlFor="content_vertical" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                              Category
                            </label>
                            <select className="form-select text-white-dark" id="content_vertical" defaultValue="Business" {...register('content_vertical')}>
                              <option value="">Select Category</option>
                              <option value="Business">Business</option>
                              <option value="Personal">Personal</option>
                              <option value="Wedding">Wedding</option>
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
                            <div className="flex items-center justify-between">
                              {/* Starting Date and Time */}
                              <div className="flex basis-[45%] flex-col sm:flex-row">
                                <label htmlFor="start_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                  Starting Date
                                </label>
                                <input id="start_date_time" type="datetime-local" className="form-input" onChange={handleChangeStartDateTime} />
                                {errors.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                              </div>

                              {/* Ending Date and Time */}
                              <div className="flex basis-[45%] flex-col sm:flex-row">
                                <label htmlFor="end_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                  Ending Date
                                </label>
                                <input id="end_date_time" type="datetime-local" className="form-input" onChange={handleChangeEndDateTime} />
                                {errors.end_date_time && <p className="text-danger">{errors?.end_date_time.message}</p>}
                              </div>
                            </div>
                            <button type="button" id="dateTimeBtn" className="btn btn-success ml-auto mt-5" onClick={addDateTime}>
                              Add
                            </button>

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
                                      <td>{dateTime.start_date_time}</td>
                                      <td>{dateTime.end_date_time}</td>
                                      <td>{calculateDuration(dateTime.start_date_time, dateTime.end_date_time)} Hour</td>
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

                    <div className="mb-5">
                      {activeTab3 === 3 && (
                        <div className="h-full">
                          <div className="mb-5 flex items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Cost Breakdown</h5>
                          </div>
                          <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                              {isMounted ? (
                                <ReactApexChart series={costingssByCategory.series} options={costingssByCategory.options} type="donut" height={460} width={'100%'} />
                              ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                  <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="panel mt-5">
                            <div className="table-responsive mb-5">
                              <table>
                                <thead>
                                  <tr>
                                    <th>Indicator</th>
                                    <th>Costings</th>
                                    <th className="text-center">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tableData.map((data) => {
                                    return (
                                      <tr key={data.id}>
                                        <td>
                                          <div
                                            className={`whitespace-nowrap ${
                                              data.indicator === 1
                                                ? 'h-3 w-3 bg-success text-success'
                                                : data.indicator === 2
                                                ? 'h-3 w-3 bg-secondary'
                                                : data.indicator === 3
                                                ? 'h-3 w-3 bg-info'
                                                : 'h-3 w-3 bg-success'
                                            }`}
                                          ></div>
                                        </td>
                                        <td>{data.costings}</td>
                                        <td className="text-center">${data.price}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" className={`btn btn-warning font-sans ${activeTab3 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-warning font-sans ltr:ml-auto rtl:mr-auto">
                      {activeTab3 === 3 ? 'Finish' : activeTab3 === 2 ? 'Place Order' : 'Next'}
                    </button>
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
