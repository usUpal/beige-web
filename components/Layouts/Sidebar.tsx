import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import dynamic from 'next/dynamic';

const Sidebar = () => {

  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

  const { userData } = useAuth();

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [router.pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    selector?.classList.add('active');
  };

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const SidebarWrapper = () => {

    let SidebarComponent;

    switch (userData?.role) {
      case 'cp':
        SidebarComponent = dynamic(() => import('./Sidebars/SidebarCP'));
        break;
      case 'user':
        SidebarComponent = dynamic(() => import('./Sidebars/SidebarClient'));
        break;
      default:
        SidebarComponent = dynamic(() => import('./Sidebars/SidebarManager'));
    }

    return <SidebarComponent currentMenu={currentMenu} toggleMenu={toggleMenu} />;
  };

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className='h-full bg-white dark:bg-black'>
          <div className='flex items-center justify-between px-4 py-3'>
            <Link href='/' className='main-logo'>
              <img className='ml-[5px] flex-none' src='/assets/images/beige-logo.svg' alt='logo' />
            </Link>

            <button
              type='button'
              className='collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10'
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'
                   className='m-auto h-5 w-5'>
                <path d='M13 19L7 12L13 5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'
                      strokeLinejoin='round' />
                <path opacity='0.5' d='M16.9998 19L10.9998 12L16.9998 5' stroke='currentColor' strokeWidth='1.5'
                      strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className='relative h-[calc(100vh-80px)]'>
            <SidebarWrapper/>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
