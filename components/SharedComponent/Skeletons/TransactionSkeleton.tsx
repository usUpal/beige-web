import ContentLoader from 'react-content-loader';

const SixRowSingleLineSkeleton = () => (
  <tr className="group">
    <td className="min-w-[150px]">
      <div className="flex items-center">
        <ContentLoader width={120} height={24} className="mb-1">
          <rect x="0" y="0" rx="4" ry="4" width="120" height="12" className="fill-gray-300 dark:fill-gray-600" />
        </ContentLoader>
      </div>
    </td>

    <td className="min-w-[140px]">
      <ContentLoader width={100} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="100" height="12" className="fill-gray-300 dark:fill-gray-600" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={60} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="60" height="12" className="fill-gray-300 dark:fill-gray-600" />
      </ContentLoader>
    </td>

    <td className="text-center">
      <ContentLoader width={100} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="100" height="12" className="fill-gray-300 dark:fill-gray-600" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={80} height={24}>
        <rect x="0" y="0" rx="4" ry="4" width="80" height="12" className="fill-gray-300 dark:fill-gray-600" />
      </ContentLoader>
    </td>

    <td>
      <ContentLoader width={24} height={24}>
        <circle cx="12" cy="12" r="12" className="fill-gray-300 dark:fill-gray-600" />
      </ContentLoader>
    </td>
  </tr>
);

export default SixRowSingleLineSkeleton;
