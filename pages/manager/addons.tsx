import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useForm } from 'react-hook-form';
import useAddons from '@/hooks/useAddons';

const Addons = () => {

    // const [addonsData, setAddonsData] = useState<addonTypes[]>([]);
    const [addonsData, setAddonsData] = useAddons();

    const [addonsInfo, setAddonsInfo] = useState<any | null>(null);
    const [addonsModal, setAddonsModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [showDesignElement, setShowDesignElement] = useState({
        showNewCategoryInput: false,
    });
    const [allCategory, setAllCategory] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    useEffect(() => {
        const handleFilterCategory = () => {
            if (addonsData) {
                const uniqueCategories = addonsData
                    ?.map((addon: any) => addon.category)
                    ?.filter((category: string, index: any, array: any) => array.indexOf(category) === index);
                console.log('Unique Categories:', uniqueCategories);
                setAllCategory(uniqueCategories);
            }
        };

        handleFilterCategory();

    }, [addonsData]);

    // add category to the allcategory
    const handleAddCategory = () => {

        if (newCategory.trim() !== '') {
            allCategory.push(newCategory);
            setNewCategory('');
        }
        showDesignElement.showNewCategoryInput = false;
        console.log(newCategory, allCategory);
    }

    // setAddonsAddBtnModal
    const [addonsAddBtnModal, setAddonsAddBtnModal] = useState(false);

    /* useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_ENDPOINT}addOns`);
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const jsonData = await res.json();
                setAddonsData(jsonData);
            } catch (error) {
                console.error(`Error fetching data`);
            }
        };

        fetchData();
    }, []);
 */

    // theme functionality
    useEffect(() => {
        dispatch(setPageTitle('Pricing Calculator - Client Web App - Beige'));
    });

    const getAddonsDetails = async (addon: any) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}addons/${addon?._id}`);
            const addonsDetailsRes = await response.json();

            if (!addonsDetailsRes) {
                setLoading(false);
            } else {
                setAddonsModal(!addonsModal);
                setAddonsInfo(addonsDetailsRes);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (key: any, value: any) => {
        setAddonsInfo({
            ...addonsInfo,
            [key]: value
        });
    }


    //    update addons
    const onSubmit = async (data: any) => {
        const updatedAddonDetails = {
            title: addonsInfo?.title || data?.title,
            rate: addonsInfo?.rate || data?.rate,
            ExtendRate: addonsInfo?.ExtendRate || data?.ExtendRate,
            ExtendRateType: addonsInfo?.ExtendRateType || data?.ExtendRateType,
            status: addonsInfo?.status || data?.status || false,
        };
        console.log("Updated Addon Details:", updatedAddonDetails);

        try {
            // const addonsId = addonsInfo?._id;
            const patchResponse = await fetch(`${API_ENDPOINT}addons/${addonsInfo?._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAddonDetails)
            });

            if (!patchResponse.ok) {
                throw new Error("Failed to patch data");
            }

            const updatedAddon = await patchResponse.json(); //

            const updatedAddonsData = addonsData.map((addon: any) =>
                addon._id === addonsInfo?._id ? updatedAddon : addon
            );
            setAddonsData(updatedAddonsData);

            setAddonsModal(false);
        } catch (error) {
            console.error('Patch error:', error);
        }
    };

    // add new addons
    const handleFormSubmit = async (data: any) => {
        const newAddonsData = {
            title: data?.title,
            category: data?.category,
            rate: data?.rate,
            ExtendRate: data?.ExtendRate,
            ExtendRateType: data?.ExtendRateType,
            status: data?.status || false,
        };
        try {
            setLoading(true);
            const response = await fetch(`${API_ENDPOINT}addons`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAddonsData),
            });

            if (!response.ok) {
                throw new Error("Response: Failed to add new addon.")
            }
            const responseData = await response.json();

            console.log('Addon successfully added:', responseData);
            // console.log("🚀 ~ handleFormSubmit ~ newAddonsData:", newAddonsData);
            addonsData.push(newAddonsData);

        } catch (error) {
            setLoading(false);
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
            setAddonsAddBtnModal(false);
            reset();
        }

        console.log(newAddonsData);

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
                    <span>Addons </span>
                </li>
            </ul>

            <div className="mb-5">
                {/* buttons for adds ends*/}
                <div className="panel" id="pills_with_icon">
                    {/* tab starts*/}

                    <div className="mx-3 mb-5 sm:mb-0">
                        <button
                            onClick={() => setAddonsAddBtnModal(!addonsAddBtnModal)}
                            className={`text-[13px] h-10 w-24 flex flex-col items-center justify-center rounded-lg  px-2 py-3 text-black btn btn-outline-dark hover:text-white capitalize font-bold }`}
                        >
                            add new
                        </button>
                    </div>

                    <div className="my-5 flex flex-col sm:flex-row">
                        <Tab.Group>
                            <div className="mx-3 mb-5 sm:mb-0">
                                <Tab.List className="mb-5 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-center w-44 flex-col">
                                    {allCategory.map((category, index) => (
                                        <Tab key={index}>
                                            {({ selected }) => (

                                                <button
                                                    className={`text-[13px] h-12 w-44 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] px-2 py-3 hover:bg-success hover:text-white hover:shadow-[0px 5px 15px 0px rgba(0,0,0,0.30)] dark:bg-[#191e3a] capitalize ${selected ? 'bg-success text-white outline-none' : ''}`}
                                                    title={category}
                                                >
                                                    {category}
                                                </button>
                                            )}
                                        </Tab>
                                    ))}
                                </Tab.List>
                            </div>

                            <div className='ms-4 w-full'>
                                <Tab.Panels>
                                    {allCategory?.map((category, index) => (
                                        <Tab.Panel key={index}>
                                            <div className="active">
                                                <div className="table-responsive mb-5">
                                                    <table className='w-full'>
                                                        <thead>
                                                            <tr>
                                                                <th className="font-mono">Title</th>
                                                                <th className="font-mono">Rate</th>
                                                                <th className="font-mono">Extend Rate Type</th>
                                                                <th className="font-mono">Extend Rate</th>
                                                                <th className="font-mono">Status</th>
                                                                <th className="font-mono">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {addonsData
                                                                ?.filter((filteredAddon: any) => filteredAddon.category === category)
                                                                .map((addon: any, index) => (
                                                                    <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                                                        <td className="min-w-[150px] font-sans text-black dark:text-white">
                                                                            <p className="flex items-start flex-col">
                                                                                {addon.title}
                                                                            </p>
                                                                        </td>
                                                                        <td className="min-w-[150px] font-sans text-black dark:text-white">
                                                                            <p className="flex items-start flex-col">
                                                                                {addon?.rate}
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            <p className="flex items-start flex-col">
                                                                                {addon?.ExtendRateType ? addon?.ExtendRateType : "n/a"}
                                                                            </p>
                                                                        </td>
                                                                        <td>
                                                                            <p className="flex items-start flex-col">
                                                                                {addon?.ExtendRate ? addon?.ExtendRate : 0}
                                                                            </p>
                                                                        </td>
                                                                        <td className="font-sans text-gray-600">
                                                                            <p className="flex items-start flex-col ">
                                                                                {addon?.status >= 1 ? <span className="badge w-12 bg-success text-[10px] text-center">Active</span> : <span className="badge bg-warning text-[10px] w-12 text-center">Inactive</span>}
                                                                            </p>
                                                                        </td>

                                                                        <td>
                                                                            <button onClick={() => {
                                                                                getAddonsDetails(addon);
                                                                                setAddonsModal(true);
                                                                            }}>
                                                                                {allSvgs.pencilIconForEdit}
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab.Panel>
                                    ))}

                                </Tab.Panels>
                            </div>
                        </Tab.Group>
                    </div>
                </div>
            </div>

            {/* modal for add button starts */}
            <Transition appear show={addonsModal} as={Fragment}>
                <Dialog as="div" open={addonsModal} onClose={() => setAddonsModal(false)}>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center md:px-4 ">
                            <Dialog.Panel as="div" className="panel my-24 md:w-2/5  overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark space-x-6 md:px-0 px-8">

                                <div className="flex my-2 items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                                    <button type="button" className="text-white-dark hover:text-dark me-4 text-[16px]" onClick={() => setAddonsModal(false)}>
                                        {allSvgs.closeModalSvg}
                                    </button>
                                </div>

                                <div className="basis-[50%]">
                                    <h2 className=" text-[22px] font-bold capitalize leading-[28.6px] text-[#ACA686]">Addons Details </h2>
                                    <div className={`justify-between pb-6 w-11/12`}>
                                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                                            <div className=" flex flex-col md:flex-row md:flex md:justify-between mt-3 ">
                                                <p className='flex flex-col'>
                                                    <span className='text-[14px] font-light leading-none capitalize text-[#000000] '>
                                                        Title
                                                    </span>
                                                    <input
                                                        {...register("title")}
                                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                                        value={addonsInfo?.title || ""}
                                                        className={` bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 text-[13px] border-gray-300 md:w-72 w-64`}
                                                        defaultValue={addonsInfo?.title}
                                                    />
                                                </p>

                                                <div className="flex flex-col mt-3 md:mt-0">
                                                    <span className='text-[14px] font-light leading-none capitalize text-[#000000]'>
                                                        Status
                                                    </span>
                                                    <select
                                                        {...register("status")}
                                                        className="bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 w-28 text-[13px] border-gray-300"
                                                        value={addonsInfo?.status || ""}
                                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                                    >
                                                        <option value={1}>Active</option>
                                                        <option value={0}>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex md:flex-row justify-between md:mt-3">
                                                {addonsInfo?.ExtendRate &&
                                                    <div className="flex flex-col mt-3 md:mt-0">
                                                        <span className='text-[14px] font-light leading-none capitalize text-[#000000]'>
                                                            Extend Rate
                                                        </span>

                                                        <input
                                                            {...register("ExtendRate")}
                                                            onChange={(e) => handleInputChange('ExtendRate', e.target.value)}
                                                            value={addonsInfo?.ExtendRate || 0}
                                                            className={` bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 text-[13px] border-gray-300 md:w-72 w-64`}
                                                        />
                                                    </div>
                                                }

                                                {addonsInfo?.ExtendRateType &&
                                                    <p className=' flex flex-col mt-3 md:mt-0'>
                                                        <span className='text-[14px] font-light leading-none capitalize text-[#000000]'> Extend Rate Type
                                                        </span>
                                                        <select
                                                            {...register("ExtendRateType")}
                                                            className="bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 w-full text-[13px] border-gray-300 capitalize"
                                                            value={addonsInfo?.ExtendRateType || ""}
                                                            onChange={(e) => handleInputChange('ExtendRateType', e.target.value)}
                                                        >
                                                            <option className='capitalize' value="n/a">n/a</option>
                                                            <option className='capitalize' value="day">day</option>
                                                            <option className='capitalize' value="hourly">Hourly</option>
                                                        </select>
                                                    </p>
                                                }
                                            </div>

                                            <div className="flex flex-col md:flex md:flex-row justify-between mt-3">
                                                <div className="flex flex-col mt-3 md:mt-0">
                                                    <span className='text-[14px] font-light leading-none capitalize text-[#000000]'>
                                                        Rate
                                                    </span>

                                                    <input
                                                        {...register("rate")}
                                                        onChange={(e) => handleInputChange('rate', e.target.value)}
                                                        value={addonsInfo?.rate || 0}
                                                        className={` bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 text-[13px] border-gray-300 md:w-72 w-64`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-8 md:mt-0" >
                                                <button
                                                    type='submit'
                                                    className='btn btn-outline-dark h-10 w-28 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l'
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* add addons modal starts */}
            <Transition appear show={addonsAddBtnModal} as={Fragment}>
                <Dialog as="div" open={addonsAddBtnModal} onClose={() => setAddonsAddBtnModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel as="div" className="panel my-8 w-full md:w-6/12 2xl:w-5/12 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                {/* max-w-lg */}
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">Add Addons</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setAddonsAddBtnModal(false)}>
                                        {allSvgs.closeModalSvg}
                                    </button>
                                </div>

                                <div className='w-full ms-5 mx-auto'>
                                    <p className='text-[12px] mt-1 flex justify-start my-1 '>
                                        {showDesignElement.showNewCategoryInput ?
                                            <>
                                                Select from existings?
                                                <span
                                                    // setShowDesignElement
                                                    onClick={() => setShowDesignElement(prevState => ({
                                                        ...prevState,
                                                        showNewCategoryInput: !prevState?.showNewCategoryInput
                                                    }))}
                                                    className='text-[12px] text-blue-500 ms-2 cursor-pointer hover:bg-slate-300'
                                                >
                                                    select
                                                </span>
                                            </>
                                            :
                                            <>
                                                Create new categories?
                                                <span
                                                    // setShowDesignElement
                                                    onClick={() => setShowDesignElement(prevState => ({
                                                        ...prevState,
                                                        showNewCategoryInput: !prevState?.showNewCategoryInput
                                                    }))}
                                                    className='text-[12px] text-blue-500 ms-2 cursor-pointer hover:bg-slate-300'
                                                >
                                                    Create
                                                </span>
                                            </>
                                        }
                                    </p>
                                    {/* add addons form */}
                                    <form className="space-y-2 dark:text-white pb-5 w-11/12" onSubmit={handleSubmit(handleFormSubmit)}>
                                        {!showDesignElement.showNewCategoryInput &&
                                            <div className='rounded'>
                                                <label htmlFor="category" className="text-[#0E1726] mb-1">
                                                    Select Category
                                                </label>
                                                <select {...register('category', { required: "Please Select a Category" })} id="category" className='w-64 form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] md:w80 capitalize'>
                                                    <option className=' capitalize text-primary' value="">select form here
                                                    </option>
                                                    {
                                                        allCategory.map((category, index) => (
                                                            <option
                                                                value={category}
                                                                key={index}
                                                                className='capitalize'
                                                            >{category}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <span>
                                                    {errors.category && <p className='text-[12px] text-red-500'>{errors?.category?.message}</p>}
                                                </span>
                                            </div>
                                        }
                                        <div>
                                            {showDesignElement.showNewCategoryInput &&
                                                <div className='rounded-md '>
                                                    <label htmlFor="new_category" className="text-[#0E1726] mb-1 capitalize">
                                                        Create New category
                                                    </label>

                                                    <div className="">
                                                        <div className="flex">
                                                            <input
                                                                {...register('category')}
                                                                id="new_category" type="text"
                                                                placeholder="Create Category"
                                                                className="form-input ltr:rounded-r-none rtl:rounded-l-none md:w-64"
                                                            />
                                                            <div
                                                                className='flex justify-center items-center  ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b] cursor-pointer hover:bg-gray-200 duration-500'
                                                                onClick={handleAddCategory}
                                                            >
                                                                {allSvgs?.roundedPlusIconMd}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                        <div className='flex flex-col md:flex-row justify-between items-center md:gap-3'>
                                            <div>
                                                <label htmlFor="title" className="text-[#0E1726] mb-1">
                                                    Title
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <input {...register('title', { required: 'Title is required.' })} id="title" type="text" placeholder="Enter AddOns Title" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] md:w80 w-64" />
                                                    <span>
                                                        {errors.title && <p className='text-[12px] text-red-500'>{errors?.title?.message}</p>}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="Rate" className="text-[#0E1726] mb-[1px]">
                                                    Rate
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <input {...register('rate')} id="Rate" type="number" placeholder="Enter Rate" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] md:w80 w-64" />
                                                </div>
                                            </div>
                                        </div>


                                        <div className='flex flex-col md:flex-row justify-between items-center'>
                                            <div>
                                                <label htmlFor="ExtendRate" className="text-[#0E1726] mb-1">
                                                    Extend Rate
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <input {...register('ExtendRate')}
                                                        id="ExtendRate"
                                                        type="number"
                                                        placeholder="Enter Extend Rate"
                                                        className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] w-64 md:w80" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="ExtendRateType" className="text-[#0E1726] mb-1 ">
                                                    Extend Rate Type
                                                </label>
                                                <select {...register('ExtendRateType')} id="ExtendRateType" className='form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] w-64 md:w80'>
                                                    <option value="hourly">Hourly</option>
                                                    <option value="day">Day</option>
                                                    <option value="n/a">N/A</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-center">
                                            <div>
                                                <label htmlFor="info" className="text-[#0E1726]">
                                                    Info (optional)
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <input {...register('info')} id="info" type="text" placeholder="Enter AddOns Info" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] md:w80 w-64" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="status" className="text-[#0E1726] mb-1 ">
                                                    Status
                                                </label>
                                                <select {...register('status')} id="status" className='ps-3 form-input  placeholder:text-white-dark focus:border-[#E7D4BC] md:w80 w-64 '>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
                                        </div>


                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="btn !mt-8 w-36 border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l"
                                            >
                                                {isLoading ? (
                                                    <span role="status" className="flex h-5 items-center space-x-2">
                                                        Loading...
                                                    </span>
                                                ) : (
                                                    'Add Addons'
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* add addons modal ends */}
        </div>
    );
}
export default Addons;
