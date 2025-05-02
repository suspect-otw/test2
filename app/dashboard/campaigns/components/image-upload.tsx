'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onImageUpload: (url: string, file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onImageUpload, onError, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [completedFiles, setCompletedFiles] = useState(0);
  const [previews, setPreviews] = useState<{ url: string, name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTotalFiles(files.length);
    setCompletedFiles(0);
    
    // Generate previews for all files
    const newPreviews = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews(newPreviews);
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Instead of actually uploading to storage, we'll just pass the file to the parent
        // The actual upload will happen when the form is submitted
        onImageUpload(newPreviews[i].url, file);
        
        // Update progress
        setCompletedFiles(prev => prev + 1);
        setUploadProgress(Math.floor(((i + 1) / files.length) * 100));
        
      } catch (error) {
        console.error('Preview error:', error);
        onError(`Failed to process ${file.name}. Please try again.`);
      }
    }
    
    // Reset states after all uploads
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clean up preview URLs are handled by parent component
      setPreviews([]);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50 transition-colors'}`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              {isUploading 
                ? `Processing... ${completedFiles}/${totalFiles} (${uploadProgress}%)`
                : disabled 
                  ? 'Image upload limit reached'
                  : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1 px-4 text-center">
              JPG, PNG, GIF (Select multiple files by holding Ctrl/Cmd)
            </p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || disabled}
            multiple  // Enable multiple file selection
          />
        </label>
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="w-full">
          <p className="text-sm font-medium mb-2">Processing these images:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                <div className="mt-4 flex flex-wrap gap-3">
                  {preview && (
                    <div className="relative rounded-md border border-border overflow-hidden group">
                      <Image 
                        src={preview.url} 
                        alt={preview.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => {
                          // Implement the logic to clear the preview
                        }}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <XMarkIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 