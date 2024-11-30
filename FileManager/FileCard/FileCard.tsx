import React, { useState } from 'react';
import { allSvgs, pencilIconDropdown, trash_downloadIcon, trashDownloadIcon } from '@/utils/allsvgs/allSvgs';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const FileCard = ({
  cardType,
  isFolder,
  name,
  size,
  fileType,
  lastMod,
  isDimmed,
  checkIsPublic,
  onDelete,
  onRename,
  onMove,
  onClickItem,
  onDownload,
  onSetPublic,
  path,
  id,
  handleDropDown,
  selectFileIds,
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const [fileId, setFileId] = useState([]);

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  // Function for getting icons
  const getFileIcon = (fileType: any, isFolder: any) => {
    const fileTypeIndex = fileType.split('/');
    if (isFolder) {
      return allSvgs.folderIconForFile;
    } else {
      if (!fileType || fileTypeIndex.length < 1) {
        return allSvgs.quesMarkIcon;
      }
      const fileTypeCategory = fileTypeIndex[0];

      if (fileTypeCategory === 'image') {
        return allSvgs.imageIcon;
      } else if (fileTypeCategory === 'video') {
        return allSvgs.vedio;
      } else if (fileTypeCategory === 'application' || fileTypeCategory === 'text') {
        return allSvgs.docsIcon;
      } else {
        return allSvgs.quesMarkIcon;
      }
    }
  };

  const icon = getFileIcon(fileType, isFolder);

  function getFileExtension(name: any) {
    const lastDotIndex = name.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : name.substring(lastDotIndex);
  }

  if (cardType === 'list') {
    // File card for list view
    return (
      <div className="mx-8 box-border rounded border border-slate-600 bg-gray-200 p-2 shadow hover:shadow-none dark:bg-black dark:text-slate-400">
        <div className="flex cursor-pointer items-center justify-between">
          <div className={`flex flex-1 items-center justify-between`} onClick={onClickItem}>
            <p className="">{icon}</p>

            <p title={name} className="ml-2 flex-1 text-[16px]">
              {name.length > 25 ? `${name.substring(0, 25)}... ${getFileExtension(name)}` : `${name}`}
            </p>
          </div>

          <div
            onClick={() => {
              handleDropDown(id);
            }}
            className="relative"
          >
            {!themeConfig.isDarkMode ? (
              <svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.055 32.055">
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
            ) : (
              <span>
                <svg fill="#94a3b8" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.055 32.055">
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
            )}

            {/* Dropdown menu */}
            <div
              className={`absolute right-0 top-[-10px] z-10 mt-2 origin-top-right rounded-lg border border-slate-600 bg-white ring-1 ring-gray-500 ring-opacity-5 dark:bg-black dark:text-slate-400 ${
                selectFileIds.includes(id) ? 'block' : 'hidden'
              }`}
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a
                  href="#"
                  className="flex items-center rounded-lg px-4 py-2 text-sm capitalize hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  role="menuitem"
                  onClick={() => onDownload(isPublic)}
                >
                  <span className="">{allSvgs.cloudIcon_Dropdown}</span>
                  <span className="ms-3 border-none"> Download</span>
                </a>

                <a
                  href="#"
                  className="flex items-center justify-start rounded-lg px-4 py-2 text-sm capitalize hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  role="menuitem"
                  onClick={() => {
                    onSetPublic(!isPublic);
                  }}
                >
                  <span className="">{allSvgs.lockIcon_Dropdown}</span>
                  <span className="ms-3 border-none"> {isPublic ? 'Make private' : 'Make public'}</span>
                </a>

                {!isFolder && (
                  <a
                    href="#"
                    className="flex items-center justify-start rounded-lg border-none px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    role="menuitem"
                    onClick={onRename}
                  >
                    {/* <span className="">{allSvgs.pencilIcon_dropdown}</span> */}
                    <span className="">{pencilIconDropdown('#94a3b8')}</span>
                    <span className="ms-3 "> Rename</span>
                  </a>
                )}

                <a
                  href="#"
                  className="flex items-center justify-start rounded-lg border-none px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-800 dark:bg-black dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  role="menuitem"
                  onClick={onDelete}
                >
                  {/* <span className="">{allSvgs.trash_download}</span> */}
                  <span className="">{themeConfig.isDarkMode ? trashDownloadIcon('#94a3b8') : trashDownloadIcon('#94a3b8')}</span>
                  <span className="ms-3 "> Delete</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // File card for card view
    return (
      <div className="mx-8 box-border rounded-xl border bg-gray-200 p-2 shadow hover:bg-gray-300 dark:bg-black dark:text-slate-400">
        {!isDimmed && (
          <div className={`box-border ${isFolder ? 'folder-card' : ''}`}>
            <div className="flex justify-between">
              <div>
                <a href="#" onClick={onClickItem} title={name} className="text-[16px]">
                  {name.length > 15 ? `${name.substring(0, 15)}...${getFileExtension(name)}` : `${name}${getFileExtension(name)}`}
                </a>
              </div>

              <div
                className="threeDot"
                onClick={() => {
                  handleDropDown(id);
                }}
              >
                <div className="relative">
                  {/* Dropdown */}
                  {selectFileIds.includes(id) && (
                    <div className="absolute right-0 top-[-10px] z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:text-slate-400">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <a
                          href="#"
                          className="flex items-center justify-start px-4 py-2 text-sm capitalize hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          role="menuitem"
                          onClick={() => {
                            onSetPublic(!isPublic);
                          }}
                        >
                          <span className="">{allSvgs.lockIcon_Dropdown}</span>
                          <span className="ms-3 text-gray-600">{isPublic ? 'Make private' : 'Make public'}</span>
                        </a>

                        {/* Rename Option */}
                        <a
                          href="#"
                          className="flex items-center justify-start px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          role="menuitem"
                          onClick={onRename}
                        >
                          <span className="">{allSvgs.pencilIcon_dropdown}</span>
                          <span className="ms-3 text-gray-600">Rename</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="btn-group mt-2 flex cursor-pointer justify-between border dark:border-slate-600">
              {/* Download Icon */}
              <div className="flex flex-1 items-center justify-center rounded-l-lg border text-center" onClick={() => onDownload(isPublic)}>
                {allSvgs.downloadIcon}
              </div>

              {/* Linkify Icon */}
              <div className="flex flex-1 items-center justify-center border text-center" onClick={onClickItem}>
                {allSvgs.linkify}
              </div>

              {/* Delete Icon */}
              <div className="flex flex-1 items-center justify-center rounded-r-lg border text-center" onClick={() => onDownload(isPublic)}>
                {allSvgs.trashIconSm}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default FileCard;
