import { useCallback, useEffect, useState } from 'react'
import { getAllStudents } from '../services/api.js'

export default function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setStudents(await getAllStudents())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  return { students, setStudents, loading, error, reload: loadStudents }
}
