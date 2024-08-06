import { API_ENDPOINT } from "@/config";
import { handleClientScriptLoad } from "next/script";
import { useEffect, useState } from "react";

const useAddons = () => {
    // const [addonsAddBtnModal, setAddonsAddBtnModal] = useState(false);
    const [addonsData, setAddonsData] = useState<addonTypes[]>([]);
    const [addonsCategories, setAddonsCategories] = useState([]);
    // const [allCategory, setAllCategory] = useState([]);
    // console.log("🚀 ~ useAddons ~ uniqueCategories:", addonsCategories);

    const handleFilterCategory = () => {
        if (addonsData) {
            const uniqueCategories = addonsData
                ?.map((addon: any) => addon.category)
                ?.filter((category: string, index: any, array: any) => array.indexOf(category) === index);
            setAddonsCategories(uniqueCategories);
            // setAllCategory(uniqueCategories);
        }
        else {
            return;
        }
    };

    // handleFilterCategory();

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
    }, [addonsData])

    return ([addonsData, setAddonsData, addonsCategories, handleFilterCategory]);
};

export default useAddons;