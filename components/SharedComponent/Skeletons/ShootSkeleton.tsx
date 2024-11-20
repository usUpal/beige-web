import ContentLoader from 'react-content-loader';

const ShootSkeleton = () => (
  <tr className="group text-white-dark">
    <td className="min-w-[150px]">
      <div className="flex items-center">
        {/* Placeholder for the avatar */}
        <ContentLoader width={32} height={32} viewBox="0 0 32 32" className="h-8 w-8 rounded-md ltr:mr-3 rtl:ml-3">
          <circle cx="16" cy="16" r="16" />
        </ContentLoader>

        {/* Placeholder for the order name and date */}
        <div>
          <ContentLoader width={120} height={24} className="mb-1">
            <rect x="0" y="0" rx="4" ry="4" width="120" height="12" />
          </ContentLoader>
          <ContentLoader width={80} height={12}>
            <rect x="0" y="0" rx="3" ry="3" width="80" height="8" />
          </ContentLoader>
        </div>
      </div>
    </td>

    <td className="min-w-[140px]">
      <ContentLoader width={100} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="100" height="12" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={60} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="60" height="12" />
      </ContentLoader>
    </td>

    <td className="text-center">
      <ContentLoader width={100} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="100" height="12" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={80} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="80" height="12" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={24} height={24}>
        <circle cx="12" cy="12" r="12" />
      </ContentLoader>
    </td>
  </tr>
);

export default ShootSkeleton;
