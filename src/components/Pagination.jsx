import { ChevronLeft, ChevronRight } from 'lucide-react'

export const PAGE_SIZE_OPTIONS = [10, 20, 40, 50]

function getVisiblePages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ['...', page] : [page]))
}

export default function Pagination({ page, limit, totalItems, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, totalItems)

  return (
    <div className="pagination">
      <label className="pagination__limit">
        Mostrar
        <select className="select select--sm" value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
          {PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        registros por página
      </label>

      <p className="pagination__summary">Mostrando {from} a {to} de {totalItems} alumnos</p>

      <nav className="pagination__pages" aria-label="Paginación">
        <button type="button" className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Página anterior">
          <ChevronLeft size={16} />
        </button>
        {getVisiblePages(page, totalPages).map((item, index) =>
          item === '...' ? (
            <span key={`gap-${index}`} className="pagination__gap">…</span>
          ) : (
            <button key={item} type="button" className={`page-btn${item === page ? ' is-active' : ''}`} onClick={() => onPageChange(item)} aria-current={item === page ? 'page' : undefined}>
              {item}
            </button>
          ),
        )}
        <button type="button" className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Página siguiente">
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}
