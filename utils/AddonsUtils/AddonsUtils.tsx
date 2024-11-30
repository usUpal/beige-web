import React from 'react'

const AddonsUtils = () => {

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
        } else {
          return;
        }
      };

//   return ()
}

export default AddonsUtils
