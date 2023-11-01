import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { API_ENDPOINT } from '@/config';
import Link from 'next/link';
import { Tab } from '@headlessui/react';

const Addons = () => {

  const [general, setGeneralAddons] = useState(null);
  const cleanedGeneralData = { ...general };

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const res = await fetch(`https://api.beigecorporation.io/v1/addOns`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const jsonData = await res.json();
        setGeneralAddons(jsonData);
      } catch (error) {
        console.error(`Error fetching data`);
      }
    };
    fetchGeneralData();
  }, []);

  const handleGeneralStatusChange = (key: string) => {
    if (general[key]) {
      const updatedGeneralData = { ...general };
      updatedGeneralData[key].status = updatedGeneralData[key].status === 0 ? 1 : 0;
      setGeneralAddons(updatedGeneralData);
    }
  };

  const handleGeneralRateChange = (key, newValue) => {
    const updatedGeneralData = { ...general };
    updatedGeneralData[key].rate = newValue;
    setGeneralAddons(updatedGeneralData);
  };

  const getGeneralValue = () => {
    const updatedGeneralData = JSON.parse(JSON.stringify(cleanedGeneralData));
    const url = 'https://api.beigecorporation.io/v1/addOns';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGeneralData),
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

  const [models, setModelAddons] = useState(
    {
      "fourOrLess": {
        "rate": 1000,
        "status": 1
      },
      "fiveToEight": {
        "rate": 2500,
        "status": 1
      },
      "nineToTwelve": {
        "rate": 3000,
        "status": 1
      }
    }
  );

  const handleModelStatusChange = (key: string) => {
    if (models[key]) {
      const updatedModelData = { ...models };
      updatedModelData[key].status = updatedModelData[key].status === 0 ? 1 : 0;
      setModelAddons(updatedModelData);
    }
  };

  const handleModelRateChange = (key, newValue) => {
    const updatedModelData = { ...models };
    updatedModelData[key].rate = newValue;
    setModelAddons(updatedModelData);
  };

  const getModelValue = () => {
    const updatedModelData = JSON.parse(JSON.stringify(models));
    for (const key in models) {
      if (updatedModelData.hasOwnProperty(key)) {
        updatedModelData[key] = models[key];
      }
    }
    setModelAddons(updatedModelData);
    console.log(addonsData);
  }

  const [addonsData, setAddonsData] = useState(
    {
      general,
      models
    }
  );

  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculator - Client Web App - Beige'));
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  console.log();

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
          <h5 className="text-lg font-semibold dark:text-white-light font-sans">Addons Calculation</h5>
        </div>
        <div className="mb-5">
          {isMounted && (
            <Tab.Group>
              <Tab.List className="mt-3 mb-5 grid grid-cols-4 gap-2 rtl:space-x-reverse sm:flex sm:flex-wrap sm:justify-center sm:space-x-3">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!bg-success text-white !outline-none' : ''}
                                                    flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6Z" fill="currentColor"></path>
                        <path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" fill="currentColor"></path>
                        <path d="M13 6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6Z" fill="currentColor"></path>
                        <path opacity="0.5" d="M2 8.75C1.58579 8.75 1.25 9.08579 1.25 9.5C1.25 9.91421 1.58579 10.25 2 10.25V8.75ZM22 10.25C22.4142 10.25 22.75 9.91421 22.75 9.5C22.75 9.08579 22.4142 8.75 22 8.75V10.25ZM8.25 21C8.25 21.4142 8.58579 21.75 9 21.75C9.41421 21.75 9.75 21.4142 9.75 21H8.25ZM9.75 10C9.75 9.58579 9.41421 9.25 9 9.25C8.58579 9.25 8.25 9.58579 8.25 10L9.75 10ZM2 10.25H22V8.75H2V10.25ZM9.75 21L9.75 10L8.25 10L8.25 21H9.75Z" fill="currentColor"></path>
                      </svg>
                      General
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!bg-success text-white !outline-none' : ''}
                                                    flex flex-col items-center justify-center rounded-lg bg-[#f1f2f3] p-7 py-3 hover:!bg-success hover:text-white hover:shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] dark:bg-[#191e3a]`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.5" d="M2.5 6.5C2.5 4.29086 4.29086 2.5 6.5 2.5C8.70914 2.5 10.5 4.29086 10.5 6.5V9.16667C10.5 9.47666 10.5 9.63165 10.4659 9.75882C10.3735 10.1039 10.1039 10.3735 9.75882 10.4659C9.63165 10.5 9.47666 10.5 9.16667 10.5H6.5C4.29086 10.5 2.5 8.70914 2.5 6.5Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path opacity="0.5" d="M13.5 14.8333C13.5 14.5233 13.5 14.3683 13.5341 14.2412C13.6265 13.8961 13.8961 13.6265 14.2412 13.5341C14.3683 13.5 14.5233 13.5 14.8333 13.5H17.5C19.7091 13.5 21.5 15.2909 21.5 17.5C21.5 19.7091 19.7091 21.5 17.5 21.5C15.2909 21.5 13.5 19.7091 13.5 17.5V14.8333Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M2.5 17.5C2.5 15.2909 4.29086 13.5 6.5 13.5H8.9C9.46005 13.5 9.74008 13.5 9.95399 13.609C10.1422 13.7049 10.2951 13.8578 10.391 14.046C10.5 14.2599 10.5 14.5399 10.5 15.1V17.5C10.5 19.7091 8.70914 21.5 6.5 21.5C4.29086 21.5 2.5 19.7091 2.5 17.5Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M13.5 6.5C13.5 4.29086 15.2909 2.5 17.5 2.5C19.7091 2.5 21.5 4.29086 21.5 6.5C21.5 8.70914 19.7091 10.5 17.5 10.5H14.6429C14.5102 10.5 14.4438 10.5 14.388 10.4937C13.9244 10.4415 13.5585 10.0756 13.5063 9.61196C13.5 9.55616 13.5 9.48982 13.5 9.35714V6.5Z" stroke="currentColor" strokeWidth="1.5"></path>
                      </svg>
                      Models
                    </button>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="active">
                    <div className='flex justify-between items-center bg-black text-white p-5'>
                      <p className='block text-[18px] leading-none font-sans uppercase basis-[25%]'>ITEM</p>
                      <span className='block text-[18px] leading-none font-sans uppercase basis-[40%]'>Rate</span>
                      <span className='block text-[18px] leading-none font-sans uppercase'>Status</span>
                    </div>

                    {general && Object.keys(cleanedGeneralData).map((key, index) => {
                      const { rate, status } = general[key];
                      return (
                        <div key={index} className='flex justify-between items-center p-5 border-b my-2'>
                          <p className='block text-[18px] leading-none font-sans capitalize basis-[25%] text-black font-semibold'>{key}</p>
                          <input type="number" value={rate} className='form-input text-[16px] leading-none font-sans basis-[40%]' name='rate' id='rate' onChange={(e) => handleGeneralRateChange(key, e.target.value)} />
                          <button
                            type="button"
                            className={`text-white px-5 py-2 rounded-full ${status === 1 ? 'bg-success' : 'bg-danger'}`}
                            onClick={() => handleGeneralStatusChange(key)}>
                            {status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      );
                    })}

                    <button type="submit" className="btn bg-black font-sans text-white my-5" onClick={getGeneralValue}>Save</button>

                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div>
                    <div className="flex items-start pt-5">
                      <div className="flex-auto">
                        <div className="active">
                          <div className='flex justify-between items-center bg-black text-white p-5'>
                            <p className='block text-[18px] leading-none font-sans uppercase basis-[25%]'>ITEM</p>
                            <span className='block text-[18px] leading-none font-sans uppercase basis-[40%]'>Rate</span>
                            <span className='block text-[18px] leading-none font-sans uppercase'>Status</span>
                          </div>

                          {Object.keys(models).map((key, index) => {
                            const { rate, status } = models[key];
                            return (
                              <div key={index} className='flex justify-between items-center p-5 border-b my-2'>
                                <p className='block text-[18px] leading-none font-sans capitalize basis-[25%] text-black font-semibold'>{key}</p>
                                <input type="number" value={rate} className='form-input text-[16px] leading-none font-sans basis-[40%]' name='rate' id='rate' onChange={(e) => handleModelRateChange(key, e.target.value)} />
                                <button
                                  type="button"
                                  className={`text-white px-5 py-2 rounded-full ${status === 1 ? 'bg-success' : 'bg-danger'}`}
                                  onClick={() => handleModelStatusChange(key)}>
                                  {status === 1 ? 'Active' : 'Inactive'}
                                </button>
                              </div>
                            );
                          })}

                          <button type="submit" className="btn bg-black font-sans text-white my-5" onClick={getModelValue}>Save</button>

                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>
      </div>
    </div>
  );

};

export default Addons;
