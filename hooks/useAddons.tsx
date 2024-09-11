import { useGetAllAddonsQuery } from '@/Redux/features/addons/addonsApi';
import { API_ENDPOINT } from '@/config';
import { handleClientScriptLoad } from 'next/script';
import { useEffect, useState } from 'react';

const useAddons = () => {
  const [addonsData, setAddonsData] = useState<addonTypes[]>([]);
  const [addonsCategories, setAddonsCategories] = useState([]);

  const handleFilterCategory = () => {
    if (addonsData) {
      const uniqueCategories = addonsData?.map((addon: any) => addon.category)?.filter((category: string, index: any, array: any) => array.indexOf(category) === index);
      setAddonsCategories(uniqueCategories);
    } else {
      return;
    }
  };

  const {data:getAllAddons} = useGetAllAddonsQuery(undefined,{
    refetchOnMountOrArgChange:true,
  });

  if(getAllAddons?.length){
    setAddonsData(getAllAddons)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_ENDPOINT}addOns`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const jsonData = await res.json();
        setAddonsData(jsonData);
      } catch (error) {
        console.error(`Error fetching data`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFilterCategory();
  }, [addonsData]);

  return [addonsData, setAddonsData, addonsCategories, handleFilterCategory];
};

export default useAddons;
