const Button = ({
  children,
  className = ""
}) => {
  return (
    <button
      className={`
      px-8
      py-4
      rounded-full
      text-white
      transition-all
      duration-500
      hover:scale-105
      hover:shadow-xl
      ${className}
      `}
      style={{
        backgroundColor:
          "var(--color-sage)"
      }}
    >
      {children}
    </button>
  );
};

export default Button;