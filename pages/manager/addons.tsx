import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import Loader from '@/components/SharedComponent/Loader';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const Addons = () => {
  const [general, setGeneralAddons] = useState(null);

  const [addonsData, setAddonsData] = useState({
    general: {
      // ...
    },
    models: {
      // ...
    },
  });
  // console.log('🚀 ~ file: addons.tsx:18 ~ Addons ~ addonsData:', addonsData);
  const cleanedData = { ...addonsData };

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

  // General Object Rate Change
  const handleRateChange = (key, newValue) => {

    setAddonsData((prevData) => ({
      ...prevData,
      general: {
        ...prevData.general,
        [key]: {
          ...prevData.general[key],
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
    console.log("🚀 ~ handleFormSubmit ~ addedAddons:", addedAddons);
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
          <span>Addons Calculation</span>
        </li>
      </ul>

      <div className="panel mt-5" id="pills_with_icon">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="font-sans text-lg font-semibold dark:text-white-light">Addons Calculation</h5>
        </div>
        <div className="mb-5">
          {isMounted && (
            <Tab.Group>
              <Tab.List className="mb-5 mt-3 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-center sm:space-x-3">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} flex flex-col items-centerjustify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-success hover:text-whitehover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                    >
                      {allSvgs.addonsSvgGeneral}
                      General
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!bg-success text-white !outline-none' : ''} flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                    >
                      {allSvgs.addonsSvgModel}
                      Models
                    </button>
                  )}
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <div className="flex items-start pt-5">
                    <div className="flex-auto">
                      <div className="active">
                        <div className="flex items-center justify-between bg-black p-5 text-white">
                          <p className="block basis-[25%] font-sans text-[18px] uppercase leading-none">ITEM</p>
                          <span className="block basis-[40%] font-sans text-[18px] uppercase leading-none">Rate</span>
                          <span className="block font-sans text-[18px] uppercase leading-none">Status</span>
                        </div>
                        {Object.keys(addonsData.general).map((key) => {
                          const item = addonsData.general[key];
                          // console.log(item);

                          return (
                            <div key={key} className="my-2 flex items-center justify-between border-b p-5">
                              <p className="block basis-[25%] font-sans text-[18px] font-semibold capitalize leading-none text-black">{item.title}</p>

                              <input
                                name={key}
                                type="number"
                                value={item.rate}
                                className="form-input basis-[40%] font-sans text-[16px] leading-none"
                                id="rate"
                                onChange={(e) => handleRateChange(key, e.target.value)}
                              />
                              <button type="button" className={`rounded-full px-5 py-2 text-white ${item.status === 1 ? 'bg-success' : 'bg-danger'}`} onClick={() => handleStatusChange(key)}>
                                {item.status === 1 ? 'Active' : 'Inactive'}
                              </button>
                            </div>
                          );
                        })}

                        {/* <button type="submit" className="btn my-5 bg-black font-sans text-white float-left" onClick={() => setAddonsAddBtnModal(true)}>
                          Add Addons
                        </button> */}
                        <button type="submit" className="btn my-5 bg-black font-sans text-white float-right" onClick={handleSave}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div>
                    <div className="flex items-start pt-5">
                      <div className="flex-auto">
                        <div className="active">
                          <div className="flex items-center justify-between bg-black p-5 text-white">
                            <p className="block basis-[25%] font-sans text-[18px] uppercase leading-none">ITEM</p>
                            <span className="block basis-[40%] font-sans text-[18px] uppercase leading-none">Rate</span>
                            <span className="block font-sans text-[18px] uppercase leading-none">Status</span>
                          </div>

                          {Object.keys(addonsData.models).map((key) => {
                            const item = addonsData.models[key];
                            return (
                              <div key={key} className="my-2 flex items-center justify-between border-b p-5">
                                <p className="block basis-[25%] font-sans text-[18px] font-semibold capitalize leading-none text-black">{item.title}</p>
                                <input
                                  name={key}
                                  type="number"
                                  value={item.rate}
                                  className="form-input basis-[40%] font-sans text-[16px] leading-none"
                                  onChange={(e) => handleMoedelsRateChange(key, e.target.value)}
                                />
                                <button type="button" className={`rounded-full px-5 py-2 text-white ${item.status === 1 ? 'bg-success' : 'bg-danger'}`} onClick={() => handleMoedelsStatusChange(key)}>
                                  {item.status === 1 ? 'Active' : 'Inactive'}
                                </button>
                              </div>
                            );
                          })}

                          <button type="submit" className="btn my-5 bg-black font-sans text-white float-right" onClick={handleSave}>
                            Save
                          </button>
                          {/*   <button type="submit" className="btn my-5 bg-black font-sans text-white float-left" onClick={() => setAddonsAddBtnModal(true)}>
                            Add Addons
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>

        {/* modal for add button starts */}
        <Transition appear show={addonsAddBtnModal} as={Fragment}>
          <Dialog as="div" open={addonsAddBtnModal} onClose={() => setAddonsAddBtnModal(false)}>

            <div className="fixed inset-0" />

            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
              <div className="flex min-h-screen items-start justify-center px-4">
                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <div className="text-[18px] font-bold leading-none capitalize text-[#000000]">Add Addons</div>
                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setAddonsAddBtnModal(false)}>
                      {allSvgs.closeModalSvg}
                    </button>
                  </div>

                  {/* add addons form */}
                  <form className="space-y-2 dark:text-white mx-14 pb-5" onSubmit={handleFormSubmit}>
                    <div className=''>
                      <label htmlFor="title" className="text-[#0E1726] mb-1">
                        Title
                      </label>
                      <div className="relative text-white-dark">
                        <input id="title" name="title" type="text" placeholder="Enter AddOns Title" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] " />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">

                        </span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="AddonsPrice" className="text-[#0E1726] mb-1">
                        Price
                      </label>
                      <div className="relative text-white-dark">
                        <input id="AddonsPrice" name="price" type='number' placeholder="Enter AddOns Title" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] " />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">

                        </span>
                      </div>
                    </div>

                    <div className='rounded'>
                      <label htmlFor="category" className="text-[#0E1726] mb-1 ">
                        Category
                      </label>
                      <select name="category" id="category" className='w-full ps-3 '>
                        <option defaultValue="general">General</option>
                        <option defaultValue="modals">Modals</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="text-[#0E1726] mb-1 ">
                        Status
                      </label>
                      <select name="status" id="status" className='w-full ps-3'>
                        <option defaultValue="1">Active</option>
                        <option defaultValue="0">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="info" className="text-[#0E1726]">
                        Info (optional)
                      </label>
                      <div className="relative text-white-dark">
                        <input id="info" name="info" type="text" placeholder="Enter AddOns Info" className="form-input ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] " />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">

                        </span>
                      </div>
                    </div>

                    {/*form submit btn*/}
                    <button
                      type="submit"
                      className="btn !mt-8 w-full border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l"
                    >
                      {
                        isLoading ?
                          <span role="status" className="flex h-5 items-center space-x-2">
                            <Loader />
                          </span>
                          :
                          'Add AddOns'
                      }

                    </button>
                  </form>
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
