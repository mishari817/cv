import React from 'react';
import { FileText, FileSignature, Printer, Languages } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage, documentType, setDocumentType } = useAppContext();

  const handlePrint = () => {
    window.print();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isRTL = language === 'ar';

  return (
    <nav className="no-print sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI Resume Builder'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setDocumentType('resume')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              documentType === 'resume'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            {isRTL ? 'السيرة الذاتية' : 'Resume'}
          </button>
          <button
            onClick={() => setDocumentType('coverLetter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              documentType === 'coverLetter'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileSignature className="h-4 w-4" />
            {isRTL ? 'رسالة التغطية' : 'Cover Letter'}
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Languages className="h-4 w-4" />
          {isRTL ? 'English' : 'عربي'}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" />
          {isRTL ? 'طباعة / PDF' : 'Print / PDF'}
        </button>
      </div>
    </nav>
  );
};
