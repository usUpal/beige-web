import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

const Test = () => {

  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Client Test'));
  });

  const [isMounted, setIsMounted] =
    useState<any>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <h1>Test CP Page</h1>
  );

};

export default Test;
