import React from 'react';
import ContentLoader from 'react-content-loader';

const RoleManagementSkeleton = () => (
  <tr>
    <td className="whitespace-nowrap px-6 py-4">
      <ContentLoader width={100} height={20}>
        <rect x="0" y="0" rx="5" ry="5" width="100" height="20" />
      </ContentLoader>
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <ContentLoader width={80} height={20}>
        <rect x="0" y="0" rx="5" ry="5" width="80" height="20" />
      </ContentLoader>
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <ContentLoader key={i} width={60} height={20}>
            <rect x="0" y="0" rx="5" ry="5" width="60" height="20" />
          </ContentLoader>
        ))}
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="flex space-x-4">
        <ContentLoader width={20} height={20}>
          <circle cx="10" cy="10" r="10" />
        </ContentLoader>
        <ContentLoader width={20} height={20}>
          <circle cx="10" cy="10" r="10" />
        </ContentLoader>
      </div>
    </td>
  </tr>
);

export default RoleManagementSkeleton;
