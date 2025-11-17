
import React, { useState, useCallback } from 'react';
import { GeneratedImage } from './types';
import { generateImage, editImage, upscaleImage } from './services/geminiService';
import { downloadImage } from './utils/fileUtils';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ImageGallery from './components/ImageGallery';
import EditModal from './components/EditModal';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await generateImage(prompt);
      const newImage: GeneratedImage = {
        id: `img-${Date.now()}`,
        src: `data:image/jpeg;base64,${base64Image}`,
        prompt: prompt,
      };
      setImages(prevImages => [newImage, ...prevImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEdit = useCallback(async (originalImage: GeneratedImage, editPrompt: string) => {
    if (!editPrompt) {
      setError('Please enter an editing prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditingImage(null);
    try {
      const originalImageBase64 = originalImage.src.split(',')[1];
      const editedBase64Image = await editImage(originalImageBase64, 'image/jpeg', editPrompt);
      
      const newImage: GeneratedImage = {
        id: `img-edited-${Date.now()}`,
        src: `data:image/png;base64,${editedBase64Image}`,
        prompt: `${originalImage.prompt} (Edited: ${editPrompt})`,
      };

      setImages(prevImages => prevImages.map(img => img.id === originalImage.id ? newImage : img));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image editing.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpscale = useCallback(async (imageToUpscale: GeneratedImage) => {
    setProcessingImageId(imageToUpscale.id);
    setError(null);
    try {
      const originalImageBase64 = imageToUpscale.src.split(',')[1];
      const mimeType = imageToUpscale.src.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
      const upscaledBase64Image = await upscaleImage(originalImageBase64, mimeType);

      const newImage: GeneratedImage = {
        ...imageToUpscale,
        id: `img-upscaled-${Date.now()}`,
        src: `data:image/png;base64,${upscaledBase64Image}`,
        prompt: `${imageToUpscale.prompt} (Upscaled)`,
      };

      setImages(prevImages => prevImages.map(img => img.id === imageToUpscale.id ? newImage : img));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image upscaling.');
    } finally {
      setProcessingImageId(null);
    }
  }, []);


  const handleDownload = (image: GeneratedImage) => {
    downloadImage(image.src, `${image.prompt.substring(0, 30)}.jpg`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto mb-8">
          <PromptForm onGenerate={handleGenerate} isLoading={isLoading} />
          {error && <p className="text-red-400 mt-4 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>

        <ImageGallery
          images={images}
          onEdit={setEditingImage}
          onDownload={handleDownload}
          onUpscale={handleUpscale}
          isLoading={isLoading}
          processingImageId={processingImageId}
        />
      </main>
      
      {editingImage && (
        <EditModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default App;
