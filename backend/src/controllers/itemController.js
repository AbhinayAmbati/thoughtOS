import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const saveItems = async (req, res) => {
  try {
    const { tasks, projects } = req.body;
    
    const savedResults = {
      tasks: [],
      projects: []
    };

    if (projects && projects.length > 0) {
      const projectDocs = await Project.insertMany(projects);
      savedResults.projects = projectDocs;
    }

    if (tasks && tasks.length > 0) {
      // If tasks are linked to projects (by name in the thought), we might need logic here.
      // For now, we just save them.
      const taskDocs = await Task.insertMany(tasks);
      savedResults.tasks = taskDocs;
    }

    res.status(201).json({ success: true, data: savedResults });
  } catch (error) {
    console.error("Error saving items:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // Simple stats
    const stats = {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'Todo').length,
      activeProjects: projects.filter(p => p.status === 'Active').length
    };

    res.json({ tasks, projects, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// CRUD for Tasks
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// CRUD for Projects
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
