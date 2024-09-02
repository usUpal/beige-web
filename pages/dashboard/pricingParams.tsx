import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { useGetAllPricingQuery } from '@/Redux/features/pricing/pricingApi';

const PricingCalculation = () => {
  const dispatch = useDispatch();
  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing parameters'));
  });

  const [isData, setData] = useState(null);
  const cleanedData = { ...isData };

  const { isLoading, data, error } = useGetAllPricingQuery({});
  console.log('🚀 ~ data:', data);

  const handleStatusChange = (key: string) => {
    // if (isData[key]) {
    //   const updatedData = { ...isData };
    //   updatedData[key].status = updatedData[key].status === 0 ? 1 : 0;
    //   setData(updatedData);
    // }
  };

  const handleRateChange = (key, newValue) => {
    // const updatedData = { ...isData };
    // updatedData[key].rate = newValue;
    // setData(updatedData);
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
          <span>Pricing Params</span>
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
                {data &&
                  data?.results?.map((price, index) => {
                    const { rate, status } = price;
                    return (
                      <tr key={index}>
                        <td className="capitalize">{price?.title}</td>
                        <td>
                          <input name={price?.title} type="number" value={rate} className="form-input w-3/6" onChange={(e) => handleRateChange(price, e.target.value)} />
                        </td>
                        <td>
                          <button type="button" className={`rounded-full px-5 py-2 text-white ${status === 1 ? 'bg-success' : 'bg-danger'}`} onClick={() => handleStatusChange(price)}>
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
function useGetPricesQuery(): { isLoading: any; data: any; error: any } {
  throw new Error('Function not implemented.');
}
