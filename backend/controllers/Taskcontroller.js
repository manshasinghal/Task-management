const mongoose = require('mongoose');
const Task = require('../models/Task');


const getTasks = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    let tasks;

    if (role === 'admin') { // fetch all the tasks
      // add corresponding name and email to assignedTo and createdBy using populate method
      tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } 
    
    else if (role === 'manager') { // A manager should see tasks assigned to them and tasks assigned to their team.

      // find the task created by userID (manager) then their corresponding unique ids of their team members
      // find team mebers
      const teamMembers = await Task.find({ createdBy: userId }).distinct('assignedTo');

      // fetch tasks assigned to teamMembers and managers
      tasks = await Task.find({ assignedTo: { $in: [...teamMembers, userId] } })
        .populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } else {

      // task asigned to this userId (Users);
      tasks = await Task.find({ assignedTo: userId }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

const updateTask = async (req, res) => {
  const { status, title, description, assignedTo, dueDate } = req.body; // Fix: properly destructure all fields
  try {
    // Validate task ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    // Validate assignedTo if provided
    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: 'Invalid assignedTo user ID' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Permission checks
    if (req.user.role === 'user' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own tasks' });
    }

    if (req.user.role === 'manager' && task.createdBy.toString() !== req.user._id.toString() && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only update your team\'s or your own tasks' });
    }

    // Apply updates only if provided
    if (status) task.status = status;
    if (title) task.title = title;
    if (description !== undefined) task.description = description; // Allow empty strings
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    
    // Populate the updated task before returning
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };