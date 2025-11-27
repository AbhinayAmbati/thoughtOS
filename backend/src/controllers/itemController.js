import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const saveItems = async (req, res) => {
  try {
    const { tasks, projects } = req.body;
    
    const savedResults = {
      tasks: [],
      projects: []
    };

    if (projects && Array.isArray(projects) && projects.length > 0) {
      // Ensure wireframes have required fields if missing
      const sanitizedProjects = projects.map(p => ({
        ...p,
        wireframes: p.wireframes?.map(wf => ({
          ...wf,
          elements: wf.elements?.map(el => {
            if (typeof el === 'string') {
              return { type: 'text', content: el, x: 0, y: 0, width: 100, height: 40 };
            }
            // Ensure required fields exist
            return {
              type: el.type || 'container',
              content: el.content || '',
              x: el.x || 0,
              y: el.y || 0,
              width: el.width || 100,
              height: el.height || 40,
              style: el.style || {},
              id: el.id || Math.random().toString(36).substr(2, 9)
            };
          })
        }))
      }));
      console.log("Saving Projects:", JSON.stringify(sanitizedProjects, null, 2));
      const projectDocs = await Project.insertMany(sanitizedProjects);
      savedResults.projects = projectDocs;
    }

    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      const taskDocs = await Task.insertMany(tasks);
      savedResults.tasks = taskDocs;
    }

    res.status(201).json({ success: true, data: savedResults });
  } catch (error) {
    console.error("Error saving items:", error);
    // Log validation errors specifically
    if (error.name === 'ValidationError') {
      console.error("Validation Error Details:", JSON.stringify(error.errors, null, 2));
    }
    res.status(500).json({ message: 'Server Error', error: error.message, details: error.errors });
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
