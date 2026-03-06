import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children, data, onReset }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen text-[var(--text-primary)] bg-[var(--bg-color)] flex flex-col">
            <TopBar onReset={onReset} />

            <div className="flex flex-1 relative max-w-[1400px] w-full mx-auto">
                {/* Mobile Menu Toggle button */}
                <button
                    className="sm:hidden absolute top-[-56px] left-4 z-30 p-2 text-[var(--text-primary)]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Drawer Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar (Desktop fixed, Mobile Drawer) */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 transform bg-[var(--bg-color)] sm:bg-transparent
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    sm:relative sm:translate-x-0 transition-transform duration-300 ease-in-out
                    w-[280px] sm:w-auto h-full sm:h-auto border-r border-[var(--border-color)]
                `}>
                    <div className="h-[73px] sm:hidden flex items-center p-4 border-b border-[var(--border-color)] justify-between">
                        <span className="font-semibold text-lg">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X size={20} /></button>
                    </div>
                    <Sidebar data={data} />
                </div>

                {/* Main Content Area */}
                <main id="main-scroll-container" className="flex-1 w-full min-w-0 h-[calc(100vh-73px)] overflow-y-auto bg-[var(--bg-color)]">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
