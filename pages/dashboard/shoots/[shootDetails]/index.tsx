/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, Fragment, useMemo, useCallback, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { MAPAPIKEY } from '@/config';
import { useAuth } from '@/contexts/authContext';
import { swalToast } from '@/utils/Toast/SwalToast';
import { toast } from 'react-toastify';
import { allSvgs, correctionTikIcon, customizeCrossIcon } from '@/utils/allsvgs/allSvgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ResponsivePagination from 'react-responsive-pagination';
import GoogleMapReact from 'google-map-react';
import Loader from '@/components/SharedComponent/Loader';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { useAddAddonsMutation, useAssignCpMutation, useDeleteOrderMutation, useGetShootDetailsQuery, useUpdateOrderMutation, useUpdateStatusMutation } from '@/Redux/features/shoot/shootApi';
import { useGetAllCpQuery } from '@/Redux/features/user/userApi';
import { shootStatusMessage, allStatus } from '@/utils/shootUtils/shootDetails';
import { useNewMeetLinkMutation, useNewMeetingMutation } from '@/Redux/features/meeting/meetingApi';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import AccessDenied from '@/components/errors/AccessDenied';
import formatDateAndTime from '@/utils/UiAssistMethods/formatDateTime';
import { useGetAllAddonsQuery } from '@/Redux/features/addons/addonsApi';
import useCalculateAddons from '@/hooks/useCalculateAddons';
import { format, isValid, parseISO } from 'date-fns';
import flatpickr from 'flatpickr';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const ShootDetails = () => {
  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('shoot_show_details');
  const router = useRouter();
  const shootId = router.query.shootDetails as string;
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cpModal, setCpModal] = useState<boolean>(false);
  const [addonsModal, setAddonsModal] = useState<boolean>(false);

  const [cp_ids, setCp_ids] = useState<number[]>([]);
  const [statusBox, setStatusBox] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [meetingBox, setMeetingBox] = useState<boolean>(false);

  //
  const [confirmationDelAddonModal, setConfirmationDelAddonModal] = useState(false);
  const [delAddonsConfirmation, setDelAddonsConfirmation] = useState(false);

  //
  const [formattedMeetingTime, setFormattedMeetingTime] = useState('');

  const {
    data: shootDetailsData,
    error: shootDetailsError,
    isLoading: isDetailsLoading,
    refetch,
  } = useGetShootDetailsQuery(shootId, {
    refetchOnMountOrArgChange: true,
  });

  const {
    selectedFilteredAddons,
    addonExtraHours,
    filteredAddonsData,
    formDataPageOne,
    computedRates,
    allAddonRates,
    setSelectedFilteredAddons,
    setExistingShootAddons,
    setFormDataPageOne,
    handleHoursOnChange,
    handleCheckboxChange,
    handleShowAddonsData,
  } = useCalculateAddons();

  const [updateStatus, { isLoading: isStatusLoading }] = useUpdateStatusMutation();
  const [assignCp, { isLoading: isAssignCpLoading }] = useAssignCpMutation();
  const [newMeetLink, { isLoading: isNewMeetLinkLoading }] = useNewMeetLinkMutation();
  const [newMeeting, { isLoading: isNewMeetingLoading }] = useNewMeetingMutation();
  const [updateOrder, { isLoading: isUpdateOrderLoading, isSuccess }] = useUpdateOrderMutation();
  const [addAddons, { isLoading: isAddAddonsLoading }] = useAddAddonsMutation();

  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

  const queryParams = useMemo(
    () => ({
      sortBy: 'createdAt:desc',
      limit: '10',
      page: currentPage,
      search: query,
    }),
    [currentPage, query]
  );
  const {
    data: allCp,
    error: getCpError,
    isLoading: isGetCpLoading,
  } = useGetAllCpQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  // allAddons
  const { data: allAddonsData, refetch: allAddonsRefetch } = useGetAllAddonsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isHavePermission,
  });
  const [allRates, setAllRates] = useState(0);

  // shoot cost depending on duaration
  useEffect(() => {
    setAllRates(shootDetailsData?.shoot_duration + allAddonRates);
    setExistingShootAddons(shootDetailsData?.addOns);

    if (shootDetailsData) {
      setFormDataPageOne({
        content_type: shootDetailsData.content_type,
        content_vertical: shootDetailsData.content_vertical,
      });
    }
  }, [shootDetailsData, setFormDataPageOne]);

  const coordinates = shootDetailsData?.geo_location?.coordinates;
  const isLocationAvailable = coordinates && coordinates.length === 2;
  const orderStatusArray = ['Pending', 'Pre_production', 'Production', 'Post_production', 'Revision', 'Completed'];
  const rejectStatus = ['In_dispute', 'Cancelled'];
  const lowerCaseOrderStatus = shootDetailsData?.order_status?.toLowerCase();
  const currentIndex = orderStatusArray.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);
  const cancelIndex = rejectStatus.findIndex((status) => status.toLowerCase() === lowerCaseOrderStatus);

  const submitNewMeting = async () => {
    if (!formattedMeetingTime) {
      toast.error('Input a meeting date...!');
      return;
    }

    const requestBody: any = {
      userId: userData?.id,
      requestData: {
        summary: shootDetailsData?.order_name ? shootDetailsData?.order_name : 'Beige Meeting',
        location: 'Online',
        description: `Meeting to discuss ${shootDetailsData?.order_name ? shootDetailsData?.order_name : 'Beige'} order.`,
        startDateTime: formattedMeetingTime,
        endDateTime: formattedMeetingTime,
        orderId: shootId,
      },
    };

    const response = await newMeetLink(requestBody);
    if (response?.data) {
      const requestBody = {
        meeting_date_time: formattedMeetingTime,
        meeting_status: 'pending',
        meeting_type: 'pre_production',
        order_id: shootId,
        meetLink: response?.data?.meetLink,
      };
      const result = await newMeeting(requestBody);
      if (result?.data) {
        setMeetingBox(false);
        toast.success('Meeting create success.');
      } else {
        toast.error('Something want wrong...!');
      }
    } else {
      toast.error('Something want wrong...!');
    }
  };

  const handelUpdateStatus = async () => {
    if (!status) {
      return toast.error('Please select a status!');
    }

    const data = {
      order_status: status,
      id: shootId,
    };

    const result = await updateStatus(data);

    if (result?.data) {
      refetch();
      toast.success('Shoot status updated');
      setStatusBox(false);
    }
  };

  // handle Select Producer
  const handleSelectProducer = (cp: any) => {
    const newCp = {
      id: cp?.userId?._id,
      decision: 'accepted',
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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // updateCps or add cp
  const updateCps = async () => {
    if (!cp_ids.length) {
      toast.error('Please select Cp...!');
      return;
    }
    const data = {
      cp_ids: cp_ids,
      id: shootId,
    };
    const result = await assignCp(data);
    if (result?.data) {
      refetch();
      toast.success('Cp assigned success...!');
      setCpModal(false);
      setAddonsModal(false);
    }
  };

  // delete cp
  const cancelCp = async (cp: any) => {
    if (!cp || !cp._id) {
      return swalToast('danger', 'Invalid CP data.');
    }
    try {
      const updateRes = await updateOrder({
        requestData: {
          cp_ids: [
            {
              id: cp.id.id,
              decision: 'cancelled',
            },
          ],
        },
        id: shootId,
      });
      refetch();
    } catch (error) {
      toast.error('Error occurred while sending PATCH request');
    }
  };

  // meeting Date time ref
  const meetingDateTimeRef = useRef(null);
  let flatpickrInstance = useRef(null);

  const handleOnMeetingDateTimeChange = (dateStr: any) => {
    try {
      const e_time = parseISO(dateStr);
      if (!isValid(e_time)) {
        return;
      }
      const formattedTime = format(e_time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setFormattedMeetingTime(formattedTime);
    } catch (error) {
      console.error('Date parsing error', error);
    }
  };

  useEffect(() => {
    if (meetingDateTimeRef.current) {
      flatpickrInstance.current = flatpickr(meetingDateTimeRef.current, {
        altInput: true,
        altFormat: 'F j, Y h:i K',
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        time_24hr: false,
        minDate: 'today',
        onClose: (selectedDates, dateStr: any) => {
          handleOnMeetingDateTimeChange(dateStr);
        },
      });
    }
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, [meetingBox]);

  useEffect(() => {
    if (formDataPageOne?.content_type?.length !== 0 && formDataPageOne?.content_vertical !== '') {
      handleShowAddonsData();
    }
  }, [formDataPageOne?.content_type?.length]);

  // addons_add
  const handleAddAddon = async () => {
    const existingAddons = shootDetailsData?.addOns;
    const allSelectedAddons = selectedFilteredAddons;
    const data = {
      addOns: allSelectedAddons,
      id: shootId,
    };
    try {
      const result = await addAddons(data);
      if (result?.data) {
        if (result?.data.addOns.length === 0) {
          toast.warning('No Addons Added.');
          setAddonsModal(false);
        } else {
          toast.success('Addons Added successfully.');
          setCpModal(false);
          refetch();
          setAddonsModal(false);
        }
      }
    } catch {
      toast.error('Failed to add addon.');
    }
  };

  //  addons_cancel
  const handleDelAddon = async (addon: addonTypes) => {
    setConfirmationDelAddonModal(true);
    if (!addon) {
      return swalToast('danger', 'Invalid Addon  Cancel.');
    }

    if (!delAddonsConfirmation && !confirmationDelAddonModal) {
      setConfirmationDelAddonModal(false);
    }
    const restAddons = shootDetailsData?.addOns.filter((restAddon: addonTypes) => restAddon._id !== addon._id);
    try {
      const updateRes = await updateOrder({
        requestData: {
          addOns: restAddons,
        },
        id: shootId,
      });

      if (!updateRes.data) {
        toast.error('Error while Updating.');
      }

      toast.success('Addons Deleted Successfully.');
      refetch();
    } catch (error) {
      toast.error('Failed to delete addon.');
    }
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="panel">
        <div className="p-5 sm:p-2">
          <div className="flex flex-col">
            <div className="md:mb-4 md:flex md:items-center md:justify-between">
              {/* Shoot Name */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
                <label htmlFor="reference" className="mb-0 mt-2 font-sans text-[14px] text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 sm:ltr:mr-2">
                  Shoot Name
                </label>
                <span className="font-sans capitalize text-black dark:text-white-dark">{shootDetailsData?.order_name ?? ''}</span>
              </div>

              {/* Content Vertical */}
              <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex ">
                <label htmlFor="total_earnings" className=" mb-0 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400  sm:w-1/4 sm:ltr:mr-2">
                  Content Vertical
                </label>
                <span className="font-sans capitalize text-black dark:text-white-dark">{shootDetailsData?.content_vertical ?? ''}</span>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Budget */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:whitespace-nowrap">Budget</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <>
                    <div className="mb-2">
                      <ul className="group ms-6 w-48 list-disc flex-row items-center text-black dark:text-slate-400">
                        {shootDetailsData?.budget?.min && (
                          <li className="">
                            <span className="font-sans capitalize text-black dark:text-white-dark">Min : ${shootDetailsData?.budget?.min ?? ''}</span>
                          </li>
                        )}

                        {shootDetailsData?.budget?.max && (
                          <li>
                            <span className="font-sans capitalize text-black dark:text-white-dark">Max : ${shootDetailsData?.budget?.max ?? ''}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                </div>
              </div>
              {/* Location */}
              <div className="mb-4 basis-[45%] md:mb-2 md:flex">
                <label className="mb-0 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4">Location</label>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  <span className="font-sans capitalize text-black dark:text-white-dark">{shootDetailsData?.location ?? ''}</span>
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              <div className="mb-4 basis-[45%] flex-row space-y-5">
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-3 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:mb-0">Shoot Date & Time</label>

                  {shootDetailsData?.shoot_datetimes.length > 0 && (
                    <div className="flex-row">
                      {shootDetailsData.shoot_datetimes.map((dateTime: any, key: number) => {
                        const { date: startDate, time: startTime } = formatDateAndTime(dateTime.start_date_time) || { date: '', time: '' };
                        const { date: endDate, time: endTime } = formatDateAndTime(dateTime.end_date_time) || { date: '', time: '' };

                        return (
                          <div key={key} className="ms-5 space-x-4 font-sans font-semibold capitalize text-black dark:text-white-dark">
                            <span className="">
                              {startDate} at {startTime}
                            </span>
                            <span>to</span>
                            <span>
                              {endDate} at {endTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-3 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:mb-0">Shoot Duration</label>

                  <div className=" mt-1 flex-1 md:ml-0 md:mt-0">
                    <span className="ml-0 font-sans capitalize text-black dark:text-white-dark md:ml-0">{shootDetailsData?.shoot_duration ?? ''} Hours</span>
                  </div>
                </div>

                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-3 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:mb-0">Shoot Cost</label>
                  {shootDetailsData?.payment?.payment_status && <div className="ml-12 mt-1 flex-1 text-black dark:text-white-dark md:ml-3 md:mt-0">${shootDetailsData?.shoot_cost ?? ''}</div>}
                </div>
              </div>
              <div className="mb-4 basis-[45%]">
                <div style={{ height: '200px', width: '100%' }}>
                  {isLocationAvailable ? (
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: MAPAPIKEY as string }}
                      defaultCenter={{
                        lat: coordinates[1], // Latitude
                        lng: coordinates[0], // Longitude
                      }}
                      defaultZoom={11}
                    >
                      <div>
                        {/* <img src="/assets/images/marker-icon.png" alt="Marker Icon" style={{ height: '25px', width: '20px' }} /> */}
                        {/* <Image src="/assets/images/marker-icon.png" alt="Marker Icon" style={{ height: '25px', width: '20px' }} width={20} height={25} /> */}
                      </div>
                    </GoogleMapReact>
                  ) : (
                    <p className="text-black dark:text-white-dark">Loading map...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              <div className="mb-4 basis-[45%] flex-row space-y-5">
                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-3 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:mb-0">Payment Status</label>
                  {shootDetailsData?.payment?.payment_status && (
                    <div className="ml-12 mt-1 flex-1 md:ml-3 md:mt-0">
                      <StatusBg>{shootDetailsData?.payment?.payment_status}</StatusBg>
                    </div>
                  )}
                </div>

                <div className="mb-4 space-x-3 md:mb-2 md:flex">
                  <label className="mb-3 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4 md:mb-0">Current Shoot Status</label>
                  {shootDetailsData?.order_status && (
                    <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0 ">
                      <StatusBg>{shootDetailsData?.order_status}</StatusBg>
                    </div>
                  )}
                </div>

                <div className="mb-4 md:mb-2 md:flex">
                  <label className="mb-0 font-sans text-[14px] capitalize text-black rtl:ml-2 dark:text-slate-400 sm:w-1/4">Description</label>
                  <div className="ml-5 mt-1 flex-1 md:ml-4 md:mt-0">
                    <span className="font-sans capitalize text-black dark:text-white-dark">{shootDetailsData?.description ?? ''}</span>
                  </div>
                </div>
              </div>

              {/* Select Addons */}
              <div className="mb-4 basis-[45%]">
                <div className="mb-1 flex w-full items-center gap-2">
                  <label className="mb-0 font-sans text-[14px] capitalize text-black dark:text-slate-400">AddOns List</label>
                  {userData?.role === 'admin' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAddonsModal(!addonsModal), setSelectedFilteredAddons(shootDetailsData?.addOns);
                        }}
                        className="flex items-center gap-1 rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
                      >
                        <span className="">{allSvgs.addMorePlusIconSmLight}</span>
                        <span>Add More</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-0 mt-1 w-full md:ml-10 md:mt-0 2xl:flex-1">
                  {shootDetailsData?.addOns?.length > 0 && (
                    <div className="scrollbar max-h-[250px] overflow-y-auto overflow-x-hidden rounded">
                      <ul className="mt-3 pl-0 md:pl-5">
                        {shootDetailsData?.addOns?.map((addon: addonTypes, key: number) => (
                          <li key={key} className="flex h-12 list-none items-center justify-start gap-4 md:h-8">
                            <div className="h-2 w-2 rounded-full bg-black"></div>
                            <span className="flex-1">
                              {addon?.title ?? ''} for {addon?.hours} hours
                            </span>
                            <span className="flex items-center xl:mr-10">
                              {userData?.role === 'admin' ? (
                                <Tippy content="Cancel">
                                  <button onClick={() => handleDelAddon(addon)} className={`rounded p-1 text-white`}>
                                    <span className="badge text-dark duration-300 hover:text-danger">{allSvgs.closeBtnCp}</span>
                                  </button>
                                </Tippy>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="items-center justify-between md:mb-4 md:flex">
              {/* Schedule Meeting */}

              <div className="mb-4 basis-[45%] flex-row space-y-5">
                {(userData?.role === 'user' || 'admin') && (
                  <div className="flex space-x-3 2xl:space-x-[50px]">
                    <button
                      className="dark rounded bg-[#000000] p-2 font-sans text-[14px] font-semibold text-dark-light hover:bg-gray-800 dark:bg-[#1a2941] dark:text-slate-300 dark:hover:bg-[#2a2e3e] hover:dark:text-slate-50"
                      onClick={() => setMeetingBox(!meetingBox)}
                    >
                      Schedule Meeting
                    </button>
                    {/* <DefaultButton css='font-semibold' onClick={() => setMeetingBox(!meetingBox)}>Schedule Meeting</DefaultButton> */}

                    {meetingBox && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="meeting_time_shoot_details"
                          ref={meetingDateTimeRef}
                          className="- flex cursor-pointer items-center justify-center rounded border border-black bg-slate-100 px-1 text-gray-700  focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-[#121e32] dark:text-slate-400 dark:placeholder-slate-400 lg:w-[240px]"
                          placeholder="Meeting time"
                          required={formattedMeetingTime}
                        />
                        <button
                          disabled={isNewMeetingLoading || isNewMeetLinkLoading}
                          onClick={submitNewMeting}
                          className="flex items-center justify-center rounded border border-black bg-slate-100 px-1 text-gray-700 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-[#1a2941] dark:text-slate-400  dark:placeholder-gray-500 "
                        >
                          {isNewMeetingLoading || isNewMeetLinkLoading ? <Loader /> : correctionTikIcon('w-5 h-5')}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {userData?.role === 'admin' && (
                  <div className="flex space-x-[28px] 2xl:space-x-[65px]">
                    <DefaultButton onClick={() => setStatusBox(!statusBox)} css="font-semibold">
                      Change Status
                    </DefaultButton>
                    {statusBox && (
                      <div className="flex space-x-2">
                        <select
                          name=""
                          id=""
                          onChange={(event) => setStatus(event?.target?.value)}
                          className="bg- - rounded-sm border border-black bg-slate-100 px-2 text-gray-700 placeholder-gray-400  focus:ring-2 dark:border-gray-600 dark:bg-[#1a2941] dark:text-slate-400 dark:placeholder-gray-500 lg:w-[240px]"
                        >
                          {allStatus?.map((item, key) => (
                            <option selected={item?.key === status ? true : false} key={key} value={item?.key}>
                              {item?.value}
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={isStatusLoading === true ? true : false}
                          onClick={handelUpdateStatus}
                          className="flex h-8 items-center justify-center rounded border border-black bg-slate-100 px-1 text-gray-700 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-[#1a2941]  dark:text-slate-400 dark:placeholder-gray-500"
                        >
                          {isStatusLoading === true ? <Loader /> : correctionTikIcon('w-5 h-5')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Assigned Cp's */}
              <div className="mb-4 basis-[45%]">
                <div className="mb-3 flex w-full items-center gap-2">
                  <label className="mb-0 font-sans text-[14px] capitalize text-black dark:text-slate-400">Assign CP's</label>
                  {userData?.role === 'admin' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCpModal(!cpModal)}
                        className="flex items-center gap-1 rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
                      >
                        {allSvgs.addMorePlusIconSmLight}
                        <span>Add More</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
                  {shootDetailsData?.cp_ids?.length > 0 && (
                    <div className="scrollbar max-h-[250px] overflow-y-auto overflow-x-hidden rounded border border-slate-100">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-100 text-black dark:bg-gray-800 ">
                            <th className="border-b px-4 py-2">
                              <div className="flex justify-center text-black dark:text-slate-400">Name</div>
                            </th>
                            <th className="border-b px-4 py-2">
                              <div className="flex justify-center text-black dark:text-slate-400">Decision</div>
                            </th>
                            <th className="border-b px-4 py-2">
                              <div className="flex justify-center text-black dark:text-slate-400">Action</div>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {shootDetailsData?.cp_ids?.map((cp: CpDataTypes, key: any) => (
                            <tr key={key}>
                              <td className="border-b px-4 py-2 font-bold">
                                <div className="flex items-center justify-center">
                                  <div className="relative m-1 mr-2 flex h-4 w-4 items-center justify-center rounded-full text-xl text-white">
                                    <Image src="/assets/images/favicon.png" alt="Favicon" className="h-full w-full rounded-full" width={64} height={64} />
                                  </div>
                                  <div className="text-black dark:text-slate-400">{cp?.id?.name ?? ''}</div>
                                </div>
                              </td>
                              <td className="border-b px-4 py-2">
                                <div className="flex justify-center dark:text-slate-400">
                                  <StatusBg>{cp?.decision ?? ''}</StatusBg>
                                </div>
                              </td>
                              <td className="border-b px-4 py-2 text-right">
                                <div className="flex justify-center">
                                  {userData?.role === 'admin' ? (
                                    <Tippy content="Cancel">
                                      <button onClick={() => cancelCp(cp)} className={`rounded p-1 text-white`}>
                                        <span className="badge bg-danger dark:text-dark-light">Remove</span>
                                      </button>
                                    </Tippy>
                                  ) : (
                                    <Tippy content="You don't have permission to remove cp">
                                      <button onClick={() => cancelCp(cp)} className={`rounded p-1`}>
                                        <span className="badge bg-slate-300  text-black">Remove</span>
                                      </button>
                                    </Tippy>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mx-auto">
              <ul className="mx-auto grid grid-cols-1 gap-10 text-black dark:text-white-dark sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                {orderStatusArray.map((status, index) => (
                  <li key={status} className="flex-start group relative flex lg:flex-col">
                    {index < currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full  border border-gray-300 bg-green-500 text-white transition-all duration-200">
                          {correctionTikIcon('w-4 h-4')}
                        </div>
                      </>
                    )}

                    {index === currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-green-500 text-white transition-all duration-200 ">
                          {correctionTikIcon('w-4 h-4')}
                        </div>
                      </>
                    )}
                    {index > currentIndex && (
                      <>
                        <span
                          className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                          aria-hidden="true"
                        ></span>
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200" />
                      </>
                    )}

                    <div className="ml-6 lg:ml-0 lg:mt-10">
                      <h3 className="b - break-all text-xl font-bold text-gray-700 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-slate-400"> {status}</h3>

                      <h4 className="mt-2 text-base text-gray-700 dark:text-white-dark">{shootStatusMessage(status)}</h4>
                    </div>
                  </li>
                ))}

                {rejectStatus.map((status, index) => (
                  <div key={status}>
                    <li key={status} className="flex-start group relative flex lg:flex-col">
                      {index < cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-200">
                            {status === 'Cancelled' ? customizeCrossIcon('h-4 w-4') : null}
                          </div>
                        </>
                      )}

                      {index === cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white ${
                              status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'
                            } transition-all duration-200`}
                          >
                            {status === 'Cancelled' ? customizeCrossIcon('w-4 h-4') : correctionTikIcon('w-4 h-4')}
                          </div>
                        </>
                      )}

                      {index > cancelIndex && (
                        <>
                          <span
                            className="absolute left-[12px] top-[48px] h-[calc(100%_-_32px)] w-px bg-gray-300 lg:left-auto lg:right-[-30px] lg:top-[12px] lg:h-px lg:w-[calc(100%_-_5px)]"
                            aria-hidden="true"
                          ></span>
                          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-white transition-all duration-200 " />
                        </>
                      )}

                      <div className="ml-6 lg:ml-0 lg:mt-10">
                        <h3 className="- text-xl  font-bold text-gray-700 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-slate-400">{status}</h3>
                        <h4 className="mt-2 text-base text-gray-700 dark:text-white-dark">{shootStatusMessage(status)}</h4>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* modal for addons delete confirmation  */}
        <div>
          <Transition appear show={confirmationDelAddonModal} as={Fragment}>
            <Dialog as="div" open={confirmationDelAddonModal} onClose={() => setConfirmationDelAddonModal(false)}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0" />
              </Transition.Child>
              <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                <div className="flex min-h-screen items-start justify-center px-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="panel w-full max-w-sm overflow-hidden rounded-lg  border-0 p-0 text-black dark:text-white-dark lg:my-8 xl:my-32">
                      <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                        <h5 className="text-lg font-bold">Modal Title</h5>
                        <button onClick={() => setConfirmationDelAddonModal(false)} type="button" className="text-white-dark hover:text-dark">
                          x
                        </button>
                      </div>
                      <div className="p-5">
                        <div className="text-base font-medium text-[#1f2937] dark:text-white-dark/70">
                          <p>Are you sure want to delete this addon?</p>
                        </div>
                        <div className="mt-8 flex items-center justify-end">
                          <button onClick={() => setConfirmationDelAddonModal(false)} type="button" className="btn btn-outline-danger">
                            No
                          </button>
                          <button onClick={() => setDelAddonsConfirmation(!delAddonsConfirmation)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                            Yes
                          </button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>

        <Transition appear show={addonsModal} as={Fragment}>
          <Dialog as="div" open={addonsModal} onClose={() => setAddonsModal(false)}>
            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
              <div className="flex min-h-screen items-start justify-center md:px-4 ">
                <Dialog.Panel as="div" className="panel my-24 w-7/12 space-x-0 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:space-x-6">
                  <div className="my-2 flex items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                    <div className="ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000] dark:text-slate-300">Add Addons </div>
                    <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark-light" onClick={() => setAddonsModal(false)}>
                      {allSvgs.closeIconSvg}
                    </button>
                  </div>
                  <div className="basis-[45%]  py-2 md:pe-5">
                    <>
                      <div className="panel mb-8 basis-[49%] rounded-[10px] px-7 py-5">
                        <label className="ml-2 mr-2 dark:text-slate-400 sm:ml-0 sm:w-1/4">Select Addons</label>
                        <div className="flex w-full flex-col sm:flex-row">
                          <div className="flex-1">
                            <div className="table-responsive ">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-200 ">
                                    <th className="min-w-[20px] px-1 py-2 font-mono">Select</th>
                                    <th className="min-w-[120px] px-1 py-2 font-mono">Title</th>
                                    <th className="min-w-[20px] py-2 font-mono">Extend Rate Type</th>
                                    <th className="min-w-[20px] py-2 font-mono">Extra Hour</th>
                                    <th className="min-w-[120px] px-1 py-2 font-mono">Rate</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredAddonsData?.map((addon: addonTypes, index) => {
                                    const isSelected = selectedFilteredAddons?.some((detailAddon: addonTypes) => detailAddon._id === addon._id);

                                    return (
                                      <tr key={index} className="bg-white hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800">
                                        <td className="min-w-[20px] px-4 py-2">
                                          <input
                                            type="checkbox"
                                            className="form-checkbox border border-slate-700 dark:bg-[#121e32]"
                                            id={`addon_${index}`}
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(addon)}
                                            // disabled={isSelected}
                                          />
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2">{addon?.title}</td>
                                        <td className="min-w-[120px] px-4 py-2">{addon?.ExtendRateType ? addon?.ExtendRateType : 'N/A'}</td>
                                        <td className="min-w-[120px] px-4 py-2">
                                          {addon.ExtendRateType ? (
                                            <input
                                              name="hour"
                                              type="number"
                                              className="ms-12 h-9 w-12 rounded border border-slate-700 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none dark:bg-[#121e32] md:ms-0 md:w-16"
                                              defaultValue={addonExtraHours[addon?._id] || 1}
                                              min="0"
                                              onChange={(e) => handleHoursOnChange(addon._id, parseInt(e.target.value))}
                                            />
                                          ) : (
                                            'N/A'
                                          )}
                                        </td>
                                        <td className="min-w-[120px] px-4 py-2">{computedRates[addon?._id] || addon?.rate}</td>
                                      </tr>
                                    );
                                  })}

                                  {/* Horizontal border */}
                                  <tr>
                                    <td colSpan={6} className="w-full border-t border-gray-500"></td>
                                  </tr>
                                  <tr className="mt-[-10px] w-full border border-gray-600 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600">
                                    <td className="min-w-[20px] px-4 py-2"></td>
                                    <td className="min-w-[120px] px-4 py-2">
                                      <h2 className="text-[16px] font-semibold">Total Addons Cost</h2>
                                    </td>
                                    <td className="min-w-[120px] px-4 py-2"></td>
                                    <td className="min-w-[120px] px-4 py-2"></td>
                                    <td className="min-w-[120px] px-4 py-2">{allAddonRates}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <DefaultButton onClick={handleAddAddon} disabled={false} css="mt-5 h-9">
                            Add Addons
                          </DefaultButton>
                        </div>
                      </div>
                    </>
                    <div className="my-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-4">
                      <ResponsivePagination current={currentPage} total={allAddonsData?.totalPages / 3 || 1} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={cpModal} as={Fragment}>
          <Dialog as="div" open={cpModal} onClose={() => setCpModal(false)}>
            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
              <div className="flex min-h-screen items-start justify-center md:px-4 ">
                <Dialog.Panel as="div" className="panel my-24 w-5/6 space-x-0 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:space-x-6">
                  <div className="my-2 flex items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                    <div className="ms-6 text-[22px] font-bold capitalize leading-none text-[#000000] dark:text-slate-400">Assign CP's </div>
                    <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark-light" onClick={() => setCpModal(false)}>
                      {allSvgs.closeIconSvg}
                    </button>
                  </div>
                  <div className="basis-[45%]  py-2 md:pe-5">
                    <div className="mb-2 flex justify-end">
                      <input
                        onChange={(event) => setQuery(event.target.value)}
                        type="search"
                        value={query}
                        className=" w-full rounded-lg border border-solid border-slate-700 bg-[#121e32] px-3 py-2 lg:w-[20%]"
                        placeholder="Search"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 2xl:grid-cols-4">
                      {allCp?.results?.length > 0 ? (
                        allCp?.results?.map((cp: any) => {
                          const isSelected = cp_ids.some((item: any) => item?.id === cp?.userId?._id);
                          return (
                            <div key={cp?.userId?._id} className="rounded-lg border border-solid border-[#ACA686] p-3 shadow">
                              <div className="grid h-[150px] grid-cols-3 items-start justify-start md:h-[140px]">
                                <div className="media relative h-14 w-14 rounded-full">
                                  <Image
                                    src={cp?.userId?.profile_picture || '/assets/images/favicon.png'}
                                    alt="Profile Picture"
                                    className="mr-3 h-full w-full rounded-full object-cover"
                                    width={64}
                                    height={64}
                                  />
                                  <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full border border-solid border-white bg-success"></span>
                                </div>

                                <div className="content col-span-2 ms-2 min-h-[115px]">
                                  <h4 className="font-sans text-[16px] capitalize leading-none text-black dark:text-slate-400">{cp?.userId?.name}</h4>
                                  <span className="profession text-[12px] capitalize leading-none text-[#838383]">{cp?.userId?.role === 'cp' && 'beige producer'}</span>
                                  <div className="location mt-2 flex items-center justify-start">
                                    <span className="text-[16px] capitalize leading-none text-[#1f1f1f] dark:text-white-dark">{cp?.city}</span>
                                  </div>
                                  <div className="ratings mt-2">
                                    {[...Array(5)].map((_, index) => (
                                      <FontAwesomeIcon key={index} icon={faStar} className="mr-1" style={{ color: '#FFC700' }} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex">
                                <p
                                  onClick={() => handleSelectProducer(cp)}
                                  className={`single-match-btn inline-block cursor-pointer rounded-lg border border-slate-700  ${
                                    isSelected ? 'dark bg-red-500 text-dark-light' : 'bg-black dark:text-slate-300'
                                  } w-full py-2.5 text-center font-sans text-sm capitalize leading-none text-white`}
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
                            <h3 className="text-center font-semibold text-red-600">No Data Found</h3>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <DefaultButton onClick={updateCps} disabled={false} css="my-5 h-9">
                        Submit
                      </DefaultButton>
                    </div>
                    <div className="my-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
                      <ResponsivePagination current={currentPage} total={allCp?.totalPages || 1} onPageChange={handlePageChange} maxWidth={400} />
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default ShootDetails;
