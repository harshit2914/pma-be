const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const projectsCtrl = require('../controllers/projects');

router.post('/', auth, requireRole('Admin'), projectsCtrl.createProject);
router.get('/', auth, projectsCtrl.getProjects);
router.get('/:id', auth, projectsCtrl.getProject);
router.put('/:id', auth, projectsCtrl.updateProject);
router.delete('/:id', auth, requireRole('Admin'), projectsCtrl.deleteProject);

module.exports = router;
