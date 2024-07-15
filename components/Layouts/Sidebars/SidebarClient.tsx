import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import { allSvgs } from '@/utils/allsvgs/allSvgs';



const SidebarClient = (props: any) => {

  const { currentMenu, toggleMenu } = props;

  return (
    <ul className='relative space-y-0.5 p-4 py-0 font-semibold'>

      <li className='nav-item'>
        <ul>
          <li className='nav-item'>
            <Link href='/' className='group'>
              <div className='flex items-center'>
                {allSvgs.bookNowSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Book Now</span>
              </div>
            </Link>
          </li>

          <li className='nav-item'>
            <Link href='/dashboard/shoots' className='group'>
              <div className='flex items-center'>
                {allSvgs.shootSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Shoots</span>
              </div>
            </Link>
          </li>

          <li className='nav-item'>
            <Link href='/dashboard/meetings' className='group'>
              <div className='flex items-center'>
                {allSvgs.meetingsSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Meetings</span>
              </div>
            </Link>
          </li>
 
          <li className='nav-item'>
            <Link href='/dashboard/chat' className='group'>
              <div className='flex items-center'>
                {allSvgs.chatSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Chat</span>
              </div>
            </Link>
          </li>
 
          <li className='nav-item'>
            <Link href='/dashboard/transactions' className='group'>
              <div className='flex items-center'>
                {allSvgs.transactionsSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Transactions</span>
              </div>
            </Link>
          </li>

          <li className='nav-item'>
            <Link href='/dashboard/disputes' className='group'>
              <div className='flex items-center'>
                {allSvgs.disputesSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Disputes</span>
              </div>
            </Link>
          </li>
 
          <li className='menu nav-item'>
            <button type='button' className='nav-link group w-full' onClick={() => toggleMenu('settings')}>
              <div className='flex items-center'>
                {allSvgs.settingsSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Settings</span>
              </div>

              <div className={currentMenu === 'settings' ? 'rotate-90' : 'rtl:rotate-180'}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M9 5L15 12L9 19' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'
                    strokeLinejoin='round' />
                </svg>
              </div>
            </button>

            <AnimateHeight duration={300} height={currentMenu === 'settings' ? 'auto' : 0}>
              <ul className='sub-menu text-gray-500'>
                <li>
                  <Link href='/'>Payment Setting</Link>
                </li>
                <li>
                  <Link href='/'>Notifications</Link>
                </li>
                <li>
                  <Link href='/'>Privacy</Link>
                </li>
              </ul>
            </AnimateHeight>
          </li>
          
          <li className='nav-item'>
            <Link href='/' className='group'>
              <div className='flex items-center'>
                {allSvgs.helpSvg}
                <span
                  className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>Help</span>
              </div>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default SidebarClient;
