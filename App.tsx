
import React, { useState, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { AssistantPanel } from './components/AssistantPanel';
import { AppMode, Message } from './types';
import { generateImage, editImage, chatWithAssistant } from './services/geminiService';
import { Sparkles, Image as ImageIcon, MessageSquare, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CREATE);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAction = async (prompt: string, mode: AppMode) => {
    setIsLoading(true);
    try {
      let resultUrl: string | undefined;
      
      if (mode === AppMode.CREATE) {
        resultUrl = await generateImage(prompt);
      } else if (mode === AppMode.EDIT && currentImage) {
        resultUrl = await editImage(currentImage, prompt);
      }

      if (resultUrl) {
        setCurrentImage(resultUrl);
        // Add to assistant context as well
        setChatHistory(prev => [...prev, { 
          role: 'user', 
          content: `${mode === AppMode.CREATE ? 'Generar' : 'Editar'}: ${prompt}` 
        }, { 
          role: 'assistant', 
          content: '¡Listo! He procesado tu solicitud.',
          image: resultUrl
        }]);
      }
    } catch (error) {
      console.error("Action failed", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (content: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);
    try {
      const response = await chatWithAssistant(content, currentImage || undefined);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response || 'No pude procesar esa respuesta.' }]);
    } catch (error) {
      console.error("Chat failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-gray-200">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Left Sidebar: Tools & History */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static z-40 h-full w-72 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          activeMode={activeMode} 
          setActiveMode={setActiveMode}
          onAction={handleAction}
          isLoading={isLoading}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />
      </div>

      {/* Main Viewport: Canvas */}
      <main className="flex-1 flex flex-col relative bg-[#0f0f0f] border-x border-gray-800/50">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Lumina Studio
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-900 rounded border border-gray-800">
              v2.5 Gemini Engine
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]">
          <Canvas 
            image={currentImage} 
            isLoading={isLoading} 
            onImageUpload={(url) => {
              setCurrentImage(url);
              setActiveMode(AppMode.EDIT);
            }}
          />
        </div>
      </main>

      {/* Right Sidebar: Assistant */}
      <div className="hidden xl:block w-96 border-l border-gray-800/50">
        <AssistantPanel 
          messages={chatHistory}
          onSendMessage={handleChatMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default App;
