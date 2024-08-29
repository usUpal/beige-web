
import React, { useState } from 'react'
import { allPermissions } from '@/store/data';
import { useForm } from 'react-hook-form';

const AddRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Create Role</h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <div className="grid grid-cols-3 gap-3">
              <input type="text" {...register('name')} placeholder='write a role name' className='border border-black rounded px-3 py-1' />
              <input type="text" {...register('details')} placeholder='write role details' className='border border-black rounded px-3 py-1 col-span-2' />
            </div>


            <h3 className='mt-5'>Permission List</h3>
            <div className="flex space-x-3 items-center mb-1">
              <label htmlFor={'select_all'} className='cursor-pointer'>{'Select All'}</label>
              <div className="w-12 h-6 relative">
                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id={'select_all'} />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </div>
            </div>
            <hr className='border border-dashed border-black/30' />

            <div className="grid grid-cols-5 mt-5 gap-3">
              {allPermissions?.length && allPermissions?.map((module, index) => (
                <div className="border border-black/30 rounded p-3 " key={index}>
                  <div className="flex justify-between items-center">
                    <h4 className='font-semibold text-sm'>{module?.module_name}</h4>
                    <div className="flex space-x-3 items-center mb-1">
                      <div className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id={'select_all'} />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {module?.permissions?.length && module?.permissions?.map((permission, index) => (
                      <div className="flex justify-between items-center mb-1" key={index}>
                        <label htmlFor={permission?.key} className='cursor-pointer'>{permission?.name}</label>
                        <div className="w-12 h-6 relative">
                          <input type="checkbox" {...register('permissions')} defaultValue={permission?.key} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id={permission?.key} />
                          <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end'>
              <button className='bg-black rounded text-white px-3 py-1' type='submit'>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRole
