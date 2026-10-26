import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, BookOpen, GraduationCap, Home, LogOut, SlidersHorizontal, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const MENU_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/alumnos', label: 'Alumnos', icon: Users },
  { to: '/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/configuracion', label: 'Configuración', icon: SlidersHorizontal },
]

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    navigate('/login', { replace: true })
    signOut()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="logo-box"><GraduationCap size={22} /></span>
        <span className="sidebar__brand-name">Sistema Escolar</span>
      </div>

      <nav className="sidebar__nav" aria-label="Menú principal">
        {MENU_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__link sidebar__logout" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
