type DefaultButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  css?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, css, disabled, ...res }) => {
  return (
    <button
      // className={`h-9 rounded-md bg-black px-4 py-1 font-sans capitalize text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:text-[14px] ${css}`}
      className={`rounded-md bg-[#000000] px-4 py-1 font-sans capitalize
        text-white hover:bg-gray-800 dark:bg-[#1b2e4b]
        dark:text-slate-300 dark:hover:bg-[#2a2e3e] hover:dark:text-slate-50 md:text-[14px]
        ${css}`}
      onClick={onClick}
      disabled={disabled}
      {...res}
    >
      {children}
    </button>
  );
};
export default DefaultButton;
