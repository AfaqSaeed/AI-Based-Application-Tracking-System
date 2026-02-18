
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<Props> = ({ profile, onSave }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'template'>('details');
  const cvInputRef = useRef<HTMLInputElement>(null);
  const clInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onSave({ ...profile, [name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'baseCvSource' | 'baseClSource') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onSave({ ...profile, [field]: content });
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Professional Setup</h1>
          <p className="text-slate-400 mt-1">Configure your career data and document templates.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
           <button 
             onClick={() => setActiveTab('details')} 
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-slate-800 shadow-lg text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Profile Details
           </button>
           <button 
             onClick={() => setActiveTab('template')} 
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'template' ? 'bg-slate-800 shadow-lg text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             LaTeX Templates
           </button>
        </div>
      </header>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[600px]">
        {activeTab === 'details' ? (
          <div className="p-8 space-y-10">
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
                <i className="fas fa-id-card text-indigo-400"></i>
                Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</label>
                  <input name="email" value={profile.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone</label>
                  <input name="phone" value={profile.phone} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+1 234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Location</label>
                  <input name="location" value={profile.location} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="New York, USA" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">LinkedIn URL</label>
                  <input name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="linkedin.com/in/..." />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
                <i className="fas fa-graduation-cap text-indigo-400"></i>
                Career Background
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Master Summary</label>
                  <textarea name="summary" value={profile.summary} onChange={handleChange} rows={3} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Your elevator pitch..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Experience History</label>
                  <textarea name="experience" value={profile.experience} onChange={handleChange} rows={6} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Paste all your roles and bullets here..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Core Skills (Comma Separated)</label>
                  <textarea name="skills" value={profile.skills} onChange={handleChange} rows={2} className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="React, Node.js, LaTeX..." />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="p-8 space-y-12 animate-in slide-in-from-right duration-300">
            {/* CV Template Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <i className="fas fa-file-invoice text-indigo-400"></i>
                  Base CV Template (.tex)
                </h3>
                <button 
                  onClick={() => cvInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                >
                  <i className="fas fa-upload"></i> Upload .tex
                </button>
                <input type="file" ref={cvInputRef} accept=".tex" className="hidden" onChange={(e) => handleFileUpload(e, 'baseCvSource')} />
              </div>
              <textarea 
                name="baseCvSource" 
                value={profile.baseCvSource} 
                onChange={handleChange}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-indigo-200 focus:ring-2 focus:ring-indigo-500/30 outline-none font-mono text-sm shadow-inner transition-all"
                placeholder="\documentclass{article}..."
              />
            </section>

            {/* Cover Letter Template Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <i className="fas fa-envelope-open-text text-amber-400"></i>
                  Base Cover Letter Template (.tex)
                </h3>
                <button 
                  onClick={() => clInputRef.current?.click()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border border-slate-700"
                >
                  <i className="fas fa-upload"></i> Upload .tex
                </button>
                <input type="file" ref={clInputRef} accept=".tex" className="hidden" onChange={(e) => handleFileUpload(e, 'baseClSource')} />
              </div>
              <textarea 
                name="baseClSource" 
                value={profile.baseClSource} 
                onChange={handleChange}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-amber-100 focus:ring-2 focus:ring-amber-500/30 outline-none font-mono text-sm shadow-inner transition-all"
                placeholder="\documentclass{article}..."
              />
            </section>

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
               <p className="text-sm text-slate-400">
                <i className="fas fa-info-circle mr-2 text-indigo-400"></i>
                Pasting or uploading a <strong>LaTeX template</strong> here tells Gemini to use your specific layout, packages, and style. 
                If left empty, the AI will use a clean, standard academic format.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
