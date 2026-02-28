'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, login } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        const result = await register(name, email, password, confirmPassword);
        if (result.success) {
            // Auto-login after successful registration
            const loginResult = await login(email, password);
            if (loginResult.success) {
                refreshUser();
                router.push('/dashboard');
            } else {
                // Registration worked but auto-login failed — redirect to login page
                router.push('/login');
            }
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white overflow-hidden relative font-sans selection:bg-purple-500/30">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block group">
                        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform cursor-pointer">
                            NBA-BETTHOR
                        </h1>
                    </Link>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Create your pro account.</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40 relative overflow-hidden group">
                    {/* Card subtle shine */}
                    <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <form onSubmit={handleRegister} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                Full Name
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-500 group-focus-within/input:text-blue-400 transition-colors text-lg">person</span>
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="Michael Jordan"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-500 group-focus-within/input:text-blue-400 transition-colors text-lg">mail</span>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-500 group-focus-within/input:text-blue-400 transition-colors text-lg">lock</span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                Confirm Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-icons text-gray-500 group-focus-within/input:text-blue-400 transition-colors text-lg">lock_reset</span>
                                </div>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                                <span className="material-icons text-base">error_outline</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                                    CREATING ACCOUNT...
                                </>
                            ) : (
                                'CREATE ACCOUNT'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link href="/login" className="text-white hover:text-blue-300 font-bold transition-colors">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
