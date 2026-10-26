import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, BookOpen, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getRecentStudents } from '../services/api.js'
import StatCard from '../components/StatCard.jsx'
import Avatar from '../components/Avatar.jsx'
import RoleBadge from '../components/Badge.jsx'

export default function HomePage() {
  const { user } = useAuth()
  const [recent, setRecent] = useState({ students: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRecentStudents(5)
      .then(setRecent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hola, {user.firstName}</h1>
          <p>Resumen del ciclo escolar 2026-2.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} label="Alumnos inscritos" value={loading ? '…' : recent.total} note="Datos reales desde la API" />
        <StatCard icon={BookOpen} label="Cursos activos" value="36" note="4 por iniciar (simulado)" />
        <StatCard icon={BarChart3} label="Promedio general" value="8.7" note="+0.2 vs. ciclo anterior (simulado)" />
      </div>

      <section className="card">
        <h2 className="card__title">Alumnos recientes</h2>
        {loading && <p className="state-msg">Cargando…</p>}
        {error && <p className="alert alert--error state-msg" role="alert">{error}</p>}
        {!loading && !error && (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Alumno</th><th>Número de control</th><th>Carrera</th><th>Rol</th></tr></thead>
              <tbody>
                {recent.students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="student-cell">
                        <Avatar src={s.image} name={`${s.firstName} ${s.lastName}`} />
                        <div><strong>{s.firstName} {s.lastName}</strong><span>{s.email}</span></div>
                      </div>
                    </td>
                    <td>{String(s.id).padStart(6, '0')}</td>
                    <td>{s.department}</td>
                    <td><RoleBadge role={s.role} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="card__footer">
          <Link to="/alumnos" className="btn btn--outline">Ver todos los alumnos</Link>
        </div>
      </section>
    </>
  )
}
