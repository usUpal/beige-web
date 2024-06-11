import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useDateFormat from '@/hooks/useDateFormat';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const CpDetails = () => {
    const [userModal, setUserModal] = useState(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [formData, setFormData] = useState<any | null>(null);

    const params = useParams();
    const dob = formData?.date_of_birth;
    const formattedDateTime = useDateFormat(dob);


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
                setShowError(true);
                setLoading(false);
            } else {
                // setUserInfo(userDetailsRes);
                setFormData(userDetailsRes);
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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        console.log('e.target:', name, value);

        setFormData((prevFormData: any) => {
            console.log('previousFormData:', prevFormData);

            // Checking For Duplicate Value
            if (Array.isArray(prevFormData[name]) && prevFormData[name].includes(value)) {
                // Deleting Duplicate Value
                const updatedArray = prevFormData[name].filter((item: any) => item !== value);
                const updatedFormData = {
                    ...prevFormData,
                    [name]: updatedArray,
                };
                console.log('Updated FormData:', updatedFormData);
                return updatedFormData;
            } else {
                const updatedFormData = {
                    ...prevFormData,
                    [name]: Array.isArray(prevFormData[name]) ? [...prevFormData[name], value] : value,
                };
                console.log('Updated FormData:', updatedFormData);
                return updatedFormData;
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
        // console.log('🚀 ~ file: index.tsx:178 ~ addHandler ~ inputName:', inputName);
        let val = e.target.value;

        insertNewData((prevData: any) => ({
            ...prevData,
            [inputName]: [val],
        }));
        return newData;
    };

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
            console.log(updateNew);

        } catch (error) {
            console.error(error);
        }
    };

    // -------------------------------->>> cp details edit works

    // formData?.equipment_specific
    const [equipmentSpecificExistingData, setEquipmentSpecificExistingData] = useState<any>([]);
    const [newEquipmentSpecific, setNewEquipmentSpecific] = useState('');
    const [addIconEquipmentSpecific, setAddIconEquipmentSpecific] = useState(true);
    const [showInputFieldEquipmentSpecific, setShowInputFieldEquipmentSpecific] = useState(false);

    // formData?.equipment
    const [equipmentExistingData, setEquipmentExistingData] = useState<any>([]);
    const [newEquipment, setNewEquipment] = useState('');
    const [addIconEquipment, setAddIconEquipment] = useState(true);
    const [showInputFieldEquipment, setShowInputFieldEquipment] = useState(false);
    // vst edit
    const [vstData, setVstData] = useState<any>([]);
    const [newVst, setNewVst] = useState('');
    const [addIconVst, setAddIconVst] = useState(true);
    const [showVstInputField, setShowVstInputField] = useState(false);

    // portfolio edit
    const [portfolioData, setPortfolioData] = useState<any>([]);
    const [newPortfolio, setNewPortfolio] = useState('');
    const [addIconPortfolio, setAddIconPortfolio] = useState(true);
    const [showPortfolioInputField, setShowPortfolioInputField] = useState(false);

    // shoot avalibility : formData?.shoot_availability
    const [shootAvailabilityExistingData, setShootAvailabilityExistingData] = useState<any>([]);
    const [newShootAvailability, setNewShootAvailability] = useState('');
    const [addIconShootAvailability, setAddIconShootAvailability] = useState(true);
    const [showInputFieldShootAvailability, setShowInputFieldShootAvailability] = useState(false);

    // formData?.backup_footage
    const [backupFootageExistingData, setBackupFootageExistingData] = useState<any>([]);
    const [newbackupFootage, setNewBackupFootage] = useState('');
    const [addIconBackupFootage, setAddIconBackupFootage] = useState(true);
    const [showInputFieldBackupFootage, setShowInputFieldBackupFootage] = useState(false);

    //  to load api array data form a state variable
    useEffect(() => {

        // Equipment
        const existingEquipment = formData?.equipment;
        setEquipmentExistingData(existingEquipment);

        // Equipment Specific
        const existingEquipmentSpecific = formData?.equipment_specific;
        setEquipmentSpecificExistingData(existingEquipmentSpecific);

        // vst
        const existingVstData = formData?.vst;
        setVstData(existingVstData);

        // for portfolio
        const existingPortfolioData = formData?.portfolio;
        setPortfolioData(existingPortfolioData);

        // Shoot Availability
        const existingShootAvailability = formData?.shoot_availability;
        setShootAvailabilityExistingData(existingShootAvailability);

        // backup footage
        const existingBackupFootage = formData?.backup_footage;
        setBackupFootageExistingData(existingBackupFootage);

    }, [formData?.equipment, formData?.equipment_specific, formData?.portfolio, formData?.vst, formData?.shoot_availability, formData?.backup_footage])

    // handle Vst Add -------------------->
    const handleVstAdd = () => {
        setShowVstInputField(!showVstInputField);
        setAddIconVst(!addIconVst);
        if (newVst) {
            // Check if the newVst already exists in the vstData array
            if (vstData.includes(newVst)) {
                console.log('No duplicate data');
            } else {
                // Add the newVst only if it's not a duplicate
                setVstData([...vstData, newVst]);
            }
        }
    }


    // handle addition to cp 
    const handleAdditionCpArrData = (newData: any, existingData: any, setArrItemStateFunction: any, showInputFieldStateVar: any, setInputFieldFunction: any, setIconFunction: any, iconStateVarriable: any) => {
        setInputFieldFunction(!showInputFieldStateVar);
        setIconFunction(!iconStateVarriable);
        if (newData) {
            if (existingData.includes(newData)) {
                console.log('No Duplicate Data Allowed.');
                return;
            }
            else {
                setArrItemStateFunction([...existingData, newData]);
            }
        }
    }

    // handleEquipment
    const handleEquipmentAddition = () => {
        handleAdditionCpArrData(newEquipment, equipmentExistingData, setEquipmentExistingData, showInputFieldEquipment, setShowInputFieldEquipment, setAddIconEquipment, addIconEquipment);
    }

    // handleEquipmentSpecific
    const handleEquipmentSpecificAddition = () => {
        handleAdditionCpArrData(newEquipmentSpecific, equipmentSpecificExistingData, setEquipmentSpecificExistingData, showInputFieldEquipmentSpecific, setShowInputFieldEquipmentSpecific, setAddIconEquipmentSpecific, addIconEquipmentSpecific);
    }

    // handlePortfolioAddition
    const handlePortfolioAddition = () => {
        handleAdditionCpArrData(newPortfolio, portfolioData, setPortfolioData, showPortfolioInputField, setShowPortfolioInputField, setAddIconPortfolio, addIconPortfolio);
    }
    // handleShootAvailability
    const handleShootAvailabilityAddition = () => {
        handleAdditionCpArrData(newShootAvailability, shootAvailabilityExistingData, setShootAvailabilityExistingData, showInputFieldShootAvailability, setShowInputFieldShootAvailability, setAddIconShootAvailability, addIconShootAvailability);
    }
    // handle Backup Footage Addition
    const handleBackupFootageAddition = () => {
        handleAdditionCpArrData(newbackupFootage, backupFootageExistingData, setBackupFootageExistingData, showInputFieldBackupFootage, setShowInputFieldBackupFootage, setAddIconBackupFootage, addIconBackupFootage);
    }



    // handle Main Dlt function 
    const handleDlt = (clickedItem: any, existingData: any, setStateFunction: any) => {
        const leftAfterDlt = existingData.filter((vstItem: any) => vstItem !== clickedItem)
        setStateFunction(leftAfterDlt);
    };

    // dlt for Equipment data
    const handleDltEquipment = (clickedItem: any) => {
        handleDlt(clickedItem, equipmentExistingData, setEquipmentExistingData);
    };
    // dlt for Equipment data
    const handleDltEquipmentSpecific = (clickedItem: any) => {
        handleDlt(clickedItem, equipmentSpecificExistingData, setEquipmentSpecificExistingData);
    };

    // dlt for vst data
    const handleDltVst = (clickedItem: any) => {
        handleDlt(clickedItem, vstData, setVstData);
    };
    // dlt for portfolio data
    const handleDltPortfolio = (clickedItem: any) => {
        handleDlt(clickedItem, portfolioData, setPortfolioData);
    };
    // dlt for portfolio data
    const handleDltShootAvailability = (clickedItem: any) => {
        handleDlt(clickedItem, shootAvailabilityExistingData, setShootAvailabilityExistingData);
    };
    // dlt for portfolio data
    const handleDltBackupFootage = (clickedItem: any) => {
        handleDlt(clickedItem, backupFootageExistingData, setBackupFootageExistingData);
    };


    const handleAddConfirmBtn = () => {

        // equipment
        if (newEquipment.trim() !== '') {
            if (equipmentExistingData.includes(newEquipment)) {
                console.log('No duplicate data');
            } else {
                setEquipmentExistingData([...equipmentExistingData, newEquipment]);
            }
            setNewEquipment('');
            // setShowEquipmentInputField(false);
        }

        // equipment Specific
        if (newEquipmentSpecific.trim() !== '') {
            if (equipmentSpecificExistingData.includes(newEquipmentSpecific)) {
                console.log('No duplicate data');
            } else {
                setEquipmentSpecificExistingData([...equipmentSpecificExistingData, newEquipmentSpecific]);
            }
            setNewEquipmentSpecific('');
            // setShowEquipmentSpecificInputField(false);
        }

        // vst
        if (newVst.trim() !== '') {
            if (vstData.includes(newVst)) {
                console.log('No duplicate data');
            } else {
                setVstData([...vstData, newVst]);
            }
            setNewVst('');
            // setShowVstInputField(false);
        };

        // portfolio
        if (newPortfolio.trim() !== '') {
            if (portfolioData.includes(newPortfolio)) {
                console.log('No duplicate data');
            } else {
                setPortfolioData([...portfolioData, newPortfolio]);
            }
            setNewPortfolio('');
            // setShowPortfolioInputField(false);
        }

        // shoot avavility
        if (newShootAvailability.trim() !== '') {
            if (shootAvailabilityExistingData.includes(newShootAvailability)) {
                console.log('No duplicate data');
            } else {
                setShootAvailabilityExistingData([...shootAvailabilityExistingData, newShootAvailability]);
            }
            setNewShootAvailability('');
            // setShowPortfolioInputField(false);
        }
        // backup Footage
        if (newbackupFootage.trim() !== '') {
            if (backupFootageExistingData.includes(newbackupFootage)) {
                console.log('No duplicate data');
            } else {
                setBackupFootageExistingData([...backupFootageExistingData, newbackupFootage]);
            }
            setNewBackupFootage('');
            // setShowPortfolioInputField(false);
        }
    }


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
                    {/* test  */}
                    {/* test  */}
                </div>

                <div className="flex items-center justify-between">
                    {/* Successful Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="successful_beige_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Successful Shoots
                        </label>
                        <input id="successful_beige_shoots" type="number" defaultValue={formData?.successful_beige_shoots} className="form-input bg-gray-200" name="successful_beige_shoots" onChange={handleChange} disabled />
                    </div>
                    {/* Trust Score */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            trust score
                        </label>
                        <input id="trust_score" type="number" defaultValue={formData?.trust_score} className="form-input bg-gray-200" name="trust_score" onChange={handleChange} disabled />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* References */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="reference" className="mt-2 mb-0 font-sans text-[14px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Reference
                        </label>
                        <input id="reference" type="text" placeholder="John Doe" defaultValue={formData?.reference} className="form-input capitalize" name="reference" onChange={handleChange} />
                    </div>
                    {/* Average Rating */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="trust_score" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            average rating
                        </label>
                        <input id="average_rating" type="number" defaultValue={formData?.average_rating} className="form-input bg-gray-200" name="average_rating" onChange={handleChange} disabled />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {/* Avg Res Time */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="avg_response_time" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            avg response time
                        </label>
                        <input id="avg_response_time" type="number" defaultValue={formData?.avg_response_time} className="form-input block bg-gray-200" name="avg_response_time" onChange={handleChange} disabled />
                    </div>
                    {/* Total Earnings */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="total_earnings" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            total earnings ($)
                        </label>
                        <input id="total_earnings" type="number" defaultValue={formData?.total_earnings} className="form-input bg-gray-200" name="total_earnings" onChange={handleChange} disabled />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    {/* Equipement */}
                    <div className="basis-[45%] shootAvailability">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipement </label>
                            <div className="flex-1">
                                <div>
                                    {equipmentExistingData && equipmentExistingData.map((equipment_item: string, index: any) => (
                                        // Equipement Existing Data
                                        <div className="mb-2" key={`${equipment_item}_${index}`}>
                                            <ul className="flex items-center list-disc">
                                                <li className="mr-2 text-white-dark">
                                                    <span className="font-sans capitalize text-white-dark">{equipment_item}</span>
                                                </li>
                                                <li className='list-none'>
                                                    <span onClick={() => handleDltEquipment(equipment_item)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {/* add btn and input field */}
                                <div className='flex justify-start items-center'>

                                    <div onClick={handleEquipmentAddition} className="btn border-none p-0 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        <span>{addIconEquipment ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}</span>
                                    </div>

                                    {showInputFieldEquipment &&
                                        <div className="relative ml-2">
                                            <input type="text" className="py-1 x-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-0 right-0   text-white mr-1 py-1 rounded ml-2">{allSvgs.plusForAddCp}</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ends Equipment<---------------------------------------------------------------- */}

                    {/* equipment specificaion */}
                    {/* <div className="flex basis-[45%] flex-col sm:flex-row">
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
                    </div> */}

                    {/* Equipement Specific */}
                    <div className="basis-[45%]">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Equipement Specific </label>
                            <div className="flex-1">
                                <div>
                                    {equipmentSpecificExistingData && equipmentSpecificExistingData.map((equipmentSpecific_item: string, index: any) => (
                                        // Equipement Existing Data
                                        <div className="mb-2" key={`${equipmentSpecific_item}_${index}`}>
                                            <ul className="flex items-center list-disc">
                                                <li className="mr-2 text-white-dark">
                                                    <span className="font-sans capitalize text-white-dark">{equipmentSpecific_item}</span>
                                                </li>
                                                <li className='list-none'>
                                                    <span onClick={() => handleDltEquipmentSpecific(equipmentSpecific_item)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {/* add btn and input field */}
                                <div className='flex justify-start items-center'>

                                    <div onClick={handleEquipmentSpecificAddition} className="btn border-none p-0 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        <span>{addIconEquipmentSpecific ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}</span>
                                    </div>

                                    {showInputFieldEquipmentSpecific &&
                                        <div className="relative ml-2">
                                            <input type="text" className="py-1 x-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newEquipmentSpecific} onChange={(e) => setNewEquipmentSpecific(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-0 right-0   text-white mr-1 py-1 rounded ml-2">{allSvgs.plusForAddCp}</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ends Equipment Specific<---------------------------------------------------------------- */}
                </div>



                {/* rate and rate related */}
                <div className="flex items-center justify-between ">
                    {/* rate */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="initiative" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            rate
                        </label>
                        <input id="rate" type="text" defaultValue={(formData?.rate)} className="form-input block" name="rate" onChange={handleChange} />
                    </div>

                    {/* Rate Flexibility */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="rateFlexibility" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            rate Flexibility
                        </label>
                        <select className="form-select font-sans capitalize text-white-dark" id="rateFlexibility" defaultValue={formData?.rateFlexibility} name="rateFlexibility" onChange={handleChange}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
                {/* rate and rate related */}

                <div className="flex items-center justify-between">
                    {/* Travel to distant */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="travel_to_distant_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            travel to distant shoots
                        </label>
                        <select
                            className="form-select font-sans capitalize text-white-dark"
                            id="travel_to_distant_shoots"
                            defaultValue={formData?.travel_to_distant_shoots}
                            name="travel_to_distant_shoots"
                            onChange={handleChange}
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
                            id="avg_response_time_to_new_shoot_inquiry"
                            type="number"
                            defaultValue={formData?.avg_response_time_to_new_shoot_inquiry}
                            className="form-input block font-sans bg-gray-200"
                            name="avg_response_time_to_new_shoot_inquiry"
                            onChange={handleChange}
                            disabled
                        />
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
                            defaultValue={formData?.experience_with_post_production_edit}
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
                            defaultValue={formData?.customer_service_skills_experience}
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
                        <label htmlFor="team_player" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            team player
                        </label>
                        <select className="form-select font-sans capitalize text-white-dark" id="team_player" defaultValue={formData?.team_player} name="team_player" onChange={handleChange}>
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
                            id="handle_co_worker_conflicts"
                            type="text"
                            defaultValue={formData?.handle_co_worker_conflicts}
                            className="form-input block font-sans "
                            name="handle_co_worker_conflicts"
                            onChange={handleChange}
                        // disabled
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* Num Declined Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_declined_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            declined shoots
                        </label>
                        <input id="num_declined_shoots" type="number" defaultValue={formData?.num_declined_shoots} className="form-input block bg-gray-200" name="num_declined_shoots" onChange={handleChange} disabled />
                    </div>
                    {/* Num accepted Shoots */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="num_accepted_shoots" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            accepted shoots
                        </label>
                        <input id="num_accepted_shoots" type="number" defaultValue={formData?.num_accepted_shoots} className="form-input block bg-gray-200" name="num_accepted_shoots" onChange={handleChange} disabled />
                    </div>
                </div>



                <div className="flex items-center justify-between">
                    {/* initiative */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="initiative" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            initiative
                        </label>
                        <input id="initiative" type="text" defaultValue={formData?.initiative} className="form-input block" name="initiative" onChange={handleChange} />
                    </div>

                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="additional_info" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            additional info
                        </label>
                        <input
                            id="additional_info"
                            type="text"
                            defaultValue={formData?.additional_info}
                            className="form-input block font-sans "
                            name="additional_info"
                            onChange={handleChange}
                        // disabled
                        />
                    </div>

                </div>

                <div className="flex items-center justify-between">
                    {/* Timezone */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="timezone" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            timezone
                        </label>
                        <input id="timezone" type="text" defaultValue={formData?.timezone} className="form-input block" name="timezone" onChange={handleChange} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* City */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="city" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            city
                        </label>
                        <input id="city" type="text" defaultValue={formData?.city} className="form-input block" name="city" onChange={handleChange} />
                    </div>

                    {/* Neighbourhood */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="neighborhood" className=" mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            neighborhood
                        </label>
                        <input id="neighborhood" defaultValue={(formData?.neighborhood)} type="text" className="form-input block font-sans" name="neighborhood" onChange={handleChange} />
                    </div>
                </div>


                <div className="flex items-center justify-between">
                    {/* Zip code */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="zip_code" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            zip code
                        </label>
                        <input id="zip_code" type="text" defaultValue={formData?.zip_code} className="form-input block" name="zip_code" onChange={handleChange} />
                    </div>
                    {/* in work pressure */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="inwork_pressure" className="mb-0 mt-2 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            In Work Pressure
                        </label>
                        <input id="inwork_pressure" type="text" defaultValue={formData?.inWorkPressure} className="form-input block" name="inwork_pressure" onChange={handleChange} />
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
                    {/*----------- vst show starts */}
                    <div className="basis-[45%]">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">VST</label>
                            <div className="flex-1">
                                <div>
                                    {vstData && vstData.map((vst_item: string, index: any) => (
                                        <div className="mb-2" key={`${vst_item}_${index}`}>
                                            <ul className="flex items-center list-disc">
                                                <li className="mr-2 text-white-dark">
                                                    <span className="font-sans capitalize text-white-dark">{vst_item}</span>
                                                </li>
                                                <li className='list-none'>
                                                    <span onClick={() => handleDltVst(vst_item)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {/* add btn and input field */}
                                <div className='flex justify-start items-center mt-2'>
                                    <div onClick={handleVstAdd} className="btn border-none p-0 mt-3 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        <span>{addIconVst ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}</span>
                                    </div>
                                    {showVstInputField &&
                                        <div className="relative ml-2">
                                            <input type="text" className="py-1 x-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newVst} onChange={(e) => setNewVst(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-0 right-0   text-white mr-1 py-1 rounded ml-2">{allSvgs.plusForAddCp}</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ---------------- vst show ends*/}

                </div>


                <div className="flex items-center justify-between container-section ">
                    {/* Shoot availability */}
                    <div className="basis-[45%] shootAvailability">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">shoot <br />availability</label>
                            <div className="flex-1">
                                <div>
                                    {shootAvailabilityExistingData && shootAvailabilityExistingData.map((shootAvailability_item: string, index: any) => (
                                        // shoot Availability ExistingData
                                        <div className="mb-2" key={`${shootAvailability_item}_${index}`}>
                                            <ul className="flex items-center list-disc">
                                                <li className="mr-2 text-white-dark">
                                                    <span className="font-sans capitalize text-white-dark">{shootAvailability_item}</span>
                                                </li>
                                                <li className='list-none'>
                                                    <span onClick={() => handleDltShootAvailability(shootAvailability_item)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {/* add btn and input field */}
                                <div className='flex justify-start items-center'>

                                    <div onClick={handleShootAvailabilityAddition} className="btn border-none p-0 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        <span>{addIconShootAvailability ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}</span>
                                    </div>

                                    {showInputFieldShootAvailability &&
                                        <div className="relative ml-2">
                                            <input type="text" className="py-1 x-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newShootAvailability} onChange={(e) => setNewShootAvailability(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-0 right-0   text-white mr-1 py-1 rounded ml-2">{allSvgs.plusForAddCp}</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ends <---------------------------------------------------------------- */}
                    {/* ends <---------------------------------------------------------------- */}
                    {/* ends <---------------------------------------------------------------- */}
                    {/* ends <---------------------------------------------------------------- */}
                    {/* ends <---------------------------------------------------------------- */}

                    {/*  Portfolio */}
                    <div className="basis-[45%] portfolio">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Portfolio</label>
                            <div className="flex-1">
                                <div>
                                    {portfolioData &&
                                        portfolioData.map((portfolioItem: string) => (
                                            <div className="mb-2" key={portfolioItem}>
                                                <ul className="flex items-center list-disc">
                                                    <li className="mr-2 text-white-dark">
                                                        <span className="font-sans capitalize text-white-dark">{portfolioItem}</span>
                                                    </li>
                                                    <li className='list-none'>
                                                        <span onClick={() => handleDltPortfolio(portfolioItem)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* add btn and input field */}
                                <div className='flex flex-col justify-start items-start'>
                                    {showPortfolioInputField &&
                                        <div className="relative">
                                            <textarea className="py-1 px-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newPortfolio} onChange={(e) => setNewPortfolio(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-30 pt-2 pr-2 right-0  text-white py-1 rounded"><span className='bg-gray-500'>
                                                {allSvgs.plusForAddCp}</span></button>
                                        </div>
                                    }

                                    <div onClick={handlePortfolioAddition} className="btn border-none p-0 mt-1 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        {addIconPortfolio ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* Add Footage */}

                    {/* Backup Footage starts */}
                    <div className="basis-[45%]">
                        <div className="flex basis-[100%]">
                            <label className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">backup <br /> footage</label>
                            <div className="flex-1">
                                <div>
                                    {backupFootageExistingData && backupFootageExistingData.map((backupFootage_item: string, index: any) => (
                                        // backupFootageExistingData
                                        <div className="mb-2" key={`${backupFootage_item}_${index}`}>
                                            <ul className="flex items-center list-disc">
                                                <li className="mr-2 text-white-dark">
                                                    <span className="font-sans capitalize text-white-dark">{backupFootage_item}</span>
                                                </li>
                                                <li className='list-none'>
                                                    <span onClick={() => handleDltBackupFootage(backupFootage_item)} className="btn w-4 text-bold text-white-dark p-0 font-sans cursor-pointer ml-5 md:me-0"> {allSvgs.closeModalSvg}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                {/* add btn and input field */}
                                <div className='flex justify-start items-center'>

                                    <div onClick={handleBackupFootageAddition} className="btn border-none p-0 pb-2 font-sans cursor-pointer text-white md:me-0">
                                        <span>{addIconBackupFootage ? (allSvgs.plusForAddCp) : (allSvgs.minusForHide)}</span>
                                    </div>

                                    {showInputFieldBackupFootage &&
                                        <div className="relative ml-2">
                                            <input type="text" className="py-1 x-2 rounded border border-gray-200 focus:outline-none focus:border-gray-400" value={newbackupFootage} onChange={(e) => setNewBackupFootage(e.target.value)} />

                                            <button onClick={handleAddConfirmBtn} className="absolute inset-y-0 right-0   text-white mr-1 py-1 rounded ml-2">{allSvgs.plusForAddCp}</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ends <-- */}

                    {/* Own Transportation Method */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="own_transportation_method" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            own transportation method
                        </label>
                        <select
                            className="form-select font-sans text-white-dark"
                            id="own_transportation_method"
                            defaultValue={formData?.own_transportation_method}
                            name="own_transportation_method"
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* DOB || AGE */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="own_transportation_method" className="mt-2 mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                            Date Of Birth
                        </label>

                        <input
                            className="form-select font-sans text-white-dark bg-gray-200"
                            id="own_transportation_method"
                            defaultValue={formattedDateTime?.date}
                            type='text'
                            name="own_transportation_method"
                            onChange={handleChange}
                            disabled

                        />

                    </div>
                    {/* Review Status */}
                    <div className="flex basis-[45%] flex-col sm:flex-row">
                        <label htmlFor="review_status" className="mb-0 font-sans text-[14px] capitalize rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 ">
                            review status
                        </label>
                        <input id="review_status" type="text" defaultValue={formData?.review_status} className="form-input block capitalize bg-gray-200" name="review_status" onChange={handleChange} disabled />
                    </div>
                </div>

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
