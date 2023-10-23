import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
import Link from 'next/link';
import 'flatpickr/dist/flatpickr.css';
import { useForm } from 'react-hook-form';

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
  const [activeTab3, setActiveTab3] = useState<any>(1);
  const [isMounted, setIsMounted] = useState(false);
  const [minBudget, setMinBudget] = useState('');
  const [minBudgetError, setMinBudgetError] = useState('');
  const [minBudgetErrorText, setMinBudgetErrorText] = useState('');
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Client Dashboard'));
  });

  useEffect(() => {
    setIsMounted(true);
  });

  function onSubmit(data: any) {
    const shootDatetimes = items.map((item: any) => {
      const s_time = parseISO(data.start_date_time);
      const e_time = parseISO(data.end_date_time);
      const starting_date = format(s_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const ending_date = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const startingTime = new Date(starting_date);
      const endingTime = new Date(ending_date);

      // Calculate the time difference in milliseconds
      const timeDifferenceInMilliseconds: number = endingTime.getTime() - startingTime.getTime();

      // Calculate the time difference in hours
      const durationSingle = timeDifferenceInMilliseconds / (1000 * 60 * 60);

      return {
        start_date_time: starting_date,
        end_date_time: ending_date,
        duration: durationSingle,
      };
    });

    //TODO Need to add cp id and client ID FOR POST ORDER
    const orderData = {
      content_type: data.content_type,
      content_vertical: data.content_vertical,
      order_name: data.order_name,
      location: data.location,
      references: data.references,
      budget: {
        max: data.max_budget,
        min: data.min_budget,
      },
      description: data.description,
      shoot_duration: shootDatetimes.reduce((total, shoot) => total + shoot.duration, 0),
      shoot_datetimes: shootDatetimes,
    };
    console.log('DATA', orderData);
  }

  const changeQuantityPrice = (type: string, value: string, id: number) => {
    const list = items;
    const item = list.find((d: any) => d.id === id);
    if (type === 'quantity') {
      item.quantity = Number(value);
    }
    if (type === 'price') {
      item.amount = Number(value);
    }
    setItems([...list]);
  };

  const addItem = () => {
    let maxId = 0;
    maxId = items?.length ? items.reduce((max: number, character: any) => (character.id > max ? character.id : max), items[0].id) : 0;

    setItems([
      ...items,
      {
        id: maxId + 1,
        title: '',
        description: '',
        rate: 0,
        quantity: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (item: any = null) => {
    // Check if there's only one item left, and if so, don't remove it
    if (items.length === 1) {
      return;
    }
    setItems(items.filter((d: any) => d.id !== item.id));
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

  const handleChangeMinBudget = (e: any) => {
    const value = e.target.value;
    setMinBudget(value);
    if (minBudget < 1000) {
      setMinBudgetError("border-[#ff0000] focus:border-[#ff0000]");
      setMinBudgetErrorText("Minimum budget must be greater than $1000");
      console.log(value);
    } else {
      setMinBudgetError("");
      setMinBudgetErrorText("");
    }
  };

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
                <div className="relative z-[1]">
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                          <path
                            opacity="0.5"
                            d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </li>
                    <li className="mx-auto">
                      <button
                        type="button"
                        className={`${activeTab3 === 2 ? '!border-warning !bg-warning text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                        onClick={() => setActiveTab3(2)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                          <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </li>
                    <li className="mx-auto">
                      <button
                        type="button"
                        className={`${activeTab3 === 3 ? '!border-warning !bg-warning text-white' : ''}
                                            flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                        onClick={() => setActiveTab3(3)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20.9751 12.1852L20.2361 12.0574L20.9751 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93776 20.4771L6.19055 20.5417H6.19055L6.93776 20.4771ZM6.1256 11.0844L6.87281 11.0198L6.1256 11.0844ZM13.9949 5.22142L14.7351 5.34269V5.34269L13.9949 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69813 9.67749L6.20854 9.10933H6.20854L6.69813 9.67749ZM8.13687 8.43769L8.62646 9.00585H8.62646L8.13687 8.43769ZM10.518 4.78374L9.79207 4.59542L10.518 4.78374ZM10.9938 2.94989L11.7197 3.13821L11.7197 3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.0419 1.39687L13.0419 1.39687L12.8126 2.11093ZM9.86194 6.46262L10.5235 6.81599V6.81599L9.86194 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675L11.3486 1.45675L11.6742 2.13239ZM20.2361 12.0574L19.5306 16.1371L21.0086 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59634V22.75H13.245V21.25ZM7.68497 20.4125L6.87281 11.0198L5.37839 11.149L6.19055 20.5417L7.68497 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0086 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18772 10.2456L8.62646 9.00585L7.64728 7.86954L6.20854 9.10933L7.18772 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79207 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.0419 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79207 4.59542C9.65572 5.12107 9.45698 5.62893 9.20041 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6306 3.05921C14.4252 2.26719 13.819 1.64648 13.0419 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7547 3.0032 11.8522 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3872 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM14.7351 5.34269C14.8596 4.58256 14.824 3.80477 14.6306 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59634 21.25C8.12243 21.25 7.726 20.887 7.68497 20.4125L6.19055 20.5417C6.29851 21.7902 7.34269 22.75 8.59634 22.75V21.25ZM8.62646 9.00585C9.30632 8.42 10.0391 7.72267 10.5235 6.81599L9.20041 6.10924C8.85403 6.75767 8.30249 7.30493 7.64728 7.86954L8.62646 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87281 11.0198C6.84739 10.7258 6.96474 10.4378 7.18772 10.2456L6.20854 9.10933C5.62021 9.61631 5.31148 10.3753 5.37839 11.149L6.87281 11.0198Z"
                            fill="currentColor"
                          />
                          <path
                            opacity="0.5"
                            d="M3.9716 21.4709L3.22439 21.5355L3.9716 21.4709ZM3 10.2344L3.74721 10.1698C3.71261 9.76962 3.36893 9.46776 2.96767 9.48507C2.5664 9.50239 2.25 9.83274 2.25 10.2344L3 10.2344ZM4.71881 21.4063L3.74721 10.1698L2.25279 10.299L3.22439 21.5355L4.71881 21.4063ZM3.75 21.5129V10.2344H2.25V21.5129H3.75ZM3.22439 21.5355C3.2112 21.383 3.33146 21.2502 3.48671 21.2502V22.7502C4.21268 22.7502 4.78122 22.1281 4.71881 21.4063L3.22439 21.5355ZM3.48671 21.2502C3.63292 21.2502 3.75 21.3686 3.75 21.5129H2.25C2.25 22.1954 2.80289 22.7502 3.48671 22.7502V21.2502Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  {activeTab3 === 1 && (
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex items-center justify-between">
                        {/* Shoot Type */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                          <div className="flex-1">
                            {/* Video */}
                            <div className="mb-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox" defaultValue="Video" id="videoShootType" {...register('content_type')} />
                                <span className="text-white-dark">Video</span>
                              </label>
                            </div>
                            {/* Photo */}
                            <div className="mb-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox" defaultValue="Photo" id="photoShootType" {...register('content_type')} />
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
                            <option>Select Category</option>
                            <option value="Business">Business</option>
                            <option value="Personal">Personal</option>
                            <option value="Wedding">Wedding</option>
                          </select>
                          {errors.content_vertical && <p className="text-danger">{errors?.content_vertical.message}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Order Name */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="order_name" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Order Name
                          </label>
                          <input id="order_name" type="text" defaultValue="Order One" className="form-input" {...register('order_name')} />
                          {errors.order_name && <p className="text-danger">{errors?.order_name.message}</p>}
                        </div>

                        {/* Location */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="location" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Location
                          </label>
                          <input id="location" type="text" placeholder="Enter location" defaultValue="LA" className="form-input" {...register('location')} />
                          {errors.location && <p className="text-danger">{errors?.location.message}</p>}
                        </div>
                      </div>
                      <div className="mt-8">
                        <div className="table-responsive">
                          <table>
                            <tbody>
                              {items.map((item: any) => {
                                return (
                                  <div className="mb-5 flex items-center justify-between" key={item.id}>
                                    {/* Starting Date and Time */}
                                    <div className="flex basis-[40%] flex-col sm:flex-row">
                                      <label htmlFor="start_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        Starting Date
                                      </label>
                                      <input className="form-input" type="datetime-local" id="start_date_time" {...register('start_date_time')} />
                                    </div>
                                    {/* Ending Date and Time */}
                                    <div className="flex basis-[40%] flex-col sm:flex-row">
                                      <label htmlFor="end_date_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        Ending Date
                                      </label>
                                      <input type="datetime-local" id="end_date_time" className="form-input" {...register('end_date_time')} />
                                    </div>
                                    <button type="button" onClick={() => removeItem(item)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                      </svg>
                                    </button>
                                    <button type="button" className="btn btn-success" onClick={() => addItem()}>
                                      Add More
                                    </button>
                                  </div>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* references */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            References
                          </label>
                          <input id="references" type="text" placeholder="https://sitename.com" defaultValue="https://sitename.com" className="form-input" {...register('references')} />
                          {errors.references && <p className="text-danger">{errors?.references.message}</p>}
                        </div>

                        {/* Add Image */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="images" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Add Image
                          </label>
                          <input id="images" type="file" className="form-input" multiple />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* min_budget budget */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="min_budget" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Min Budget
                          </label>
                          <input id="min_budget" type="number" className={`form-input block ${minBudgetError}`} {...register('min_budget')} onChange={handleChangeMinBudget} />
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
                      <div className='text-[#ff0000] ml-[120px] leading-none font-sans'>{minBudgetErrorText}</div>
                      <div className="flex items-center justify-between">
                        {/* Special Note */}
                        <div className="flex basis-[45%] flex-col sm:flex-row">
                          <label htmlFor="description" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Special Note
                          </label>
                          <textarea id="description" rows={3} className="form-textarea" placeholder="Type your note here..." {...register('description')}></textarea>
                          {errors.description && <p className="text-danger">{errors?.description.message}</p>}
                        </div>
                      </div>
                      <button type="submit" className="btn mt-6 bg-black font-sans text-white">
                        Enter
                      </button>
                    </form>
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
                                  shoot
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
                                  shoot
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
                                  shoot
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
                                  shoot
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
                                  shoot
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
                                          className={`whitespace-nowrap ${data.indicator === 1
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
                  <button type="button" className="btn btn-warning font-sans ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab3(activeTab3 === 1 ? 2 : 3)}>
                    {activeTab3 === 3 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexClient;
