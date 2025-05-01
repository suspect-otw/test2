import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CampaignImage } from "@/types/campaign";
import { campaignFormSchema, CampaignFormValues } from "@/components/forms/campaign-form-fields";
import { createCampaign } from "@/app/data/campaigns/create";
import { updateCampaign } from "@/app/data/campaigns/update";
import { deleteCampaignImage } from "@/app/data/campaigns/delete-image";
import { getCampaignImages } from "@/app/data/campaigns/get-images";
import { MAX_IMAGE_SIZE_BYTES } from "@/components/forms/campaign-image-manager";

interface UseCampaignFormProps {
  initialData?: {
    id: string;
    campaignTitle: string;
    brandName: string;
    startDate: string | Date;
    endDate: string | Date;
    budget: number | string;
    description?: string;
  };
  onSuccess?: () => void;
}

interface CampaignFormState {
  images: { url: string; file: File }[];
  existingImages: CampaignImage[];
  totalImageSize: number;
  isSizeExceeded: boolean;
  uploadError: string | null;
  formError: string | null;
  isLoadingImages: boolean;
  isSubmitting: boolean;
}

export default function useCampaignForm({ initialData, onSuccess }: UseCampaignFormProps) {
  // Form state
  const [state, setState] = useState<CampaignFormState>({
    images: [],
    existingImages: [],
    totalImageSize: 0,
    isSizeExceeded: false,
    uploadError: null,
    formError: null,
    isLoadingImages: false,
    isSubmitting: false
  });

  // Initialize form
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
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

  // Calculate total size of new images
  useEffect(() => {
    const newImagesSize = state.images.reduce((total, img) => total + img.file.size, 0);
    const existingImagesSize = state.existingImages.reduce((total, img) => total + Number(img.fileSize), 0);
    const totalSize = newImagesSize + existingImagesSize;
    
    setState(prev => ({
      ...prev,
      totalImageSize: totalSize,
      isSizeExceeded: totalSize > MAX_IMAGE_SIZE_BYTES
    }));
  }, [state.images, state.existingImages]);
  
  // Fetch existing images for the campaign if editing
  useEffect(() => {
    const fetchCampaignImages = async () => {
      if (initialData?.id) {
        setState(prev => ({ ...prev, isLoadingImages: true }));
        try {
          const { data, error } = await getCampaignImages(initialData.id);
          
          if (error || !data) {
            console.error("Error fetching campaign images:", error);
            return;
          }
          
          if (data.images && data.images.length > 0) {
            setState(prev => ({ ...prev, existingImages: data.images }));
          }
        } catch (error) {
          console.error("Error fetching campaign images:", error);
        } finally {
          setState(prev => ({ ...prev, isLoadingImages: false }));
        }
      }
    };
    
    fetchCampaignImages();
  }, [initialData?.id]);

  // Handle image upload
  const handleImageUpload = (url: string, file: File) => {
    setState(prev => ({
      ...prev,
      images: [...prev.images, { url, file }]
    }));
  };

  // Handle image removal (new images)
  const handleImageRemove = (index: number) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle existing image removal
  const handleExistingImageRemove = async (image: CampaignImage) => {
    if (!image.id) return;
    
    try {
      const { error } = await deleteCampaignImage(image.id);
      
      if (error) {
        setState(prev => ({
          ...prev,
          uploadError: `Failed to delete image: ${error}`
        }));
        return;
      }
      
      setState(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter(img => img.id !== image.id)
      }));
    } catch (err) {
      console.error("Error deleting image:", err);
      setState(prev => ({
        ...prev,
        uploadError: "An unexpected error occurred while deleting the image"
      }));
    }
  };

  // Handle upload error
  const handleUploadError = (error: string) => {
    setState(prev => ({ ...prev, uploadError: error }));
  };

  // Handle form submission
  const onSubmit = async (data: CampaignFormValues) => {
    if (state.isSizeExceeded) {
      setState(prev => ({
        ...prev,
        formError: `Total image size exceeds the limit. Please remove some images.`
      }));
      return;
    }
    
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      formError: null
    }));
    
    try {
      // Prepare image upload data
      const imageUploads = state.images.map((img) => ({
        file: img.file,
        fileName: img.file.name,
        fileSize: img.file.size,
        contentType: img.file.type
      }));
      
      let result;
      
      if (initialData) {
        // Update existing campaign
        const campaignUpdateData = {
          campaignTitle: data.campaignTitle,
          brandName: data.brandName,
          startDate: data.dateRange.from,
          endDate: data.dateRange.to,
          budget: data.budget,
          description: data.description,
          images: imageUploads // Include images in update data
        };
        
        // Update existing campaign
        result = await updateCampaign(initialData.id, campaignUpdateData);
      } else {
        // Create new campaign
        const campaignData = {
          campaignTitle: data.campaignTitle,
          brandName: data.brandName,
          startDate: data.dateRange.from,
          endDate: data.dateRange.to,
          budget: data.budget,
          description: data.description,
          images: imageUploads
        };
        
        // Create new campaign
        result = await createCampaign(campaignData);
      }
      
      if (result.error) {
        setState(prev => ({
          ...prev,
          formError: result.error,
          isSubmitting: false
        }));
        return;
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error submitting campaign:", err);
      setState(prev => ({
        ...prev,
        formError: "An unexpected error occurred while saving the campaign",
        isSubmitting: false
      }));
    }
  };

  return {
    form,
    state,
    handleImageUpload,
    handleImageRemove,
    handleExistingImageRemove,
    handleUploadError,
    onSubmit
  };
} 