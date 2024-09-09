import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useForm } from 'react-hook-form';
import useAddons from '@/hooks/useAddons';
import { useAuth } from '@/contexts/authContext';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addons = () => {
  const { authPermissions } = useAuth();

  const [addonsData, setAddonsData, addonsCategories] = useAddons();
  // const [addonsData, setAddonsData] = useState<addonTypes[]>([]);
  // const [allCategory, setAllCategory] = useState([]);

  const [addonsInfo, setAddonsInfo] = useState<any | null>(null);
  const [addonsModal, setAddonsModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showDesignElement, setShowDesignElement] = useState({
    showNewCategoryInput: false,
  });
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // setAddonsAddBtnModal
  const [addonsAddBtnModal, setAddonsAddBtnModal] = useState(false);

  // add category to the allcategory
  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      addonsCategories.push(newCategory);
      setNewCategory('');
    }
    showDesignElement.showNewCategoryInput = false;
  };

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
      [key]: value,
    });
  };


  const handleUpdateTestSubmit = async (data) => {
    const updatedAddonDetails = {
      title: addonsInfo?.title || data?.title,
      rate: addonsInfo?.rate || data?.rate,
      ExtendRate: addonsInfo?.ExtendRate || data?.ExtendRate,
      ExtendRateType: addonsInfo?.ExtendRateType || data?.ExtendRateType,
      status: addonsInfo?.status || data?.status || false,
    };

    try {
      const patchResponse = await fetch(`${API_ENDPOINT}addons/${addonsInfo?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAddonDetails),
      });

      if (!patchResponse.ok) {
        throw new Error('Failed to update addon');
      }

      const updatedAddon = await patchResponse.json();

      const updatedAddonsData = addonsData.map((addon) =>
        addon._id === addonsInfo?._id ? updatedAddon : addon
      );
      setAddonsData(updatedAddonsData);

      setAddonsModal(false);
      toast.success('Addon updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update addon. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // add- new addons
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddonsData),
      });

      if (!response.ok) {
        throw new Error('Response: Failed to add new addon.');
      }
      const responseData = await response.json();

      addonsData.push(newAddonsData);
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
      setAddonsAddBtnModal(false);
      reset();
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
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
        <div>
          {/* <button className='custom-button' onClick={() => setAddonsAddBtnModal(!addonsAddBtnModal)}>Add New</button> */}
          <DefaultButton onClick={() => setAddonsAddBtnModal(!addonsAddBtnModal)} css=''>Add New</DefaultButton>
        </div>
      </div>


      <div className="mb-5 ">
        {authPermissions?.includes('new_add_ons') && (
          <div className="_ mx-3 mb-5 flex sm:mb-0">
            {/* <button
              onClick={() => setAddonsAddBtnModal(!addonsAddBtnModal)}
              className={`btn btn-outline-darkness flex h-10 w-24 flex-col items-center justify-center rounded-lg px-2 py-3 text-[13px] font-bold capitalize text-black hover:text-white`}
            >
              add new
            </button> */}
          </div>
        )}
        <div className="panel mt-6" id="pills_with_icon">
          {/* tab starts*/}


          <div className="my-5 flex flex-col sm:flex-row">
            <Tab.Group>
              <div className="mx-3 mb-5 sm:mb-0">
                <Tab.List className="mb-5 flex-row flex overflow-hidden overflow-x-auto  sm:flex-col sm:flex gap-2">
                  {addonsCategories.map((category: any, index: any) => (
                    <Tab key={index}>
                      {({ selected }) => (
                        <button
                          className={`hover:shadow-[0px 5px 15px 0px rgba(0,0,0,0.30)]  flex h-12 w-44 flex-col items-center justify-center rounded bg-[#f1f2f3] px-2 py-3 text-[13px] capitalize hover:bg-success hover:text-white dark:bg-[#191e3a] ${selected ? 'bg-success text-white outline-none' : ''
                            }`}
                          title={category}
                        >
                          {category}
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <div className="ms-4 w-full overflow-hidden overflow-x-auto">
                <Tab.Panels>
                  {addonsCategories?.map((category: any, index: any) => (
                    <Tab.Panel key={index}>
                      <div className="active">
                        <div className="table-responsive mb-5">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="">Title</th>
                                <th className="">Rate</th>
                                <th className="">Extend Rate Type</th>
                                <th className="">Extend Rate</th>
                                <th className="">Status</th>
                                {authPermissions?.includes('add_ons_edit') && (
                                  <th className="">Edit</th>
                                )}
                              </tr>
                            </thead>

                            <tbody>
                              {addonsData
                                ?.filter((filteredAddon: any) => filteredAddon.category === category)
                                .map((addon: any, index) => (
                                  <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                    <td className="min-w-[150px] font-sans text-black dark:text-white">
                                      <p className="flex flex-col items-start">{addon.title}</p>
                                    </td>
                                    <td className="min-w-[150px] font-sans text-black dark:text-white">
                                      <p className="flex flex-col items-start">{addon?.rate}</p>
                                    </td>
                                    <td>
                                      <p className="flex flex-col items-start">{addon?.ExtendRateType ? addon?.ExtendRateType : 'n/a'}</p>
                                    </td>
                                    <td>
                                      <p className="flex flex-col items-start">{addon?.ExtendRate ? addon?.ExtendRate : 0}</p>
                                    </td>
                                    <td className="font-sans text-gray-600">
                                      <p className="flex flex-col items-start ">
                                        {addon?.status >= 1 ? (
                                          <span className="badge w-12 bg-success text-center text-[10px]">Active</span>
                                        ) : (
                                          <span className="badge w-12 bg-warning text-center text-[10px]">Inactive</span>
                                        )}
                                      </p>
                                    </td>

                                    {authPermissions?.includes('add_ons_edit') && (
                                      <td>
                                        <button
                                          onClick={() => {
                                            getAddonsDetails(addon);
                                            setAddonsModal(true);
                                          }}
                                        >
                                          {allSvgs.editPen}
                                        </button>
                                      </td>
                                    )}
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

      {/* modal for update  button starts */}
      <Transition appear show={addonsModal} as={Fragment}>
        <Dialog as="div" open={addonsModal} onClose={() => setAddonsModal(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center md:px-4 ">
              <Dialog.Panel as="div" className="panel my-24   overflow-hidden rounded-lg border-0 p-0 px-8 text-black dark:text-white-dark md:w-2/5 w-[80%] md:px-0">
                <div className="my-2 flex items-center justify-between bg-[#fbfbfb] py-3 dark:bg-[#121c2c]">
                  <h2 className=" ms-6 text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Addons Details </h2>

                  <button type="button" className="me-4 text-[16px] text-white-dark hover:text-dark" onClick={() => setAddonsModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                <div className="w-full ml-0 px-7 pt-2 pb-4">
                  <div className={`w-full justify-between `}>
                    <div className=" dark:text-white  w-full">
                      <div className="flex flex-col md:flex md:flex-row md:justify-between w-full gap-3">
                        <p className="flex flex-col w-full">
                          <span className="text-[14px]  capitalize leading-none text-[#000000] mb-2 font-bold">Title</span>
                          <input
                            {...register('title')}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            value={addonsInfo?.title || ''}
                            className=" h-9  rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0  w-full"
                          />
                        </p>

                        <div className="mt-3 flex w-full flex-col md:mt-0">
                          <span className="text-[14px]  capitalize leading-none text-[#000000] mb-2 font-bold">Status</span>
                          <select
                            {...register('status')}
                            className=" h-9 w-full rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0"
                            value={addonsInfo?.status || ''}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between md:mt-3 md:flex md:flex-row w-full gap-4" >
                        {addonsInfo?.ExtendRate && (
                          <div className="mt-3 flex flex-col md:mt-0 w-full">
                            <span className="text-[14px] font-bold pb-2 capitalize leading-none text-[#000000]">Extend Rate</span>
                            <input
                              {...register('ExtendRate')}
                              onChange={(e) => handleInputChange('ExtendRate', e.target.value)}
                              value={addonsInfo?.ExtendRate || 0}
                              className=" h-9 w-full rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0 "
                            />
                          </div>
                        )}

                        {addonsInfo?.ExtendRateType && (
                          <p className="mt-3 flex flex-col md:mt-0 w-full">
                            <span className="text-[14px] font-bold pb-2 capitalize leading-none text-[#000000]">Extend Rate Type</span>
                            <select
                              {...register('ExtendRateType')}
                              className=" h-9 w-full rounded border border-gray-300 bg-gray-100 p-1 text-[13px] capitalize focus:border-gray-500 focus:outline-none md:ms-0"
                              value={addonsInfo?.ExtendRateType || ''}
                              onChange={(e) => handleInputChange('ExtendRateType', e.target.value)}
                            >
                              <option className="capitalize" value="n/a">
                                n/a
                              </option>
                              <option className="capitalize" value="day">
                                day
                              </option>
                              <option className="capitalize" value="hourly">
                                Hourly
                              </option>
                            </select>
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex flex-col justify-between md:flex md:flex-row">
                        <div className="mt-3 flex flex-col md:mt-0 w-full">
                          <span className="text-[14px] font-bold capitalize leading-none text-[#000000] mb-2">Rate</span>
                          <input
                            {...register('rate')}
                            onChange={(e) => handleInputChange('rate', e.target.value)}
                            value={addonsInfo?.rate || 0}
                            className=" h-9 w-full rounded border border-gray-300 bg-gray-100 p-1 text-[13px] focus:border-gray-500 focus:outline-none md:ms-0 "
                          />
                        </div>
                      </div>

                      {/* <div className="mt-8 flex justify-end md:mt-8">
                        <DefaultButton css='' onClick={handleUpdateTestSubmit}>Update</DefaultButton>
                      </div> */}
                      <div className="mt-8 flex justify-end md:mt-8">
                        <DefaultButton onClick={handleUpdateTestSubmit} type='submit'>Update</DefaultButton>
                      </div>
                    </div>
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
              <Dialog.Panel as="div" className="panel my-24 w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark md:w-6/12 2xl:w-5/12">
                <div className="my-2 box-border flex items-center justify-between bg-[#fbfbfb] px-6 py-3 dark:bg-[#121c2c]">
                  <h2 className="text-[22px] font-bold capitalize leading-[28.6px] text-[#000000]">Add Addons </h2>

                  <button type="button" className=" text-white-dark hover:text-dark" onClick={() => setAddonsAddBtnModal(false)}>
                    {allSvgs.closeModalSvg}
                  </button>
                </div>

                <div className="mx-auto px-5 w-full">
                  <p className="my-1 mt-1 flex justify-start text-[12px] ">
                    {showDesignElement.showNewCategoryInput ? (
                      <>
                        Select from existings?
                        <span
                          // setShowDesignElement
                          onClick={() =>
                            setShowDesignElement((prevState) => ({
                              ...prevState,
                              showNewCategoryInput: !prevState?.showNewCategoryInput,
                            }))
                          }
                          className="ms-2 cursor-pointer text-[12px] text-blue-500 hover:bg-slate-300"
                        >
                          select
                        </span>
                      </>
                    ) : (
                      <>
                        Create new categories?
                        <span
                          // setShowDesignElement
                          onClick={() =>
                            setShowDesignElement((prevState) => ({
                              ...prevState,
                              showNewCategoryInput: !prevState?.showNewCategoryInput,
                            }))
                          }
                          className="ms-2 cursor-pointer text-[12px] text-blue-500 hover:bg-slate-300"
                        >
                          Create
                        </span>
                      </>
                    )}
                  </p>
                  {/* add addons form */}
                  <form className="w-full space-y-2 pb-5 dark:text-white" onSubmit={handleSubmit(handleFormSubmit)}>
                    {!showDesignElement.showNewCategoryInput && (
                      <div className="rounded">
                        <label htmlFor="category" className="mb-1 text-[#0E1726]">
                          Select Category
                        </label>
                        <select
                          {...register('category', { required: 'Please Select a Category' })}
                          id="category"
                          className="md:w-80  w-full form-input  ps-3 capitalize placeholder:text-white-dark focus:border-[#E7D4BC]"
                        >
                          <option className=" capitalize text-primary" value="">
                            select form here
                          </option>
                          {addonsCategories.map((category: any, index: any) => (
                            <option value={category} key={index} className="capitalize">
                              {category}
                            </option>
                          ))}
                        </select>
                        <span>{errors.category && <p className="text-[12px] text-red-500">{errors?.category?.message}</p>}</span>
                      </div>
                    )}
                    <div>
                      {showDesignElement.showNewCategoryInput && (
                        <div className="rounded-md ">
                          <label htmlFor="new_category" className="mb-1 capitalize text-[#0E1726]">
                            Create New category
                          </label>

                          <div className="">
                            <div className="flex">
                              <input {...register('category')} id="new_category" type="text" placeholder="Create Category" className="form-input ltr:rounded-r-none rtl:rounded-l-none md:w-64" />
                              <div
                                className="flex cursor-pointer items-center  justify-center border px-3 font-semibold duration-500 hover:bg-gray-200 ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]"
                                onClick={handleAddCategory}
                              >
                                {allSvgs?.roundedPlusIconMd}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-between md:flex-row md:gap-3">
                      <div className='w-full'>
                        <label htmlFor="title" className="mb-1 text-[#0E1726]">
                          Title
                        </label>
                        <div className="relative text-white-dark">
                          <input
                            {...register('title', { required: 'Title is required.' })}
                            id="title"
                            type="text"
                            placeholder="Enter AddOns Title"
                            className="form-input w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC]"
                          />
                          <span>{errors.title && <p className="text-[12px] text-red-500">{errors?.title?.message}</p>}</span>
                        </div>
                      </div>

                      <div className='w-full'>
                        <label htmlFor="Rate" className="mb-[1px] text-[#0E1726]">
                          Rate
                        </label>
                        <div className="relative text-white-dark">
                          <input {...register('rate')} id="Rate" type="number" placeholder="Enter Rate" className="form-input w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-between md:flex-row md:gap-3">
                      <div className='w-full'>
                        <label htmlFor="ExtendRate" className="mb-1 text-[#0E1726]">
                          Extend Rate
                        </label>
                        <div className="relative text-white-dark">
                          <input
                            {...register('ExtendRate')}
                            id="ExtendRate"
                            type="number"
                            placeholder="Enter Extend Rate"
                            className="form-input w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC]"
                          />
                        </div>
                      </div>

                      <div className='w-full'>
                        <label htmlFor="ExtendRateType" className="mb-1 text-[#0E1726] ">
                          Extend Rate Type
                        </label>
                        <select {...register('ExtendRateType')} id="ExtendRateType" className="form-input w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC]">
                          <option value="hourly">Hourly</option>
                          <option value="day">Day</option>
                          <option value="n/a">N/A</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-between md:flex-row md:gap-3">
                      <div className='w-full'>
                        <label htmlFor="info" className="text-[#0E1726]">
                          Info (optional)
                        </label>
                        <div className="relative text-white-dark">
                          <input
                            {...register('info')}
                            id="info"
                            type="text"
                            placeholder="Enter AddOns Info"
                            className="form-input w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC]"
                          />
                        </div>
                      </div>

                      <div className='w-full'>
                        <label htmlFor="status" className="mb-1 text-[#0E1726] ">
                          Status
                        </label>
                        <select {...register('status')} id="status" className="form-input  w-full ps-3 placeholder:text-white-dark focus:border-[#E7D4BC] ">
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {/* <button
                        type="submit"
                        // btn md:mt-24 mt-8 bg-black font-sans text-white mx-auto md:me-0
                        className="btn btn-black mt-8 flex flex-col items-center justify-center rounded-lg bg-black text-[13px] font-bold capitalize text-white"
                      >
                        {isLoading ? (
                          <span role="status" className="flex h-5 items-center space-x-2">
                            Loading...
                          </span>
                        ) : (
                          'Add Addons'
                        )}
                      </button> */}
                      <DefaultButton css='font-semibold mt-3'>
                        {isLoading ? (
                          <span role="status" className="flex h-5 items-center space-x-2">
                            Loading...
                          </span>
                        ) : (
                          'Add Addons'
                        )}
                      </DefaultButton>
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
};
export default Addons;
