import { useGetAllAddonsQuery } from '@/Redux/features/addons/addonsApi';
import React, { useEffect, useState } from 'react';

const useCalculateAddons = () => {
  const [selectedFilteredAddons, setSelectedFilteredAddons] = useState([]);
  const [addonExtraHours, setAddonExtraHours] = useState<any>({});
  const [filteredAddonsData, setFilteredAddonsData] = useState([]);
  const [formDataPageOne, setFormDataPageOne] = useState<any>({});
  const [computedRates, setComputedRates] = useState<any>({});
  const [allAddonRates, setAllAddonRates] = useState(0);

  const { data: addonsData } = useGetAllAddonsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleHoursOnChange = (addonId: string, hoursInput: number) => {
    const updatedAddons: any = selectedFilteredAddons.map((addon: any) => {
      if (addon._id === addonId) {
        return { ...addon, hours: hoursInput };
      }
      return addon;
    });

    setSelectedFilteredAddons(updatedAddons);

    if (hoursInput >= 0) {
      setAddonExtraHours((prevHours: number) => ({ ...prevHours, [addonId]: Number(hoursInput) }));
    }
  };

  const handleCheckboxChange = (addon: addonTypes) => {
    const isAddonSelected = selectedFilteredAddons.some((selectedAddon: addonTypes) => selectedAddon?._id === addon?._id);
    if (!isAddonSelected) {
      const updatedAddon = {
        _id: addon._id,
        title: addon.title,
        rate: addon.rate,
        ExtendRate: addon.ExtendRate,
        status: addon.status,
        hours: addonExtraHours[addon._id] || 1,
      };

      setSelectedFilteredAddons([...selectedFilteredAddons, updatedAddon]);
    } else {
      setSelectedFilteredAddons(selectedFilteredAddons.filter((selectedAddon: addonTypes) => selectedAddon._id !== addon._id));
    }
  };


  const handleShowAddonsData = () => {
    let shoot_type = formDataPageOne?.content_vertical;
    const photography = formDataPageOne?.content_type?.includes('photo');
    const videography = formDataPageOne?.content_type?.includes('video');
    const photoAndVideoShootType = formDataPageOne?.content_type?.includes('photo') && formDataPageOne?.content_type?.includes('video');    

    let categories: any = [];
    if (shoot_type === 'Wedding') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Wedding Photography'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Wedding Videography'];
      } else if (photoAndVideoShootType) {
        categories = ['Wedding Photography', 'Wedding Videography'];
      }
    } else if (shoot_type === 'Commercial') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Commercial Photo'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Commercial Video'];
      } else if (photoAndVideoShootType) {
        categories = ['Commercial Photo', 'Commercial Video'];
      }
    } else if (shoot_type === 'Corporate') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Corporate Photography'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Corporate Event Videography'];
      } else if (photoAndVideoShootType) {
        categories = ['Corporate Photography', 'Corporate Event Videography'];
      }
    } else if (shoot_type === 'Private') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Private Photography'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Private Videography'];
      } else if (photoAndVideoShootType) {
        categories = ['Private Photography', 'Private Videography'];
      }
    } else if (shoot_type === 'Music') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Music Photography'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Music Video'];
      } else if (photoAndVideoShootType) {
        categories = ['Music Photography', 'Music Video'];
      }
    } else if (shoot_type === 'Other') {
      if (photography && !photoAndVideoShootType) {
        categories = ['Other Photography'];
      } else if (videography && !photoAndVideoShootType) {
        categories = ['Other Videography'];
      } else if (photoAndVideoShootType) {
        categories = ['Other Photography', 'Other Videography'];
      }
    }
    
    if (categories.length > 0) {
      const seen = new Set();
      const uniqueAddOns = addonsData?.filter((addOn: any) => {
        const isInCategory = categories.includes(addOn?.category);
        const key = `${addOn.title}-${addOn.rate}`;
        if (isInCategory && !seen.has(key)) {
          seen.add(key);
          return true;
        }
        return false;
      });
      setFilteredAddonsData(uniqueAddOns);
    }
  };

  useEffect(() => {
    const calculateUpdatedRate = (addon: addonTypes) => {
      if (addon.ExtendRateType !== undefined || addonExtraHours[addon._id] !== undefined) {
        const addonHours = addonExtraHours[addon?._id] || 0;
        const newRate = addon?.rate + addonHours * addon.ExtendRate;
        return newRate;
      } else {
        return addon?.rate;
      }
    };

    const updatedComputedRates = filteredAddonsData?.reduce((prevAddon: any, addon: addonTypes) => {
      prevAddon[addon?._id] = calculateUpdatedRate(addon);
      return prevAddon;
    }, {});

    setComputedRates(updatedComputedRates);

    const updatedTotalAddonRates: UpdatedAddonRates = selectedFilteredAddons.reduce((previousAddon: any, addon: addonTypes) => {
      previousAddon[addon?._id] = calculateUpdatedRate(addon);
      return previousAddon;
    }, {} as UpdatedAddonRates);

    const totalRate = Object.values(updatedTotalAddonRates).reduce((acc, currentValue) => acc + currentValue, 0);
    setAllAddonRates(totalRate);

    // setAllRates(totalRate + shootCosts);
  }, [selectedFilteredAddons, filteredAddonsData, addonExtraHours]);

  return {
    selectedFilteredAddons,
    setSelectedFilteredAddons,
    addonExtraHours,
    setAddonExtraHours,
    filteredAddonsData,
    setFilteredAddonsData,
    formDataPageOne,
    setFormDataPageOne,
    handleHoursOnChange,
    handleCheckboxChange,
    handleShowAddonsData,
    computedRates,
    allAddonRates,
  };
};

export default useCalculateAddons;
