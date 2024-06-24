import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useDateFormat from '@/hooks/useDateFormat';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useForm } from "react-hook-form";
import Loader from '@/components/SharedComponent/Loader';

const CpDetails = () => {
    const [userModal, setUserModal] = useState(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    const [formData, setFormData] = useState<any | null>(null);
    console.log("🚀 ~ CpDetails ~ formData:", formData);

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
    const toggleEquipmentInput = () => {
        setShowEquipmentInput(prev => !prev);
    };

    const toggleEquipmentSpecificInput = () => {
        setShowEquipmentSpecificInput(prev => !prev);
    };

    const toggleBackupFootageInput = () => {
        setShowBackupFootageInput(prev => !prev);
    };

    const toggleVstInput = () => {
        setShowVstInput(prev => !prev);
    };

    const toggleShootAvailabilityInput = () => {
        setShowShootAvailabilityInput(prev => !prev);
    };

    const togglePortfolioInput = () => {
        setShowPortfolioInput(prev => !prev);
    };


    useEffect(() => {
        if (params?.cp) {
            const singleUserId = Array.isArray(params.cp) ? params.cp[0] : params.cp;
            getUserDetails(singleUserId);
        }
    }, [params?.cp])

    // User Single
    const getUserDetails = async (singleUserId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${singleUserId}`);
            const userDetailsRes = await response.json();

            if (!userDetailsRes) {
                // setShowError(true);
                setLoading(true);
            } else {
                // setUserInfo(userDetailsRes);
                setFormData(userDetailsRes);
                setLoading(false);
                setUserModal(true);
            }
        } catch (error) {
            console.error(error);
            // setLoading(false);
        }
    };


    const { register, handleSubmit, getValues, reset } = useForm();

    const handleSetNewItem = (fieldName: string) => {
        const value = getValues(fieldName);

        // Check if the new value already exists in equipmentData
        if (!fieldName) return;

        switch (fieldName) {
            case 'equipment':
                // setEquipment(prev => [...prev, value]);
                formData.equipment.push(value);
                break;
            case 'equipment_specific':
                formData.equipment_specific.push(value);
                // setEquipment_specific(prev => [...prev, value]);
                break;
            case 'backup_footage':
                formData.backup_footage.push(value);
                // setBackup_footage(prev => [...prev, value]);
                break;
            case 'vst':
                formData.vst.push(value);
                // setVst(prev => [...prev, value]);
                break;
            case 'shoot_availability':
                formData.shoot_availability.push(value);
                // setShoot_availability(prev => [...prev, value]);
                break;
            case 'portfolio':
                formData.portfolio.push(value);
                // setPortfolio(prev => [...prev, value]);
                break;
            default:
                break;
        }

        reset({ [fieldName]: "" });
    };


    // 
    const removeEquipmentItem = (arr_item: any, fieldName: string) => {
        if (!fieldName) return;

        switch (fieldName) {
            case 'equipment':
                const existingItemsEquipment = formData?.equipment?.filter((item: any) => item !== arr_item)
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    equipment: existingItemsEquipment
                }));
                break;
            case 'equipment_specific':
                const existingItemsEquipmentSpecific = formData?.equipment_specific?.filter((item: any) => item !== arr_item)
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    equipment_specific: existingItemsEquipmentSpecific
                }));
                break;
            case 'backup_footage':
                const existingItemsBackup = formData?.backup_footage?.filter((item: any) => item !== arr_item);
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    backup_footage: existingItemsBackup
                }));
                break;

            case 'vst':
                const existingItemsVst = formData?.vst?.filter((item: any) => item !== arr_item);
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    vst: existingItemsVst
                }));
                break;
            case 'shoot_availability':
                const existingItemsShoot = formData?.shoot_availability?.filter((item: any) => item !== arr_item);
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    shoot_availability: existingItemsShoot
                }));
                break;
            case 'portfolio':
                const existingItemsPortfolio = formData?.portfolio?.filter((item: any) => item !== arr_item)
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    portfolio: existingItemsPortfolio
                }));
                break;
            default:
                break;
        }
    };

    const handleInputChange = (key: any, value: any) => {
        setFormData({
            ...formData,
            [key]: value
        });
    }

    const handleBooleanValueOnChange = (fieldName: string) => {
        /* if (fieldName === 'rate_flexibility') {
            // Assuming formData is your state or object holding form data
            const rateFlexibilityValue = formData?.rateFlexibility; // Accessing the current value
            if (rateFlexibilityValue === 'true') {
                console.log(true);
                return true;

            } else if (rateFlexibilityValue === 'false') {
                console.log(false);
                return false;

            } else {
                return null; // Return null or handle unexpected values as per your logic
            }
        } */
    }


    const onSubmit = async (data: any) => {

        const singleUserId = Array.isArray(params.cp) ? params.cp[0] : params.cp;

        const disabledFieldsValue = {
            successful_beige_shoots: formData?.successful_beige_shoots,
            trust_score: formData?.trust_score,
            average_rating: formData?.average_rating,
            total_earnings: formData?.total_earnings,
            avg_response_time: formData?.avg_response_time,
            avg_response_time_to_new_shoot_inquiry: formData?.avg_response_time_to_new_shoot_inquiry,
            num_declined_shoots: formData?.num_declined_shoots,
            num_accepted_shoots: formData?.num_accepted_shoots,
            date_of_birth: formData?.date_of_birth,
            review_status: formData?.review_status,
        }

        const updatableStringField = {
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
        }

        const arrayInputFields = {
            equipment: data?.equipment || formData?.equipment,
            equipment_specific: data?.equipment_specific || formData?.equipment_specific,
            backup_footage: data?.backup_footage || formData?.backup_footage,
            vst: data?.vst || formData?.vst,
            shoot_availability: data?.shoot_availability || formData?.shoot_availability,
            portfolio: formData?.portfolio,
        }

        const updatedData = {
            // arrayInputFields
            ...arrayInputFields,
            // disabled fields value;
            ...disabledFieldsValue,
            // updatable String Fields value
            ...updatableStringField
        }

        console.log("🚀 ~ onSubmit ~ updatedData:", updatedData);

        const patchResponse = await fetch(`${API_ENDPOINT}cp/${singleUserId}?role=manager`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!patchResponse.ok) {
            return "error failed to patch";
        }

        const patchedData = await patchResponse.json();
        console.log('Patch successful:', patchedData);

    }


    return (
        <div className="p-5">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
                <div className="flex items-center justify-between">
                    {/* Content Vertical */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Vertical  </label>
                        <div className="flex-1">
                            {formData?.content_verticals &&
                                formData.content_verticals.map((content_vertical: string) => (
                                    <div className="mb-2" key={content_vertical}>
                                        <label className="flex items-center">
                                            <input type="checkbox"
                                                {...register('content_verticals')}
                                                className="form-checkbox"
                                                defaultValue={formData.content_vertical}
                                                id="content_verticals"
                                                name="content_verticals"
                                            />
                                            <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Content Type */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                        <div className="flex-1">
                            {formData?.content_type &&
                                formData.content_type.map((c_type: string) => (
                                    <div className="mb-2" key={c_type}>
                                        <label className="flex items-center">
                                            <input type="checkbox" {...register('content_type')} className="form-checkbox" defaultValue={formData.content_type} id="content_type" name="content_type" />
                                            <span className="font-sans capitalize text-white-dark">{c_type}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* Successful Shoots */}
                    <div className="flex basis-[45%] flex-col items-center sm:flex-row">
                        <label htmlFor="successful_beige_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Successful <br /> Shoots
                        </label>

                        <input
                            type="number"
                            {...register("successful_beige_shoots")}
                            defaultValue={formData?.successful_beige_shoots}
                            className='border rounded bg-gray-200 p-3 '
                            disabled
                            onChange={(e) => handleInputChange('successful_beige_shoots', e.target.value)}

                        />
                    </div>
                    {/* Trust Score */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            trust score
                        </label>

                        <input type="number"
                            {...register("trust_score")}
                            defaultValue={formData?.trust_score}
                            className='border rounded bg-gray-200 p-3'
                            onChange={(e) => handleInputChange('trust_score', e.target.value)}
                            disabled />
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* References */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="reference" className="mt-2 mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Reference
                        </label>
                        <input
                            {...register("reference")}
                            defaultValue={formData?.reference}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('reference', e.target.value)}
                        />
                    </div>

                    {/* Total Earnings */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            total earnings ($)
                        </label>
                        <input
                            type="number"
                            {...register("total_earnings")}
                            defaultValue={formData?.total_earnings}
                            className='border rounded bg-gray-200 p-3'
                            disabled
                            onChange={(e) => handleInputChange('total_earnings', e.target.value)}
                        />
                    </div>
                </div>

                {/* rate and rate related */}
                <div className="flex items-center justify-between my-4">
                    {/* rate */}
                    <div className="flex basis-[45%] flex-col sm:flex-row mb:mt-0">
                        <label htmlFor="initiative" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            rate
                        </label>

                        <input
                            type="number"
                            {...register("rate")}
                            defaultValue={(formData?.rate)}
                            className='border rounded p-3 focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('rate', e.target.value)}
                        />
                    </div>

                    {/* Rate Flexibility */}
                    <div className="flex basis-[45%] flex-col sm:flex-row mb:mt-0">
                        <label htmlFor="rateFlexibility" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            rate Flexibility
                        </label>
                        <select
                            className="border focus:border-gray-400 rounded w-32 p-3"
                            id="rateFlexibility"
                            defaultValue={formData?.rateFlexibility}
                            {...register('rateFlexibility')}
                            onChange={() => handleBooleanValueOnChange('rateFlexibility')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
                {/* rate and rate related */}

                {/* Avg Res Time && Average Rating */}
                <div className="flex items-center justify-between">
                    {/* Avg Res Time */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            avg response time
                        </label>

                        <input
                            type="number"
                            {...register("avg_response_time")}
                            defaultValue={formData?.avg_response_time}
                            className='border rounded bg-gray-200 p-3'
                            disabled
                            onChange={(e) => handleInputChange('avg_response_time', e.target.value)}
                        />
                    </div>

                    {/* Average Rating */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            average rating
                        </label>
                        <input
                            type="number"
                            {...register("average_rating", { min: 1, max: 99 })}
                            defaultValue={formData?.average_rating}
                            className='border rounded bg-gray-200 p-3'
                            disabled
                            onChange={(e) => handleInputChange('average_rating', e.target.value)}
                        />
                    </div>

                </div>



                <div className="flex items-center justify-between my-4">
                    {/* Travel to distant */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="travel_to_distant_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            travel to distant shoots
                        </label>
                        <select
                            className="border focus:border-gray-400 rounded w-32 p-3"
                            id="travel_to_distant_shoots"
                            defaultValue={formData?.travel_to_distant_shoots}
                            {...register('travel_to_distant_shoots')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    {/* avg response time to new shoot inquiry */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            avg response time to new shoot inquiry
                        </label>
                        <input
                            type="number"
                            {...register("avg_response_time_to_new_shoot_inquiry")}
                            defaultValue={(formData?.avg_response_time_to_new_shoot_inquiry)}
                            className='border rounded p-3 bg-gray-200'
                            disabled
                            onChange={(e) => handleInputChange('avg_response_time_to_new_shoot_inquiry', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* Experience with Post Production */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="experience_with_post_production_edit" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            experience with post production
                        </label>
                        <select
                            className="border focus:border-gray-400 rounded w-32 p-3"
                            id="experience_with_post_production_edit"
                            defaultValue={formData?.experience_with_post_production_edit}
                            {...register('experience_with_post_production_edit')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    {/* Customer Service Skills Experience */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="customer_service_skills_experience" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            customer service skills experience
                        </label>
                        <select
                            className="border focus:border-gray-400 rounded w-32 p-3 font-sans"
                            id="customer_service_skills_experience"
                            defaultValue={formData?.customer_service_skills_experience}
                            {...register('customer_service_skills_experience')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* Team Player */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="team_player" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            team player
                        </label>
                        <select
                            className="border focus:border-gray-400 rounded w-56 p-3 font-sans"
                            id="team_player"
                            defaultValue={formData?.team_player}
                            {...register('team_player')}
                            name="team_player"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    {/* Handle co worker conflicts */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Handle Co Worker Conflicts
                        </label>

                        <input
                            {...register("handle_co_worker_conflicts")}
                            defaultValue={(formData?.handle_co_worker_conflicts)}
                            className='border rounded p-3 focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('handle_co_worker_conflicts', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* Num Declined Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_declined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            declined shoots
                        </label>

                        <input
                            type="number"
                            {...register("num_declined_shoots")}
                            defaultValue={(formData?.num_declined_shoots)}
                            className='border rounded p-3 bg-gray-200'
                            disabled
                            onChange={(e) => handleInputChange('num_declined_shoots', e.target.value)}
                        />
                    </div>
                    {/* Num accepted Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_accepted_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            accepted <br /> shoots
                        </label>
                        <input
                            type="number"
                            {...register("num_accepted_shoots")}
                            defaultValue={(formData?.num_accepted_shoots)}
                            className='border rounded p-3 bg-gray-200'
                            disabled
                            onChange={(e) => handleInputChange('num_accepted_shoots', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* initiative */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="initiative" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            initiative
                        </label>
                        <input
                            {...register("initiative")}
                            defaultValue={formData?.initiative}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('initiative', e.target.value)}
                        />
                    </div>

                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="additional_info" className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            additional <br /> info
                        </label>

                        <input
                            {...register("additional_info")}
                            defaultValue={formData?.additional_info}
                            className='border p-3 w-64 rounded capitalize focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('additional_info', e.target.value)}
                        />
                    </div>

                </div>
                {/* timezone */}
                <div className="flex items-center justify-between my-4">
                    {/* Timezone */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="timezone" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            timezone
                        </label>
                        <input
                            {...register("timezone")}
                            defaultValue={formData?.timezone}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('timezone', e.target.value)}

                        />
                    </div>

                    {/* own transportation method */}
                    <div className="flex basis-[45%] flex-col sm:flex-row md:mt-4">
                        <label htmlFor="own_transportation_method" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            own transportation method
                        </label>

                        <select
                            className="border focus:border-gray-400 rounded w-56 p-3 font-sans"
                            id="own_transportation_method"
                            defaultValue={formData?.own_transportation_method}
                            {...register('own_transportation_method')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>

                {/* City & Neighbourhood */}
                <div className="flex items-center justify-between my-4">
                    {/* City */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="city" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            city
                        </label>

                        <input
                            {...register("city")}
                            defaultValue={formData?.city}
                            className='border p-3 w-72 rounded capitalize focus:outline-none focus:border-gray-400'
                            onChange={(e) => handleInputChange('city', e.target.value)}

                        />
                    </div>

                    {/* Neighbourhood */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="neighborhood" className=" mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            neighborhood
                        </label>

                        <input
                            {...register("neighborhood")}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            defaultValue={formData?.neighborhood}
                            onChange={(e) => handleInputChange('neighborhood', e.target.value)}

                        />

                    </div>
                </div>

                {/* Zip code & in work pressure */}
                <div className="flex items-center justify-between my-4">
                    {/* Zip code */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="zip_code" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            zip code
                        </label>

                        <input
                            {...register("zip_code")}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            defaultValue={formData?.zip_code}
                            onChange={(e) => handleInputChange('zip_code', e.target.value)}
                        />
                    </div>
                    {/* in work pressure */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="inWorkPressure" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            In Work Pressure
                        </label>

                        <input
                            {...register("inWorkPressure")}
                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                            defaultValue={formData?.inWorkPressure}
                            onChange={(e) => handleInputChange('inWorkPressure', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between my-4">
                    {/* DOB || AGE */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="own_transportation_method" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Date Of Birth
                        </label>

                        <input
                            {...register("date_of_birth")}
                            defaultValue={formattedDateTime?.date} className='border p-3 rounded capitalize bg-gray-200'
                            disabled
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}

                        />

                    </div>
                    {/* Review Status */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="review_status" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 ">
                            review status
                        </label>
                        <input
                            {...register("review_status")}
                            className='border p-3 rounded capitalize bg-gray-200 text-gray-600'
                            defaultValue={formData?.review_status}
                            disabled
                            onChange={(e) => handleInputChange('review_status', e.target.value)}

                        />
                    </div>
                </div>
                {/* --------> array fields starts  */}

                {/* equipment and equipment_specific */}
                <div className="md:flex md:justify-between md:items-start flex-row my-4">
                    {/* Equipment */}
                    <div className="flex basis-[45%] mb-10 md:mb-2">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Equipment</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                            <>
                                {/* Render existing equipment items */}
                                {formData?.equipment && formData?.equipment?.map((equipment_item: any, index: any) => (
                                    <div className="mb-2" key={`${equipment_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-48 text-white-dark hover:text-dark">
                                            <li >
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{equipment_item}</span>
                                            </li>

                                            <li className='list-none'>
                                                <button
                                                    type="button"
                                                    className="text-white-dark hover:text-red-400"
                                                    onClick={() => removeEquipmentItem(equipment_item, 'equipment')}
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}

                                {/* Input field toggle button */}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={toggleEquipmentInput}
                                        className="text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        <span> {showEquipmentInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}</span>
                                    </button>
                                </div>
                                {/* Input field to add new equipment */}
                                {showEquipmentInput && (
                                    <div className='flex justify-start items-center relative'>
                                        <input
                                            {...register("equipment")}
                                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                                            placeholder="Add Equipment"
                                        />
                                        <button
                                            className="btn border-none p-0 pb-2 font-sans cursor-pointer text-red-500 ml-1"
                                            type="button"
                                            onClick={() => handleSetNewItem("equipment")}
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>

                    {/* Equipment Specific */}
                    <div className="flex basis-[45%]">
                        <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipment Specific</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">
                            <>

                                {/* Render existing specific equipment items */}
                                {formData?.equipment_specific && formData?.equipment_specific?.map((equipmentSpecific_item: any, index: any) => (
                                    <div className="mb-2" key={`${equipmentSpecific_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-48 text-white-dark hover:text-dark">
                                            <li>
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{equipmentSpecific_item}</span>
                                            </li>
                                            <li className='list-none'>
                                                <button
                                                    type="button"
                                                    className="text-white-dark hover:text-red-400"
                                                    onClick={() => removeEquipmentItem(equipmentSpecific_item, 'equipment_specific')}
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                                {/* Toggle button*/}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={toggleEquipmentSpecificInput}
                                        className="text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        {showEquipmentSpecificInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                                    </button>
                                </div>

                                {/* Input field to add new specific equipment */}
                                {showEquipmentSpecificInput && (
                                    <div className='flex justify-start items-center relative'>
                                        <input
                                            {...register("equipment_specific")}
                                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                                            placeholder="Add Equipment Specific"
                                        />


                                        <button
                                            type="button"
                                            className="border-none p-0 pb-2 font-sans cursor-pointer text-red-500 ml-1"
                                            onClick={() => handleSetNewItem("equipment_specific")}
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                )}

                            </>
                        </div>
                    </div>
                </div>

                {/* backup and vst */}
                <div className="md:flex md:justify-between md:items-start flex-row my-4">
                    <div className="flex basis-[45%] mb-10 md:mb-2">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Backup Footage</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">

                            <>
                                {/* Render existing backup footage items */}
                                {formData?.backup_footage && formData?.backup_footage?.map((backupFootage_item: any, index: any) => (
                                    <div className="mb-2" key={`${backupFootage_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-48 text-white-dark hover:text-dark">
                                            <li>
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{backupFootage_item}</span>
                                            </li>
                                            <li className='list-none '>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEquipmentItem(backupFootage_item, 'backup_footage')}
                                                    className="text-white-dark hover:text-red-400"
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}

                                {/* toggle button */}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={toggleBackupFootageInput}
                                        className="text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        {showBackupFootageInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                                    </button>
                                </div>

                                {/* Input field to add new backup footage */}
                                {showBackupFootageInput && (

                                    <div className='flex justify-start items-center relative'>
                                        <input
                                            {...register("backup_footage")}
                                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                                            placeholder="Add backup footage"
                                        />

                                        <button
                                            type="button"
                                            className="border-none p-0 pb-2 font-sans cursor-pointer text-red-500 ml-1"
                                            onClick={() => handleSetNewItem("backup_footage")}
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                        {/*  */}

                                    </div>
                                )}
                            </>
                        </div>
                    </div>

                    {/* VST */}
                    <div className="flex basis-[45%]">
                        <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">VST</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">

                            <>
                                {/* Render existing VST items */}
                                {formData?.vst && formData?.vst?.map((vst_item: any, index: any) => (
                                    <div className="mb-2" key={`${vst_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-48 text-white-dark hover:text-dark">
                                            <li>
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{vst_item}</span>
                                            </li>
                                            <li className='list-none'>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEquipmentItem(vst_item, 'vst')}
                                                    className="text-white-dark hover:text-red-400"
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                                {/* toggle button */}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={toggleVstInput}
                                        className=" text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        {showVstInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                                    </button>
                                </div>

                                {/* Input field to add new VST */}
                                {showVstInput && (
                                    <div className='flex justify-start items-center relative'>
                                        <input {...register("vst")} className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400' placeholder="Add vst" />
                                        <button
                                            type="button"
                                            onClick={() => handleSetNewItem("vst")}
                                            className="border-none p-0 pb-2 font-sans cursor-pointer text-indigo-500 md:me-0"
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div >

                {/* -------> shoot avalibility and portfolio */}
                <div className="md:flex md:justify-between md:items-start flex-row my-4">
                    {/* Shoot Availability */}
                    <div className="flex basis-[45%] mb-10 md:mb-2">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Shoot Availability</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">

                            <>
                                {/* Render existing shoot availability items */}
                                {formData?.shoot_availability && formData?.shoot_availability?.map((shootAvailability_item: any, index: any) => (
                                    <div className="mb-2" key={`${shootAvailability_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-48 text-white-dark hover:text-dark">
                                            <li>
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{shootAvailability_item}</span>
                                            </li>
                                            <li className='list-none'>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEquipmentItem(shootAvailability_item, 'shoot_availability')}
                                                    className="text-white-dark hover:text-red-400"
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                                {/* toggle button */}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={toggleShootAvailabilityInput}
                                        className="text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        {showShootAvailabilityInput ? (allSvgs.minusForHide) : (allSvgs.plusForAddCp)}
                                    </button>
                                </div>
                                {/* Input field to add new shoot availability */}
                                {showShootAvailabilityInput && (
                                    <div className='flex justify-start items-center relative'>
                                        <input
                                            {...register("shoot_availability")}
                                            className='border p-3 rounded capitalize focus:outline-none focus:border-gray-400'
                                            placeholder="Add shoot availability" />

                                        <button
                                            type="button"
                                            onClick={() => handleSetNewItem("shoot_availability")}
                                            className="border-none p-0 pb-2 font-sans cursor-pointer text-indigo-500 md:me-0"
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="flex basis-[45%]">
                        <label className="font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4">Portfolio</label>
                        <div className="flex-1 ml-10 md:ml-0 mt-1 md:mt-0">

                            <>
                                {/* Render existing portfolio items */}
                                {formData?.portfolio && formData?.portfolio?.map((portfolio_item: any, index: any) => (
                                    <div className="mb-2" key={`${portfolio_item}_${index}`}>
                                        <ul className="flex items-center justify-between ms-6 list-disc w-64 text-white-dark hover:text-dark">
                                            <li>
                                                <span className="font-sans capitalize text-white-dark hover:text-dark">{portfolio_item}</span>
                                            </li>
                                            <li className='list-none'>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEquipmentItem(portfolio_item, 'portfolio')}
                                                    className="text-white-dark hover:text-red-400"
                                                >
                                                    {allSvgs.closeBtnCp}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                                {/* toggle button */}
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        type="button"
                                        onClick={togglePortfolioInput}
                                        className="text-bold text-white-dark p-0 font-sans cursor-pointer"
                                    >
                                        {showPortfolioInput ? (allSvgs.minusForHide) : (allSvgs.plusForAddCp)}
                                    </button>
                                </div>
                                {/* Textarea field to add new portfolio */}
                                {showPortfolioInput && (
                                    <div className='flex justify-start items-center relative'>
                                        <textarea {...register("portfolio")} className='border p-3 w-72 rounded capitalize focus:outline-none focus:border-gray-400' placeholder="Add Portfolio" />
                                        <button
                                            type="button"
                                            onClick={() => handleSetNewItem("portfolio")}
                                            className="border-none p-0 pb-2 font-sans cursor-pointer text-indigo-500 md:me-0"
                                        >
                                            {allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>

                {/* array fields ends */}

                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-dark font-sans">
                        <Link href={'/manager/cp'}>Back</Link>
                    </button>
                    <button type="submit" className="btn btn-success font-sans ltr:ml-4 rtl:mr-4">
                        Save
                    </button>
                </div>
            </form >
        </div >
    );
};

export default CpDetails;
