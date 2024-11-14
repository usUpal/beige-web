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
      className={`h-9 rounded-md bg-black px-4 py-1 font-sans capitalize text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 md:text-[14px] ${css}`}
      onClick={onClick}
      disabled={disabled}
      {...res}
    >
      {children}
    </button>
  );
};
export default DefaultButton;
