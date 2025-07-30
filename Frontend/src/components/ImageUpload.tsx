
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, User } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload = ({ onImageSelect, currentImage, className = '' }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  return (
    <Card className={`relative ${className}`}>
      <CardContent className="p-4">
        <div
          className={`relative w-32 h-32 mx-auto border-2 border-dashed rounded-2xl transition-all duration-300 ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
              <User className="h-8 w-8 mb-2" />
              <p className="text-xs text-center">Drop image here or click to upload</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG up to 5MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
