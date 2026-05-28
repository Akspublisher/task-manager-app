const Task = require('../models/Task')

// GET /api/tasks?status=pending&search=work&page=1&limit=10
exports.getTasks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query
    const query = { user: req.user._id }

    if (status && ['pending', 'completed'].includes(status)) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const tasks = await Task.find(query)
     .sort({ createdAt: -1 })
     .limit(limit * 1)
     .skip((page - 1) * limit)

    const total = await Task.countDocuments(query)

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching tasks' })
  }
}

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body
    const task = await Task.create({
      user: req.user._id,
      title,
      description
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const { title, description, status } = req.body
    task.title = title || task.title
    task.description = description || task.description
    task.status = status || task.status

    const updatedTask = await task.save()
    res.json(updatedTask)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    })

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting task' })
  }
}

// PATCH /api/tasks/:id/toggle
exports.toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    task.status = task.status === 'pending'? 'completed' : 'pending'
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: 'Server error updating task' })
  }
}