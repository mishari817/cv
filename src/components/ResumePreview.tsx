import React from 'react';
import { useAppContext } from '../AppContext';
import { EditableText } from './EditableText';
import { Trash2, EyeOff, Eye } from 'lucide-react';
import { Experience, Education } from '../types';
import { generateId } from '../utils';

export const ResumePreview: React.FC = () => {
  const { resumeData, updateResumeData, language } = useAppContext();
  const isRTL = language === 'ar';

  const handleUpdate = (field: keyof typeof resumeData, value: any) => {
    updateResumeData({ [field]: value });
  };

  const handleArrayUpdate = (field: 'experience' | 'education' | 'skills' | 'languages', index: number, subField: string, value: any) => {
    const newArray = [...resumeData[field]] as any[];
    if (typeof newArray[index] === 'object') {
      newArray[index] = { ...newArray[index], [subField]: value };
    } else {
      newArray[index] = value;
    }
    updateResumeData({ [field]: newArray });
  };

  const handleDeleteItem = (field: 'experience' | 'education' | 'skills' | 'languages', index: number) => {
    const newArray = [...resumeData[field]];
    newArray.splice(index, 1);
    updateResumeData({ [field]: newArray });
  };

  const toggleSection = (section: string) => {
    const hidden = resumeData.hiddenSections || [];
    if (hidden.includes(section)) {
      updateResumeData({ hiddenSections: hidden.filter((s) => s !== section) });
    } else {
      updateResumeData({ hiddenSections: [...hidden, section] });
    }
  };

  const isHidden = (section: string) => (resumeData.hiddenSections || []).includes(section);

  const SectionHeader = ({ title, sectionId }: { title: string; sectionId: string }) => (
    <div className="group flex items-center justify-between border-b-2 border-gray-800 mb-4 pb-1 mt-6 print:mt-4 print:mb-2">
      <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900">
        <EditableText
          value={title}
          onChange={(val) =>
            updateResumeData({
              sectionTitles: { ...resumeData.sectionTitles, [sectionId]: val },
            })
          }
        />
      </h2>
      <button
        onClick={() => toggleSection(sectionId)}
        className="no-print opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
        title={isHidden(sectionId) ? 'Show Section' : 'Hide Section'}
      >
        {isHidden(sectionId) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="bg-white shadow-xl mx-auto print-container w-full max-w-[210mm] min-h-[297mm] p-[20mm] print:p-[20mm]">
      {/* Header */}
      <header className="text-center mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          <EditableText value={resumeData.fullName} onChange={(val) => handleUpdate('fullName', val)} />
        </h1>
        <div className="text-lg text-gray-700 font-medium mb-3">
          <EditableText value={resumeData.jobTitle} onChange={(val) => handleUpdate('jobTitle', val)} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          <EditableText value={resumeData.email} onChange={(val) => handleUpdate('email', val)} />
          <span>•</span>
          <EditableText value={resumeData.phone} onChange={(val) => handleUpdate('phone', val)} />
          <span>•</span>
          <EditableText value={resumeData.location} onChange={(val) => handleUpdate('location', val)} />
          <span>•</span>
          <EditableText value={resumeData.linkedin} onChange={(val) => handleUpdate('linkedin', val)} />
        </div>
      </header>

      {/* Summary */}
      {!isHidden('summary') && (
        <section className={isHidden('summary') ? 'opacity-50 print:hidden' : ''}>
          <SectionHeader title={resumeData.sectionTitles?.summary || 'Professional Summary'} sectionId="summary" />
          <div className="text-sm text-gray-800 leading-relaxed">
            <EditableText multiline value={resumeData.summary} onChange={(val) => handleUpdate('summary', val)} />
          </div>
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && (
        <section className={isHidden('experience') ? 'opacity-50 print:hidden' : ''}>
          <SectionHeader title={resumeData.sectionTitles?.experience || 'Experience'} sectionId="experience" />
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="group relative">
                <button
                  onClick={() => handleDeleteItem('experience', index)}
                  className="no-print absolute -start-8 top-1 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">
                    <EditableText value={exp.title} onChange={(val) => handleArrayUpdate('experience', index, 'title', val)} />
                  </h3>
                  <div className="text-sm font-medium text-gray-600">
                    <EditableText value={exp.startDate} onChange={(val) => handleArrayUpdate('experience', index, 'startDate', val)} />
                    {' - '}
                    <EditableText value={exp.endDate} onChange={(val) => handleArrayUpdate('experience', index, 'endDate', val)} />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2 italic">
                  <EditableText value={exp.company} onChange={(val) => handleArrayUpdate('experience', index, 'company', val)} />
                </div>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  <EditableText multiline value={exp.description} onChange={(val) => handleArrayUpdate('experience', index, 'description', val)} />
                </div>
              </div>
            ))}
            <button
              onClick={() => updateResumeData({ experience: [...resumeData.experience, { id: generateId(), title: '', company: '', startDate: '', endDate: '', description: '' }] })}
              className="no-print text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add Experience
            </button>
          </div>
        </section>
      )}

      {/* Education */}
      {!isHidden('education') && (
        <section className={isHidden('education') ? 'opacity-50 print:hidden' : ''}>
          <SectionHeader title={resumeData.sectionTitles?.education || 'Education'} sectionId="education" />
          <div className="space-y-3">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="group relative flex justify-between items-baseline">
                <button
                  onClick={() => handleDeleteItem('education', index)}
                  className="no-print absolute -start-8 top-0 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="font-bold text-gray-900">
                    <EditableText value={edu.degree} onChange={(val) => handleArrayUpdate('education', index, 'degree', val)} />
                  </h3>
                  <div className="text-sm text-gray-700">
                    <EditableText value={edu.institution} onChange={(val) => handleArrayUpdate('education', index, 'institution', val)} />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  <EditableText value={edu.year} onChange={(val) => handleArrayUpdate('education', index, 'year', val)} />
                </div>
              </div>
            ))}
            <button
              onClick={() => updateResumeData({ education: [...resumeData.education, { id: generateId(), degree: '', institution: '', year: '' }] })}
              className="no-print text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add Education
            </button>
          </div>
        </section>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-8 mt-6 print:mt-4">
        {!isHidden('skills') && (
          <section className={isHidden('skills') ? 'opacity-50 print:hidden' : ''}>
            <SectionHeader title={resumeData.sectionTitles?.skills || 'Skills'} sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="group relative bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                  <EditableText value={skill} onChange={(val) => handleArrayUpdate('skills', index, '', val)} />
                  <button
                    onClick={() => handleDeleteItem('skills', index)}
                    className="no-print absolute -top-2 -end-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateResumeData({ skills: [...resumeData.skills, 'New Skill'] })}
                className="no-print text-sm text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1"
              >
                + Add
              </button>
            </div>
          </section>
        )}

        {!isHidden('languages') && (
          <section className={isHidden('languages') ? 'opacity-50 print:hidden' : ''}>
            <SectionHeader title={resumeData.sectionTitles?.languages || 'Languages'} sectionId="languages" />
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang, index) => (
                <div key={index} className="group relative bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
                  <EditableText value={lang} onChange={(val) => handleArrayUpdate('languages', index, '', val)} />
                  <button
                    onClick={() => handleDeleteItem('languages', index)}
                    className="no-print absolute -top-2 -end-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateResumeData({ languages: [...resumeData.languages, 'New Language'] })}
                className="no-print text-sm text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1"
              >
                + Add
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
