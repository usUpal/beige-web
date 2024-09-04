import React, { useState } from 'react'
import PreLoader from '@/components/ProfileImage/PreLoader';
import Link from 'next/link';
import { useDeleteRoleMutation, useGetAllRolesQuery } from '@/Redux/features/role/roleApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import Swal from 'sweetalert2';

const Role = () => {
  const { data: allRoles, isLoading: isAllRolesLoading, isError: isAllRoleError, status: allRoleStatus, error: allRolesError, refetch } = useGetAllRolesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteRole, { isLoading: isDeleteRoleLoading, isSuccess: isRoleDelteSuccess }] = useDeleteRoleMutation();

  const router = useRouter();
  const statusCode = 404
  const { authPermissions } = useAuth();

  if (isAllRoleError) {
    if (allRolesError.data.code === statusCode) {
      router.push('/errors/not-found');
      toast.error(allRolesError?.data?.message)
    } else if (allRolesError.data.code === statusCode) {
      router.push('/errors/access-denied');
      toast.error(allRolesError?.data?.message)
    } else {
      console.log("🚀 ~ Role ~ allRolesError:", allRolesError?.data?.code)
    }
  }


  const deletePermission = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteRole(id);
        if (deleteResult?.data) {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }

      } catch (error) {
        console.log("🚀 ~ deletePermission ~ error:", error)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">All Roles</h5>
          <div className="space-x-2">
            {authPermissions?.includes('add_role') && (
              <Link href={'/dashboard/role/add-role'} className='px-3 py-1 rounded border border-black focus:border-black focus:outline-none'>Add New Role & Permission</Link>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="text-[16px] font-semibold ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                <th>Role</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md w-[60%]">Permissions</th>
                {(authPermissions?.includes('edit_role') || authPermissions?.includes('delete_role')) && (
                  <th className="text-[16px] font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isAllRolesLoading ? (
                <>
                  <PreLoader></PreLoader>
                </>
              ) : (
                <>
                  {allRoles && allRoles.length > 0 ? (
                    allRoles?.map((role: any, index: number) => (
                      <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className="min-w-[150px] text-black dark:text-white">
                          <div className="">
                            <h4>{role?.name}</h4>
                          </div>
                        </td>
                        <td>{role?.role}</td>
                        <td className='flex flex-wrap gap-2 w-[60%]'>
                          {role?.role === 'admin' ? (
                            <span className='text-secondary font-semibold'>Access All Permissions</span>
                          ) : (
                            <>
                              {role?.permissions && role?.permissions?.length > 0 && role?.permissions?.map((permission: string, index: number) => (
                                <div className="" key={index}>
                                  <div className="">
                                    <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent capitalize">{permission}</span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </td>
                        {(authPermissions?.includes('edit_role') || authPermissions?.includes('delete_role')) && (
                          <td>
                            <div className='space-x-4'>
                              {authPermissions?.includes('edit_role') && (
                                <Link href={`/dashboard/role/edit-role/${role?._id}`}>
                                  <button type="button" className="">{allSvgs.editPen}</button>
                                </Link>
                              )}

                              {role?.is_delete && (
                                <>
                                  {authPermissions?.includes('delete_role') && (
                                    <button onClick={() => deletePermission(role?._id)} type="button" className="p-0">{allSvgs.trash}</button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={50} className="text-center">
                        <span className="flex justify-center font-semibold text-[red]"> No Roles found </span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>

          {/* <Pagination currentPage={currentPage} totalPages={totalPagesCount} onPageChange={handlePageChange} /> */}
          {/* <div className="mt-4 flex justify-center md:justify-end lg:mr-5 2xl:mr-16">
            <ResponsivePagination
              current={currentPage}
              total={totalPagesCount}
              onPageChange={handlePageChange}
              maxWidth={400}
            // styles={styles}
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Role
