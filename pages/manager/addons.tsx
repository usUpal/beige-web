import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Loader from '@/components/SharedComponent/Loader';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import 'tippy.js/dist/tippy.css';
import { useForm } from "react-hook-form";
import StatusBg from '@/components/Status/StatusBg';

const Addons = () => {
  const [general, setGeneralAddons] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [addonsData, setAddonsData] = useState<addonTypes[]>([]);
  const [addonsInfo, setAddonsInfo] = useState<any>({});
  console.log("🚀 ~ Addons ~ addonsInfo:", addonsInfo)

  const [status, setStatus] = useState(0);


  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    // console.log("data", data);
  }

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

  const getAddonsDetails = async (addonsId: string) => {
    console.log("addonsId::", addonsId);
    try {
      const response = await fetch(`${API_ENDPOINT}addons/${addonsId}`)
      const addonsDetailsRse = await response.json();

      if (!addonsDetailsRse) {
        console.log(response);
      }
      else {
        setAddonsInfo(addonsDetailsRse)
      }
    }
    catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  // General Object Rate Change
  const handleRateChange = (key: any, newValue: any) => {

    setAddonsData((prevData) => ({
      ...prevData,
      general: {
        ...prevData.general,
        [key]: {
          ...prevData?.general[key],
          rate: newValue,
        },
      },
    }));
  };

  // General Object Status Change
  const handleStatusChange = (key, newValue) => {
    setAddonsData((prevData) => ({
      ...prevData,
      general: {
        ...prevData.general,
        [key]: {
          ...prevData.general[key],
          status: newValue,
        },
      },
    }));
  };

  // Models Object Rate Change
  const handleMoedelsRateChange = (key, newValue) => {
    setAddonsData((prevData) => ({
      ...prevData,
      models: {
        ...prevData.models,
        [key]: {
          ...prevData.models[key],
          rate: newValue,
        },
      },
    }));
  };

  // Models Object Rate Change
  const handleMoedelsStatusChange = (key, newValue) => {
    console.log(key, newValue);
    setAddonsData((prevData) => ({
      ...prevData,
      models: {
        ...prevData.models,
        [key]: {
          ...prevData.models[key],
          status: newValue,
        },
      },
    }));
  };

  const handleSave = () => {
    const updatedData = JSON.parse(JSON.stringify(cleanedData));
    const url = `${API_ENDPOINT}addOns`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const dispatch = useDispatch();
  // state for setting modal for add button
  const [addonsAddBtnModal, setAddonsAddBtnModal] = useState(false);

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculator - Client Web App - Beige'));
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  /* Form Handle and Loader  */
  const [isLoading, setLoading] = useState(false);

  // form handleSubmitForm
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    const title = e.target.title.value.toLowerCase();
    const rate = parseInt(e.target.price.value);
    const category = e.target.category.value.toLowerCase();
    const status = e.target.status.value.toLowerCase();
    const info = e.target.info.value.toLowerCase();
    let addedAddons = { title, rate, category, status, info };
    setLoading(true);

    if (title === '' || isNaN(rate) && category === '' || status === '') {
      console.log("To add Addons, Addons Details Can't be empty.");
      setLoading(false);
      return;
    }
    // console.log("🚀 ~ handleFormSubmit ~ addedAddons:", addedAddons);
    setLoading(false);

    e.target.reset();
  }

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-warning hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Addons</span>
        </li>
      </ul>

      <div className="panel mt-5" id="pills_with_icon">
        {/* <div className="mb-5 flex items-center justify-between">
          <h5 className="font-sans text-lg font-semibold dark:text-white-light">Addons Calculation</h5>
        </div> */}

        {/* tab starts*/}
        <div className="mb-5 flex flex-col sm:flex-row">
          <Tab.Group>
            <div className="mx-3 mb-5 sm:mb-0">
              <Tab.List className=" mb-5 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-center w-32 flex-col">

                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Wedding Photography'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Wedding Photography
                    </button>
                  )}
                </Tab>

                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Commercial Video'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Commercial Video
                    </button>
                  )}
                </Tab>

                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Music Video'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Music Video
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Corporate Event Videography'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12  flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Corp. Event Videography
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Corporate Photography'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Corporate Photography
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Private Photography'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Private Photography
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      title='Other Videography'
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} text-[13px] h-12 flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-4 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}>
                      Other Videography
                    </button>
                  )}
                </Tab>
              </Tab.List>
            </div>

            <div className='ms-4'>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="active">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="table-responsive mb-5">
                        <table>
                          <thead>
                            <tr>
                              <th className="font-mono">Title</th>
                              <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                              <th className="font-mono">Extend Rate</th>
                              <th className="font-mono">Rate</th>
                              <th className="font-mono">Status</th>
                              <th className="font-mono">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addonsData
                              ?.filter(filteredAddon => filteredAddon.category === "Wedding Photography")
                              .map((addons, index) => ((console.log(addons._id)),
                                <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90 ">
                                  <td className="min-w-[150px] font-sans text-black dark:text-white">
                                    <div className="flex items-start flex-col">
                                      <input
                                        title={addons?.title}
                                        {...register(`addons[${index}].title`)}
                                        defaultValue={addons?.title}
                                        className='border rounded p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 h-10 text-[13px]'
                                      />
                                    </div>
                                  </td>

                                  <td className="min-w-[150px] font-sans text-black dark:text-white">
                                    <div className="flex items-start flex-col">
                                      <select
                                        title={addons?.ExtendRateType}
                                        {...register(`addons[${index}].ExtendRateType`)}
                                        className='border rounded px-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 h-10 capitalize w-32 text-[13px] text-center'
                                      >
                                        {
                                          addons?.ExtendRateType ?
                                            <option defaultValue={addons?.ExtendRateType}>{addons?.ExtendRateType}</option>
                                            :
                                            <option defaultValue="n/a">n/a</option>
                                        }
                                        <option value="fullday">Fullday</option>
                                        {
                                          addons?.ExtendRateType !== 'hourly' &&
                                          <option value="hourly">Hourly</option>
                                        }
                                      </select>
                                    </div>
                                  </td>

                                  <td>
                                    <input
                                      type='number'
                                      {...register(`addons[${index}].ExtendRate`)}
                                      defaultValue={addons?.ExtendRate ? addons?.ExtendRate : 0}
                                      className='border rounded p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0 w-24 h-10 text-[13px]'
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type='number'
                                      {...register(`addons[${index}].rate`)}
                                      defaultValue={addons?.rate}
                                      className='border rounded text-gray-600 p-3 focus:outline-none bg-gray-50 focus:border-gray-400 ms-12 md:ms-0  w-24 h-10 text-[13px]'
                                    />
                                  </td>

                                  <td className={`font-sans text-gray-600 hover:text-green-500`}>
                                    {addons?.status >= 1 ? (
                                      <span className="badge badge-outline-success">Active</span>
                                    ) : (
                                      <span className="badge badge-outline-success">Inactive</span>
                                    )}

                                   {/*  <label className="w-12 h-6 relative">
                                      <input
                                        type="checkbox"
                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        id="custom_switch_checkbox1"
                                        checked={addons?.status >= 1} // This line controls the checked state of the checkbox
                                      />
                                      <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label> */}
                                  </td>
                                  {/*  */}
                                  {/* <p className='flex items-center'>
                                      <label
                                        className="w-12 h-6 relative"
                                        
                                        // onClick={() => setSettings({ ...settings, defaultPublicFiles: !settings.defaultPublicFiles })}
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                          id="custom_switch_checkbox1"
                                          // checked={settings.defaultPublicFiles}
                                        />
                                        <span
                                          className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        >
                                        </span>
                                      </label>

                                      <span className='ps-2 pb-2 '>{`Uploaded files are ${settings.defaultPublicFiles ? 'public' : 'private'} by default`}</span>

                                    </p> */}

                                  <td>
                                    <button type="submit" className="btn text-dark btn-outline-dark" onClick={() => getAddonsDetails(addons._id)}>Save</button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </form>
                    {/*  */}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  {/* Commercial Video */}
                  <div>
                    <div className="table-responsive mb-5">
                      <form action="">
                        <table>
                          <thead>
                            <tr>
                              <th className="font-mono">Title</th>
                              <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                              <th className="font-mono">Extend Rate</th>
                              <th className="font-mono">Rate</th>
                              <th className="font-mono">Status</th>
                              <th className="font-mono">Action</th>
                            </tr>
                          </thead>

                          <tbody>

                            {addonsData?.filter(filteredAddon => filteredAddon.category === "Commercial Video").map((addons, index) => (
                              <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] font-sans text-black dark:text-white">
                                  <div className="flex items-center">
                                    <p className="whitespace-nowrap">{addons?.title}</p>
                                  </div>
                                </td>
                                <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                                <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                                <td>{addons?.rate}</td>
                                <td className={`${addons?.status ? "text-success" : "text-warning"} font-sans text-success`}>{addons?.status ? "Active" : "Inactive"}</td>

                                <td>
                                  <button type="button" className="p-0" onClick={() => setOpenModal(!openModal)}>
                                    {allSvgs.pencilIconForEdit}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </form>

                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  {/* Music Vedio - category */}
                  <div className="">
                    {/*  */}
                    <h4 className="mb-4 text-2xl font-semibold">Music Video</h4>
                    <div className="table-responsive mb-5">
                      <table>
                        <thead>
                          <tr>
                            <th className="font-mono">Title</th>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                            <th className="font-mono">Extend Rate</th>
                            <th className="font-mono">Rate</th>
                            <th className="font-mono">Status</th>
                            <th className="font-mono">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addonsData?.filter(filteredAddon => filteredAddon.category === "Music Video").map((addons, index) => (
                            <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{addons?.title}</p>
                                </div>
                              </td>
                              <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                              <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                              <td>{addons?.rate}</td>
                              <td className="font-sans text-success">{addons?.status}</td>

                              <td>
                                <button type="button" className="p-0">
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

                <Tab.Panel>
                  <div className="">
                    {/* Corporate Event Videography */}
                    <h4 className="mb-4 text-2xl font-semibold">Corporate Event Videography</h4>
                    <div className="table-responsive mb-5">
                      <table>
                        <thead>
                          <tr>
                            <th className="font-mono">Title</th>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                            <th className="font-mono">Extend Rate</th>
                            <th className="font-mono">Rate</th>
                            <th className="font-mono">Status</th>
                            <th className="font-mono">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addonsData?.filter(filteredAddon => filteredAddon.category === "Corporate Event Videography").map((addons, index) => (
                            <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{addons?.title}</p>
                                </div>
                              </td>
                              <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                              <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                              <td>{addons?.rate}</td>
                              <td className="font-sans text-success">{addons?.status}</td>
                              <td>
                                <button type="button" className="p-0">
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

                <Tab.Panel>
                  <div className="">
                    {/* Corporate Photography */}
                    <h4 className="mb-4 text-2xl font-semibold">Corporate Photography</h4>
                    <div className="table-responsive mb-5">
                      <table>
                        <thead>
                          <tr>
                            <th className="font-mono">Title</th>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                            <th className="font-mono">Extend Rate</th>
                            <th className="font-mono">Rate</th>
                            <th className="font-mono">Status</th>
                            <th className="font-mono">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addonsData?.filter(filteredAddon => filteredAddon?.category === "Corporate Photography").map((addons, index) => (
                            <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{addons?.title}</p>
                                </div>
                              </td>
                              <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                              <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                              <td>{addons?.rate}</td>
                              <td className="font-sans text-success">{addons?.status}</td>

                              <td>
                                <button type="button" className="p-0">
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

                <Tab.Panel>
                  <div className="">
                    {/* Private Photography */}
                    <h4 className="mb-4 text-2xl font-semibold">Private Photography</h4>
                    <div className="table-responsive mb-5">
                      <table>
                        <thead>
                          <tr>
                            <th className="font-mono">Title</th>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                            <th className="font-mono">Extend Rate</th>
                            <th className="font-mono">Rate</th>
                            <th className="font-mono">Status</th>
                            <th className="font-mono">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addonsData?.filter(filteredAddon => filteredAddon.category === "Private Photography").map((addons, index) => (
                            <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{addons?.title}</p>
                                </div>
                              </td>
                              <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                              <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                              <td>{addons?.rate}</td>
                              <td className="font-sans text-success">{addons?.status}</td>

                              <td>
                                <button type="button" className="p-0">
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

                <Tab.Panel>
                  <div className="">
                    {/* Other Videography */}
                    <h4 className="mb-4 text-2xl font-semibold">Other Videography</h4>
                    <div className="table-responsive mb-5">
                      <table>
                        <thead>
                          <tr>
                            <th className="font-mono">Title</th>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Extend Rate Type</th>
                            <th className="font-mono">Extend Rate</th>
                            <th className="font-mono">Rate</th>
                            <th className="font-mono">Status</th>
                            <th className="font-mono">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addonsData?.filter(filteredAddon => filteredAddon?.category === "Other Videography").map((addons, index) => (
                            <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                              <td className="min-w-[150px] font-sans text-black dark:text-white">
                                <div className="flex items-center">
                                  <p className="whitespace-nowrap">{addons?.title}</p>
                                </div>
                              </td>
                              <td>{addons?.ExtendRateType ? addons?.ExtendRateType : "Extend Rate Type"}</td>
                              <td>{addons?.ExtendRate ? addons?.ExtendRate : "ExtendRate"}</td>
                              <td>{addons?.rate}</td>
                              <td className="font-sans text-success">{addons?.status}</td>

                              <td>
                                <button type="button" className="p-0">
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
              </Tab.Panels>
            </div>
          </Tab.Group>

        </div>
        {/* tab ends */}

      </div >
    </div >
  );
}
export default Addons;
