import Loader from '@/components/skeletons/Loader';

const ShootSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <tr className="group text-white-dark">
    <td className="min-w-[150px]">
      <div className="flex items-center">
        {/* Circle loader for avatar */}
        <Loader type="circle" size={32} isDarkMode={isDarkMode} className="h-8 w-8 rounded-md ltr:mr-3 rtl:ml-3" />

        {/* Rect loaders for text */}
        <div>
          <Loader type="rect" width={120} height={12} isDarkMode={isDarkMode} className="mb-1" />
          <Loader type="rect" width={80} height={8} isDarkMode={isDarkMode} rx={3} ry={3} />
        </div>
      </div>
    </td>

    <td className="min-w-[140px]">
      <Loader type="rect" width={100} height={12} isDarkMode={isDarkMode} />
    </td>

    <td>
      <Loader type="rect" width={60} height={12} isDarkMode={isDarkMode} />
    </td>

    <td className="text-center">
      <Loader type="rect" width={100} height={12} isDarkMode={isDarkMode} />
    </td>

    <td>
      <Loader type="rect" width={80} height={12} isDarkMode={isDarkMode} />
    </td>

    <td>
      <Loader type="circle" size={24} isDarkMode={isDarkMode} />
    </td>
  </tr>
);

export default ShootSkeleton;
