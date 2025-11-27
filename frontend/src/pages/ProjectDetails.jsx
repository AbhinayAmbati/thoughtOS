import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, ArrowLeft, Folder, FileText, Code, Layers, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/items/projects/${id}`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Project not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <Link to="/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <header className="mb-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                                <p className="text-gray-600 text-lg">{project.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${project.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
                            {project.techStack && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Code className="w-4 h-4" /> Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech, idx) => (
                                            <span key={idx} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {project.features && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Key Features
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.features.slice(0, 5).map((feature, idx) => (
                                            <span key={idx} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Folder Structure */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-yellow-500" />
                                    Project Structure
                                </h3>
                                <div className="font-mono text-sm text-gray-600 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {project.folderStructure && project.folderStructure.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors">
                                            {item.includes('.') ? (
                                                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                            ) : (
                                                <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                                            )}
                                            <span className="truncate">{item}</span>
                                        </div>
                                    ))}
                                    {(!project.folderStructure || project.folderStructure.length === 0) && (
                                        <p className="text-gray-400 italic">No structure generated.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Wireframes */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5 text-purple-500" />
                                    Wireframe Concepts
                                </h3>

                                {project.wireframes && project.wireframes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {project.wireframes.map((wf, idx) => (
                                            <div key={idx} className="bg-gray-50 border-2 border-gray-100 rounded-xl p-5 hover:border-purple-200 transition-all group">
                                                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                                                    <span className="font-bold text-gray-800">{wf.screenName}</span>
                                                    <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wide font-medium">
                                                        {wf.layout}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {wf.elements.map((el, eIdx) => (
                                                        <div key={eIdx} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 text-center shadow-sm group-hover:border-purple-200 group-hover:text-purple-700 transition-colors">
                                                            {el}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No wireframes generated for this project.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;
