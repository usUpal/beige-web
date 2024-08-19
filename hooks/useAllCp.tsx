import { API_ENDPOINT } from "@/config";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const useAllCp = () => {
  const [allCpUsers, setAllCpUsers] = useState<any[]>([]);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState();

  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [userModal, setUserModal] = useState(false);


  const getAllCpUsers = async () => {
    try {
      let response;
      const q = query ? `search=${query}` : '';
      response = await fetch(`${API_ENDPOINT}cp?limit=10&page=${currentPage}&${q}`);
      const users = await response.json();
      setAllCpUsers(users.results);
      setTotalPagesCount(users?.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  //
  const router = useRouter();
  const getUserDetails = async (singleUserId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}users/${singleUserId}`);
      const userDetailsRes = await response.json();

      if (!userDetailsRes) {
        setShowError(true);
        setLoading(false);
      } else {
        setUserInfo(userDetailsRes);
        setLoading(false);
        // if the user is cp then route to cp details router
        if (userDetailsRes.role === 'cp') {
          const cpRoute = `cp/${userDetailsRes?.id}`;
          router.push(cpRoute);
        } else {
          setUserModal(true);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCpUsers();
  }, [currentPage,query]);

  return ([allCpUsers, totalPagesCount, currentPage, setCurrentPage, getUserDetails, query,setQuery]);
};

export default useAllCp;
