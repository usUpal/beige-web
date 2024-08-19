import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useDateFormat from '@/hooks/useDateFormat';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useForm } from 'react-hook-form';
import Loader from '@/components/SharedComponent/Loader';
import Swal from 'sweetalert2';

const CpDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const [formData, setFormData] = useState<any | null>(null);
  console.log('🚀 ~ CpDetails ~ formData:', formData);

  const params = useParams();
  const dob = formData?.date_of_birth;
  const formattedDateTime = useDateFormat(dob);

  // State variables to manage input field visibility
  const [showEquipmentInput, setShowEquipmentInput] = useState(false);
  const [showEquipmentSpecificInput, setShowEquipmentSpecificInput] = useState(false);
  const [showBackupFootageInput, setShowBackupFootageInput] = useState(false);
  const [showVstInput, setShowVstInput] = useState(false);
  const [showShootAvailabilityInput, setShowShootAvailabilityInput] = useState(false);
  const [showPortfolioInput, setShowPortfolioInput] = useState(false);

  // Toggle functions for input field visibility
  useEffect(() => {
    if (params?.cp) {
      const singleUserId = Array.isArray(params.cp) ? params.cp[0] : params.cp;
      getUserDetails(singleUserId);
    }
  }, [params?.cp]);

  // User Single
  const getUserDetails = async (singleUserId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}cp/${singleUserId}`);
      const userDetailsRes = await response.json();

      if (!userDetailsRes) {
        setIsLoading(true);
      } else {
        setFormData(userDetailsRes);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { register, handleSubmit, getValues, reset } = useForm();

  const handleSetNewItem = (fieldName: string) => {
    const value = getValues(fieldName);

    if (!fieldName) return;

    switch (fieldName) {
      case 'equipment':
        formData.equipment.push(value);
        break;
      case 'equipment_specific':
        formData.equipment_specific.push(value);
        break;
      case 'backup_footage':
        formData.backup_footage.push(value);
        break;
      case 'vst':
        formData.vst.push(value);
        break;
      case 'shoot_availability':
        formData.shoot_availability.push(value);
        break;
      case 'portfolio':
        formData.portfolio.push(value);
        break;
      default:
        break;
    }

    reset({ [fieldName]: '' });
  };

  //
  const removeEquipmentItem = (arr_item: any, fieldName: string) => {
    if (!fieldName) return;

    switch (fieldName) {
      case 'equipment':
        const existingItemsEquipment = formData?.equipment?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          equipment: existingItemsEquipment,
        }));
        break;
      case 'equipment_specific':
        const existingItemsEquipmentSpecific = formData?.equipment_specific?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          equipment_specific: existingItemsEquipmentSpecific,
        }));
        break;
      case 'backup_footage':
        const existingItemsBackup = formData?.backup_footage?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          backup_footage: existingItemsBackup,
        }));
        break;

      case 'vst':
        const existingItemsVst = formData?.vst?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          vst: existingItemsVst,
        }));
        break;
      case 'shoot_availability':
        const existingItemsShoot = formData?.shoot_availability?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          shoot_availability: existingItemsShoot,
        }));
        break;
      case 'portfolio':
        const existingItemsPortfolio = formData?.portfolio?.filter((item: any) => item !== arr_item);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          portfolio: existingItemsPortfolio,
        }));
        break;
      default:
        break;
    }
  };

  // for string and boolean data
  const handleInputChange = (key: any, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const coloredToast = (color: any, message: string) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`,
      },
    });
    toast.fire({
      title: message,
      icon: 'success',
    });
  };

  const onSubmit = async (data: any) => {
    const singleUserId = Array.isArray(params.cp) ? params.cp[0] : params.cp;

    // Boolean Fields Value
    const booleanFields = {
      rateFlexibility: data?.rateFlexibility || formData?.rateFlexibility,
      team_player: data?.team_player || formData?.team_player,
      experience_with_post_production_edit: data?.experience_with_post_production_edit || formData?.experience_with_post_production_edit,
      travel_to_distant_shoots: data?.travel_to_distant_shoots || formData?.travel_to_distant_shoots,
      own_transportation_method: data?.own_transportation_method || formData?.own_transportation_method,
      customer_service_skills_experience: data?.customer_service_skills_experience || formData?.customer_service_skills_experience,
    };

    // disabled Fields Value
    const disabledStringFields = {
      trust_score: formData?.trust_score || data?.trust_score,

      successful_beige_shoots: formData?.successful_beige_shoots,
      average_rating: formData?.average_rating,
      total_earnings: formData?.total_earnings,
      avg_response_time: formData?.avg_response_time,
      avg_response_time_to_new_shoot_inquiry: formData?.avg_response_time_to_new_shoot_inquiry,
      num_declined_shoots: formData?.num_declined_shoots,
      num_accepted_shoots: formData?.num_accepted_shoots,
      date_of_birth: formData?.date_of_birth,
      review_status: formData?.review_status,
    };

    const updatableStringFields = {
      // if edited the updated value or default value
      reference: data?.reference || formData.reference,
      rate: data?.rate || formData.rate,
      handle_co_worker_conflicts: data?.handle_co_worker_conflicts || formData.handle_co_worker_conflicts,
      initiative: data?.initiative || formData.initiative,
      additional_info: data?.additional_info || formData.additional_info,
      timezone: data?.timezone || formData.timezone,
      city: data?.city || formData.city,
      neighborhood: data?.neighborhood || formData.neighborhood,
      zip_code: data?.zip_code || formData.zip_code,
      inWorkPressure: data?.inWorkPressure || formData.inWorkPressure,
    };

    const arrayInputFields = {
      equipment: data?.equipment || formData?.equipment,
      equipment_specific: data?.equipment_specific || formData?.equipment_specific,
      backup_footage: data?.backup_footage || formData?.backup_footage,
      vst: data?.vst || formData?.vst,
      shoot_availability: data?.shoot_availability || formData?.shoot_availability,
      portfolio: formData?.portfolio,
      content_verticals: formData?.content_verticals || data?.content_verticals,
      content_type: formData?.content_type || data?.content_type,
    };

    setIsLoading(true);

    const updatedData = {
      ...arrayInputFields,
      ...disabledStringFields,
      ...updatableStringFields,
      ...booleanFields,
    };

    console.log('🚀 ~ onSubmit ~ updatedData:', updatedData);
    const patchResponse = await fetch(`${API_ENDPOINT}cp/${singleUserId}?role=manager`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!patchResponse.ok) {
      return 'error failed to patch';
    }
    coloredToast('success', 'Successfully Saved');
    setIsLoading(false);

    // to show the patch data
    const patchedData = await patchResponse.json();
    console.log('Patch successful:', patchedData);
  };

  /* if (!formData) {
        return <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center dark:bg-gray-800">
            <div className="flex items-center space-x-2 dark:bg-black p-4 rounded-lg">
                {allSvgs.dataLoadingLoader}
            </div>
        </div>;
    } */

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="items-center justify-between md:mb-4 md:flex">
          {/* Content Vertical */}
          <div className="mb-4 basis-[45%] md:mb-2 md:flex">
            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 md:whitespace-nowrap">Content Vertical</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing Content Vertical items */}
                {formData?.content_verticals &&
                  formData?.content_verticals?.map((content_verticals_item: any, index: any) => (
                    <div className="mb-2" key={`${content_verticals_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark  group-hover:text-dark">{content_verticals_item}</span>
                        </li>

                        <li className="hidden list-none">
                          <button
                            type="button"
                            className="text-white-dark group-hover:text-red-400"
                            // onClick={() => removeEquipmentItem(content_verticals_item, 'equipment')}
                          >
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
              </>
            </div>
          </div>
          {/* Content Type */}
          <div className="mb-4 basis-[45%] md:mb-2 md:flex">
            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Content Type</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing Content Vertical items */}
                {formData?.content_type &&
                  formData?.content_type?.map((content_type_item: any, index: any) => (
                    <div className="mb-2" key={`${content_type_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark  group-hover:text-dark">{content_type_item}</span>
                        </li>

                        <li className="hidden list-none">
                          <button
                            type="button"
                            className="text-white-dark group-hover:text-red-400"
                            // onClick={() => removeEquipmentItem(content_type_item, 'equipment')}
                          >
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>

        {/* Successful Shoots && Trust Score  */}
        <div className="md:mb-4 md:flex md:items-center md:justify-between">
          {/* Successful Shoots */}
          <div className="mb-6 basis-[45%] items-center md:mb-2 md:flex">
            <label htmlFor="successful_beige_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              Successful <br /> Shoots
            </label>

            <input
              type="number"
              {...register('successful_beige_shoots')}
              defaultValue={formData?.successful_beige_shoots}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 md:ms-0"
              disabled
              onChange={(e) => handleInputChange('successful_beige_shoots', e.target.value)}
            />
          </div>

          {/* Trust Score */}
          <div className="mb-4 basis-[45%] items-center md:mb-2 md:flex">
            <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              trust score
            </label>
            <input
              type="number"
              {...register('trust_score')}
              defaultValue={formData?.trust_score}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('trust_score', e.target.value)}
            />
          </div>
        </div>

        <div className="md:mb-4 md:flex md:items-center md:justify-between">
          {/* References */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="reference" className="mb-0 mt-2 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              Reference
            </label>
            <input
              {...register('reference')}
              defaultValue={formData?.reference}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('reference', e.target.value)}
            />
          </div>

          {/* Total Earnings */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              total earnings ($)
            </label>
            <input
              type="number"
              {...register('total_earnings')}
              defaultValue={formData?.total_earnings}
              // className='border rounded bg-gray-200 p-3'
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('total_earnings', e.target.value)}
            />
          </div>
        </div>

        {/* rate and rate related */}
        <div className="md:mb-4 md:flex md:items-center md:justify-between">
          {/* rate */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="initiative" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              rate
            </label>
            <input
              type="number"
              {...register('rate')}
              defaultValue={formData?.rate}
              // className='border rounded p-3 focus:outline-none focus:border-gray-400'
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('rate', e.target.value)}
            />
          </div>

          {/* Rate Flexibility */}
          <div className="mb:mt-0 mb-6 flex basis-[45%] flex-col sm:flex-row md:mb-0">
            <label htmlFor="rateFlexibility" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              rate Flexibility
            </label>
            <select
              // className="border focus:border-gray-400 rounded w-56 p-3"
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="rateFlexibility"
              defaultValue={formData?.rateFlexibility}
              {...register('rateFlexibility')}
              onChange={(e) => handleInputChange('rateFlexibility', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Avg Res Time && Average Rating */}
        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Avg Res Time */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="avg_response_time" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              avg response time
            </label>
            <input
              type="number"
              {...register('avg_response_time')}
              defaultValue={formData?.avg_response_time}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('avg_response_time', e.target.value)}
            />
          </div>

          {/* average rating */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="average_rating" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              {/* className="mt-2 mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2" */}
              average rating
            </label>
            <input
              type="number"
              {...register('average_rating')}
              defaultValue={formData?.average_rating}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('average_rating', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-0 md:mb-6 md:flex md:items-center md:justify-between">
          {/* Travel to distant */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="travel_to_distant_shoots" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              travel to distant shoots
            </label>
            <select
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="travel_to_distant_shoots"
              defaultValue={formData?.travel_to_distant_shoots}
              {...register('travel_to_distant_shoots')}
              onChange={(e) => handleInputChange('travel_to_distant_shoots', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* avg response time to new shoot inquiry */}
          {/* <div className="flex basis-[45%] flex-col sm:flex-row"> */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              avg response time to new shoot inquiry
            </label>
            <input
              type="number"
              {...register('avg_response_time_to_new_shoot_inquiry')}
              defaultValue={formData?.avg_response_time_to_new_shoot_inquiry}
              // className='border rounded p-3 bg-gray-200'
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('avg_response_time_to_new_shoot_inquiry', e.target.value)}
            />
          </div>
        </div>

        {/* Experience with Post Production && Customer Service Skills Experience */}
        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Experience with Post Production */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="experience_with_post_production_edit" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              experience with post production
            </label>
            <select
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="experience_with_post_production_edit"
              defaultValue={formData?.experience_with_post_production_edit}
              {...register('experience_with_post_production_edit')}
              onChange={(e) => handleInputChange('experience_with_post_production_edit', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {/* Customer Service Skills Experience */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="customer_service_skills_experience" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              customer service skills experience
            </label>
            <select
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="customer_service_skills_experience"
              defaultValue={formData?.customer_service_skills_experience}
              {...register('customer_service_skills_experience')}
              onChange={(e) => handleInputChange('customer_service_skills_experience', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Team Player */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="team_player" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              team player
            </label>
            <select
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="team_player"
              defaultValue={formData?.team_player}
              {...register('team_player')}
              name="team_player"
              onChange={(e) => handleInputChange('team_player', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Handle co worker conflicts */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="avg_response_time_to_new_shoot_inquiry" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              Handle Co Worker Conflicts
            </label>
            <input
              {...register('handle_co_worker_conflicts')}
              defaultValue={formData?.handle_co_worker_conflicts}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('handle_co_worker_conflicts', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Num Declined Shoots */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="num_declined_shoots" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              declined shoots
            </label>
            <input
              type="number"
              {...register('num_declined_shoots')}
              defaultValue={formData?.num_declined_shoots}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('num_declined_shoots', e.target.value)}
            />
          </div>
          {/* Num accepted Shoots */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="num_accepted_shoots" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              accepted <br /> shoots
            </label>
            <input
              type="number"
              {...register('num_accepted_shoots')}
              defaultValue={formData?.num_accepted_shoots}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('num_accepted_shoots', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* initiative */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="initiative" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              initiative
            </label>
            <input
              {...register('initiative')}
              defaultValue={formData?.initiative}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('initiative', e.target.value)}
            />
          </div>

          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="additional_info" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              additional <br /> info
            </label>
            <input
              {...register('additional_info')}
              defaultValue={formData?.additional_info}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('additional_info', e.target.value)}
            />
          </div>
        </div>

        {/* timezone &&  own transportation method */}
        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Timezone */}
          <div className="mb-6 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="timezone" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              timezone
            </label>
            <input
              {...register('timezone')}
              defaultValue={formData?.timezone}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('timezone', e.target.value)}
            />
          </div>
          {/* own transportation method */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="own_transportation_method" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              own transportation method
            </label>
            <select
              className="ms-12 mt-1 w-56 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              id="own_transportation_method"
              defaultValue={formData?.own_transportation_method}
              {...register('own_transportation_method')}
              onChange={(e) => handleInputChange('own_transportation_method', e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* City & Neighbourhood */}
        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* City */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="city" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              city
            </label>
            <input
              {...register('city')}
              defaultValue={formData?.city}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>

          {/* Neighbourhood */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="neighborhood" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              neighborhood
            </label>
            <input
              {...register('neighborhood')}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              defaultValue={formData?.neighborhood}
              onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            />
          </div>
        </div>

        {/* Zip code & in work pressure */}
        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* Zip code */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="zip_code" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              zip code
            </label>
            <input
              {...register('zip_code')}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              defaultValue={formData?.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
            />
          </div>
          {/* in work pressure */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="inWorkPressure" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              In Work Pressure
            </label>
            <input
              {...register('inWorkPressure')}
              className="ms-12 mt-1 rounded border p-3 focus:border-gray-400 focus:outline-none md:ms-0"
              defaultValue={formData?.inWorkPressure}
              onChange={(e) => handleInputChange('inWorkPressure', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-0 md:mb-4 md:flex md:items-center md:justify-between">
          {/* DOB || AGE */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="own_transportation_method" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              Date Of Birth
            </label>
            <input
              {...register('date_of_birth')}
              defaultValue={formattedDateTime?.date}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 capitalize focus:border-gray-400 focus:outline-none md:ms-0"
              disabled
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            />
          </div>
          {/* Review Status */}
          <div className="mb-4 basis-[45%] items-center md:mb-0 md:flex">
            <label htmlFor="review_status" className=" mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
              review status
            </label>
            <input
              {...register('review_status')}
              className="ms-12 mt-1 rounded border bg-gray-200 p-3 capitalize text-gray-600 focus:border-gray-400 focus:outline-none md:ms-0"
              defaultValue={formData?.review_status}
              disabled
              onChange={(e) => handleInputChange('review_status', e.target.value)}
            />
          </div>
        </div>
        {/*  array fields starts  */}
        {/* equipment and equipment_specific */}
        <div className="flex-row md:mb-4 md:flex md:items-start md:justify-between">
          {/* Equipment */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Equipment</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing equipment items */}
                {formData?.equipment &&
                  formData?.equipment?.map((equipment_item: any, index: any) => (
                    <div className="mb-2" key={`${equipment_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark  group-hover:text-dark">{equipment_item}</span>
                        </li>

                        <li className="list-none">
                          <button type="button" className="text-white-dark group-hover:text-red-400" onClick={() => removeEquipmentItem(equipment_item, 'equipment')}>
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}

                {/* Input field toggle button */}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowEquipmentInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                    <span> {showEquipmentInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}</span>
                  </button>
                </div>
                {/* Input field to add new equipment */}
                {showEquipmentInput && (
                  <div className="relative flex items-center justify-start">
                    <input {...register('equipment')} className="rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add Equipment" />
                    <button className="btn ml-1 cursor-pointer border-none p-0 pb-2 font-sans text-red-500" type="button" onClick={() => handleSetNewItem('equipment')}>
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>

          {/* Equipment Specific */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipment Specific</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing specific equipment items */}
                {formData?.equipment_specific &&
                  formData?.equipment_specific?.map((equipmentSpecific_item: any, index: any) => (
                    <div className="mb-2" key={`${equipmentSpecific_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark hover:text-dark group-hover:text-dark">{equipmentSpecific_item}</span>
                        </li>
                        <li className="list-none">
                          <button type="button" className="text-white-dark group-hover:text-red-400" onClick={() => removeEquipmentItem(equipmentSpecific_item, 'equipment_specific')}>
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
                {/* Toggle button*/}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowEquipmentSpecificInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                    {showEquipmentSpecificInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                  </button>
                </div>
                {/* Input field to add new specific equipment */}
                {showEquipmentSpecificInput && (
                  <div className="relative flex items-center justify-start">
                    <input {...register('equipment_specific')} className="rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add Equipment Specific" />
                    <button type="button" className="ml-1 cursor-pointer border-none p-0 pb-2 font-sans text-red-500" onClick={() => handleSetNewItem('equipment_specific')}>
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>

        {/* backup and vst */}
        <div className="flex-row md:mb-4 md:flex md:items-start md:justify-between">
          {/* backup */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Backup Footage</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing backup footage items */}
                {formData?.backup_footage &&
                  formData?.backup_footage?.map((backupFootage_item: any, index: any) => (
                    <div className="mb-2" key={`${backupFootage_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark hover:text-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark group-hover:text-dark">{backupFootage_item}</span>
                        </li>
                        <li className="list-none">
                          <button type="button" onClick={() => removeEquipmentItem(backupFootage_item, 'backup_footage')} className="text-white-dark group-hover:text-red-400">
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}

                {/* toggle button */}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowBackupFootageInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                    {showBackupFootageInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                  </button>
                </div>

                {/* Input field to add new backup footage */}
                {showBackupFootageInput && (
                  <div className="relative flex items-center justify-start">
                    <input {...register('backup_footage')} className="rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add backup footage" />

                    <button type="button" className="ml-1 cursor-pointer border-none p-0 pb-2 font-sans text-red-500" onClick={() => handleSetNewItem('backup_footage')}>
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>

          {/* VST */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">VST</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing VST items */}
                {formData?.vst &&
                  formData?.vst?.map((vst_item: any, index: any) => (
                    <div className="mb-2" key={`${vst_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark hover:text-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark group-hover:text-dark">{vst_item}</span>
                        </li>
                        <li className="list-none">
                          <button type="button" onClick={() => removeEquipmentItem(vst_item, 'vst')} className="text-white-dark group-hover:text-red-400">
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
                {/* toggle button */}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowVstInput((prev) => !prev)} className=" text-bold cursor-pointer p-0 font-sans text-white-dark">
                    {showVstInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                  </button>
                </div>
                {/* Input field to add new VST */}
                {showVstInput && (
                  <div className="relative flex items-center justify-start">
                    <input {...register('vst')} className="rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add vst" />
                    <button type="button" onClick={() => handleSetNewItem('vst')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>

        {/* shoot avalibility and portfolio */}
        <div className="flex-row md:mb-4 md:flex md:items-start md:justify-between">
          {/* Shoot Availability */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Availability</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing shoot availability items */}
                {formData?.shoot_availability &&
                  formData?.shoot_availability?.map((shootAvailability_item: any, index: any) => (
                    <div className="mb-2" key={`${shootAvailability_item}_${index}`}>
                      <ul className="group ms-6 flex w-48 list-disc items-center justify-between text-white-dark hover:text-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark group-hover:text-dark ">{shootAvailability_item}</span>
                        </li>
                        <li className="list-none">
                          <button type="button" onClick={() => removeEquipmentItem(shootAvailability_item, 'shoot_availability')} className="text-white-dark group-hover:text-red-400">
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
                {/* toggle button */}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowShootAvailabilityInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                    {showShootAvailabilityInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                  </button>
                </div>
                {/* Input field to add new shoot availability */}
                {showShootAvailabilityInput && (
                  <div className="relative flex items-center justify-start">
                    <input {...register('shoot_availability')} className="rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add shoot availability" />
                    <button type="button" onClick={() => handleSetNewItem('shoot_availability')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>

          {/* Portfolio */}
          <div className="mb-8 basis-[45%] md:mb-2 md:flex">
            <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Portfolio</label>
            <div className="ml-10 mt-1 flex-1 md:ml-0 md:mt-0">
              <>
                {/* Render existing portfolio items */}
                {formData?.portfolio &&
                  formData?.portfolio?.map((portfolio_item: any, index: any) => (
                    <div className="mb-2" key={`${portfolio_item}_${index}`}>
                      <ul className="group ms-6 flex w-64 list-disc items-center justify-between text-white-dark hover:text-dark">
                        <li>
                          <span className="font-sans capitalize text-white-dark group-hover:text-dark">{portfolio_item}</span>
                        </li>
                        <li className="list-none">
                          <button type="button" onClick={() => removeEquipmentItem(portfolio_item, 'portfolio')} className="text-white-dark group-hover:text-red-400">
                            {allSvgs.closeBtnCp}
                          </button>
                        </li>
                      </ul>
                    </div>
                  ))}
                {/* toggle button */}
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => setShowPortfolioInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                    {showPortfolioInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                  </button>
                </div>
                {/* Textarea field to add new portfolio */}
                {showPortfolioInput && (
                  <div className="relative flex items-center justify-start">
                    <textarea {...register('portfolio')} className="w-72 rounded border p-3 capitalize focus:border-gray-400 focus:outline-none" placeholder="Add Portfolio" />
                    <button type="button" onClick={(e) => handleSetNewItem('portfolio')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                      {allSvgs.plusForAddCp}
                    </button>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>

        {/* array fields ends */}
        <div className="flex items-center justify-end">
          <button type="button" className="btn btn-dark font-sans">
            <Link href={'/manager/cp'}>Back</Link>
          </button>
          <button type="submit" className="btn btn-success font-sans ltr:ml-4 rtl:mr-4">
            {isLoading ? (
              <span role="status" className="flex h-5 items-center space-x-2">
                <Loader />
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CpDetails;
