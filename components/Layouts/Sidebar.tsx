import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import dynamic from 'next/dynamic';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const Sidebar = () => {
  const scrollContainerRef = useRef(null);
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
    const container = scrollContainerRef.current;
    const psInstance = container?.__ps?.ps;

    if (psInstance) {
      const originalBind = psInstance.event.bind;
      psInstance.event.bind = (element, event, handler, options = {}) => {
        originalBind.call(psInstance.event, element, event, handler, { ...options, passive: true });
      };
    }
  }, []);

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
    const SidebarComponent = dynamic(() => import('./Sidebars'));
    return <SidebarComponent currentMenu={currentMenu} toggleMenu={toggleMenu} />;
  };

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo">
              <img className="ml-[5px] flex-none" src="/assets/images/beige-logo.svg" alt="logo" />
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              {allSvgs.lessThanArrowIconDoubleLine}
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]" ref={scrollContainerRef}>
            <SidebarWrapper />
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
