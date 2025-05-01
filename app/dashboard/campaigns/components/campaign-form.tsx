"use client";

import { Campaign } from "@/types/campaign";
import useCampaignForm from "@/hooks/use-campaign-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import CampaignFormFields from "@/components/forms/campaign-form-fields";
import CampaignImageManager from "@/components/forms/campaign-image-manager";

// Props interface
interface CampaignFormProps {
  initialData?: Campaign;
  onSuccess?: () => void;
}

export default function CampaignForm({ initialData, onSuccess }: CampaignFormProps) {
  // Prepare initialData in the format expected by useCampaignForm
  const formInitialData = initialData 
    ? {
        id: initialData.id,
        campaignTitle: initialData.campaignTitle,
        brandName: initialData.brandName,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        budget: initialData.budget,
        description: initialData.description || undefined
      }
    : undefined;

  const {
    form,
    state,
    handleImageUpload,
    handleImageRemove,
    handleExistingImageRemove,
    handleUploadError,
    onSubmit
  } = useCampaignForm({ initialData: formInitialData, onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CampaignFormFields />
        
        <CampaignImageManager
          images={state.images}
          existingImages={state.existingImages}
          totalImageSize={state.totalImageSize}
          isSizeExceeded={state.isSizeExceeded}
          uploadError={state.uploadError}
          isLoadingImages={state.isLoadingImages}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          onExistingImageRemove={handleExistingImageRemove}
          onUploadError={handleUploadError}
          disabled={state.isSubmitting}
        />
        
        {/* Form Error */}
        {state.formError && (
          <div className="p-3 bg-destructive/20 text-destructive rounded-md text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{state.formError}</span>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={state.isSubmitting}>
            {state.isSubmitting
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update Campaign"
              : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 