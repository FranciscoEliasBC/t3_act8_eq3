import { useState } from 'react'
import { ROLE_LABELS } from './Badge.jsx'

const EMPTY_FORM = { firstName: '', lastName: '', email: '', age: '', department: '', role: 'user' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateStudent(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'El nombre es obligatorio.'
  if (!values.lastName.trim()) errors.lastName = 'El apellido es obligatorio.'
  if (!values.email.trim()) errors.email = 'El correo es obligatorio.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Escribe un correo válido (ej. nombre@escuela.mx).'
  const age = Number(values.age)
  if (values.age === '') errors.age = 'La edad es obligatoria.'
  else if (!Number.isInteger(age) || age < 15 || age > 99) errors.age = 'La edad debe estar entre 15 y 99 años.'
  if (!values.department) errors.department = 'Selecciona una carrera.'
  return errors
}

export default function StudentForm({ initialStudent, departments, submitLabel, submitting = false, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialStudent ? { ...initialStudent, age: String(initialStudent.age) } : EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateStudent(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit({
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      age: Number(values.age),
    })
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`student-${name}`}>{label}</label>
      <input id={`student-${name}`} name={name} className={`input${errors[name] ? ' has-error' : ''}`} value={values[name]} onChange={handleChange} {...props} />
      {errors[name] && <p className="field__error" role="alert">{errors[name]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal__body form-grid">
        {field('firstName', 'Nombre')}
        {field('lastName', 'Apellido')}
        <div className="form-grid__full">{field('email', 'Correo electrónico', { type: 'email' })}</div>
        {field('age', 'Edad', { type: 'number', min: 15, max: 99 })}
        <div className="field">
          <label htmlFor="student-role">Rol</label>
          <select id="student-role" name="role" className="select" value={values.role} onChange={handleChange}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field form-grid__full">
          <label htmlFor="student-department">Carrera</label>
          <select id="student-department" name="department" className={`select${errors.department ? ' has-error' : ''}`} value={values.department} onChange={handleChange}>
            <option value="">Selecciona una carrera…</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
          {errors.department && <p className="field__error" role="alert">{errors.department}</p>}
        </div>
      </div>
      <footer className="modal__footer">
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Guardando…' : submitLabel}</button>
      </footer>
    </form>
  )
}
