import { useState } from "react";
import { CampaignImage } from "@/types/campaign";
import { AlertTriangle } from "lucide-react";
import ImageUpload from "@/app/dashboard/campaigns/components/image-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Maximum file size in bytes (5MB)
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// Format file size to readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(2) + ' MB';
};

// Helper function to truncate file names
export const truncateFileName = (name: string, maxLength = 15): string => {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop() || '';
  const nameWithoutExt = name.substring(0, name.length - ext.length - 1);
  return `${nameWithoutExt.substring(0, maxLength - ext.length - 3)}...${ext}`;
};

interface CampaignImageManagerProps {
  images: { url: string; file: File }[];
  existingImages: CampaignImage[];
  totalImageSize: number;
  isSizeExceeded: boolean;
  uploadError: string | null;
  isLoadingImages: boolean;
  onImageUpload: (url: string, file: File) => void;
  onImageRemove: (index: number) => void;
  onExistingImageRemove: (image: CampaignImage) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
}

export default function CampaignImageManager({
  images,
  existingImages,
  totalImageSize,
  isSizeExceeded,
  uploadError,
  isLoadingImages,
  onImageUpload,
  onImageRemove,
  onExistingImageRemove,
  onUploadError,
  disabled = false
}: CampaignImageManagerProps) {
  const [imageToDelete, setImageToDelete] = useState<CampaignImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const confirmImageDelete = (image: CampaignImage) => {
    setImageToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const handleExistingImageRemove = async () => {
    if (!imageToDelete) return;
    onExistingImageRemove(imageToDelete);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Campaign Images</h3>
        <p className="text-sm text-muted-foreground">
          Upload images for your campaign. Maximum total size: {MAX_IMAGE_SIZE_MB}MB.
        </p>
      </div>

      {/* Display current total size */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Total size: {formatFileSize(totalImageSize)}
        </div>
        <div className={`text-sm ${isSizeExceeded ? 'text-destructive font-medium' : ''}`}>
          {isSizeExceeded && (
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Size limit exceeded
            </div>
          )}
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="p-3 bg-destructive/20 text-destructive rounded-md text-sm">
          {uploadError}
        </div>
      )}

      {/* New Image Upload */}
      <ImageUpload 
        onImageUpload={onImageUpload}
        onError={onUploadError}
        disabled={disabled || isSizeExceeded}
      />

      {/* Display existing images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Existing Images</h4>
          {isLoadingImages ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse bg-muted rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image) => (
                <div key={image.id} className="group relative aspect-square rounded-md overflow-hidden border bg-muted">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${image.filePath}`}
                    alt={image.fileName || "Campaign image"}
                    className="w-full h-full object-cover"
                    fill
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/png?text=Error';
                    }}
                  />
                  {/* Remove button for mobile */}
                  <Button 
                    variant="destructive"
                    size="icon"
                    type="button"
                    className="absolute top-1 left-1 rounded-full w-7 h-7 md:hidden"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmImageDelete(image);
                    }}
                    disabled={disabled}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                  {/* Hover-based remove button for desktop */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                    <Button 
                      variant="destructive"
                      size="sm"
                      type="button"
                      className="opacity-90"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmImageDelete(image);
                      }}
                      disabled={disabled}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                    {image.fileName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Images Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">New Images to Upload</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="group relative aspect-square rounded-md overflow-hidden border bg-muted">
                <Image
                  src={image.url}
                  alt={`New image ${index + 1}`}
                  className="w-full h-full object-cover"
                  fill
                  unoptimized
                />
                {/* Remove button for mobile */}
                <Button 
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="absolute top-1 left-1 rounded-full w-7 h-7 md:hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onImageRemove(index);
                  }}
                  disabled={disabled}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
                {/* Hover-based remove button for desktop */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                  <Button 
                    variant="destructive"
                    size="sm"
                    type="button"
                    className="opacity-90"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onImageRemove(index);
                    }}
                    disabled={disabled}
                  >
                    Remove
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                  {image.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleExistingImageRemove();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 