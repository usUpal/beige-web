import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Loader from '@/components/SharedComponent/Loader';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useForm } from 'react-hook-form';

const Addons = () => {

    const [addonsData, setAddonsData] = useState<addonTypes[]>([]); 
    const [addonsInfo, setAddonsInfo] = useState<any | null>(null);
    const [addonsModal, setAddonsModal] = useState(false);
    const [isLoading, setLoading] = useState(false);



    useEffect(() => {
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

    const dispatch = useDispatch();
    // theme functionality
    useEffect(() => {
        dispatch(setPageTitle('Pricing Calculator - Client Web App - Beige'));
    });

    // categories
    const categories = [
        "Wedding Photography",
        "Commercial Video",
        "Music Video",
        "Corporate Event Videography",
        "Corporate Photography",
        "Private Videography",
        "Other Photography"
    ];

    // console.log("🚀 ~ Addons ~ addonsInfo:", addonsInfo);

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

    const { register, handleSubmit } = useForm();

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

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-warning hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Addons Calculation</span>
                </li>
            </ul>

            <div className="panel mt-5" id="pills_with_icon">

                <div className="mb-5">
                    <div className="panel mt-5" id="pills_with_icon">
                        {/* tab starts*/}
                        <div className="mb-5 flex flex-col sm:flex-row">
                            <Tab.Group>
                                <div className="mx-3 mb-5 sm:mb-0">
                                    <Tab.List className="mb-5 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-center w-32 flex-col">
                                        {categories.map((category, index) => (
                                            <Tab key={index}>
                                                {({ selected }) => (
                                                    <button
                                                        className={`text-[13px] h-12 w-36 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] px-2 py-3 hover:bg-success hover:text-white hover:shadow-[0px 5px 15px 0px rgba(0,0,0,0.30)] dark:bg-[#191e3a] ${selected ? 'bg-success text-white outline-none' : ''}`}
                                                        title={category}
                                                    >
                                                        {category}
                                                    </button>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>

                                <div className='ms-4'>
                                    <Tab.Panels>
                                        {categories?.map((category, index) => (

                                            <Tab.Panel key={index}>
                                                <div className="active">
                                                    <div className="table-responsive mb-5">
                                                        <p className='font-bold text-xl text-slate-600'>{category}</p>
                                                        <table>
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
                                                                                <p className="flex items-start flex-col">
                                                                                    {addon?.status >= 0 ? "active" : "inactive"}
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
                                                    {/*  */}
                                                </div>
                                            </Tab.Panel>

                                        ))}


                                    </Tab.Panels>
                                </div>
                            </Tab.Group>

                        </div>
                        {/* tab ends */}
                    </div >
                </div>

                {/* modal for add button starts */}
                <Transition appear show={addonsModal} as={Fragment}>
                    <Dialog as="div" open={addonsModal} onClose={() => setAddonsModal(false)}>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center md:px-4 ">
                                <Dialog.Panel as="div" className="panel my-24 md:w-2/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark space-x-6 md:px-0 px-8">

                                    <div className="flex my-2 items-center justify-between bg-[#fbfbfb]  py-3 dark:bg-[#121c2c]">
                                        <div className="text-[22px] font-bold capitalize leading-none text-[#000000] ms-6">Edit Addons</div>

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
                                                                className="bg-gray-100 border rounded p-1 focus:outline-none focus:border-gray-500 ms-12 md:ms-0 h-9 w-full text-[13px] border-gray-300"
                                                                value={addonsInfo?.ExtendRateType || ""}
                                                                onChange={(e) => handleInputChange('ExtendRateType', e.target.value)}
                                                            >
                                                                <option value="n/a">n/a</option>
                                                                <option value="day">day long</option>
                                                                <option value="hourly">Hourly</option>
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
                                                    <button type='submit' className='btn btn-outline-dark text-dark h-10 w-28'>Done</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}
export default Addons;
