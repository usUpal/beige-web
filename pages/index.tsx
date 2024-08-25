import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/authContext';

const Index = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
  });

  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  const { userData } = useAuth();

  const DashboardWrapper = () => {

    // let DashboardComponent;

    // switch (userData?.role) {
    //   case 'cp':
    //     DashboardComponent = dynamic(() => import('@/components/Dashboards/DashboardCP'));
    //     break;
    //   case 'user':
    //     DashboardComponent = dynamic(() => import('@/components/Dashboards/DashboardClient'));
    //     break;
    //   default:
    //     DashboardComponent = dynamic(() => import('@/components/Dashboards/DashboardManager'));
    // }

    const DashboardComponent = dynamic(() => import('@/components/Dashboard'));

    return <DashboardComponent isDark={isDark} isRtl={isRtl} isMounted={isMounted} />;
  };


  return (
    <DashboardWrapper />
  );
};

export default Index;
