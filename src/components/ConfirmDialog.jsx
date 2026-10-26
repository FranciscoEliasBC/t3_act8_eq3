import Modal from './Modal.jsx'

export default function ConfirmDialog({ title, message, confirmLabel, danger = false, loading = false, error = '', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={loading ? () => {} : onCancel} level={2}>
      <div className="modal__body">
        <p>{message}</p>
        {error && <p className="alert alert--error" role="alert">{error}</p>}
      </div>
      <footer className="modal__footer">
        <button type="button" className="btn btn--outline" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="button" className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando…' : confirmLabel}
        </button>
      </footer>
    </Modal>
  )
}
