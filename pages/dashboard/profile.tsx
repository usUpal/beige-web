import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Link from 'next/link';
import { setPageTitle } from '../../store/themeConfigSlice';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import { useAuth } from '@/contexts/authContext';
import ProfileForm from '@/components/SharedComponent/ProfileForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Dialog, Transition } from '@headlessui/react';
import { API_ENDPOINT } from '@/config';
import MakeProfileImage from '@/components/ProfileImage/MakeProfileImage';
import Swal from 'sweetalert2';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const ImageModal = ({ src, onClose }) => {
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
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const userRole = userData?.role === 'user' ? 'client' : userData?.role;

  const [reviews, setReviews] = useState<any[]>([]);
  const [uploadImage, setUploadImage] = useState<any[]>([]);
  const [uploadVideo, setUploadVideo] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const profileDesignation = (role) => {
    switch (role) {
      case 'user':
        return 'Beige User';
        break;
      case 'cp':
        return 'Beige Producer';
        break;
      case 'manager':
        return 'Beige Manager';
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(setPageTitle('Profile'));

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_ENDPOINT}/review?cp_id=${userData?.id}&populate=client_id`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.results);
        } else {
          console.error('Error fetching reviews:', response.statusText);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [dispatch]);

  useEffect(() => {
    const fetchUploadImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_ENDPOINT}/gcp/get-content/${userData?.id}/images`);

        if (response.ok) {
          const data = await response.json();
          setUploadImage(data.contents);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching upload image:', error);
        setIsLoading(false);
      }
    };
    fetchUploadImage();
  }, []);

  useEffect(() => {
    const fetchUploadVideo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_ENDPOINT}/gcp/get-content/${userData?.id}/videos`);

        if (response.ok) {
          const data = await response.json();
          setUploadVideo(data.contents);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching upload image:', error);
        setIsLoading(false);
      }
    };
    fetchUploadVideo();
  }, []);

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const handleImageClick = () => {
    setShowImage(true);
  };

  const handleVideoClick = () => {
    setShowImage(false);
  };


  const [profilePicture, setProfilePicture] = useState(userData?.profile_picture || '');
  const [name, setName] = useState(userData?.name || '');

  const handleImageUpload = (event) => {
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
              {/* <div className="flex flex-col items-center justify-center relative group">
                <div className='h-32 w-32 rounded-full bg-[#02020281] absolute top-0 '>
                  <svg className='h-[35px] w-[35px] absolute top-0 left-0 right-0 bottom-0 m-auto cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path className='text-[15px]' fill='white' d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                  </svg>
                </div>
                {userData?.profile_picture ? (
                  <img src={userData?.profile_picture} className="mb-5 h-32 w-32 rounded-full object-cover" alt="User profile picture" />
                ) : (
                  // <img src="/assets/images/favicon.png" alt="Default profile picture" className="mb-5 h-32 w-32 rounded-full object-contain" />
                  <span className='h-32 w-32 rounded-full font-bold text-2xl flex justify-center items-center object-cover bg-slate-400 text-white capitalize'>{userData?.name[0] ?? 'BE'}</span>
                )}

                <p className="text-xl font-semibold text-primary">{userData?.name}</p>
              </div> */}


              <div className="relative group flex flex-col items-center justify-center">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    className="h-32 w-32 rounded-full object-cover"
                    alt="User profile picture"
                  />

                ) : (
                  <span className="h-32 w-32 rounded-full font-bold text-2xl flex justify-center items-center object-cover bg-slate-400 text-white capitalize">
                    {name[0] ?? 'BE'}
                  </span>
                )}

                <div className="h-32 w-32 rounded-full bg-[#02020281] absolute top-0 right-[31%] bottom-0  flex justify-center items-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <svg
                      className="h-[35px] w-[35px]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path
                        className="text-[15px]"
                        fill="white"
                        d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                      />
                    </svg>
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary my-4 flex justify-center m-auto ">
                Update
              </button>

              <p className="text-xl font-semibold text-primary mt-2 text-center">{name}</p>

              <ul className="m-auto  mt-2 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                <li className="ml-4 flex items-center gap-2">
                  {allSvgs.coffeeCupIcon}
                  {profileDesignation(userData?.role)}
                </li>
              </ul>
              {/* <ul className="mt-7 flex items-center justify-center gap-2">
                <li>
                  <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.twitterIcon}</button>
                </li>
                <li>
                  <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.nextToTwitterOnProfile}</button>
                </li>
                <li>
                  <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.githubIcon}</button>
                </li>
              </ul> */}
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
              <Swiper spaceBetween={30} slidesPerView={3} navigation={false} pagination={{ clickable: true }} className="mySwiper">
                {isLoading && reviews?.length > 0 ? (
                  reviews?.map((review, index) => (
                    <SwiperSlide key={index}>
                      <div className="m-auto mb-[50px] w-full max-w-[650px] rounded-lg border border-info-light bg-white p-5 text-center shadow-lg">
                        <div className="flex gap-4">
                          {!review?.client_id?.profile_picture ? (
                            <MakeProfileImage>{review?.client_id?.name}</MakeProfileImage>
                          ) : (
                            <img src={review?.client_id?.profile_picture} className="mb-5 h-16 w-16 rounded-full object-cover" alt="User profile picture" />
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
                            <p className="mt-3 text-left text-[14px]">{review?.reviewText}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <p>No reviews available</p>
                )}
              </Swiper>
            </div>
          </div>
        )}

        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
        {userRole === 'cp' && (
          <div className="panel mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-md bg-[#007aff] px-4 py-2 text-[15px] font-bold text-white" onClick={handleImageClick}>
                Image
              </button>
              <button className="rounded-md bg-[#007aff] px-4 py-2 text-[15px] font-bold text-white" onClick={handleVideoClick}>
                Video
              </button>
              {/* {showImage &&
                    <button
                      className="py-1 px-4 flex items-center gap-2 justify-center bg-[#007aff] text-white text-[13px] font-bold rounded-md">
                      Add Image <span className='text-white text-[20px] font-bold '>+</span>
                    </button>
                  }
                  {!showImage &&
                    <button
                      className="py-1 px-4 flex items-center gap-2 justify-center bg-[#007aff] text-white text-[13px] font-bold rounded-md">
                      Add  Video <span className='text-white text-[20px] font-bold '>+</span>
                    </button>
                  } */}
            </div>

            {showImage && (
              <>
                {uploadImage?.Corporate?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-6 text-left text-[20px] font-bold">Corporate Images</h2>
                    <div className="image-sec mt-4 flex flex-wrap items-center gap-4">
                      {uploadImage?.Corporate?.map((src, index) => (
                        <div key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                          <img src={src} className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover" alt="User profile picture" onClick={() => setSelectedImage(src)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {uploadImage?.Wedding?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Wedding Images</h2>
                    <div className="image-sec mt-6 flex flex-wrap items-center gap-4">
                      {uploadImage?.Wedding?.map((src, index) => (
                        <div key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                          <img src={src} className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover" alt="User profile picture" onClick={() => setSelectedImage(src)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {uploadImage?.Other?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Other Images</h2>
                    <div className="image-sec mt-6 flex flex-wrap items-center gap-4">
                      {uploadImage?.Other?.map((src, index) => (
                        <div key={index} className="mb-5 h-[250px] w-full max-w-[250px] rounded-md object-cover">
                          <img src={src} className="mb-5 h-[250px] w-full max-w-[250px] cursor-pointer rounded-md object-cover" alt="User profile picture" onClick={() => setSelectedImage(src)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />

            {!showImage && (
              <>
                {uploadVideo?.Corporate?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Corporate Videos</h2>
                    <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                      {uploadVideo?.Corporate?.map((src, index) => (
                        <div className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover">
                          <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {uploadVideo?.Wedding?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Wedding Videos</h2>
                    <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                      {uploadVideo?.Wedding?.map((src, index) => (
                        <div className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover">
                          <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {uploadVideo?.Other?.length > 0 && (
                  <>
                    <h2 className="mb-0 mt-8 text-left text-[20px] font-bold">Other Videos</h2>
                    <div className="video-section mt-4 flex flex-wrap items-center gap-2">
                      {uploadVideo?.Other?.map((src, index) => (
                        <div className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover">
                          <video className="mb-5 h-[250px] w-full max-w-[304px] rounded-md object-cover" src={src} controls loop />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
