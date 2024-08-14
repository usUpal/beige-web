import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect } from 'react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useAuth } from '@/contexts/authContext';
import ProfileForm from '@/components/SharedComponent/ProfileForm';

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  console.log(userData);

  useEffect(() => {
    dispatch(setPageTitle('Profile'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="#" className="text-primary hover:underline">
            Users
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Profile</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
            </div>
            <div className="mb-5">
              <div className="flex flex-col items-center justify-center">
                {userData?.profile_picture ? (
                  <img src={userData?.profile_picture} className="mb-5 h-32 w-32 rounded-full object-cover" alt="User profile picture" />
                ) : (
                  <img src="/assets/images/profile-34.jpeg" alt="Default profile picture" className="mb-5 h-32 w-32 rounded-full object-cover" />
                )}

                <p className="text-xl font-semibold text-primary">{userData?.name}</p>
              </div>
              <ul className="m-auto  mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                <li className="ml-8 flex items-center gap-2">
                  {allSvgs.coffeeCupIcon}
                  {userRole === 'user' ? 'Client' : userRole === 'manager' ? 'Manager' : 'Producer'}
                </li>

                {/* <li className="flex items-center gap-2">
                  {allSvgs.phoneIcon}
                  <span className="whitespace-nowrap" dir="ltr">
                    +1 (530) 555-12121
                  </span>
                </li> */}
              </ul>
              <ul className="mt-7 flex items-center justify-center gap-2">
                <li>
                  <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.twitterIcon}</button>
                </li>
                <li>
                  <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.nextToTwitterOnProfile}</button>
                </li>
                <li>
                  <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.githubIcon}</button>
                </li>
              </ul>
            </div>
          </div>
          {/* working-section start*/}
          <div className="panel lg:col-span-2 xl:col-span-3">
            <>
              <ProfileForm />
            </>
          </div>
          {/* working-section close */}
        </div>

        {userRole === 'cp' && (
          <div className="md:grid-cols grid grid-cols-1 gap-5">
            <div className="panel">review carosole</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
