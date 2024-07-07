import React, { useState } from 'react'; import { allSvgs } from '@/utils/allsvgs/allSvgs';

const FileCard = ({ cardType, isFolder, name, size, fileType, lastMod, isDimmed, checkIsPublic, onDelete, onRename, onMove, onClickItem, onDownload, onSetPublic, path, id, handleDropDown, selectFileIds }) => {

  const [isPublic, setIsPublic] = useState(false);

  const [fileId, setFileId] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);



  // function for getting icons
  const getFileIcon = (fileType: any, isFolder: any) => {
    const fileTypeIndex = fileType.split('/');
    if (isFolder) {
      return (allSvgs.folderIconForFile);
    }
    else {
      // Check if fileType is not defined or empty
      if (!fileType || fileTypeIndex.length < 1) {
        return allSvgs.quesMarkIcon;
      }
      const fileTypeCategory = fileTypeIndex[0];

      if (fileTypeCategory === 'image') {
        return allSvgs.imageIcon;
      }
      else if (fileTypeCategory === 'video') {
        return allSvgs.vedio;
      }
      else if (fileTypeCategory === 'application' || fileTypeCategory === 'text') {
        return allSvgs.docsIcon;
      }
      else {
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
      <div className='border box-border p-2 mx-8 bg-gray-200  rounded-xl shadow  hover:shadow-none'>
        <div className='icons_and_3dot flex justify-between items-center cursor-pointer'>
          <div className={`flex justify-between items-center flex-1`} onClick={onClickItem}>
            <p className=''>{icon}</p>

            <p title={name} className='text-[14px] flex-1 ml-2' >
              {/* Add a space before the name */}
              {name.length > 25 ? `${name.substring(0, 25)}... ${getFileExtension(name)}` : `${name}`}
            </p>
          </div>

          <div className="threeDot" onClick={() => { handleDropDown(id) }}>
            {allSvgs.threeDotMenuIcon}
          </div>
        </div>

        {/* dropdown */}
        <div className="dropdown" >
          <div className="relative">
            {selectFileIds.includes(id) && (
              <div
                className="origin-top-right absolute right-0 top-[-10px] z-10 mt-2  bg-white rounded-lg border-gray-300 ring-1 ring-gray-500 ring-opacity-5 "
              >
                <div className=" divide-y " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a
                    href="#"
                    className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg capitalize flex  items-center "
                    role="menuitem"
                    onClick={() => onDownload(isPublic)}
                  >
                    <span className=''>{allSvgs.cloudIcon_Dropdown}</span>
                    <span className='ms-3 text-gray-600'> Download</span>
                  </a>

                  <a
                    href="#"
                    className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg capitalize flex justify-start items-center"
                    role="menuitem"
                    onClick={() => {
                      onSetPublic(!isPublic);
                    }}
                  >
                    <span className=''>{allSvgs.lockIcon_Dropdown}</span>
                    <span className='ms-3 text-gray-600'> {isPublic ? 'Make private' : 'Make public'}</span>
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

                  <a
                    href="#"
                    className="px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 capitalize flex justify-start items-center"
                    role="menuitem"
                    // disabled={isFolder}
                    onClick={onRename}
                  >
                    <span className=''>{allSvgs.pencilIcon_dropdown}</span>
                    <span className='ms-3 text-gray-600 '> Rename</span>
                  </a>
                  <a
                    href="#"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg capitalize flex justify-start items-center"
                    role="menuitem"
                    // disabled={path.length === 0}
                    onClick={onDelete}
                  >
                    <span className=''>{allSvgs.trash_download}</span>
                    <span className='ms-3 text-dark'> Delete</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    );
  }
  else {
    // File card for card view
    return (
      <div className="border box-border p-2 mx-8 bg-gray-200  rounded-xl shadow hover:bg-gray-300">
        {!isDimmed && (
          <div className={`box-border ${isFolder ? 'folder-card' : ''}`}>
            <div className="flex justify-between">
              <div>
                <a href="#" onClick={onClickItem} title={name} className="text-[16px]">
                  {name.length > 15 ? `${name.substring(0, 15)}...${getFileExtension(name)}` : `${name}${getFileExtension(name)}`}
                </a>
              </div>

              <div className="threeDot" onClick={() => { handleDropDown(id) }}>
                {allSvgs.threeDotMenuIcon}
                {/* dropdown */}
                <div className="dropdown">
                  <div className="relative">
                    {selectFileIds.includes(id) && (
                      <div className="origin-top-right absolute right-0 top-[-10px] z-10 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1 divide-y" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <a
                            href="#"
                            className="px-4 py-2 text-sm hover:bg-gray-100 capitalize flex justify-start items-center"
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
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize flex justify-start items-center"
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
            <div className="btn-group flex justify-between cursor-pointer mt-2  border">

              {/* Download Icon */}
              <div className="border rounded-l-lg flex-1 text-center flex justify-center items-center" onClick={() => onDownload(isPublic)}>
                {allSvgs.downloadIcon}
              </div>

              {/* Linkify Icon */}
              <div className="border flex-1  text-center flex justify-center items-center" onClick={onClickItem}>
                {allSvgs.linkify}
              </div>

              {/* Delete Icon */}
              <div className="border rounded-r-lg flex-1  text-center flex justify-center items-center" onClick={() => onDownload(isPublic)}>
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