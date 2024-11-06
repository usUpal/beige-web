import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { useAuth } from '@/contexts/authContext';
import AccessDenied from '@/components/errors/AccessDenied';
import { useRegisterUserMutation } from '@/Redux/features/user/userApi';
import Image from 'next/image';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

const CreateUser = () => {
  const [geoLocation, setGeoLocation] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();
  const fileInputRef = useRef(null);
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [roleOptions, setRoleOptions] = useState(['admin', 'user', 'cp', 'project manager', 'post production manager', 'sales representative', 'user success']);

  const { userData, authPermissions } = useAuth();
  const isHavePermission = authPermissions?.includes('client_page');
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    const { password, CPassword, email } = data;

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    if (!passwordPattern.test(password)) {
      toast.error('Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.).');
      return;
    }
    if (password !== CPassword) {
      toast.error("Password dosen't match.");
      return;
    }
    if (!location) {
      toast.error("Location can't be empty.");
      return;
    }
    const filteredUserData = {
      name: data.name,
      email: email,
      password: password,
      location,
      role: data.role,
    };

    if (filteredUserData) {
      try {
        const result = await registerUser(filteredUserData).unwrap();

        if (result?.user) {
          toast.success('User Registration successful!');
          reset();
        } else {
          if (result.code === 400) {
            toast.error(`${result.message}`);
          } else {
            toast.error(`Something went wrong, Please try again!`);
          }
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="#" className="text-primary hover:underline">
              Users
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Create user</span>
          </li>
        </ul>
      </div>
      <div className="panel mt-5">
        <div>
          <div className="relative mb-10 ">
            <div className="absolute flex h-32 w-32 flex-col items-center justify-center gap-0 rounded-full bg-[#02020281] opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
              <span onClick={handleIconClick}>{allSvgs.uploadUpArrow}</span>
            </div>
            <Image src={image} alt="Profile picture" width={128} height={128} className="rounded-full object-cover" />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
            <div className="flex flex-col sm:flex-row">
              <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name">Full Name</label>
                  <input id="name" placeholder="Full Name" {...register('name', { required: true })} className="form-input" />
                  {errors.firstName && <span className="text-sm text-danger">Enter your name</span>}
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" defaultValue="" {...register('email', { required: true, pattern: emailRegex })} placeholder="eg: example@gmail.com" className="form-input" />
                  {errors.email && <span className="text-sm text-danger">Enter a valid Email</span>}
                </div>

                <div>
                  <label htmlFor="role">Password</label>
                  <input type="password" id="password" placeholder="Password" {...register('password', { required: true, pattern: passwordPattern })} className="form-input capitalize" />
                  {errors.Password && (
                    <span className="text-sm text-danger">Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.)</span>
                  )}
                </div>

                <div>
                  <label htmlFor="role">Confirm password</label>
                  <input type="password" id="confirm_password" {...register('CPassword', { required: true })} placeholder="Confirm password" className="form-input capitalize" />
                  {errors.CPassword && <span className="text-sm text-danger">Enter your Confirm password</span>}
                </div>

                <div className="flex-grow">
                  <label htmlFor="geo_location">Location</label>
                  <Map setGeo_location={setGeoLocation} setLocation={setLocation} defaultValue={geoLocation} {...register('location')} />
                </div>

                <div className="relative">
                  <label htmlFor="role">Role</label>
                  {!showRoleInput ? (
                    <select {...register('role')} className="form-input">
                      <option value="">Select Role</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative flex items-center justify-start gap-1">
                      <input {...register('role')} className="form-input" placeholder="Add Role" />
                      {/* <button type="button" onClick={() => handleSetNewItem('role')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                                                {allSvgs.plusForAddCp}
                                            // </button> */}
                    </div>
                  )}
                  <div className="absolute mb-2 mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleInput((prev) => !prev);
                        if (!showRoleInput) {
                          setValue('role', '');
                        }
                      }}
                      className="text-bold cursor-pointer p-0 font-sans text-white-dark"
                    >
                      {/* hidden conditional +,- buttons for add role */}
                      {/* {showRoleInput ? allSvgs.minusForHide : allSvgs.plusForAddCp} */}
                    </button>
                  </div>
                  {errors.role && <span className="text-sm text-danger">Enter your role</span>}
                </div>
              </div>
            </div>

            <div className="mt-3 sm:col-span-2">
              <DefaultButton css="font-semibold">Create User</DefaultButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
