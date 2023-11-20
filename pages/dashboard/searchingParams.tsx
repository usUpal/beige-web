import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_ENDPOINT } from '@/config';
import { cl } from '@fullcalendar/core/internal-common';
interface FormData {
  content_type: number;
  content_vertical: number;
  vst: number;
  avg_rating: number;
  avg_response_time: number;
}
const SearchingParams = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Searching Params'));
  });
  const [params, setParams] = useState({});

  // State for manage Tabledata
  const [tableData, setTableData] = useState({
    accepted_shoots: { weight: '', score: '' },
    average_rating: '',
    avg_response_time: '',
    backup_footage: '',
    city: '',
    content_type: '',
    content_vertical: '',
    customer_service_experience: '',
    declined_shoots: '',
    equipment: '',
    equipment_specific: '',
    experience_post_production: '',
    no_shows: '',
    portfolio: '',
    successful_beige_shoots: '',
    team_player: '',
    total_earnings: '',
    travel_to_distant_shoots: '',
    vst: '',
  });
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

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with the form data here
    console.log('Form submitted with data:', tableData);
    // Reset the form after submission
  };

  // previous code

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const fetchDataAndPopulateForm = () => {
    fetch(`${API_ENDPOINT}settings/algo/search`)
      .then((res) => res.json())
      .then((data) => {
        console.log('🚀 ~ file: searchingParams.tsx:63 ~ .then ~ data:', data);
        setParams(data);
        setTableData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchDataAndPopulateForm();
  }, []);

  function onSubmit(e: any) {
    console.log('🚀 ~ .tsx:55 ~ onSubmit ~ data:', e.target.value);

    // handlePostSearchingParams(data);
  }

  const handlePostSearchingParams = (searchingParams: any) => {
    // setIsLoading(true);
    fetch(`${API_ENDPOINT}settings/algo/search`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchingParams),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data) {
          if (data.code === 401 || data.code === 400) {
            console.log('Error:', data);
            return;
          } else {
            console.log('🚀 ~ file: searchingParams.tsx:43 ~ .then ~ data:', data);
            toast.success('Params Set Successfully.', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        // setIsLoading(false);
      });
  };

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
                    <input defaultValue={params?.content_type?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.content_type?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>content_vertical</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.content_vertical?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.content_vertical?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>customer_service_experience</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.customer_service_experience?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.customer_service_experience?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>declined_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.declined_shoots?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.declined_shoots?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>equipment</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.equipment?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.equipment?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>equipment_specific</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.equipment_specific?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.equipment_specific?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>experience_post_production</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.experience_post_production?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.experience_post_production?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>no_shows</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.no_shows?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.no_shows?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>

                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>portfolio</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.portfolio?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.portfolio?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>successful_beige_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.successful_beige_shoots?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.successful_beige_shoots?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>team_player</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.team_player?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.team_player?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>total_earnings</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.total_earnings?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.total_earnings?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>travel_to_distant_shoots</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.travel_to_distant_shoots?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.travel_to_distant_shoots?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
                <tr className="border-b border-opacity-20 text-right dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-3 py-2 text-left">
                    <span>vst</span>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <input defaultValue={params?.vst?.weight} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input defaultValue={params?.vst?.score} type="number" className="form-input basis-[40%] font-sans text-[16px] leading-none" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex w-full justify-end">
              <button className="rounded-xl bg-black px-6 py-3 text-white" type="submit">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchingParams;
