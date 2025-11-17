
import React from 'react';
import { GeneratedImage } from '../types';
import ImageCard from './ImageCard';
import Spinner from './Spinner';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onEdit: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onUpscale: (image: GeneratedImage) => void;
  isLoading: boolean;
  processingImageId: string | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onEdit, onDownload, onUpscale, isLoading, processingImageId }) => {
  if (isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-400 h-64">
        <Spinner />
        <p className="mt-4 text-lg">Your creation is materializing...</p>
      </div>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16">
        <p className="text-xl">Your generated images will appear here.</p>
        <p>Let your imagination run wild!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {images.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          onEdit={onEdit}
          onDownload={onDownload}
          onUpscale={onUpscale}
          isProcessing={image.id === processingImageId}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
