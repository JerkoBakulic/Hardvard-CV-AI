
export interface Experience {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  honors?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
}

export interface JobAnalysis {
  industry: string;
  roleFit: string;
  keywords: string[];
  interviewTips: string[];
  commonQuestions: { question: string; purpose: string; sampleAnswer: string }[];
}

export interface UnifiedResponse {
  cv: CVData;
  analysis?: JobAnalysis;
}

export type AppState = 'input' | 'processing' | 'result';
