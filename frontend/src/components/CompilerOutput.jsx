import React from 'react';
import { CheckCircle, Calendar, FileText, Layers, Hash, Clock, Users, Tag, Folder, LayoutDashboard } from 'lucide-react';

const CompilerOutput = ({ data }) => {
    if (!data) return null;

    const { classification, tasks, projects, timelines, events, notes, entities, documents, summary } = data;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
            {/* Summary Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-purple-600" />
                    Analysis: {classification}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">{summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks Section */}
                {tasks && tasks.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Tasks
                        </h3>
                        <div className="space-y-3">
                            {tasks.map((task, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    {task.description && <p className="text-sm text-gray-600 mb-2">{task.description}</p>}
                                    {task.deadline && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                            <Clock className="w-3 h-3" />
                                            {task.deadline}
                                        </div>
                                    )}
                                    {task.subtasks && task.subtasks.length > 0 && (
                                        <ul className="space-y-1 pl-4 border-l-2 border-gray-200">
                                            {task.subtasks.map((sub, sIdx) => (
                                                <li key={sIdx} className="text-sm text-gray-600">• {sub}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects && projects.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Folder className="w-5 h-5 text-blue-500" />
                            Generated Projects
                        </h3>
                        <div className="grid grid-cols-1 gap-8">
                            {projects.map((project, idx) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div className="mb-6">
                                        <h4 className="font-bold text-gray-900 text-2xl mb-2">{project.name}</h4>
                                        <p className="text-gray-600">{project.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Column: Tech & Features */}
                                        <div className="space-y-6">
                                            {project.techStack && (
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tech Stack</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.techStack.map((tech, tIdx) => (
                                                            <span key={tIdx} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 shadow-sm font-medium">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {project.features && (
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Features</h5>
                                                    <ul className="space-y-2">
                                                        {project.features.slice(0, 5).map((feature, fIdx) => (
                                                            <li key={fIdx} className="text-sm text-gray-700 flex items-start gap-2.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column: Folder Structure */}
                                        {project.folderStructure && (
                                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <Folder className="w-4 h-4" />
                                                    Project Structure
                                                </h5>
                                                <div className="font-mono text-sm text-gray-600 space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                                                    {project.folderStructure.map((item, fIdx) => (
                                                        <div key={fIdx} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
                                                            {item.includes('.') ? (
                                                                <FileText className="w-4 h-4 text-gray-400" />
                                                            ) : (
                                                                <Folder className="w-4 h-4 text-blue-400" />
                                                            )}
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Wireframes Section - Full Width */}
                                    {project.wireframes && project.wireframes.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-gray-200">
                                            <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <LayoutDashboard className="w-4 h-4 text-purple-500" />
                                                Wireframe Concepts
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {project.wireframes.map((wf, wIdx) => (
                                                    <div key={wIdx} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-purple-200 transition-all shadow-sm group">
                                                        <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800 text-sm">{wf.screenName}</span>
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                {wf.layout}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {wf.elements.map((el, eIdx) => (
                                                                <div key={eIdx} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 text-center group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-100 transition-colors">
                                                                    {el}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Documents Section */}
                {documents && documents.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Generated Documents
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-gray-900">{doc.title}</h4>
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md uppercase font-semibold">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                                        {doc.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timelines Section */}
                {timelines && timelines.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-500" />
                            Timelines & Schedules
                        </h3>
                        <div className="space-y-4">
                            {timelines.map((timeline, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-3">{timeline.title}</h4>
                                    <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                        {timeline.events.map((event, eIdx) => (
                                            <div key={eIdx} className="pl-6 relative">
                                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-orange-400"></div>
                                                <div className="text-sm font-medium text-gray-900">{event.event}</div>
                                                <div className="text-xs text-gray-500">{event.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Entities Section */}
                {entities && (entities.people?.length > 0 || entities.technologies?.length > 0) && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-pink-500" />
                            Extracted Entities
                        </h3>
                        <div className="space-y-4">
                            {entities.people && entities.people.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">People</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {entities.people.map((person, idx) => (
                                            <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-md">
                                                <Users className="w-3 h-3" /> {person}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {entities.technologies && entities.technologies.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Technologies</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {entities.technologies.map((tech, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompilerOutput;
