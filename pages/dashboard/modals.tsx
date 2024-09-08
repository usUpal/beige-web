import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DefaultButton from '@/components/SharedComponent/DefaultButton';

const Modals = () => {

    const [meetingModal, setmeetingModal] = useState(false);

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() => setmeetingModal(true)}>Launch modal</button>
            <Transition appear show={meetingModal} as={Fragment}>
                <Dialog as="div" open={meetingModal} onClose={() => setmeetingModal(false)}>

                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">Modal Title</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setmeetingModal(false)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <p>
                                        Mauris mi tellus, pharetra vel mattis sed, tempus ultrices eros. Phasellus egestas sit amet velit sed luctus. Orci varius natoque penatibus
                                        et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse potenti. Vivamus ultrices sed urna ac pulvinar. Ut sit amet ullamcorper
                                        mi.
                                    </p>
                                    <div className="mt-8 flex items-center justify-end">
                                        {/* <button type="button" className="btn btn-outline-danger" onClick={() => setmeetingModal(false)}>
                                            Discard
                                        </button> */}
                                        <DefaultButton onClick={() => setmeetingModal(false)} css='font-semibold'>Save</DefaultButton>

                                        {/* <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setmeetingModal(false)}>
                                            Save
                                        </button> */}
                                        <DefaultButton onClick={() => setmeetingModal(false)} css='font-semibold'>Save</DefaultButton>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Modals;
