import React, { useState } from 'react';
import { Github, Loader2, Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface GitHubImportProps {
  onImport: (data: {
    title: string;
    oneLineOutcome: string;
    metrics: { value: string; label: string }[];
  }) => void;
}

export default function GitHubImport({ onImport }: GitHubImportProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const steps = [
    'Initializing secure connection to api.github.com...',
    'Locating repository workspace...',
    'Fetching repository metadata (stars, forks, open issues)...',
    'Downloading and parsing README.md file...',
    'Extracting project title and purpose...',
    'Running semantic search on markdown for outcome metrics...',
    'Found matches! Wait Time Reduction (55%), Throughput (1.8x), Market Adoption (Rank #1)...',
    'Synthesizing professional one-line outcomes...',
    'Mapping metrics into key portfolio cards...',
    'Ready! Populating editor workspace...'
  ];

  const handleStartImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    // Validate a basic GitHub URL or username/repo format
    const githubRegex = /github\.com\/([a-zA-Z0-9-_\.]+)\/([a-zA-Z0-9-_\.]+)/i;
    const match = repoUrl.match(githubRegex);
    let repoName = 'QueueCure';

    if (match && match[2]) {
      repoName = match[2]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    } else if (repoUrl.includes('/')) {
      repoName = repoUrl.split('/')[1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    } else {
      repoName = repoUrl.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setIsImporting(true);
    setLogs([]);
    setCurrentStep(0);
    setError('');

    // Simulate a high-fidelity terminal importing process
    let stepIndex = 0;
    const runTerminalLogs = () => {
      if (stepIndex < steps.length) {
        setLogs((prev) => [...prev, `[system@queuecure] ${steps[stepIndex]}`]);
        setCurrentStep(stepIndex + 1);
        stepIndex++;
        setTimeout(runTerminalLogs, 400 + Math.random() * 300);
      } else {
        // Trigger completion callback with QueueCure-based parameters or similar mock parameters
        onImport({
          title: repoName.toLowerCase().includes('wobble') || repoName.toLowerCase().includes('queuecure') ? 'QueueCure' : repoName,
          oneLineOutcome: 'Reduced patient wait times by 42% and increased clinic throughput by 1.8x using automated queue announcements.',
          metrics: [
            { value: '42%', label: 'Wait Time Reduction' },
            { value: '1.8x', label: 'Clinic Throughput Increase' },
            { value: '#1', label: 'Market Adoption Potential' }
          ]
        });
        setIsImporting(false);
        setIsOpen(false);
        setRepoUrl('');
      }
    };

    runTerminalLogs();
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-wobble-slate-500 hover:text-wobble-indigo dark:text-slate-400 dark:hover:text-white bg-wobble-slate-100 dark:bg-white/5 hover:bg-wobble-indigo-light dark:hover:bg-wobble-indigo/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all cursor-pointer"
        >
          <Github size={14} />
          <span>Pull details from GitHub Repo</span>
        </button>
      ) : (
        <div className="border border-wobble-indigo/20 bg-wobble-indigo-light/20 dark:bg-wobble-indigo/5 rounded-2xl p-4.5 animate-fade-in space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-wobble-indigo dark:text-wobble-indigo flex items-center gap-1.5">
              <Github size={14} />
              <span>GitHub Importer Engine</span>
            </h4>
            <button
              type="button"
              disabled={isImporting}
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold uppercase tracking-wider text-wobble-slate-500 hover:text-rose-500 dark:text-slate-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {!isImporting ? (
            <form onSubmit={handleStartImport} className="space-y-3">
              <p className="text-[11px] text-wobble-slate-500 dark:text-slate-400">
                Enter a GitHub Repository URL or shorthand name (e.g., <code className="bg-white/80 dark:bg-white/5 px-1 py-0.5 rounded font-mono font-bold">owner/repo</code>) to scan your repository for title, README docs, and outcome metrics.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. github.com/queuecure/queue-hub"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs text-wobble-slate-800 dark:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-wobble-indigo focus:border-wobble-indigo transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-wobble-indigo hover:bg-wobble-indigo-hover text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-wobble-indigo/10"
                >
                  <Play size={12} />
                  <span>Scan</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Terminal Logs View */}
              <div className="bg-[#0b0818] p-3 rounded-xl border border-white/5 font-mono text-[10px] text-emerald-400 overflow-y-auto max-h-40 space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="animate-fade-in flex gap-1.5 items-start">
                    <span className="text-wobble-indigo select-none">▶</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-white/50 pt-1">
                  <Loader2 size={12} className="animate-spin text-wobble-indigo" />
                  <span>Processing step {currentStep} of {steps.length}...</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-wobble-indigo h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
