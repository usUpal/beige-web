import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const CpModal = () => {
    const [cpModal, setCpModal] = useState(false);

    return (
        <div>
            <Transition appear show={cpModal} as={Fragment}>
                <Dialog as="div" open={cpModal} onClose={() => setCpModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel as="div" className="panel my-24 w-3/5 overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark pt-8 pb-6">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 dark:bg-[#121c2c]">

                                    <div className="text-[22px] font-bold leading-none capitalize text-[#d64b4b]">CP Details</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setCpModal(false)}>
                                        {allSvgs.closeIconSvg}
                                    </button>
                                </div>
                                <div className="px-5 mt-5">
                                    {/* <h2 className='text-[#ACA686] text-[22px] font-bold leading-[28.6px] capitalize mb-[20px]'>Shoot Name: {disputeInfo?.order_id?.order_name}</h2> */}
                                    {/*  */}
                                    <div className='md:flex justify-between'>
                                        <div>
                                            <div className="mb-[5px]">

                                                <span className='text-[16px] font-bold leading-none capitalize text-[#000000]'>
                                                    {/* Reason : <span className='text-[16px] font-semibold leading-[28px] text-[#000000]'>{disputeInfo?.reason}</span> */}
                                                </span>
                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default CpModal;