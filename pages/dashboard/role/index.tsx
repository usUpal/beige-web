import React, { useState } from 'react'
import PreLoader from '@/components/ProfileImage/PreLoader';
import Link from 'next/link';
import { useGetAllRolesQuery } from '@/Redux/features/role/roleApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
const Role = () => {
  const { data: allRoles, isLoading: isAllRolesLoading, isError: isAllRoleError, status: allRoleStatus, error: allRolesError } = useGetAllRolesQuery(undefined,{
    refetchOnMountOrArgChange:true,
  });
  const router = useRouter();
  const statusCode = 404 //allRolesError.data.code
  const { authPermissions } = useAuth();

  if (isAllRoleError) {
    console.log("🚀 ~ Role ~ allRolesError:", allRolesError)
    if (allRolesError.data.code === statusCode) {
      router.push('/errors/not-found');
      toast.error(allRolesError?.data?.message)
    } else if (allRolesError.data.code === statusCode) {
      router.push('/errors/access-denied');
      toast.error(allRolesError?.data?.message)
    } else {
      console.log("🚀 ~ Role ~ allRolesError:", allRolesError.data.code)
    }
  }



  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      {/* Recent Shoots */}
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-white-light">All Roles</h5>
          <div className="space-x-2">
            {authPermissions?.includes('add_role') && (
              <Link href={'/dashboard/role/add-role'} className='px-3 py-1 rounded border border-black focus:border-black focus:outline-none'>Add</Link>
            )}
            <input type="text" className='px-3 py-1 rounded border border-black focus:border-black focus:outline-none' placeholder='Search...' />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="text-[16px] font-semibold ltr:rounded-l-md rtl:rounded-r-md">Role</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md w-[70%]">Permissions</th>
                <th className="text-[16px] font-semibold">Action</th>
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
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/ps.svg" alt="avatar" />
                            <div className="flex">
                              <div className='block'>{role?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className='flex flex-wrap gap-2 w-[70%]'>
                          {role?.permissions && role?.permissions?.length > 0 && role?.permissions?.map((permission: string, index: number) => (
                            <div className="" key={index}>
                              <div className="">
                                <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent capitalize">{permission}</span>
                              </div>
                            </div>
                          ))}
                        </td>
                        <td>
                          {authPermissions?.includes('edit_role') && (
                            <Link href={`/dashboard/role/edit-role/${role?._id}`}>
                              <button type="button" className="p-0">
                                <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                              </button>
                            </Link>
                          )}
                        </td>
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
