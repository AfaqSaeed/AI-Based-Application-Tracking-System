
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<Props> = ({ profile, onSave }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'template'>('details');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onSave({ ...profile, [name]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Professional Setup</h1>
          <p className="text-slate-500 mt-1">Configure your personal data and document templates.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
           <button 
             onClick={() => setActiveTab('details')} 
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Profile Details
           </button>
           <button 
             onClick={() => setActiveTab('template')} 
             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'template' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Base CV Template
           </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        {activeTab === 'details' ? (
          <div className="p-8 space-y-10">
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-id-card text-indigo-500"></i>
                Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</label>
                  <input name="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone</label>
                  <input name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+1 234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                  <input name="location" value={profile.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="New York, USA" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">LinkedIn URL</label>
                  <input name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="linkedin.com/in/..." />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-graduation-cap text-indigo-500"></i>
                Career Background
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Master Summary</label>
                  <textarea name="summary" value={profile.summary} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Your elevator pitch..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Experience (AI will tailor this)</label>
                  <textarea name="experience" value={profile.experience} onChange={handleChange} rows={6} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Paste all your roles and bullets here..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Skills</label>
                  <textarea name="skills" value={profile.skills} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="React, Node.js, LaTeX..." />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="p-8 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <i className="fas fa-file-code text-2xl"></i>
               </div>
               <div>
                  <h4 className="font-bold text-indigo-900">LaTeX Base CV Template</h4>
                  <p className="text-sm text-indigo-700 mt-1">
                    Paste the <strong>LaTeX source code</strong> of a CV you've already created. 
                    ApplyFlow will use this as a stylistic foundation, keeping the exact formatting (margins, colors, font, layout) while rewriting the text to match the job you're applying for.
                  </p>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex justify-between">
                <span>Reference LaTeX Code</span>
                <span className="text-slate-300 font-normal italic">Optional - defaults to simple article style if empty</span>
              </label>
              <textarea 
                name="baseCvSource" 
                value={profile.baseCvSource} 
                onChange={handleChange}
                rows={20}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm bg-slate-50"
                placeholder="\documentclass{article}..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
