const Pagination = ({ items, pageSize, currentPage, onPageChange }) => {

    const pagesCount = Math.ceil(items / pageSize); // 100/10

    if (pagesCount === 1) return null;
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

    return (
      <>
        <ul className="m-auto inline-flex items-center space-x-1 rtl:space-x-reverse mt-5">

            {pages.map((page) => (
            <li key={page} className={ page === currentPage ? "current" : "hello" }>

                <button onClick={() => onPageChange(page)} type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                    {page}
                </button>
            </li>
            ))}
            {/* <li>
                <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                        <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </li>
            <li>
                <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                    1
                </button>
            </li>
            <li>
                <button type="button" className="flex justify-center rounded bg-[#C5965C] px-3.5 py-2 font-semibold text-white transition dark:bg-[#C5965C] dark:text-white-light">
                    2
                </button>
            </li>
            <li>
                <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                    3
                </button>
            </li>
            <li>
                <button type="button" className="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-[#C5965C] hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-[#C5965C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180">
                        <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </li> */}
        </ul>
      </>
    )
   }
export default Pagination;
