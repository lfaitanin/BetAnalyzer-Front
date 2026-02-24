import Link from 'next/link';
import { Glimmer } from '@/components/Glimmer';

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-[#09090b] text-white relative overflow-hidden font-sans selection:bg-purple-500/30">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
            </div>

            {/* Navbar */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
                <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                    NBA-BETTHOR
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/register" className="px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:scale-105 transition-transform">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center text-center px-4 mt-20 md:mt-32 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-purple-300 mb-8 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    AI-POWERED PREDICTIONS 2.0 LIVE
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                    DOMINATE THE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ODDS</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
                    Stop guessing. Start investing. Our advanced AI analyzes millions of data points to deliver high-value NBA betting signals directly to you.
                </p>

                <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto items-center">
                    <Link href="/login" className="group relative">
                        <Glimmer className="rounded-full overflow-hidden">
                            <div className="px-10 py-4 bg-white text-black font-black text-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                                GET STARTED
                                <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </Glimmer>
                    </Link>

                    <button className="px-8 py-4 text-gray-300 font-bold hover:text-white transition-colors flex items-center gap-2">
                        <span className="material-icons text-purple-400">play_circle</span>
                        WATCH DEMO
                    </button>
                </div>

                {/* Status Bar */}
                <div className="mt-20 flex gap-8 md:gap-16 text-center">
                    <div>
                        <div className="text-3xl font-black text-white">87%</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Win Rate</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">$2.4M+</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">User Profit</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">24/7</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Analysis</div>
                    </div>
                </div>

                {/* Bento Grid Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
                    <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-icons text-purple-400 text-2xl">analytics</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Real-Time Analytics</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Our engine processes game data in real-time, giving you the edge before the books adjust.
                            Live player tracking, momentum analysis, and injury impacts instantly reflected in your dashboard.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-icons text-blue-400 text-2xl">psychology</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">AI Models</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Proprietary machine learning models trained on 10+ years of historical NBA data.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-icons text-green-400 text-2xl">account_balance_wallet</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Bankroll Mgmt</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Smart staking plans to grow your capital sustainably.
                        </p>
                    </div>

                    <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-colors group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-icons text-pink-400 text-2xl">verified</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Verified Results</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Transparent tracking of every signal sent. We don't hide losses; we learn from them and optimize.
                                Join a community of winners.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-32 py-12 text-center text-gray-600 text-sm relative z-10 border-t border-white/5 w-full">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-bold text-gray-500">NBA-BETTHOR © 2025</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
