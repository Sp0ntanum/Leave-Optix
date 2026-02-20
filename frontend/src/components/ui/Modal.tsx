import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmDisabled = false,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
