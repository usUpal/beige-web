type DefaultButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    css?: string
};

const DefaultButton: React.FC<DefaultButtonProps> = ({ children, onClick, css }) => {
    return (
        <button
            className={`capitalize bg-black rounded-md py-1 h-9 text-white px-4 ${css}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
export default DefaultButton;