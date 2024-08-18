/* eslint-disable react-hooks/exhaustive-deps */
import { API_ENDPOINT } from '@/config';
import { C } from '@fullcalendar/core/internal-common';
import { useEffect, useState } from 'react';

const useClient = () => {
  const [allClients, setAllClients] = useState<any[]>([]);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getAllClients = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}users?limit=30&page=${currentPage}`);
      const users = await response.json();
      setTotalPagesCount(users?.totalPages);
      setAllClients(users.results);
    } catch (error) {
      console.error(error);
    }
  };

  const onlyClients = allClients?.filter((client) => client.role === 'user');
  // const onlyCp = allClients.filter((cp) => cp.role === 'cp');
  // console.log(onlyCp);

  useEffect(() => {
    getAllClients();
  }, [currentPage]);

  return [allClients, onlyClients, setAllClients, totalPagesCount, setTotalPagesCount, currentPage, setCurrentPage];
};

export default useClient;
