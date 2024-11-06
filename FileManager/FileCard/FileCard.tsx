import React, { useState } from 'react';
import { allSvgs } from '@/utils/allsvgs/allSvgs';

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
  // const [isOpen, setIsOpen] = useState(false);

  // function for getting icons
  const getFileIcon = (fileType: any, isFolder: any) => {
    const fileTypeIndex = fileType.split('/');
    if (isFolder) {
      return allSvgs.folderIconForFile;
    } else {
      // Check if fileType is not defined or empty
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
      <div className="mx-8 box-border rounded-xl border bg-gray-200  p-2 shadow  hover:shadow-none">
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
          >
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
          </div>
        </div>

        {/* dropdown */}
        <div className="dropdown">
          <div className="relative">
            {selectFileIds.includes(id) && (
              <div className="absolute right-0 top-[-10px] z-10 mt-2 origin-top-right  rounded-lg border-gray-300 bg-white ring-1 ring-gray-500 ring-opacity-5 ">
                <div className=" divide-y " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a href="#" className="flex items-center rounded-lg px-4 py-2 text-sm capitalize  hover:bg-gray-100 " role="menuitem" onClick={() => onDownload(isPublic)}>
                    <span className="">{allSvgs.cloudIcon_Dropdown}</span>
                    <span className="ms-3 text-gray-600"> Download</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-start rounded-lg px-4 py-2 text-sm capitalize hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      onSetPublic(!isPublic);
                    }}
                  >
                    <span className="">{allSvgs.lockIcon_Dropdown}</span>
                    <span className="ms-3 text-gray-600"> {isPublic ? 'Make private' : 'Make public'}</span>
                  </a>

                  {/* Move */}
                  {/*  {!isFolder && (
                    <a
                      href="#"
                      className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize flex justify-start items-center`}
                      role="menuitem"
                      onClick={(e) => {
                        !isFolder ? onMove() : e.preventDefault()
                      }
                      }
                    >
                      <span className=''>{allSvgs.arrowRight_dropdown}</span>
                      <span className='ms-3'> Move</span>
                    </a>
                  )} */}
                  {/*  */}

                  {!isFolder && (
                    <a
                      href="#"
                      className="flex items-center justify-start rounded-lg px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      // disabled={isFolder}
                      onClick={onRename}
                    >
                      <span className="">{allSvgs.pencilIcon_dropdown}</span>
                      <span className="ms-3 text-gray-600 "> Rename</span>
                    </a>
                  )}
                  <a
                    href="#"
                    className=" flex items-center justify-start rounded-lg px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    // disabled={path.length === 0}
                    onClick={onDelete}
                  >
                    <span className="">{allSvgs.trash_download}</span>
                    <span className="ms-3 text-dark"> Delete</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // File card for card view
    return (
      <div className="mx-8 box-border rounded-xl border bg-gray-200  p-2 shadow hover:bg-gray-300">
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
                {/* {allSvgs.threeDotMenuIcon} */}
                {/* dropdown */}
                <div className="dropdown">
                  <div className="relative">
                    {selectFileIds.includes(id) && (
                      <div className="absolute right-0 top-[-10px] z-10 mt-2 origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="divide-y py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <a
                            href="#"
                            className="flex items-center justify-start px-4 py-2 text-sm capitalize hover:bg-gray-100"
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
                            className="flex items-center justify-start px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            // disabled={isFolder}
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
            </div>

            {/* Button Group (Download, Linkify, Delete) */}
            <div className="btn-group mt-2 flex cursor-pointer justify-between  border">
              {/* Download Icon */}
              <div className="flex flex-1 items-center justify-center rounded-l-lg border text-center" onClick={() => onDownload(isPublic)}>
                {allSvgs.downloadIcon}
              </div>

              {/* Linkify Icon */}
              <div className="flex flex-1  items-center justify-center border text-center" onClick={onClickItem}>
                {allSvgs.linkify}
              </div>

              {/* Delete Icon */}
              <div className="flex flex-1 items-center  justify-center rounded-r-lg border text-center" onClick={() => onDownload(isPublic)}>
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
