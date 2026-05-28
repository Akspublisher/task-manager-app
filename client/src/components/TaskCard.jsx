import { useState } from 'react'
import toast from 'react-hot-toast'

const TaskCard = ({ task, onUpdate, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')

  const handleUpdate = async () => {
    if (!title.trim()) return toast.error('Title required')
    await onUpdate(task._id, { title, description })
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            rows="2"
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => onToggle(task._id)}
              className="mt-1 w-5 h-5 cursor-pointer"
            />
            <div className="flex-1">
              <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 text-sm">
              Edit
            </button>
            <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard