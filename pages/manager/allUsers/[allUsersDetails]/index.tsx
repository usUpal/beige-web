import { useEffect, useRef, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import Link from 'next/link';
const AllUserDetails = () => {
    const [userModal, setUserModal] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({
        content_type: ['wedding', 'portrait'],
        content_verticals: ['modern', 'romantic'],
        vst: ['modern wedding', 'romantic wedding'],
        shoot_availability: ['weekends', 'afternoons'],
        successful_beige_shoots: 8,
        trust_score: 4.7,
        average_rating: 4.9,
        avg_response_time: 1.5,
        equipment: ['camera', 'lens', 'tripod'],
        equipment_specific: ['Sony a7 III', 'Sony FE 85mm f/1.8'],
        portfolio: ['https://example.com/portfolio5', 'https://example.com/portfolio6'],
        total_earnings: 8000,
        backup_footage: ['https://example.com/backup5', 'https://example.com/backup6'],
        travel_to_distant_shoots: true,
        experience_with_post_production_edit: true,
        customer_service_skills_experience: true,
        team_player: false,
        avg_response_time_to_new_shoot_inquiry: 1,
        num_declined_shoots: 0,
        num_accepted_shoots: 8,
        num_no_shows: 1,
        review_status: 'rejected',
        userId: {
            role: 'cp',
            isEmailVerified: false,
            name: 'fake name',
            email: 'mailto:fake2@example.com',
            id: '654088f1f695fec584004043',
        },
        city: 'Texas',
        neighborhood: 'Mission District',
        zip_code: '94110',
        last_beige_shoot: '61d8f4b4c8d9e6a4a8c3f7d5',
        timezone: 'PST',
        own_transportation_method: true,
        reference: 'Bob Johnson',
    });
    console.log('🚀 ~ file: users.tsx:60 ~ Users ~ formData:', formData);

    useEffect(() => {
        getAllUsers();
    }, [currentPage]);

    // All Users
    const getAllUsers = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}users`);
            const users = await response.json();
            setTotalPagesCount(users?.totalPages);
            setAllUsers(users.results);
        } catch (error) {
            console.error(error);
        }
    };

    // User Single
    // Also unUsed Function For Api
    const getUserDetails = async (singleUserId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${singleUserId}`);
            const userDetailsRes = await response.json();

            if (!userDetailsRes) {
                setShowError(true);
                setLoading(false);
            } else {
                setUserInfo(userDetailsRes);
                setLoading(false);
                setUserModal(true);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('get data', formData);
    };

    // Fixing handleChange Function version --1
    const handleChange = (e: any) => {
        console.log('Event:', e);
        const { name, value } = e.target;
        console.log('e.target:', name, value);

        setFormData((prevFormData: any) => {
            console.log('previousFormData:', prevFormData);
            // Checking For Duplicate Value
            if (Array.isArray(prevFormData[name]) && prevFormData[name].includes(value)) {
                // Deleting Duplicate Value
                const updatedArray = prevFormData[name].filter((item: any) => item !== value);
                return {
                    ...prevFormData,
                    [name]: updatedArray,
                };
            } else {
                return {
                    ...prevFormData,
                    [name]: Array.isArray(prevFormData[name]) ? [...prevFormData[name], value] : value,
                };
            }
        });
    };

    {
        formData?.content_verticals &&
            formData.content_verticals.map((content_vertical: string) => (
                <div className="mb-2" key={content_vertical}>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            value={content_vertical}
                            id={`checkbox_${content_vertical}`}
                            name={`checkbox_${content_vertical}`}
                            onChange={(e) => handleChange('content_verticals')}
                        />
                        <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
                    </label>
                </div>
            ));
    }

    // Success Toast
    const coloredToast = (color: any) => {
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
            title: 'User updated successfully!',
        });
    };

    // Insert Footage
    const [newData, insertNewData] = useState<any>({});

    const addHandler = (e: any) => {
        let inputName = e.target.name;
        console.log('🚀 ~ file: index.tsx:178 ~ addHandler ~ inputName:', inputName);
        let val = e.target.value;

        insertNewData((prevData: any) => ({
            ...prevData,
            [inputName]: [val],
        }));
        return newData;
    };

    console.log(newData);

    // unUsed Function For Api----When Get api we will work On it
    const submitData = async (e: any) => {
        try {
            const response = await fetch(`${API_ENDPOINT}cp/${userInfo.userId}?role=manager`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addHandler(e)),
            });

            const updateNew = await response.json();

            // Handle the response as needed
            coloredToast('success');
        } catch (error) {
            console.error(error);
        }
    };
    // Change Only formData To UserInfo(Here I use form Data for testing purpose)
    return (
        <div className="p-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                    {/* Content Vertical */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Vertical  </label>
                        <div className="flex-1">
                            {formData?.content_verticals &&
                                formData.content_verticals.map((content_vertical: string) => (
                                    <div className="mb-2" key={content_vertical}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.content_vertical} id="content_verticals" name="content_verticals" />
                                            <span className="font-sans capitalize text-white-dark">{content_vertical}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Successful Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="successful_beige_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Successful Shoots
                        </label>
                        <input id="successful_beige_shoots" type="number" defaultValue={formData?.successful_beige_shoots} className="form-input" name="successful_beige_shoots" onChange={handleChange} />
                    </div>
                    {/* Trust Score */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            trust score
                        </label>
                        <input id="trust_score" type="number" defaultValue={formData?.trust_score} className="form-input" name="trust_score" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* References */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="reference" className="mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Reference
                        </label>
                        <input id="reference" type="text" placeholder="John Doe" defaultValue={formData?.reference} className="form-input capitalize" name="reference" onChange={handleChange} />
                    </div>
                    {/* Average Rating */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            average rating
                        </label>
                        <input id="average_rating" type="number" defaultValue={formData?.average_rating} className="form-input" name="average_rating" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Avg Res Time */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            avg response time
                        </label>
                        <input id="avg_response_time" type="number" defaultValue={formData?.avg_response_time} className="form-input block" name="avg_response_time" onChange={handleChange} />
                    </div>
                    {/* Total Earnings */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            total earnings ($)
                        </label>
                        <input id="total_earnings" type="number" defaultValue={formData?.total_earnings} className="form-input" name="total_earnings" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Equipement */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipement</label>
                        <div className="flex-1">
                            {formData?.equipment &&
                                formData.equipment.map((equipmentItem: string) => (
                                    <div className="mb-2" key={equipmentItem}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.equipmentItem} id="equipment" name="equipment" />
                                            <span className="font-sans capitalize text-white-dark">{equipmentItem}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Portfolio */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Portfolio</label>
                        <div className="flex-1">
                            {formData?.portfolio &&
                                formData.portfolio.map((portfolioItem: string) => (
                                    <div className="mb-2" key={portfolioItem}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.portfolioItem} id="portfolio" name="portfolio" />
                                            <span className="font-sans capitalize text-white-dark">{portfolioItem}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Travel to diostant */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="travel_to_distant_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            travel to distant shoots
                        </label>
                        <select
                            className="form-select font-sans capitalize text-white-dark"
                            id="travel_to_distant_shoots"
                            defaultValue={formData.travel_to_distant_shoots}
                            name="travel_to_distant_shoots"
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Experience with Post Production */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="experience_with_post_production_edit" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            experience with post production
                        </label>
                        <select
                            className="form-select font-sans capitalize text-white-dark"
                            id="experience_with_post_production_edit"
                            defaultValue={formData.experience_with_post_production_edit}
                            name="experience_with_post_production_edit"
                            onChange={handleChange}
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
                            className="form-select font-sans capitalize text-white-dark"
                            id="customer_service_skills_experience"
                            defaultValue={formData.customer_service_skills_experience}
                            name="customer_service_skills_experience"
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Team Player */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="team_player" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            team player
                        </label>
                        <select className="form-select font-sans capitalize text-white-dark" id="team_player" defaultValue={formData.team_player} name="team_player" onChange={handleChange}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    {/* Avg Res Time to New Shoot Inquiry */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            avg response time to new shoot inquiry
                        </label>
                        <input
                            id="avg_response_time_to_new_shoot_inquiry"
                            type="number"
                            defaultValue={formData?.avg_response_time_to_new_shoot_inquiry}
                            className="form-input block font-sans"
                            name="avg_response_time_to_new_shoot_inquiry"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Num Declined Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_declined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            num declined shoots
                        </label>
                        <input id="num_declined_shoots" type="number" defaultValue={formData?.num_declined_shoots} className="form-input block" name="num_declined_shoots" onChange={handleChange} />
                    </div>
                    {/* Num accepted Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_accepted_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            num accepted shoots
                        </label>
                        <input id="num_accepted_shoots" type="number" defaultValue={formData?.num_accepted_shoots} className="form-input block" name="num_accepted_shoots" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Num no Shows */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_dnum_no_showseclined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            num no shows
                        </label>
                        <input id="num_no_shows" type="number" defaultValue={formData?.num_no_shows} className="form-input block font-sans" name="num_no_shows" onChange={handleChange} />
                    </div>
                    {/* Timezone */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="timezone" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            timezone
                        </label>
                        <input id="timezone" type="text" defaultValue={userInfo?.timezone} className="form-input block" name="timezone" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* City */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="city" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            city
                        </label>
                        <input id="city" type="text" defaultValue={formData?.city} className="form-input block" name="city" onChange={handleChange} />
                    </div>
                    {/* Neighbourhood */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="neighborhood" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            neighborhood
                        </label>
                        <input id="neighborhood" defaultValue={formData?.neighborhood} type="text" className="form-input block font-sans" name="neighborhood" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Zip code */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="zip_code" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            zip code
                        </label>
                        <input id="zip_code" type="text" defaultValue={formData?.zip_code} className="form-input block" name="zip_code" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Content Type */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                        <div className="flex-1">
                            {formData?.content_type &&
                                formData.content_type.map((c_type: string) => (
                                    <div className="mb-2" key={c_type}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.c_type} id="content_type" name="content_type" />
                                            <span className="font-sans capitalize text-white-dark">{c_type}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* VST */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">VST</label>
                        <div className="flex-1">
                            {formData?.vst &&
                                formData.vst.map((vst_item: string) => (
                                    <div className="mb-2" key={vst_item}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.vst_item} id="vst" name="vst" />
                                            <span className="font-sans capitalize text-white-dark">{vst_item}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Shoot availability */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">shoot availability</label>
                        <div className="flex-1">
                            {formData?.shoot_availability &&
                                formData.shoot_availability.map((available_shoot: string) => (
                                    <div className="mb-2" key={available_shoot}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.available_shoot} id="shoot_availability" name="shoot_availability" />
                                            <span className="font-sans capitalize text-white-dark">{available_shoot}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Add Equipment Specific */}

                    {/* Equipment Specific */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipment Specific</label>
                        <div className="flex-1">
                            {formData?.equipment_specific &&
                                formData.equipment_specific.map((equipment: string) => (
                                    <div className="mb-2" key={equipment}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.equipment} id="equipment_specific" name="equipment_specific" />
                                            <span className="font-sans capitalize text-white-dark">{equipment}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Last Beige Shoot */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="last_beige_shoot" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            last beige shoot
                        </label>
                        <input id="last_beige_shoot" type="text" defaultValue={formData?.last_beige_shoot} className="form-input block" name="last_beige_shoot" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Add Footage */}

                    {/* Backup Footage */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">backup footage</label>
                        <div className="flex-1">
                            {formData?.backup_footage &&
                                formData.backup_footage.map((footage: string) => (
                                    <div className="mb-2" key={footage}>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="form-checkbox" value={formData.footage} id="backup_footage" name="backup_footage" />
                                            <span className="font-sans text-white-dark">{footage}</span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Own Transportation Method */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="own_transportation_method" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            own transportation method
                        </label>
                        <select
                            className="form-select font-sans text-white-dark"
                            id="own_transportation_method"
                            defaultValue={formData.own_transportation_method}
                            name="own_transportation_method"
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    {/* Review Status */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="review_status" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            review status
                        </label>
                        <input id="review_status" type="text" defaultValue={formData?.review_status} className="form-input block capitalize" name="review_status" onChange={handleChange} />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end">
                    <button type="button" className="btn btn-dark font-sans">
                        <Link href={'/manager/allUsers'}>Back</Link> 
                    </button>
                    <button type="submit" className="btn btn-success font-sans ltr:ml-4 rtl:mr-4">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AllUserDetails;
