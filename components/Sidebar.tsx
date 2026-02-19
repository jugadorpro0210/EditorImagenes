
import React, { useState } from 'react';
import { AppMode } from '../types';
import { Sparkles, Wand2, Upload, Trash2, ChevronRight, Loader2 } from 'lucide-react';

interface SidebarProps {
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;
  onAction: (prompt: string, mode: AppMode) => void;
  isLoading: boolean;
  currentImage: string | null;
  setCurrentImage: (url: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeMode, 
  setActiveMode, 
  onAction, 
  isLoading, 
  currentImage, 
  setCurrentImage 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onAction(prompt, activeMode);
      setPrompt('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImage(event.target?.result as string);
        setActiveMode(AppMode.EDIT);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border-r border-gray-800/50 p-6">
      <div className="flex flex-col gap-6 flex-1">
        {/* Mode Selector */}
        <div className="flex p-1 bg-gray-900 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveMode(AppMode.CREATE)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeMode === AppMode.CREATE 
                ? 'bg-gray-800 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sparkles size={16} />
            Crear
          </button>
          <button
            onClick={() => setActiveMode(AppMode.EDIT)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeMode === AppMode.EDIT 
                ? 'bg-gray-800 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Wand2 size={16} />
            Editar
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {activeMode === AppMode.CREATE ? 'Instrucciones de creación' : 'Instrucciones de edición'}
          </label>
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeMode === AppMode.CREATE 
                ? "Describe la imagen que quieres crear..." 
                : "Describe qué quieres cambiar en la imagen actual..."}
              className="w-full h-32 bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg text-white transition-colors"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Acciones rápidas
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl cursor-pointer hover:border-gray-600 transition-all group">
              <Upload size={20} className="text-gray-400 group-hover:text-white" />
              <span className="text-xs text-gray-400 group-hover:text-white">Subir</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
            <button 
              onClick={() => setCurrentImage(null)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-900/50 hover:bg-red-950/20 transition-all group"
            >
              <Trash2 size={20} className="text-gray-400 group-hover:text-red-500" />
              <span className="text-xs text-gray-400 group-hover:text-red-500">Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Credits/Status Footer */}
      <div className="mt-auto pt-6 border-t border-gray-800/50 text-[10px] text-gray-600 flex justify-between items-center">
        <span>API Status: Online</span>
        <span>Version 1.0.2</span>
      </div>
    </div>
  );
};
