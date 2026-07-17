export default function Modal({ open, title, description, children, footer, onClose, size = "md" }) {
  if (!open) {
    return null;
  }

  const sizeClass = size === "lg" ? "max-w-4xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1e261f]/45 px-4 py-8 backdrop-blur-sm">
      <div className={`w-full ${sizeClass} rounded-[32px] border border-[#e7ddcf] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)] md:p-8`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#243224]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {title}
            </h2>
            {description ? <p className="mt-2 text-sm leading-6 text-[#5c665e]">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#e3d7ca] px-3 py-1 text-sm font-semibold text-[#314131]">
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}