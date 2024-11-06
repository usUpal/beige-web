import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/authContext';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

// interface FormData {
//   profile_picture: FileList;
// }

const ProfileImageForm = () => {
  const { userData, setUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(userData?.profile_picture || '');
  const [name, setName] = useState(userData?.name || '');
  const { register, handleSubmit, setValue } = useForm();

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Set the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = {
        fileName: file.name,
        fileContentType: file.type,
        fileSize: file.size,
        userId: userData?.id,
      };

      try {
        const response = await axios.post(`${API_ENDPOINT}gcp/profile-image`, formData);
        const { url, filePath } = response.data;

        const uploadResponse = await axios.put(url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.status === 200) {
          // Step 3: Make the file public
          const publicResponse = await axios.post(`${API_ENDPOINT}gcp/make-file-public`, { filePaths: [filePath] });
          toast.success('Profile picture uploaded successfully', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Step 4: Update user data with the new profile picture URL
          const publicUrl = publicResponse.data.publicUrls[0];
          setUserData({ ...userData, profile_picture: publicUrl });
          Cookies.set('userData', JSON.stringify({ ...userData, profile_picture: publicUrl }), { expires: 7 });
        }
      } catch (error) {
        toast.error('Failed to upload profile picture');
      }
    }
  };

  const onSubmit = async (data: any) => {
    coloredToast('success', 'Under development');
    return;

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
      // console.error('Error updating profile picture:', error);
      coloredToast('error', 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="group relative flex flex-col items-center justify-center">
        {profilePicture ? (
          <Image src={profilePicture as string} alt="User profile picture" width={128} height={128} className="h-32 w-32 rounded-full object-cover" />
        ) : (
          <span className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-400 object-cover text-2xl font-bold capitalize text-white">{name[0] ?? 'BE'}</span>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="relative rounded-md bg-white p-2 dark:border-[#191e3a] dark:bg-black">
          <div className="absolute bottom-0 left-[-55px] right-0 top-[-143px] m-auto flex h-32 w-32 flex-col  items-center justify-center gap-0 rounded-full bg-[#02020281] opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" {...register('profile_picture')} onChange={handleImageUpload} />
              {allSvgs.uploadUpArrow}
            </label>
            {/* <button type="submit" className="bg-blue-600 my-4 flex justify-center m-auto text-sm text-white rounded-md py-1 px-1 absolute bottom-[-10px]" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </button> */}
          </div>
        </form>
      </div>
      <p className="mt-2 text-center text-xl font-semibold text-primary">{name}</p>
    </div>
  );
};

export default ProfileImageForm;
