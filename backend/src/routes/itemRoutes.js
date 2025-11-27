import express from 'express';
import { saveItems, getDashboardData, updateTaskStatus, getProjectById, createTask, updateTask, deleteTask, createProject, updateProject, deleteProject } from '../controllers/itemController.js';

const router = express.Router();

router.post('/save', saveItems);
router.get('/dashboard', getDashboardData);
router.get('/projects/:id', getProjectById);
router.patch('/tasks/:id/status', updateTaskStatus);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;
