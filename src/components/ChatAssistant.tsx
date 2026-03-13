import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Undo2, Redo2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '../AppContext';
import { ResumeData } from '../types';
import { generateId } from '../utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant: React.FC = () => {
  const { resumeData, setResumeData, language, undo, redo, canUndo, canRedo, documentType } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: language === 'ar' 
        ? 'مرحباً! أنا مساعدك الذكي لبناء السيرة الذاتية. أخبرني عن خبراتك، مهاراتك، أو أي شيء تريد إضافته وسأقوم بصياغته بشكل احترافي.'
        : 'Hello! I am your AI Resume Assistant. Tell me about your experience, skills, or anything you want to add, and I will format it professionally for ATS.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: generateId(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `
You are an expert ATS resume builder and career coach.
The user is currently editing their ${documentType === 'resume' ? 'Resume' : 'Cover Letter'}.
The user's current data is provided below in JSON format.
The user will give you instructions or new information.
Your task is to:
1. Understand the user's request.
2. If they provide work experience, rewrite it using the STAR method (Situation, Task, Action, Result) and include ATS-friendly keywords.
3. Update the JSON data accordingly.
4. ALWAYS return the ENTIRE updated JSON object matching the ResumeData interface. Do not omit existing data unless the user asks to delete it.
5. Ensure all arrays (experience, education, skills, languages) are present. If empty, return [].
6. If adding new items to arrays, generate a unique string 'id' for them.
7. Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON string.

Current ResumeData JSON:
${JSON.stringify(resumeData)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      let responseText = response.text || '';
      
      // Clean up markdown formatting if the model still returns it
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      try {
        const updatedData: ResumeData = JSON.parse(responseText.trim());
        
        // Ensure arrays and IDs
        const sanitizeArray = (arr: any[]) => (Array.isArray(arr) ? arr.map(item => ({ ...item, id: item.id || generateId() })) : []);
        
        const sanitizedData: ResumeData = {
          ...updatedData,
          experience: sanitizeArray(updatedData.experience),
          education: sanitizeArray(updatedData.education),
          skills: Array.isArray(updatedData.skills) ? updatedData.skills : [],
          languages: Array.isArray(updatedData.languages) ? updatedData.languages : [],
          hiddenSections: Array.isArray(updatedData.hiddenSections) ? updatedData.hiddenSections : [],
        };

        setResumeData(sanitizedData);
        
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: isRTL ? 'تم تحديث المستند بنجاح! يمكنك مراجعته الآن.' : 'Document updated successfully! Please review the changes.',
          },
        ]);
      } catch (parseError) {
        console.error('Failed to parse JSON:', responseText, parseError);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: isRTL ? 'عذراً، حدث خطأ أثناء معالجة البيانات. يرجى المحاولة مرة أخرى.' : 'Sorry, there was an error processing the data. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: isRTL ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' : 'Sorry, there was a connection error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="no-print flex flex-col h-[calc(100vh-73px)] bg-gray-50 border-r border-l border-gray-200 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-800">{isRTL ? 'المساعد الذكي' : 'AI Assistant'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
            title={isRTL ? 'تراجع' : 'Undo'}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
            title={isRTL ? 'إعادة' : 'Redo'}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-white border border-gray-200'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4 text-indigo-600" /> : <Bot className="h-4 w-4 text-gray-600" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <Bot className="h-4 w-4 text-gray-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
              <span className="text-sm text-gray-500">{isRTL ? 'جاري التفكير...' : 'Thinking...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isRTL ? 'أخبرني عن خبراتك...' : 'Tell me about your experience...'}
            className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[44px] max-h-32"
            rows={1}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="mt-2 text-xs text-center text-gray-400">
          {isRTL ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد' : 'Press Enter to send, Shift+Enter for new line'}
        </div>
      </div>
    </div>
  );
};
