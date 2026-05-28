const router = require('express').Router()
const { body } = require('express-validator')
const { protect } = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validateRequest')
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} = require('../controllers/taskController')

router.use(protect) // All routes below are protected

router.route('/')
 .get(getTasks)
 .post([
    body('title').notEmpty().withMessage('Title is required'),
    body('title').isLength({ max: 100 }).withMessage('Title max 100 chars')
  ], validateRequest, createTask)

router.route('/:id')
 .put([
    body('title').optional().isLength({ max: 100 }).withMessage('Title max 100 chars'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status')
  ], validateRequest, updateTask)
 .delete(deleteTask)

router.patch('/:id/toggle', toggleTaskStatus)

module.exports = router