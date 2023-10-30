import { useEffect, useState } from 'react';

const Test = () => {

  const [fields, setFields] = useState([
    { hour: null, rate: null },
  ]);
  const handleFieldChange = (e:any, index:any, fieldKey:Number) => {
    const { value } = e.target;
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][fieldKey] = value;
      return updatedFields;
    });
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index}>
          <input type="number" value={field.hour} onChange={(e) => handleFieldChange(e, index, 'hour')} placeholder={field.hour} className="form-input w-3/6"/>
          <input type="number" value={field.rate} onChange={(e) => handleFieldChange(e, index, 'rate')} className="form-input w-3/6"/>
          <input type="text" value={field.hour * field.rate} readOnly className="form-input w-3/6"/>
        </div>
      ))}
    </div>
  );

};

export default Test;
