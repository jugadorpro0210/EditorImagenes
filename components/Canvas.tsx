
import React from 'react';
import { Loader2, ImagePlus, Download } from 'lucide-react';

interface CanvasProps {
  image: string | null;
  isLoading: boolean;
  onImageUpload: (url: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ image, isLoading, onImageUpload }) => {
  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `lumina-export-${Date.now()}.png`;
      link.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="w-full max-w-4xl aspect-square relative group bg-gray-950 rounded-2xl border-2 border-dashed border-gray-800/50 flex flex-col items-center justify-center transition-all overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
          <p className="text-white font-medium animate-pulse">Invocando a la IA creativa...</p>
        </div>
      )}

      {image ? (
        <>
          <img 
            src={image} 
            alt="Workspace" 
            className="w-full h-full object-contain z-10 animate-in fade-in zoom-in duration-500" 
          />
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white shadow-xl flex items-center gap-2 border border-white/10 transition-all"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Descargar</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-6 p-12 text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center border border-gray-800 shadow-inner">
            <ImagePlus className="text-gray-600" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Tu lienzo está vacío</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Sube una imagen o usa el panel lateral para generar una nueva con inteligencia artificial.
            </p>
          </div>
          <label className="px-6 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-sm font-medium cursor-pointer transition-all">
            Seleccionar archivo
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => onImageUpload(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </label>
        </div>
      )}

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-800 rounded-tl"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-800 rounded-tr group-hover:hidden"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-800 rounded-bl"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-800 rounded-br"></div>
    </div>
  );
};
