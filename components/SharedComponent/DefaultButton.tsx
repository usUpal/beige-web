type DefaultButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    css?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
};

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, css, disabled, type }) => {
    return (
        <button
            className={`capitalize bg-black rounded-md py-1 h-9 text-white px-4 font-sans text-[14px] cursor-pointer ${css}`}
            onClick={onClick}
            // type="submit"
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
};
export default DefaultButton;