import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Fragment, useEffect, useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { error } from 'console';


const CreateUser = () => {
    const [geoLocation, setGeoLocation] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState("https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg");


    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                console.log("Srabon");
            };
            reader.readAsDataURL(file);
        }
    };



    const { register, handleSubmit, formState: { errors }, } = useForm();

    const onSubmit = (data) => { console.log(data); };



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
                                    <input id="name" placeholder="Jimmy Turner" {...register("firstName", { required: true })} className="form-input" />
                                    {errors.firstName && <span className='text-danger text-sm'>Enter your name</span>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" {...register("email", { required: true })} placeholder="Jimmy@gmail.com" className="form-input " />
                                    {errors.email && <span className='text-danger text-sm'>Enter your Email</span>}
                                </div>
                                <div>
                                    <label htmlFor="role">Password</label>
                                    <input type='password' id="password" placeholder="Password" {...register("Password", { required: true })} className="form-input  capitalize" />
                                    {errors.Password && <span className='text-danger text-sm'>Enter your Password</span>}
                                </div>
                                <div>
                                    <label htmlFor="role">Confirm password </label>
                                    <input type='password' id="confirm_password" {...register("CPassword", { required: true })} placeholder="Confirm password" className="form-input  capitalize" />
                                    {errors.CPassword && <span className='text-danger text-sm'>Enter your Confirm password</span>}
                                </div>

                                <div className="flex-grow">
                                    <label htmlFor="geo_location">Location</label>
                                    <Map setGeo_location={setGeoLocation} setLocation={setLocation} defaultValue={geoLocation}  {...register("location")} />
                                    {/* {errors.location && <span className='text-danger text-sm'>Enter your Confirm location</span>} */}
                                </div>

                                <div>
                                    <label htmlFor="role">Timezone</label>
                                    <input type='time' id="time" placeholder="Timezone" className="form-input  capitalize"  {...register("Timezone")} />
                                    {/* {errors.location && <span className='text-danger text-sm'>Enter your  Timezone</span>} */}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 sm:col-span-2">
                            <button type="submit" className="btn btn-primary">
                                Create User
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
};

export default CreateUser;
