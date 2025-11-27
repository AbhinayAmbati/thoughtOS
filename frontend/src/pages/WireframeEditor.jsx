import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Save, MousePointer, Type, Square, Image as ImageIcon, Layout, Move } from 'lucide-react';

const WireframeEditor = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // For saving status
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/items/projects/${projectId}`);
            setProject(response.data);
            // Ensure wireframes have IDs and elements have IDs/positions if missing (migration for old data)
            if (response.data.wireframes) {
                // This would ideally happen on backend, but doing client-side fix for now
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // We need a specific endpoint to update just the wireframes or the whole project
            // For now using a generic update endpoint if it existed, but we only have updateTask.
            // I'll assume we might need to add updateProject to backend or use a specific patch.
            // Since we don't have updateProject, I will add it to the plan or just log for now.
            // Wait, I need to implement updateProject in backend to make this work.
            // For this step, I'll simulate the save or use a placeholder if the endpoint isn't ready.
            // Actually, I should add updateProject to the backend in the next step.

            // Assuming endpoint exists for now to structure the code:
            await axios.put(`http://localhost:5000/api/items/projects/${projectId}`, {
                wireframes: project.wireframes
            });
        } catch (error) {
            console.error("Error saving wireframes:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleElementMouseDown = (e, elementId) => {
        e.stopPropagation();
        setSelectedElementId(elementId);
        setIsDragging(true);

        const element = project.wireframes[selectedScreenIndex].elements.find(el => el.id === elementId);
        // Calculate offset from the element's top-left corner
        // This requires knowing the canvas relative coordinates.
        // For simplicity in this version, we'll just track movement delta.
        // Better approach:
        // We track the initial mouse position and the initial element position.
    };

    const handleCanvasMouseMove = (e) => {
        if (!isDragging || !selectedElementId) return;

        // This is a simplified drag implementation. 
        // A robust one requires calculating deltas based on mouse movement.
        // For this "Figma-like" feel, we'd need a proper useDrag hook or library.
        // Given the complexity, I'll implement a simple "click to select, arrow keys to move" or property editor first?
        // No, user asked for "edit like figma".

        // Let's use a simple absolute position update based on mouse for now.
        // We need the canvas rect.
        const canvas = document.getElementById('wireframe-canvas');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Snap to grid (10px)
        const snappedX = Math.round(x / 10) * 10;
        const snappedY = Math.round(y / 10) * 10;

        updateElementPosition(snappedX, snappedY);
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };

    const updateElementPosition = (x, y) => {
        const newWireframes = [...project.wireframes];
        const screen = newWireframes[selectedScreenIndex];
        const elementIndex = screen.elements.findIndex(el => el.id === selectedElementId);

        if (elementIndex !== -1) {
            screen.elements[elementIndex] = {
                ...screen.elements[elementIndex],
                x,
                y
            };
            setProject({ ...project, wireframes: newWireframes });
        }
    };

    const renderElement = (element) => {
        const style = {
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            ...element.style
        };

        const isSelected = selectedElementId === element.id;

        return (
            <div
                key={element.id}
                className={`absolute cursor-move flex items-center justify-center border transition-shadow ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 z-10' : 'border-gray-300 hover:border-blue-300'
                    } ${element.type === 'button' ? 'bg-blue-500 text-white rounded' : 'bg-white text-gray-800'}`}
                style={style}
                onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            >
                {element.type === 'image' ? (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                ) : (
                    <span className="text-xs pointer-events-none select-none px-2 text-center overflow-hidden">
                        {element.content}
                    </span>
                )}

                {/* Resize handles could go here */}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Project not found</div>;

    const currentScreen = project.wireframes && project.wireframes[selectedScreenIndex];

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Toolbar */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link to="/wireframes" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-gray-900 text-sm">{project.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{currentScreen?.screenName || 'No Screen'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button className="p-1.5 bg-white shadow-sm rounded text-blue-600"><MousePointer className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all"><Square className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all"><Type className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all"><ImageIcon className="w-4 h-4" /></button>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Screens List */}
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Screens</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {project.wireframes?.map((wf, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedScreenIndex(idx)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedScreenIndex === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Layout className="w-4 h-4 opacity-50" />
                                {wf.screenName}
                            </button>
                        ))}
                        {(!project.wireframes || project.wireframes.length === 0) && (
                            <div className="p-4 text-center text-xs text-gray-400 italic">No screens generated</div>
                        )}
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8 relative"
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                >
                    {currentScreen ? (
                        <div
                            id="wireframe-canvas"
                            className="bg-white shadow-xl relative transition-all"
                            style={{
                                width: `${currentScreen.width || 375}px`,
                                height: `${currentScreen.height || 812}px`
                            }}
                            onClick={() => setSelectedElementId(null)}
                        >
                            {/* Grid Background */}
                            <div className="absolute inset-0 pointer-events-none opacity-10"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            />

                            {currentScreen.elements?.map(renderElement)}
                        </div>
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <Layout className="w-12 h-12 mb-2 opacity-20" />
                            <p>Select a screen to edit</p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Properties */}
                <div className="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</h3>
                    </div>
                    <div className="p-4">
                        {selectedElementId ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                                    <input type="text" className="w-full text-sm border border-gray-200 rounded p-1.5" placeholder="Element text..." />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">X</label>
                                        <input type="number" className="w-full text-sm border border-gray-200 rounded p-1.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Y</label>
                                        <input type="number" className="w-full text-sm border border-gray-200 rounded p-1.5" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic text-center py-4">Select an element to edit properties</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WireframeEditor;
