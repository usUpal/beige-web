import { useForm } from 'react-hook-form';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useAuth } from '@/contexts/authContext';
import useClient from '@/hooks/useClient';

const ProfileForm = () => {
  const { userData } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.name || '',
      profession: userData?.role || '',
      //   country: 'Bangladesh',
      //   address: '',
      location: userData?.location || '',
      //   phone: '',
      email: userData?.email || '',
    },
  });

  const onSubmit = (data: profileFormData) => {
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
              <input id="name" {...register('name')} value={userData?.name} placeholder="Jimmy Turner" className="form-input" />
            </div>
            <div>
              <label htmlFor="profession">Role</label>
              <input id="profession" {...register('profession')} disabled placeholder="Web Developer" className="form-input bg-gray-200" />
            </div>

            <div>
              <label htmlFor="location">Location</label>
              <input id="location" {...register('location')} placeholder="Location" className="form-input" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" {...register('email')} type="email" placeholder="Jimmy@gmail.com" className="form-input" />
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
