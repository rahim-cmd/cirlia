const STATUS_STYLES = {
  approved: "bg-[#edf7ef] text-[#255135] border-[#c9e2d0]",
  pending: "bg-[#fff6e7] text-[#7b5a1a] border-[#efddb3]",
  rejected: "bg-[#fff1ed] text-[#9d4327] border-[#efc6b8]",
  cancelled: "bg-[#f3f1ef] text-[#6c625a] border-[#ddd5cf]",
  active: "bg-[#eef6f0] text-[#2d5f3a] border-[#c7dccd]",
  updated: "bg-[#ecf5ff] text-[#24507f] border-[#c7dbf0]",
  unavailable: "bg-[#fff4e8] text-[#8a561d] border-[#ecd3b6]",
  expired: "bg-[#f2f1f0] text-[#6a6660] border-[#d8d4cf]",
  synced: "bg-[#edf7ef] text-[#255135] border-[#c9e2d0]",
  unsynced: "bg-[#fff1ed] text-[#9d4327] border-[#efc6b8]",
  enabled: "bg-[#edf7ef] text-[#255135] border-[#c9e2d0]",
  disabled: "bg-[#fff1ed] text-[#9d4327] border-[#efc6b8]",
  public: "bg-[#edf7ef] text-[#255135] border-[#c9e2d0]",
  private: "bg-[#f3f1ef] text-[#6c625a] border-[#ddd5cf]",
  default: "bg-[#f5f2ee] text-[#314131] border-[#ddd5cf]",
};

export default function StatusBadge({ status, className = "" }) {
  const normalizedStatus = String(status || "default").toLowerCase();
  const style = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.default;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[2px] ${style} ${className}`.trim()}>
      {normalizedStatus}
    </span>
  );
}