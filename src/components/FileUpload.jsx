import React, { useState, useCallback } from 'react';
import { UploadCloud, FileJson, FileWarning } from 'lucide-react';
import { parseReport } from '../utils/parseReport';
import sampleReportData from '../data/sampleReport.json';

export default function FileUpload({ onDataParsed }) {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = (file) => {
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setErrorMsg('Invalid file type. Please upload a .json file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                const parsedData = parseReport(json);
                if (parsedData) {
                    setErrorMsg('');
                    onDataParsed(parsedData);
                } else {
                    setErrorMsg('Invalid report structure. Please check the JSON format.');
                }
            } catch (err) {
                setErrorMsg('Error parsing JSON file. Please ensure it is valid JSON.');
            }
        };
        reader.onerror = () => {
            setErrorMsg('Error reading file. Please try again.');
        };
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const loadDemo = () => {
        const parsedData = parseReport(sampleReportData);
        if (parsedData) {
            setErrorMsg('');
            onDataParsed(parsedData);
        } else {
            setErrorMsg('Error loading demo data.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-3 tracking-tight">Upload Credit Report</h2>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                    Securely analyze your JSON credit report. No data is sent to any server; everything runs locally in your browser.
                </p>
            </div>

            <div
                className={`w-full max-w-lg mb-6 apple-card border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 cursor-pointer 
          ${isDragging ? 'border-[var(--color-apple-blue)] bg-[var(--color-apple-blue)]/5' : 'border-[var(--border-color)] hover:border-[var(--color-apple-blue)]/50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-[var(--color-apple-blue)] text-white' : 'bg-[var(--bg-color)] text-[var(--color-apple-blue)]'}`}>
                    <UploadCloud size={32} />
                </div>
                <p className="font-medium text-lg mb-1">Drag & drop your JSON file</p>
                <p className="text-[var(--text-secondary)] text-sm">or click to browse from your computer</p>
                <input
                    id="file-upload"
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {errorMsg && (
                <div className="mb-6 flex items-center gap-2 text-[var(--color-score-poor)] bg-[var(--color-score-poor)]/10 px-4 py-3 rounded-xl">
                    <FileWarning size={18} />
                    <span className="font-medium text-sm">{errorMsg}</span>
                </div>
            )}

            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <div className="h-px bg-[var(--border-color)] w-16"></div>
                <span>Don't have a file?</span>
                <div className="h-px bg-[var(--border-color)] w-16"></div>
            </div>

            <button
                onClick={loadDemo}
                className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--card-color)] border border-[var(--border-color)] hover:border-[var(--color-apple-blue)] text-[var(--color-apple-blue)] font-medium transition-all shadow-sm hover:shadow-md"
            >
                <FileJson size={18} />
                Try with Sample Data
            </button>
        </div>
    );
}
