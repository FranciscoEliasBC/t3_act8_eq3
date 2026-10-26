const BASE_URL = 'https://dummyjson.com'

const STUDENT_FIELDS = 'id,firstName,lastName,username,email,age,image,role,company'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError('No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.message || `El servidor respondió con error ${response.status}.`, response.status)
  }
  return data
}

export function toStudent(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    age: user.age,
    image: user.image,
    role: user.role ?? 'user',
    department: user.company?.department ?? 'Sin asignar',
  }
}

const toPayload = (student) => ({
  firstName: student.firstName,
  lastName: student.lastName,
  email: student.email,
  age: student.age,
  role: student.role,
  company: { department: student.department },
})

export function loginRequest({ username, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  })
}

export async function getAllStudents() {
  const data = await request(`/users?limit=0&select=${STUDENT_FIELDS}`)
  return data.users.map(toStudent)
}

export async function getRecentStudents(limit = 5) {
  const data = await request(`/users?limit=${limit}&select=${STUDENT_FIELDS}`)
  return { students: data.users.map(toStudent), total: data.total }
}

export const createStudentRequest = (student) =>
  request('/users/add', { method: 'POST', body: JSON.stringify(toPayload(student)) })

export const updateStudentRequest = (id, student) =>
  request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(student)) })

export const deleteStudentRequest = (id) => request(`/users/${id}`, { method: 'DELETE' })
