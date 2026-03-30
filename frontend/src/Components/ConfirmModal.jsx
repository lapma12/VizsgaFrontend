import React from "react";
import "../Styles/SharedMessages.css";

export default function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmDanger = false,
  children,
  showProgress = true,
}) {
  if (!open) return null;

  return (
    <div className="shared-modal-overlay" onClick={onCancel}>
      <div className="shared-modal" onClick={(e) => e.stopPropagation()}>
        <p className="shared-modal__message">{message}</p>
        {children && <div className="shared-modal__body">{children}</div>}
        <div className="shared-modal__actions">
          <button
            type="button"
            className="shared-modal__btn shared-modal__btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`shared-modal__btn ${confirmDanger ? "shared-modal__btn--danger" : "shared-modal__btn--confirm"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
        {showProgress && <div className="shared-modal__progress" />}
      </div>
    </div>
  );
}
