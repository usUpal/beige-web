import Loader from '@/components/skeletons/Loader';

const RoleManagementSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <tr>
    <td className="whitespace-nowrap px-6 py-4">
      <Loader type="rect" width={100} height={20} isDarkMode={isDarkMode} />
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <Loader type="rect" width={80} height={20} isDarkMode={isDarkMode} />
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Loader key={i} type="rect" width={60} height={20} isDarkMode={isDarkMode} />
        ))}
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="flex space-x-4">
        <Loader type="circle" size={20} isDarkMode={isDarkMode} />
        <Loader type="circle" size={20} isDarkMode={isDarkMode} />
      </div>
    </td>
  </tr>
);

export default RoleManagementSkeleton;
