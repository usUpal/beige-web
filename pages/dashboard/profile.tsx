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

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <Transition appear show={!!src} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center bg-[#0000009e]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-transparent p-6 text-left align-middle  transition-all">
                <img src={src} alt="Full size" className="w-full h-auto" />
                <button
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
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

  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(true);

  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle('Profile'));

    // Fetch data from your API
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://example.com/reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [dispatch]);

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const handleImageClick = () => {
    setShowImage(true);
  };

  const handleVideoClick = () => {
    setShowImage(false);
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
              <div className="flex flex-col items-center justify-center">
                {userData?.profile_picture ? (
                  <img src={userData?.profile_picture} className="mb-5 h-32 w-32 rounded-full object-cover" alt="User profile picture" />
                ) : (
                  <img src="/assets/images/profile-34.jpeg" alt="Default profile picture" className="mb-5 h-32 w-32 rounded-full object-cover" />
                )}

                <p className="text-xl font-semibold text-primary">{userData?.name}</p>
              </div>
              <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                <li className="ml-8 flex items-center gap-2">
                  {allSvgs.coffeeCupIcon}
                  {userRole === 'user' ? 'Client' : userRole === 'manager' ? 'Manager' : 'Producer'}
                </li>
              </ul>
              <ul className="mt-7 flex items-center justify-center gap-2">
                <li>
                  <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.twitterIcon}</button>
                </li>
                <li>
                  <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.nextToTwitterOnProfile}</button>
                </li>
                <li>
                  <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">{allSvgs.githubIcon}</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="panel lg:col-span-2 xl:col-span-3">
            <>
              <ProfileForm />
            </>
          </div>
        </div>

        {userRole === 'cp' && (
          <div className="grid grid-cols-1 gap-5">
            <div className="panel">
              <div className="mb-7 font-bold">All Reviews</div>
              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                navigation={false}
                pagination={{ clickable: true }}
                // autoplay={{ delay: 3000 }}
                className="mySwiper"
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <div className="p-5 m-auto bg-white text-center w-full max-w-[650px] mb-[50px] shadow-lg border border-info-light rounded-lg">
                      <div className="flex gap-4">
                        <img
                          src={review.profile_picture || '/assets/images/profile-34.jpeg'} // Fallback to default image
                          className="mb-5 h-16 w-16 rounded-full object-cover"
                          alt="User profile picture"
                        />
                        <div>
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <h2 className="text-[20px] leading-5 font-bold text-left">{review.name}</h2>
                              <p className="text-[14px] mt-1 text-left text-[#928989] font-medium">{review.location}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 justify-end">
                                <svg
                                  className="h-4 w-4 text-center"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 576 512"
                                  style={{ fill: '#c2ad36' }}
                                >
                                  <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <p className="text-[16px] text-[#c2ad36] font-bold">{review.rating}</p>
                              </div>
                              <p className="text-[14px] text-[#72716e] font-semibold my-1">{review.timeAgo}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[16px] font-medium text-[#5e5a5a] text-left">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                navigation={false}
                pagination={{ clickable: true }}
                className="mySwiper"
              >
                <SwiperSlide>
                  <div className="p-5 m-auto bg-white text-center w-full max-w-[650px] mb-[50px]  shadow-lg border border-info-light rounded-lg">
                    <div className='flex gap-4 '>
                      <img src={userData?.profile_picture} className="mb-5 h-16 w-16  rounded-full object-cover" alt="User profile picture" />
                      <div>
                        <div className='flex justify-between items-center w-full'>
                          <div>
                            <h2 className='text-[20px] leading-5 font-bold text-left'>Brian Trecy</h2>
                            <p className='text-[14px] mt-1 text-left text-[#928989] font-medium'>New York, USA</p>
                          </div>
                          <div>
                            <div className='flex items-center gap-1 justify-end'>
                              <svg
                                className='h-4 w-4 text-center'
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                style={{ fill: '#c2ad36' }}
                              >
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                              </svg>
                              <p className='text-[16px] text-[#c2ad36] font-bold'>5.0</p>
                            </div>
                            <p className='text-[14px] text-[#72716e] font-semibold my-1'>5 days ago</p>
                          </div>
                        </div>
                        <div>
                          <p className=' text-[16px] font-medium text-[#5e5a5a] text-left'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit ipsum eaque saepe laboriosam illo nam porro odit similique neque?  tenetur.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

              </Swiper>
            </div>

            <div className="panel">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className="py-2 px-4 bg-[#007aff] text-white text-[15px] font-bold rounded-md"
                  onClick={handleImageClick}
                >
                  Image
                </button>
                <button
                  className="py-2 px-4 bg-[#007aff] text-white text-[15px] font-bold rounded-md"
                  onClick={handleVideoClick}
                >
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
                <div className="image-sec mt-6 flex items-center flex-wrap gap-4">
                  {[
                    "https://images.pexels.com/photos/27351031/pexels-photo-27351031/free-photo-of-essaouira-view.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
                    userData?.profile_picture
                  ].map((src, index) => (
                    <div key={index} className="mb-5 h-[250px] max-w-[250px] w-full object-cover rounded-md">
                      <img
                        src={src}
                        className="mb-5 h-[250px] max-w-[250px] w-full object-cover rounded-md cursor-pointer"
                        alt="User profile picture"
                        onClick={() => setSelectedImage(src)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <ImageModal
                src={selectedImage}
                onClose={() => setSelectedImage(null)}
              />

              {!showImage && (
                <div className="video-section mt-6 flex items-center flex-wrap gap-2">
                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>

                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>

                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>

                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>

                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>

                  <div className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md">
                    <video
                      className="mb-5 h-[250px] max-w-[304px] w-full object-cover rounded-md"
                      src="https://videos.pexels.com/video-files/27593045/12178773_640_360_30fps.mp4"
                      autoplay
                      controls
                      loop
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;