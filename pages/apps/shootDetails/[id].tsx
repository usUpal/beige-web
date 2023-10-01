import { useRouter } from "next/router";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { baseURL } from "@/baseURL";


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
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Shoot Details</h5>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Name</th>
                                    <th>Payout</th>
                                    <th>Date</th>
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="group text-black dark:hover:text-white-light/90">
                                    <td className="capitalize"> {shootInfo?.order_name}</td>
                                    <td>
                                        <span>$249.00</span>
                                    </td>
                                    <td>{shootInfo?.createdAt}</td>
                                    <td className="text-success capitalize drop-shadow-[4px_4px_2px_rgba(0,171,85,0.25)]">{shootInfo?.order_status}</td>
                                    <td className="flex">
                                        <Link href="/">
                                            <img className="text-center" src="/assets/images/upload.svg" alt="upload-icon" title="Upload"/>
                                        </Link>
                                        <Link href="/">
                                            <img className="text-center ml-2" src="/assets/images/eye.svg" alt="view-icon" title="View File"/>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-between items-start mt-[60px]">
                    <div className="basis-[49%]">
                        <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] capitalize mb-[10px]">description</h2>
                        <p className="text-[16px] font-normal leading-[26px] text-[#111111]">{shootInfo?.description}</p>
                    </div>
                    <div className="basis-[49%]">
                        <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] capitalize mb-[10px]">Location</h2>
                        <div className="border-2 border-[#ACA686] rounded-[10px] overflow-hidden">
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
            </div>
        </>

    );
}

export default shootDetailsPage;
