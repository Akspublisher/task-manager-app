import axios from 'axios'

const API = axios.create({
 // baseURL: 'http://localhost:5000/api'
 // baseURL: 'https://task-manager-app-3jjk.onrender.com/api'
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Add JWT to every request if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data)
}

export const taskAPI = {
  getTasks: (params) => API.get('/tasks', { params }),
  createTask: (data) => API.post('/tasks', data),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  toggleTask: (id) => API.patch(`/tasks/${id}/toggle`)
}

export default API
