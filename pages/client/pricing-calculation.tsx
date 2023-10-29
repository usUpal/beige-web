import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';


const PricingCalculation = () => {

  const [isStatus, setStatus] = useState<number>(1);
  const [bgColor, setBgColor] = useState<string>("success");

  const dispatch = useDispatch();

  //Start theme functionality
  useEffect(() => {
    dispatch(setPageTitle('Pricing Calculation - Client Web App - Beige'));
  });

  const calculation = () => {

    const categories = [
      "photography",
      "videography",
      "weddingOrCorporation",
      "musicVideos",
      "concerts",
      "birthdayParties",
      "memorial",
    ];

    const allData = categories.map(category => {
      const rateInput = document.getElementById(category);
      const statusButton = document.getElementById(`${category}_status`);

      if (rateInput && statusButton) {
        const rate = rateInput.value;
        const status = statusButton.value;
        return {
          [category]: {
            rate,
            status,
          },
        };
      }
    }).filter(Boolean);

    console.log(Object.assign({}, ...allData));

  }

  const statusUpdate = (e: any) => {
    setStatus(Number(!isStatus));
    let idName = e.target.id;
    let status = isStatus;
    localStorage.setItem(idName, status);
    let localStorageStatus = localStorage.getItem(idName);
    let allClass = e.target.classList;
    if( localStorageStatus == "0" ){
      allClass.remove("bg-success");
      allClass.add("bg-black");
    }else if( localStorageStatus == "1" ){
      allClass.remove("bg-black");
      allClass.add("bg-success");
    }else{
      allClass.add("bg-success");
    }
  }



  return (
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
            <h5 className="text-lg font-semibold dark:text-white-light">Set Prices</h5>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="ltr:rounded-l-md rtl:rounded-r-md">Category</th>
                  <th>Rate/Hour ($)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>

                {/*  Photography  */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Photography</td>
                  <td>
                    <input id="photography" name='photography' type="number" defaultValue="250" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='photographyStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/*  Videography  */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Videography</td>
                  <td>
                    <input id="videography" name='videography' type="number" defaultValue="250" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='videographyStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/*  Wedding for Corporation  */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Wedding for Corporation</td>
                  <td>
                    <input id="weddingOrCorporation" name='weddingOrCorporation' type="number" defaultValue="1000" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='weddingOrCorporationStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/*  Music Videos  */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Music Videos</td>
                  <td>
                    <input id="musicVideos" name='musicVideos' type="number" defaultValue="1000" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='musicVideosStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/* Concerts */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Concerts</td>
                  <td>
                    <input id="concerts" name='concerts' type="number" defaultValue="1000" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='concertsStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/* Birthday Parties */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Birthday Parties</td>
                  <td>
                    <input id="birthdayParties" name='birthdayParties' type="number" defaultValue="500" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='birthdayPartiesStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/* Memorial */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>Memorial</td>
                  <td>
                    <input id="memorial" name='v' type="number" defaultValue="500" className="form-input w-3/6" />
                  </td>
                  <td>
                    <button type='button' className={(`text-white px-5 py-2 rounded-full bg-success`)} value={isStatus} id='memorialStatus' onClick={statusUpdate}>Active</button>
                  </td>
                </tr>
                {/* Calculate */}
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td>
                    <button type="submit" className="btn bg-black font-sans text-white" id='submitBtn' onClick={calculation}>Save</button>
                  </td>
                </tr>

              </tbody>
            </table>
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
  );

};

export default PricingCalculation;
