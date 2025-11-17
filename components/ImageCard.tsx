
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { EditIcon } from './icons/EditIcon';
import { UpscaleIcon } from './icons/UpscaleIcon';
import Spinner from './Spinner';

interface ImageCardProps {
  image: GeneratedImage;
  onEdit: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onUpscale: (image: GeneratedImage) => void;
  isProcessing: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit, onDownload, onUpscale, isProcessing }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800 border border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20">
      <img src={image.src} alt={image.prompt} className={`w-full h-full object-cover aspect-square transition-all ${isProcessing ? 'blur-sm brightness-50' : ''}`} />
      
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Spinner />
        </div>
      )}

      <div className={`absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between ${isProcessing ? 'hidden' : ''}`}>
        <p className="text-sm text-gray-200 line-clamp-4">{image.prompt}</p>
        <div className="flex justify-end gap-3">
           <button
            onClick={() => onUpscale(image)}
            className="p-2 rounded-full bg-gray-700/80 hover:bg-purple-500 transition-colors"
            title="Upscale Image"
          >
            <UpscaleIcon />
          </button>
          <button
            onClick={() => onEdit(image)}
            className="p-2 rounded-full bg-gray-700/80 hover:bg-blue-500 transition-colors"
            title="Edit Image"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDownload(image)}
            className="p-2 rounded-full bg-gray-700/80 hover:bg-green-500 transition-colors"
            title="Download Image"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
