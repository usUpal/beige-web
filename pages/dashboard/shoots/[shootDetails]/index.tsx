import React from 'react';
import Link from 'next/link';
import StatusBg from '@/components/Status/StatusBg';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '@/config';
import Image from 'next/image';

const ShootDetails = () => {
  const [shootInfo, setShootInfo] = useState<ShootTypes | null>(null);
  console.log(shootInfo);
  const router = useRouter();
  const shootId = router.query.shootDetails;
  console.log(shootId);

  const getShootDetails = async (shootId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}orders/${shootId}`);
      const shootDetailsRes = await response.json();

      if (!shootDetailsRes) {
        console.log(response);
      } else {
        setShootInfo(shootDetailsRes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShootDetails(shootId);
  }, []);

  return (
    <div className="pb-5 pl-5 pr-5">
      <div className="mt-5 flex items-center justify-between">
        <div className="basis-[40%] pr-8">
          <h2 className="mb-[15px] mt-[30px] font-mono text-[22px] font-bold capitalize leading-none text-[#000000]">orderName</h2>
          <div>
            <span className="shootDate mb-[10px] block border-b-[1px] border-t-[1px] border-b-[#ACA686] border-t-[#ACA686] pb-[10px] pt-[10px] font-sans  leading-[18.2px] text-[#000000] text-[16x]">
              <strong>Date: </strong>
              {shootInfo?.shoot_datetimes?.map((ShootDatetime, idx) => (
                <span key={idx}>{new Date(ShootDatetime?.start_date_time).toDateString()}</span>
              ))}
              {shootInfo?.shoot_datetimes?.map((ShootDatetime, idx) => (
                <span key={idx}>{new Date(ShootDatetime?.start_date_time).toDateString()}</span>
              ))}
            </span>
            <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
              <strong>Shoot Type: </strong>
              {shootInfo?.content_type}
            </span>
            <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
              <strong>Location: </strong>
              {shootInfo?.location}
            </span>
            <span className="mb-[10px] block border-b-[1px] border-b-[#ACA686] pb-[10px] font-sans text-[16px]  capitalize leading-[18.2px] text-[#000000]">
              <strong>Files: </strong>
              <Link href={'/dashboard/files'} className="rounded-[10px] border border-solid border-[#111] px-2 py-1 uppercase leading-none">
                Available
              </Link>
            </span>
          </div>
        </div>
        <div className="basis-[60%] rounded-[15px] border border-solid border-[#ACA686]">
          <iframe
            className="rounded-[15px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.8194623228624!2d90.36562207597385!3d23.82501808590643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c131a95e3afd%3A0x78b320e2234f87bc!2sRd%20No.%2012%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1696151396090!5m2!1sen!2sbd"
            width="100%"
            height="300"
            style={{ border: '0' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="mb-[30px] mt-[30px]">
        <div className="flex items-center justify-start">
          <div className="flex items-center justify-start">
            <span className="mr-3 inline-block font-mono text-[20px] font-bold leading-none text-[#545454]">Payout:</span>
            <span className="font-mono text-[28px] font-bold text-[#ACA686]">$23.33</span>
          </div>
          <div className="relative ml-[260px] border-[#000] py-[10px] font-sans text-[16px] font-medium capitalize">
            <StatusBg>{shootInfo?.order_status}</StatusBg>
            <span className="absolute left-[20px] top-[-7px] inline-block rounded-[3px] border border-solid border-[#8FD0AD] bg-[#ffffff] px-[5px] py-[1px] text-[10px] leading-none text-[#000000]">
              {shootInfo?.description}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-[10px] font-mono text-[20px] font-bold leading-none text-[#545454]">Shot status</h2>
        <p className="font-regular mr-[15px] text-[16px] text-[#6b6b6b]">Description</p>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 gap-6 pt-10 xl:grid-cols-2">
        <div className="mb-5">
          <div className="sm:flex">
            <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
              <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
            </div>
            <div className="flex-1">
              <div className="z-3 relative top-[-10px] mb-10 rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                <style jsx global>{`
                  .hello {
                    border-left-color: #aca686;
                    border-right-color: transparent;
                    border-bottom-color: #aca686;
                    border-top-color: transparent;
                  }
                `}</style>
                <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">pending</h6>
                <p className="font-sans text-[16px] text-[#000000]">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
          </div>

          <div className="sm:flex">
            <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
              <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
            </div>
            <div className="flex-1">
              <div className="z-3 relative top-[-10px] mb-10 rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                <style jsx global>{`
                  .hello {
                    border-left-color: #aca686;
                    border-right-color: transparent;
                    border-bottom-color: #aca686;
                    border-top-color: transparent;
                  }
                `}</style>
                <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">production</h6>
                <p className="font-sans text-[16px] text-[#000000]">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
          </div>

          <div className="sm:flex">
            <div className="relative z-[2] mx-auto mt-3 before:absolute before:-bottom-[15px] before:left-1/2 before:top-[15px] before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
              <img src="/assets/images/timeline-checked.svg" alt="img" className="mx-auto h-[20px] w-[20px] rounded-full" />
            </div>
            <div className="flex-1">
              <div className="z-3 relative top-[-10px] rounded-[20px] border border-solid border-[#ACA686] bg-white p-5 pl-7">
                <style jsx global>{`
                  .hello {
                    border-left-color: #aca686;
                    border-right-color: transparent;
                    border-bottom-color: #aca686;
                    border-top-color: transparent;
                  }
                `}</style>
                <div className="hello absolute -left-2 top-6 h-4 w-4 rotate-45 border border-solid bg-white"></div>
                <h6 className="mb-2 border-b border-[#D9D9D9] pb-2 font-mono text-xl font-medium uppercase text-black">pre-production</h6>
                <p className="font-sans text-[16px] text-[#000000]">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Manager */}
      <h2 className="mb-[15px] mt-[30px] font-mono text-[20px] font-bold leading-none text-[#545454]">File link</h2>
      <div className="flex items-center justify-start rounded-[10px] border border-solid border-[#f1f4f5] p-[15px] md:w-1/2">
        <img src="/assets/images/file.svg" alt="file-icon" className="mr-[15px] rounded-[10px]" />
        <div className="">
          <h3 className="font-mono text-[18px] font-bold capitalize leading-[1.2em] text-[#1b1b1b]">corporate video shoot</h3>
          <span className="font-sans text-[16px] capitalize leading-none text-[#6b6b6b]">last update: aug 20 2021</span>
          <ul className="mt-[10px] flex items-center justify-start">
            <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
              folder: <strong>00</strong>
            </li>
            <span className="mx-[10px] inline-block h-[8px] w-[8px] rounded-full bg-[#ACA686]"></span>
            <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
              items: <strong>00</strong>
            </li>
            <span className="mx-[10px] inline-block h-[8px] w-[8px] rounded-full bg-[#ACA686]"></span>
            <li className="font-regular font-sans text-[16px] capitalize text-[#202020]">
              used: <strong>0 GB</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShootDetails;
