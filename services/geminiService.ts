
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractJobDetails = async (jd: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract the company name, job role/title, and application deadline from the following job description. If a deadline is not found, leave it empty.
    
    Job Description:
    ${jd}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          jobRole: { type: Type.STRING },
          deadline: { type: Type.STRING },
        },
        required: ["companyName", "jobRole"]
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const generateLatexCV = async (profile: UserProfile, jobRole: string, companyName: string, jd: string) => {
  const baseTemplatePrompt = profile.baseCvSource 
    ? `Use the following LaTeX code as the BASE TEMPLATE. Keep its EXACT structure, document class, preamble, and formatting style. 
       Replace the content with the candidate's data and TWEAK/REWORD the experience and summary to perfectly match the Job Description.
       
       BASE TEMPLATE:
       ${profile.baseCvSource}`
    : `Generate a professional, self-contained LaTeX code (.tex). Use standard LaTeX classes (article, geometry, enumitem, hyperref). 
       Create a clean structure with Header, Summary, Experience, Education, and Skills.`;

  const prompt = `
    Task: Generate a tailored LaTeX CV (.tex) for ${profile.fullName} applying for ${jobRole} at ${companyName}.
    
    ${baseTemplatePrompt}

    Candidate Data for Content:
    Name: ${profile.fullName}
    Email: ${profile.email}
    Phone: ${profile.phone}
    Location: ${profile.location}
    LinkedIn: ${profile.linkedin}
    Summary: ${profile.summary}
    Experience: ${profile.experience}
    Education: ${profile.education}
    Skills: ${profile.skills}

    Job Description for Tailoring:
    ${jd}

    IMPORTANT: If a base template was provided, you MUST preserve its visual design (packages, colors, layout). 
    Output ONLY the LaTeX code. Start with \\documentclass.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.5,
    }
  });

  return response.text.replace(/```latex/g, '').replace(/```/g, '').trim();
};

export const generateCoverLetter = async (profile: UserProfile, jobRole: string, companyName: string, jd: string) => {
  const baseTemplatePrompt = profile.baseClSource
    ? `Use the following LaTeX code as the BASE TEMPLATE for the cover letter. Keep its structure and formatting.
       REPLACE the placeholder text with a professionally written cover letter for the role.
       
       BASE TEMPLATE:
       ${profile.baseClSource}`
    : `Write a professional and compelling cover letter. Output as plain text unless you feel LaTeX is requested. 
       If no template is provided, stick to professional formatting.`;

  const prompt = `
    Write a compelling cover letter for ${profile.fullName} applying for ${jobRole} at ${companyName}.
    Tailor it specifically to the job description below.
    
    ${baseTemplatePrompt}
    
    Candidate Info: ${profile.fullName}, ${profile.location}, ${profile.email}, ${profile.phone}
    Job Description:
    ${jd}

    IMPORTANT: If a LaTeX template was provided, you MUST output valid LaTeX code preserving that design.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    }
  });

  return response.text.replace(/```latex/g, '').replace(/```/g, '').trim();
};
