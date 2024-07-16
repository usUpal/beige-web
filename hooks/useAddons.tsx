import { API_ENDPOINT } from "@/config";
import { useEffect, useState } from "react";

const useAddons = () => {
    // const [addonsAddBtnModal, setAddonsAddBtnModal] = useState(false);
    const [addonsData, setAddonsData] = useState<addonTypes[]>([]);

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
    return ([addonsData, setAddonsData]);
};

export default useAddons;