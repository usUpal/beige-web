export const role = [
  {
    id: '66433c13fe81f28010ef0123',
    name: 'admin',
    key: 'admin',
    is_delete: false,
    details: 'This is admin . He get all access',
  },
  {
    id: '66433c13fe81f28010ef0122',
    name: 'Cp',
    key: 'cp',
    is_delete: true,
    details: 'This is CP . He get Content Produce Access',
  },
  {
    id: '66433c13fe81f28010ef0123',
    name: 'User',
    key: 'user',
    is_delete: true,
    details: 'This is User . He can get Some Access',
  },
  {
    id: '66433c13fe81f28010ef0124',
    name: 'Staff',
    key: 'staff',
    is_delete: true,
    details: 'This is Staff . He can get Official Access',
  },
];

export const allPermissions = [
  {
    module_name: 'Dashboard',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0192',
        key: 'dashboard_page',
        name: 'Access dashboard page',
        status: true,
      },
    ],
  },
  {
    module_name: 'Booking',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0182',
        key: 'booking_page',
        name: 'Access booking page',
        status: true,
      },
    ],
  },
  {
    module_name: 'Shoot',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0172',
        key: 'shoot_page',
        name: 'Access shoot page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0162',
        key: 'show_details',
        name: 'Show shoot details',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0152',
        key: 'update_shoot_details_status',
        name: 'Update shoot details status',
        status: true,
      },
    ],
  },
  {
    module_name: 'Meeting',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0142',
        key: 'meeting_page',
        name: 'Access meeting page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0132',
        key: 'meeting_details',
        name: 'Show meeting details',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0112',
        key: 'meeting_details_reschedule',
        name: 'Reschedule meeting details',
        status: true,
      },
    ],
  },
  {
    module_name: 'Role',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0129',
        key: 'role_page',
        name: 'Access Role Page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0128',
        key: 'add_role',
        name: 'Create a new role',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0127',
        key: 'edit_role',
        name: 'Edit a new role',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0126',
        key: 'delete_role',
        name: 'Delete a new role',
        status: true,
      },
    ],
  },
  {
    module_name: 'Chat',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0125',
        key: 'chat_page',
        name: 'Access Chat page',
        status: true,
      },
    ],
  },
  {
    module_name: 'File Manager',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0124',
        key: 'file_manager_page',
        name: 'Access Chat page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0122',
        key: 'file_settings',
        name: 'File Settings',
        status: true,
      },
    ],
  },
  {
    module_name: 'Transactions',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0121',
        key: 'transactions_page',
        name: 'Access Transactions page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0123',
        key: 'edit_transactions',
        name: 'Edit Transaction',
        status: true,
      },
    ],
  },
  {
    module_name: 'Disputes',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0221',
        key: 'disputes_page',
        name: 'Access disputes page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0223',
        key: 'show_disputes',
        name: 'Show Disputes',
        status: true,
      },
    ],
  },
  {
    module_name: 'Setting',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0222',
        key: 'searching_params',
        name: 'Access searching params page',
        status: true,
      },
    ],
  },
  {
    module_name: 'Users',
    permissions: [
      {
        _id: '66433c13fe81f28010ef0224',
        key: 'all_users',
        name: 'Access all user page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0224',
        key: 'edit_all_users',
        name: 'Edit all user',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0225',
        key: 'content_provider',
        name: 'Access content provider page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0224',
        key: 'edit_content_provider',
        name: 'Edit content provider',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0225',
        key: 'client_page',
        name: 'Access client page',
        status: true,
      },
      {
        _id: '66433c13fe81f28010ef0225',
        key: 'client_edit',
        name: 'Edit content',
        status: true,
      },
    ],
  },
];

const myPer = [
  {
    order: 1,
    module_name: 'Dashboard',
    permissions: [
      {
        key: 'dashboard_page',
        name: 'Access dashboard page',
        status: true,
      },
    ],
  },
  {
    order: 2,
    module_name: 'Booking',
    permissions: [
      {
        key: 'booking_page',
        name: 'Access booking page',
        status: true,
      },
    ],
  },
  {
    order: 3,
    module_name: 'Shoot',
    permissions: [
      {
        key: 'shoot_page',
        name: 'Access shoot page',
        status: true,
      },
      {
        key: 'shoot_download',
        name: 'Download Shoot',
        status: true,
      },
      {
        key: 'shoot_show_details',
        name: 'Show Details',
        status: true,
      },
      {
        key: 'shoot_meeting_schedule',
        name: 'Show shoot details',
        status: true,
      },
    ],
  },
  {
    order: 4,
    module_name: 'Add-ons',
    permissions: [
      {
        key: 'add_ons_page',
        name: 'Add-ons page',
        status: true,
      },
      {
        key: 'new_add_ons',
        name: 'New Add-ons',
        status: true,
      },
      {
        key: 'add_ons_edit',
        name: 'Add-ons Edit',
        status: true,
      },
    ],
  },
  {
    order: 5,
    module_name: 'Meeting',
    permissions: [
      {
        key: 'meeting_page',
        name: 'Meeting Page',
        status: true,
      },
      {
        key: 'meeting_details',
        name: 'Meeting details',
        status: true,
      },
      {
        key: 'meeting_details_reschedule',
        name: 'Meeting reschedule',
        status: true,
      },
    ],
  },
  {
    order: 6,
    module_name: 'Chat',
    permissions: [
      {
        key: 'chat_page',
        name: 'Access Chat page',
        status: true,
      },
    ],
  },
  {
    order: 7,
    module_name: 'File Manager',
    permissions: [
      {
        key: 'file_manager_page',
        name: 'Access file manager page',
        status: true,
      },
      {
        key: 'file_settings',
        name: 'File Settings',
        status: true,
      },
    ],
  },
  {
    order: 8,
    module_name: 'Transactions',
    permissions: [
      {
        key: 'transactions_page',
        name: 'Access Transactions page',
        status: true,
      },
      {
        key: 'edit_transactions',
        name: 'Edit Transaction',
        status: true,
      },
    ],
  },
  {
    order: 9,
    module_name: 'Disputes',
    permissions: [
      {
        key: 'disputes_page',
        name: 'Access disputes page',
        status: true,
      },
    ],
  },
  {
    order: 10,
    module_name: 'Users',
    permissions: [
      {
        key: 'all_users',
        name: 'Access all user page',
        status: true,
      },
      {
        key: 'edit_all_users',
        name: 'Edit all user',
        status: true,
      },
      {
        key: 'content_provider',
        name: 'Access content provider page',
        status: true,
      },
      {
        key: 'edit_content_provider',
        name: 'Edit content provider',
        status: true,
      },
      {
        key: 'client_page',
        name: 'Access client page',
        status: true,
      },
      {
        key: 'client_edit',
        name: 'Edit content',
        status: true,
      },
      {
        key: 'user_page',
        name: 'Access user page',
        status: true,
      },
      {
        key: 'user_edit',
        name: 'Edit user',
        status: true,
      },
    ],
  },
  {
    order: 11,
    module_name: 'Role',
    permissions: [
      {
        key: 'role_page',
        name: 'Access Role Page',
        status: true,
      },
      {
        key: 'add_role',
        name: 'Create a new role',
        status: true,
      },
      {
        key: 'edit_role',
        name: 'Edit a new role',
        status: true,
      },
      {
        key: 'delete_role',
        name: 'Delete a new role',
        status: true,
      },
    ],
  },
];
