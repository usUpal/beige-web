import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '@/store/themeConfigSlice';
import { useRouter } from 'next/router';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import Cookies from 'js-cookie';
import Loader from './SharedComponent/Loader';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import Swal from 'sweetalert2';
import Image from 'next/image';

const Auth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUserData, setAccessToken, setRefreshToken, setAuthPermissions } = useAuth();
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const [flag, setFlag] = useState('');

  useEffect(() => {
    dispatch(setPageTitle('Login'));
    router.push('/');
  }, [dispatch, router]);

  useEffect(() => {
    setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
  }, [themeConfig.locale]);

  const setLocale = (flag: string) => {
    setFlag(flag);
    dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const loginEndPoint = `${API_ENDPOINT}auth/login`;

    try {
      const response = await fetch(loginEndPoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await response.json();
      const result = await fetch(`${API_ENDPOINT}roles?search=${data?.user?.role}`);
      const authPermission = await result.json();

      if (response.ok && result.ok) {
        const { user, tokens } = data;
        const { access, refresh } = tokens;
        const authPermissions = authPermission[0]?.permissions;

        setUserData(user);
        setAuthPermissions(authPermissions);
        setAccessToken(access?.token);
        setRefreshToken(refresh?.token);

        const expires = new Date(refresh?.expires);
        Cookies.set('userData', JSON.stringify(user), { expires });
        Cookies.set('authPermissions', JSON.stringify(authPermissions), { expires });
        Cookies.set('accessToken', JSON.stringify(access), { expires });
        Cookies.set('refreshToken', JSON.stringify(refresh), { expires });

        await router.push('/dashboard');
      } else {
        coloredToast('danger', data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const coloredToast = (color: string, message: string) => {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: { popup: `color-${color}` },
      title: message,
    });
  };

  return (
    <div>
      <div className="absolute inset-0">
        <Image src="/assets/images/auth/bg-gradient.png" alt="image" layout="fill" className="object-cover" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
        <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
        <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
        <img src="/assets/images/auth/polygon-object.png" alt="image" className="absolute bottom-0 end-[28%]" />
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-[#333434] md:text-4xl">Sign in</h1>
                <p className="text-base font-bold leading-normal text-[#676767]">Enter your email and password to login</p>
              </div>
              <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                <div>
                  <label htmlFor="Email" className="text-[#0E1726]">
                    Email
                  </label>
                  <div className="relative text-white-dark">
                    <input id="Email" name="email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark focus:border-[#E7D4BC]" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">{allSvgs.emailSvg}</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="Password" className="text-[#0E1726]">
                    Password
                  </label>
                  <div className="relative text-white-dark">
                    <input id="Password" name="password" type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark focus:border-[#E7D4BC]" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">{allSvgs.passwordSvg}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn !mt-6 w-full border-0 bg-gradient-to-r from-[#ACA686] to-[#735C38] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] hover:bg-gradient-to-l"
                >
                  {isLoading ? (
                    <span role="status" className="flex h-5 items-center space-x-2">
                      <Loader />
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
