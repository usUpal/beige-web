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
        { value: 'Photography', label: 'Photography' },
        { value: 'Videography', label: 'Videography' },
    ],

    contentVertical: [
        { value: 'Corporate & Commercials', label: 'Corporate & Commercials' },
        { value: 'Corporate Events', label: 'Corporate Events' },
        { value: 'Documentary', label: 'Documentary' },
        { value: 'Events(Birthday party, baby Shower, Launch Party, etc)', label: 'Events(Birthday party, baby Shower, Launch Party, etc)' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Wedding', label: 'Wedding' },
        { value: 'Interviews Testimonials', label: 'Interviews Testimonials' },
        { value: 'Live Stream', label: 'Live Stream' },
    ],

    photographyEquipmentCamera: [
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
        { value: 'wide Angle', label: 'Wide Angle' },
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

export const CpInputData = staticFormInfos;
