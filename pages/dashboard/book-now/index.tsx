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
import 'flatpickr/dist/flatpickr.css';
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
    max: BudgetData;
    min: BudgetData;
  };
}

const BookNow = () => {
  const { data: addonsData } = useGetAllAddonsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { userData, authPermissions } = useAuth();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(1);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [dateTimes, setDateTimes] = useState<FormData[]>([]);
  const [showDateTimes, setShowDateTimes] = useState<any>();
  const [getTotalDuration, setTotalDuration] = useState<any>();
  const [client_id, setClient_id] = useState(userData?.role === 'user' ? userData?.id : '');
  const [clientName, setClientName] = useState('');
  const [filteredAddonsData, setFilteredAddonsData] = useState([]);
  const [selectedFilteredAddons, setSelectedFilteredAddons] = useState([]);
  const [allAddonRates, setAllAddonRates] = useState(0);
  const [allRates, setAllRates] = useState(0);
  const [computedRates, setComputedRates] = useState<any>({});
  const [addonExtraHours, setAddonExtraHours] = useState<any>({});
  const [geo_location, setGeo_location] = useState({ coordinates: [], type: 'Point' });
  const [shootCosts, setShootCosts] = useState<number>(0);
  const [formDataPageOne, setFormDataPageOne] = useState<any>({});
  const [cp_ids, setCp_ids] = useState([]);
  const [search, setSearch] = useState(false);
  const [clients, setClients] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isClientLoading, setIsClientLoading] = useState(false);

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
    }
  }, [activeTab]);

  useEffect(() => {
    const calculateUpdatedRate = (addon: addonTypes) => {
      if (addon.ExtendRateType !== undefined || addonExtraHours[addon._id] !== undefined) {
        const addonHours = addonExtraHours[addon?._id] || 0;
        const newRate = addon?.rate + addonHours * addon.ExtendRate;
        return newRate;
      } else {
        return addon?.rate;
      }
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

    const totalRate = Object.values(updatedTotalAddonRates).reduce((acc, currentValue) => acc + currentValue, 0);
    setAllAddonRates(totalRate);

    setAllRates(totalRate + shootCosts);
  }, [selectedFilteredAddons, filteredAddonsData, addonExtraHours]);

  const startDateTimeRef = useRef(null);
  const endDateTimeRef = useRef(null);

  const handleBack = () => {
    setActiveTab((prev) => (prev === 3 ? 2 : 1));
    // Use setTimeout to delay the Flatpickr initialization
    setTimeout(() => {
      if (startDateTimeRef.current) {
        flatpickr(startDateTimeRef.current, {
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
    }, 0);
  };

  useEffect(() => {
    if (startDateTimeRef.current) {
      flatpickr(startDateTimeRef.current, {
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
  }, []);

  const handleChangeStartDateTime = (dateStr) => {
    try {
      const s_time = parseISO(dateStr);
      if (!isValid(s_time)) {
        return;
      }
      const starting_date = format(s_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setStartDateTime(starting_date);
    } catch (error) {
    }
  };

  const handleChangeEndDateTime = (dateStr) => {
    try {
      const e_time = parseISO(dateStr);
      if (!isValid(e_time)) {
        return;
      }
      const ending_date = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setEndDateTime(ending_date);
    } catch (error) {
    }
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

  // date and time format convarsion
  function convertToEnglishDateFormat(inputDateString) {
    // Create a new Date object from the input string
    let date = new Date(inputDateString);
    // Arrays for months
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // Get year, month, day, hours, and minutes
    let year = date.getUTCFullYear(); // Use UTC methods to avoid local timezone effects
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    // Determine AM or PM
    let period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    let formattedHours = hours % 12 || 12; // Converts 0 hours to 12
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Create the formatted date and time string
    let formattedDate = `${months[month]} ${day}, ${year} Time: ${formattedHours}:${formattedMinutes} ${period}`;
    return formattedDate;
  }

  const calculateDuration = (startDateTime, endDateTime) => {
    // Convert date-time strings to Date objects
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    // Calculate the duration in milliseconds
    const durationMs = end - start;
    // Convert milliseconds to hours
    const durationHours = durationMs / (1000 * 60 * 60); // 1 hour = 3600000 milliseconds
    return Math.ceil(durationHours);
  };

  // Function to log total duration from an array of date-time objects
  const logTotalDuration = (dateTimesArray) => {
    const totalDuration = dateTimesArray.reduce((acc, dateTime) => {
      const duration = calculateDuration(dateTime.start_date_time, dateTime.end_date_time);
      return acc + duration;
    }, 0);
    setTotalDuration(totalDuration);
  };

  // handleTimeRemove
  const handleTimeRemove = (rmvDateTime: any) => {
    const updatedDateTimes = dateTimes.filter((dateTime) => dateTime.start_date_time !== rmvDateTime);

    setDateTimes(updatedDateTimes);
  };

  // for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // show addon data
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
          seen.add(key);
          return true;
        }
        return false;
      });
      setFilteredAddonsData(uniqueAddOns);
    }
  };

  const handleHoursOnChange = (addonId: string, hoursInput: number) => {
    // Create a new array with the updated addon
    const updatedAddons: any = selectedFilteredAddons.map((addon: any) => {
      if (addon._id === addonId) {
        return { ...addon, hours: hoursInput };
      }
      return addon;
    });
    setSelectedFilteredAddons(updatedAddons);

    // Extra code i keep it for addOn rate calculator
    if (hoursInput >= 0) {
      setAddonExtraHours((prevHours: number) => ({ ...prevHours, [addonId]: Number(hoursInput) }));
    } else {
      return;
    }
  };

  const handleCheckboxChange = (addon: addonTypes) => {
    const isAddonSelected = selectedFilteredAddons.some((selectedAddon: addonTypes) => selectedAddon?._id === addon?._id);
    if (!isAddonSelected) {
      const updatedAddon = {
        _id: addon?._id,
        title: addon?.title,
        rate: addon?.rate,
        ExtendRate: addon?.ExtendRate,
        status: addon?.status,
        hours: addonExtraHours[addon?._id] || 1,
      };

      setSelectedFilteredAddons([...selectedFilteredAddons, updatedAddon]);
    } else {
      setSelectedFilteredAddons(selectedFilteredAddons.filter((selectedAddon: addonTypes) => selectedAddon?._id !== addon?._id));
    }
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

  const [meetingTime, setMeetingTime] = useState(null);
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
        //toast.success('Meeting create success.');
        return true;
      } else {
        toast.error('Something want wrong...!');
      }
    } else {
      toast.error('Something want wrong...!');
    }
  };

  const [myMaxBud, setMyMaxBud] = useState<BudgetData>(0);
  const [myMinBud, setMyMinBud] = useState<BudgetData>(0);


  // set category data for the ui
  const categoryList: CategoryListData[] = [
    { name: 'Commercial', budget: { min: 1500, max: 10000 } },
    { name: 'Corporate', budget: { min: 1500, max: 10000 } },
    { name: 'Music', budget: { min: 1500, max: 10000 } },
    { name: 'Private', budget: { min: 1500, max: 10000 } },
    { name: 'Weeding', budget: { min: 1000, max: 1500 } },
    { name: 'Other', budget: { min: 1000, max: 10000 } },
  ];

  // setting default budget
  const handleChangeCategoryWithBudget = (event: ChangeEvent<HTMLSelectElement>) => {
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
    }
    else {
      try {
        const formattedData = {
          budget: {
            min: myMinBud,
            max: myMaxBud,
          },
          client_id,
          order_status: 'pre_production',
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
          const formattedCpIds = cp_ids.map((cp) => ({
            id: cp.id,
            decision: userData?.role === 'admin' ? 'accepted' : null,
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
            if (data.meeting_time) {
              const meeting_time = convertToISO(data.meeting_time);
              const meetingInfo = await getMeetingLink(updateRes?.data, meeting_time);
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

  const handleClientChange = (client) => {
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
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef?.current?.contains(event.target)) {
        setShowClientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-warning hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Shoot Booking</span>
        </li>
      </ul>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
        {/* icon only */}
        <div className="panel">
          <div className="">
            <div className="inline-block w-full">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  {activeTab === 1 && (
                    <>
                      <div className="flex items-center justify-between">
                        {/* Content Type */}
                        <div className="flex w-full flex-col sm:flex-row">
                          <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                          <div className="flex-1">
                            {/* Video */}
                            <div className="mb-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className={`form-checkbox ${errors?.content_type && 'border border-danger'}`}
                                  value="video"
                                  {...register('content_type', {
                                    validate: {
                                      required: () => contentTypes?.length > 0 || 'Select at least one content type',
                                    },
                                  })}
                                />
                                <span className="text-black">Videography</span>
                              </label>
                            </div>
                            {/* Photo */}
                            <div className="mb-2">
                              <label className="flex items-center">
                                <input type="checkbox" className={`form-checkbox ${errors?.content_type && 'border border-danger'}`} value="photo" {...register('content_type')} />
                                <span className="text-black">Photography</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Category || content vertical*/}
                        <div className="flex w-full flex-col sm:flex-row">
                          <label htmlFor="content_vertical" className="mb-0 capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Category
                          </label>
                          <select
                            className={`form-select text-black ${errors.content_vertical ? 'border-red-500' : ''}`}
                            id="content_vertical"
                            defaultValue="SelectCategory"
                            {...register('content_vertical', {
                              required: 'Category is required',
                              validate: (value) => value !== 'SelectCategory' || 'Please select a valid category',
                            })}
                            onChange={handleChangeCategoryWithBudget}
                          >
                            <option value="SelectCategory">Select Category</option>
                            {categoryList.map((category) => (
                              <option key={category?.name} value={category?.name}>
                                {category?.name}
                              </option>
                            ))}

                          </select>
                        </div>
                      </div>

                      <div className="my-5 flex-col items-center justify-between gap-4 md:flex md:flex-row">
                        {userData?.role === 'admin' && (
                          <div className="relative flex  w-full flex-col sm:flex-row ">
                            <label htmlFor="content_vertical" className="mb-0 capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                              Client
                            </label>
                            <input
                              type="search"
                              onChange={(event) => {
                                setClientName(event?.target?.value);
                                getAllClients();
                              }}
                              className={`form-input flex-grow bg-slate-100 `}
                              value={clientName}
                              placeholder="Client"
                              required={!clientName}
                            />

                            {showClientDropdown && (
                              <>
                                <div ref={dropdownRef} className="absolute right-0 top-[43px] z-30 w-[79%] rounded-md border-2 border-black-light bg-white p-1">
                                  {isClientLoading ? (
                                    <div className="scrollbar mb-2 mt-2 h-[190px] animate-pulse overflow-x-hidden overflow-y-scroll">
                                      {/* Render loading skeleton here */}
                                      {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded-sm bg-white px-2 py-1">
                                          <div className="h-7 w-7 rounded-full bg-slate-200"></div>
                                          <div className="h-7 w-full rounded-sm bg-slate-200"></div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <>
                                      {clients && clients.length > 0 ? (
                                        <ul className="scrollbar mb-2 mt-2 h-[300px] overflow-x-hidden overflow-y-scroll">
                                          {clients?.map((client) => (
                                            <li
                                              key={client?.id}
                                              onClick={() => handleClientChange(client)}
                                              className="flex cursor-pointer items-center rounded-md px-3 py-2 text-[13px] font-medium leading-3 hover:bg-[#dfdddd83]"
                                            >
                                              <div className="relative m-1 mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xl text-white">
                                                <img src={client?.profile_picture || '/assets/images/favicon.png'} className="h-full w-full rounded-full" />
                                              </div>
                                              <a href="#">{client?.name}</a>
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
                              </>
                            )}
                          </div>
                        )}

                        {/* Location */}
                        <div className="mt-2  flex w-full flex-col sm:flex-row md:mt-0">
                          <label htmlFor="location" className="mb-0 capitalize rtl:ml-2 sm:ltr:mr-2 md:w-[87px] 2xl:w-[138px]">
                            Location
                          </label>
                          <div className="flex-grow">
                            <Map setGeo_location={setGeo_location} setLocation={setLocation} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 w-full flex-col items-start justify-between gap-4 md:flex md:flex-row">
                        {/* Shoot Name */}
                        <div className="flex  w-full  flex-col sm:flex-row">
                          <label htmlFor="order_name" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Shoot Name
                          </label>
                          <input
                            id="order_name"
                            title="Shoot name automatically Generate based on you information"
                            disabled
                            value={orderName()}
                            type="text"
                            className="form-input flex-grow bg-slate-100"
                            placeholder="Shoot Name"
                            {...register('order_name')}
                          />
                        </div>

                        {/* references */}
                        <div className="mt-2  flex w-full flex-col sm:flex-row md:mt-0">
                          <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 ">
                            References
                          </label>
                          <input id="references" type="text" placeholder="https://sitename.com" className="form-input" {...register('references')} />
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="table-responsive">
                          <div className="mb-8 items-center justify-between md:flex">
                            {/* Starting Date and Time */}
                            <div className="mb-3 flex  w-full flex-col sm:flex-row md:mb-0">
                              <label htmlFor="start_date_time" className="mb-3 mt-4 w-24 rtl:ml-2 sm:ltr:mr-2 md:mb-0 2xl:w-36">
                                Shoot Time
                              </label>

                              <div className="relative">
                                <p className="mb-1 text-xs font-bold sm:mb-0">Start Time</p>
                                <input
                                  id="start_date_time"
                                  ref={startDateTimeRef}
                                  type="text"
                                  className={`form-input w-full cursor-pointer sm:w-[220px] ${errors?.start_date_time ? 'border-red-500' : ''}`}
                                  placeholder="Start time"
                                  required={startDateTime?.length === 0}
                                />
                                <span className="pointer-events-none absolute right-[14px] top-[55%] -translate-y-1/4 transform">🗓️</span>

                                {errors?.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                              </div>

                              <div className="relative mt-3 sm:mt-0">
                                <p className="mb-1 ml-1 text-xs font-bold sm:mb-0">End Time</p>
                                <input
                                  id="end_date_time"
                                  ref={endDateTimeRef}
                                  type="text"
                                  className={`form-input ml-1 w-full cursor-pointer sm:w-[220px] ${errors?.end_date_time ? 'border-red-500' : ''}`}
                                  placeholder="End time"
                                  required={endDateTime?.length === 0}
                                />

                                <span className="pointer-events-none absolute right-[14px] top-[55%] -translate-y-1/4 transform">🗓️</span>
                                {errors?.end_date_time && <p className="text-danger">{errors?.end_date_time.message}</p>}
                              </div>

                              <div className="flex justify-end">
                                <span
                                  className=" ml-2 mt-4 h-9 w-16 cursor-pointer rounded-md bg-black px-4 py-1 text-center font-sans text-[14px] capitalize leading-[28px] text-white"
                                  onClick={addDateTime}
                                >
                                  Add
                                </span>
                              </div>
                              {errors?.start_date_time && <p className="text-danger">{errors?.start_date_time.message}</p>}
                            </div>
                          </div>

                          {/* DateTime Output show Table */}
                          {dateTimes?.length !== 0 && (
                            <div className="mb-8">
                              <table className="table-auto">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dateTimes?.map((dateTime: FormData, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{convertToEnglishDateFormat(dateTime?.start_date_time)}</td>
                                      <td>{convertToEnglishDateFormat(dateTime?.end_date_time)} </td>
                                      <td className="flex items-center justify-between">
                                        <span>{calculateDuration(dateTime?.start_date_time, dateTime?.end_date_time)} Hour</span>

                                        <span className="text-gray-500" onClick={() => handleTimeRemove(dateTime?.start_date_time)}>
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

                      {userData?.role === 'admin' && (
                        <div className="mt-4 w-full flex-col items-center justify-between md:flex md:flex-row md:gap-4">
                          {/* Special Note */}
                          <div className="flex  w-full flex-col sm:flex-row">
                            <label htmlFor="description" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                              Special Note
                            </label>
                            <textarea id="description" rows={1} className="form-textarea" placeholder="Type your note here..." {...register('description')}></textarea>
                          </div>
                          <div className="mb-3 mt-3  flex w-full flex-col sm:mt-0 sm:flex-row md:mb-0">
                            <label htmlFor="meeting_time" className="mb-0  w-full rtl:ml-2 sm:ltr:mr-2 md:w-[24%] ">
                              Meeting time
                            </label>

                            <div className="relative w-full ">
                              <Flatpickr
                                id="meeting_time"
                                className={`form-input cursor-pointer ${errors.meeting_time ? 'border-red-500' : ''}`}
                                value={meetingTime}
                                placeholder="Meeting time ..."
                                options={{
                                  altInput: true,
                                  altFormat: 'F j, Y h:i K',
                                  dateFormat: 'Y-m-d H:i',
                                  enableTime: true,
                                  time_24hr: false,
                                  minDate: 'today',
                                }}
                                onChange={(date) => {
                                  setMeetingTime(date[0]);
                                  setValue('meeting_time', date[0]);
                                }}
                              />
                              <input type="hidden" {...register('meeting_time')} />

                              <span className="-translate-y-1/6 pointer-events-none absolute right-[14px] top-[21%]  transform">🗓️</span>
                              {errors.meeting_time && <p className="text-danger">{errors.meeting_time.message}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-5 flex items-center justify-end ltr:ml-auto rtl:mr-auto">
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
                            <h2 className="mb-2 font-sans text-[18px] capitalize leading-none text-black">Select Producer</h2>
                            <p className="text-[14px] capitalize leading-none text-[#838383]">choose your beige photographer/videographer</p>
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
                          allAlgoCp?.results?.map((cp) => {
                            const isSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
                            return (
                              <div key={cp?.userId?._id} className="single-match  basis-[49%] rounded-[10px] border border-solid border-[#ACA686] px-6 py-4">
                                <div className="grid grid-cols-3 md:h-32">
                                  <div className="media relative h-14 w-14">
                                    <img src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`} style={{ width: '100%', height: '100%' }} className="mr-3 rounded-full" alt="img" />
                                    <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                  </div>

                                  <div className="content col-span-2 ms-2">
                                    <h4 className="font-sans text-[16px] capitalize leading-none text-black">{cp?.userId?.name}</h4>
                                    <span className="profession text-[12px] capitalize leading-none text-[#838383]">{cp?.userId?.role === 'cp' && 'beige producer'}</span>
                                    <div className="location mt-2 flex items-center justify-start">
                                      {/* Your location icon here */}
                                      <span className="text-[16px] capitalize leading-none text-[#1f1f1f]">{cp?.city}</span>
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
                                    <p className=" inline-block cursor-pointer rounded-[10px] bg-black px-[12px] py-[8px] font-sans text-[16px] font-medium capitalize leading-none text-white md:px-[20px] md:py-[12px]">
                                      view profile
                                    </p>
                                  </Link>
                                  <p
                                    onClick={() => handleSelectProducer(cp)}
                                    className={` inline-block cursor-pointer rounded-[10px] border border-solid ${isSelected ? 'border-[#eb5656] bg-white text-red-500' : 'border-[#C4C4C4] bg-white text-black'
                                      } px-[12px] py-[8px] font-sans text-[16px] font-medium capitalize leading-none md:px-[20px] md:py-[12px]`}
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
                              <h3 className="text-center font-semibold">No Data Found</h3>
                            </div>
                          </>
                        )}
                      </div>

                      {/* pagination */}
                      <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
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
                          <label className="ml-2 mr-2 sm:ml-0 sm:w-1/4">Select Addons</label>
                          <div className="flex flex-col sm:flex-row">
                            <div className="flex-1">
                              <div className="table-responsive ">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-800">
                                      <th className="min-w-[20px] px-1 py-2 font-mono">Select</th>
                                      <th className="min-w-[120px] px-1 py-2 font-mono">Title</th>
                                      <th className="min-w-[20px] py-2 font-mono">Extend Rate Type</th>
                                      <th className="min-w-[20px] py-2 font-mono">Extra Hour</th>
                                      <th className="min-w-[120px] px-1 py-2 font-mono">Rate</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {filteredAddonsData?.map((addon: addonTypes, index) => (
                                      <tr key={index} className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <td className="min-w-[20px] px-4 py-2">
                                          <input type="checkbox" className="form-checkbox" defaultValue={addon} id={`addon_${index}`} onChange={() => handleCheckboxChange(addon)} />
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2">{addon?.title}</td>

                                        <td className="min-w-[120px] px-4 py-2">{addon?.ExtendRateType ? addon?.ExtendRateType : 'N/A'}</td>
                                        <td className="min-w-[120px] px-4 py-2">
                                          {addon.ExtendRateType ? (
                                            <input
                                              name="hour"
                                              type="number"
                                              className="ms-12 h-9 w-12 rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0 md:w-16"
                                              defaultValue={addonExtraHours[addon?._id] || 1}
                                              min="0"
                                              onChange={(e) => handleHoursOnChange(addon._id, parseInt(e.target.value))}
                                            // disabled={disableInput}
                                            />
                                          ) : (
                                            'N/A'
                                          )}
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2">{computedRates[addon?._id] || addon?.rate}</td>
                                      </tr>
                                    ))}

                                    {/* Horizontal border */}
                                    <tr>
                                      <td colSpan={6} className=" w-full border-t border-gray-500 "></td>
                                    </tr>
                                    <tr className="mt-[-10px] w-full border border-gray-600 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                      <td className="min-w-[20px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2">
                                        <h2 className="text-[16px] font-semibold">Total Addons Cost</h2>
                                      </td>
                                      <td className="min-w-[120px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2"></td>
                                      <td className="min-w-[120px] px-4 py-2">{allAddonRates} </td>
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
                          <h2 className="mb-[20px] font-sans text-[24px] capitalize text-black"> Selected {cp_ids?.length > 1 ? 'producers' : 'producer'}</h2>
                          <div className="grid grid-cols-1 gap-3 md:grid md:grid-cols-3">
                            {cp_ids?.length !== 0 &&
                              cp_ids?.map((cp: any) => (
                                <div key={cp?.id} className="single-match w-full rounded-[10px] border px-4 py-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-start">
                                      <div className="relative h-14 w-14">
                                        <img src={`${cp?.userId?.profile_picture || '/assets/images/favicon.png'}`} className="h-full w-full rounded-full object-cover" alt="img" />
                                        <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full border border-solid border-white bg-success"></span>
                                      </div>

                                      <div className="content ms-3">
                                        <h4 className="font-sans text-[16px] capitalize leading-none text-black">{cp?.name}</h4>
                                        <span className="profession text-[12px] capitalize leading-none text-[#838383]">{cp?.role}</span>
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
                          <h2 className="mb-[20px] font-sans text-[24px] capitalize text-black"> Total Calculation</h2>
                          <>
                            <div className="flex flex-col sm:flex-row">
                              <div className="flex-1">
                                <div className="table-responsive">
                                  <table className="w-full">
                                    <tbody>
                                      {selectedFilteredAddons?.map((addon: addonTypes, index) => {
                                        return (
                                          <>
                                            <tr key={index} className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                              <td className="min-w-[120px] px-4 py-2">{addon?.title}</td>
                                              <td>{addon?.ExtendRate ? `${addon?.hours} hours` : ''}</td>
                                              <td className="font-bold">${computedRates[addon?._id] || addon?.rate}</td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                      <tr className="bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        <td className="py-2font-bold min-w-[120px] px-4 font-bold">Shoot Cost</td>
                                        <td>{getTotalDuration || 0} hours</td>
                                        <td className="font-bold">${shootCosts} </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={6} className="w-full border-t border-gray-500"></td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <h2 className="text-[16px] font-semibold">Total Costs</h2>
                                        </td>
                                        <td></td>
                                        <td className="font-bold">${selectedFilteredAddons.length > 0 ? allRates : shootCosts}</td>
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
                  <button
                    type="button"
                    className={`btn flex flex-col items-center justify-center rounded-lg
                    bg-black text-[14px] font-bold capitalize text-white outline-none ${activeTab === 1 ? 'hidden' : ''}`}
                    onClick={() => handleBack()}
                  >
                    Back
                  </button>

                  {/* <DefaultButton
                    onClick={() => handleBack()}
                    css={`btn flex flex-col items-center justify-center ${activeTab === 1 ? 'hidden' : ''}`}
                  >
                    Backk
                  </DefaultButton> */}

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
