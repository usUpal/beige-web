type DefaultButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    css?: string;
    disabled?: boolean;
};

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, css, disabled }) => {
    return (
        <button
            className={`capitalize bg-black rounded-md py-1 h-9 text-white px-4 font-sans text-[14px] ${css}`}
            onClick={onClick}
            type="submit"
            disabled={disabled}
        >
            {children}
        </button>
    );
};
export default DefaultButton;