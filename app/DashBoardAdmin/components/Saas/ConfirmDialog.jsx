'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react';
import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) {
  const { isOpen: isVisible, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [isOpen, onOpen, onClose]);

  const handleClose = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal 
      isOpen={isVisible} 
      onClose={handleClose}
      classNames={{
        base: "max-w-md",
        header: "border-b-1 border-gray-200",
        footer: "border-t-1 border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-yellow-600">
            <FiAlertTriangle className="w-5 h-5" />
            <span className="text-lg font-semibold">{title}</span>
          </div>
        </ModalHeader>
        
        <ModalBody className="py-4">
          <p className="text-gray-600">{message}</p>
        </ModalBody>
        
        <ModalFooter className="flex justify-end gap-2">
          <Button 
            variant="bordered" 
            onClick={handleClose}
            className="hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button 
            color="danger" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}