import React from 'react';
import { useAppContext } from '../AppContext';
import { EditableText } from './EditableText';

export const CoverLetterPreview: React.FC = () => {
  const { resumeData, updateResumeData } = useAppContext();

  const handleUpdate = (field: keyof typeof resumeData, value: any) => {
    updateResumeData({ [field]: value });
  };

  return (
    <div className="bg-white shadow-xl mx-auto print-container w-full max-w-[210mm] min-h-[297mm] p-[25mm] print:p-[25mm]">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-6 mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <EditableText value={resumeData.fullName} onChange={(val) => handleUpdate('fullName', val)} />
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <EditableText value={resumeData.email} onChange={(val) => handleUpdate('email', val)} />
          <span>•</span>
          <EditableText value={resumeData.phone} onChange={(val) => handleUpdate('phone', val)} />
          <span>•</span>
          <EditableText value={resumeData.location} onChange={(val) => handleUpdate('location', val)} />
          <span>•</span>
          <EditableText value={resumeData.linkedin} onChange={(val) => handleUpdate('linkedin', val)} />
        </div>
      </header>

      {/* Date */}
      <div className="mb-8 text-gray-800">
        <EditableText value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} onChange={() => {}} />
      </div>

      {/* Body */}
      <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[400px]">
        <EditableText 
          multiline 
          value={resumeData.coverLetterBody || 'Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company...\n\nSincerely,\n' + resumeData.fullName} 
          onChange={(val) => handleUpdate('coverLetterBody', val)} 
        />
      </div>
    </div>
  );
};
