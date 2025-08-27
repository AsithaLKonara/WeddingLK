import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      type: 'default',
      ...toastData,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, newToast.duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  }
}
