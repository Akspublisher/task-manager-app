import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const TaskForm = ({ onCreate }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await onCreate(data)
      reset()
      toast.success('Task created')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="font-semibold mb-3">Create New Task</h3>
      <div className="space-y-3">
        <div>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Task title"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows="2"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Task
        </button>
      </div>
    </form>
  )
}

export default TaskForm