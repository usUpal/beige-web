import { IRootState } from '@/store';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';

interface SkeletonProps {
  isDarkMode: boolean;
  col?: number;
}

const SkeletonLoader = ({ isDarkMode, width, height, shape }: { isDarkMode: boolean; width: number; height: number; shape: 'rect' | 'circle' }) => (
  <ContentLoader foregroundColor={isDarkMode ? '#000' : '#eee'} backgroundColor={isDarkMode ? '#090e17' : '#f5f6f7'} width={width} height={height}>
    {shape === 'rect' ? (
      <rect x="0" y="0" rx="4" ry="4" width={width} height={height / 2} className="fill-gray-300 dark:fill-gray-600" />
    ) : (
      <circle cx={width / 2} cy={height / 2} r={height / 2} className="fill-gray-300 dark:fill-gray-600" />
    )}
  </ContentLoader>
);

const CommonSkeleton = ({ col }: SkeletonProps) => {
  const { isDarkMode } = useSelector((state: IRootState) => state.themeConfig);
  return (
    <tr className="group">
      <>
        {Array.from({ length: col || 5 }).map((_, index) => (
          <td key={index}>
            <SkeletonLoader isDarkMode={isDarkMode} width={index == 0 ? 200 : 80} height={24} shape="rect" />
          </td>
        ))}
      </>

      <td>
        <SkeletonLoader isDarkMode={isDarkMode} width={24} height={24} shape="circle" />
      </td>
    </tr>
  );
};

export default CommonSkeleton;
