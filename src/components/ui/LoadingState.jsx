export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="rounded-[28px] border border-[#efe7dc] bg-[#fcf7f1] px-6 py-12 text-center text-sm text-[#586257]">
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[28px] border border-[#efc6b8] bg-[#fff4f1] px-6 py-8 text-center text-sm text-[#8f3e27]">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-4 rounded-full bg-[#314131] px-5 py-3 font-semibold text-white">
          Try again
        </button>
      ) : null}
    </div>
  );
}