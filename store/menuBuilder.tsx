import { allSvgs } from '@/utils/allsvgs/allSvgs';

export const menuData = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: allSvgs?.bookNowSvg,
    inAccessible: ['admin'],
    path: null,
    isNested: [
      {
        key: 'manager_dashboard',
        name: 'Manage',
        icon: null,
        path: '/dashboard',
        inAccessible: ['admin'],
      },
      {
        key: 'manager_dashboard',
        name: 'Observation',
        icon: null,
        path: '/observation',
        inAccessible: ['admin'],
      },
    ],
  },
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: allSvgs?.bookNowSvg,
    inAccessible: ['user', 'cp'],
    path: '/dashboard',
  },
  {
    key: 'book_now',
    name: 'Book Now',
    icon: allSvgs?.bookingLinkIcon,
    inAccessible: ['admin', 'user'],
    path: '/dashboard/book-now',
  },
  {
    key: 'shoots',
    name: 'Shoots',
    icon: allSvgs?.shootSvg,
    inAccessible: ['admin', 'user', 'cp'],
    path: '/dashboard/shoots',
  },
  {
    key: 'add_ons',
    name: 'Add-ons',
    icon: allSvgs?.addonsSvg,
    inAccessible: ['admin', 'cp'],
    path: '/dashboard/addons',
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: allSvgs?.settingLinkIcon,
    inAccessible: ['admin', 'user'],
    path: null,
    isNested: [
      {
        key: 'pricing_setting',
        name: 'Pricing Setting',
        icon: null,
        path: '/',
        inAccessible: ['admin', 'user'],
      },
      {
        key: 'others_settings',
        name: 'Others Settings',
        icon: null,
        path: '/',
        inAccessible: ['admin', 'cp'],
      },
    ],
  },
];

