import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface FormData {
  profile_picture: FileList;
}

const ProfileImageForm = () => {
  const { userData } = useAuth();
  const { setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      profile_picture: userData?.profile_picture || '',
    },
  });

  useEffect(() => {
    setValue('profile_picture', userData?.profile_picture || '');
  }, [userData, setValue]);

  const coloredToast = (color: string, message: string) => {
    Swal.fire({
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      icon: color,
      title: message,
    });
  };

  const onSubmit = async (data: FormData) => {
    // setIsLoading(true);
    const formData = new FormData();
    formData.append('profile_picture', data.profile_picture[0]);
    console.log(data);
return;
    try {
      const patchResponse = await fetch(`${API_ENDPOINT}users/${userData?.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!patchResponse.ok) {
        throw new Error('Failed to update profile picture');
      }

      const updatedUserData = await patchResponse.json();
      setUserData(updatedUserData);
      Cookies.set('userData', JSON.stringify(updatedUserData), { expires: 7 });

      coloredToast('success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      coloredToast('error', 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
        <div className="flex flex-col sm:flex-row">
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <input
                id="profile_picture"
                type="file"
                {...register('profile_picture')}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 sm:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Update...' : 'update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileImageForm;
