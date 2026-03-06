import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import TopBar from './components/layout/TopBar';

function App() {
  const [reportData, setReportData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple mount animation
    setIsLoaded(true);
  }, []);

  const handleDataParsed = (data) => {
    setReportData(data);
  };

  const handleReset = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setReportData(null);
      setIsLoaded(true);
    }, 300);
  };

  if (!reportData) {
    return (
      <div className={`min-h-screen text-[var(--text-primary)] bg-[var(--bg-color)] transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <TopBar onReset={handleReset} />
        <main className="max-w-6xl mx-auto px-4 pt-12 pb-12">
          <FileUpload onDataParsed={handleDataParsed} />
        </main>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <DashboardLayout data={reportData} onReset={handleReset}>
        <div className="flex justify-between items-center mb-6">
          <button
            className="px-4 py-2 bg-[var(--card-color)] border border-[var(--border-color)] text-sm font-medium rounded-full hover:shadow-md transition-all animate-in fade-in"
            onClick={handleReset}
          >
            ← Upload Another Report
          </button>
        </div>
        <Dashboard data={reportData} />
      </DashboardLayout>
    </div>
  );
}

export default App;
