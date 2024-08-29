import React from 'react';
import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import { menuData } from '@/store/menuBuilder';
import { useAuth } from '@/contexts/authContext';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const SidebarManager = (props: any) => {
  const { currentMenu, toggleMenu } = props;
  const { userData } = useAuth();
  console.log("🚀 ~ SidebarManager ~ userData:", userData)
  // const isAccessible = (item: any) => item.inAccessible.includes(userData.role);
  return (

    <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
      {userData?.permissions?.includes('dashboard') && (
        <li className="menu nav-item">
          <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
            <div className="flex items-center">
              {allSvgs.bookNowSvg}
              <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
            </div>

            <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
            <ul className="sub-menu text-gray-500">
              <li>
                <Link href="/">Manager Dashboard</Link>
              </li>
            </ul>
          </AnimateHeight>
        </li>

      )}

      <li className="nav-item">
        <ul>
          {userData?.permissions?.includes('book_now') && (
            <li className="nav-item">
              {/* <Link href='/dashboard/bookNow' className='group'> */}
              <Link href="/manager/bookNow" className="group">
                <div className="flex items-center">
                  {allSvgs.bookingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Book Now</span>
                </div>
              </Link>
            </li>
          )}

          {userData?.permissions?.includes('shoots') && (
            <li className="nav-item">
              <Link href="/dashboard/shoots" className="group">
                <div className="flex items-center">
                  {allSvgs.shootsLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Shoots</span>
                </div>
              </Link>
            </li>
          )}

          {userData?.permissions?.includes('add_ons') && (
            <li className="nav-item">
              <Link href="/manager/addons" className="group">
                <div className="flex items-center">
                  {allSvgs.addonsSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Add-ons</span>
                </div>
              </Link>
            </li>
          )}

          {userData?.permissions?.includes('meetings') && (
            <li className="nav-item">
              <Link href="/dashboard/meetings" className="group">
                <div className="flex items-center">
                  {allSvgs.mettingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Meetings</span>
                </div>
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link href="/dashboard/chat" className="group">
              <div className="flex items-center">
                {allSvgs.chatSvg}
                <span className=" text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Chat</span>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard/fileManager" className="group">
              <div className="flex items-center">
                {allSvgs.filesSvg}
                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">File Manager</span>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard/transactions" className="group">
              <div className="flex items-center">
                {allSvgs.transactionsSvg}
                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Transactions</span>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard/disputes" className="group">
              <div className="flex items-center">
                {allSvgs.disputesSvg}
                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Disputes</span>
              </div>
            </Link>
          </li>
          <li className="menu nav-item">
            <button type="button" className="nav-link group w-full" onClick={() => toggleMenu('settings')}>
              <div className="flex items-center">
                {allSvgs.settingLinkIcon}
                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Settings</span>
              </div>

              <div className={currentMenu === 'settings' ? 'rotate-90' : 'rtl:rotate-180'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            <AnimateHeight duration={300} height={currentMenu === 'settings' ? 'auto' : 0}>
              <ul className="sub-menu flex flex-col text-gray-500 ">
                <li>
                  <Link href="/dashboard/searchingParams">Set Searching Params</Link>
                </li>
                {/* <li>
                  <Link href="/dashboard/pricingParams">Set Pricing Params</Link>
                </li> */}
              </ul>
            </AnimateHeight>
          </li>

          <li className="nav-item">
            <button type="button" className="nav-link group w-full" onClick={() => toggleMenu('users')}>
              <div className="flex items-center">
                {allSvgs.userLinkIcon}
                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Users</span>
              </div>

              <div className={currentMenu === 'users' ? 'rotate-90' : 'rtl:rotate-180'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
              <ul className="sub-menu flex flex-col leading-3 text-gray-500 ">
                <li>
                  <Link href="/manager/allUsers">
                    <span>All Users</span>
                  </Link>
                </li>
                {/* <Link href="/manager/allUsers">All Users</Link> */}
                <li>
                  <Link href="/manager/cp">Content Provider</Link>
                </li>
                <li>
                  <Link href="/manager/clients">Client</Link>
                </li>
              </ul>
            </AnimateHeight>

            {/*
              <Link href="/manager/users" className="group">
                <div className="flex items-center">
                  {allSvgs.helpSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Users</span>
                </div>
              </Link> */}
          </li>
          {userData?.permissions?.includes('role') && (
            <li className="nav-item">
              <Link href="/dashboard/role" className="group">
                <div className="flex items-center">
                  {allSvgs.mettingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Role</span>
                </div>
              </Link>
            </li>
          )}

        </ul>
      </li>
    </ul>
  );
};

export default SidebarManager;
