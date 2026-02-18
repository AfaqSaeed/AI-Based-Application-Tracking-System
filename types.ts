
export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  baseCvSource: string;
  baseClSource: string; // New field for LaTeX cover letter template
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobRole: string;
  deadline: string;
  jobDescription: string;
  status: 'Draft' | 'Applied';
  latexCv: string;
  coverLetter: string;
  appliedDate?: string;
  jobUrl?: string;
}

export type ApplicationStep = 'JD_INPUT' | 'EXTRACTION' | 'CV_GEN' | 'CL_GEN' | 'REVIEW';
