import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useState, useRef } from 'react';
import 'tippy.js/dist/tippy.css';
import Map from '@/components/Map';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import Select from 'react-select';
import Loader from '@/components/SharedComponent/Loader';
import { API_ENDPOINT } from '@/config';
import { trim } from 'lodash';

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

    const [formDataPageOne, setFormDataPageOne] = useState({});

    const [step, setStep] = useState(1);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,}$/;

    const handleSetNewItem = (fieldName: any) => {
        const value = getValues(fieldName);
        if (!value) return;
        setRoleOptions((prevOptions) => [...prevOptions, value]);
        console.log("New role added:", value);
        reset({ [fieldName]: '' });
    };

    const onSubmit = async (data: any) => {
        const { password, cPassword, email } = data;

        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email.');
            return;
        }
        // if (!passwordPattern.test(password)) {
        //     toast.error('Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.).');
        //     return;
        // }

        if (password !== cPassword) {
            toast.error("Password doesn't match.");
            return;
        }

        if (!location) {
            toast.error("Provide your location.");
            return;
        }
        if (!trim(data?.name)) {
            toast.error("Provide your Name.");
            return;
        }
        // const filteredData = Object.fromEntries(
        //     Object.entries({ ...data, timezone: timezone?.value, location: location }).filter(([key, value]) => value !== '')
        // );

        const clientCreationData = {
            name: data.name,
            email: data.email,
            password: data.password,
            location,
            role: "user"
        }
                
        const tabOneData = {
            ...clientCreationData,
            position: handleToStringData(data.position),
            positions_role: handleToStringData(data.positions_role),
            date_of_birth: data.date_of_birth,
            portfolio: data.portfolio,
            backup_footage: handleToStringData(data.backup_footage),
            shoot_availability: handleToStringData(data.shoot_availability),
            notification: handleToStringData(data.notification),
            vediographyCamera: handleToStringData(data.vediographyCamera),
            photographyCamera: handleToStringData(data.photographyCamera),
            lenses: handleToStringData(data.lenses),
            lighting: handleToStringData(data.lighting),
            sound: handleToStringData(data.sound),
            stabilizer: handleToStringData(data.stabilizer),
            content_type: handleToStringData(data.content_type),
            city: location,
        }
        const tabTwoData = {
            role: 'cp',
            additional_equipment: data.additional_equipment,
            rate: data.rate,
            experience: data.experience,
            initiative: data.initiative, //creative_enpowerment
            inWorkPressure: data.inWorkPressure, //high_pressure_task
            motivation: data.motivation, //ok
            handle_co_worker_conflicts: data.handle_co_worker_conflicts, //changed from conflict_handling,
            team_project: data.team_project,
            when_made_mistake: data.when_made_mistake, //changed from failure_experience,
            additional_info: data.additional_info, //ok
            networking: data.networking, //ok
            // contact_number: data.contact_number, //nai
            // prev_contribution: data.prev_contribution, //nai
            // coordinates: data.coordinates, //nai type:number, required:true obj
            // geo_location: data.geo_location, //nai required:true
            // review_status: data.review_status, //nai
            // avg_response_time_to_new_shoot_inquiry: data.avg_response_time_to_new_shoot_inquiry, //nai
            // reference: data.reference, //nai
            // customer_service_skills_experience: data.customer_service_skills_experience, //nai
            // experience_with_post_production_edit: data.experience_with_post_production_edit, //nai
            // travel_to_distant_shoots: data.travel_to_distant_shoots,
            // own_transportation_method: data.own_transportation_method, // nai
            // neighborhood: data.neighborhood, //nai
            // zip_code:  data.zip_code, //nai
            // content_type: data.content_type, //nai
            // content_verticals: data.content_verticals, //nai
            // vst: data.vst, //nai
            // trust_score: data.trust_score, //nai
        }
        const tabThreeData = {
            professional_strength: data.professional_strength, //greatest_professional,
            long_term_goals: data.long_term_goals,
            rateFlexibility: data.rateFlexibility, //
            team_player: data.team_player,
            travel: data.travel
        }

        const allCpDataForm = {
            ...tabOneData, ...tabTwoData, ...tabThreeData
        };

        if (Object.keys(clientCreationData).length > 0) {
            setIsLoading(true);
            setFormDataPageOne(data);
            if (activeTab === 1) {

                if (Object.keys(clientCreationData).length > 0) {
                    // creating user
                    // try {
                    //     const response = await fetch(`${API_ENDPOINT}auth/register`, {
                    //         method: 'POST',
                    //         headers: {
                    //             'Content-Type': 'application/json',
                    //         },
                    //         body: JSON.stringify(clientCreationData),
                    //     });

                    //     const result = await response.json();

                    //     if (response.ok) {
                    //         console.log('Success:', result);
                    //         toast.success('Registration successful!');
                    //     } else {
                    //         if (result.code === 400) {
                    //             toast.error(`${result.message}`);
                    //         }
                    //         else {
                    //             toast.error(`Something went wrong, Please try again!`);
                    //         }
                    //     }
                        console.log("🚀 ~ onSubmit ~ tabOneData:", tabOneData);

                    // } catch (error) {
                    //     console.error('Network error:', error);
                    //     toast.error('An error occurred. Please try again later.');
                    // }
                    setFormFlipped(true);
                    setActiveTab(activeTab === 1 ? 2 : 3);
                    setIsLoading(false);
                }
            }
        }
    };

    const handleToStringData = (property) => property.map(p => p.value);

    const staticFormInfos =
    {
        positions: [
            { value: 'producer', label: 'Producer' },
            { value: 'director', label: 'Director' },
            { value: 'videographer', label: 'Videographer' },
            { value: 'photographer', label: 'Photographer' },
            { value: 'droneOperator', label: 'Drone Operator' },
            { value: 'photoEditor', label: 'Photo Editor' },
            { value: 'videoEditor', label: 'Video Editor' },
        ],

        positionsRole: [
            { value: 'producer', label: 'Producer' },
            { value: 'director', label: 'Director' },
            { value: 'videographer', label: 'Videographer' },
            { value: 'photographer', label: 'Photographer' },
            { value: 'droneOperator', label: 'Drone Operator' },
            { value: 'photoEditor', label: 'Photo Editor' },
            { value: 'videoEditor', label: 'Video Editor' },
        ],

        backupFootages: [
            { value: 'hardDrive ', label: 'Hard Drive ' },
            { value: 'sdCard', label: 'SD Card' },
            { value: 'googleDrive', label: 'Google Drive' },
            { value: 'weTransfer', label: 'We Transfer' },
        ],

        shootAvailibilities: [
            { value: 'During the week and weekend', label: 'During the week and weekend' },
            { value: 'Only during the week', label: 'Only during the week' },
            { value: 'Only during the weekends', label: 'Only during the weekends' },
            { value: 'Flexibility to do last minute shoots', label: 'Flexibility to do last minute shoots' },
            { value: 'All of the above', label: 'All of the above' },
        ],

        notifications: [
            { value: '1 Day anticipation', label: '1 days anticipation' },
            { value: '2 days anticipation', label: '2 days anticipation' },
            { value: '1 week anticipation', label: '1 week anticipation' },
            { value: '1 month anticipation', label: '1 month anticipation' },
        ],

        videographyEqupmentCamera: [
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
        ],

        contentExperience: [
            { value: 'Corporate/Commercials', label: 'Corporate/Commercials' },
            { value: 'Corporate Events', label: 'Corporate Events' },
            { value: 'Documentary', label: 'Documentary' },
            { value: 'Events(Birthday party, baby Shower, Launch Party, etc)', label: 'Events(Birthday party, baby Shower, Launch Party, etc)' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Wedding', label: 'Wedding' },
            { value: 'Interviews Testimonials', label: 'Interviews Testimonials' },
            { value: 'Live Stream', label: 'Live Stream' },
        ],

        photography: [
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
        ],

        lenses: [
            { value: 'wildAngle', label: 'Wild Angle' },
            { value: 'Clear “Protective” Lens', label: 'Clear “Protective” Lens' },
            { value: 'Polarizer', label: 'Polarizer' },
            { value: 'Zoom Lens', label: 'Zoom Lens' },
            { value: 'macros', label: 'Macros' },
            { value: 'Tamron SP 85mm F/71.8 Di VC USD', label: 'Tamron SP 85mm F/71.8 Di VC USD' },
            { value: 'Nikon AF-S NIKKOR 70-200 f/2.8 E FL ED VR lens', label: 'Nikon AF-S NIKKOR 70-200 f/2.8 E FL ED VR lens' },
            { value: 'Canon RF 24-70 mm f/2/8 L IS USM Lens', label: 'Canon RF 24-70 mm f/2/8 L IS USM Lens' },
            { value: 'Others', label: 'Others' },
        ],

        lighting: [
            { value: 'Three-point Lighting Kit', label: 'Three-point Lighting Kit' },
            { value: 'Light Reflector', label: 'Light Reflector' },
            { value: 'GVM 3-Point Light Kit With RGB Leds', label: 'GVM 3-Point Light Kit With RGB Leds' },
            { value: 'Aputure Light Dome SE', label: 'Aputure Light Dome SE' },
            { value: 'Others', label: 'Others' },
        ],
        sound: [
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
        ],

        stabilizer: [
            { value: 'DSLR Shoulder Mount Rig', label: 'DSLR Shoulder Mount Rig' },
            { value: 'Gimbal Stabilizer', label: 'Gimbal Stabilizer' },
            { value: 'Tripod Dolly', label: 'Tripod Dolly' },
            { value: 'Jid Crane', label: 'Jid Crane' },
            { value: 'DJI Osmo Mobile 4', label: 'DJI Osmo Mobile 4' },
        ],
    }


    const handleBack = () => {
        setActiveTab((activeTab) => (activeTab === 3 ? 2 : 1));
    }

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
                                    <label htmlFor="name">Name</label>
                                    <input id="name" placeholder="Full Name" {...register("name", { required: true })} className="form-input" />
                                    {errors.firstName && <span className='text-danger text-sm'>Enter your name</span>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" defaultValue="" {...register("email", { required: true, pattern: emailRegex })} placeholder="eg: exmpal@gmail.com" className="form-input" />
                                    {errors.email && <span className='text-danger text-sm'>Enter a valid Email</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Password</label>
                                    <input type='password' id="password" placeholder="Password" {...register("password", { required: true })} className="form-input capitalize" />
                                    {errors.password && <span className='text-danger text-sm'>Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $, %, etc.)</span>}
                                </div>

                                <div>
                                    <label htmlFor="role">Confirm password</label>
                                    <input type='password' id="confirm_password" {...register("cPassword", { required: true })} placeholder="Confirm password" className="form-input capitalize" />
                                    {errors.cPassword && <span className='text-danger text-sm'>Enter your Confirm password</span>}
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
                                        name="position"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.positions}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="font-semibold ">Positions & Roles</h2>
                                    <p className="text-sm text-gray-500">Please select the positions/Roles that you work on.</p>
                                    <Controller
                                        // not matched
                                        name="positions_role"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.positionsRole}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Portfolio</h2>
                                    <p className="text-sm text-gray-500">Please provide a link to your portfolio(Website, media
                                        platform, etc)</p>
                                    <textarea {...register("portfolio")}
                                        rows={2}
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
                                                options={staticFormInfos?.backupFootages}
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
                                        name="shoot_availability"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.shootAvailibilities}
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
                                                options={staticFormInfos?.notifications}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold ">Videography Camera</h2>
                                    <p className="text-sm text-gray-500">Camera gear for Video</p>
                                    <Controller
                                        // vediographyCamera
                                        name="vediographyCamera"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.videographyEqupmentCamera}
                                                placeholder="Choose Select..."
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">Photography Camera</h2>
                                    <p className="text-sm text-gray-500">Camera gear for Photo</p>
                                    <Controller
                                        // not matched
                                        name="photographyCamera"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.photography}
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
                                        // name="lenses"
                                        name='lenses'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.lenses}
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
                                                options={staticFormInfos?.lighting}
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
                                                options={staticFormInfos?.sound}
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
                                                options={staticFormInfos?.stabilizer}
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
                                        name="content_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={staticFormInfos?.contentExperience}
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
                            // onClick={handleNext}
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
                                    rows={1}
                                    {...register("additional_equipment")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold ">Rates($)</h2>
                                <p className="text-sm text-gray-500">Please let us know how you work and pricing.</p>
                                <input
                                    placeholder="Your Rates($)"
                                    // rows={1}
                                    type="number"
                                    {...register("rate")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold">Experience/Post Production</h2>
                                <p className="text-sm text-gray-500">if you also edit your own work, please let us know the
                                    tools you use for editing and your style of editing.</p>
                                <textarea
                                    placeholder="Your Experience"
                                    rows={1}
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
                                    rows={1}
                                    {...register("creative_empowerment")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you had to handle a high-pressure task. How did you manage it and what was the outcome?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("inWorkPressure")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What motivates you in your work? Is it achieving goals, helping others, or something else?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("motivation")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">How do you handle conflicts or disagreements with coworkers or superiors?*</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("handle_co_worker_conflicts")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a time when you had to work on a team project. What was your role, and how did you contribute to the team's success?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("team_project")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">Describe a situation when you faced failure or made a mistake at work. How did you handle it, and what did you learn from the experience?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("when_made_mistake")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Additional Information</h2>
                                <h2 className="text-sm font-bold mb-2">Is there anything that you'd like us to know or take in consideration when working together?</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
                                    {...register("additional_info")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Networking</h2>
                                <h2 className="text-sm font-bold mb-2 w-full">This will not have any impact whatsoever on our decision to hire you. We are expanding and we are looking to onboard as many talented creatives in the many cities we are involved in. Great way to provide value to your friends. Please provide their name and contact information (phone number and email) below.</h2>
                                <textarea
                                    placeholder="Please answer"
                                    rows={1}
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
                            // onClick={handleNext}
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
                                    rows={1}
                                    {...register("professional_strength")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold mb-2">What are your long-term career goals, and how does this position align with them?</h2>
                                <textarea
                                    placeholder="Please answer the following questions honestly."
                                    rows={1}
                                    {...register("long_term_goals")}
                                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold mb-2">Rate Flexibility</h2>
                                <div className="flex items-center">
                                    <input
                                        {...register("rateFlexibility")}
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