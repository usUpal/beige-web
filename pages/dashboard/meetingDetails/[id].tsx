import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '../../../store/themeConfigSlice';

const shootDetailsPage = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Meeting Details'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return(
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link href="/apps/meetings" className="text-primary hover:underline">
                        Meeting
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Meeting Details</span>
                </li>
            </ul>
            <h2 className="mt-5 bg-[#ACA686] text-center text-white text-[32px] py-[15px] capitalize font-bold leading-none">meeting with mr brian</h2>
            <div className="container">

                {/* Shoot Details */}
                <div className="panel h-full w-full mt-5">
                    <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Order ID:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">213654</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Meeting Date:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">23/09/2023</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Meeting Time:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">09:30 PM</span>
                    </div>
                </div>

                <div className="mt-[60px] mb-[40px]">
                    <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] capitalize mb-[10px]">Meeting Note</h2>
                    <p className="text-[16px] font-normal leading-[26px] text-[#111111]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, libero magni? Animi ab unde eaque ex iste maiores omnis sequi accusantium repellat quo. Qui, repellendus sit? Necessitatibus repellendus tempore consectetur itaque nulla? Reiciendis, quas quibusdam! Labore veniam nihil totam quo, inventore et voluptate asperiores laboriosam, alias autem corrupti explicabo tempora?</p>
                </div>

                <div className="text-center my-[60px]">
                    <label className="font-bold text-[#000000] text-[20px] mb-[10px]"> Reschedule Meeting</label>
                    <input type="datetime-local" name="dated" id="" className="text-[#ffffff] bg-[#ACA686] text-[18px] font-medium py-[15px] px-[25px] rounded-[10px] border border-solid border-[#ACA686] hover:bg-[#ffffff] hover:text-[#ACA686] hover:border-[#ACA686]"/>
                </div>

            </div>
        </>

    );
}

export default shootDetailsPage;
