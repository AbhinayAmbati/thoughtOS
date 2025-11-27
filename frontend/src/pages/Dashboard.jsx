import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, CheckCircle, Folder, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [data, setData] = useState({ tasks: [], projects: [], stats: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items/dashboard');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back to your digital brain.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Total Tasks</h3>
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{data.stats.totalTasks || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Active Projects</h3>
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Folder className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{data.stats.activeProjects || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Pending Tasks</h3>
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{data.stats.pendingTasks || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Tasks */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Tasks</h3>
                        <div className="space-y-3">
                            {data.tasks.slice(0, 5).map((task) => (
                                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' :
                                            task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} />
                                        <span className="font-medium text-gray-700">{task.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 capitalize">{task.status}</span>
                                </div>
                            ))}
                            {data.tasks.length === 0 && <p className="text-gray-400 text-center py-4">No tasks yet.</p>}
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Projects</h3>
                        <div className="space-y-4">
                            {data.projects.slice(0, 3).map((project) => (
                                <div key={project._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                                    <div className="flex gap-2 mt-3">
                                        {project.techStack.slice(0, 3).map((tech, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-white text-gray-600 text-xs rounded border border-gray-200">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {data.projects.length === 0 && <p className="text-gray-400 text-center py-4">No projects yet.</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
