const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tasksCtrl = require('../controllers/tasks');

router.post('/', auth, tasksCtrl.createTask);
router.get('/', auth, tasksCtrl.getTasks);
router.put('/:id', auth, tasksCtrl.updateTask);
router.delete('/:id', auth, tasksCtrl.deleteTask);

module.exports = router;
