import { useDeleteRoleMutation, useGetAllRolesQuery } from '@/Redux/features/role/roleApi';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import AccessDenied from '@/components/errors/AccessDenied';
import RoleManagementSkeleton from '@/components/skeletons/RoleManageSkeleton';
import { useAuth } from '@/contexts/authContext';
import { IRootState } from '@/store';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Role = () => {
  const { authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('role_page');
  const { isDarkMode } = useSelector((state: IRootState) => state.themeConfig);

  const {
    data: allRoles,
    isLoading: isAllRolesLoading,
    isError: isAllRoleError,
    status: allRoleStatus,
    error: allRolesError,
    refetch,
  } = useGetAllRolesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteRole, { isLoading: isDeleteRoleLoading, isSuccess: isRoleDelteSuccess }] = useDeleteRoleMutation();

  const router = useRouter();
  const statusCode = 404;

  const deletePermission = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteRole(id);
        if (deleteResult?.data) {
          refetch();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
        }
      } catch (error) {
        console.log('🚀 ~ deletePermission ~ error:', error);
      }
    }
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div className="panel h-full w-full">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-xl font-bold dark:text-slate-400">Role Management</h5>
          <Link href={'/dashboard/role/add-role'}>
            <DefaultButton>Add New Role & Permission</DefaultButton>
          </Link>
        </div>

        <div className="table-responsive ">
          <table>
            <thead>
              <tr>
                <th className="text-[16px] font-semibold ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                <th>Role</th>
                <th className="w-[60%] ltr:rounded-r-md rtl:rounded-l-md">Permissions</th>
                {(authPermissions?.includes('edit_role') || authPermissions?.includes('delete_role')) && <th className="text-[16px] font-semibold">Action</th>}
              </tr>
            </thead>
            <tbody>
              {isAllRolesLoading ? (
                <>
                  {/* <PreLoader></PreLoader> */}
                  {Array.from({ length: 9 }).map((_, index) => (
                    <RoleManagementSkeleton key={index} isDarkMode={isDarkMode} />
                  ))}
                </>
              ) : (
                <>
                  {allRoles && allRoles.length > 0 ? (
                    allRoles?.map((role: any, index: number) => (
                      <tr key={index} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                        <td className="min-w-[150px] text-black dark:text-slate-300 group-hover:dark:text-dark-light">
                          <h4>{role?.name}</h4>
                        </td>
                        <td>{role?.role}</td>
                        <td className="flex w-[60%] flex-wrap gap-2">
                          {role?.role === 'admin' ? (
                            <span className="font-semibold text-secondary">Access All Permissions</span>
                          ) : (
                            <>
                              {role?.permissions &&
                                role?.permissions?.length > 0 &&
                                role?.permissions?.map((permission: string, index: number) => (
                                  <div className="" key={index}>
                                    <div className="">
                                      <span className="badge bg-secondary capitalize text-white shadow-md dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-dark-light ">
                                        {permission}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </>
                          )}
                        </td>
                        {(authPermissions?.includes('edit_role') || authPermissions?.includes('delete_role')) && (
                          <td className="">
                            <div className="flex items-center space-x-4">
                              <>
                                {authPermissions?.includes('edit_role') && (
                                  <Link href={`/dashboard/role/edit-role/${role?._id}`}>
                                    <button type="button" className="">
                                      {allSvgs.editPen}
                                    </button>
                                  </Link>
                                )}
                              </>
                              <>
                                {role?.is_delete && (
                                  <>
                                    {authPermissions?.includes('delete_role') && (
                                      <button onClick={() => deletePermission(role?._id)} type="button" className="p-0">
                                        {allSvgs.trash}
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
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
  );
};

export default Role;
