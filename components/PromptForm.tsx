
import React, { useState } from 'react';
import { GenerateIcon } from './icons/GenerateIcon';

interface PromptFormProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700 shadow-lg">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A majestic lion wearing a crown in a futuristic city..."
        className="w-full flex-grow bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
        rows={2}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
      >
        <GenerateIcon />
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};

export default PromptForm;
