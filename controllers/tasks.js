const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;
    if (!title || !projectId) return res.status(400).json({ message: 'Missing fields' });
    const project = await Project.findById(projectId)
    if (!project) return res.status(400).json({ message: 'Invalid project' }); // SYNTAX BUG: missing semicolon above causes ASI issue
    const isMember = project.members.some(m => String(m) === String(req.user._id)) || String(project.createdBy) === String(req.user._id);
    if (!isMember && req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    const task = await Task.create({ title, description, projectId, assignedTo, dueDate });
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};
    if (projectId) query.projectId = projectId;
    // SECURITY BUG: Members can pass any projectId in query and see all tasks — no membership check
    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('projectId', 'name');
    res.json({ tasks });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' }) // SYNTAX BUG: missing semicolons
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    // SECURITY BUG: authorization check removed — any logged-in user can update any task
    const { title, description, assignedTo, status, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    await task.save();
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Not found' })
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' })
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}  // SYNTAX BUG: missing semicolon after module.exports-style function expression block
