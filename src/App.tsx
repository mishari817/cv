import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { Navbar } from './components/Navbar';
import { ChatAssistant } from './components/ChatAssistant';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { motion } from 'motion/react';

const AppContent = () => {
  const { language, documentType } = useAppContext();
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <div className={`no-print w-96 flex-shrink-0 bg-white border-gray-200 ${isRTL ? 'border-l' : 'border-r'} z-10 shadow-sm`}>
          <ChatAssistant />
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 print:p-0 print:bg-white print:overflow-visible">
          <motion.div
            key={documentType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center w-full"
          >
            {documentType === 'resume' ? <ResumePreview /> : <CoverLetterPreview />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
