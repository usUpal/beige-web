import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { API_ENDPOINT } from '@/config';
import { useAuth } from '@/contexts/authContext';
import AccessDenied from '@/components/errors/AccessDenied';

const CreateUser = () => {
    const [geoLocation, setGeoLocation] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg");

    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm();
    const fileInputRef = useRef(null);
    const [showRoleInput, setShowRoleInput] = useState(false);
    const [roleOptions, setRoleOptions] = useState([
        "admin", "user", "cp", "project manager",
        "post production manager", "sales representative",
        "user success"
    ]);

    const { userData, authPermissions } = useAuth();
    const isHavePermission = authPermissions?.includes('client_page');



    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
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
        }

        if (filteredUserData) {

            try {
                const response = await fetch(`${API_ENDPOINT}auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filteredUserData),
                });

                const result = await response.json();

                if (response.ok) {
                    // console.log('Success:', result);
                    toast.success('Registration successful!');
                    reset();

                } else {
                    if (result.code === 400) {
                        toast.error(`${result.message}`);
                    }
                    else {
                        toast.error(`Something went wrong, Please try again!`);
                    }
                }
            } catch (error) {
                console.error('Network error:', error);
                toast.error('An error occurred. Please try again later.');
            }
        }

    };

    if (!isHavePermission) {
        return (
            <AccessDenied />
        );
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
            <div className='panel mt-5'>
                <div>
                    <div className='relative mb-10 '>
                        <div className="h-32 w-32 rounded-full bg-[#02020281] absolute flex flex-col gap-0 justify-center items-center opacity-0 transition-opacity duration-300 ease-out hover:opacity-100">
                            <svg
                                className="h-[24px] w-[24px] cursor-pointer absolute top-0 bottom-0 left-0 right-0 m-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                onClick={handleIconClick}
                            >
                                <path
                                    className="text-[15px]"
                                    fill="white"
                                    d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
                                />
                            </svg>
                        </div>
                        <img src={image} alt="Profile picture" className='h-32 w-32 object-cover rounded-full' />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">

                                <div>
                                    <label htmlFor="name">Full Name</label>
                                    <input id="name" placeholder="Full Name" {...register("name", { required: true })} className="form-input" />
                                    {errors.firstName && <span className='text-danger text-sm'>Enter your name</span>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" defaultValue="" {...register("email", { required: true, pattern: emailRegex })} placeholder="eg: example@gmail.com" className="form-input" />
                                    {errors.email && <span className='text-danger text-sm'>Enter a valid Email</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Password</label>
                                    <input type='password' id="password" placeholder="Password" {...register("password", { required: true, pattern: passwordPattern })} className="form-input capitalize" />
                                    {errors.Password && <span className='text-danger text-sm'>Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.)</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Confirm password</label>
                                    <input type='password' id="confirm_password" {...register("CPassword", { required: true })} placeholder="Confirm password" className="form-input capitalize" />
                                    {errors.CPassword && <span className='text-danger text-sm'>Enter your Confirm password</span>}
                                </div>

                                <div className="flex-grow">
                                    <label htmlFor="geo_location">Location</label>
                                    <Map setGeo_location={setGeoLocation} setLocation={setLocation} defaultValue={geoLocation} {...register("location")} />
                                </div>

                                <div className='relative'>
                                    <label htmlFor="role">Role</label>
                                    {!showRoleInput ? (
                                        <select {...register("role")} className="form-input">
                                            <option value="">Select Role</option>
                                            {roleOptions.map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="relative flex items-center justify-start gap-1">
                                            <input
                                                {...register('role')}
                                                className="form-input"
                                                placeholder='Add Role'
                                            />
                                            {/* <button type="button" onClick={() => handleSetNewItem('role')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                                                {allSvgs.plusForAddCp}
                                            // </button> */}
                                        </div>
                                    )}
                                    <div className="mb-2 mt-2 flex items-center justify-between absolute">
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
                                    {errors.role && <span className='text-danger text-sm'>Enter your role</span>}
                                </div>

                            </div>
                        </div>

                        <div className="mt-3 sm:col-span-2">
                            <DefaultButton css='font-semibold'>Create User</DefaultButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateUser;
