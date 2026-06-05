const Button = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      className={`
        px-8
        py-4
        rounded-full
        text-white
        transition
        ${className}
      `}
      style={{
        background: "var(--color-sage)"
      }}
    >
      {children}
    </button>
  );
};

export default Button;