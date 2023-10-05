import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useForm } from 'react-hook-form';
import { log } from 'console';
import { baseURL } from '@/baseURL';
import { toast } from 'react-toastify';

const SearchingParams = () => {

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  // previous code
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Searching Params'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;


  const fetchDataAndPopulateForm = () => {
    fetch(`${baseURL}/settings/algo/search`)
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


  function onSubmit(data) {
    handlePostSearchingParams(data);
  }

  const handlePostSearchingParams = (searchingParams) => {
    // setIsLoading(true);
    fetch(`${baseURL}/settings/algo/search`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchingParams)
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
              position: toast.POSITION.TOP_CENTER
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
      <h2 className='text-[22px] font-bold'>Searching Params</h2>
      <div className='grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2'>
        {/* Stack */}
        <div className='panel' id='stack_form'>
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
              <label htmlFor='content_type'>Content Type</label>
              <input type='number' className='form-input'
                     id='content_type' {...register('content_type', { required: 'Content Type is required' })} />
              {errors.content_type && <p className='text-danger'>{errors?.content_type.message}</p>}
            </div>
            <div className='mb-2'>
              <label htmlFor='content_vertical'>Content Vertical</label>
              <input type='number' className='form-input'
                     id='content_vertical' {...register('content_vertical', { required: 'Content Vertical is required' })} />
              {errors.content_vertical && <p className='text-danger'>{errors?.content_vertical.message}</p>}
            </div>
            <div className='mb-2'>
              <label htmlFor='vst'>vst</label>
              <input type='number' className='form-input'
                     id='vst' {...register('vst', { required: 'vst is required' })} />
              {errors.vst && <p className='text-danger'>{errors?.vst.message}</p>}
            </div>
            <div className='mb-2'>
              <label htmlFor='avg_rating'>Average Rating</label>
              <input type='number' className='form-input'
                     id='avg_rating' {...register('avg_rating', { required: 'Average Rating is required' })} />
              {errors.avg_rating && <p className='text-danger'>{errors?.avg_rating.message}</p>}
            </div>
            <div className='mb-2'>
              <label htmlFor='avg_response_time'>Average Response Time</label>
              <input type='number' className='form-input'
                     id='avg_response_time' {...register('avg_response_time', { required: 'A.Response Time is required' })} />
              {errors.avg_response_time && <p className='text-danger'>{errors?.avg_response_time.message}</p>}
            </div>
            <button type='submit' className='btn btn-success !mt-6'>
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchingParams;
