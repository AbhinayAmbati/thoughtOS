import React, { useState } from 'react';
import axios from 'axios';
import ThoughtInput from '../components/ThoughtInput';
import CompilerOutput from '../components/CompilerOutput';
import { Brain, LayoutDashboard, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [compiledData, setCompiledData] = useState(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleCompile = async (thoughtText) => {
        setIsCompiling(true);
        try {
            const response = await axios.post('http://localhost:5000/api/thoughts/compile', {
                text: thoughtText
            });
            setCompiledData(response.data.data.processedData);
        } catch (error) {
            console.error("Error compiling thought:", error);
            alert("Failed to compile thought. Please try again.");
        } finally {
            setIsCompiling(false);
        }
    };

    const handleSave = async () => {
        if (!compiledData) return;
        setIsSaving(true);
        try {
            await axios.post('http://localhost:5000/api/items/save', {
                tasks: compiledData.tasks,
                projects: compiledData.projects
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving items:", error);
            alert("Failed to save items.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            ThoughtOS
                        </h1>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                </div>
            </header>

            <main className="py-12 px-4">
                <div className="text-center mb-12 space-y-3">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        Turn Chaos into <span className="text-blue-600">Structure</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Just type what's on your mind. We'll handle the rest.
                    </p>
                </div>

                <ThoughtInput onCompile={handleCompile} isCompiling={isCompiling} />

                {compiledData && (
                    <div className="mt-12 relative">
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Accept & Save to Dashboard'}
                            </button>
                        </div>
                        <CompilerOutput data={compiledData} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
