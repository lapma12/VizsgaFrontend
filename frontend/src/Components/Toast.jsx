import React, { useEffect } from "react";
import "../Styles/SharedMessages.css";

export default function Toast({
  type = "success",
  message,
  onClose,
  html,
}) {
  useEffect(() => {
    if (!message || !onClose) return;

    const timeout = setTimeout(() => {
      onClose();
    }, 1800);

    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`shared-toast shared-toast--${type}`} role="alert">
      <span className="shared-toast__text">
        {html ? (
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ) : (
          message
        )}
      </span>
      <button
        type="button"
        className="shared-toast__btn"
        onClick={onClose}
        aria-label="Close"
      >
        OK
      </button>

      <div className="shared-toast__progress" />
    </div>
  );
}
