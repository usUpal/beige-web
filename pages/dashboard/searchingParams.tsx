import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_ENDPOINT } from '@/config';
interface FormData {
  content_type: number;
  content_vertical: number;
  vst: number;
  avg_rating: number;
  avg_response_time: number;
}
const SearchingParams = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // previous code
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Searching Params'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const fetchDataAndPopulateForm = () => {
    fetch(`${API_ENDPOINT}settings/algo/search`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming 'data' is the response object with field values
        // Update the form fields with the fetched data
        setValue('content_type', data.content_type);
        setValue('content_vertical', data.content_vertical);
        setValue('vst', data.vst);
        setValue('avg_rating', data.avg_rating);
        setValue('avg_response_time', data.avg_response_time);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchDataAndPopulateForm();
  }, []);

  function onSubmit(data: any) {
    handlePostSearchingParams(data);
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

      <div className="grid grid-cols-1 lg:grid-cols-1 mt-5">
        {/* icon only */}
        <div className="panel">
          <div className="mb-5 flex items-center justify-between">
            <h5 className="text-[26px] font-bold dark:text-white-light font-mono mb-5">Searching Params</h5>
          </div>
          <div className="mb-5">
            <div className="inline-block w-full">
              <div className="relative z-[1]"></div>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                <div className='flex justify-between items-center'>
                  {/* Content Type */}
                  <div className="flex flex-col sm:flex-row basis-[45%]">
                    <label htmlFor="content_type" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Type</label>
                    <input type="number" className="form-input" id="content_type" {...register('content_type', { required: 'Content Type is required' })} />
                    {errors.content_type && <p className="text-danger">{errors?.content_type.message}</p>}
                  </div>
                  {/* Content Vertical */}
                  <div className="flex flex-col sm:flex-row basis-[45%]">
                    <label htmlFor="content_vertical" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Content Vertical</label>
                    <input type="number" className="form-input" id="content_vertical" {...register('content_vertical', { required: 'Content Vertical is required' })} />
                    {errors.content_vertical && <p className="text-danger">{errors?.content_vertical.message}</p>}
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  {/* vst */}
                  <div className="flex flex-col sm:flex-row basis-[45%]">
                    <label htmlFor="vst" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">VST</label>
                    <input type="number" className="form-input" id="vst" {...register('vst', { required: 'vst is required' })} />
                    {errors.vst && <p className="text-danger">{errors?.vst.message}</p>}
                  </div>
                  {/* Average Rating */}
                  <div className="flex flex-col sm:flex-row basis-[45%]">
                    <label htmlFor="avg_rating" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Average Rating</label>
                    <input type="number" className="form-input" id="avg_rating" {...register('avg_rating', { required: 'Average Rating is required' })} />
                    {errors.avg_rating && <p className="text-danger">{errors?.avg_rating.message}</p>}
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  {/* Average Response Time */}
                  <div className="flex flex-col sm:flex-row basis-[45%]">
                    <label htmlFor="avg_response_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Average Response Time</label>
                    <input type="number" className="form-input" id="avg_response_time" {...register('avg_response_time', { required: 'A.Response Time is required' })} />
                    {errors.avg_response_time && <p className="text-danger">{errors?.avg_response_time.message}</p>}
                  </div>
                </div>
                <button type="submit" className="btn bg-black text-white mt-6 font-sans">Enter</button>

              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SearchingParams;
