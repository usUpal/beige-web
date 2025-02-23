/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Map from '@/components/Map';
import Loader from '@/components/SharedComponent/Loader';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { shootCostCalculation } from '@/utils/BookingUtils/shootCostCalculation';
import { swalToast } from '@/utils/Toast/SwalToast';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isValid, parseISO } from 'date-fns';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ResponsivePagination from 'react-responsive-pagination';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/contexts/authContext';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';
import { API_ENDPOINT } from '@/config';
import { useLazyGetAlgoCpQuery, usePostOrderMutation, useUpdateOrderMutation } from '@/Redux/features/shoot/shootApi';
import { toast } from 'react-toastify';
import { useNewMeetLinkMutation, useNewMeetingMutation } from '@/Redux/features/meeting/meetingApi';
import { useGetAllPricingQuery } from '@/Redux/features/pricing/pricingApi';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { useRouter } from 'next/router';
import { useGetAllAddonsQuery } from '@/Redux/features/addons/addonsApi';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';
import AccessDenied from '@/components/errors/AccessDenied';
import useCalculateAddons from '@/hooks/useCalculateAddons';
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

interface CategoryListData {
  name: string;
  budget: {
    max: number;
    min: number;
  };
}

const BookNow = () => {
  const { data: addonsData } = useGetAllAddonsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('booking_page');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(1);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [dateTimes, setDateTimes] = useState<FormData[]>([]);
  const [showDateTimes, setShowDateTimes] = useState<any>();
  const [getTotalDuration, setTotalDuration] = useState<any>();
  const [meetingTime, setMeetingTime] = useState<any>();

  const [client_id, setClient_id] = useState(userData?.role === 'user' ? userData?.id : '');
  const [clientName, setClientName] = useState('');
  const {
    selectedFilteredAddons,
    addonExtraHours,
    filteredAddonsData,
    formDataPageOne,
    computedRates,
    allAddonRates,
    setFormDataPageOne,
    handleHoursOnChange,
    handleCheckboxChange,
    handleShowAddonsData,
  } = useCalculateAddons();

  const [allRates, setAllRates] = useState(0);
  const [geo_location, setGeo_location] = useState({ coordinates: [], type: 'Point' });
  const [shootCosts, setShootCosts] = useState<number>(0);
  const [cp_ids, setCp_ids] = useState([]);
  const [search, setSearch] = useState(false);
  const [clients, setClients] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const [myMaxBud, setMyMaxBud] = useState(0);
  const [myMinBud, setMyMinBud] = useState(0);

  const [formattedMeetingTime, setFormattedMeetingTime] = useState('');

  const [newMeetLink, { isLoading: isNewMeetLinkLoading }] = useNewMeetLinkMutation();
  const [newMeeting, { isLoading: isNewMeetingLoading }] = useNewMeetingMutation();
  const { data: pricingData } = useGetAllPricingQuery({});

  const [getAlgoCp, { data: allAlgoCp, isLoading: isGetAlgoCpLoading, error: getAlgoCpError }] = useLazyGetAlgoCpQuery();
  const [updateOrder, { isLoading: isUpdateOrderLoading }] = useUpdateOrderMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: {} });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Manager Dashboard'));
    localStorage.removeItem('location');
    if (!authPermissions?.includes('booking_page')) {
      router.push('/errors/access-denied');
    }
  }, []);

  useEffect(() => {
    const storedDateTimes = JSON.parse(localStorage.getItem('dateTimes')!) || [];
    setDateTimes(storedDateTimes);
  }, []);

  useEffect(() => {
    if (formDataPageOne?.content_type?.length !== 0 && formDataPageOne?.content_vertical !== '') {
      handleShowAddonsData();
    }
  }, [formDataPageOne?.content_type?.length]);
  // get all calculate price params

  //   Calculate shoot cost
  useEffect(() => {
    if (activeTab === 3) {
      const totalShootCost = shootCostCalculation(getTotalDuration, formDataPageOne?.content_type, cp_ids, formDataPageOne?.content_vertical, pricingData?.results);
      setShootCosts(totalShootCost);
      setAllRates(allAddonRates + shootCosts);
    }
  }, [activeTab, allAddonRates]);

  const startDateTimeRef = useRef(null);
  const endDateTimeRef = useRef(null);
  const meetingDateTimeRef = useRef(null);
  let flatpickrInstance = useRef(null);

  const handleBack = () => {
    setActiveTab((prev) => (prev === 3 ? 2 : 1));
    setTimeout(() => {
      if (startDateTimeRef.current) {
        flatpickrInstance.current = flatpickr(startDateTimeRef.current, {
          altInput: true,
          altFormat: 'F j, Y h:i K',
          dateFormat: 'Y-m-d H:i',
          enableTime: true,
          time_24hr: false,
          minDate: 'today',
          onChange: (selectedDates, dateStr) => {
            handleChangeStartDateTime(dateStr);
          },
        });
      }

      if (endDateTimeRef.current) {
        flatpickrInstance.current = flatpickr(endDateTimeRef.current, {
          altInput: true,
          altFormat: 'F j, Y h:i K',
          dateFormat: 'Y-m-d H:i',
          enableTime: true,
          time_24hr: false,
          minDate: 'today',
          onChange: (selectedDates, dateStr) => {
            handleChangeEndDateTime(dateStr);
          },
        });
      }
    }, 0);
  };

  useEffect(() => {
    if (startDateTimeRef.current) {
      flatpickrInstance.current = flatpickr(startDateTimeRef.current, {
        altInput: true,
        altFormat: 'F j, Y h:i K',
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        time_24hr: false,
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          handleChangeStartDateTime(dateStr);
        },
      });
    }
    if (endDateTimeRef.current) {
      flatpickr(endDateTimeRef.current, {
        altInput: true,
        altFormat: 'F j, Y h:i K',
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        time_24hr: false,
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          handleChangeEndDateTime(dateStr);
        },
      });
    }
    if (meetingDateTimeRef.current) {
      flatpickr(meetingDateTimeRef.current, {
        altInput: true,
        altFormat: 'F j, Y h:i K',
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        time_24hr: false,
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          handelOnMeetingDateTimeChange(dateStr);
        },
      });
    }

    // Cleanup function to destroy flatpickr instance
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  const handleChangeStartDateTime = (dateStr: any) => {
    try {
      const s_time = parseISO(dateStr);
      if (!isValid(s_time)) {
        return;
      }
      const starting_date = format(s_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setStartDateTime(starting_date);
    } catch (error) {}
  };

  const handleChangeEndDateTime = (dateStr: any) => {
    try {
      const e_time = parseISO(dateStr);
      if (!isValid(e_time)) {
        return;
      }
      const ending_date = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setEndDateTime(ending_date);
    } catch (error) {}
  };

  const handelOnMeetingDateTimeChange = (dateStr: any) => {
    try {
      const e_time = parseISO(dateStr);
      if (!isValid(e_time)) {
        return;
      }
      const formattedTime = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setFormattedMeetingTime(formattedTime);
    } catch (error) {}
  };

  const addDateTime = () => {
    const newDateTime: FormData = {
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      duration: calculateDuration(startDateTime, endDateTime),
      date_status: 'confirmed',
    };
    if (calculateDuration(startDateTime, endDateTime) <= 0) {
      swalToast('danger', 'End time must be greater than start time!');
      return;
    }
    if (newDateTime?.end_date_time !== '' && newDateTime?.start_date_time !== '') {
      const newDateTimes = [...dateTimes, newDateTime];
      setDateTimes(newDateTimes);
      setShowDateTimes(JSON.stringify(newDateTimes));
      logTotalDuration(newDateTimes);

      setStartDateTime('');
      setEndDateTime('');
    }
  };

  function convertToEnglishDateFormat(inputDateString: any) {
    let date = new Date(inputDateString);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    let period = hours >= 12 ? 'PM' : 'AM';

    let formattedHours = hours % 12 || 12;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    let formattedDate = `${months[month]} ${day}, ${year} Time: ${formattedHours}:${formattedMinutes} ${period}`;
    return formattedDate;
  }

  const calculateDuration = (startDateTime: any, endDateTime: any) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60); // 1 hour = 3600000 milliseconds
    return Math.ceil(durationHours);
  };

  const logTotalDuration = (dateTimesArray: any) => {
    const totalDuration = dateTimesArray.reduce((acc: any, dateTime: any) => {
      const duration = calculateDuration(dateTime.start_date_time, dateTime.end_date_time);
      return acc + duration;
    }, 0);
    setTotalDuration(totalDuration);
  };

  const handleTimeRemove = (rmvDateTime: any) => {
    const updatedDateTimes = dateTimes.filter((dateTime) => dateTime.start_date_time !== rmvDateTime);

    setDateTimes(updatedDateTimes);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectProducer = (cp: any) => {
    const newCp = {
      id: cp?.userId?._id,
      name: cp?.userId?.name,
      decision: 'accepted',
      role: 'Beige Producer',
      url: cp?.userId?.profile_picture,
      location: cp?.city,
    };
    const isCpSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
    if (isCpSelected) {
      const updatedCps = cp_ids.filter((item: any) => item.id !== cp?.userId?._id);
      setCp_ids(updatedCps);
    } else {
      const updatedCps = [...cp_ids, newCp];
      setCp_ids(updatedCps);
    }
  };

  const convertToISO = (datetime: any) => {
    const date = new Date(datetime);
    const isoDate = date.toISOString();
    return isoDate;
  };

  const getMeetingLink = async (shootInfo: any, meetingDate: any) => {
    const requestBody = {
      userId: userData?.id,
      requestData: {
        summary: shootInfo?.order_name ? shootInfo?.order_name : 'Beige Meeting',
        location: 'Online',
        description: `Meeting to discuss ${shootInfo?.order_name ? shootInfo?.order_name : 'Beige'} order.`,
        startDateTime: meetingDate,
        endDateTime: meetingDate,
        orderId: shootInfo?.id,
      },
    };

    const response = await newMeetLink(requestBody);
    if (response?.data) {
      const requestBody = {
        meeting_date_time: meetingDate,
        meeting_status: 'pending',
        meeting_type: 'pre_production',
        order_id: shootInfo?.id,
        meetLink: response?.data?.meetLink,
      };
      const result = await newMeeting(requestBody);
      if (result?.data) {
        return true;
      } else {
        toast.error('Something want wrong...!');
      }
    } else {
      toast.error('Something want wrong...!');
    }
  };

  // set category data for the ui
  const categoryList: CategoryListData[] = [
    { name: 'Commercial', budget: { min: 1500, max: 10000 } },
    { name: 'Corporate', budget: { min: 1500, max: 10000 } },
    { name: 'Music', budget: { min: 1500, max: 10000 } },
    { name: 'Private', budget: { min: 1500, max: 10000 } },
    { name: 'Wedding', budget: { min: 1000, max: 1500 } },
    { name: 'Other', budget: { min: 1000, max: 10000 } },
  ];

  const handleChangeCategoryWithBudget = (event: any) => {
    const selectedCategory = event.target.value;
    const category = categoryList.find((cat) => cat.name === selectedCategory);

    if (category) {
      setMyMaxBud(category.budget.max);
      setMyMinBud(category.budget.min);
    } else {
      setMyMaxBud(0);
      setMyMinBud(0);
    }
  };

  const [postOrder, { isSuccess, isLoading: isPostOrderLoading }] = usePostOrderMutation();

  const onSubmit = async (data: any) => {
    if (geo_location?.coordinates?.length === 0) {
      toast.error('Please select shoot location...!');
      return;
    }
    if (data.content_type == false) {
      toast.error('Please select a content type...!');
      return;
    } else {
      try {
        const formattedData = {
          budget: {
            min: myMinBud,
            max: myMaxBud,
          },
          client_id,
          order_status: userData?.role === 'admin' ? 'pre_production' : 'pending',
          content_type: data.content_type,
          content_vertical: data.content_vertical,
          description: data.description,
          location: localStorage.getItem('location'),
          order_name: orderName(),
          references: data.references,
          shoot_datetimes: JSON.parse(showDateTimes),
          geo_location,
          shoot_duration: getTotalDuration,
          addOns: selectedFilteredAddons,
          cp_ids: cp_ids,
          addOns_cost: allAddonRates,
          shoot_cost: selectedFilteredAddons.length > 0 ? allRates : shootCosts,
        };
        if (Object.keys(formattedData).length > 0) {
          setIsLoading(true);
          setFormDataPageOne(formattedData);
          if (activeTab === 1) {
            const result = await postOrder(formattedData);
            const res = await getAlgoCp(result?.data?.id);
            if (res?.isSuccess) {
              setActiveTab(activeTab === 1 ? 2 : 3);
              setOrderId(result?.data?.id);
              setIsLoading(false);
            }
          }
        } else {
          return false;
        }
        if (activeTab === 2) {
          setIsLoading(true);
          setActiveTab(activeTab === 2 ? 3 : 1);
          setIsLoading(false);
        }
        if (activeTab === 3) {
          setIsLoading(true);
          const formattedCpIds = cp_ids.map((cp: any) => ({
            id: cp.id,
            decision: userData?.role === 'admin' ? 'accepted' : 'pending',
          }));

          const formattedData = {
            addOns: selectedFilteredAddons,
            cp_ids: formattedCpIds,
            addOns_cost: allAddonRates,
            shoot_cost: selectedFilteredAddons.length > 0 ? allRates : shootCosts,
          };

          const updateRes = await updateOrder({
            requestData: formattedData,
            id: orderId,
          });

          if (updateRes?.data) {
            toast.success('Shoot has been created successfully');
            if (formattedMeetingTime) {
              // const meeting_time = convertToISO(formattedMeetingTime);
              const meetingInfo = await getMeetingLink(updateRes?.data, formattedMeetingTime);
              if (meetingInfo) {
                toast.success('Meeting has been created successfully!');
              }
            }
            setIsLoading(false);
            router.push('/dashboard/shoots');
          }
        }
      } catch (error) {
        swalToast('danger', 'error');
        setIsLoading(false);
      }
    }
  };
  const contentTypes = watch('content_type', []);
  const contentVertical = watch('content_vertical');

  const searchQuer = {
    role: 'user',
    search: clientName,
  };

  const { data } = useGetAllUserQuery(searchQuer, {
    refetchOnMountOrArgChange: true,
  });

  const getAllClients = async () => {
    setIsClientLoading(true);
    setClients(data?.results || []);
    setShowClientDropdown(true);
    setIsClientLoading(false);
  };

  const handleClientChange = (client: any) => {
    setClient_id(client?.id);
    setClientName(client?.name);
    setShowClientDropdown(false);
  };

  const orderName = () => {
    const contentType: any = getValues('content_type') || [];
    let contentVertical = getValues('content_vertical');
    let type = '';
    if (contentType.includes('video') && contentType.includes('photo')) {
      type = 'Photography and Videography';
    } else if (contentType.includes('video')) {
      type = 'Videography';
    } else if (contentType.includes('photo')) {
      type = 'Photography';
    }
    if (contentVertical === 'SelectCategory') {
      contentVertical = 'Category';
    }
    const concateOrderName = `${userData?.role === 'user' ? userData?.name : clientName || 'Name'}'s ${contentVertical} ${type || 'Type'}`;
    return concateOrderName;
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef?.current?.contains(event.target)) {
        setShowClientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div>
      <div className="mt-5 grid  grid-cols-1 lg:grid-cols-1">
        {/* icon only */}
        <div className="panel">
          <div className="">
            <div className="inline-block w-full">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  {activeTab === 1 && (
                    <>
                      <div className="h-[80vh]">
                        <div className="flex items-center justify-between md:mb-8 md:gap-6 lg:mb-8 xl:gap-4">
                          {/* Content Type */}
                          <div className="flex w-full flex-col sm:flex-row">
                            <label className="text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:w-16 lg:w-24 2xl:w-40">Content Type</label>
                            <div className="flex-1 md:ml-2 lg:ml-1 2xl:ml-0">
                              {/* Video */}
                              <div className="mb-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className={`form-checkbox ${errors?.content_type && 'border border-danger'} bg-white text-black dark:bg-slate-800 dark:text-slate-400`}
                                    value="video"
                                    {...register('content_type', {
                                      validate: {
                                        required: () => contentTypes?.length > 0 || 'Select at least one content type',
                                      },
                                    })}
                                  />
                                  <span className="text-black dark:text-slate-400">Videography</span>
                                </label>
                              </div>
                              {/* Photo */}
                              <div className="mb-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className={`form-checkbox ${errors?.content_type && 'border border-danger'} bg-white text-black dark:bg-slate-800 dark:text-slate-400`}
                                    value="photo"
                                    {...register('content_type')}
                                  />
                                  <span className="text-black dark:text-slate-400">Photography</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Category || content vertical*/}
                          <div className="flex w-full flex-col sm:flex-row 2xl:ml-32 ">
                            <label htmlFor="content_vertical" className="mb-0 capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 sm:ltr:mr-2">
                              Category
                            </label>
                            <select
                              className={`form-select rounded-md border bg-slate-100 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500  dark:focus:ring-indigo-500  xl:ml-2 2xl:ml-0 ${
                                errors.content_vertical ? 'border-red-500' : ''
                              }`}
                              id="content_vertical"
                              defaultValue="SelectCategory"
                              {...register('content_vertical', {
                                required: 'Category is required',
                                validate: (value) => value !== 'SelectCategory' || 'Please select a valid category',
                              })}
                              onChange={handleChangeCategoryWithBudget}
                            >
                              <option value="SelectCategory dark:bg-black ">Select Category</option>
                              {categoryList.map((category) => (
                                <option key={category?.name} value={category?.name}>
                                  {category?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="my-5 flex-col items-center justify-between gap-4 md:mb-10 md:flex md:flex-row md:gap-9 xl:gap-5">
                          {userData?.role === 'admin' && (
                            <div className="relative flex w-full flex-col space-x-0 sm:mb-4 sm:flex-row sm:space-x-[0px] xl:space-x-0 2xl:space-x-16">
                              <label htmlFor="content_vertical" className="mb-0 capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 sm:ltr:mr-2 md:w-[90px] xl:w-[110px]">
                                Client
                              </label>
                              <input
                                type="search"
                                onChange={(event) => {
                                  setClientName(event?.target?.value);
                                  getAllClients();
                                }}
                                className="form-input h-10 flex-grow bg-slate-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 dark:focus:ring-indigo-500 md:ml-2 lg:ml-2 xl:ml-5 2xl:ml-8"
                                value={clientName}
                                placeholder="Client"
                                required={!clientName}
                              />

                              {showClientDropdown && (
                                <div ref={dropdownRef} className="absolute right-0 top-[43px] z-30 w-[79%] rounded-md border-2 border-black-light bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
                                  {isClientLoading ? (
                                    <div className="scrollbar mb-2 mt-2 h-[190px] animate-pulse overflow-x-hidden overflow-y-scroll">
                                      {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded-sm bg-gray-200 px-2 py-1 dark:bg-gray-700">
                                          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-gray-600"></div>
                                          <div className="h-7 w-full rounded-sm bg-slate-200 dark:bg-gray-600"></div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <>
                                      {clients && clients.length > 0 ? (
                                        <ul className="scrollbar mb-2 mt-2 h-[300px] overflow-x-hidden overflow-y-scroll">
                                          {clients.map((client) => (
                                            <li
                                              key={client?.id}
                                              onClick={() => handleClientChange(client)}
                                              className="flex cursor-pointer items-center rounded-md px-3 py-2 text-[13px] font-medium leading-3 hover:bg-[#dfdddd83] dark:text-slate-400 dark:hover:bg-[#333333]"
                                            >
                                              <div className="relative m-1 mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xl text-white">
                                                <Image
                                                  src={client?.profile_picture || '/assets/images/favicon.png'}
                                                  className="h-full w-full rounded-full"
                                                  alt="Profile Picture"
                                                  width={100}
                                                  height={100}
                                                />
                                              </div>
                                              <a href="#" className="text-black dark:text-slate-400">
                                                {client?.name}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <div className="flex cursor-pointer items-center rounded-md px-3 py-2 text-[13px] font-medium leading-3 hover:bg-[#dfdddd83]">
                                          <p className="text-center text-red-500">No client found</p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Location */}
                          <div
                            className={`mt-2 flex w-full flex-col sm:flex-row sm:space-x-[52px] md:mt-0 lg:space-x-[8px] xl:space-x-0 ${userData?.role !== 'admin' ? 'md:w-[49.5%] ' : '2xl:ml-32'}`}
                          >
                            <label htmlFor="location" className={`mb-0 capitalize text-black dark:text-slate-400 xl:w-24 2xl:w-36`}>
                              Location
                            </label>
                            <div className={`flex-grow md:ml-2 lg:ml-0  ${userData?.role !== 'admin' ? '2xl:ml-3 2xl:mr-16' : ''}`}>
                              <Map setGeo_location={setGeo_location} setLocation={setLocation} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 w-full flex-col items-start justify-between md:flex md:flex-row md:gap-4 xl:gap-8 2xl:gap-32">
                          <div className="flex w-full flex-col space-x-0 sm:mb-4 sm:flex-row sm:space-x-[5px] xl:space-x-[20px] 2xl:space-x-[30px]">
                            <label htmlFor="order_name" className="mb-0  text-black dark:text-slate-400 sm:w-1/4 md:w-24 lg:w-24 2xl:w-40">
                              Shoot Name
                            </label>
                            <input
                              id="order_name"
                              title="Shoot name automatically Generate based on you information"
                              disabled
                              value={orderName()}
                              type="text"
                              className="form-input h-10 flex-grow bg-slate-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 dark:focus:ring-indigo-500 md:ml-2 lg:ml-2 xl:ml-5 2xl:ml-8"
                              placeholder="Shoot Name"
                              {...register('order_name')}
                            />
                          </div>

                          {/* references */}
                          <div className="mt-2 flex w-full flex-col space-x-0 sm:flex-row sm:space-x-[33px] md:mt-0 lg:space-x-2 2xl:ml-5 2xl:space-x-16">
                            <label htmlFor="references" className="mb-0 text-black dark:text-slate-400 ">
                              References
                            </label>
                            <input
                              id="references"
                              type="text"
                              placeholder="https://sitename.com"
                              className="form-input bg-slate-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 dark:focus:ring-indigo-500 xl:ml-2 2xl:ml-16"
                              {...register('references')}
                            />
                          </div>
                        </div>

                        {/* Shoot Timings */}
                        <div className="mb-0 mt-5 lg:mb-10 ">
                          <div className="w-full items-center justify-between md:flex">
                            {/* Starting Date and Time */}
                            <div className="flex w-full flex-col sm:flex-row md:mb-0">
                              <label htmlFor="start_date_time" className="mb-3 mt-4 text-black dark:text-slate-400 md:ml-2 md:w-16 lg:ml-0 xl:w-24 2xl:w-[154px]">
                                Shoot Time
                              </label>

                              <div className="relative ">
                                <p className="mb-1 text-xs font-bold text-black dark:text-slate-400 sm:mb-0">Start Time</p>

                                <input
                                  id="start_date_time"
                                  ref={startDateTimeRef}
                                  type="text"
                                  className={`form-input w-full cursor-pointer p-0 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 sm:w-[220px] md:w-60 xl:pl-1.5 ${
                                    errors?.start_date_time ? 'border-red-500' : ''
                                  }`}
                                  placeholder="Start time"
                                  required={startDateTime?.length === 0}
                                />
                                <span className="pointer-events-none absolute right-[10px] top-[55%] hidden -translate-y-1/4 transform md:block">🗓️</span>

                                {errors?.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                              </div>

                              <div className="relative mt-3 sm:mt-0">
                                <p className="mb-1 text-xs font-bold text-black dark:text-slate-400 sm:mb-0">End Time</p>
                                <input
                                  id="end_date_time"
                                  ref={endDateTimeRef}
                                  type="text"
                                  className={`form-input ml-0 w-full cursor-pointer p-0 py-2 pl-1.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 sm:w-[220px] md:ml-1 md:w-60 ${
                                    errors?.end_date_time ? 'border-red-500' : ''
                                  }`}
                                  placeholder="End time"
                                  required={endDateTime?.length === 0}
                                />

                                <span className="md:top[40%] pointer-events-none absolute right-[10px] top-[55%] hidden -translate-y-1/4 transform md:block lg:top-[55%]">🗓️</span>
                                {errors?.end_date_time && <p className="text-danger">{errors?.end_date_time.message}</p>}
                              </div>

                              <div className="flex justify-end">
                                <>
                                  <div className="flex justify-end">
                                    <span
                                      className=" ml-2 mt-4 h-9 w-16 cursor-pointer rounded-md bg-black px-4 py-1 text-center font-sans text-[14px] capitalize leading-[28px] text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                                      onClick={addDateTime}
                                    >
                                      Add
                                    </span>
                                  </div>
                                  {errors?.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                                </>
                              </div>
                            </div>
                          </div>

                          <div className="table-responsive">
                            {/* DateTime Output show Table */}
                            {dateTimes?.length !== 0 && (
                              <div className=" mt-4 2xl:float-right 2xl:w-[90%]">
                                <table className="table-auto">
                                  <thead className="bg-white dark:bg-slate-800">
                                    <tr>
                                      <th className="text-black dark:text-slate-400">#</th>
                                      <th className="text-black dark:text-slate-400">Start Time</th>
                                      <th className="text-black dark:text-slate-400">End Time</th>
                                      <th className="text-black dark:text-slate-400">Duration</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dateTimes?.map((dateTime: FormData, index) => (
                                      <tr key={index} className="bg-white dark:bg-slate-800">
                                        <td className="text-black dark:text-slate-400">{index + 1}</td>
                                        <td className="text-black dark:text-slate-400">{convertToEnglishDateFormat(dateTime?.start_date_time)}</td>
                                        <td className="text-black dark:text-slate-400">{convertToEnglishDateFormat(dateTime?.end_date_time)}</td>
                                        <td className="flex items-center justify-between">
                                          <span className="text-black dark:text-slate-400">{calculateDuration(dateTime?.start_date_time, dateTime?.end_date_time)} Hour</span>
                                          <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => handleTimeRemove(dateTime?.start_date_time)}>
                                            {allSvgs.closeBtnCp}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* {userData?.role === 'admin' && ( */}
                        <div className={` ${userData?.role === 'admin' ? 'mt-4' : ''} w-full flex-col items-center justify-between md:mt-0 md:flex md:flex-row md:gap-4 xl:gap-8 2xl:gap-32`}>
                          {/* Special Note */}
                          <div className={`flex flex-col sm:mb-5 sm:flex-row ${userData?.role === 'admin' ? 'w-full' : 'md:w-[50%]  2xl:w-[45%]'}`}>
                            <label htmlFor="description" className="mb-0 text-black rtl:ml-2 dark:text-slate-400 sm:w-[120px] sm:ltr:mr-2 md:w-[100px] lg:w-[70px] xl:w-[105px] 2xl:w-[160px]">
                              Special Note
                            </label>

                            <textarea
                              id="description"
                              rows={1}
                              className="form-textarea bg-slate-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 dark:focus:ring-indigo-500 xl:ml-2 2xl:ml-5"
                              placeholder="Type your note here..."
                              {...register('description')}
                            ></textarea>
                          </div>
                          {userData?.role === 'admin' && (
                            // <div className="mb-3 mt-3 flex w-full flex-col sm:mt-0 sm:flex-row md:mb-0">
                            //   <label htmlFor="meeting_time" className="mb-0 text-black rtl:ml-2 dark:text-slate-400 sm:w-[120px] sm:ltr:mr-2 md:w-[100px] lg:w-[70px] xl:w-[105px] 2xl:w-[160px]">
                            //     Meeting time
                            //   </label>
                            //   <div className="relative w-full">
                            //     <Flatpickr
                            //       id="meeting_time"
                            //       className={`form-input ml-0 w-full cursor-pointer p-0 py-2 pl-1.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:placeholder-gray-500 sm:w-[220px] md:ml-1 md:w-60 xl:w-[220px] ${
                            //         errors?.end_date_time ? 'border-red-500' : ''
                            //       }`}
                            //       value={meetingTime}
                            //       placeholder="Meeting time ..."
                            //       options={{
                            //         altInput: true,
                            //         altFormat: 'F j, Y h:i K',
                            //         dateFormat: 'Y-m-d H:i',
                            //         enableTime: true,
                            //         time_24hr: false,
                            //         minDate: 'today',
                            //       }}
                            //       onChange={(date) => {
                            //         setMeetingTime(date[0]);
                            //         setValue('meeting_time', date[0]);
                            //       }}
                            //     />
                            //     <input type="hidden" {...register('meeting_time')} />

                            //     {/* Calendar Icon Inside the Field */}
                            //     <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400">🗓️</span>

                            //     {/* Display error message */}
                            //     {errors?.meeting_time && <p className="text-danger">{errors?.meeting_time.message}</p>}
                            //   </div>
                            // </div>

                            <div className="mb-3 mt-3  flex w-full flex-col sm:mt-0 sm:flex-row md:mb-0">
                              <label htmlFor="meeting_time" className="mb-0  w-full rtl:ml-2 sm:ltr:mr-2 md:w-[24%] ">
                                Meeting time
                              </label>

                              <div className="relative w-full ">
                                <input
                                  type="text"
                                  id="meeting_date_time"
                                  {...register('meeting_time')}
                                  ref={meetingDateTimeRef}
                                  className={`form-input cursor-pointer ${errors.meeting_time ? 'border-red-500' : ''}`}
                                  placeholder="Meeting time"
                                  // required={formattedMeetingTime}
                                />
                                <span className="-translate-y-1/6 pointer-events-none absolute right-[14px] top-[21%]  transform">🗓️</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-8 flex items-center justify-end ltr:ml-auto rtl:mr-auto">
                        <DefaultButton css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`} disabled={isLoading}>
                          {isLoading === true ? <Loader /> : 'Next'}
                        </DefaultButton>
                      </div>
                    </>
                  )}
                </div>

                <div className="">
                  {activeTab === 2 && (
                    <div>
                      <div className="flex-col items-center justify-between md:flex md:flex-row">
                        <div className="">
                          <div className="mb-[30px]">
                            <h2 className="mb-2 font-sans text-[18px] capitalize leading-none text-black dark:text-slate-400">Select Producer</h2>

                            <p className="text-[14px] capitalize leading-none text-[#838383] dark:text-slate-500">choose your beige photographer/videographer</p>
                          </div>
                        </div>
                        <div className="mb-5 md:mb-0">
                          {/* <input
                            type="text"
                            className="peer form-input w-64 bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                            placeholder="Search..."
                            onChange={(event) => setQuery(event.target.value)}
                            value={query}
                          /> */}
                        </div>
                        {/* search ends */}
                      </div>
                      {/* Showing all cps */}
                      <div className="grid grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {allAlgoCp?.results?.length > 0 ? (
                          allAlgoCp?.results?.map((cp: any) => {
                            const isSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
                            return (
                              <div key={cp?.userId?._id} className="single-match  basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                <div className="grid grid-cols-3 md:h-32">
                                  <div className="media relative h-14 w-14">
                                    <Image
                                      src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`}
                                      style={{ width: '100%', height: '100%' }}
                                      className="mr-3 rounded-full"
                                      alt="img"
                                      width={100}
                                      height={100}
                                    />
                                    <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                  </div>

                                  <div className="content col-span-2 ms-2">
                                    <h4 className="font-sans text-[16px] capitalize leading-none text-black dark:text-slate-400">{cp?.userId?.name}</h4>

                                    <span className="profession text-[12px] capitalize leading-none text-[#838383] dark:text-white-dark">{cp?.userId?.role === 'cp' && 'beige producer'}</span>

                                    <div className="location mt-2 flex items-center justify-start">
                                      {/* Your location icon here */}
                                      <span className="text-[16px] capitalize leading-none text-[#1f1f1f] dark:text-white-dark">{cp?.city}</span>
                                    </div>
                                    <div className="ratings mt-2">
                                      {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon key={index} icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-[30px] flex justify-center  gap-3">
                                  <Link href={`cp/${cp?.userId?._id}`}>
                                    <p className="inline-block cursor-pointer rounded-[10px] bg-black px-[12px] py-[8px] font-sans text-[16px] font-medium capitalize leading-none text-white hover:bg-gray-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-300 md:px-[20px] md:py-[12px]">
                                      view profile
                                    </p>
                                  </Link>
                                  <p
                                    onClick={() => handleSelectProducer(cp)}
                                    className={`inline-block cursor-pointer rounded-[10px] border border-solid 
                                      ${
                                        isSelected
                                          ? 'border-[#eb5656] bg-red-100 text-red-500 dark:border-red-600 dark:bg-slate-700 dark:text-red-400'
                                          : 'border-[#C4C4C4] bg-slate-200 text-black dark:border-gray-600 dark:bg-slate-400 dark:text-slate-800'
                                      }
                                      px-[12px] py-[8px] font-sans text-[16px] font-medium capitalize leading-none md:px-[20px] md:py-[12px]`}
                                  >
                                    {isSelected ? 'Remove' : 'Select'}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <div className="flex items-center justify-center">
                              <h3 className="text-center font-semibold text-black dark:text-slate-400">No Data Found</h3>
                            </div>
                          </>
                        )}
                      </div>

                      {/* pagination */}
                      <div className="mt-4 flex justify-center md:justify-end ">
                        <ResponsivePagination current={currentPage} total={allAlgoCp?.results?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
                      </div>
                    </div>
                  )}
                </div>

                {/* tab=3 */}
                <div className="mb-5">
                  {activeTab === 3 && (
                    <div className="h-full">
                      <>
                        <div className="panel mb-8 basis-[49%] rounded-[10px] px-7 py-5">
                          <label className="ml-2 mr-2 text-black dark:text-slate-400 sm:ml-0 sm:w-1/4">Select Addons</label>

                          <div className="flex flex-col sm:flex-row">
                            <div className="flex-1">
                              <div className="table-responsive ">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gray-200 dark:bg-black">
                                      <th className="min-w-[20px] px-1 py-2 font-mono text-black dark:text-slate-400">Select</th>
                                      <th className="min-w-[120px] px-1 py-2 font-mono text-black dark:text-slate-400">Title</th>
                                      <th className="min-w-[20px] py-2 font-mono text-black dark:text-slate-400">Extend Rate Type</th>
                                      <th className="min-w-[20px] py-2 font-mono text-black dark:text-slate-400">Extra Hour</th>
                                      <th className="min-w-[120px] px-1 py-2 font-mono text-black dark:text-slate-400">Rate</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {filteredAddonsData?.map((addon: addonTypes, index) => (
                                      <tr key={index} className="bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-slate-800">
                                        <td className="min-w-[20px] px-4 py-2">
                                          <input
                                            type="checkbox"
                                            className="form-checkbox border-gray-300 bg-white text-black focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-400 dark:focus:ring-indigo-500"
                                            //  defaultValue={addon}
                                            id={`addon_${index}`}
                                            onChange={() => handleCheckboxChange(addon)}
                                          />
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">{addon?.title}</td>

                                        <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">{addon?.ExtendRateType ? addon?.ExtendRateType : 'N/A'}</td>
                                        <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">
                                          {addon.ExtendRateType ? (
                                            <input
                                              name="hour"
                                              type="number"
                                              className="ms-12 h-9 w-12 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:bg-black dark:text-slate-400 dark:focus:border-indigo-500 md:ms-0 md:w-16"
                                              defaultValue={addonExtraHours[addon?._id] || 1}
                                              min="0"
                                              onChange={(e) => handleHoursOnChange(addon._id, parseInt(e.target.value))}
                                              // disabled={disableInput}
                                            />
                                          ) : (
                                            'N/A'
                                          )}
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">{computedRates[addon?._id] || addon?.rate}</td>
                                      </tr>
                                    ))}

                                    {/* Horizontal border */}
                                    <tr>
                                      <td colSpan={6} className=" w-full border-t border-gray-500 "></td>
                                    </tr>
                                    <tr className="mt-[-10px] w-full border border-gray-600 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-gray-700">
                                      <td className="min-w-[20px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2">
                                        <h2 className="text-[16px] font-semibold text-black dark:text-slate-400">Total Addons Cost</h2>
                                      </td>
                                      <td className="min-w-[120px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">{allAddonRates} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>

                      <>
                        <div className="panel mb-8">
                          <h2 className="mb-[20px] font-sans text-[24px] capitalize text-black dark:text-slate-400"> Selected {cp_ids?.length > 1 ? 'producers' : 'producer'}</h2>
                          <div className="grid grid-cols-1 gap-3 md:grid md:grid-cols-3">
                            {cp_ids?.length !== 0 &&
                              cp_ids?.map((cp: any) => (
                                <div key={cp?.id} className="single-match w-full rounded-[10px] border px-4 py-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-start">
                                      <div className="relative h-14 w-14">
                                        <Image
                                          src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`}
                                          style={{ width: '100%', height: '100%' }}
                                          className="mr-3 rounded-full"
                                          alt="img"
                                          width={100}
                                          height={100}
                                        />

                                        <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full border border-solid border-white bg-success"></span>
                                      </div>

                                      <div className="content ms-3">
                                        <h4 className="font-sans text-[16px] capitalize leading-none text-black dark:text-slate-400">{cp?.name}</h4>
                                        <span className="profession text-[12px] capitalize leading-none text-[#838383]  dark:text-gray-300">{cp?.role}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>

                      <>
                        <div className="panel mb-5 basis-[49%] rounded-[10px] px-2 py-5">
                          <h2 className="mb-[20px] font-sans text-[24px] capitalize text-black dark:text-slate-400"> Total Calculation</h2>
                          <>
                            <div className="flex flex-col sm:flex-row">
                              <div className="flex-1">
                                <div className="table-responsive">
                                  <table className="w-full">
                                    <tbody>
                                      {selectedFilteredAddons?.map((addon: addonTypes, index) => {
                                        return (
                                          <tr key={index} className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                            <td className="min-w-[120px] px-4 py-2 text-black dark:text-slate-400">{addon?.title}</td>
                                            <td className="text-black dark:text-slate-400">{addon?.ExtendRate ? `${addon?.hours} hours` : ''}</td>
                                            <td className="font-bold">${computedRates[addon?._id] || addon?.rate}</td>
                                          </tr>
                                        );
                                      })}
                                      <tr className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <td className="min-w-[120px] px-4 py-2 font-bold  text-black dark:text-slate-400">Shoot Cost</td>
                                        <td className="text-black dark:text-slate-400">{getTotalDuration || 0} hours</td>
                                        <td className="font-bold text-black dark:text-slate-400">${shootCosts} </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={6} className="w-full border-t border-gray-500"></td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <h2 className="text-[16px] font-semibold text-black dark:text-slate-400">Total Costs</h2>
                                        </td>
                                        <td></td>
                                        <td className="font-bold text-black dark:text-slate-400">${selectedFilteredAddons.length > 0 ? allRates : shootCosts}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </>
                        </div>
                      </>
                    </div>
                  )}
                </div>

                {/* page end buttons */}
                <div className="flex justify-between">
                  {activeTab === 1 || activeTab === 2 ? (
                    <p></p>
                  ) : (
                    <button
                      type="button"
                      className={`btn flex flex-col items-center justify-center rounded-lg 
                        bg-black text-[14px] font-bold capitalize text-white outline-none 
                        hover:bg-gray-800 focus:ring-2 focus:ring-indigo-500
                        dark:bg-white dark:text-black dark:hover:bg-gray-300 dark:focus:ring-indigo-700`}
                      onClick={() => handleBack()}
                    >
                      Back
                    </button>
                  )}

                  {activeTab === 2 && (
                    <DefaultButton css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`} disabled={isLoading}>
                      {isLoading === true ? <Loader /> : 'Next'}
                    </DefaultButton>
                  )}

                  {activeTab === 3 && (
                    <DefaultButton css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`} disabled={isLoading}>
                      {isLoading ? <Loader /> : 'Confirm Shoot'}
                    </DefaultButton>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
