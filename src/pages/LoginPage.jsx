import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

function validateCredentials({ username, password }) {
  const errors = {}
  if (!username.trim()) errors.username = 'Ingresa tu usuario.'
  else if (username.trim().length < 3) errors.username = 'El usuario debe tener al menos 3 caracteres.'
  if (!password) errors.password = 'Ingresa tu contraseña.'
  else if (password.length < 4) errors.password = 'La contraseña debe tener al menos 4 caracteres.'
  return errors
}

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search ?? ''}`
    : '/'

  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={redirectTo} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setServerError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateCredentials(credentials)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return // no se hace la petición

    setLoading(true)
    setServerError('')
    try {
      await signIn({ username: credentials.username.trim(), password: credentials.password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      // DummyJSON responde 400 cuando las credenciales son incorrectas
      setServerError(err.status === 400 ? 'Usuario o contraseña incorrectos.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="login__hero" aria-hidden="true">
        <div className="login__rings">
          <span className="ring ring--1" /><span className="ring ring--2" /><span className="ring ring--3" />
          <GraduationCap size={120} strokeWidth={1.6} />
          <i className="dot dot--amber-lg" /><i className="dot dot--amber-sm" /><i className="dot dot--light-a" /><i className="dot dot--light-b" />
        </div>
        <h2>Todo tu ciclo escolar,<br /><em>en un solo lugar.</em></h2>
        <p>Consulta alumnos, cursos y reportes desde cualquier equipo.</p>
      </section>

      <section className="login__panel">
        <form className="card login__card" onSubmit={handleSubmit} noValidate>
          <span className="logo-box logo-box--lg"><GraduationCap size={26} /></span>
          <h1>Inicia sesión</h1>
          <p className="login__subtitle">Ingresa con tu usuario institucional.</p>

          {serverError && <p className="alert alert--error" role="alert">{serverError}</p>}

          <div className="field">
            <label htmlFor="username">Usuario o correo</label>
            <div className={`input-icon${errors.username ? ' has-error' : ''}`}>
              <User size={18} />
              <input id="username" name="username" autoComplete="username" placeholder="emilys" value={credentials.username} onChange={handleChange} />
            </div>
            {errors.username && <p className="field__error" role="alert">{errors.username}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className={`input-icon${errors.password ? ' has-error' : ''}`}>
              <Lock size={18} />
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••••" value={credentials.password} onChange={handleChange} />
              <button type="button" className="icon-btn" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="field__error" role="alert">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>

          <p className="login__hint">Prueba con <code>emilys</code> / <code>emilyspass</code></p>
        </form>
      </section>
    </div>
  )
}
