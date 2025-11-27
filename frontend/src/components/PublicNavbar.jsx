import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PublicNavbar = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const isLogin = location.pathname === '/login';

    return (
        <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">ThoughtOS</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            to="/app"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/30"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Go to App
                        </Link>
                    ) : (
                        <>
                            {isLogin ? (
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
