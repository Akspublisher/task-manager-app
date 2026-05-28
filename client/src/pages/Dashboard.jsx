import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { taskAPI } from '../services/api'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
  const { logout, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filter !== 'all') params.status = filter
      if (search) params.search = search
      
      const res = await taskAPI.getTasks(params)
      setTasks(res.data.tasks)
    } catch (err) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filter, search])

  const handleCreate = async (data) => {
    await taskAPI.createTask(data)
    fetchTasks()
  }

  const handleUpdate = async (id, data) => {
    try {
      await taskAPI.updateTask(id, data)
      toast.success('Task updated')
      fetchTasks()
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await taskAPI.deleteTask(id)
      toast.success('Task deleted')
      fetchTasks()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleToggle = async (id) => {
    try {
      await taskAPI.toggleTask(id)
      fetchTasks()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Task Manager</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <TaskForm onCreate={handleCreate} />

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-2">
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded capitalize ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {f} {f !== 'all' && `(${stats[f]})`}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-sm text-gray-600">
            Showing {tasks.length} tasks | {stats.completed} completed, {stats.pending} pending
          </p>
        </div>

        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No tasks found. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard