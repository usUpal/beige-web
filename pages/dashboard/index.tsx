import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import dynamic from 'next/dynamic';

const Dashboard = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
  });

  useEffect(() => {
    setIsMounted(true);
  });

  const DashboardWrapper = () => {
    const DashboardComponent = dynamic(() => import('@/components/Dashboard'));
    return <DashboardComponent isDark={isDark} isRtl={isRtl} isMounted={isMounted} />;
  };


  return (
    <DashboardWrapper />
  );
};

export default Dashboard;
