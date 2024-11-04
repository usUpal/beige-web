import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetSingleRoleQuery, useUpdateRoleMutation } from '@/Redux/features/role/roleApi';
import { useForm } from 'react-hook-form';
import Loader from '@/components/SharedComponent/Loader';
import { useGetAllPermissionsQuery } from '@/Redux/features/role/roleApi';
import { toast } from 'react-toastify';
import { createSlug } from '@/utils/helper';
import { useAuth } from '@/contexts/authContext';
import AccessDenied from '@/components/errors/AccessDenied';

const EditRole = () => {
  const { authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('edit_role');
  const router = useRouter();

  const roleId = router.query.id as string;
  const {
    data: roleData,
    isLoading: isRoleDetailsLoading,
    isError: isRoleDetailsError,
    error: roleError,
  } = useGetSingleRoleQuery(roleId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateRole, { isLoading: isUpdateRoleLoading, isSuccess: isUpdateRoleSuccess, isError: isUpdateRoleError, error: updateRoleError }] = useUpdateRoleMutation();
  const [roleDetails, setRoleDetails] = useState({
    name: '',
    role: '',
    details: '',
    permissions: [],
  });

  useEffect(() => {
    if (roleData) {
      setRoleDetails({
        name: roleData.name,
        role: roleData.role,
        details: roleData.details,
        permissions: roleData.permissions,
      });
    }
  }, [roleData]);

  const {
    data: allPermissions,
    isLoading: isGetPermissionLoading,
    isSuccess: isPostPermissionSuccess,
  } = useGetAllPermissionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: roleData?.name,
      details: roleData?.details,
    },
  });

  const onSubmit = async () => {
    if (!roleDetails?.permissions?.length) {
      toast.error('Please select a permission...!');
      return;
    }

    const result = await updateRole({
      id: roleId,
      formData: roleDetails,
    });

    if (result?.data) {
      router.push('/dashboard/role');
      toast.success('New role update success...');
    }
  };

  const handlePermissionChange = (permissionKey: string) => {
    setRoleDetails((prevDetails: any) => {
      const newPermissions = prevDetails?.permissions?.includes(permissionKey) ? prevDetails?.permissions?.filter((perm: any) => perm !== permissionKey) : [...prevDetails.permissions, permissionKey];

      return {
        ...prevDetails,
        permissions: newPermissions,
      };
    });
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">Update Role</h5>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="write a role name"
                onChange={(e) =>
                  setRoleDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }))
                }
                value={roleDetails?.name}
                className="rounded border border-black px-3 py-1"
              />
              <input
                type="text"
                placeholder="write role details"
                onChange={(e) =>
                  setRoleDetails((prevDetails) => ({
                    ...prevDetails,
                    details: e.target.value,
                  }))
                }
                value={roleDetails?.details}
                className="col-span-2 rounded border border-black px-3 py-1"
              />
            </div>

            <h3 className="mt-5">Permission List</h3>
            <hr className="border border-dashed border-black/30" />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allPermissions?.length &&
                allPermissions?.map((module: any, index: number) => (
                  <div className="rounded border border-black/30 p-3 " key={index}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{module?.module_name}</h4>
                    </div>
                    <div className="mt-4">
                      {module?.permissions?.length &&
                        module?.permissions?.map((permission: object, index: number) => {
                          // let isDisabled;
                          // if(roleData?.role === 'cp') {
                          //   isDisabled = permission?.key === 'dashboard_page' || permission?.key === 'shoot_page' || permission?.key === 'shoot_download' || permission?.key === 'shoot_show_details' || permission?.key === 'shoot_meeting_schedule' || permission?.key === 'meeting_page' || permission?.key === 'meeting_details' || permission?.key === 'meeting_details_reschedule' || permission?.key === 'chat_page' || permission?.key === 'file_manager_page' || permission?.key === 'transactions_page';
                          // }else if(roleData?.role === 'user') {
                          //   isDisabled = permission?.key === 'dashboard_page' || permission?.key === 'booking_page' || permission?.key === 'shoot_page' || permission?.key  == 'shoot_download' || permission?.key === 'shoot_show_details' || permission?.key === 'shoot_meeting_schedule' || permission?.key === 'meeting_page' || permission?.key === 'meeting_details' || permission?.key === 'chat_page' || permission?.key === 'disputes_page' || permission?.key === 'file_manager_page';
                          // }else{
                          //   isDisabled = permission?.key === 'dashboard_page'
                          // }
                          const isDisabled = (roleData?.role === 'cp' || roleData?.role === 'user') && permission?.status === false;
                          return (
                            <div className="mb-1 flex items-center justify-between" key={index}>
                              <label htmlFor={permission?.key} className="cursor-pointer">
                                {permission?.name}
                              </label>
                              <div className="relative h-6 w-12">
                                <input
                                  type="checkbox"
                                  defaultValue={permission?.key}
                                  onChange={() => handlePermissionChange(permission?.key)}
                                  checked={roleDetails?.permissions && roleDetails?.permissions?.includes(permission?.key)}
                                  disabled={isDisabled}
                                  className={`custom_switch absolute z-10 h-full w-full opacity-0 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} peer`}
                                  id={permission?.key}
                                />
                                {/* <span
                                  className={`block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white peer-checked:bg-${
                                    isDisabled ? 'gray-400' : 'primary'
                                  } before:transition-all before:duration-300`}
                                ></span> */}
                                <span
                                  className={`block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white peer-checked:bg-${
                                    isDisabled ? 'gray-400' : 'primary'
                                  } before:transition-all before:duration-300`}
                                ></span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
              {isUpdateRoleLoading ? (
                <button disabled={isUpdateRoleLoading} className="flex gap-3 rounded bg-black px-3 py-1 text-white" type="submit">
                  <span>Loading...</span>
                  <Loader />
                </button>
              ) : (
                <button className="rounded bg-black px-3 py-1 text-white" type="submit">
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
