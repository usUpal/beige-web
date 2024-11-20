import React from 'react';
import ContentLoader from 'react-content-loader';

const DisputeSkeleton = () => (
  <tr className="group text-white-dark">
    <td className="min-w-[150px]">
      <div className="flex items-center">
        <ContentLoader width={120} height={24} className="mb-1">
          <rect x="0" y="0" rx="4" ry="4" width="120" height="12" />
        </ContentLoader>
      </div>
    </td>

    <td className="min-w-[140px]">
      <ContentLoader width={150} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="150" height="12" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={60} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="60" height="12" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={24} height={24}>
        <circle cx="12" cy="12" r="12" />
      </ContentLoader>
    </td>
  </tr>
);

export default DisputeSkeleton;
