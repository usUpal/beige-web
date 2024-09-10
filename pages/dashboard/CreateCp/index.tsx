import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import Select from 'react-select';


const CreateCp = () => {
    const [geoLocation, setGeoLocation] = useState('');
    const [location, setLocation] = useState('');
    const [timezone, setTimezone] = useState(null);
    const [formFlipped, setFormFlipped] = useState(false); // To track if form should flip
    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm();
    const fileInputRef = useRef(null);
    const [showRoleInput, setShowRoleInput] = useState(false);
    const [roleOptions, setRoleOptions] = useState([
        "Admin", "User", "Cp", "Project Manager",
        "Post Production Manager", "Sales Representative",
        "User Success"
    ]);


    const [selectedPositions, setselectedPositions] = useState([]);
    const [selectedPositionsRole, setselectedPositionsRole] = useState([]);
    const [selectedBackFootage, setselectedBackFootage] = useState([]);
    const [selectedAvailibility, setselectedAvailibility] = useState([]);
    const [selectedNotification, setselectedNotification] = useState([]);

    const [selectedVideography, setselectedVideography] = useState([]);
    const [selectedPhotography, setselectedPhotography] = useState([]);
    const [selectedLenses, setselectedLenses] = useState([]);
    const [selectedLighting, setselectedLighting] = useState([]);
    const [selectedSound, setselectedSound] = useState([]);
    const [selectedStabilizer, setselectedStabilizer] = useState([]);

    // Handlers for each select menu
    const handlePositionChange = (selected: any) => setselectedPositions(selected);
    const handleRoleChange = (selected: any) => setselectedPositionsRole(selected);
    const handleBackFootageChange = (selected: any) => setselectedBackFootage(selected);
    const handleAvailibilityChange = (selected: any) => setselectedAvailibility(selected);
    const handleNotificationChange = (selected: any) => setselectedNotification(selected);

    const handleVideographyonChange = (selected: any) => setselectedVideography(selected);
    const handlePhotographyonChange = (selected: any) => setselectedPhotography(selected);
    const handleLensesonChange = (selected: any) => setselectedLenses(selected);
    const handleLightingonChange = (selected: any) => setselectedLighting(selected);
    const handleSoundonChange = (selected: any) => setselectedSound(selected);
    const handleStabilizeronChange = (selected: any) => setselectedStabilizer(selected);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const PasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,}$/;

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
            toast.error("Password doesn't match.");
            return;
        }

        // Show the next form (flip the form)
        setFormFlipped(true);

        const filteredData = Object.fromEntries(
            Object.entries({ ...data, timezone: timezone?.value, location: location }).filter(([key, value]) => value !== '')
        );
        console.log("Data:", filteredData);
    };


    const PositionsOptions = [
        { value: 'Producer', label: 'Producer' },
        { value: 'Director', label: 'Director' },
        { value: 'Videographer', label: 'Videographer' },
        { value: 'Photographer', label: 'Photographer' },
        { value: 'Drone Operator', label: 'Drone Operator' },
        { value: 'Photo Editor', label: 'Photo Editor' },
        { value: 'Video Editor', label: 'Video Editor' },
    ];

    const backupFootage = [
        { value: 'Hard Drive ', label: 'Hard Drive ' },
        { value: 'SD Card', label: 'SD Card' },
        { value: 'Google Drive', label: 'Google Drive' },
        { value: 'We Transfer', label: 'We Transfer' },
    ];

    const Availibility = [
        { value: 'During the week and weekend', label: 'During the week and weekend' },
        { value: 'Only during the week', label: 'Only during the week' },
        { value: 'Only during the weekends', label: 'Only during the weekends' },
        { value: 'Flexibility to do last minute shoots', label: 'Flexibility to do last minute shoots' },
        { value: 'All of the above', label: 'All of the above' },
    ];

    const Notification = [
        { value: '1 Day anticipation', label: '1 days anticipation' },
        { value: '2 days anticipation', label: '2 days anticipation' },
        { value: '1 week anticipation', label: '1 week anticipation' },
        { value: '1 month anticipation', label: '1 month anticipation' },
    ];

    const videographyCamera = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const videography = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const Photography = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const Lenses = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const Lighting = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const Sound = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const Stabilizer = [
        { value: 'BMPCC 4K', label: 'BMPCC 4K' },
        { value: 'BMPCC 6k G2', label: 'BMPCC 6k G2' },
        { value: 'BMPCC 6k Pro', label: 'BMPCC 6k Pro' },
        { value: 'BMD Ursa Mini 4.6k', label: 'BMD Ursa Mini 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k', label: 'BMD Ursa Mini Pro 4.6k' },
        { value: 'BMD Ursa Mini Pro 4.6k G2', label: 'BMD Ursa Mini Pro 4.6k G2' },
        { value: 'EOS R', label: 'EOS R' },
        { value: 'EOS R5', label: 'EOS R5' },
        { value: 'C100', label: 'C100' },
        { value: 'C200', label: 'C200' },
        { value: 'C300 mark 2', label: 'C300 mark 2' },
        { value: 'C300 mark 3', label: 'C300 mark 3' },
        { value: 'C300 mark 4', label: 'C300 mark 4' },
        { value: 'GH5', label: 'GH5' },
        { value: 'GH511', label: 'GH511' },
        { value: 'Sony A7S3', label: 'Sony A7S3' },
        { value: 'Sony A1', label: 'Sony A1' },
        { value: 'Sony FX3', label: 'Sony FX3' },
        { value: 'Sony FX6', label: 'Sony FX6' },
        { value: 'Sony FX9', label: 'Sony FX9' },
        { value: 'Others', label: 'Others' },
    ];

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
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
                    {!formFlipped ? ( // Conditionally render based on formFlipped
                        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                            <div className="flex flex-col sm:flex-row">
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">

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

                                    <div className='mt-4'>
                                        <label htmlFor="timezone">Timezone</label>
                                        <TimezoneSelect
                                            value={timezone}
                                            onChange={(selectedTimezone) => {
                                                setTimezone(selectedTimezone);
                                                setValue("Timezone", selectedTimezone?.value || '');
                                            }}
                                        />
                                    </div>

                                    <div className='mt-4'>
                                        <label htmlFor="dateOfBirth">Date of Birth</label>
                                        <input type='date' {...register('dateOfBirth')} className="form-input" placeholder="Add Role" />
                                    </div>

                                    <div className='mt-4'>
                                        <label htmlFor="position">Select your main position</label>
                                        <select {...register("position")} className="form-input">
                                            <option value="select">Select Role</option>
                                            {roleOptions.map((position) => (
                                                <option key={position} value={position}>{position}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Positions </h2>
                                        <Select {...register("parmition")}
                                            isMulti
                                            value={selectedPositions}
                                            onChange={handlePositionChange}
                                            options={PositionsOptions}
                                            placeholder="Choose flavors..."
                                        />

                                    </div>
                                    <div>
                                        <h2 className="font-semibold mb-2">Positions & Roles</h2>
                                        <Select {...register("positionRole")}
                                            isMulti
                                            value={selectedPositionsRole}
                                            onChange={handleRoleChange}
                                            options={backupFootage}
                                            placeholder="Choose fruits..."
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Portfolio</h2>
                                        <input {...register("answer")}
                                            type="text"
                                            className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Your answer"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Backup Footage</h2>
                                        <Select {...register("backFootage")}
                                            isMulti
                                            value={selectedBackFootage}
                                            onChange={handleBackFootageChange}
                                            options={Availibility}
                                            placeholder="Choose colors..."
                                        />

                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Availability</h2>
                                        <Select {...register("Availability")}
                                            isMulti
                                            value={selectedAvailibility}
                                            onChange={handleAvailibilityChange}
                                            options={Notification}
                                            placeholder="Choose cars..."
                                        />

                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Notification</h2>

                                        <Select {...register("Notification")}
                                            isMulti
                                            value={selectedNotification}
                                            onChange={handleNotificationChange}
                                            options={videographyCamera}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Videography Camera</h2>
                                        <Select {...register("videography")}
                                            isMulti
                                            value={selectedVideography}
                                            onChange={handleVideographyonChange}
                                            options={videography}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Photography Camera</h2>
                                        <Select {...register("photography")}
                                            isMulti
                                            value={selectedPhotography}
                                            onChange={handlePhotographyonChange}
                                            options={Photography}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Lenses</h2>
                                        <Select {...register("lenses")}
                                            isMulti
                                            value={selectedLenses}
                                            onChange={handleLensesonChange}
                                            options={Lenses}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Lighting</h2>
                                        <Select {...register("lighiting")}
                                            isMulti
                                            value={selectedLighting}
                                            onChange={handleLightingonChange}
                                            options={Lighting}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Sound</h2>
                                        <Select {...register("sound")}
                                            isMulti
                                            value={selectedSound}
                                            onChange={handleSoundonChange}
                                            options={Sound}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold mb-2">Stabilizer</h2>
                                        <Select {...register("Stabilizer")}
                                            isMulti
                                            value={selectedStabilizer}
                                            onChange={handleStabilizeronChange}
                                            options={Stabilizer}
                                            placeholder="Choose countries..."
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="mt-8 flex items-center">
                                <DefaultButton css='font-semibold'>Next</DefaultButton>
                            </div>

                        </form>
                    ) : (
                        // Second form (or additional content) when formFlipped is true
                        <div className="md:grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">

                            <h1>helllo</h1>


                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default CreateCp;
