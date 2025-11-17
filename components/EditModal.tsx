
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { EditIcon } from './icons/EditIcon';

interface EditModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onEdit: (image: GeneratedImage, editPrompt: string) => void;
  isLoading: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ image, onClose, onEdit, isLoading }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(image, editPrompt);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-4 p-6 relative border border-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" title="Close">
          <CloseIcon />
        </button>
        
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img src={image.src} alt={image.prompt} className="rounded-md w-full h-full object-contain" />
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Edit Image</h2>
          <p className="text-sm text-gray-400 mb-4 italic line-clamp-3">Original Prompt: {image.prompt}</p>
          <form onSubmit={handleEditSubmit} className="flex flex-col flex-grow">
            <label htmlFor="edit-prompt" className="mb-2 font-semibold text-gray-300">Editing Instructions</label>
            <textarea
              id="edit-prompt"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="e.g., Change the background to a sunny beach..."
              className="w-full flex-grow bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              rows={5}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !editPrompt.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              <EditIcon />
              {isLoading ? 'Applying Edit...' : 'Apply Edit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
