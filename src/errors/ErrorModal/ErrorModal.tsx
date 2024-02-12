import {Dispatch, SetStateAction, useState} from "react";
import "./ErrorModal.css";

interface Props {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
}

const ErrorModal: React.FC<Props> = ({error, setError}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const closeModal = () => {
    setIsOpen(false);
    setError("");
  };

  return (
    <>
      {isOpen && (
        <div className="error-modal">
          <div className="error-modal-content">
            <p>{error}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorModal;
