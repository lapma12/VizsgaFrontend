import React, { useEffect } from "react";
import "../Styles/SharedMessages.css";

export default function Toast({
  type = "success",
  message,
  onClose,
  html,
  variant,
}) {
  // Automatikus bezárás: ha van progress csík (variant),
  // a csík animációjának végén hívjuk az onClose-ot.
  useEffect(() => {
    if (!message || !onClose || !variant) return;

    // időzítés szinkronban a CSS animációval (1.8s)
    const timeout = setTimeout(() => {
      onClose();
    }, 1800);

    return () => clearTimeout(timeout);
  }, [message, onClose, variant]);

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

      {variant && (
        <div
          className={`shared-toast__progress shared-toast__progress--${variant}`}
        />
      )}
    </div>
  );
}
