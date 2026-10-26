import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Avatar from './Avatar.jsx'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    navigate('/login', { replace: true })
    signOut()
  }

  return (
    <header className="navbar">
      <label className="navbar__search">
        <Search size={18} />
        <input type="search" placeholder="Buscar alumno o curso" aria-label="Buscar alumno o curso" />
      </label>

      <div className="navbar__right">
        <button type="button" className="icon-btn navbar__bell" aria-label="Notificaciones">
          <Bell size={20} />
          <span className="navbar__dot" />
        </button>
        <span className="navbar__divider" />
        <div className="navbar__user">
          <div className="navbar__user-text">
            <strong>{user.firstName} {user.lastName}</strong>
            <span>@{user.username}</span>
          </div>
          <Avatar src={user.image} name={`${user.firstName} ${user.lastName}`} size={40} />
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={handleSignOut}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </header>
  )
}
