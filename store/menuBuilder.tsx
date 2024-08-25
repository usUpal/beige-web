import { allSvgs } from '@/utils/allsvgs/allSvgs';

export const menuData = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: allSvgs?.bookNowSvg,
    inAccessible: ['manager'],
    path: null,
    isNested: [
      {
        key: 'manager_dashboard',
        name: 'Manage',
        icon: null,
        path: '/dashboard',
        inAccessible: ['manager'],
      },
      {
        key: 'manager_dashboard',
        name: 'Observation',
        icon: null,
        path: '/observation',
        inAccessible: ['manager'],
      }
    ]
  }, {
    key: 'dashboard',
    name: 'Dashboard',
    icon: allSvgs?.bookNowSvg,
    inAccessible: ['user', 'cp'],
    path: '/',
  }, {
    key: 'book_now',
    name: 'Book Now',
    icon: allSvgs?.bookingLinkIcon,
    inAccessible: ['manager', 'user', 'cp'],
    path: '/bookNow',
  }, {
    key: 'shoots',
    name: 'Shoots',
    icon: allSvgs?.shootSvg,
    inAccessible: ['manager', 'user', 'cp'],
    path: '/shoots',
  }, {
    key: 'add_ons',
    name: 'Add-ons',
    icon: allSvgs?.addonsSvg,
    inAccessible: ['manager', 'cp'],
    path: '/addons',
  }, {
    key: 'settings',
    name: 'Settings',
    icon: allSvgs?.settingLinkIcon,
    inAccessible: ['manager', 'user'],
    path: null,
    isNested: [
      {
        key: 'pricing_setting',
        name: 'Pricing Setting',
        icon: null,
        path: '/',
        inAccessible: ['manager', 'user'],
      },
      {
        key: 'others_settings',
        name: 'Others Settings',
        icon: null,
        path: '/',
        inAccessible: ['manager', 'cp'],
      }
    ]
  },
];
