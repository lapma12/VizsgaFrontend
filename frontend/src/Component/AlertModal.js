import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function AlertModal({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered container={document.body}>
      <Modal.Header closeButton>
        <Modal.Title>Registration Successful</Modal.Title>
      </Modal.Header>

      <Modal.Body>Your account has been created successfully!</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;
