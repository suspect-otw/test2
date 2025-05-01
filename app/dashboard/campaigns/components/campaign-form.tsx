"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Campaign, CampaignImage } from "@/types/campaign";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/app/data/campaigns/create";
import { updateCampaign } from "@/app/data/campaigns/update";
import { deleteCampaignImage } from "@/app/data/campaigns/delete-image";
import { getCampaignImages } from "@/app/data/campaigns/get-images";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "./image-upload";

// Maximum file size in bytes (5MB)
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// Define form schema using zod
const formSchema = z.object({
  campaignTitle: z.string().min(1, "Campaign title is required"),
  brandName: z.string().min(1, "Brand name is required"),
  dateRange: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date({ required_error: "End date is required" }),
  }),
  budget: z.string().min(1, "Budget is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Budget must be a valid number greater than 0" }
  ),
  description: z.string().optional(),
});

// Format file size to readable format
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(2) + ' MB';
};

// Helper function to truncate file names
const truncateFileName = (name: string, maxLength = 15): string => {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop() || '';
  const nameWithoutExt = name.substring(0, name.length - ext.length - 1);
  return `${nameWithoutExt.substring(0, maxLength - ext.length - 3)}...${ext}`;
};

// Props interface
interface CampaignFormProps {
  initialData?: Campaign;
  onSuccess?: () => void;
}

export default function CampaignForm({ initialData, onSuccess }: CampaignFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [existingImages, setExistingImages] = useState<CampaignImage[]>([]);
  const [totalImageSize, setTotalImageSize] = useState(0);
  const [isSizeExceeded, setIsSizeExceeded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<CampaignImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Calculate total size of new images
  useEffect(() => {
    const newImagesSize = images.reduce((total, img) => total + img.file.size, 0);
    const existingImagesSize = existingImages.reduce((total, img) => total + Number(img.fileSize), 0);
    const totalSize = newImagesSize + existingImagesSize;
    
    setTotalImageSize(totalSize);
    setIsSizeExceeded(totalSize > MAX_IMAGE_SIZE_BYTES);
  }, [images, existingImages]);
  
  // Fetch existing images for the campaign if editing
  useEffect(() => {
    const fetchCampaignImages = async () => {
      if (initialData?.id) {
        setIsLoadingImages(true);
        try {
          const { data, error } = await getCampaignImages(initialData.id);
          
          if (error || !data) {
            console.error("Error fetching campaign images:", error);
            return;
          }
          
          if (data.images && data.images.length > 0) {
            setExistingImages(data.images);
          }
        } catch (error) {
          console.error("Error fetching campaign images:", error);
        } finally {
          setIsLoadingImages(false);
        }
      }
    };
    
    fetchCampaignImages();
  }, [initialData?.id]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          campaignTitle: initialData.campaignTitle,
          brandName: initialData.brandName,
          dateRange: {
            from: new Date(initialData.startDate),
            to: new Date(initialData.endDate),
          },
          budget: initialData.budget.toString(),
          description: initialData.description || "",
        }
      : {
          campaignTitle: "",
          brandName: "",
          dateRange: {
            from: new Date(),
            to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
          budget: "",
          description: "",
        },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isSizeExceeded) {
      setFormError(`Total image size exceeds the ${MAX_IMAGE_SIZE_MB}MB limit. Please remove some images.`);
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Prepare image upload data
      const imageUploads = images.map((img) => ({
        file: img.file,
        fileName: img.file.name,
        fileSize: img.file.size,
        contentType: img.file.type
      }));
      
      // Create campaign data
      const campaignData = {
        campaignTitle: data.campaignTitle,
        brandName: data.brandName,
        startDate: data.dateRange.from,
        endDate: data.dateRange.to,
        budget: data.budget,
        description: data.description,
        images: imageUploads
      };
      
      let result;
      
      if (initialData) {
        // Update existing campaign
        result = await updateCampaign(
          initialData.id,
          {
            campaignTitle: data.campaignTitle,
            brandName: data.brandName,
            startDate: data.dateRange.from,
            endDate: data.dateRange.to,
            budget: data.budget,
            description: data.description,
            images: imageUploads
          }
        );
      } else {
        // Create new campaign
        result = await createCampaign(campaignData);
      }
      
      if (result.error) {
        setFormError(result.error);
        return;
      }
      
      // Success! Refresh the page and close the modal
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (url: string, file: File) => {
    setImages(prev => [...prev, { url, file }]);
  };

  // Handle image removal
  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Prompt to delete existing image
  const confirmImageDelete = (image: CampaignImage) => {
    setImageToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  // Handle existing image removal
  const handleExistingImageRemove = async () => {
    if (!imageToDelete) return;
    
    try {
      // Delete the image
      const { success, error } = await deleteCampaignImage(imageToDelete.id);
      
      if (error) {
        setUploadError(`Failed to remove image: ${error}`);
        return;
      }
      
      // Update UI
      setExistingImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Error removing image:", error);
      setUploadError("Failed to remove image");
    }
  };

  // Handle image upload error
  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  // Get image names for display
  const getImageNames = () => {
    const existingNames = existingImages.map(img => truncateFileName(img.fileName));
    const newNames = images.map(img => truncateFileName(img.file.name));
    return [...existingNames, ...newNames].join(", ");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-auto max-w-full">
          {formError && (
            <div className="p-3 bg-destructive/20 text-destructive rounded-md">
              {formError}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="campaignTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Campaign Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter budget amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel>Campaign Images</FormLabel>
              <div className={cn(
                "text-sm font-medium",
                isSizeExceeded ? "text-destructive" : "text-muted-foreground"
              )}>
                {formatFileSize(totalImageSize)} / {MAX_IMAGE_SIZE_MB}MB
                {isSizeExceeded && (
                  <AlertTriangle className="inline-block ml-1 h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            
            {uploadError && (
              <div className="p-3 mb-2 bg-destructive/20 text-destructive rounded-md text-sm">
                {uploadError}
              </div>
            )}
            
            {(existingImages.length > 0 || images.length > 0) && (
              <div className="mt-2 mb-3">
                <p className="text-xs text-muted-foreground truncate">
                  {getImageNames()}
                </p>
              </div>
            )}
            
            {isLoadingImages ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Existing Images</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4 w-full">
                      {existingImages.map((image) => {
                        // Construct a public URL for the image
                        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${image.filePath}`;
                        
                        return (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-md border bg-muted">
                              <img
                                src={imageUrl}
                                alt={image.fileName}
                                className="object-cover w-full h-full transition-all hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/png?text=Error';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => confirmImageDelete(image)}
                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-md p-1 w-6 h-6 flex items-center justify-center shadow-md opacity-90 hover:opacity-100"
                                aria-label="Remove image"
                              >
                                ×
                              </button>
                              
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1">
                                <p className="text-white text-xs truncate">
                                  {truncateFileName(image.fileName)}
                                </p>
                                <p className="text-gray-300 text-xs mt-0.5">
                                  {formatFileSize(Number(image.fileSize))}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* New Images */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">New Images to Upload</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4 w-full">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative overflow-hidden rounded-md border bg-muted">
                            <img
                              src={image.url}
                              alt={`Campaign ${index + 1}`}
                              className="object-cover w-full h-full transition-all hover:scale-105"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageRemove(index)}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-md p-1 w-6 h-6 flex items-center justify-center shadow-md opacity-90 hover:opacity-100"
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1">
                              <p className="text-white text-xs truncate">
                                {truncateFileName(image.file.name)}
                              </p>
                              <p className="text-gray-300 text-xs mt-0.5">
                                {formatFileSize(image.file.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  onError={handleUploadError}
                  disabled={isSizeExceeded}
                />
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess && onSuccess()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isSizeExceeded}
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Campaign"
                : "Create Campaign"}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Image Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription asChild>
              <div>
                You are going to delete this image even if you cancel the edit form.
                {imageToDelete && (
                  <div className="mt-2 space-y-1">
                    <div><strong>File:</strong> {imageToDelete.fileName}</div>
                    <div><strong>Size:</strong> {formatFileSize(Number(imageToDelete.fileSize))}</div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleExistingImageRemove}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 