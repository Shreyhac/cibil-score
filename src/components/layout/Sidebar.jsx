import React from 'react';
import ScoreSimulator from '../simulator/ScoreSimulator';

export default function Sidebar({ data }) {
    const handleScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        const mainContainer = document.getElementById('main-scroll-container'); // Need to add this ID to DashboardLayout

        if (element && mainContainer) {
            // Calculate relative scroll position
            const elementTop = element.getBoundingClientRect().top;
            const containerTop = mainContainer.getBoundingClientRect().top;

            // Scroll the relative container, minus a bit of padding
            mainContainer.scrollTo({
                top: mainContainer.scrollTop + (elementTop - containerTop) - 24,
                behavior: 'smooth'
            });
        } else if (element) {
            // Fallback
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <aside className="w-full sm:w-[280px] flex-shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-color)] sm:bg-transparent min-h-full sm:h-[calc(100vh-73px)] overflow-y-auto hidden sm:block">
            <div className="p-4 space-y-6">
                {/* Wrap the ScoreSimulator. It needs some data to simulate things */}
                <div id="simulator" className="scroll-mt-4">
                    {data && <ScoreSimulator data={data} />}
                </div>

                {data && (
                    <div className="p-4 rounded-xl bg-[var(--card-color)] border border-[var(--border-color)]">
                        <h4 className="font-semibold text-sm mb-2 text-[var(--text-secondary)]">Quick Actions</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><button onClick={(e) => handleScroll(e, 'simulator')} className="w-full text-left p-2 hover:bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-colors">Score Simulator</button></li>
                            <li><button onClick={(e) => handleScroll(e, 'roadmap')} className="w-full text-left p-2 hover:bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-colors">Score Roadmap</button></li>
                            <li><button onClick={(e) => handleScroll(e, 'ai-insights')} className="w-full text-left p-2 hover:bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-colors">AI Optimizer</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    );
}
