import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { toast } from 'react-toastify';

type T = any;

const RoleProtection = (WrappedComponent: any, allowedRoles: Array<T>) => {
  return function RoleProtectedComponent(props) {
    const router = useRouter();
    const { userData } = useAuth();

    useEffect(() => {
      if (userData && !allowedRoles.includes(userData?.role)) {
        toast.error("Unauthorized for this request");
        router.push('/dashboard');
      }
    }, [router, userData]);


    return <WrappedComponent {...props} />;
  };
};

export default RoleProtection;
