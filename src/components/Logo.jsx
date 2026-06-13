const Logo = () => {
  return (
    <>
      <a href="/" className="flex items-center gap-3">
        <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 8 C58 6 72 18 76 34 C80 50 72 66 58 74 C44 82 26 78 16 66 C6 54 6 36 16 24 C24 14 32 9 40 8 Z"
            fill="none"
            stroke="#6B4E45"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M42 10 C59 9 73 22 76 38 C79 54 70 68 57 75 C44 82 27 78 17 67 C7 56 7 38 17 26 C25 15 33 10 42 10 Z"
            fill="none"
            stroke="#8B5E4A"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".6"
          />
        </svg>

        <span
          className="text-3xl"
          style={{
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Circlia
        </span>
      </a>
    </>
  );
};

export default Logo;
