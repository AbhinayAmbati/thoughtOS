import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Plus, Trash2, Edit2, X, MoreVertical } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'Planning', techStack: '', features: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/items/dashboard');
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent navigation if clicked on card
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/items/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleOpenModal = (project = null, e = null) => {
        if (e) e.preventDefault();
        if (project) {
            setCurrentProject(project);
            setFormData({
                name: project.name,
                description: project.description || '',
                status: project.status,
                techStack: project.techStack ? project.techStack.join(', ') : '',
                features: project.features ? project.features.join(', ') : ''
            });
        } else {
            setCurrentProject(null);
            setFormData({ name: '', description: '', status: 'Planning', techStack: '', features: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = {
            ...formData,
            techStack: formData.techStack.split(',').map(item => item.trim()).filter(Boolean),
            features: formData.features.split(',').map(item => item.trim()).filter(Boolean)
        };

        try {
            if (currentProject) {
                const response = await axios.put(`http://localhost:5000/api/items/projects/${currentProject._id}`, projectData);
                setProjects(projects.map(p => p._id === currentProject._id ? response.data : p));
            } else {
                const response = await axios.post('http://localhost:5000/api/items/projects', projectData);
                setProjects([response.data, ...projects]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-500">Your active projects and roadmaps.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </header>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link to={`/projects/${project._id}`} key={project._id} className="block group relative">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {project.status}
                                            </span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button
                                                    onClick={(e) => handleOpenModal(project, e)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(project._id, e)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{project.description}</p>

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Tech Stack</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.slice(0, 4).map((tech, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {project.features && project.features.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Features</h4>
                                            <ul className="space-y-1">
                                                {project.features.slice(0, 3).map((feature, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                                        <span className="truncate">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {project.wireframes && project.wireframes.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                                <LayoutDashboard className="w-3 h-3" />
                                                Wireframes
                                            </h4>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                {project.wireframes.map((wf, wIdx) => (
                                                    <div key={wIdx} className="min-w-[140px] bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col gap-2">
                                                        <div className="text-[10px] font-bold text-center text-gray-700 border-b border-gray-200 pb-1 truncate">
                                                            {wf.screenName}
                                                        </div>
                                                        <div className="flex-1 space-y-1 bg-white p-1 rounded border border-gray-100 min-h-[60px]">
                                                            {/* Simple preview for now */}
                                                            <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center text-[9px] text-gray-400">
                                                                Preview
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
                                No projects found. Start by creating one in the Thought Stream!
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{currentProject ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="React, Node.js, MongoDB..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (comma separated)</label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                    placeholder="User Authentication, Dashboard, Payment Gateway..."
                                />
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
                                    {currentProject ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
