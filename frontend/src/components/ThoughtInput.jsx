import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ThoughtInput = ({ onCompile, isCompiling }) => {
    const [thought, setThought] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (thought.trim()) {
            onCompile(thought);
            setThought('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 group-hover:opacity-30 transition duration-500 blur"></div>
                <textarea
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind? (e.g., 'I need to finish my project and buy groceries')"
                    className="relative w-full h-40 p-6 pr-16 text-lg bg-white text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none shadow-sm placeholder-gray-400 transition-all"
                />
                <button
                    type="submit"
                    disabled={!thought.trim() || isCompiling}
                    className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                >
                    {isCompiling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export default ThoughtInput;
