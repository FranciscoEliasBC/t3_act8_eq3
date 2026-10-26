import { createContext, useContext, useState } from 'react'
import { loginRequest } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // La sesión vive solo en el estado de React (useState), como pide la actividad.
  const [user, setUser] = useState(null)

  const signIn = async (credentials) => {
    const userData = await loginRequest(credentials) // lanza ApiError si falla
    setUser(userData)
    return userData
  }

  const signOut = () => setUser(null)

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
