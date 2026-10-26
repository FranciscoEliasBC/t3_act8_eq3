import { Pencil, Trash2 } from 'lucide-react'
import Avatar from './Avatar.jsx'
import RoleBadge from './Badge.jsx'

export default function StudentsTable({ students, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Número de control</th>
            <th>Carrera</th>
            <th>Edad</th>
            <th>Rol</th>
            <th className="table__actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const fullName = `${student.firstName} ${student.lastName}`
            return (
              <tr key={student.id}>
                <td>
                  <div className="student-cell">
                    <Avatar src={student.image} name={fullName} />
                    <div>
                      <strong>{fullName}</strong>
                      <span>{student.email}</span>
                    </div>
                  </div>
                </td>
                <td>{String(student.id).padStart(6, '0')}</td>
                <td>{student.department}</td>
                <td>{student.age}</td>
                <td><RoleBadge role={student.role} /></td>
                <td className="table__actions-col">
                  <div className="row-actions">
                    <button type="button" className="icon-btn" onClick={() => onEdit(student)} aria-label={`Editar a ${fullName}`} title="Editar"><Pencil size={16} /></button>
                    <button type="button" className="icon-btn icon-btn--danger" onClick={() => onDelete(student)} aria-label={`Eliminar a ${fullName}`} title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
