import { useRouter } from "next/router";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { baseURL } from "@/baseURL";
import StatusBg from '@/components/Status/StatusBg';
import {useDispatch, useSelector} from 'react-redux';
import {setPageTitle} from '../../../store/themeConfigSlice';


function shootDetailsPage () {
    const router = useRouter();
    const { id } = router.query;

    const [shootInfo, setShootInfo] = useState({});
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(true);

    console.log(shootInfo);

    const getShootDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/orders/${id}`);
        const shootDetailsRes = await response.json();

        if (!shootDetailsRes) {
          console.log('Error With order Id', id);
          setShowError(true);
          setLoading(false);
        } else {
          setShootInfo(shootDetailsRes);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    useEffect(() => {
      getShootDetails();
    }, []);

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Shoot Details'));
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
                    <Link href="/apps/shoots" className="text-primary hover:underline">
                        Shoots
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Shoot Details</span>
                </li>
            </ul>
            <h2 className="mt-5 bg-[#ACA686] text-center text-white text-[32px] py-[15px] capitalize font-bold leading-none">{shootInfo?.order_name}</h2>
            <div className="container">

                <div className="panel h-full w-full mt-5">
                    <div className="flex justify-between items-center">
                        {/* Shoot Details */}
                        <div className="basis-[38%]">
                            <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                                <span className="font-bold text-[#545454] capitalize text-[20px]">Order name:</span>
                                <span className="font-normal text-[#828282] capitalize text-[20px]">{shootInfo?.order_name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                                <span className="font-bold text-[#545454] capitalize text-[20px]">Date:</span>
                                <span className="font-normal text-[#828282] capitalize text-[20px]">
                                    {new Date(shootInfo?.createdAt).toDateString()}
                                </span>
                            </div>
                        </div>
                        {/* Location */}
                        <div className="border-2 border-[#ACA686] rounded-[10px] overflow-hidden basis-[55%]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.8194623228624!2d90.36562207597385!3d23.82501808590643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c131a95e3afd%3A0x78b320e2234f87bc!2sRd%20No.%2012%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1696151396090!5m2!1sen!2sbd"
                                width="100%"
                                height="300"
                                style={{ border: '0' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="mt-[60px] mb-[40px]">
                    <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] capitalize mb-[10px]">description</h2>
                    <p className="text-[16px] font-normal leading-[26px] text-[#111111]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, libero magni? Animi ab unde eaque ex iste maiores omnis sequi accusantium repellat quo. Qui, repellendus sit? Necessitatibus repellendus tempore consectetur itaque nulla? Reiciendis, quas quibusdam! Labore veniam nihil totam quo, inventore et voluptate asperiores laboriosam, alias autem corrupti explicabo tempora? {shootInfo?.description}</p>
                </div>

                <div className="border-b-[3px] border-solid border-[#ACA686] pb-[40px] mb-[40px]">
                    <div className="flex justify-center items-center">
                        <div>
                            <span className="text-[#545454] text-[24px] font-bold mr-[15px]">Payout:</span>
                            <span className="text-[#000000] text-[32px] font-bold">$250.00</span>
                        </div>
                        <div className="ml-[260px] relative text-[16px] font-medium capitalize py-[10px] border-[#000]">
                            <StatusBg>{shootInfo?.order_status}</StatusBg>
                            <span className="inline-block absolute top-[-7px] left-[20px] text-[10px] text-[#000000] bg-[#ffffff] px-[5px] py-[1px] border border-solid border-[#8FD0AD] rounded-[3px] leading-none">Status</span>
                        </div>
                    </div>
                </div>

                <div className="text-center my-[60px]">
                    <Link href={`/apps/shootDetails/`}>
                        <span className="text-[#ffffff] bg-[#ACA686] text-[18px] font-medium py-[15px] px-[25px] rounded-[10px] border border-solid border-[#aca686] shadow-[3px 3px 3px 0 rgba(0 0 0 0.3)] mr-[60px] hover:bg-[#ffffff] hover:text-[#aca686]">Upload</span>
                    </Link>
                    <Link href={`/apps/shootDetails/`}>
                        <span className="text-[#000000] bg-[#DEBF97] text-[18px] font-medium py-[15px] px-[25px] rounded-[10px] border border-solid border-[#DEBF97] shadow-[3px 3px 3px 0 rgba(0 0 0 0.3)] hover:bg-[#ffffff] hover:text-[#000000] hover:border-[#000000]">View File</span>
                    </Link>
                </div>

            </div>
        </>

    );
}

export default shootDetailsPage;
