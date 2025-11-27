import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Zap, Layers, Layout, CheckCircle, Cpu, Globe } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
    { name: 'Mon', chaos: 80, structure: 20 },
    { name: 'Tue', chaos: 65, structure: 40 },
    { name: 'Wed', chaos: 45, structure: 60 },
    { name: 'Thu', chaos: 30, structure: 75 },
    { name: 'Fri', chaos: 15, structure: 90 },
    { name: 'Sat', chaos: 10, structure: 95 },
    { name: 'Sun', chaos: 5, structure: 100 },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" />
                            <span>AI-Powered Thought Compiler</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                            Turn Your Mental Chaos into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Structured Action
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            ThoughtOS uses advanced AI to capture your raw thoughts and instantly convert them into tasks, projects, timelines, and documents.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-lg transition-all"
                            >
                                Live Demo
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Visuals / Stats Section */}
            <section className="py-20 px-4 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                From Brain Dump to <span className="text-blue-600">Execution Plan</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Stop wasting time organizing. Just type. Our engine understands context, extracts entities, and builds your workspace automatically.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: CheckCircle, title: "Auto-Task Creation", desc: "Detects actionable items and deadlines." },
                                    { icon: Layers, title: "Project Structuring", desc: "Generates folders, tech stacks, and features." },
                                    { icon: Layout, title: "Instant Wireframes", desc: "Visualizes your app ideas immediately." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl"
                        >
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Productivity Velocity</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id="colorStructure" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="structure" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorStructure)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Mock Wireframe Visual */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-mono">dashboard_v1.tsx</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-16 space-y-2">
                                        <div className="h-2 bg-gray-100 rounded w-full"></div>
                                        <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-100 rounded w-full"></div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="h-16 bg-blue-50 rounded-lg flex-1 border border-blue-100"></div>
                                            <div className="h-16 bg-purple-50 rounded-lg flex-1 border border-purple-100"></div>
                                        </div>
                                        <div className="h-24 bg-gray-50 rounded-lg border border-gray-100"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Workflow Steps */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            A simple, magical workflow designed to keep you in the flow state.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Dump Your Mind",
                                desc: "Write anything. Tasks, ideas, code snippets, or random thoughts. No format required.",
                                icon: Brain
                            },
                            {
                                step: "02",
                                title: "AI Analysis",
                                desc: "Our engine parses your text, identifies intent, and structures the data instantly.",
                                icon: Cpu
                            },
                            {
                                step: "03",
                                title: "Structured Output",
                                desc: "Get actionable tasks, project roadmaps, and documents ready to use.",
                                icon: Globe
                            }
                        ].map((card, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <card.icon className="w-24 h-24 text-blue-600" />
                                </div>
                                <div className="text-4xl font-black text-blue-100 mb-6">{card.step}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-gray-900">ThoughtOS</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 ThoughtOS. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
