import React from 'react';
import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import { menuData } from '@/store/menuBuilder';
import { useAuth } from '@/contexts/authContext';

const SidebarManager = (props: any) => {
  const { currentMenu, toggleMenu } = props;
  const { userData } = useAuth();

  const isAccessible = (item: any) => item.inAccessible.includes(userData.role);

  return (
    <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
      {menuData.map((item, index) => (
        <React.Fragment key={index}>
          {isAccessible(item) && (
            <>
              {item.isNested?.length > 0 ? (
                <li className="menu nav-item">
                  <button
                    type="button"
                    className={`${currentMenu === item.key ? 'active' : ''} nav-link group w-full`}
                    onClick={() => toggleMenu(item.key)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                        {item.name}
                      </span>
                    </div>
                    <div className={currentMenu === item.key ? 'rotate-90' : 'rtl:rotate-180'}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  <AnimateHeight duration={300} height={currentMenu === item.key ? 'auto' : 0}>
                    <ul className="sub-menu text-gray-500">
                      {item.isNested.map((subItem, subIndex) => (
                        isAccessible(subItem) && (
                          <li key={subIndex}>
                            <Link href={subItem.path}>{subItem.name}</Link>
                          </li>
                        )
                      ))}
                    </ul>
                  </AnimateHeight>
                </li>
              ) : (
                <li className="nav-item">
                  <Link href={item.path} className="group">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </li>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default SidebarManager;
