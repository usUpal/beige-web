import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

// interface FormData {
//   profile_picture: FileList;
// }

const ProfileImageForm = () => {
  const { userData, setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(userData?.profile_picture || '');
  const [name, setName] = useState(userData?.name || '');
  const { register, handleSubmit, setValue } = useForm()

  useEffect(() => {
    setValue('profile_picture', userData?.profile_picture || '');
  }, [userData, setValue]);

  const coloredToast = (color: 'success' | 'error', message: string) => {
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
      setValue('profile_picture', event.target.files);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const patchResponse = await fetch(`${API_ENDPOINT}users/${userData?.id}`, {
        method: 'PATCH',
        body: profilePicture,
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
      
        <div className="relative group flex flex-col items-center justify-center">
          {profilePicture ? (
            <img
              src={profilePicture as string}
              className="h-32 w-32 rounded-full object-cover"
              alt="User profile picture"
            />
          ) : (
            <span className="h-32 w-32 rounded-full font-bold text-2xl flex justify-center items-center object-cover bg-slate-400 text-white capitalize">
              {name[0] ?? 'BE'}
            </span>
          )}

          
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
          <div className="h-32 w-32 rounded-full bg-[#02020281] absolute top-0 right-[32%] bottom-0  flex flex-col gap-0 justify-center items-center opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" {...register('profile_picture')} onChange={handleImageUpload} />
              <svg className="h-[24px] w-[24px] absolute top-0 bottom-0 left-0 right-0 m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path className="text-[15px]" fill="white" d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" /></svg>
            </label>
            <button type="submit" className="bg-blue-600 my-4 flex justify-center m-auto text-sm text-white rounded-md py-1 px-1 absolute bottom-[-10px]" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
          
        </form>
      </div>

        
      <p className="text-xl font-semibold text-primary mt-2 text-center">{name}</p>
    </div>
  );
};

export default ProfileImageForm;
