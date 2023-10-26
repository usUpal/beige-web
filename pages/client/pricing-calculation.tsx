import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';

const PricingCalculation = () => {

  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculation - Client Web App - Beige'));
  });

  function calculation(e: any) {
    const data = e.target.value;

    // PHOTOGRAPHY
    const photographyDurationType = document.getElementById("photography_unit")?.value;
    const photographyDurationTypeLabel = document.querySelector(".photography_rates");
    if (photographyDurationTypeLabel) {
      photographyDurationTypeLabel.textContent = photographyDurationType;
    }
    const photographyRate = document.getElementById("photography_rates")?.value;

    // VIDEOGRAPHY
    const videographyDurationType = document.getElementById("videography_unit")?.value;
    const videographyDurationTypeLabel = document.querySelector(".videography_rates");
    if (videographyDurationTypeLabel) {
      videographyDurationTypeLabel.textContent = videographyDurationType;
    }
    const videographyRate = document.getElementById("videography_rates")?.value;

    // WEDDING
    const weddingDurationType = document.getElementById("wedding_unit")?.value;
    const weddingRate = document.getElementById("wedding_rates")?.value;

    // MUSICVIDEO
    const musicvideoDurationType = document.getElementById("musicvideo_unit")?.value;
    const musicvideoDurationTypeLabel = document.querySelector(".musicvideo_rates");
    if (musicvideoDurationTypeLabel) {
      musicvideoDurationTypeLabel.textContent = musicvideoDurationType;
    }
    const musicvideoRate = document.getElementById("musicvideo_rates")?.value;

    // CONCERTS
    const concertsDurationType = document.getElementById("concerts_unit")?.value;
    const concertsDurationTypeLabel = document.querySelector(".concerts_rates");
    if (concertsDurationTypeLabel) {
      concertsDurationTypeLabel.textContent = concertsDurationType;
    }
    const concertsRate = document.getElementById("concerts_rates")?.value;

    // BIRTHDAY PARTIES
    const bdpartiesDurationType = document.getElementById("bdparties_unit")?.value;
    const bdpartiesDurationTypeLabel = document.querySelector(".bdparties_rates");
    if (bdpartiesDurationTypeLabel) {
      bdpartiesDurationTypeLabel.textContent = bdpartiesDurationType;
    }
    const bdpartiesRate = document.getElementById("bdparties_rates")?.value;

    // MEMORIAL
    const memorialDurationType = document.getElementById("memorial_unit")?.value;
    const memorialDurationTypeLabel = document.querySelector(".memorial_rates");
    if (memorialDurationTypeLabel) {
      memorialDurationTypeLabel.textContent = memorialDurationType;
    }
    const memorialRate = document.getElementById("memorial_rates")?.value;


  }

  function statusUpdate(e: any) {
    const btn_text = e.target.innerHTML;
    const btn_value = e.target.value;

    if (btn_value == 0) {
      e.target.classList.remove("bg-black");
      e.target.classList.add("bg-success");
    } else if (btn_value == 1) {
      e.target.classList.remove("bg-success");
      e.target.classList.add("bg-black");
    }

    // const add_class = e.target.classList.add("bg-black");
    // const remove_class = e.target.classList.remove("bg-success");
    const classes = e.target.classList;
    console.log("BUTTON", classes);
  }

  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-warning hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Pricing Calculator</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          {/* icon only */}
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Pricing Calculator</h5>
            </div>
            <div className="mb-5">
              <div className="inline-block w-full">
                <div>
                  <form className="space-y-5">

                    {/* Photography */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Photography</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="photography_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="photography_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='photography_rates'>Hour</span> ($)
                        </label>
                        <input id="photography_rates" type="number" defaultValue="250" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-success text-white px-5 py-2 rounded-full' value="1" onClick={statusUpdate}>Active</button>
                      </div>

                    </div>

                    {/* Videography */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Videography</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="videography_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="videography_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="videography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='videography_rates'>Hour</span> ($)
                        </label>
                        <input id="videography_rates" type="number" defaultValue="250" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-black text-white px-5 py-2 rounded-full' value="0" onClick={statusUpdate}>Deactive</button>
                      </div>

                    </div>

                    {/* Wedding for Corporation */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Wedding</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="wedding_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="wedding_unit" onChange={calculation}>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="wedding_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/Day ($)
                        </label>
                        <input id="wedding_rates" type="number" defaultValue="1000" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-success text-white px-5 py-2 rounded-full' value="1" onClick={statusUpdate}>Active</button>
                      </div>

                    </div>

                    {/* Music Videos */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Music Videos</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="mVideos_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="musicvideo_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="musicvideo_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='musicvideo_rates'>Hour</span> ($)
                        </label>
                        <input id="musicvideo_rates" type="number" defaultValue="1000" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-success text-white px-5 py-2 rounded-full' value="1" onClick={statusUpdate}>Active</button>
                      </div>

                    </div>

                    {/* Concerts */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Concerts</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="concerts_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="concerts_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="concerts_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='concerts_rates'>Hour</span> ($)
                        </label>
                        <input id="concerts_rates" type="number" defaultValue="1000" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-success text-white px-5 py-2 rounded-full' value="1" onClick={statusUpdate}>Active</button>
                      </div>

                    </div>

                    {/* Birthday Parties */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Birthday Parties</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="bdparties_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="bdparties_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="bdparties_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='bdparties_rates'>Hour</span> ($)
                        </label>
                        <input id="bdparties_rates" type="number" defaultValue="500" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-success text-white px-5 py-2 rounded-full' value="1" onClick={statusUpdate}>Active</button>
                      </div>

                    </div>

                    {/* Memorial */}
                    <div className="flex items-center justify-between">

                      {/* Label */}
                      <div className="flex basis-[10%] flex-col sm:flex-row">
                        <label className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans text-success uppercase text-md">Memorial</label>
                      </div>

                      {/* Duration Type */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="memorial_unit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Duration Type
                        </label>
                        <select className="form-select form-select-md text-white-dark" id="memorial_unit" onChange={calculation}>
                          <option>Hour</option>
                          <option>Day</option>
                        </select>
                      </div>

                      {/* Rates */}
                      <div className="flex basis-[30%] flex-col sm:flex-row">
                        <label htmlFor="memorial" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Rate/<span className='memorial_rates'>Hour</span> ($)
                        </label>
                        <input id="memorial" type="number" defaultValue="500" className="form-input" onChange={calculation} />
                      </div>

                      {/* Status */}
                      <div className="flex basis-[15%] flex-col sm:flex-row">
                        <label htmlFor="photography_rates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                          Status
                        </label>
                        <button type='button' className='bg-black text-white px-5 py-2 rounded-full' value="0" onClick={statusUpdate}>Deactive</button>
                      </div>

                    </div>

                    {/* <button type="submit" className="btn mt-6 bg-black font-sans text-white" id='submitBtn'>Calculate</button> */}

                  </form>
                </div>
              </div>
            </div>

            {/* Calculation Table */}
            <div className="my-5">
              <h2 className='text-[26px] font-mono font-bold leading-none text-center bg-black rounded-[10px] py-5 text-white my-5'>Total Price</h2>
              <table className="table-auto">

                <tbody>

                  <tr className='font-sans'>
                    <th>Pre Production Cost</th>
                    <td>$500</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Post Production Cost</th>
                    <td>$500</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Total Additional Cost</th>
                    <td>$3,500</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Total Price Before Discount</th>
                    <td>$3,500</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Max Discount Available (25% Max Discount)</th>
                    <td>$6,637.50</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Suggested Quote</th>
                    <td>$7,547.50</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Commission Calculator (6% Flat Rate)</th>
                    <td>$452.85</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Total Price Before Discount</th>
                    <td>$8,850.00</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Sold Package Price (Enter How Much Agreed)</th>
                    <td>$800.00</td>
                  </tr>
                  <tr className='font-sans'>
                    <th>Discount Amount</th>
                    <td>$8,050.00</td>
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );

};

export default PricingCalculation;
