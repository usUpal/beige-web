/* eslint-disable react-hooks/exhaustive-deps */
import { useUpdatePriceMutation } from '@/Redux/features/algo/pricesApi';
import { useGetAllPricingQuery } from '@/Redux/features/pricing/pricingApi';
import AccessDenied from '@/components/errors/AccessDenied';
import { useAuth } from '@/contexts/authContext';
import { setPageTitle } from '@/store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const PricingCalculation = () => {
  const dispatch = useDispatch();
  const {authPermissions} = useAuth();
  const isHavePermission = authPermissions?.includes('pricing_params');

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing parameters'));
  });

  const { isLoading, data, error, refetch } = useGetAllPricingQuery({});
  const [updatePrice, { isLoading: isPatchLoading, isSuccess, isError }] = useUpdatePriceMutation();
  useEffect(() => {
    if (isSuccess) {
      Swal.fire(' Saved!', '', 'success');
      refetch();
    } else if (isError || error) {
      Swal.fire('Error!', 'Something went wrong', 'error');
    }
  }, [isError, isSuccess]);

  const handleRateEdit = async (data: any) => {
    const { rate, title, id } = data;

    // Prompt the user for the new rate
    const result = await Swal.fire({
      title: 'Update Rate',
      input: 'number',
      inputLabel: title,
      inputValue: rate,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write the rate!';
        } else if (value <= 0) {
          return 'Rate should be positive!';
        }
        return null;
      },
    });

    if (result.isConfirmed) {
      try {
        // Perform the rate update
        await updatePrice({ id, rate: result.value });
      } catch (error) {
        // Handle any errors and notify the user
        Swal.fire('Error!', 'Something went wrong', 'error');
      }
    }
  };


  if (!isHavePermission) {
    return (
      <AccessDenied />
    );
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
                  <th>Rate/Hour($)</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {data?.results
                  ?.filter((item) => item?.isHourly === true)
                  .map((price, index) => {
                    const { rate, status, title } = price;
                    return (
                      <tr key={index}>
                        <td className="w-4/12 capitalize">{title}</td>
                        <td>
                          <input disabled name={title} type="number" value={rate} className="form-input w-3/6" />
                        </td>
                        <td>
                          <span className={`badge text-md w-12 ${status === 1 ? 'bg-success' : 'bg-danger'} text-center`}>{status === 1 ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td onClick={() => handleRateEdit(price)}>
                          {/* <span className={`badge text-md w-12 bg-dark text-center cursor-pointer`}>Edit</span> */}
                          <button type="button">{allSvgs.editPen}</button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th className="ltr:rounded-l-md rtl:rounded-r-md">Category</th>
                  <th>Extra Rate($)</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {data?.results
                  ?.filter((item) => item?.isHourly === false)
                  .map((price, index) => {
                    const { rate, status, title } = price;
                    return (
                      <tr key={index}>
                        <td className="w-4/12 capitalize">{title}</td>
                        <td>
                          <input disabled name={title} type="number" value={rate} className="form-input w-3/6" />
                        </td>
                        <td>
                          <span className={`badge text-md w-12 ${status === 1 ? 'bg-success' : 'bg-danger'} text-center`}>{status === 1 ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td onClick={() => handleRateEdit(price)}>
                          {/* <span className={`badge text-md w-12 bg-dark text-center cursor-pointer`}>{allSvgs.editPen} </span>
                           */}
                          <button type="button">{allSvgs.editPen}</button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculation;
