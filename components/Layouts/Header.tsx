import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import { toggleLocale, toggleTheme, toggleSidebar, toggleRTL } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import { useAuth } from '@/contexts/authContext';
import Cookies from 'js-cookie';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const Header = () => {
  const router = useRouter();
  const { userData, setUserData, setAccessToken, setRefreshToken } = useAuth();

  const handleLogout = async () => {
    //Remove cookies
    Cookies.remove('userData');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    //Reset context states
    setUserData(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
    if (selector) {
      const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active');
      }

      let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove('active');
      }
      selector?.classList.add('active');

      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add('active');
          });
        }
      }
    }
  }, [router.pathname]);

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const setLocale = (flag: string) => {
    setFlag(flag);
    if (flag.toLowerCase() === 'ae') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
  };
  const [flag, setFlag] = useState('');
  useEffect(() => {
    setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
  }, []);
  const dispatch = useDispatch();

  function createMarkup(messages: any) {
    return { __html: messages };
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
      title: 'Congratulations!',
      message: 'Your OS has been updated.',
      time: '1hr',
    },
    {
      id: 2,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
      title: 'Did you know?',
      message: 'You can switch between artboards.',
      time: '2hr',
    },
    {
      id: 3,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
      title: 'Something went wrong!',
      message: 'Send Reposrt',
      time: '2days',
    },
    {
      id: 4,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
      title: 'Warning',
      message: 'Your password strength is low.',
      time: '5days',
    },
  ]);

  const removeMessage = (value: number) => {
    setMessages(messages.filter((user) => user.id !== value));
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: 'user-profile.jpeg',
      message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: '45 min ago',
    },
    {
      id: 2,
      profile: 'profile-34.jpeg',
      message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
      time: '9h Ago',
    },
    {
      id: 3,
      profile: 'profile-16.jpeg',
      message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
      time: '9h Ago',
    },
  ]);

  const removeNotification = (value: number) => {
    setNotifications(notifications.filter((user) => user.id !== value));
  };

  const [search, setSearch] = useState(false);

  const { t, i18n } = useTranslation();

  let userProfileImage;
  if(userData?.profile_image){
    userProfileImage = <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />

  }else{
    userProfileImage = <span className='w-8 h-8 rounded-full font-bold flex justify-center items-center object-cover bg-slate-400 text-white capitalize'>{userData?.name[0] ?? 'NA'}</span>
  }

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/favicon.svg" alt="logo" />
              <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">BEIGE</span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              {allSvgs.toggleMenuExpandSvg}
            </button>
          </div>
          <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
            {/* <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  allSvgs.messageIconSvg
                }
              >
                <ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[375px]">
                  <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                    <div className="relative !h-[68px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
                      <div className="bg- absolute inset-0 h-full w-full bg-[url(/assets/images/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
                      <h4 className="relative z-10 text-lg font-semibold">Messages asdfasdf</h4>
                    </div>
                  </li>
                  {messages.length > 0 ? (
                    <>
                      <li onClick={(e) => e.stopPropagation()}>
                        {messages.map((message) => {
                          return (
                            <div key={message.id} className="flex items-center px-5 py-3">
                              <div dangerouslySetInnerHTML={createMarkup(message.image)}></div>
                              <span className="px-3 dark:text-gray-500">
                                <div className="text-sm font-semibold dark:text-white-light/90">{message.title}</div>
                                <div>{message.message}</div>
                              </span>

                              <span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:ml-2 rtl:mr-auto dark:text-white-dark">
                                {message.time}
                              </span>

                              <button type="button" className="text-neutral-300 hover:text-danger" onClick={() => removeMessage(message.id)}>
                                {allSvgs.notificationCancelRoundXBtnSvg}
                              </button>
                            </div>
                          );
                        })}
                      </li>
                      <li className="mt-5 border-t border-white-light text-center dark:border-white/10">
                        <button type="button" className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400">
                          <span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL ACTIVITIES</span>
                          {allSvgs.viewAllActivitiesArrow}
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                        <div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
                          {allSvgs.invalidSvg}
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div> */}
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    {allSvgs.notificationBtnSvg}
                    <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                      <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                      <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                    </span>
                  </span>
                }
              >
                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-2 font-semibold">
                      <h4 className="text-lg">Notification</h4>
                      {notifications.length ? <span className="badge bg-primary/80">{notifications.length}New</span> : ''}
                    </div>
                  </li>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => {
                        return (
                          <li key={notification.id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                            <div className="group flex items-center px-4 py-2">
                              <div className="grid place-content-center rounded">
                                <div className="relative h-12 w-12">
                                  <img className="h-12 w-12 rounded-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
                                  <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                </div>
                              </div>
                              <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                <div className="ltr:pr-3 rtl:pl-3">
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: notification.message,
                                    }}
                                  ></h6>
                                  <span className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
                                </div>
                                <button
                                  type="button"
                                  className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  {allSvgs.notificationCancelRoundXBtnSvg}
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      <li>
                        <div className="p-4">
                          <button className="btn btn-primary btn-small block w-full">Read All Notifications</button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                        <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                          {allSvgs.invalidNotificationCrossBtnSvg}
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={userProfileImage }
              >
                {console.log("User Info From Header : ",userData)}
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <Link href="/dashboard/profile">
                        <span className='w-9 h-9 rounded-full font-bold flex justify-center items-center object-cover bg-slate-400 text-white'>{userData?.name[0] ?? 'NA'}</span>
                        {/* <img className="h-10 w-10 rounded-md object-cover"  src={'/assets/images/favicon.png'}  alt="userProfile" /> */}
                      </Link>
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <Link href="/dashboard/profile" className="text-black">
                          <h4 className="text-base">{userData && userData?.name}</h4>
                        </Link>
                        <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                          {userData && userData?.email}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li onClick={handleLogout} className="border-t border-white-light dark:border-white-light/10">
                    <Link href="/" className="!py-3 text-danger">
                      {allSvgs.signOutSvg}
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* horizontal menu */}
        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.horizontalMenuDashboardSvg}
                <span className="px-1">{t('dashboard')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/">{t('sales')}</Link>
              </li>
              <li>
                <Link href="/analytics">{t('analytics')}</Link>
              </li>
              <li>
                <Link href="/finance">{t('finance')}</Link>
              </li>
              <li>
                <Link href="/crypto">{t('crypto')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.horizontalAppsIconSvg}
                <span className="px-1">{t('apps')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/apps/chat">{t('chat')}</Link>
              </li>
              <li>
                <Link href="/apps/mailbox">{t('mailbox')}</Link>
              </li>
              <li>
                <Link href="/apps/todolist">{t('todo_list')}</Link>
              </li>
              <li>
                <Link href="/apps/notes">{t('notes')}</Link>
              </li>
              <li>
                <Link href="/apps/scrumboard">{t('scrumboard')}</Link>
              </li>
              <li>
                <Link href="/apps/contacts">{t('contacts')}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('invoice')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    {allSvgs.greaterThanArrowSvg}
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/apps/invoice/list">{t('list')}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/preview">{t('preview')}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/add">{t('add')}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/edit">{t('edit')}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/apps/calendar">{t('calendar')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.diceForComponentsHorizontalMenuSvg}
                <span className="px-1">{t('components')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/components/tabs">{t('tabs')}</Link>
              </li>
              <li>
                <Link href="/components/accordions">{t('accordions')}</Link>
              </li>
              <li>
                <Link href="/components/modals">{t('modals')}</Link>
              </li>
              <li>
                <Link href="/components/cards">{t('cards')}</Link>
              </li>
              <li>
                <Link href="/components/carousel">{t('carousel')}</Link>
              </li>
              <li>
                <Link href="/components/countdown">{t('countdown')}</Link>
              </li>
              <li>
                <Link href="/components/counter">{t('counter')}</Link>
              </li>
              <li>
                <Link href="/components/sweetalert">{t('sweet_alerts')}</Link>
              </li>
              <li>
                <Link href="/components/timeline">{t('timeline')}</Link>
              </li>
              <li>
                <Link href="/components/notifications">{t('notifications')}</Link>
              </li>
              <li>
                <Link href="/components/media-object">{t('media_object')}</Link>
              </li>
              <li>
                <Link href="/components/list-group">{t('list_group')}</Link>
              </li>
              <li>
                <Link href="/components/pricing-table">{t('pricing_tables')}</Link>
              </li>
              <li>
                <Link href="/components/lightbox">{t('lightbox')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.elementsSvg}
                <span className="px-1">{t('elements')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/elements/alerts">{t('alerts')}</Link>
              </li>
              <li>
                <Link href="/elements/avatar">{t('avatar')}</Link>
              </li>
              <li>
                <Link href="/elements/badges">{t('badges')}</Link>
              </li>
              <li>
                <Link href="/elements/breadcrumbs">{t('breadcrumbs')}</Link>
              </li>
              <li>
                <Link href="/elements/buttons">{t('buttons')}</Link>
              </li>
              <li>
                <Link href="/elements/buttons-group">{t('button_groups')}</Link>
              </li>
              <li>
                <Link href="/elements/color-library">{t('color_library')}</Link>
              </li>
              <li>
                <Link href="/elements/dropdown">{t('dropdown')}</Link>
              </li>
              <li>
                <Link href="/elements/infobox">{t('infobox')}</Link>
              </li>
              <li>
                <Link href="/elements/jumbotron">{t('jumbotron')}</Link>
              </li>
              <li>
                <Link href="/elements/loader">{t('loader')}</Link>
              </li>
              <li>
                <Link href="/elements/pagination">{t('pagination')}</Link>
              </li>
              <li>
                <Link href="/elements/popovers">{t('popovers')}</Link>
              </li>
              <li>
                <Link href="/elements/progress-bar">{t('progress_bar')}</Link>
              </li>
              <li>
                <Link href="/elements/search">{t('search')}</Link>
              </li>
              <li>
                <Link href="/elements/tooltips">{t('tooltips')}</Link>
              </li>
              <li>
                <Link href="/elements/treeview">{t('treeview')}</Link>
              </li>
              <li>
                <Link href="/elements/typography">{t('typography')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.tablesSvgIcon}
                <span className="px-1">{t('tables')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/tables">{t('tables')}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('datatables')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    {allSvgs.greaterThanArrowSvg}
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/datatables/basic">{t('basic')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/advanced">{t('advanced')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/skin">{t('skin')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/order-sorting">{t('order_sorting')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/multi-column">{t('multi_column')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/multiple-tables">{t('multiple_tables')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/alt-pagination">{t('alt_pagination')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/checkbox">{t('checkbox')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/range-search">{t('range_search')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/export">{t('export')}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/column-chooser">{t('column_chooser')}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.formsSvgIcon}
                <span className="px-1">{t('forms')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/forms/basic">{t('basic')}</Link>
              </li>
              <li>
                <Link href="/forms/input-group">{t('input_group')}</Link>
              </li>
              <li>
                <Link href="/forms/layouts">{t('layouts')}</Link>
              </li>
              <li>
                <Link href="/forms/validation">{t('validation')}</Link>
              </li>
              <li>
                <Link href="/forms/input-mask">{t('input_mask')}</Link>
              </li>
              <li>
                <Link href="/forms/select2">{t('select2')}</Link>
              </li>
              <li>
                <Link href="/forms/touchspin">{t('touchspin')}</Link>
              </li>
              <li>
                <Link href="/forms/checkbox-radio">{t('checkbox_and_radio')}</Link>
              </li>
              <li>
                <Link href="/forms/switches">{t('switches')}</Link>
              </li>
              <li>
                <Link href="/forms/wizards">{t('wizards')}</Link>
              </li>
              <li>
                <Link href="/forms/file-upload">{t('file_upload')}</Link>
              </li>
              <li>
                <Link href="/forms/quill-editor">{t('quill_editor')}</Link>
              </li>
              <li>
                <Link href="/forms/markdown-editor">{t('markdown_editor')}</Link>
              </li>
              <li>
                <Link href="/forms/date-picker">{t('date_and_range_picker')}</Link>
              </li>
              <li>
                <Link href="/forms/clipboard">{t('clipboard')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                {allSvgs.pagesIconSvg}
                <span className="px-1">{t('pages')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.downArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li className="relative">
                <button type="button">
                  {t('users')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    {allSvgs.greaterThanArrowSvg}
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/users/profile">{t('profile')}</Link>
                  </li>
                  <li>
                    <Link href="/users/user-account-settings">{t('account_settings')}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/pages/knowledge-base">{t('knowledge_base')}</Link>
              </li>
              <li>
                <Link href="/pages/contact-us-boxed" target="_blank">
                  {t('contact_us_boxed')}
                </Link>
              </li>
              <li>
                <Link href="/pages/contact-us-cover" target="_blank">
                  {t('contact_us_cover')}
                </Link>
              </li>
              <li>
                <Link href="/pages/faq">{t('faq')}</Link>
              </li>
              <li>
                <Link href="/pages/coming-soon-boxed" target="_blank">
                  {t('coming_soon_boxed')}
                </Link>
              </li>
              <li>
                <Link href="/pages/coming-soon-cover" target="_blank">
                  {t('coming_soon_cover')}
                </Link>
              </li>
              <li>
                <Link href="/pages/maintenence" target="_blank">
                  {t('maintenence')}
                </Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('error')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/pages/error404" target="_blank">
                      {t('404')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/error500" target="_blank">
                      {t('500')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/error503" target="_blank">
                      {t('503')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('login')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/auth/cover-login" target="_blank">
                      {t('login_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/components/Auth" target="_blank">
                      {t('login_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('register')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/auth/cover-register" target="_blank">
                      {t('register_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-signup" target="_blank">
                      {t('register_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('password_recovery')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/auth/cover-password-reset" target="_blank">
                      {t('recover_id_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-password-reset" target="_blank">
                      {t('recover_id_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('lockscreen')}
                  <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link href="/auth/cover-lockscreen" target="_blank">
                      {t('unlock_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-lockscreen" target="_blank">
                      {t('unlock_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="currentColor" />
                  <path
                    d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="px-1">{t('more')}</span>
              </div>
              <div className="right_arrow">
                {allSvgs.rightArrowSvg}
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/dragndrop">{t('drag_and_drop')}</Link>
              </li>
              <li>
                <Link href="/charts">{t('charts')}</Link>
              </li>
              <li>
                <Link href="/font-icons">{t('font_icons')}</Link>
              </li>
              <li>
                <Link href="/widgets">{t('widgets')}</Link>
              </li>
              <li>
                <Link href="https://vristo.sbthemes.com" target="_blank">
                  {t('documentation')}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
