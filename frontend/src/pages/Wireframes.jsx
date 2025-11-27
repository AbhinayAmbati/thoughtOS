import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, ArrowRight, Layers } from 'lucide-react';

const Wireframes = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Wireframes</h1>
                    <p className="text-gray-500">Select a project to view and edit its wireframes.</p>
                </header>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                                        <span className="text-xs text-gray-500">{project.wireframes?.length || 0} Screens</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">{project.description}</p>

                                <Link
                                    to={`/wireframes/${project._id}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-medium rounded-xl transition-colors border border-gray-200 hover:border-purple-200"
                                >
                                    Open Editor <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                                <p className="text-gray-500">Create a project in the Thought Stream to generate wireframes.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Wireframes;
