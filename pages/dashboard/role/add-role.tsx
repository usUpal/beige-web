import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetAllPermissionsQuery, usePostRoleMutation } from '@/Redux/features/role/roleApi';
import { createSlug } from '@/utils/helper';
import Loader from '@/components/SharedComponent/Loader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import AccessDenied from '@/components/errors/AccessDenied';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
const AddRole = () => {
  const { authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('add_role');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>(['dashboard_page']);

  const {
    data: allPermissions,
    isLoading: isGetPermissionLoading,
    isSuccess: isPostPermissionSuccess,
  } = useGetAllPermissionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [postRole, { isLoading: isPostRoleLoading, isError: isPostRoleLoadingError, error: postRoleError }] = usePostRoleMutation();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    if (!checkedPermissions?.length) {
      toast.error('Please select a permission...!');
      return;
    }

    const formData = {
      name: data?.name,
      role: createSlug(data?.name),
      details: data?.details,
      permissions: checkedPermissions,
    };

    await postRole(formData);
    if (isPostPermissionSuccess) {
      router.push('/dashboard/role');
      toast.success('New role create success...');
    }
  };

  const handleCheckboxChange = (key: string) => {
    setCheckedPermissions((prev) => {
      if (prev.includes(key)) {
        return prev.filter((permission) => permission !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-slate-400">Create Role</h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="">
            <div className="grid grid-cols-3 gap-3">
              <input type="text" {...register('name')} required={true} placeholder="write a role name" className={`rounded  border border-slate-600 bg-white px-3 py-2 dark:bg-[#121e32] `} />
              <input type="text" {...register('details')} required={true} placeholder="write role details" className="col-span-2 rounded border border-slate-600 px-3 py-2 dark:bg-[#121e32]" />
            </div>

            <h3 className="mt-5 text-black dark:text-slate-400">Permission List</h3>
            {/* <div className="flex space-x-3 items-center mb-1">
              <label htmlFor={'select_all'} className='cursor-pointer'>{'Select All'}</label>
              <div className="w-12 h-6 relative">
                <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id={'select_all'} />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </div>
            </div> */}
            <hr className="border border-dashed border-black/30" />

            <div className="mt-5 grid grid-cols-5 gap-3">
              {allPermissions?.length &&
                allPermissions?.map((module: any, index: number) => (
                  <div className="rounded border border-black/30 p-3 " key={index}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-black dark:text-slate-400">{module?.module_name}</h4>
                      {/* <div className="flex space-x-3 items-center mb-1">
                      <div className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id={'select_all'} />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </div>
                    </div> */}
                    </div>
                    <div className="mt-4">
                      {module?.permissions?.length &&
                        module?.permissions?.map((permission: any, index: number) => {
                          const isDefaultChecked = permission?.key === 'dashboard_page';
                          const isChecked = isDefaultChecked || checkedPermissions.includes(permission?.key);

                          return (
                            <div className="mb-1 flex items-center justify-between" key={index}>
                              <label htmlFor={permission?.key} className="cursor-pointer text-black dark:text-white-dark">
                                {permission?.name}
                              </label>
                              <div className="relative h-6 w-12">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCheckboxChange(permission?.key)}
                                  disabled={isDefaultChecked}
                                  className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                  id={permission?.key}
                                />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end">
              {isPostRoleLoading ? (
                <button disabled={isPostRoleLoading} className="flex gap-3 rounded bg-black px-3 py-1 text-white" type="submit">
                  <span>Loading...</span>
                  <Loader />
                </button>
              ) : (
                // <button className='bg-black rounded text-white px-3 py-1' type='submit'>Submit</button>
                <DefaultButton css="font-semibold mt-10 h-9">submit</DefaultButton>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRole;
