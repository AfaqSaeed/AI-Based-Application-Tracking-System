
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, JobApplication, ApplicationStep } from '../types';
import { extractJobDetails, generateLatexCV, generateCoverLetter } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  onComplete: (app: JobApplication) => void;
}

const NewApplication: React.FC<Props> = ({ profile, onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ApplicationStep>('JD_INPUT');
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [copied, setCopied] = useState<'cv' | 'cl' | null>(null);
  const [previewTab, setPreviewTab] = useState<'cl' | 'cv'>('cl');
  
  const [appData, setAppData] = useState<Partial<JobApplication>>({
    companyName: '',
    jobRole: '',
    deadline: '',
    latexCv: '',
    coverLetter: '',
  });

  const handleCopy = (text: string, type: 'cv' | 'cl') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveFile = async (content: string, suggestedName: string, ext: string) => {
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${suggestedName}.${ext}`,
          types: [{
            description: ext === 'tex' ? 'LaTeX File' : 'Text File',
            accept: { [ext === 'tex' ? 'text/x-tex' : 'text/plain']: [`.${ext}`] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } else {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${suggestedName}.${ext}`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Save cancelled", err);
    }
  };

  const handleProcessJD = async () => {
    if (!jd) return;
    setLoading(true);
    try {
      const details = await extractJobDetails(jd);
      setAppData(prev => ({ ...prev, ...details }));
      setStep('EXTRACTION');
    } catch (error) {
      alert("Extraction failed. Please input manually.");
      setStep('EXTRACTION');
    } finally {
      setLoading(false);
    }
  };

  const generateCV = async () => {
    setLoading(true);
    try {
      const cv = await generateLatexCV(profile, appData.jobRole!, appData.companyName!, jd);
      setAppData(prev => ({ ...prev, latexCv: cv }));
      setStep('CV_GEN');
    } catch (error) {
      alert("Error generating CV.");
    } finally {
      setLoading(false);
    }
  };

  const generateCL = async () => {
    setLoading(true);
    try {
      const cl = await generateCoverLetter(profile, appData.jobRole!, appData.companyName!, jd);
      setAppData(prev => ({ ...prev, coverLetter: cl }));
      setStep('CL_GEN');
    } catch (error) {
      alert("Error generating Cover Letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = () => {
    const finalApp: JobApplication = {
      id: crypto.randomUUID(),
      companyName: appData.companyName || 'Unknown',
      jobRole: appData.jobRole || 'Unknown',
      deadline: appData.deadline || '',
      jobDescription: jd,
      jobUrl: jobUrl,
      status: 'Applied',
      latexCv: appData.latexCv || '',
      coverLetter: appData.coverLetter || '',
      appliedDate: new Date().toLocaleDateString(),
    };
    onComplete(finalApp);
    navigate('/');
  };

  const stepsInfo = [
    { key: 'JD_INPUT', label: 'JD' },
    { key: 'EXTRACTION', label: 'Details' },
    { key: 'CV_GEN', label: 'LaTeX' },
    { key: 'CL_GEN', label: 'Draft' },
    { key: 'REVIEW', label: 'Preview' },
  ];

  const isClLatex = appData.coverLetter?.includes('\\documentclass');

  return (
    <div className="max-w-6xl mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-100">Application Builder</h2>
          <div className="flex gap-2">
             {stepsInfo.map((s, idx) => (
                <div key={s.key} className="flex items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                     stepsInfo.findIndex(item => item.key === step) >= idx ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-500'
                   }`}>
                     {idx + 1}
                   </div>
                   {idx < stepsInfo.length - 1 && <div className={`w-4 h-0.5 mx-1 transition-colors ${stepsInfo.findIndex(item => item.key === step) > idx ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>}
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {step === 'JD_INPUT' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-slate-100 text-center">Analyze Job Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Job URL (Optional)</label>
                <input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Description Paste *</label>
                <textarea rows={10} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job requirements, responsibilities, etc..." className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" />
              </div>
            </div>
            <button onClick={handleProcessJD} disabled={loading || !jd} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all hover:bg-indigo-500 disabled:opacity-50">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
              Analyze with Gemini AI
            </button>
          </div>
        )}

        {step === 'EXTRACTION' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
             <h3 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2">Confirm Extraction</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company</label>
                   <input type="text" value={appData.companyName} onChange={(e) => setAppData({...appData, companyName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-slate-100 outline-none focus:border-indigo-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
                   <input type="text" value={appData.jobRole} onChange={(e) => setAppData({...appData, jobRole: e.target.value})} className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-slate-100 outline-none focus:border-indigo-500" />
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Deadline</label>
                   <input type="text" value={appData.deadline} onChange={(e) => setAppData({...appData, deadline: e.target.value})} className="w-full bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-slate-100 outline-none focus:border-indigo-500" />
                </div>
             </div>
             <button onClick={generateCV} disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:bg-indigo-500">
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                Next: Tailor LaTeX CV
             </button>
          </div>
        )}

        {step === 'CV_GEN' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-100">LaTeX Source</h3>
                <p className="text-sm text-slate-400">Customized based on your template & job description.</p>
              </div>
              <button onClick={() => handleCopy(appData.latexCv!, 'cv')} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-indigo-400 hover:bg-slate-700 transition-colors">
                 {copied === 'cv' ? 'Copied!' : 'Copy Source'}
              </button>
            </div>
            <textarea rows={14} value={appData.latexCv} onChange={(e) => setAppData({...appData, latexCv: e.target.value})} className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-indigo-300 outline-none focus:border-indigo-500/50 transition-all shadow-inner" />
            <div className="flex gap-4">
               <button onClick={() => setStep('EXTRACTION')} className="flex-1 font-bold py-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">Back</button>
               <button onClick={generateCL} disabled={loading} className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-500 transition-colors">Next: Generate Cover Letter</button>
            </div>
          </div>
        )}

        {step === 'CL_GEN' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-100">Cover Letter Draft</h3>
              <button onClick={() => handleCopy(appData.coverLetter!, 'cl')} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-indigo-400 hover:bg-slate-700 transition-colors">
                 {copied === 'cl' ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea rows={14} value={appData.coverLetter} onChange={(e) => setAppData({...appData, coverLetter: e.target.value})} className={`w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-200 outline-none leading-relaxed focus:border-indigo-500 transition-all ${isClLatex ? 'font-mono text-amber-100' : ''}`} />
            <div className="flex gap-4">
               <button onClick={() => setStep('CV_GEN')} className="flex-1 font-bold py-4 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">Back</button>
               <button onClick={() => setStep('REVIEW')} className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-500 transition-colors">Final Preview</button>
            </div>
          </div>
        )}

        {step === 'REVIEW' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-100">Final Document Review</h3>
                <p className="text-slate-400">Double check everything before saving.</p>
              </div>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                 <button onClick={() => setPreviewTab('cl')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${previewTab === 'cl' ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>Cover Letter</button>
                 <button onClick={() => setPreviewTab('cv')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${previewTab === 'cv' ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>CV Highlights</button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow bg-slate-950 p-4 sm:p-8 rounded-2xl flex justify-center overflow-auto max-h-[700px] border border-slate-800 shadow-inner">
                <div className="bg-white w-full max-w-[210mm] shadow-2xl p-8 sm:p-12 min-h-[297mm] text-slate-900 font-serif leading-relaxed">
                  {previewTab === 'cl' ? (
                    <div className="whitespace-pre-line text-[13px] sm:text-sm">
                      {isClLatex ? (
                        <div className="font-mono text-xs text-slate-600 p-4 bg-slate-50 rounded border border-dashed border-slate-200">
                          <p className="mb-2 font-bold uppercase text-[10px] tracking-widest text-slate-400">LaTeX Template Detected</p>
                          {appData.coverLetter?.substring(0, 1000)}...
                          <p className="mt-4 text-indigo-600 font-bold">Previewing full LaTeX compilation is not possible in-browser. Please compile in TeXworks.</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-right mb-8 font-sans">
                            <p className="font-bold text-slate-900">{profile.fullName}</p>
                            <p className="text-slate-600">{profile.location}</p>
                            <p className="text-slate-600">{profile.email} | {profile.phone}</p>
                            <p className="text-slate-500 mt-2">{new Date().toLocaleDateString()}</p>
                          </div>
                          <div className="mb-8 font-sans">
                            <p className="text-slate-600">Hiring Manager</p>
                            <p className="font-bold text-slate-900">{appData.companyName}</p>
                          </div>
                          <p className="mb-4">Dear Hiring Manager,</p>
                          <div className="text-justify text-slate-800">{appData.coverLetter}</div>
                          <div className="mt-12 font-sans">
                            <p>Sincerely,</p>
                            <p className="mt-4 font-bold text-lg text-slate-900">{profile.fullName}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="font-sans">
                       <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{profile.fullName}</h1>
                          <p className="text-sm text-slate-600 mt-1">{profile.email} • {profile.phone} • {profile.location}</p>
                       </div>
                       
                       <section className="mb-6">
                          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide text-slate-900">Summary Preview</h2>
                          <p className="text-sm text-slate-700 italic">The generated LaTeX includes a tailored professional summary for {appData.jobRole}.</p>
                       </section>

                       <section className="mb-6">
                          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide text-slate-900">Experience Base</h2>
                          <div className="space-y-4">
                             <div className="text-sm text-slate-700 whitespace-pre-line">
                                {profile.experience.split('\n').slice(0, 10).join('\n')}...
                             </div>
                          </div>
                       </section>

                       <section>
                          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide text-slate-900">Skills Highlights</h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                             {profile.skills.split(',').map((s, i) => (
                               <span key={i} className="bg-slate-100 px-3 py-1 rounded text-xs border border-slate-200 font-bold text-slate-700">{s.trim()}</span>
                             ))}
                          </div>
                       </section>
                       
                       <div className="mt-12 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-xs text-indigo-700 italic">
                          This is a content sanity check. TeXworks will render your professional template style perfectly.
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-72 flex flex-col gap-6">
                 <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                    <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                       <i className="fas fa-file-export text-indigo-400"></i>
                       Export Files
                    </h4>
                    <div className="space-y-3">
                       <button onClick={() => handleSaveFile(appData.latexCv!, `${appData.jobRole}_CV`, 'tex')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2">
                          <i className="fas fa-download"></i> Save CV (.tex)
                       </button>
                       <button onClick={() => handleSaveFile(appData.coverLetter!, `${appData.jobRole}_CL`, isClLatex ? 'tex' : 'txt')} className="w-full border border-slate-700 text-slate-300 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all">
                          Save CL ({isClLatex ? '.tex' : '.txt'})
                       </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700 flex flex-col gap-1">
                       <button onClick={() => handleCopy(appData.latexCv!, 'cv')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 text-left py-1 flex items-center gap-2">
                          <i className="fas fa-copy"></i> Copy LaTeX Source
                       </button>
                       <button onClick={() => handleCopy(appData.coverLetter!, 'cl')} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 text-left py-1 flex items-center gap-2">
                          <i className="fas fa-copy"></i> Copy Cover Letter
                       </button>
                    </div>
                 </div>

                 <button 
                  onClick={handleFinalize}
                  className="w-full bg-emerald-600 text-white font-bold py-6 rounded-3xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 text-lg flex flex-col items-center justify-center gap-1 group"
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-check-circle group-hover:scale-110 transition-transform"></i>
                    Applied Successfully
                  </span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Add to Dashboard</span>
                </button>
                
                <button onClick={() => setStep('CL_GEN')} className="text-slate-500 font-bold text-sm hover:text-slate-300 transition-colors">
                   Wait, I need to edit something
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewApplication;
