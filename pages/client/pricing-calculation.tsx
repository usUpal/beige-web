import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';

const PricingCalculation = () => {
  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculation - Client Web App - Beige'));
  });

  const [isData, setData] = useState(null);
  const cleanedData = { ...isData };
  delete cleanedData.__v;
  delete cleanedData._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.beigecorporation.io/v1/prices`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error(`Error fetching data`);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = (key: string) => {
    if (isData[key]) {
      const updatedData = { ...isData };
      updatedData[key].status = updatedData[key].status === 0 ? 1 : 0;
      setData(updatedData);
    }
  };

  const handleRateChange = (key, newValue) => {
    const updatedData = { ...isData };
    updatedData[key].rate = newValue;
    setData(updatedData);
  };

  const getValue = () => {
    const updatedData = JSON.parse(JSON.stringify(cleanedData));
    const url = 'https://api.beigecorporation.io/v1/prices';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-warning hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Pricing Calculator</span>
        </li>
      </ul>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
        {/* icon only */}
        <div className="panel">
          <div className="mb-5 flex items-center justify-between">
            <h5 className="text-lg font-semibold dark:text-white-light">Set Prices</h5>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="ltr:rounded-l-md rtl:rounded-r-md">Category</th>
                  <th>Rate/Hour ($)</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {isData &&
                  Object.keys(cleanedData).map((key, index) => {
                    const { rate, status } = isData[key];
                    return (
                      <tr key={index}>
                        <td className="capitalize">{key}</td>
                        <td>
                          <input name={key} type="number" value={rate} className="form-input w-3/6" onChange={(e) => handleRateChange(key, e.target.value)} />
                        </td>
                        <td>
                          <button type="button" className={`rounded-full px-5 py-2 text-white ${status === 1 ? 'bg-success' : 'bg-danger'}`} onClick={() => handleStatusChange(key)}>
                            {status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                {/* })} */}

                {/* Calculate */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>
                    <button type="submit" className="btn bg-black font-sans text-white" onClick={getValue}>
                      Save
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculation;
