import Modal from "./Modal";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmVariant = "default", isBusy = false, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      footer={[
        <button
          key="cancel"
          type="button"
          onClick={onClose}
          className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]"
        >
          {cancelLabel}
        </button>,
        <button
          key="confirm"
          type="button"
          disabled={isBusy}
          onClick={onConfirm}
          className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${
            confirmVariant === "danger" ? "bg-[#a44d31]" : "bg-[#314131]"
          }`}
        >
          {isBusy ? "Please wait..." : confirmLabel}
        </button>,
      ]}
    >
      <p className="text-sm leading-7 text-[#4f5a52]">This action updates live backend data. Please confirm before continuing.</p>
    </Modal>
  );
}