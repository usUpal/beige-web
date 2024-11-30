import ContentLoader from 'react-content-loader';

interface LoaderProps {
  type?: 'rect' | 'circle';
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  size?: number; // Used for circle
  isDarkMode?: boolean;
  className?: string;
}

const Loader = ({ type, width, height, rx = 4, ry = 4, size = 24, isDarkMode = false, className = '' }: LoaderProps) => {
  const foregroundColor = isDarkMode ? '#000' : '#eee';
  const backgroundColor = isDarkMode ? '#090e17' : '#f5f6f7';

  return (
    <ContentLoader foregroundColor={foregroundColor} backgroundColor={backgroundColor} width={type === 'circle' ? size : width} height={type === 'circle' ? size : height} className={className}>
      {type === 'circle' ? <circle cx={size / 2} cy={size / 2} r={size / 2} /> : <rect x="0" y="0" rx={rx} ry={ry} width={width} height={height} />}
    </ContentLoader>
  );
};

export default Loader;
