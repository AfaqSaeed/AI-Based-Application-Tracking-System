
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserProfile, JobApplication } from './types';
import Dashboard from './components/Dashboard';
import NewApplication from './components/NewApplication';
import ProfileSettings from './components/ProfileSettings';

const Navbar: React.FC = () => (
  <nav className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <i className="fas fa-paper-plane"></i>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            ApplyFlow
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-slate-400 hover:text-indigo-400 font-medium transition-colors">
            Dashboard
          </Link>
          <Link to="/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-all shadow-md shadow-indigo-900/20 flex items-center gap-2">
            <i className="fas fa-plus text-sm"></i>
            New Application
          </Link>
          <Link to="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors">
            <i className="fas fa-user-circle text-2xl"></i>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('applyflow_profile');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: '',
      experience: '',
      education: '',
      skills: '',
      baseCvSource: '',
      baseClSource: ''
    };
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('applyflow_apps');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('applyflow_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('applyflow_apps', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (app: JobApplication) => {
    setApplications(prev => [app, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard applications={applications} />} />
            <Route 
              path="/new" 
              element={<NewApplication profile={profile} onComplete={addApplication} />} 
            />
            <Route 
              path="/profile" 
              element={<ProfileSettings profile={profile} onSave={setProfile} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
