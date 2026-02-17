import React from "react";
import "../Styles/SharedMessages.css";

/**
 * Egységes success/error toast – minden oldalon ugyanúgy néz ki.
 * message: string (támogatja a HTML-t ha html a true)
 */
export default function Toast({ type = "success", message, onClose, html }) {
  if (!message) return null;

  return (
    <div
      className={`shared-toast shared-toast--${type}`}
      role="alert"
    >
      <span className="shared-toast__text">
        {html ? (
          <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
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
    </div>
  );
}
