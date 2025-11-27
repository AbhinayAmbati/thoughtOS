import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, ArrowRight, Layers, Search, Plus, Smartphone, Monitor } from 'lucide-react';

const WireframePreview = ({ wireframes }) => {
    if (!wireframes || wireframes.length === 0) {
        return (
            <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Layers className="w-8 h-8 opacity-20" />
                <span className="text-xs font-medium">No screens</span>
            </div>
        );
    }

    const screen = wireframes[0]; // Show first screen
    const scale = 0.35; // Scale down for preview

    return (
        <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex justify-center items-start pt-4 group-hover:bg-blue-50/30 transition-colors">
            <div
                className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden relative"
                style={{
                    width: screen.width || 375,
                    height: screen.height || 812,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    marginBottom: `-${(screen.height || 812) * (1 - scale)}px` // Compensate for space
                }}
            >
                {screen.elements?.map((el, i) => (
                    <div
                        key={i}
                        className="absolute flex items-center justify-center overflow-hidden"
                        style={{
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height,
                            ...el.style,
                            backgroundColor: el.type === 'button' ? '#3b82f6' : el.type === 'image' ? '#f3f4f6' : el.style?.backgroundColor || 'white',
                            color: el.type === 'button' ? 'white' : 'black',
                            border: el.type === 'text' ? 'none' : '1px solid #e5e7eb',
                            fontSize: '14px',
                            borderRadius: el.type === 'button' ? '4px' : '0'
                        }}
                    >
                        {el.type === 'image' ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-[10px]">IMG</div>
                        ) : (
                            <span className="truncate px-1 w-full text-center">{typeof el === 'object' ? el.content : el}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Wireframes = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items/dashboard');
                setProjects(response.data.projects);
                setFilteredProjects(response.data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchTerm, projects]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wireframes</h1>
                        <p className="text-gray-500 mt-1">Design and prototype your project screens.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                            />
                        </div>
                        <Link to="/" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> New Project
                        </Link>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProjects.map((project) => (
                            <Link
                                to={`/wireframes/${project._id}`}
                                key={project._id}
                                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                            >
                                {/* Preview Area */}
                                <WireframePreview wireframes={project.wireframes} />

                                {/* Content Area */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                        <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                            {project.status}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{project.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Smartphone className="w-3 h-3" />
                                                {project.wireframes?.length || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-3 h-3" />
                                                {project.wireframes?.reduce((acc, wf) => acc + (wf.elements?.length || 0), 0) || 0}
                                            </span>
                                        </div>
                                        <span className="text-blue-600 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            Open Editor <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredProjects.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Layers className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No projects found</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    {searchTerm ? `No results for "${searchTerm}"` : "Start by creating a project in the Thought Stream."}
                                </p>
                                {searchTerm ? (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-blue-600 font-medium text-sm hover:underline"
                                    >
                                        Clear search
                                    </button>
                                ) : (
                                    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                                        Go to Thought Stream
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Wireframes;
