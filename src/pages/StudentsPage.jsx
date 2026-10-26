import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import useStudents from '../hooks/useStudents.js'
import { createStudentRequest, deleteStudentRequest, updateStudentRequest } from '../services/api.js'
import StudentsTable from '../components/StudentsTable.jsx'
import Pagination, { PAGE_SIZE_OPTIONS } from '../components/Pagination.jsx'
import StudentForm from '../components/StudentForm.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { ROLE_LABELS } from '../components/Badge.jsx'

const DEFAULT_LIMIT = 10

export default function StudentsPage() {
  const { students, setStudents, loading, error, reload } = useStudents()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawLimit = Number(searchParams.get('limit'))
  const limit = PAGE_SIZE_OPTIONS.includes(rawLimit) ? rawLimit : DEFAULT_LIMIT
  const query = searchParams.get('q') ?? ''
  const department = searchParams.get('department') ?? ''
  const role = searchParams.get('role') ?? ''
  const requestedPage = Math.max(1, parseInt(searchParams.get('page'), 10) || 1)

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase()
    return students.filter((s) => {
      const matchesText = !term || `${s.firstName} ${s.lastName} ${s.email} ${s.id}`.toLowerCase().includes(term)
      return matchesText && (!department || s.department === department) && (!role || s.role === role)
    })
  }, [students, query, department, role])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / limit))
  const page = Math.min(requestedPage, totalPages)
  const pageRows = filteredStudents.slice((page - 1) * limit, page * limit)
  const departments = useMemo(() => [...new Set(students.map((s) => s.department))].sort(), [students])

  const updateParams = useCallback(
    (changes, { replace = false } = {}) => {
      const merged = { page, limit, q: query, department, role, ...changes }
      const next = new URLSearchParams()
      Object.entries(merged).forEach(([key, value]) => {
        if (value !== '' && value != null) next.set(key, String(value))
      })
      setSearchParams(next, { replace })
    },
    [page, limit, query, department, role, setSearchParams],
  )

  useEffect(() => {
    if (loading) return
    if (!searchParams.has('page') || !searchParams.has('limit') || requestedPage !== page || rawLimit !== limit) {
      updateParams({}, { replace: true })
    }
  }, [loading, searchParams, requestedPage, page, rawLimit, limit, updateParams])

  const handleFilterChange = (changes, options) => updateParams({ ...changes, page: 1 }, options)
  const handleClearFilters = () => updateParams({ q: '', department: '', role: '', page: 1 })

  const [formState, setFormState] = useState(null) 
  const [pendingEdit, setPendingEdit] = useState(null) 
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const closeToast = useCallback(() => setToastMessage(''), [])

  const closeAllDialogs = () => {
    setFormState(null)
    setPendingEdit(null)
    setStudentToDelete(null)
    setActionError('')
  }

  const openAddForm = () => { setActionError(''); setFormState({ mode: 'add' }) }
  const openEditForm = (student) => { setActionError(''); setFormState({ mode: 'edit', student }) }
  const openDeleteDialog = (student) => { setActionError(''); setStudentToDelete(student) }

  const handleAddStudent = async (values) => {
    setBusy(true)
    setActionError('')
    try {
      await createStudentRequest(values) 
      const nextId = Math.max(0, ...students.map((s) => s.id)) + 1
      const newStudent = { ...values, id: nextId, username: values.email.split('@')[0], image: '', isLocal: true }
      setStudents((current) => [newStudent, ...current]) 
      closeAllDialogs()
      setToastMessage(`POST /users/add respondió OK. "${values.firstName} ${values.lastName}" se agregó a la tabla.`)
      updateParams({ page: 1 })
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleConfirmEdit = async () => {
    const target = formState.student
    setBusy(true)
    setActionError('')
    try {
      if (!target.isLocal) await updateStudentRequest(target.id, pendingEdit) 
      setStudents((current) => current.map((s) => (s.id === target.id ? { ...s, ...pendingEdit } : s)))
      closeAllDialogs()
      setToastMessage(target.isLocal
        ? 'Registro local actualizado en la tabla.'
        : `PUT /users/${target.id} respondió OK. Cambios reflejados en la tabla.`)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleConfirmDelete = async () => {
    const target = studentToDelete
    setBusy(true)
    setActionError('')
    try {
      if (!target.isLocal) await deleteStudentRequest(target.id) 
      setStudents((current) => current.filter((s) => s.id !== target.id))
      closeAllDialogs()
      setToastMessage(target.isLocal
        ? 'Registro local eliminado de la tabla.'
        : `DELETE /users/${target.id} respondió OK. "${target.firstName} ${target.lastName}" se quitó de la tabla.`)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const hasFilters = Boolean(query || department || role)
  const formDepartments = formState?.student && !departments.includes(formState.student.department)
    ? [...departments, formState.student.department]
    : departments

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Alumnos</h1>
          <p>{loading ? 'Cargando alumnos…' : `${students.length} alumnos registrados en el ciclo 2026-2.`}</p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={openAddForm} disabled={loading || Boolean(error)}>
          <Plus size={18} /> Nuevo alumno
        </button>
      </div>

      <section className="card">
        <div className="filters">
          <label className="input-icon filters__search">
            <Search size={18} />
            <input type="search" placeholder="Buscar por nombre, correo o control" value={query} onChange={(e) => handleFilterChange({ q: e.target.value }, { replace: true })} aria-label="Buscar alumnos" />
          </label>
          <select className="select" value={department} onChange={(e) => handleFilterChange({ department: e.target.value })} aria-label="Filtrar por carrera">
            <option value="">Carrera: Todas</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="select" value={role} onChange={(e) => handleFilterChange({ role: e.target.value })} aria-label="Filtrar por rol">
            <option value="">Rol: Todos</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button type="button" className="link-btn" onClick={handleClearFilters} disabled={!hasFilters}>Limpiar filtros</button>
        </div>

        {loading && <div className="state-msg" role="status"><span className="spinner" /> Cargando…</div>}

        {!loading && error && (
          <div className="state-msg">
            <p className="alert alert--error" role="alert">No se pudieron cargar los alumnos. {error}</p>
            <button type="button" className="btn btn--outline" onClick={reload}>Reintentar</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {pageRows.length === 0
              ? <p className="state-msg">No se encontraron alumnos con esos filtros.</p>
              : <StudentsTable students={pageRows} onEdit={openEditForm} onDelete={openDeleteDialog} />}
            <Pagination
              page={page}
              limit={limit}
              totalItems={filteredStudents.length}
              onPageChange={(newPage) => updateParams({ page: newPage })}
              onLimitChange={(newLimit) => updateParams({ limit: newLimit, page: 1 })}
            />
          </>
        )}
      </section>

      {formState && (
        <Modal title={formState.mode === 'add' ? 'Nuevo alumno' : 'Editar alumno'} onClose={busy ? () => {} : closeAllDialogs}>
          {actionError && !pendingEdit && <p className="alert alert--error modal__alert" role="alert">{actionError}</p>}
          <StudentForm
            initialStudent={formState.student}
            departments={formDepartments}
            submitLabel={formState.mode === 'add' ? 'Agregar alumno' : 'Guardar cambios'}
            submitting={busy}
            onCancel={closeAllDialogs}
            onSubmit={formState.mode === 'add' ? handleAddStudent : (values) => { setActionError(''); setPendingEdit(values) }}
          />
        </Modal>
      )}

      {pendingEdit && (
        <ConfirmDialog
          title="Confirmar edición"
          message={`¿Seguro que quieres guardar los cambios de ${formState.student.firstName} ${formState.student.lastName}?`}
          confirmLabel="Sí, guardar"
          loading={busy}
          error={actionError}
          onConfirm={handleConfirmEdit}
          onCancel={() => { setPendingEdit(null); setActionError('') }}
        />
      )}

      {studentToDelete && (
        <ConfirmDialog
          title="Confirmar eliminación"
          message={`¿Seguro que quieres eliminar a ${studentToDelete.firstName} ${studentToDelete.lastName}? Esta acción quitará el registro de la tabla.`}
          confirmLabel="Sí, eliminar"
          danger
          loading={busy}
          error={actionError}
          onConfirm={handleConfirmDelete}
          onCancel={closeAllDialogs}
        />
      )}

      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </>
  )
}
