import React from 'react';

const PreLoader: React.FC<any> = () => {

        return(

          <>
          {/* {Array.from({ length: 10 }).map((_, index) => ( */}

            <tr className="group animate-pulse bg-slate-200">
              <td colSpan={50} className="min-w-[150px]">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md"></div>
                  <p className="whitespace-nowrap bg-slate-300">
                    <span className="block"></span>
                  </p>
                </div>
              </td>
            </tr>

          {/* ))} */}
          </>
        )

};

export default PreLoader;

