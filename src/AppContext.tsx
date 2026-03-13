import React, { createContext, useContext, useState, useCallback } from 'react';
import { ResumeData, Language, DocumentType } from './types';
import { generateId } from './utils';

const initialResumeData: ResumeData = {
  fullName: 'John Doe',
  jobTitle: 'Software Engineer',
  email: 'john.doe@example.com',
  phone: '+1 234 567 890',
  location: 'New York, USA',
  linkedin: 'linkedin.com/in/johndoe',
  summary: 'A passionate software engineer with experience in building scalable web applications.',
  experience: [
    {
      id: generateId(),
      title: 'Frontend Developer',
      company: 'Tech Corp',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Developed and maintained user-facing features using React and TypeScript. Improved performance by 20%.',
    },
  ],
  education: [
    {
      id: generateId(),
      degree: 'B.S. in Computer Science',
      institution: 'University of Technology',
      year: '2019',
    },
  ],
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  languages: ['English (Native)', 'Spanish (Intermediate)'],
  coverLetterBody: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at your company. With my background in frontend development and passion for creating intuitive user experiences, I am confident in my ability to contribute effectively to your team.\n\nSincerely,\nJohn Doe',
  sectionTitles: {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
  },
  hiddenSections: [],
};

interface AppContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  updateResumeData: (updates: Partial<ResumeData>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (data: ResumeData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ResumeData[]>([initialResumeData]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [documentType, setDocumentType] = useState<DocumentType>('resume');

  const resumeData = history[currentIndex];

  const pushHistory = useCallback((newData: ResumeData) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newData];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const setResumeData = useCallback((data: ResumeData) => {
    pushHistory(data);
  }, [pushHistory]);

  const updateResumeData = useCallback((updates: Partial<ResumeData>) => {
    pushHistory({ ...resumeData, ...updates });
  }, [resumeData, pushHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, history.length]);

  return (
    <AppContext.Provider
      value={{
        resumeData,
        setResumeData,
        updateResumeData,
        language,
        setLanguage,
        documentType,
        setDocumentType,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        pushHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
