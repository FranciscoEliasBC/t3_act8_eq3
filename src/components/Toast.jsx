import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div className="toast" role="status">
      <CheckCircle2 size={20} />
      <p>{message}</p>
      <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar aviso"><X size={16} /></button>
    </div>
  )
}
