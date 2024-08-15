import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import Map from '../Map';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '@/config';

interface FormData {
  name: string;
  role: string;
  location: string;
  geo_location: { coordinates: number[]; type: 'Point' };
  email: string;
}

const ProfileForm = () => {
  const [geo_location, setGeo_location] = useState<{ coordinates: number[]; type: 'Point' }>({ coordinates: [], type: 'Point' });
  const { userData } = useAuth();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: userData?.name || '',
      role: userData?.role || '',
      location: userData?.location || '',
      geo_location: userData?.geo_location || { coordinates: [], type: 'Point' },
      email: userData?.email || '',
    },
  });

  useEffect(() => {
    setValue('geo_location', geo_location);
    setValue('location', userData?.location || '');
    localStorage.removeItem('location');
  }, [geo_location, setValue, userData?.location]);

  const watchedGeoLocation = watch('geo_location');

  const reverseGeocode = async (coordinates: number[]) => {
    try {
      const [longitude, latitude] = coordinates;
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: googleMapsApiKey,
        },
      });

      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return 'Unknown Location';
      }
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      return 'Unknown Location';
    }
  };

  const onSubmit = async (data: userData) => {
    const coordinates = geo_location?.coordinates;

    if (coordinates.length === 2) {
      data.location = await reverseGeocode(coordinates);
    } else {
      data.location = userData?.location || 'Unknown Location';
    }

    data.geo_location = watchedGeoLocation;
    console.log(userData);

    const updatedProfileInfo = {
      name: data.name,
      email: data.email,
      location: data.location,
    };

    try {
      // users/661e4b2d6970067f1739f61a
      const patchResponse = await fetch(`${API_ENDPOINT}users/${userData?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfileInfo),
      });

      if (!patchResponse.ok) {
        throw new Error('Failed to patch data');
      }

      const updatedAddon = await patchResponse.json(); //

      // const updatedAddonsData = addonsData.map((addon: any) => (addon._id === addonsInfo?._id ? updatedAddon : addon));
      // setAddonsData(updatedAddonsData);

      // setAddonsModal(false);
    } catch (error) {
      console.error('Patch error:', error);
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
              <Map setGeo_location={setGeo_location} defaultValue={userData?.location || ''} />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" {...register('email')} disabled type="email" placeholder="Jimmy@gmail.com" className="form-input bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mt-3 sm:col-span-2">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
