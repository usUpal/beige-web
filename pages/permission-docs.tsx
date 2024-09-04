import React from 'react'
import { useGetAllPermissionsQuery } from '@/Redux/features/role/roleApi';
import { useGetErrorStatusQuery } from '@/Redux/features/role/roleApi';
const PermissionDocs = () => {
  const { data: allPermissions, isLoading: isGetPermissionLoading, isSuccess: isPostPermissionSuccess } = useGetAllPermissionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // const { data: data } = useGetErrorStatusQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });

  const permissionEndpoint = (permission: any) => {
    switch (permission) {
      case 'dashboard_page':
        return "n/a"
        break;

      case 'booking_page':
        return "Method : POST , Endpoint : orders"
        break;

      case 'shoot_page':
        return "Method : GET , Endpoint : orders"
        break;

      case 'shoot_show_details':
        return "Method : GET , Endpoint : orders/:id"
        break;

      case 'add_ons_page':
        return "Method : GET , Endpoint : addOns"
        break;

      case 'new_add_ons':
        return "Method : POST , Endpoint : addOns"
        break;

      case 'add_ons_edit':
        return "Method : GET , Endpoint : addOns/:id"
        break;

      case 'meeting_page':
        return "Method : GET , Endpoint : meetings"
        break;

      case 'meeting_details':
        return "Method : GET , Endpoint : meetings/:id"
        break;

      case 'meeting_details_reschedule':
        return "Method : GET , Endpoint : meetings/schedule/:id"
        break;

      case 'chat_page':
        return "Method : GET , Endpoint : chats"
        break;

        case 'file_manager_page':
          return "n/a"
          break;

          case 'file_settings':
            return "n/a"
            break;

          case 'transactions_page':
            return "Method : GET , Endpoint : payout"
            break;

            case 'edit_transactions':
            return "n/a"
            break;

            case 'all_users':
            return "Method : GET , Endpoint : users"
            break;

            case 'edit_all_users':
            return "Method : GET , Endpoint : users/:id"
            break;

            case 'content_provider':
            return "Method : GET , Endpoint : cp"
            break;

            case 'edit_content_provider':
            return "Method : GET , Endpoint : cp/:id"
            break;

            case 'client_page':
            return "Method : GET , Endpoint : users"
            break;

            case 'client_edit':
            return "Method : GET , Endpoint : users/:id"
            break;

            case 'client_edit':
            return "Method : GET , Endpoint : users/:id"
            break;

            case 'role_page':
            return "Method : GET , Endpoint : roles"
            break;

            case 'edit_role':
            return "Method : GET , Endpoint : roles/:id"
            break;

            case 'delete_role':
            return "Method : DELETE , Endpoint : roles/:id"
            break;
      default:
        break;
    }
  }



  return (
    <div>
      <ul>
        {allPermissions && allPermissions?.map((module: any, index: number) => (
          <div key={index}>
            <li className='text-lg font-semibold'>{module?.module_name}</li>
            {module?.permissions && module?.permissions?.map((permission: any, index: number) => (
              <div key={index} className='ml-10'>
                <p>{permission?.name} --- {permissionEndpoint(permission?.key)} ---<span className='text-xs'>{permission?.key}</span></p>
              </div>
            ))}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default PermissionDocs
