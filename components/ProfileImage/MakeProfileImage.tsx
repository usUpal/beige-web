import React from 'react';

interface MakeProfileImageProps {
  children: string;
}

const MakeProfileImage: React.FC<MakeProfileImageProps> = ({ children }) => {

  if (!children) return null;
  const nameParts = children.trim().split(' ');
  const firstInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : '';
  const lastInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : '';

  const initials = firstInitial + lastInitial;

  return (
    <span className="h-[35px] w-[35px] text-[13px] leading-[45px] flex items-center justify-center rounded-full bg-gray-300">
      {initials}
    </span>
  );
};

export default MakeProfileImage;

