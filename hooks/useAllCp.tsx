import { API_ENDPOINT } from "@/config";
import { useEffect, useState } from "react";

const useAllCp = () => {
    const [allCpUsers, setAllCpUsers] = useState<any[]>([]);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const getAllCpUsers = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}cp?limit=10&page=${currentPage}`);
            const users = await response.json();
            setAllCpUsers(users.results);
            setTotalPagesCount(users?.totalPages);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getAllCpUsers();
    }, [currentPage]);

    return ([allCpUsers, totalPagesCount, currentPage, setCurrentPage]);
};

export default useAllCp;