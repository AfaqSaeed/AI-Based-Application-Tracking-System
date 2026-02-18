
import React, { useState } from 'react';
import { JobApplication } from '../types';

interface Props {
  applications: JobApplication[];
}

const Dashboard: React.FC<Props> = ({ applications }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <i className="fas fa-rocket text-4xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No Applications Logged</h2>
        <p className="text-slate-500 mt-2 mb-10 max-w-sm">
          Use the "New Application" workflow to extract job details and generate your professional documents.
        </p>
        <a href="#/new" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl hover:scale-105 active:scale-95">
          Start Your First Application
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Job Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and track your active job hunt.</p>
        </div>
        <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200">
          {applications.length} Applied
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors z-0"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {app.jobRole}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 font-bold text-lg">{app.companyName}</span>
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 text-sm">
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {app.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Applied Date</span>
                  <span className="font-bold text-slate-700">{app.appliedDate}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Deadline</span>
                  <span className="font-bold text-slate-700">{app.deadline || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => downloadFile(app.latexCv, `${app.jobRole}_CV.tex`, 'text/plain')}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      <span><i className="fas fa-file-code mr-2"></i> .tex</span>
                      <i className="fas fa-download text-slate-300 group-hover:text-indigo-600"></i>
                    </button>
                    <button 
                      onClick={() => handleCopy(app.latexCv, app.id + '_cv')}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 text-left px-4"
                    >
                      {copiedId === app.id + '_cv' ? 'Copied Source!' : 'Copy LaTeX for TeXworks'}
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => downloadFile(app.coverLetter, `${app.jobRole}_CL.txt`, 'text/plain')}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      <span><i className="fas fa-file-alt mr-2"></i> CL</span>
                      <i className="fas fa-download text-slate-300"></i>
                    </button>
                    <button 
                      onClick={() => handleCopy(app.coverLetter, app.id + '_cl')}
                      className="text-[10px] font-bold text-amber-500 hover:text-amber-700 text-left px-4"
                    >
                      {copiedId === app.id + '_cl' ? 'Copied Content!' : 'Copy CL Text'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
