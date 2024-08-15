import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import Map from '../Map';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  const [geo_location, setGeo_location] = useState({ coordinates: [], type: 'Point' });
  const { userData } = useAuth();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Access API key from environment variables

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: userData?.name || '',
      profession: userData?.role || '',
      location: userData?.location || '',
      geo_location: userData?.geo_location || { coordinates: [], type: 'Point' },
      email: userData?.email || '',
    },
  });

  useEffect(() => {
    setValue('geo_location', geo_location);
    localStorage.removeItem('location');
  }, [geo_location, setValue]);

  const watchedGeoLocation = watch('geo_location');

  const reverseGeocode = async (coordinates) => {
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

  const onSubmit = async (data) => {
    const coordinates = geo_location?.coordinates;

    if (coordinates.length === 2) {
      data.location = await reverseGeocode(coordinates);
    } else {
      data.location = 'Unknown Location';
    }

    data.geo_location = watchedGeoLocation;

    console.log(data);
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
              <label htmlFor="profession">Role</label>
              <input id="profession" {...register('profession')} disabled placeholder="Web Developer" className="form-input bg-gray-200 capitalize" />
            </div>

            <div className="flex-grow">
              <label htmlFor="geo_location">Geo_location</label>
              {/* Pass userData?.location as default value */}
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
