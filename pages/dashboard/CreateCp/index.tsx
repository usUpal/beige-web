import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
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
    const [step, setStep] = useState(1);
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

        console.log("Data:", filteredData);

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

    const PositionsRole = [
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
        { value: 'Corporate/Commercials', label: 'Corporate/Commercials' },
        { value: 'Corporate Events', label: 'Corporate Events' },
        { value: 'Documentary', label: 'Documentary' },
        { value: 'Events(Birthday party, baby Shower, Launch Party, etc)', label: 'Events(Birthday party, baby Shower, Launch Party, etc)' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Wedding', label: 'Wedding' },
        { value: 'Interviews Testimonials', label: 'Interviews Testimonials' },
        { value: 'Live Stream', label: 'Live Stream' },
    ];

    const Photography = [
        { value: 'Panasonic GH5(4K)', label: 'Panasonic GH5(4K)' },
        { value: 'Camera Light', label: 'Camera Light' },
        { value: 'GoPro Hero', label: 'GoPro Hero' },
        { value: 'DJI Inspire Quadcopter', label: 'DJI Inspire Quadcopter' },
        { value: '360-Degree Video', label: '360-Degree Video' },
        { value: 'DSLR Camera (4K)', label: 'DSLR Camera (4K)' },
        { value: 'Sony A7III', label: 'Sony A7III' },
        { value: 'Sony A7SIII', label: 'Sony A7SIII' },
        { value: 'Sony ZV-1', label: 'Sony ZV-1' },
        { value: 'Nikon D850', label: 'Nikon D850' },
        { value: 'Canon EOS R', label: 'Canon EOS R' },
        { value: 'Others', label: 'Others' },
    ];

    const Lenses = [
        { value: 'Wild Angle', label: 'Wild Angle' },
        { value: 'Clear “Protective” Lens', label: 'Clear “Protective” Lens' },
        { value: 'Polarizer', label: 'Polarizer' },
        { value: 'Zoom Lens', label: 'Zoom Lens' },
        { value: 'Macros', label: 'Macros' },
        { value: 'Tamron SP 85mm F/71.8 Di VC USD', label: 'Tamron SP 85mm F/71.8 Di VC USD' },
        { value: 'Nikon AF-S NIKKOR 70-200 f/2.8 E FL ED VR lens', label: 'Nikon AF-S NIKKOR 70-200 f/2.8 E FL ED VR lens' },
        { value: 'Canon RF 24-70 mm f/2/8 L IS USM Lens', label: 'Canon RF 24-70 mm f/2/8 L IS USM Lens' },
        { value: 'Others', label: 'Others' },
    ];

    const Lighting = [
        { value: 'Three-point Lighting Kit', label: 'Three-point Lighting Kit' },
        { value: 'Light Reflector', label: 'Light Reflector' },
        { value: 'GVM 3-Point Light Kit With RGB Leds', label: 'GVM 3-Point Light Kit With RGB Leds' },
        { value: 'Aputure Light Dome SE', label: 'Aputure Light Dome SE' },
        { value: 'Others', label: 'Others' },
    ];

    const Sound = [
        { value: 'Sound equipment', label: 'Sound equipment' },
        { value: 'Shotgun Microphone', label: 'Shotgun Microphone' },
        { value: 'Boom Pole', label: 'Boom Pole' },
        { value: 'Shock Mount', label: 'Shock Mount' },
        { value: 'Audio(XLR) Cables', label: 'Audio(XLR) Cables' },
        { value: 'Wireless Microphone', label: 'Wireless Microphone' },
        { value: 'Portable Digital Audio Recorder', label: 'Portable Digital Audio Recorder' },
        { value: 'Rode VideoLic Pro+', label: 'Rode VideoLic Pro+' },
        { value: 'Rode VideoMic Go', label: 'Rode VideoMic Go' },
        { value: 'Lavalier Microphones', label: 'Lavalier Microphones' },
    ];

    const Stabilizer = [
        { value: 'DSLR Shoulder Mount Rig', label: 'DSLR Shoulder Mount Rig' },
        { value: 'Gimbal Stabilizer', label: 'Gimbal Stabilizer' },
        { value: 'Tripod Dolly', label: 'Tripod Dolly' },
        { value: 'Jid Crane', label: 'Jid Crane' },
        { value: 'DJI Osmo Mobile 4', label: 'DJI Osmo Mobile 4' },
    ];




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
                                    <input id="name" placeholder="Full Name" {...register("firstName", { required: true })} className="form-input" />
                                    {errors.firstName && <span className='text-danger text-sm'>Enter your name</span>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" defaultValue="" {...register("email", { required: true, pattern: emailRegex })} placeholder="eg: exmpal@gmail.com" className="form-input" />
                                    {errors.email && <span className='text-danger text-sm'>Enter a valid Email</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Password</label>
                                    <input type='password' id="password" placeholder="Password" {...register("password", { required: true, pattern: PasswordPattern })} className="form-input capitalize" />
                                    {errors.Password && <span className='text-danger text-sm'>Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.)</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Confirm password</label>
                                    <input type='password' id="confirm_password" {...register("confirm_password", { required: true })} placeholder="Confirm password" className="form-input capitalize" />
                                    {errors.CPassword && <span className='text-danger text-sm'>Enter your Confirm password</span>}
                                </div>

                                <div className="flex-grow">
                                    <label htmlFor="geo_location">Location</label>
                                    <Map setGeo_location={setGeoLocation} setLocation={setLocation} defaultValue={geoLocation} {...register("location")} />
                                </div>

                                <div className=''>
                                    <label htmlFor="timezone">Timezone</label>
                                    <TimezoneSelect
                                        value={timezone}
                                        onChange={(selectedTimezone) => {
                                            setTimezone(selectedTimezone);
                                            setValue("Timezone", selectedTimezone?.value || '');
                                        }}
                                    />
                                </div>

                                <div className=''>
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input type='date' {...register('date_of_birth')} className="form-input" placeholder="Add Role" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Positions </h2>
                                    <p className="text-sm text-gray-500">Select your main position</p>
                                    <Controller
                                        name="positions_options"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={PositionsOptions}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="font-semibold ">Positions & Roles</h2>
                                    <p className="text-sm text-gray-500">Please select the positions/Roles that you work on.</p>

                                    <Controller
                                        name="positions_options_role"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={PositionsRole}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Portfolio</h2>
                                    <p className="text-sm text-gray-500">Please provide a link to your portfolio(Website, media
                                        platform, etc)</p>
                                    <input {...register("protfolio_answer")}
                                        type="text"
                                        className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Your answer"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Backup Footage</h2>
                                    <p className="text-sm text-gray-500">How do you back up footage on the day of shoot to
                                        ensure it does not get lost?</p>
                                    <Controller
                                        name="backup_footage"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={backupFootage}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Availability</h2>
                                    <p className="text-sm text-gray-500">We want to work with you on the best way possible,
                                        Please let us know about your availibility?</p>
                                    <Controller
                                        name="availibility"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Availibility}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />

                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Notification</h2>
                                    <p className="text-sm text-gray-500">We want to work with you on the best way possible,
                                        Please let us know about your availibility?</p>
                                    <Controller
                                        name="notification"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Notification}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold ">Videography Camera</h2>
                                    <p className="text-sm text-gray-500">Camera gear for Video</p>
                                    <Controller
                                        name="videography_camera"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={videographyCamera}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Photography Camera</h2>
                                    <p className="text-sm text-gray-500">Camera gear for Photo</p>
                                    <Controller
                                        name="photography"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Photography}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Lenses</h2>
                                    <p className="text-sm text-gray-500">Lenses: Wide Angle, Clear “Protective” Lens, Polarizer,
                                        Zoom Lens, Macros, etc.</p>
                                    <Controller
                                        name="lenses"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Lenses}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold ">Lighting</h2>
                                    <p className="text-sm text-gray-500">Light equipment</p>
                                    <Controller
                                        name="lighting"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Lighting}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Sound</h2>
                                    <p className="text-sm text-gray-500">Sound equipment</p>
                                    <Controller
                                        name="sound"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Sound}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold ">Stabilizer</h2>
                                    <p className="text-sm text-gray-500">Stabilizer Equipment</p>
                                    <Controller
                                        name="stabilizer"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={Stabilizer}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>


                                <div>
                                    <h2 className="text-sm font-bold">Content Speciality Experience</h2>
                                    <p className="text-sm text-gray-500">As a professional, one can do difference type of shoots,
                                        nevertheless, we all have are strengths and weakness in
                                        our work area, Please share the types of shoots you have experience with and are comfortable with doing.</p>
                                    <Controller
                                        name="content_experience"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={ContentExperience}
                                                placeholder="Choose Select..."
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
                                <h2 className="text-sm font-bold ">Additional Equipment</h2>
                                <p className="text-sm text-gray-500">Please provide a link to your portfolio(Website, media
                                    platform, etc)</p>
                                <textarea
                                    placeholder="Your answer"
                                    rows="1"
                                    {...register("additional_equipment")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold ">Rates($)</h2>
                                <p className="text-sm text-gray-500">Please let us know how you work and pricing.</p>
                                <textarea
                                    placeholder="Your Rates($)"
                                    rows="1"
                                    type="number"
                                    {...register("rates")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold">Experience/Post Production</h2>
                                <p className="text-sm text-gray-500">if you also edit your own work, please let us know the
                                    tools you use for editing and your style of editing.</p>
                                <textarea
                                    placeholder="Your Experience"
                                    rows="1"
                                    {...register("experience")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold">Creative empowerment & Initiative</h2>
                                <p className="text-sm text-gray-500">it’s important for us to know if you’re comfortable to
                                    take initiative on set. We want to provide our clients
                                    our best quality service and also take care of our crew.
                                    Are you in extrovert or an introvert? Do you feel
                                    comfortable interacting with people?</p>
                                <textarea
                                    placeholder="Your Creative"
                                    rows="1"
                                    {...register("creative_empowerment")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you had to handle a high-pressure task. How did you manage it and what was the outcome?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("high_pressure_task")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What motivates you in your work? Is it achieving goals, helping others, or something else?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("motivation")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">How do you handle conflicts or disagreements with coworkers or superiors?*</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("conflict_handling")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a time when you had to work on a team project. What was your role, and how did you contribute to the team's success?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("team_project")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or made a mistake at work. How did you handle it, and what did you learn from the experience?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("failure_experience")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Additional Information</h2>
                                <h2 className="text-sm font-bold mb-2">Is there anything that you'd like us to know or take in consideration when working together?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("additional_info")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Networking</h2>
                                <h2 className="text-sm font-bold mb-2 w-full">This will not have any impact whatsoever on our decision to hire you. We are expanding and we are looking to onboard as many talented creatives in the many cities we are involved in. Great way to provide value to your friends. Please provide their name and contact information (phone number and email) below.</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows="1"
                                    {...register("networking")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
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
                                <h2 className="text-sm font-bold mb-2">What do you consider your greatest professional strength, and how does it benefit your work?</h2>
                                <textarea
                                    placeholder="Please answer the following questions honestly."
                                    rows="1"
                                    {...register("greatest_professional")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What are your long-term career goals, and how does this position align with them?</h2>
                                <textarea
                                    placeholder="Please answer the following questions honestly."
                                    rows="1"
                                    {...register("long_term")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Rate Flexibility</h2>
                                <div className="flex items-center">
                                    <input
                                        {...register("rate_flexibility")}
                                        type="radio"
                                        id="rateYes"
                                        name="Rate"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="rateYes" className="ml-2 block text-sm text-gray-900">Yes</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        {...register("rate_flexibility")}
                                        type="radio"
                                        id="rateNo"
                                        name="Rate"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="rateNo" className="ml-2 block text-sm text-gray-900">No</label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Are you a team player?</h2>
                                <div className="flex items-center">
                                    <input
                                        {...register("team_player")}
                                        type="radio"
                                        id="playerYes"
                                        name="player"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="playerYes" className="ml-2 block text-sm text-gray-900">Yes</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        {...register("team_player")}
                                        type="radio"
                                        id="playerNo"
                                        name="player"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="playerNo" className="ml-2 block text-sm text-gray-900">No</label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Travel</h2>
                                <div className="flex items-center">
                                    <input
                                        {...register("travel")}
                                        type="radio"
                                        id="travelYes"
                                        name="Travel"
                                        value="yes"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="travelYes" className="ml-2 block text-sm text-gray-900">Yes</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        {...register("travel")}
                                        type="radio"
                                        id="travelNo"
                                        name="Travel"
                                        value="no"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="travelNo" className="ml-2 block text-sm text-gray-900">No</label>
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
