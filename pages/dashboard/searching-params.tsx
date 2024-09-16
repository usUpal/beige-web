/* eslint-disable react-hooks/exhaustive-deps */
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { useGetAllSearchingParamsQuery, useUpdateSearchingParamsMutation } from '@/Redux/features/searchingParams/searchingApi';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useAuth } from '@/contexts/authContext';
import AccessDenied from '@/components/errors/AccessDenied';

interface FormData {
  content_type: number;
  content_vertical: number;
  vst: number;
  avg_rating: number;
  avg_response_time: number;
}
const SearchingParams = () => {
  const dispatch = useDispatch();
  const {authPermissions} = useAuth();
  const isHavePermission = authPermissions?.includes('searching_params');
  useEffect(() => {
    dispatch(setPageTitle('Searching Params'));
  });
  const [params, setParams] = useState({});

  // State for manage Tabledata
  const [tableData, setTableData] = useState({
    accepted_shoots: { weight: '', score: '' },
    average_rating: { weight: '', score : '' },
    avg_response_time: { weight: '', score: '' },
    backup_footage: { weight: '', score: '' },
    city: { weight: '', score: '' },
    content_type: { weight: '', score: '' },
    content_vertical: { weight: '', score: '' },
    customer_service_experience: { weight: '', score: '' },
    declined_shoots: { weight: '', score: '' },
    equipment: { weight: '', score: '' },
    equipment_specific: { weight: '', score: '' },
    experience_post_production: { weight: '', score: '' },
    no_shows: { weight: '', score: '' },
    portfolio: { weight: '', score: '' },
    successful_beige_shoots: { weight: '', score: '' },
    team_player: { weight: '', score: '' },
    total_earnings: { weight: '', score: '' },
    travel_to_distant_shoots: { weight: '', score: '' },
    vst: { weight: '', score: '' },
  });
  const { data, isSuccess } = useGetAllSearchingParamsQuery({});
  useEffect(() => {
    if (isSuccess) {
      setParams(data);
      setTableData(data);
    }
  }, [isSuccess]);
  // Event handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested properties like accepted_shoots
    if (name.includes('.')) {
      const [mainProperty, subProperty] = name.split('.');
      setTableData({
        ...tableData,
        [mainProperty]: {
          ...tableData[mainProperty],
          [subProperty]: value,
        },
      });
    } else {
      // Handle regular properties
      setTableData({
        ...tableData,
        [name]: value,
      });
    }
  };
  const [updateSearchingParams, { isLoading }] = useUpdateSearchingParamsMutation();
  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can perform actions with the form data here
    console.log('Form submitted with data:', tableData);

    const res = await updateSearchingParams(tableData);
    toast.success('Info Updated Successfully', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };


  if (!isHavePermission) {
    return (
      <AccessDenied />
    );
  }


  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <div className="container mx-auto rounded-md p-2 dark:bg-gray-900 dark:text-gray-100 sm:p-4">
          <h2 className="leadi mb-3 text-2xl font-semibold">Searching Params</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="rounded-t-lg ">
                <tr className="  text-right">
                  <th title="Team name" className="text-left text-xl font-medium">
                    Perams
                  </th>
                  <th title="Losses" className="p-3 text-xl font-medium">
                    weight
                  </th>
                  <th title="Win percentage" className="p-3 text-xl font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>accepted_shoots</span>
                  </td>
                  <td className="px-3 py-1 text-left">
                    <input
                      onChange={handleInputChange}
                      name="accepted_shoots.weight"
                      value={tableData.accepted_shoots.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-1 text-left">
                    <input
                      onChange={handleInputChange}
                      name="accepted_shoots.score"
                      value={tableData.accepted_shoots.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>average_rating</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="average_rating.weight"
                      value={tableData.average_rating?.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="average_rating.score"
                      value={tableData.average_rating.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>avg_response_time</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="avg_response_time.weight"
                      value={tableData.avg_response_time.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="avg_response_time.score"
                      value={tableData.avg_response_time.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>backup_footage</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="backup_footage.weight"
                      value={tableData.backup_footage.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="backup_footage.score"
                      value={tableData.backup_footage.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>city</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input onChange={handleInputChange} name="city.weight" value={tableData.city.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input onChange={handleInputChange} name="city.score" value={tableData.city.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>content_type</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="content_type.weight"
                      value={tableData.content_type.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="content_type.score"
                      value={tableData.content_type.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>content_vertical</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="content_vertical.weight"
                      value={tableData.content_vertical.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="content_vertical.score"
                      value={tableData.content_vertical.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>customer_service_experience</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="customer_service_experience.weight"
                      value={tableData.customer_service_experience.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="customer_service_experience.score"
                      value={tableData.customer_service_experience.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>declined_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="declined_shoots.weight"
                      value={tableData.declined_shoots.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="declined_shoots.score"
                      value={tableData.declined_shoots.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>equipment</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="equipment.weight"
                      value={tableData.equipment.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input onChange={handleInputChange} name="equipment.score" value={tableData.equipment.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>equipment_specific</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="equipment_specific.weight"
                      value={tableData.equipment_specific.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="equipment_specific.score"
                      value={tableData.equipment_specific.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>experience_post_production</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="experience_post_production.weight"
                      value={tableData.experience_post_production.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="experience_post_production.score"
                      value={tableData.experience_post_production.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>no_shows</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input onChange={handleInputChange} name="no_shows.weight" value={tableData.no_shows.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input onChange={handleInputChange} name="no_shows.score" value={tableData.no_shows.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>

                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>portfolio</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="portfolio.weight"
                      value={tableData.portfolio.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input onChange={handleInputChange} name="portfolio.score" value={tableData.portfolio.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>successful_beige_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="successful_beige_shoots.weight"
                      value={tableData.successful_beige_shoots.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="successful_beige_shoots.score"
                      value={tableData.successful_beige_shoots.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>team_player</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="team_player.weight"
                      value={tableData.team_player.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="team_player.score"
                      value={tableData.team_player.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>total_earnings</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="total_earnings.weight"
                      value={tableData.total_earnings.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="total_earnings.score"
                      value={tableData.total_earnings.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>travel_to_distant_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input
                      onChange={handleInputChange}
                      name="travel_to_distant_shoots.weight"
                      value={tableData.travel_to_distant_shoots.weight}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      onChange={handleInputChange}
                      name="travel_to_distant_shoots.score"
                      value={tableData.travel_to_distant_shoots.score}
                      type="number"
                      className="form-input basis-[40%] font-sans text-[16px] leading-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>vst</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input onChange={handleInputChange} name="vst.weight" value={tableData.vst.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input onChange={handleInputChange} name="vst.score" value={tableData.vst.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex w-full justify-center md:justify-end">
              <DefaultButton css="mt-5 md:me-4 " type="submit">
                {isLoading ? 'Saving...' : 'Save'}
              </DefaultButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchingParams;
