import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';


const Addons = () => {

  const [fields, setFields] = useState([
    { item: "Live Stream", hour: null, rate: null, additionalNotes: "$250/HR" },
    { item: "Add 1 CP (Photo/Video)", hour: null, rate: null, additionalNotes: "$250/HR FOR CREATOR (4HR MIN)" },
    { item: "Green Screen", hour: null, rate: null, additionalNotes: "SET UP COST" },
    { item: "Production Assist", hour: null, rate: null, additionalNotes: "$150/HR (4HR MIN)" },
    { item: "Prejects Cost More", hour: null, rate: null, additionalNotes: "$250/HR (WAIVE $1500 AND TELL CLIENT)" },
    { item: "Prejects Cost Less", hour: null, rate: null, additionalNotes: "$250/HR" },
    { item: "Physical Album", hour: null, rate: null, additionalNotes: "$250/HR" },
    { item: "Ins. Cov. $1M Liability", hour: null, rate: null, additionalNotes: "$250/HR" },
    { item: "Travel After 1 Hour", hour: null, rate: null, additionalNotes: "AFTER THE FIRST FREE HOUR" },
    { item: "Drone", hour: null, rate: null, additionalNotes: "VIDEOGRAPHER THAT HAS DRONE" },
    { item: "Telepromp Ter", hour: null, rate: null, additionalNotes: "PRICING PER DAY" },
  ]);

  const handleFieldChange = (e: any, index: any, fieldKey: Number) => {
    const { value } = e.target;
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][fieldKey] = value;
      return updatedFields;
    });
  };


  const [hour, setHour] = useState(1);
  const [rate, setRate] = useState(1000);



  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculator - Client Web App - Beige'));
  });


  const handleHourChange = (e: any) => {
    const newHour = e.target.value;
    setHour(newHour);
  };

  const handleRateChange = (e: any) => {
    const newRate = e.target.value;
    setHour(newHour);
  };

  const total = hour * rate;


  const calculation = (e: any) => {

    const fields = [
      'liveStream',
      'cpPhotoVideo',
      'greenScreen',
      'productionAssist',
      'projectCostMore',
      'projectCostLess',
      'physicalAlbum',
      'liability',
      'travel',
      'drone',
      'telePrompTer',
    ];

    const data = fields.map((field) => ({
      [`${field}Hour`]: document.getElementById(`${field}Hour`).value,
      [`${field}Rate`]: document.getElementById(`${field}Rate`).value,
      [`${field}Total`]: (document.getElementById(`${field}Hour`).value) * (document.getElementById(`${field}Rate`).value),
      [`${field}Anotes`]: document.getElementById(`${field}Anotes`).value,
    }));

    console.log(data);

  }

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-warning hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Addons Calculation</span>
        </li>
      </ul>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
        {/* icon only */}
        <div className="panel">
          <div className="mb-5 flex items-center justify-between">
            <h5 className="text-lg font-semibold dark:text-white-light">Add-ons</h5>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="ltr:rounded-l-md rtl:rounded-r-md">ITEM</th>
                  <th>HOURS/DAYS</th>
                  <th>RATE($)</th>
                  <th>TOTAL</th>
                  <th>ADDITIONAL NOTES</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                    <td>{field.item}</td>
                    <td><input id="droneHour" name='droneHour' type="number" defaultValue={field.hour} onChange={(e) => handleFieldChange(e, index, 'hour')} className="form-input w-3/6" /></td>
                    <td><input id="droneRate" name='droneRate' type="number" defaultValue={field.rate} onChange={(e) => handleFieldChange(e, index, 'rate')} className="form-input w-3/6" /></td>
                    <td><input id="droneTotal" name='droneTotal' type="text" value={field.hour * field.rate} className="form-input w-3/6" readOnly /></td>
                    <td><input id="droneAnotes" name='droneAnotes' type="text" defaultValue={field.additionalNotes} className="form-input" /></td>
                  </tr>
                ))}
                {/* Calculate */}
                <button type="submit" className="btn bg-black font-sans text-white mt-5" id='submitBtn' onClick={calculation}>Save</button>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );

};

export default Addons;
