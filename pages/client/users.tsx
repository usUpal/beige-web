import { useEffect, useRef, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import Link from 'next/link';

const Users = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [meetingModal, setmeetingModal] = useState(false);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Client Dashboard'));
  });

  useEffect(() => {
    setIsMounted(true);
  });

  function handleSubmit(data: any) {

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
            <span>Users</span>
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-1">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">Users</h5>
            </div>
            <div className="mb-5">
              <div className="inline-block w-full">
                <div>
                <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="ltr:rounded-l-md rtl:rounded-r-md font-mono">CP Name</th>
                <th className='font-mono'>CP ID</th>
                <th className='font-mono'>Email</th>
                <th className='font-mono'>Role</th>
                <th className="ltr:rounded-r-md rtl:rounded-l-md font-mono">Status</th>
                <th className='font-mono'>View</th>
              </tr>
            </thead>
            <tbody>
                <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                  <td className="min-w-[150px] text-black dark:text-white font-sans">
                    <div className="flex items-center">
                      <p className="whitespace-nowrap">
                        John Doe
                      </p>
                    </div>
                  </td>
                  <td>rtyu678900tyui</td>
                  <td>john@doe.com</td>

                  <td className="text-success font-sans">Admin</td>
                  <td>
                    <div className="font-sans">
                      Active
                    </div>
                  </td>
                  <td>
                    <button type="button" className="p-0" onClick={() => setmeetingModal(true)}>
                      <img className="ml-2 text-center" src="/assets/images/eye.svg" alt="view-icon" />
                    </button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>

            <Transition appear show={meetingModal} as={Fragment}>
                <Dialog as="div" open={meetingModal} onClose={() => setmeetingModal(false)}>

                    <div className="fixed inset-0 w-full" />

                    <div className="w-full fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4 w-full">
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">Edit User</div>
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
                                  <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="flex items-center justify-between">
                                      {/* Content Vertical */}
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="content_vertical" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                          Category
                                        </label>
                                        <select className="form-select text-white-dark" id="content_vertical" defaultValue="Business">
                                          <option>Select Category</option>
                                          <option value="Business">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label className="rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">Shoot Type</label>
                                        <div className="flex-1">
                              
                                          <div className="mb-2">
                                            <label className="flex items-center">
                                              <input type="checkbox" className="form-checkbox" defaultValue="Video" id="videoShootType" />
                                              <span className="text-white-dark">Video</span>
                                            </label>
                                          </div>
                                    
                                          <div className="mb-2">
                                            <label className="flex items-center">
                                              <input type="checkbox" className="form-checkbox" defaultValue="Photo" id="photoShootType"/>
                                              <span className="text-white-dark">Photo</span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">

                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="successful_beige_shoots" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                          Successful Shoots
                                        </label>
                                        <input id="successful_beige_shoots" type="number" className="form-input" name="successful_beige_shoots"/>
                                      </div>

                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="trust_score" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        trust_score
                                        </label>
                                        <input id="trust_score" type="number" className="form-input" name="trust_score"/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                            
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="references" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                          References
                                        </label>
                                        <input id="references" type="text" placeholder="https://sitename.com" defaultValue="https://sitename.com" className="form-input" />
                                      </div>

                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="trust_score" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        average_rating
                                        </label>
                                        <input id="average_rating" type="number" className="form-input" name="average_rating"/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="avg_response_time" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        avg_response_time
                                        </label>
                                        <input id="avg_response_time" type="number" className="form-input block" name='avg_response_time'/>
                                      </div>

                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="total_earnings" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                        total_earnings
                                        </label>
                                        <input id="total_earnings" type="number" className="form-input" name='total_earnings'/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="equipment" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        equipment
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="equipment" defaultValue="Business" name='equipment'>
                                          <option>Select equipment</option>
                                          <option value="Business">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="portfolio" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        portfolio
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="portfolio" defaultValue="Business" name='portfolio'>
                                          <option>Select portfolio</option>
                                          <option value="Business">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="transportation_methods" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        transportation_methods
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="transportation_methods" defaultValue="Business" name='transportation_methods'>
                                          <option>Select transportation_methods</option>
                                          <option value="Business">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="travel_to_distant_shoots" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        travel_to_distant_shoots
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="travel_to_distant_shoots" defaultValue="travel_to_distant_shoots" name='travel_to_distant_shoots'>
                                          <option>Select travel_to_distant_shoots</option>
                                          <option value="travel_to_distant_shoots">travel_to_distant_shoots</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="experience_with_post_production_edit" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        experience_with_post_production_edit
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="experience_with_post_production_edit" defaultValue="Business" name='experience_with_post_production_edit'>
                                          <option>Select experience_with_post_production_edit</option>
                                          <option value="experience_with_post_production_edit">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="customer_service_skills_experience" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        customer_service_skills_experience
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="customer_service_skills_experience" defaultValue="customer_service_skills_experience" name='customer_service_skills_experience'>
                                          <option>Select customer_service_skills_experience</option>
                                          <option value="customer_service_skills_experience">customer_service_skills_experience</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="team_player" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        team_player
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="team_player" defaultValue="team_player" name='team_player'>
                                          <option>Select team_player</option>
                                          <option value="team_player">team_player</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="avg_response_time_to_new_shoot_inquiry" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        avg_response_time_to_new_shoot_inquiry
                                        </label>
                                        <input id="avg_response_time_to_new_shoot_inquiry" type="number" className="form-input block" name='avg_response_time_to_new_shoot_inquiry'/>
                                      </div>
                                      </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="num_declined_shoots" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        num_declined_shoots
                                        </label>
                                        <input id="num_declined_shoots" type="number" className="form-input block" name='num_declined_shoots'/>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="num_accepted_shoots" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        num_accepted_shoots
                                        </label>
                                        <input id="num_accepted_shoots" type="number" className="form-input block" name='num_accepted_shoots'/>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="num_dnum_no_showseclined_shoots" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        num_no_shows
                                        </label>
                                        <input id="num_no_shows" type="number" className="form-input block" name='num_no_shows'/>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="userId" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        userId
                                        </label>
                                        <input id="userId" type="text" className="form-input block" name='userId'/>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="city" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        city
                                        </label>
                                        <input id="city" type="text" className="form-input block" name='city'/>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="neighborhood" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        neighborhood
                                        </label>
                                        <input id="neighborhood" type="text" className="form-input block" name='neighborhood'/>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="zip_code" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        zip_code
                                        </label>
                                        <input id="zip_code" type="text" className="form-input block" name='zip_code'/>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="content_type" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        content_type
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="content_type" defaultValue="Business" name='content_type'>
                                          <option>Select content_type</option>
                                          <option value="content_type">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="vst" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        vst
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="vst" defaultValue="Business" name='vst'>
                                          <option>Select vst</option>
                                          <option value="vst">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="shoot_availability" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        shoot_availability
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="shoot_availability" defaultValue="Business" name='shoot_availability'>
                                          <option>Select shoot_availability</option>
                                          <option value="shoot_availability">Business</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>

                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="equipment_specific" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        equipment_specific
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="equipment_specific" defaultValue="equipment_specific" name='equipment_specific'>
                                          <option>Select equipment_specific</option>
                                          <option value="equipment_specific">equipment_specific</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="last_beige_shoot" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        last_beige_shoot
                                        </label>
                                        <input id="last_beige_shoot" type="text" className="form-input block" name='last_beige_shoot'/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="equipment_specific" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        equipment_specific
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="backup_footage" defaultValue="backup_footage" name='backup_footage'>
                                          <option>Select backup_footage</option>
                                          <option value="backup_footage">backup_footage</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="timezone" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        timezone
                                        </label>
                                        <input id="timezone" type="text" className="form-input block" name='timezone'/>
                                      </div>
                                      </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="own_transportation_method" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        own_transportation_method
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="own_transportation_method" defaultValue="own_transportation_method" name='own_transportation_method'>
                                          <option>Select own_transportation_method</option>
                                          <option value="own_transportation_method">own_transportation_method</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="timezone" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        timezone
                                        </label>
                                        <input id="timezone" type="text" className="form-input block" name='timezone'/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="review_status" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        review_status
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="review_status" defaultValue="review_status" name='review_status'>
                                          <option>Select review_status</option>
                                          <option value="review_status">review_status</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="geo_location_type" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        geo_location_type
                                        </label>
                                        <input id="geo_location_type" type="text" className="form-input block" name='geo_location_type'/>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                              
                                      <div className="flex basis-[45%] flex-col sm:flex-row">
                                        <label htmlFor="geo_location_coordinates" className="mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2 font-sans">
                                        geo_location_coordinates
                                        </label>
                                        <select className="form-select text-white-dark font-sans" id="geo_location_coordinates" defaultValue="geo_location_coordinates" name='geo_location_coordinates'>
                                          <option>Select geo_location_coordinates</option>
                                          <option value="geo_location_coordinates">geo_location_coordinates</option>
                                          <option value="Personal">Personal</option>
                                          <option value="Wedding">Wedding</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setmeetingModal(false)}>
                                            Discard
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setmeetingModal(false)}>
                                            Save
                                        </button>
                                    </div>
                                  </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
