import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Setting from './Setting';
import Portals from '../../components/Portals';
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';

import { allSvgs } from '@/utils/allsvgs/allSvgs';
config.autoAddCss = false;

const DefaultLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const [animation, setAnimation] = useState(themeConfig.animation);
  const dispatch = useDispatch();

  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const onScrollHandler = () => {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollHandler, { passive: true });

    const screenLoader = document.getElementsByClassName('screen_loader');
    if (screenLoader?.length) {
      setTimeout(() => {
        setShowLoader(false);
      }, 200);
    }

    router.events.on('beforeHistoryChange', () => {
      setAnimation(themeConfig.animation);
    });
    return () => {
      window.removeEventListener('onscroll', onScrollHandler);
    };
  });

  useEffect(() => {
    setAnimation(themeConfig.animation);
  }, [themeConfig.animation]);

  useEffect(() => {
    setTimeout(() => {
      setAnimation('');
    }, 1100);
  }, [router.asPath]);

  return (
    <App>
      {/* BEGIN MAIN CONTAINER */}
      <div className="relative">
        {/* screen loader  */}
        {showLoader && <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">{allSvgs.defaultLoadingIcon}</div>}
        {/* sidebar menu overlay */}
        <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 z-50 bg-[black]/60 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
        <div className="fixed bottom-6 z-50 ltr:right-6 rtl:left-6">
          {showTopButton && (
            <button type="button" className="btn btn-outline-primary animate-pulse rounded-full bg-[#fafafa] p-2 dark:bg-[#060818] dark:hover:bg-primary" onClick={goToTop}>
              {allSvgs.goToTopArrowSvg}
            </button>
          )}
        </div>
        {/* BEGIN APP SETTING LAUNCHER */}
        <Setting />
        {/* END APP SETTING LAUNCHER */}
        <div className={`${themeConfig.navbar} main-container min-h-screen text-black dark:text-white-dark`}>
          {/* BEGIN SIDEBAR */}
          <Sidebar />
          {/* END SIDEBAR */}
          <div className="main-content flex min-h-screen flex-col">
            {/* BEGIN TOP NAVBAR */}
            <Header />
            {/* END TOP NAVBAR */}

            {/* BEGIN CONTENT AREA */}
            <div className={`${animation} animate__animated p-6`}>{children}</div>
            {/* END CONTENT AREA */}

            {/* BEGIN FOOTER */}
            <Footer />
            {/* END FOOTER */}
            <Portals />
          </div>
        </div>
      </div>
    </App>
  );
};

export default DefaultLayout;
