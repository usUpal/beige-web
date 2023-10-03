import Link from 'next/link';

function shootDetailsPage () {

    return(
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link href="/apps/disputes" className="text-primary hover:underline">
                        Disputes
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Dispute Details</span>
                </li>
            </ul>
            <h2 className="mt-5 bg-[#ACA686] text-center text-white text-[32px] py-[15px] capitalize font-bold leading-none">corporate photo shoot</h2>
            <div className="container">

                {/* Shoot Details */}
                <div className="panel h-full w-full mt-5">
                    <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">ID#:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">213654</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Shoot Name:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">corporate photo shoot</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-solid border-[#828282] py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Shoot Date:</span>
                        <span className="font-normal text-[#828282] capitalize text-[20px]">23/09/2023</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                        <span className="font-bold text-[#545454] capitalize text-[20px]">Dispute Amount:</span>
                        <span className="font-bold text-[#000000] capitalize text-[20px]">$3400</span>
                    </div>
                </div>

                <div className="mt-[60px] mb-[40px]">
                    <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] mb-[10px]">Reason for Dispute</h2>
                    <p className="text-[16px] font-normal leading-[26px] text-[#111111]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, libero magni? Animi ab unde eaque ex iste maiores omnis sequi accusantium repellat quo. Qui, repellendus sit? Necessitatibus repellendus tempore consectetur itaque nulla? Reiciendis, quas quibusdam! Labore veniam nihil totam quo, inventore et voluptate asperiores laboriosam, alias autem corrupti explicabo tempora?</p>
                </div>

                <div className="mt-[60px] mb-[40px]">
                    <h2 className="text-[24px] font-bold leading-[33.6px] text-[#545454] mb-[10px]">Decision</h2>
                    <p className="text-[16px] font-normal leading-[26px] text-[#111111]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, libero magni? Animi ab unde eaque ex iste maiores omnis sequi accusantium repellat quo. Qui, repellendus sit? Necessitatibus repellendus tempore consectetur itaque nulla? Reiciendis, quas quibusdam! Labore veniam nihil totam quo, inventore et voluptate asperiores laboriosam, alias autem corrupti explicabo tempora?</p>
                </div>

            </div>
        </>

    );
}

export default shootDetailsPage;
