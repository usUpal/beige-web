import React from 'react'
import { useGetAllPermissionsQuery } from '@/Redux/features/role/roleApi';
import { useGetErrorStatusQuery } from '@/Redux/features/role/roleApi';
const PermissionDocs = () => {
  const { data: allPermissions, isLoading: isGetPermissionLoading, isSuccess: isPostPermissionSuccess } = useGetAllPermissionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: data } = useGetErrorStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log("🚀 ~ PermissionDocs ~ data:", data)


  return (
    <div>
      <ul>
        {allPermissions && allPermissions?.map((module: any, index: number) => (
          <div key={index}>
            <li className='text-lg font-semibold'>{module?.module_name}</li>
            {module?.permissions && module?.permissions?.map((permission:any,index:number) => (
              <div key={index} className='ml-10'>
                <p>{permission?.name} --- <span className='text-xs'>{permission?.key}</span></p>
              </div>
            ))}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default PermissionDocs
