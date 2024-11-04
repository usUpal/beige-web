import { useState, Fragment, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Link from 'next/link';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useAuth } from '@/contexts/authContext';
import ProfileForm from '@/components/SharedComponent/ProfileForm';
import ProfileImageForm from '@/components/SharedComponent/ProfileImageForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Dialog, Transition } from '@headlessui/react';
import MakeProfileImage from '@/components/ProfileImage/MakeProfileImage';
import { useGetCpReviewQuery, useGetCpUploadedImageQuery, useGetCpUploadedVideoQuery } from '@/Redux/features/profile/profileFormApi';
import { truncateLongText } from '@/utils/stringAssistant/truncateLongText';
SwiperCore.use([Navigation, Pagination, Autoplay]);
import { Tab } from '@headlessui/react';

interface ImageModalProps {
  src?: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <Transition appear show={!!src} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center bg-[#0000009e] p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-transparent p-6 text-left align-middle transition-all">
                <img src={src} alt="Full size" className="h-auto w-full" />
                <button className="absolute right-0 top-0 text-gray-500 hover:text-gray-700" onClick={onClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Profile = () => {
  // const dispatch = useDispatch();
  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  // const [reviews, setReviews] = useState<any[]>([]);
  // const [uploadImage, setUploadImage] = useState<any[]>([]);
  // const [uploadVideo, setUploadVideo] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);

  // const [activeTab, setActiveTab] = useState<string>('image');
  const [isExpanded, setIsExpanded] = useState(false);

  const profileDesignation = (role: any) => {
    switch (role) {
      case 'user':
        return 'Beige User';
        break;
      case 'cp':
        return 'Beige Producer';
        break;
      case 'admin':
        return 'Beige Manager';
        break;

      default:
        break;
    }
  };

  const { data: allCpReview, isLoading: isGetAllCpReviewLoading } = useGetCpReviewQuery(userData?.id, {
    refetchOnMountOrArgChange: true,
  });
  const { data: allCpImage, isLoading: isGetAllCpImageLoading } = useGetCpUploadedImageQuery(userData?.id, {
    refetchOnMountOrArgChange: true,
  });

  const { data: allCpVideo, isLoading: isGetAllCpVideoLoading } = useGetCpUploadedVideoQuery(userData?.id, {
    refetchOnMountOrArgChange: true,
  });

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const [profilePicture, setProfilePicture] = useState(userData?.profile_picture || '');
  // const [name, setName] = useState(userData?.name || '');

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="#" className="text-primary hover:underline">
            Users
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Profile</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
            </div>
            <div className="mb-5">
              <ProfileImageForm />
              <ul className="m-auto  mt-2 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                <li className="ml-4 flex items-center gap-2">
                  {allSvgs.coffeeCupIcon}
                  {profileDesignation(userData?.role)}
                </li>
              </ul>
            </div>
          </div>
          <div className="panel lg:col-span-2 xl:col-span-3">
            <ProfileForm />
          </div>
        </div>

        {userRole === 'cp' && (
          <div className="grid grid-cols-1 gap-5">
            <div className="panel">
              <div className="mb-7 font-bold">All Reviews</div>
              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                navigation={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="mySwiper"
              >
                {allCpReview?.results && allCpReview?.results?.length > 0 ? (
                  <>
                    {allCpReview?.results?.map((review: any, index: any) => (
                      <SwiperSlide key={index}>
                        <div className="m-auto mb-[50px] w-full max-w-[650px] rounded-lg border border-info-light bg-white p-5 text-center shadow-lg">
                          <div className="flex gap-4">
                            {!review?.client_id?.profile_picture ? (
                              <MakeProfileImage>{review?.client_id?.name ? review?.client_id?.name : ''}</MakeProfileImage>
                            ) : (
                              <img src={review?.client_id?.profile_picture} className="mb-5 h-16 w-16 rounded-full object-cover" alt="profile img" />
                            )}

                            <div className="w-full">
                              <div className="flex w-full items-center justify-between">
                                <div>
                                  <h2 className="text-left text-[20px] font-bold leading-5">{review?.client_id?.name}</h2>
                                  <p className="mt-1 text-left text-[14px] font-medium text-[#928989]">{review?.client_id?.location}</p>
                                </div>
                                <div>
                                  <div className="flex items-center justify-end gap-1">
                                    <svg className="h-4 w-4 text-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{ fill: '#c2ad36' }}>
                                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.7 18L202.6 95.1 59 116.3c-12 1.8-22.2 10.7-25.7 21.7s-0.7 24.3 7.9 32.7L166.6 329l-97.4 93.1c-2.2 12-0.6 24.1 6.6 32.5 6.6 7.7 15.7 12.1 24.2 12.7 6.3 0 12.7-1.5 18.5-4.6l146.1-82.8 146.1 82.8c5.9 3.1 12.2 4.6 18.5 4.6 9.1 0 18.2-3.6 24.8-10.2 9.4-8.4 14.5-20.5 12.7-32.5L438.2 329l104.4-96.2c8.6-8.5 11.9-20.8 7.9-32.7s-13.7-19.9-25.7-21.7l-143.6-21.2L316.9 18z" />
                                    </svg>
                                    <span className="font-bold">{review?.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 text-left text-[14px]">
                                {isExpanded ? review?.reviewText : truncateLongText(review?.reviewText, 50)}
                                {review?.reviewText.length > 50 && !isExpanded && (
                                  <span onClick={() => setIsExpanded(true)} className=" cursor-pointer text-blue-500">
                                    see more
                                  </span>
                                )}
                                {isExpanded && (
                                  <span onClick={() => setIsExpanded(false)} className=" ml-3px cursor-pointer text-blue-500">
                                    see less
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </>
                ) : (
                  <p>No reviews available</p>
                )}
              </Swiper>
            </div>
          </div>
        )}

        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />

        {userRole === 'cp' && (
          <div>
            <Tab.Group>
              <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                    >
                      Image
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary dark:hover:border-b-black`}
                    >
                      Videos
                    </button>
                  )}
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel>
                  <div>
                    {isGetAllCpImageLoading ? (
                      <div className="my-10 box-border text-center">
                        <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent align-middle"></span>
                      </div>
                    ) : (
                      <>
                        {allCpImage?.contents?.Corporate?.length === 0 && allCpImage?.contents?.Wedding?.length === 0 && allCpImage?.contents?.Other?.length === 0 ? (
                          <div className="my-10 box-border text-center text-xl text-danger">No Data Found</div>
                        ) : (
                          <>
                            {allCpImage?.contents?.Corporate?.length > 0 && (
                              <>
                                <h2 className="mb-0 mt-6 text-left text-[20px] font-bold">Corporate Images</h2>
                                <Swiper
                                  spaceBetween={30}
                                  slidesPerView={3}
                                  navigation={true}
                                  pagination={{ clickable: true }}
                                  breakpoints={{
                                    320: {
                                      slidesPerView: 1,
                                    },
                                    640: {
                                      slidesPerView: 2,
                                    },
                                    1024: {
                                      slidesPerView: 3,
                                    },
                                  }}
                                  className="mySwiper"
                                >
                                  <div className="image-sec mt-4 flex flex-wrap items-center gap-4">
                                    {allCpImage?.contents?.Corporate?.map((src: any, index: number) => (
                                      <SwiperSlide key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                                        <img
                                          src={src}
                                          className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover"
                                          alt="User profile picture"
                                          onClick={() => setSelectedImage(src)}
                                        />
                                      </SwiperSlide>
                                    ))}
                                  </div>
                                </Swiper>
                              </>
                            )}

                            {allCpImage?.contents?.Wedding?.length > 0 && (
                              <>
                                <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Wedding Images</h2>
                                <Swiper
                                  spaceBetween={30}
                                  slidesPerView={3}
                                  navigation={true}
                                  pagination={{ clickable: true }}
                                  breakpoints={{
                                    320: {
                                      slidesPerView: 1,
                                    },
                                    640: {
                                      slidesPerView: 2,
                                    },
                                    1024: {
                                      slidesPerView: 3,
                                    },
                                  }}
                                  className="mySwiper"
                                >
                                  <div className="image-sec mt-6 flex flex-wrap items-center gap-4">
                                    {allCpImage?.contents?.Wedding?.map((src: any, index: any) => (
                                      <SwiperSlide key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                                        <img
                                          src={src}
                                          className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover"
                                          alt="User profile picture"
                                          onClick={() => setSelectedImage(src)}
                                        />
                                      </SwiperSlide>
                                    ))}
                                  </div>
                                </Swiper>
                              </>
                            )}

                            {allCpImage?.contents?.Other?.length > 0 && (
                              <>
                                <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Other Images</h2>

                                <Swiper
                                  spaceBetween={30}
                                  slidesPerView={3}
                                  navigation={true}
                                  pagination={{ clickable: true }}
                                  breakpoints={{
                                    320: {
                                      slidesPerView: 1,
                                    },
                                    640: {
                                      slidesPerView: 2,
                                    },
                                    1024: {
                                      slidesPerView: 3,
                                    },
                                  }}
                                  className="mySwiper"
                                >
                                  <div className="image-sec mt-6 flex flex-wrap items-center gap-4">
                                    {allCpImage?.contents?.Other?.map((src: any, index: any) => (
                                      <SwiperSlide key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                                        <img
                                          src={src}
                                          className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover"
                                          alt="User profile picture"
                                          onClick={() => setSelectedImage(src)}
                                        />
                                      </SwiperSlide>
                                    ))}
                                  </div>
                                </Swiper>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  {isGetAllCpVideoLoading ? (
                    <div className="my-10 box-border text-center">
                      <span className="m-auto mb-10 inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-l-transparent align-middle"></span>
                    </div>
                  ) : (
                    <>
                      {allCpVideo?.contents?.Corporate?.length === 0 && allCpVideo?.contents?.Wedding?.length === 0 && allCpVideo?.contents?.Other?.length === 0 ? (
                        <div className="my-10 box-border text-center text-xl text-danger">No Data Found</div>
                      ) : (
                        <>
                          {allCpVideo?.contents?.Corporate?.length > 0 && (
                            <>
                              <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Corporate Videos</h2>

                              <Swiper
                                spaceBetween={30}
                                slidesPerView={3}
                                navigation={true}
                                pagination={{ clickable: true }}
                                breakpoints={{
                                  320: {
                                    slidesPerView: 1,
                                  },
                                  640: {
                                    slidesPerView: 2,
                                  },
                                  1024: {
                                    slidesPerView: 3,
                                  },
                                }}
                                className="mySwiper"
                              >
                                <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                                  {allCpVideo?.contents?.Corporate?.map((src: any, index: any) => (
                                    <SwiperSlide className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" key={index}>
                                      <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                                    </SwiperSlide>
                                  ))}
                                </div>
                              </Swiper>
                            </>
                          )}

                          {allCpVideo?.contents?.Wedding?.length > 0 && (
                            <>
                              <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Wedding Videos</h2>

                              <Swiper
                                spaceBetween={30}
                                slidesPerView={3}
                                navigation={true}
                                pagination={{ clickable: true }}
                                breakpoints={{
                                  320: {
                                    slidesPerView: 1,
                                  },
                                  640: {
                                    slidesPerView: 2,
                                  },
                                  1024: {
                                    slidesPerView: 3,
                                  },
                                }}
                                className="mySwiper"
                              >
                                <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                                  {allCpVideo?.contents?.Wedding?.map((src: any, index: any) => (
                                    <SwiperSlide className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" key={index}>
                                      <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                                    </SwiperSlide>
                                  ))}
                                </div>
                              </Swiper>
                            </>
                          )}

                          {allCpVideo?.contents?.Other?.length > 0 && (
                            <>
                              <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Other Videos</h2>
                              <Swiper
                                spaceBetween={30}
                                slidesPerView={3}
                                navigation={true}
                                pagination={{ clickable: true }}
                                breakpoints={{
                                  320: {
                                    slidesPerView: 1,
                                  },
                                  640: {
                                    slidesPerView: 2,
                                  },
                                  1024: {
                                    slidesPerView: 3,
                                  },
                                }}
                                className="mySwiper"
                              >
                                <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                                  {allCpVideo?.contents?.Other?.map((src: any, index: any) => (
                                    <SwiperSlide className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" key={index}>
                                      <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                                    </SwiperSlide>
                                  ))}
                                </div>
                              </Swiper>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
