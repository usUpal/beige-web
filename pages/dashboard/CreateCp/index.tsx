import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import Select from 'react-select';

const CreateNewCp = () => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [geoLocation, setGeoLocation] = useState('');
    const [location, setLocation] = useState('');
    const [timezone, setTimezone] = useState(null);
    const [formFlipped, setFormFlipped] = useState(false);
    const { register, control, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm();
    const fileInputRef = useRef(null);
    const [showRoleInput, setShowRoleInput] = useState(false);
    const [roleOptions, setRoleOptions] = useState([
        "Admin", "User", "Cp", "Project Manager",
        "Post Production Manager", "Sales Representative",
        "User Success"
    ]);
    const [step, setStep] = useState(1); // Manage form steps
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
    const [selectedContentExperience, setselectedContentExperience] = useState([]);

    const handlePositionChange = (selected) => setselectedPositions(selected);
    const handleRoleChange = (selected) => setselectedPositionsRole(selected);
    const handleBackFootageChange = (selected) => setselectedBackFootage(selected);
    const handleAvailibilityChange = (selected) => setselectedAvailibility(selected);
    const handleNotificationChange = (selected) => setselectedNotification(selected);
    const handleVideographyonChange = (selected) => setselectedVideography(selected);
    const handlePhotographyonChange = (selected) => setselectedPhotography(selected);
    const handleLensesonChange = (selected) => setselectedLenses(selected);
    const handleLightingonChange = (selected) => setselectedLighting(selected);
    const handleSoundonChange = (selected) => setselectedSound(selected);
    const handleStabilizeronChange = (selected) => setselectedStabilizer(selected);
    const handleContentExperienceonChange = (selected) => setselectedContentExperience(selected);

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

        setFormFlipped(true);

        const filteredData = Object.fromEntries(
            Object.entries({ ...data, timezone: timezone?.value, location: location }).filter(([key, value]) => value !== '')
        );

        // console.log("Form Data:", data);

        // console.log("Data:", filteredData);

        // const onSubmit = (data) => {
        //     console.log('Form Data:', data);
        // };

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
    const ContentExperience = [
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

    const Photography = [...videographyCamera];
    const Lenses = [...videographyCamera];
    const Lighting = [...videographyCamera];
    const Sound = [...videographyCamera];
    const Stabilizer = [...videographyCamera];


    const handleBack = () => {
        setActiveTab(activeTab - 1);
    };

    const handleNext = () => {
        setActiveTab(activeTab + 1);
        console.log(" Data:", getValues());
    };

    const handleSubmited = () => {
        console.log(" Data:", getValues());
    };

    return (
        <div className='panel'>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" onSubmit={(e) => e.preventDefault()}> */}
                {/* Tab 1 */}
                {activeTab === 1 && (
                    <div className="mb-5 rounded-md bg-white p-4 dark:border-[#191e3a] dark:bg-black">
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

                                    <Controller
                                        name="PositionsOptions"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={PositionsOptions}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="font-semibold mb-2">Positions & Roles</h2>

                                    <Controller
                                        name="PositionsOptionsRole"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={PositionsOptions}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
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
                                    <Controller
                                        name="backupFootage"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={backupFootage}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Availability</h2>
                                    <Controller
                                        name="Availibility"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Availibility}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Notification</h2>
                                    <Controller
                                        name="Notification"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Notification}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Videography Camera</h2>
                                    <Controller
                                        name="videographyCamera"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={videographyCamera}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Photography Camera</h2>
                                    <Controller
                                        name="Photography"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Photography}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Lenses</h2>
                                    <Controller
                                        name="Lenses"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Lenses}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Lighting</h2>
                                    <Controller
                                        name="Lighting"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Lighting}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Sound</h2>
                                    <Controller
                                        name="Sound"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Sound}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold mb-2">Stabilizer</h2>
                                    <Controller
                                        name="Stabilizer"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Stabilizer}
                                                placeholder="Choose cameras..."
                                            />
                                        )}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-end">
                            <DefaultButton
                                css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`}
                                disabled={isLoading}
                                onClick={handleNext}
                            >
                                {isLoading ? <Loader /> : 'Next'}
                            </DefaultButton>
                        </div>
                    </div>
                )}

                {/* Tab 2 */}
                {activeTab === 2 && (
                    <div className='mt-4'>
                        <div className="md:grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <h2 className="text-sm font-bold mb-2">Additional Equipment</h2>
                                <textarea placeholder="Your answer" rows="1"  {...register("Additionalanswer")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>

                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Content Speciality Experience</h2>
                                <Controller
                                    name="ContentExperience"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isMulti
                                            options={ContentExperience}
                                            placeholder="Choose cameras..."
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Rates($)</h2>

                                <textarea placeholder="Your Rates($)" rows="1" type="number" {...register("Rates($)")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>

                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Experience/Post Production</h2>
                                <textarea placeholder="Your Experience" rows="1"  {...register("Experience")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Creative empowerment &
                                    Initiative</h2>
                                <textarea placeholder="Your Creative" rows="1"  {...register("Creative")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you had to handle a
                                    high-pressure task. How did you manage it
                                    and what was the outcome?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Creative")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What motivates you in your work? Is it
                                    achieving goals, helping others, or something
                                    else?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("motivates")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">How do you handle conflicts or disagreements
                                    with coworkers or superiors?*</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("disagreements")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a time when you had to work on a
                                    team project. What was your role, and how did
                                    you contribute to the team's success?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("project")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What do you consider your greatest
                                    professional strength, and how does it benefit
                                    your work?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("greatest")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What are your long-term career goals, and how
                                    does this position align with them?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("long-term")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or
                                    made a mistake at work. How did you handle it,
                                    and what did you learn from the experience?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("situation")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or
                                    made a mistake at work. How did you handle it,
                                    and what did you learn from the experience?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Describe")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Additional Information</h2>
                                <h2 className="text-sm font-bold mb-2">Is there anything that you'd like us to know or
                                    take in consideration when working together?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Additional")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a time when you had to work on a
                                    team project. What was your role, and how did
                                    you contribute to the team's success?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("project")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2"> Networking</h2>
                                <h2 className="text-sm font-bold mb-2 w-full">This will not have any impact whatsoever on
                                    our decision to hire you. We are expanding and
                                    we are looking to onboard as many talented
                                    creatives in the many cities we are involved in.
                                    Great way to provide value to your friends.
                                    Please provide their name and contact
                                    information (phone number and email) below.</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Networking")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            {/* <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Rate Flexibility</h2>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="yes"
                                        name="flexibility"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="no"
                                        name="flexibility"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Are you a team player?</h2>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="yes"
                                        name="flexibility"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="no"
                                        name="flexibility"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Travel</h2>
                                <div className="flex items-center">
                                    <input  {...register("Travel")}
                                        type="radio"
                                        id="yes"
                                        name="flexibility"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="no"
                                        name="flexibility"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div> */}

                        </div>
                        <div className="flex justify-end gap-2">
                            <DefaultButton
                                css={`font-semibold text-[16px] h-9 }`}
                                disabled={isLoading}
                                onClick={handleBack}
                            >
                                Back
                            </DefaultButton>
                            <DefaultButton
                                css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`}
                                disabled={isLoading}
                                onClick={handleNext}
                            >
                                {isLoading ? <Loader /> : 'Next'}
                            </DefaultButton>
                        </div>
                    </div>
                )}

                {/* Tab 3 */}
                {activeTab === 3 && (
                    <div className='mt-4'>
                        <div className="md:grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">

                            <div>
                                <h2 className="text-sm font-bold mb-2">What do you consider your greatest
                                    professional strength, and how does it benefit
                                    your work?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("greatest")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What are your long-term career goals, and how
                                    does this position align with them?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("long-term")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or
                                    made a mistake at work. How did you handle it,
                                    and what did you learn from the experience?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("situation")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or
                                    made a mistake at work. How did you handle it,
                                    and what did you learn from the experience?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Describe")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Additional Information</h2>
                                <h2 className="text-sm font-bold mb-2">Is there anything that you'd like us to know or
                                    take in consideration when working together?</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Additional")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2"> Networking</h2>
                                <h2 className="text-sm font-bold mb-2 w-full">This will not have any impact whatsoever on
                                    our decision to hire you. We are expanding and
                                    we are looking to onboard as many talented
                                    creatives in the many cities we are involved in.
                                    Great way to provide value to your friends.
                                    Please provide their name and contact
                                    information (phone number and email) below.</h2>
                                <textarea placeholder="Please answer the following questions honestly. " rows="1"  {...register("Networking")} name="" id="" className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Rate Flexibility</h2>
                                <div className="flex items-center">
                                    <input {...register("Rate")}
                                        type="radio"
                                        id="yes"
                                        name="flexibilityOne"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input {...register("Rate")}
                                        type="radio"
                                        id="no"
                                        name="flexibilityOne"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Are you a team player?</h2>
                                <div className="flex items-center">
                                    <input {...register("player")}
                                        type="radio"
                                        id="yes"
                                        name="flexibilityTwo"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input {...register("player")}
                                        type="radio"
                                        id="no"
                                        name="flexibilityTwo"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Travel</h2>
                                <div className="flex items-center">
                                    <input {...register("Travel")}
                                        type="radio"
                                        id="yes"
                                        name="flexibilityThree"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="yes" className="ml-2 block text-sm text-gray-900">
                                        Yes
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input {...register("Travel")}
                                        type="radio"
                                        id="no"
                                        name="flexibilityThree"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="no" className="ml-2 block text-sm text-gray-900">
                                        No
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-end gap-2">
                            <DefaultButton
                                css={`font-semibold text-[16px] h-9 }`}
                                disabled={isLoading}
                                onClick={handleBack}
                            >
                                Back
                            </DefaultButton>

                            <DefaultButton
                                css={`font-semibold text-[16px] h-9 ${isLoading && 'cursor-not-allowed'}`}
                                disabled={isLoading}
                                onClick={handleSubmited}
                            >
                                {isLoading ? <Loader /> : 'Submit'}
                            </DefaultButton>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateNewCp;
