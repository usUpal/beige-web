import {useEffect, useState} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setPageTitle} from '../../store/themeConfigSlice';
import { useForm } from "react-hook-form";
import { log } from 'console';
import { baseURL } from '@/baseURL';


const SearchingParams = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Searching Params'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    function onSubmit (data) {
        console.log(data);
        // handlePostSearchingParams(data);
    }

    const handlePostSearchingParams = (searchingParams) => {
        // setIsLoading(true);
        fetch(`${baseURL}/anything`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchingParams),
        })
          .then(res => res.json())
          .then(async data => {
            if (data) {
              if (data.code === 401 || data.code === 400) {
                // setIsLoading(false);
                console.log("Error:", data);
                return;
              } else {
                // setIsLoading(false);
                // console.log('====== Order SUCCESS-RESPONSE-DATA===>', data);
                console.log('Order SUCCESS-RESPONSE-DATA===>');
              }
            }
          })
          .catch(error => {
            console.log(error);
            // setIsLoading(false);
          });
      };

    return (
        <>
            <h2 className='text-[22px] font-bold'>Searching Params</h2>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                {/* Stack */}
                <div className="panel" id="stack_form">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                        <div className='mb-2'>
                            <label htmlFor="ctype">Content Type</label>
                            <input type="number" className="form-input" defaultValue='1' id='ctype' {...register("ctype",{ required: "Content Type is required" })}/>
                            {errors.ctype && <p className='text-danger'>{errors?.ctype.message}</p>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="cvertical">Content Vertical</label>
                            <input type="number" className="form-input" defaultValue='2' id='cvertical' {...register("cvertical",{ required: "Content Vertical is required" })}/>
                            {errors.cvertical && <p className='text-danger'>{errors?.cvertical.message}</p>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="vst">VST</label>
                            <input type="number" className="form-input" defaultValue='3' id='vst' {...register("vst",{ required: "VST is required" })}/>
                            {errors.vst && <p className='text-danger'>{errors?.vst.message}</p>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="arating">Average Rating</label>
                            <input type="number" className="form-input" defaultValue='4.8' id='arating' {...register("arating",{ required: "Average Rating is required" })}/>
                            {errors.arating && <p className='text-danger'>{errors?.arating.message}</p>}
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="arestime">Average Response Time</label>
                            <input type="number" className="form-input" defaultValue='8' id='arestime' {...register("arestime",{ required: "A.Response Time is required" })}/>
                            {errors.arestime && <p className='text-danger'>{errors?.arestime.message}</p>}
                        </div>
                        <button type="submit" className="btn btn-success !mt-6">Save</button>

                    </form>
                </div>
            </div>
        </>
    );
};

export default SearchingParams;
