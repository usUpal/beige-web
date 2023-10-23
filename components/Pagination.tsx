interface PaginationProps {
    onPageChange: (page: number) => void;
    totalPages: number;
    currentPage: number;
  }
const Pagination: React.FC<PaginationProps> = ({ onPageChange, totalPages, currentPage }) => {
    return (
      <ul className="m-auto inline-flex items-center space-x-1 rtl:space-x-reverse mt-5">
        <li>
          <button
            type="button"
            className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
              <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </li>
  
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={`flex justify-center rounded ${currentPage === pageNumber ? 'bg-[#ACA686]' : 'bg-white-light'} px-3.5 py-2 font-semibold text-${currentPage === pageNumber ? 'white' : 'dark'} transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
  
        <li>
          <button
            type="button"
            className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#ACA686] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#ACA686]"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
              <path d="M11 19L17 12L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </li>
      </ul>
    );
  };
  
  export default Pagination;
  