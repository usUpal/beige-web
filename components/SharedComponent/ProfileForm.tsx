import { useAuth } from '@/contexts/authContext';
import { useUpdateCpDataForLocationMutation, useUpdateUserInfoMutation } from '@/Redux/features/profile/profileFormApi';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Map from '../Map';
import DefaultButton from './DefaultButton';

interface FormData {
  name: string;
  role: string;
  location: string;
  geo_location: { coordinates: number[]; type: 'Point' };
  email: string;
}

const ProfileForm = () => {
  const [geo_location, setGeo_location] = useState<{ coordinates: number[]; type: 'Point' }>({ coordinates: [], type: 'Point' });
  const [location, setLocation] = useState('');
  const { userData } = useAuth();
  const { setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: userData?.name || '',
      role: userData?.role || '',
      location: userData?.location || '',
      geo_location: userData?.geo_location || { coordinates: [], type: 'Point' },
      email: userData?.email || '',
    },
  });

  const [updateUserInfo, {}] = useUpdateUserInfoMutation();
  const [updateCpDataForLocation, {}] = useUpdateCpDataForLocationMutation();

  useEffect(() => {
    setValue('geo_location', geo_location);
    setValue('location', userData?.location || '');
    localStorage.removeItem('location');
  }, [geo_location, setValue, userData?.location]);

  const coloredToast = (color: any, message: string) => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`,
      },
    });
    toast.fire({
      title: message,
    });
  };

  const onSubmit = async (data: userData) => {
    setIsLoading(true);
    const updatedProfileInfo = {
      name: data.name,
      location: location || data.location,
    };
    try {
      const updatedData: any = await updateUserInfo({ id: userData?.id, data: updatedProfileInfo }).unwrap();
      setUserData(updatedData);
      Cookies.set('userData', JSON.stringify(updatedData), {
        expires: 7,
      });
      coloredToast('success', 'Profile updated successfully');
      if (userData?.role == 'cp' && geo_location?.coordinates?.length > 0) {
        const cpData = {
          geo_location,
          city: data.location,
        };
        const updatedCpData: any = await updateCpDataForLocation({ id: userData?.id, data: cpData }).unwrap();
      }
    } catch (error) {
      console.error('Patch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
        <h6 className="mb-5 text-lg font-bold">General Information</h6>
        <div className="flex flex-col sm:flex-row">
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name">Full Name</label>
              <input id="name" {...register('name')} placeholder="Jimmy Turner" className="form-input" />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <input id="role" {...register('role')} disabled placeholder="Web Developer" className="form-input bg-gray-200 capitalize" />
            </div>

            <div className="flex-grow">
              <label htmlFor="geo_location">Location</label>
              <Map setGeo_location={setGeo_location} setLocation={setLocation} defaultValue={userData?.location || ''} />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" {...register('email')} disabled type="email" placeholder="eg: exmpal@gmail.com" className="form-input bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mt-3 sm:col-span-2">
          {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button> */}
          <DefaultButton css="font-semibold">{isLoading ? 'Saving...' : 'Save'}</DefaultButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
