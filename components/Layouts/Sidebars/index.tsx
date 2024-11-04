import React from 'react';
import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import { menuData } from '@/store/menuBuilder';
import { useAuth } from '@/contexts/authContext';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const SidebarManager = (props: any) => {
  const { currentMenu, toggleMenu } = props;
  const { userData, authPermissions } = useAuth();
  return (
    <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
      {authPermissions?.includes('dashboard_page') && (
        <li className="menu nav-item">
          <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
            <div className="flex items-center">
              {allSvgs.bookNowSvg}
              <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
            </div>

            <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>{allSvgs.greaterThanArrowSvg}</div>
          </button>

          <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
            <ul className="sub-menu text-gray-500">
              <li>
                <Link href="/">Overview</Link>
              </li>
            </ul>
          </AnimateHeight>
        </li>
      )}

      <li className="nav-item">
        <ul>
          {authPermissions?.includes('booking_page') && (
            <li className="nav-item">
              {/* <Link href='/dashboard/bookNow' className='group'> */}
              <Link href="/dashboard/book-now" className="group">
                <div className="flex items-center">
                  {allSvgs.bookingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Book Now</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('shoot_page') && (
            <li className="nav-item">
              <Link href="/dashboard/shoots" className="group">
                <div className="flex items-center">
                  {allSvgs.shootsLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Shoots</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('add_ons_page') && (
            <li className="nav-item">
              <Link href="/dashboard/addons" className="group">
                <div className="flex items-center">
                  {allSvgs.addonsSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Add-ons</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('meeting_page') && (
            <li className="nav-item">
              <Link href="/dashboard/meetings" className="group">
                <div className="flex items-center">
                  {allSvgs.mettingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Meetings</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('chat_page') && (
            <li className="nav-item">
              <Link href="/dashboard/chat" className="group">
                <div className="flex items-center">
                  {allSvgs.chatSvg}
                  <span className=" text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Chat</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('file_manager_page') && (
            <li className="nav-item">
              <Link href="/dashboard/fileManager" className="group">
                <div className="flex items-center">
                  {allSvgs.filesSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">File Manager</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('transactions_page') && (
            <li className="nav-item">
              <Link href="/dashboard/transactions" className="group">
                <div className="flex items-center">
                  {allSvgs.transactionsSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Transactions</span>
                </div>
              </Link>
            </li>
          )}

          {authPermissions?.includes('disputes_page') && (
            <li className="nav-item">
              <Link href="/dashboard/disputes" className="group">
                <div className="flex items-center">
                  {allSvgs.disputesSvg}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Disputes</span>
                </div>
              </Link>
            </li>
          )}

          {(authPermissions?.includes('searching_params') || authPermissions?.includes('pricing_params')) && (
            <li className="menu nav-item">
              <button type="button" className="nav-link group w-full" onClick={() => toggleMenu('settings')}>
                <div className="flex items-center">
                  {allSvgs.settingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Settings</span>
                </div>

                <div className={currentMenu === 'settings' ? 'rotate-90' : 'rtl:rotate-180'}>{allSvgs.greaterThanArrowSvg}</div>
              </button>

              <AnimateHeight duration={300} height={currentMenu === 'settings' ? 'auto' : 0}>
                <ul className="sub-menu flex flex-col text-gray-500 ">
                  {authPermissions?.includes('searching_params') && (
                    <li>
                      <Link href="/dashboard/searching-params">Set Searching Params</Link>
                    </li>
                  )}
                  {authPermissions?.includes('pricing_params') && (
                    <li>
                      <Link href="/dashboard/pricing-params">Set Pricing Params</Link>
                    </li>
                  )}
                </ul>
              </AnimateHeight>
            </li>
          )}

          {(authPermissions?.includes('all_users') || authPermissions?.includes('content_provider') || authPermissions?.includes('client_page')) && (
            <li className="nav-item">
              <button type="button" className="nav-link group w-full" onClick={() => toggleMenu('users')}>
                <div className="flex items-center">
                  {allSvgs.userLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Users</span>
                </div>

                <div className={currentMenu === 'users' ? 'rotate-90' : 'rtl:rotate-180'}>{allSvgs.greaterThanArrowSvg}</div>
              </button>

              <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                <ul className="sub-menu flex flex-col leading-3 text-gray-500 ">
                  {authPermissions?.includes('all_users') && (
                    <li>
                      <Link href="/dashboard/all-users">
                        <span>All Users</span>
                      </Link>
                    </li>
                  )}

                  {authPermissions?.includes('content_provider') && (
                    <li>
                      <Link href="/dashboard/cp">Content Provider</Link>
                    </li>
                  )}
                  {authPermissions?.includes('client_page') && (
                    <li>
                      <Link href="/dashboard/clients">Client</Link>
                    </li>
                  )}
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
          )}

          {authPermissions?.includes('role_page') && (
            <li className="nav-item">
              <Link href="/dashboard/role" className="group">
                <div className="flex items-center">
                  {allSvgs.mettingLinkIcon}
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Role Management</span>
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
