
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an image using the Imagen model.
 * @param prompt The text prompt for image generation.
 * @returns A base64 encoded string of the generated JPEG image.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `An ultra-realistic, photorealistic image of: ${prompt}. Cinematic lighting, 8k resolution, professional photography.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return base64ImageBytes;
    } else {
      throw new Error('No image was generated.');
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error('Failed to generate image. Please check your prompt or API key.');
  }
};

/**
 * Edits an existing image using a text prompt.
 * @param base64ImageData The base64 encoded string of the source image.
 * @param mimeType The MIME type of the source image.
 * @param prompt The text prompt for editing instructions.
 * @returns A base64 encoded string of the edited PNG image.
 */
export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return base64ImageBytes;
        }
      }
    }
    
    throw new Error('No edited image was returned.');

  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error('Failed to edit image. The model may not have been able to fulfill the request.');
  }
};

/**
 * Upscales an existing image using an AI model.
 * @param base64ImageData The base64 encoded string of the source image.
 * @param mimeType The MIME type of the source image.
 * @returns A base64 encoded string of the upscaled PNG image.
 */
export const upscaleImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Upscale this image, significantly increasing its resolution and enhancing fine details. Maintain photorealism and clarity. Do not add, remove, or change any objects or subjects in the image.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return base64ImageBytes;
        }
      }
    }
    
    throw new Error('No upscaled image was returned.');

  } catch (error) {
    console.error("Error upscaling image:", error);
    throw new Error('Failed to upscale image. The model may not have been able to fulfill the request.');
  }
};
