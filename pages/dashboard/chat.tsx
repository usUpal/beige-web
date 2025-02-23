/* eslint-disable react-hooks/exhaustive-deps */
import { SOCKET_URL } from '@/config';
import { useAuth } from '@/contexts/authContext';
import transformMessages from '@/utils/transformMessage';
import { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import Link from 'next/link';
import MakeProfileImage from '@/components/ProfileImage/MakeProfileImage';

import { useGetAllChatQuery, useLazyGetChatDetailsQuery } from '@/Redux/features/chat/chatApi';
import { allSvgs } from '@/utils/allsvgs/allSvgs';
import useDateFormat from '@/hooks/useDateFormat';
import ResponsivePaginationComponent from 'react-responsive-pagination';
import { toast } from 'react-toastify';
import DefaultButton from '@/components/SharedComponent/DefaultButton';
import { truncateLongText } from '@/utils/stringAssistant/truncateLongText';
import { useGetAllUserQuery } from '@/Redux/features/user/userApi';
import AccessDenied from '@/components/errors/AccessDenied';
import Image from 'next/image';

const Chat = () => {
  const { userData, authPermissions } = useAuth() as any;
  const isHavePermission = authPermissions?.includes('chat_page');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Chat'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

  const [isShowChatMenu, setIsShowChatMenu] = useState(false);

  const [searchUser, setSearchUser] = useState('');
  const [isShowUserChat, setIsShowUserChat] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<any>(null);
  const [textMessage, setTextMessage] = useState('');

  const [newMessages, setNewMessages] = useState<any>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typtingUser, setTyptingUser] = useState<MessageTypingProps>();
  const [msgPage, setMsgPage] = useState(1);
  const [totalMsgPage, setTotalMsgPage] = useState(0);

  const socket = useRef<any | null>(null);

  const userRole = userData?.role === 'user' ? 'client' : userData?.role;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // search
  const [isAddParticipant, setIsAddParticipant] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [newParticipantInfo, setNewParticipantInfo] = useState({});
  const [threeDotSidebar, setThreeDotSidebar] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleThreeDotSidebar = () => {
    setThreeDotSidebar(!threeDotSidebar);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const queryData = {
    userRole,
    userD: userData?.id,
    page: currentPage,
  };

  // Fetch all chat - data based on query parameters
  const {
    data,
    error,
    isFetching,
    refetch,
    isLoading: isAllDataFetchLoading,
  } = useGetAllChatQuery(queryData, {
    refetchOnMountOrArgChange: true,
  });

  // show old msg
  const [getChatDetails, { data: chatDetails, isLoading: isChatDetailsLoading }] = useLazyGetChatDetailsQuery();

  // updatedAt
  const updatedAtDateTime = useDateFormat(selectedChatRoom?.updatedAt);
  const createdDateTime = useDateFormat(selectedChatRoom?.createdAt);

  useEffect(() => {
    if (selectedChatRoom) {
      getChatDetails({ roomId: selectedChatRoom?.id, page: 1 }).then(({ data: chatDetailsData }) => {
        if (chatDetailsData) {
          setTotalPagesCount(chatDetailsData?.totalPages > 0 ? chatDetailsData?.totalPages : 1);
          const outputMessages = transformMessages(chatDetailsData?.results);
          setNewMessages(outputMessages.reverse());
          scrollToBottom();
        }
      });
    }
  }, [selectedChatRoom]);

  useEffect(() => {
    setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, [isTyping]);

  useEffect(() => {
    socket.current = io(SOCKET_URL as string);
    joinRoom();
  }, [selectedChatRoom]);

  const joinRoom = () => {
    if (selectedChatRoom) {
      socket.current.emit('joinRoom', {
        roomId: selectedChatRoom?.id,
        userId: userData.id,
        userName: userData?.name,
      });
      socket.current.on('roomJoined', (data: any) => {
        getChatDetails(selectedChatRoom?.id);
      });
      //   Listaning messages
      socket.current.on('message', (data: any) => {
        setIsTyping(false);
        setNewMessages((prevMessages: any) => {
          const messageIdExists = prevMessages.some((message: any) => message.messageId === data.messageId);
          if (!messageIdExists) {
            return [...prevMessages, data];
          }
          return prevMessages;
        });
        scrollToBottom();
      });
      socket.current.on('userTyping', (data: MessageTypingProps) => {
        if (data.userId !== userData.id) {
          setIsTyping(true);
          scrollToBottom();
          setTyptingUser(data);
        }
      });
    }
    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  };

  const [userWithProfilePicture, setUserWithProfilePicture] = useState('');

  const selectUser = (chat: any) => {
    setSelectedChatRoom(chat);
    scrollToBottom();
    setIsShowChatMenu(false);
    // const userWithProfilePicture = chatDetails?.result?.find((detailChatPp:any) => detailChatPp?.sendBy?.profile_picture);
    setUserWithProfilePicture(userWithProfilePicture);
  };
  const sendMessage = (text: string) => {
    socket.current.emit('message', {
      message: text,
    });
    // Reset the textMessage state by setting an empty string
    setTextMessage('');
  };

  const sendMessageHandle = (event: any) => {
    setTextMessage(event.target.value);
    if (event.key === 'Enter') {
      sendMessage(event.target.value);
    }
    socket.current.emit('userTyping', {
      roomId: selectedChatRoom.id,
    });
  };

  const scrollToBottom = () => {
    setIsShowUserChat(true);
    setTimeout(() => {
      const element: any = document.querySelector('.chat-conversation-box');
      element.behavior = 'smooth';
      element.scrollTop = element.scrollHeight;
    }, 100);
  };
  const handleScroll = () => {
    if (msgPage > totalMsgPage) {
      return;
    } else {
      setMsgPage((prev) => prev + 1);
    }
  };

  const createImageByName = (name: string) => {
    return <span className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-gray-300 text-[13px] leading-[45px]">{name}</span>;
  };

  const getSearchResultByQuery = (event: any, searchInput: string) => {
    if (searchInput?.toLowerCase() === 'searchchat') {
      setSearchUser(event?.target?.value);
    } else {
      setClientName(event?.target?.value);
    }
  };

  const searchQuer = {
    role: 'user',
    search: clientName,
  };

  const { data: clientsData } = useGetAllUserQuery(searchQuer, {
    refetchOnMountOrArgChange: true,
    skip: userData?.role === 'cp' || userData?.role === 'user',
  });

  const getAllClients = async () => {
    setIsClientLoading(true);
    setClients(clientsData?.results || []);
    setShowClientDropdown(true);
    setIsClientLoading(false);
  };
  // handleClientChange
  const handleClientChange = (client: any) => {
    setNewParticipantInfo(client);
    setShowClientDropdown(false);
    setIsAddParticipant(false);
    setClientName('');
    toast.success(
      <>
        <span className="text-primary">{client?.name} </span> is successfully added to participants.
      </>
    );
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddPerticipant = () => {
    setIsAddParticipant(true);
    return;
  };

  // if (isAllDataFetchLoading) {
  //   return <span>Loading</span>;
  // }

  if (!isHavePermission) {
    return <AccessDenied />;
  }

  return (
    <div className={`relative flex h-full gap-0 sm:h-[calc(100vh_-_150px)]  sm:min-h-0 md:gap-5 ${isShowChatMenu ? 'min-h-[999px]' : ''}`}>
      <div
        className={`panel h-10/12 xl:w-84 absolute z-10 hidden w-full max-w-xs flex-none space-y-4 overflow-hidden p-4 md:h-full md:w-80 lg:w-full xl:relative xl:block xl:h-full 2xl:w-full ${
          isShowChatMenu ? '!block' : ''
        }`}
      >
        <div className="relative">
          <input type="text" className="peer form-input ltr:pr-9 rtl:pl-9" placeholder="Searching..." value={searchUser} onChange={(event) => getSearchResultByQuery(event, 'searchChat')} />
          <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-2 rtl:left-2">{allSvgs.searchIcon}</div>
        </div>

        <div className="block text-start md:hidden">
          {!isAddParticipant && (userRole === 'manager' || userRole === 'admin') && (
            <>
              <div className="block md:hidden ">
                <DefaultButton onClick={handleAddPerticipant} css={'px-2 py-0 md:text-[14px] text-[12px]'}>
                  Add Participant
                </DefaultButton>
              </div>
            </>
          )}
        </div>
        <div className="mt-1 xl:h-[83%] 2xl:h-[87%]">
          {isAllDataFetchLoading && (
            <>
              <div className="min-w-screen mt-24 flex min-h-screen items-start justify-center bg-white p-5 dark:bg-[#0e1726]">
                <div className="flex animate-pulse space-x-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500 dark:bg-slate-300"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-500 dark:bg-slate-300"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-500 dark:bg-slate-300"></div>
                </div>
              </div>
            </>
          )}
          <PerfectScrollbar className="chat-users relative h-full min-h-full space-y-0.5 ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5 sm:h-[calc(100vh_-_357px)]">
            {data?.results?.map((chat: any) => {
              return (
                <div key={chat?.id} className="">
                  {chat?.order_id?.order_name && (
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100 hover:text-primary dark:hover:bg-[#050b14] dark:hover:text-primary ${
                        selectedChatRoom && selectedChatRoom?.id === chat.id ? 'bg-gray-100 text-primary dark:bg-[#050b14] dark:text-primary' : ''
                      }`}
                      onClick={() => selectUser(chat)}
                    >
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="relative flex-shrink-0">
                            <MakeProfileImage>{chat.order_id?.order_name}</MakeProfileImage>
                          </div>
                          <div className="mx-3 ltr:text-left rtl:text-right">
                            <p className="mb-1 font-semibold">{truncateLongText(chat?.order_id?.order_name, 20)}</p>
                            <p className="max-w-[185px] truncate text-xs text-white-dark">{chat.last_message ? chat.last_message?.message : 'No messages'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="whitespace-nowrap text-xs font-semibold">
                        <p>00:00</p>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </PerfectScrollbar>
        </div>

        <>
          <div className="hidden lg:block">
            <div className=" flex justify-start lg:justify-center xl:mb-5 xl:mt-0 2xl:mt-4 ">
              <ResponsivePaginationComponent current={currentPage} total={data?.totalPages} onPageChange={handlePageChange} maxWidth={200} />
            </div>
          </div>
          <div className="mt-4 lg:hidden">
            <div className="pagination-container max-w-xs ">
              <ResponsivePaginationComponent
                current={currentPage}
                total={data?.totalPages}
                onPageChange={handlePageChange}
                maxWidth={260}
                className="my-pagination mx-auto flex w-48 justify-start lg:justify-center"
                pageLinkClassName={`w-5 border-solid bg-gray-300 px-2 py-0.5 mr-1 rounded`}
                // activeItemClassName="bg-black"
              />
            </div>
          </div>
        </>
      </div>
      <div className={`absolute  z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowChatMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowChatMenu(!isShowChatMenu)}></div>
      <div className={`panel flex-1 p-0 ${threeDotSidebar && 'hidden xl:block'}`}>
        {!isShowUserChat && (
          <div className={`relative flex h-full items-center justify-center p-4`}>
            <button type="button" onClick={() => setIsShowChatMenu(!isShowChatMenu)} className="absolute top-4 hover:text-primary ltr:left-4 rtl:right-4 xl:hidden">
              {allSvgs.sidebarMenuIcon}
            </button>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-8 h-[calc(100vh_-_320px)] min-h-[120px] w-[280px] text-white dark:text-black md:w-[430px]">
                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" className="h-full w-full" viewBox="0 0 891.29496 745.19434" xmlns-xlink="http://www.w3.org/1999/xlink">
                  <ellipse cx="418.64354" cy="727.19434" rx="352" ry="18" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                  <path
                    d="M778.64963,250.35008h-3.99878V140.80476a63.40187,63.40187,0,0,0-63.4018-63.40193H479.16232a63.40188,63.40188,0,0,0-63.402,63.4017v600.9744a63.40189,63.40189,0,0,0,63.4018,63.40192H711.24875a63.40187,63.40187,0,0,0,63.402-63.40168V328.32632h3.99878Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#3f3d56"
                  />
                  <path
                    d="M761.156,141.24713v600.09a47.35072,47.35072,0,0,1-47.35,47.35h-233.2a47.35084,47.35084,0,0,1-47.35-47.35v-600.09a47.3509,47.3509,0,0,1,47.35-47.35h28.29a22.50659,22.50659,0,0,0,20.83,30.99h132.96a22.50672,22.50672,0,0,0,20.83-30.99h30.29A47.35088,47.35088,0,0,1,761.156,141.24713Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="currentColor"
                  />
                  <path
                    d="M686.03027,400.0032q-2.32543,1.215-4.73047,2.3-2.18994.99-4.4497,1.86c-.5503.21-1.10987.42-1.66992.63a89.52811,89.52811,0,0,1-13.6001,3.75q-3.43506.675-6.96,1.06-2.90991.33-5.87989.47c-1.41015.07-2.82031.1-4.24023.1a89.84124,89.84124,0,0,1-16.75977-1.57c-1.44043-.26-2.85009-.57-4.26025-.91a88.77786,88.77786,0,0,1-19.66992-7.26c-.56006-.28-1.12012-.58-1.68018-.87-.83008-.44-1.63965-.9-2.4497-1.38.38964-.54.81005-1.07,1.23974-1.59a53.03414,53.03414,0,0,1,78.87012-4.1,54.27663,54.27663,0,0,1,5.06006,5.86C685.25977,398.89316,685.6499,399.44321,686.03027,400.0032Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#6c63ff"
                  />
                  <circle cx="492.14325" cy="234.76352" r="43.90974" fill="#2f2e41" />
                  <circle cx="642.49883" cy="327.46205" r="32.68086" transform="translate(-232.6876 270.90663) rotate(-28.66315)" fill="#a0616a" />
                  <path
                    d="M676.8388,306.90589a44.44844,44.44844,0,0,1-25.402,7.85033,27.23846,27.23846,0,0,0,10.796,4.44154,89.62764,89.62764,0,0,1-36.61.20571,23.69448,23.69448,0,0,1-7.66395-2.63224,9.699,9.699,0,0,1-4.73055-6.3266c-.80322-4.58859,2.77227-8.75743,6.488-11.567a47.85811,47.85811,0,0,1,40.21662-8.03639c4.49246,1.16124,8.99288,3.12327,11.91085,6.731s3.78232,9.16981,1.00224,12.88488Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#2f2e41"
                  />
                  <path
                    d="M644.5,230.17319a89.98675,89.98675,0,0,0-46.83984,166.83l.58007.34q.72.43506,1.43995.84c.81005.48,1.61962.94,2.4497,1.38.56006.29,1.12012.59,1.68018.87a88.77786,88.77786,0,0,0,19.66992,7.26c1.41016.34,2.81982.65,4.26025.91a89.84124,89.84124,0,0,0,16.75977,1.57c1.41992,0,2.83008-.03,4.24023-.1q2.97-.135,5.87989-.47,3.52513-.39,6.96-1.06a89.52811,89.52811,0,0,0,13.6001-3.75c.56005-.21,1.11962-.42,1.66992-.63q2.26464-.87,4.4497-1.86,2.40015-1.08,4.73047-2.3a90.7919,90.7919,0,0,0,37.03955-35.97c.04-.07995.09034-.16.13038-.24a89.30592,89.30592,0,0,0,9.6499-26.41,90.051,90.051,0,0,0-88.3501-107.21Zm77.06006,132.45c-.08008.14-.1499.28-.23.41a88.17195,88.17195,0,0,1-36.48,35.32q-2.29542,1.2-4.66992,2.25c-1.31006.59-2.64991,1.15-4,1.67-.57032.22-1.14991.44-1.73.64a85.72126,85.72126,0,0,1-11.73,3.36,84.69473,84.69473,0,0,1-8.95019,1.41c-1.8501.2-3.73.34-5.62012.41-1.21.05-2.42969.08-3.6499.08a86.762,86.762,0,0,1-16.21973-1.51,85.62478,85.62478,0,0,1-9.63037-2.36,88.46592,88.46592,0,0,1-13.98974-5.67c-.52-.27-1.04-.54-1.5503-.82-.73-.39-1.46972-.79-2.18994-1.22-.54-.3-1.08008-.62-1.60986-.94-.31006-.18-.62012-.37-.93018-.56a88.06851,88.06851,0,1,1,123.18018-32.47Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#3f3d56"
                  />
                  <path
                    d="M624.2595,268.86254c-.47244-4.968-6.55849-8.02647-11.3179-6.52583s-7.88411,6.2929-8.82863,11.19308a16.0571,16.0571,0,0,0,2.16528,12.12236c2.40572,3.46228,6.82664,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59956,8.90127-10.32105s.00667-9.58929-.91854-14.31234Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#2f2e41"
                  />
                  <path
                    d="M691.24187,275.95964c-.47245-4.968-6.5585-8.02646-11.3179-6.52582s-7.88412,6.29289-8.82864,11.19307a16.05711,16.05711,0,0,0,2.16529,12.12236c2.40571,3.46228,6.82663,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59955,8.90127-10.32105s.00667-9.58929-.91853-14.31234Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#2f2e41"
                  />
                  <path
                    d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="currentColor"
                  />
                  <path
                    d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169ZM169.3618,176.01571A13.024,13.024,0,0,0,156.35252,189.025v94.5625a13.024,13.024,0,0,0,13.00928,13.00927H431.5814a8.02436,8.02436,0,0,1,5.90039,2.59571l49.62208,54.1333a2.50253,2.50253,0,0,0,4.34716-1.69092v-47.0332a8.0137,8.0137,0,0,1,8.00464-8.00489H509.087a13.024,13.024,0,0,0,13.00928-13.00927V189.025A13.024,13.024,0,0,0,509.087,176.01571Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#3f3d56"
                  />
                  <circle cx="36.81601" cy="125.19345" r="13.13371" fill="#6c63ff" />
                  <path
                    d="M493.76439,275.26947H184.68447a7.00465,7.00465,0,1,1,0-14.00929H493.76439a7.00465,7.00465,0,0,1,0,14.00929Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill={isDark ? '#888ea8' : '#e6e6e6'}
                  />
                  <path
                    d="M393.07263,245.49973H184.68447a7.00465,7.00465,0,1,1,0-14.00929H393.07263a7.00464,7.00464,0,0,1,0,14.00929Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill={isDark ? '#888ea8' : '#e6e6e6'}
                  />
                  <path
                    d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="currentColor"
                  />
                  <path
                    d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065ZM690.913,497.01571A13.024,13.024,0,0,0,677.9037,510.025v94.5625A13.024,13.024,0,0,0,690.913,617.59676h9.63135a8.0137,8.0137,0,0,1,8.00464,8.00489v47.0332a2.50253,2.50253,0,0,0,4.34716,1.69092l49.62208-54.1333a8.02436,8.02436,0,0,1,5.90039-2.59571h262.2196a13.024,13.024,0,0,0,13.00928-13.00927V510.025a13.024,13.024,0,0,0-13.00928-13.00928Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#3f3d56"
                  />
                  <path
                    d="M603.53027,706.11319a89.06853,89.06853,0,0,1-93.65039,1.49,54.12885,54.12885,0,0,1,9.40039-12.65,53.43288,53.43288,0,0,1,83.90967,10.56994C603.2998,705.71316,603.41992,705.91318,603.53027,706.11319Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#6c63ff"
                  />
                  <circle cx="398.44256" cy="536.68841" r="44.20157" fill="#2f2e41" />
                  <circle cx="556.81859" cy="629.4886" r="32.89806" transform="translate(-416.96496 738.72884) rotate(-61.33685)" fill="#ffb8b8" />
                  <path
                    d="M522.25039,608.79582a44.74387,44.74387,0,0,0,25.57085,7.9025,27.41946,27.41946,0,0,1-10.8677,4.47107,90.22316,90.22316,0,0,0,36.85334.20707,23.852,23.852,0,0,0,7.71488-2.64973,9.76352,9.76352,0,0,0,4.762-6.36865c.80855-4.61909-2.7907-8.81563-6.53113-11.64387a48.17616,48.17616,0,0,0-40.4839-8.08981c-4.52231,1.169-9.05265,3.144-11.99,6.77579s-3.80746,9.23076-1.0089,12.97052Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#2f2e41"
                  />
                  <path
                    d="M555.5,721.17319a89.97205,89.97205,0,1,1,48.5708-14.21875A89.87958,89.87958,0,0,1,555.5,721.17319Zm0-178a88.00832,88.00832,0,1,0,88,88A88.09957,88.09957,0,0,0,555.5,543.17319Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill="#3f3d56"
                  />
                  <circle cx="563.81601" cy="445.19345" r="13.13371" fill="#6c63ff" />
                  <path
                    d="M1020.76439,595.26947H711.68447a7.00465,7.00465,0,1,1,0-14.00929h309.07992a7.00464,7.00464,0,0,1,0,14.00929Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill={isDark ? '#888ea8' : '#e6e6e6'}
                  />
                  <path
                    d="M920.07263,565.49973H711.68447a7.00465,7.00465,0,1,1,0-14.00929H920.07263a7.00465,7.00465,0,0,1,0,14.00929Z"
                    transform="translate(-154.35252 -77.40283)"
                    fill={isDark ? '#888ea8' : '#e6e6e6'}
                  />
                  <ellipse cx="554.64354" cy="605.66091" rx="24.50394" ry="2.71961" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                  <ellipse cx="335.64354" cy="285.66091" rx="24.50394" ry="2.71961" fill={isDark ? '#888ea8' : '#e6e6e6'} />
                </svg>
              </div>
              <p className="mx-auto flex max-w-[190px] justify-center rounded-md bg-white-dark/20 p-2 font-semibold">
                {allSvgs.chatsBoxIconSvg}
                Click User To Chat
              </p>
            </div>
          </div>
        )}
        {isShowUserChat && selectedChatRoom ? (
          <div className="relative h-full">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button type="button" className="hover:text-primary lg:hidden " onClick={() => setIsShowChatMenu(!isShowChatMenu)}>
                  {allSvgs.sidebarMenuIcon}
                </button>
                <div className="relative flex-none">
                  <MakeProfileImage>{selectedChatRoom?.order_id?.order_name}</MakeProfileImage>
                  <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                  </div>
                </div>
                <div className="mx-3">
                  <Link href={`./shoots/${selectedChatRoom?.order_id?.id}`}>
                    <p className="font-semibold">
                      <span className="block md:hidden xl:hidden">{truncateLongText(selectedChatRoom?.order_id?.order_name, 20)}</span>
                      <span className="hidden md:block 2xl:hidden ">{truncateLongText(selectedChatRoom?.order_id?.order_name, 35)}</span>
                      <span className="hidden  2xl:block">{truncateLongText(selectedChatRoom?.order_id?.order_name, 80)}</span>
                    </p>
                    <p className="text-xs text-white-dark">{selectedChatRoom.active ? 'Active now' : 'Last seen at ' + updatedAtDateTime?.time}</p>
                  </Link>
                </div>
              </div>

              <>
                {!isSidebarOpen && (
                  <>
                    <div className="flex gap-3 sm:gap-5">
                      <>
                        {!isAddParticipant && (userRole === 'admin' || userRole === 'admin') && (
                          <>
                            <div className="hidden md:block">
                              <DefaultButton onClick={handleAddPerticipant} css={'px-3 py-0 text-[14px] mt-1.5'}>
                                Add Participant
                              </DefaultButton>
                            </div>
                          </>
                        )}

                        {isAddParticipant && (
                          <>
                            {/* test start */}
                            <div className="relative flex items-center justify-end">
                              {userData?.role === 'admin' && (
                                <div className="relative flex basis-[45%] flex-col sm:flex-row">
                                  <input
                                    type="search"
                                    onChange={(event) => {
                                      setClientName(event?.target?.value);
                                      getAllClients();
                                    }}
                                    onBlur={() => setIsAddParticipant(false)}
                                    className={`form-input w-64 flex-grow bg-slate-100`}
                                    value={clientName}
                                    placeholder="Search Participant..."
                                    required={!clientName}
                                  />

                                  {clients.length <= 0 && (
                                    <div
                                      className="absolute top-1/2 -translate-y-1/2  cursor-pointer ltr:right-2 rtl:left-2"
                                      // onClick={handleSearchParticipants}
                                    >
                                      {allSvgs.searchIcon}
                                    </div>
                                  )}

                                  {showClientDropdown && (
                                    <>
                                      <div ref={dropdownRef} className="absolute right-0 top-[43px] z-30 w-[79%] rounded-md border-2 border-black-light bg-white p-1">
                                        {isClientLoading ? (
                                          <div className="scrollbar mb-2 mt-2 h-[190px] animate-pulse overflow-x-hidden overflow-y-scroll">
                                            {[...Array(5)].map((_, i) => (
                                              <div key={i} className="flex items-center gap-3 rounded-sm bg-white px-2 py-1">
                                                <div className="h-7 w-7 rounded-full bg-slate-200"></div>
                                                <div className="h-7 w-full rounded-sm bg-slate-200"></div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <>
                                            {clients && clients.length > 0 ? (
                                              <ul className="scrollbar mb-2 mt-2 h-[300px] overflow-x-hidden overflow-y-scroll">
                                                {clients?.map((client: any) => (
                                                  // search result
                                                  <li
                                                    key={client.id}
                                                    onClick={() => handleClientChange(client)}
                                                    className="flex cursor-pointer items-center rounded-md px-3 py-2 text-[13px] font-medium leading-3 hover:bg-[#dfdddd83]"
                                                  >
                                                    <div className="relative m-1 mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xl text-white">
                                                      <Image
                                                        src={client?.profile_picture || '/assets/images/favicon.png'}
                                                        alt="Profile Picture"
                                                        className="h-full w-full rounded-full"
                                                        width={48}
                                                        height={48}
                                                      />
                                                    </div>
                                                    <a href="#">{client?.name}</a>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <div className="flex cursor-pointer items-center rounded-md px-3 py-2 text-[13px] font-medium leading-3 hover:bg-[#dfdddd83]">
                                                <p className="text-center text-red-500">No client found</p>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>

                      <div className={`dropdown toggle_threeDot ${threeDotSidebar && 'hidden'}`}>
                        <Dropdown
                          placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                          btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light w-8 h-8 rounded-full !flex justify-center items-center mt-1"
                          button={
                            <span onClick={toggleThreeDotSidebar}>
                              <svg
                                fill={!themeConfig.isDarkMode ? '#000000' : '#94a3b8'}
                                height="15px"
                                width="15px"
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32.055 32.055"
                              >
                                <g id="SVGRepo_iconCarrier">
                                  <g>
                                    <path
                                      d="M16.028,3.968c-2.192,0-3.967,1.773-3.967,3.965s1.775,3.967,3.967,3.967s3.967-1.773,3.967-3.967S18.221,3.968,16.028,3.968z 
                    M16.028,16.028c-2.192,0-3.967,1.774-3.967,3.967s1.775,3.967,3.967,3.967s3.967-1.773,3.967-3.967S18.221,16.028,16.028,16.028z 
                    M16.028,28.09c-2.192,0-3.967,1.773-3.967,3.965s1.775,3.967,3.967,3.967s3.967-1.773,3.967-3.967S18.221,28.09,16.028,28.09z"
                                    />
                                  </g>
                                </g>
                              </svg>
                            </span>
                          }
                        ></Dropdown>
                      </div>
                    </div>
                  </>
                )}
              </>
            </div>
            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

            <PerfectScrollbar
              className="chat-conversation-box relative h-full sm:h-[calc(100vh_-_300px)]"
              onScrollY={(container) => {
                if (container.scrollTop === 0) {
                  handleScroll();
                }
              }}
            >
              <div className="min-h-[400px] space-y-5 p-4 pb-[68px] sm:min-h-[300px] sm:pb-0">
                <div className="m-6 mt-0 block">
                  <h4 className="relative border-b border-[#f4f4f4] text-center text-xs dark:border-gray-800">
                    <span className="relative top-2 bg-white px-3 dark:bg-black">{'Today, ' + createdDateTime?.time}</span>
                  </h4>
                </div>
                {newMessages?.length ? (
                  <>
                    {newMessages?.map((message: any, index: any) => {
                      return (
                        <div key={index}>
                          <div className={`flex items-start gap-3 ${message?.senderId === userData.id ? 'justify-end' : ''}`}>
                            <div className={`flex-none ${message?.senderId === userData.id ? 'order-2' : ''}`}>
                              {message?.senderId === userData.id ? (
                                userData?.profile_picture ? (
                                  <Image src={userData.profile_picture} className="h-10 w-10 rounded-full" alt="own_profile_photo" width={40} height={40} />
                                ) : (
                                  ''
                                )
                              ) : message?.profile_picture ? (
                                <Image src={message.profile_picture} className="h-10 w-10 rounded-full" alt="profile_photo" width={40} height={40} />
                              ) : message.senderName === 'Admin User' ? (
                                createImageByName('MA')
                              ) : message.senderName === 'User' ? (
                                createImageByName('A')
                              ) : (
                                createImageByName('CP')
                              )}
                            </div>

                            <div className="">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-full max-w-[250px] overflow-hidden break-words rounded-md bg-black/10 p-4 py-1 dark:bg-gray-800 md:max-w-[350px] ${
                                    message?.senderId === userData.id ? '!bg-primary text-white ltr:rounded-br-none rtl:rounded-bl-none' : 'ltr:rounded-bl-none rtl:rounded-br-none'
                                  }`}
                                >
                                  {message?.message}
                                </div>

                                <div className={`${message?.senderId === userData.id ? 'hidden' : ''}`}>
                                  <span>{allSvgs.chatSmileIcon}</span>
                                </div>
                              </div>
                              <div className="text-xs text-white-dark">{message?.senderName}</div>
                              {/* <div className={`text-xs text-white-dark ${message?.senderId === userData.id ? 'ltr:text-right rtl:text-left' : ''}`}>{message.time ? message.time : '5h ago'}</div> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  ''
                )}
                {isTyping && <p className="text-white-dark"> {typtingUser?.userName} is typing...</p>}
              </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="w-full items-center space-x-3 rtl:space-x-reverse sm:flex">
                <div className="relative flex-1">
                  <input
                    className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 py-2 focus:outline-none"
                    placeholder="Type a message"
                    value={textMessage}
                    onChange={(e: any) => setTextMessage(e.target.value)}
                    onKeyUp={sendMessageHandle}
                  />
                  <button type="button" className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:left-4 rtl:right-4">
                    {allSvgs.chatSmileIcon}
                  </button>
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 hover:text-primary ltr:right-4 rtl:left-4"
                    onClick={(e: any) => {
                      sendMessage(textMessage);
                    }}
                  >
                    {allSvgs.msgSendIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* starts details menu */}

      {/* for below md devices  */}
      {threeDotSidebar && (
        <div className={`panel block flex-1 p-0 xl:hidden`}>
          <div className="relative h-full">
            <div className="mt-1 flex w-full justify-between gap-3 sm:gap-5">
              <div className="my-4 ms-4 text-[20px] font-semibold">
                <h2 className="text-black dark:text-white-dark">Details</h2>
              </div>
              <button
                className="my-4 me-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f4] hover:bg-primary-light dark:bg-[#1b2e4b] hover:dark:text-dark-light"
                onClick={toggleThreeDotSidebar}
              >
                <div className="">{allSvgs.closeIconSvg}</div>
              </button>
            </div>
            <div className="h-px w-full border-b border-white-light pt-1 dark:border-[#1b2e4b]"></div>
            <div>
              <ul className="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <li className="me-2">
                  <button
                    onClick={() => setActiveTab('1')}
                    className={`inline-block rounded-t-lg p-4 ${
                      activeTab === '1' ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500' : 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Participant
                  </button>
                </li>
                <li className="me-2">
                  <button
                    onClick={() => setActiveTab('2')}
                    className={`inline-block rounded-t-lg p-4 ${
                      activeTab === '2' ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500' : 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Files
                  </button>
                </li>
              </ul>

              <div>
                {/* {perticipants} */}
                {activeTab === '1' && (
                  <div className="ms-2">
                    <div className="mt-1">
                      <PerfectScrollbar className="chat-users relative h-48 min-h-[100px] space-y-0.5 ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5 sm:h-[calc(100vh_-_357px)] md:h-full">
                        <ul className="space-y-2">
                          <li className="flex items-start rounded p-2 hover:bg-gray-200 dark:hover:bg-[#2c3e50]">
                            <span className={`mr-2 mt-2 h-2.5 w-2.5 rounded-full bg-green-500`}></span>
                            <div className="flex flex-col justify-start space-y-0">
                              <span className="text-black dark:text-white-dark">{selectedChatRoom?.client_id?.name}</span>
                              <span className="badge w-9 p-0 text-center text-[10px] text-gray-400">{selectedChatRoom?.client_id?.role === 'user' && 'Client'}</span>
                            </div>
                          </li>

                          {[
                            ...selectedChatRoom?.cp_ids.map((cp: CpDataTypes) => ({
                              ...cp,
                              type: 'cp',
                            })),
                            ...selectedChatRoom?.manager_ids.map((manager: any) => ({
                              ...manager,
                              type: 'admin',
                            })),
                          ].map((item, index) => (
                            <li key={index} className="flex items-start rounded p-2 hover:bg-gray-200 dark:hover:bg-[#2c3e50]">
                              <span className={`mr-2 mt-2 h-2.5 w-2.5 rounded-full ${item?.decision === 'cancelled' ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                              <div className="flex flex-col space-y-0">
                                <span className="text-black dark:text-white-dark">{item?.id?.name}</span>
                                <span className={`badge p-0 text-center text-[10px] text-gray-400 ${item?.id?.role === 'cp' ? 'w-5' : 'w-10'}`}>
                                  {item?.id?.role === 'admin' ? 'Admin' : item?.id?.role === 'user' ? 'Client' : 'Cp'}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </PerfectScrollbar>
                    </div>
                  </div>
                )}

                {activeTab === '2' && (
                  <div className=" mx-4">
                    <h2 className="text-lg font-medium">Image files</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-32 w-32 rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-32 w-32 rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-32 w-32 rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-32 w-32 rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-32 w-32 rounded-lg shadow-md" width={10} height={10} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* for lg details menu sidebar */}
      <div className="hidden xl:block">
        {threeDotSidebar && (
          <div className={`panel z-5 absolute h-96 w-64 max-w-xs flex-none overflow-hidden p-4 md:h-full md:space-y-4 xl:relative xl:block xl:h-full 2xl:w-96 ${isShowChatMenu ? '!block' : ''}`}>
            <div className="mt-1 flex w-full items-center justify-between gap-3 sm:gap-5">
              <div className=" ms-4 text-[20px] font-semibold">
                <h2>Details</h2>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f4] hover:bg-primary-light dark:bg-[#1b2e4b] " onClick={toggleThreeDotSidebar}>
                <div className="">{allSvgs.closeIconSvg}</div>
              </button>
            </div>
            <div className="h-px w-full border-b border-white-light pt-1 dark:border-[#1b2e4b]"></div>
            <div>
              <ul className="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <li className="me-2">
                  <button
                    onClick={() => setActiveTab('1')}
                    className={`inline-block rounded-t-lg p-4 ${
                      activeTab === '1' ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500' : 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Participant
                  </button>
                </li>
                <li className="me-2">
                  <button
                    onClick={() => setActiveTab('2')}
                    className={`inline-block rounded-t-lg p-4 ${
                      activeTab === '2' ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500' : 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Files
                  </button>
                </li>
              </ul>

              <div>
                {activeTab === '1' && (
                  <div className="">
                    <div className="mt-1">
                      <PerfectScrollbar className="chat-users relative h-48 min-h-[100px] space-y-0.5 ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5 sm:h-[calc(100vh_-_357px)] md:h-full">
                        <ul className="space-y-2">
                          <li className="flex items-start rounded p-2 hover:bg-gray-200 dark:hover:bg-[#2c3e50]">
                            <span className={`mr-2 mt-2 h-2.5 w-2.5 rounded-full bg-green-500`}></span>
                            <div className="group flex flex-col justify-start space-y-0">
                              <span className="text-black group-hover:text-dark-light dark:text-white-dark">{selectedChatRoom?.client_id?.name}</span>
                              <span className="badge w-9 p-0 text-center text-[10px] text-gray-400">{selectedChatRoom?.client_id?.role === 'user' && 'Client'}</span>
                            </div>
                          </li>
                          {[
                            ...selectedChatRoom?.cp_ids.map((cp: CpDataTypes) => ({
                              ...cp,
                              type: 'cp',
                            })),
                            ...selectedChatRoom?.manager_ids.map((manager: any) => ({
                              ...manager,
                              type: 'admin',
                            })),
                          ].map((item, index) => (
                            <li key={index} className="flex items-start rounded p-2 hover:bg-gray-200 dark:hover:bg-[#2c3e50]">
                              <span className={`mr-2 mt-2 h-2.5 w-2.5 rounded-full ${item?.decision === 'cancelled' ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                              <div className="group flex flex-col space-y-0">
                                <span className="text-black group-hover:text-dark-light dark:text-white-dark ">{item?.id?.name}</span>
                                <span className={`badge p-0 text-center text-[10px] text-gray-400 ${item?.id?.role === 'cp' ? 'w-5' : 'w-10'}`}>
                                  {item?.id?.role === 'admin' ? 'Admin' : item?.id?.role === 'user' ? 'Client' : 'Cp'}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </PerfectScrollbar>
                    </div>
                  </div>
                )}

                {activeTab === '2' && (
                  <div className="">
                    <h2 className="text-lg font-medium">Image files</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-auto w-full rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-auto w-full rounded-lg shadow-md" width={10} height={10} />
                      </div>
                      <div className="relative">
                        <Image src="https://via.placeholder.com/300" alt="Demo 1" className="h-auto w-full rounded-lg shadow-md" width={10} height={10} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/*  ends details sidebar menu*/}
    </div>
  );
};
export default Chat;
