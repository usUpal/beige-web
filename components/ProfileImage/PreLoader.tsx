import React from 'react';

const PreLoader: React.FC = () => {
  return (
    <>
      {Array.from({ length: 10, rowLength:6 }).map(
        (_, index, rowIndex) => (
          console.log(Array),
          (
            <tr key={index} className="group animate-pulse bg-slate-200">
              <td colSpan={50} className="min-w-[150px]">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-slate-300" aria-hidden="true"></div>
                  <p className="ml-2 flex gap-24 whitespace-nowrap bg-slate-300">
                    <span className="block h-4 w-24 bg-slate-400" aria-hidden="true"></span>
                    <span className="block h-4 w-24 bg-slate-400" aria-hidden="true"></span>
                    <span className="block h-4 w-24 bg-slate-400" aria-hidden="true"></span>
                    <span className="block h-4 w-24 bg-slate-400" aria-hidden="true"></span>
                    <span className="block h-4 w-24 bg-slate-400" aria-hidden="true"></span>
                  </p>
                </div>
              </td>
            </tr>
          )
        )
      )}
    </>
  );
};

export default PreLoader;
