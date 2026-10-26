import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="alumnos" element={<StudentsPage />} />
        <Route path="cursos" element={<PlaceholderPage title="Cursos" description="Módulo simulado: aquí irían los cursos del ciclo escolar." />} />
        <Route path="reportes" element={<PlaceholderPage title="Reportes" description="Módulo simulado: aquí irían las gráficas y reportes." />} />
        <Route path="configuracion" element={<PlaceholderPage title="Configuración" description="Módulo simulado: aquí irían las preferencias del sistema." />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
