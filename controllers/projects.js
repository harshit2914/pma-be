const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const project = await Project.create({ name, description, createdBy: req.user._id, members: members || [] });
    res.status(201).json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    // Members see projects where they are member or createdBy, Admin sees all
    const user = req.user;
    let query = {};
    if (user.role === 'Member') {
      query = { $or: [{ members: user._id }, { createdBy: user._id }] };
    }
    const projects = await Project.find(query).populate('createdBy', 'name email').populate('members', 'name email');
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    // Only creator or Admin can update
    if (String(project.createdBy) !== String(req.user._id) && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { name, description, members } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (members !== undefined) project.members = members;
    await project.save();
    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (String(project.createdBy) !== String(req.user._id) && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
