import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

const CreateUser = () => {
    const [geoLocation, setGeoLocation] = useState('');
    const [location, setLocation] = useState('');
    const [timezone, setTimezone] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm();
    const fileInputRef = useRef(null);
    const [showRoleInput, setShowRoleInput] = useState(false);
    const [roleOptions, setRoleOptions] = useState([
        "Admin", "User", "Cp", "Project Manager",
        "Post Production Manager", "Sales Representative",
        "User Success"
    ]);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const PasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,}$/;


    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             setImage(e.target.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleSetNewItem = (fieldName) => {
        const value = getValues(fieldName);
        if (!value) return;

        setRoleOptions((prevOptions) => [...prevOptions, value]);
        console.log("New role added:", value);

        reset({ [fieldName]: '' });
    };

    const onSubmit = (data) => {
        const { Password, CPassword, email } = data;

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email.');
            return;
        }

        if (!PasswordPattern.test(Password)) {
            toast.error('Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.).');
            return;
        }

        if (Password !== CPassword) {
            toast.error("Password dosen't match.");
            return;
        }

        const filteredData = Object.fromEntries(
            Object.entries({ ...data, timezone: timezone?.value, location: location }).filter(([key, value]) => value !== '')
        );
        console.log("Data:", filteredData);
    };

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
                        <span>Create Cp</span>
                    </li>
                </ul>
            </div>
            <div className='panel mt-5'>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">

                                <div>
                                    <label htmlFor="name">Full Name</label>
                                    <input id="name" placeholder="Exmpal Turner" {...register("firstName", { required: true })} className="form-input" />
                                    {errors.firstName && <span className='text-danger text-sm'>Enter your name</span>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" defaultValue="" {...register("email", { required: true, pattern: emailRegex })} placeholder="Jimmy@gmail.com" className="form-input" />
                                    {errors.email && <span className='text-danger text-sm'>Enter a valid Email</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Password</label>
                                    <input type='password' id="password" placeholder="Password" {...register("Password", { required: true, pattern: PasswordPattern })} className="form-input capitalize" />
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
                                            <option value="select">Select Role</option>
                                            {roleOptions.map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="relative flex items-center justify-start gap-1">
                                            <input {...register('role')} className="form-input" placeholder="Add Role" />
                                            <button type="button" onClick={() => handleSetNewItem('role')} className="cursor-pointer border-none p-0 pb-2 font-sans text-indigo-500 md:me-0">
                                                {allSvgs.plusForAddCp}
                                            </button>
                                        </div>
                                    )}
                                    <div className="mb-2 mt-2 flex items-center justify-between absolute">
                                        <button type="button" onClick={() => setShowRoleInput((prev) => !prev)} className="text-bold cursor-pointer p-0 font-sans text-white-dark">
                                            {showRoleInput ? allSvgs.minusForHide : allSvgs.plusForAddCp}
                                        </button>
                                    </div>
                                    {errors.role && <span className='text-danger text-sm'>Enter your role</span>}
                                </div>

                                <div>
                                    <label htmlFor="timezone">Timezone</label>
                                    <TimezoneSelect
                                        value={timezone}
                                        onChange={(selectedTimezone) => {
                                            setTimezone(selectedTimezone);
                                            setValue("Timezone", selectedTimezone?.value || '');
                                        }}
                                    />
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
