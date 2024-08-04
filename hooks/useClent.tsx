import { API_ENDPOINT } from "@/config";
import { useEffect, useState } from "react";

const useClent = () => {
    const [allClients, setAllClients] = useState<any[]>([]);
    const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const getAllClients = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}users?limit=30&page=${currentPage}`);
            const users = await response.json();
            console.log("🚀 ~ getAllClients ~ users:", users)
            setTotalPagesCount(users?.totalPages);
            setAllClients(users.results);
        } catch (error) {
            console.error(error);
        }
    };

    const onlyClients = allClients?.filter(client => client.role === 'user')
    useEffect(() => {
        getAllClients();
    }, [currentPage]);

    return ([allClients, onlyClients, setAllClients, totalPagesCount, setTotalPagesCount, currentPage, setCurrentPage]);
};

export default useClent;

