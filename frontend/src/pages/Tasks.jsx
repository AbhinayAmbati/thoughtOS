import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, Edit2, X, MoreVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/items/dashboard');
            setTasks(response.data.tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Optimistic update
        const updatedTasks = tasks.map(t =>
            t._id === draggableId ? { ...t, status: destination.droppableId } : t
        );
        setTasks(updatedTasks);

        // API call
        try {
            await axios.patch(`http://localhost:5000/api/items/tasks/${draggableId}/status`, {
                status: destination.droppableId
            });
        } catch (error) {
            console.error("Error updating task status:", error);
            fetchTasks(); // Revert on error
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/items/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setCurrentTask(task);
            setFormData({ title: task.title, description: task.description || '', priority: task.priority, status: task.status });
        } else {
            setCurrentTask(null);
            setFormData({ title: '', description: '', priority: 'Medium', status: 'Todo' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTask) {
                const response = await axios.put(`http://localhost:5000/api/items/tasks/${currentTask._id}`, formData);
                setTasks(tasks.map(t => t._id === currentTask._id ? response.data : t));
            } else {
                const response = await axios.post('http://localhost:5000/api/items/tasks', formData);
                setTasks([response.data, ...tasks]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    const columns = {
        Todo: { title: 'To Do', color: 'bg-gray-100', dot: 'bg-gray-400' },
        Doing: { title: 'In Progress', color: 'bg-blue-50', dot: 'bg-blue-500' },
        Done: { title: 'Done', color: 'bg-green-50', dot: 'bg-green-500' }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8 overflow-x-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
                        <p className="text-gray-500">Drag and drop tasks to manage progress.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> New Task
                    </button>
                </header>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex gap-6 h-[calc(100vh-12rem)] min-w-[1000px]">
                            {Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="flex-1 flex flex-col bg-gray-100/50 rounded-2xl border border-gray-200/60">
                                    <div className="p-4 flex items-center justify-between border-b border-gray-200/60 bg-white rounded-t-2xl">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${column.dot}`} />
                                            <h3 className="font-bold text-gray-700">{column.title}</h3>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                                {tasks.filter(t => t.status === columnId).length}
                                            </span>
                                        </div>
                                    </div>

                                    <Droppable droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                                                    }`}
                                            >
                                                {tasks
                                                    .filter(task => task.status === columnId)
                                                    .map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg ring-2 ring-blue-500/20' : ''
                                                                        }`}
                                                                    onClick={() => handleOpenModal(task)}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                                                                task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                                                                    'bg-blue-50 text-blue-600'
                                                                            }`}>
                                                                            {task.priority}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => handleDelete(task._id, e)}
                                                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                                                                    {task.description && (
                                                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                                                                    )}
                                                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                                        <div className="text-xs text-gray-400">
                                                                            {new Date(task.createdAt).toLocaleDateString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                )}
            </main>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{currentTask ? 'Edit Task' : 'New Task'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="Todo">Todo</option>
                                        <option value="Doing">Doing</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                >
                                    {currentTask ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
