"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { 
  CampaignImageUpload,
  CampaignInput,
  CampaignWithImages
} from "@/types/campaign";
import { sanitizeFileName } from "@/lib/utils";



/**
 * Create a new campaign with optional images
 * @param data Campaign data with optional images
 * @returns New campaign ID or error
 */
export const createCampaign = async (data: CampaignInput) => {
    try {
      // Create transaction
      return await db.transaction(async (tx) => {
        // Format date values if needed
        const startDate = typeof data.startDate === 'string' ? data.startDate : data.startDate.toISOString().split('T')[0];
        const endDate = typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString().split('T')[0];
        const budget = typeof data.budget === 'string' ? data.budget : data.budget.toString();
  
        // Create campaign
        const [newCampaign] = await tx
          .insert(campaigns)
          .values({
            campaignTitle: data.campaignTitle,
            brandName: data.brandName,
            startDate,
            endDate,
            budget,
            description: data.description,
          })
          .returning({ id: campaigns.id });
  
        // Handle images if provided
        if (data.images && data.images.length > 0) {
          // Get Supabase client for storage operations
          const supabase = await createClient();
          
          // Process each image
          for (const image of data.images as CampaignImageUpload[]) {
            // Sanitize filename to ensure it's storage-compatible
            const { sanitizedName, error: sanitizeError } = sanitizeFileName(image.fileName);
            
            // Handle filename sanitization errors 
            if (sanitizeError) {
              throw new Error(`Invalid file name: ${sanitizeError}`);
            }
            
            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('campaign_images')
              .upload(
                `${newCampaign.id}/${sanitizedName}`, 
                image.file
              );
  
            if (uploadError) {
              throw new Error(`Failed to upload image: ${uploadError.message || 'Unknown error'}`);
            }
  
            // Add image record to database
            await tx
              .insert(campaignImages)
              .values({
                campaignId: newCampaign.id,
                fileName: image.fileName, // Keep the original filename for display
                filePath: uploadData.path,
                fileSize: image.fileSize,
                contentType: image.contentType,
              });
          }
        }
  
        // Revalidate path to update UI
        revalidatePath('/dashboard/campaigns');
        revalidatePath('/campaigns');

        return { data: newCampaign as CampaignWithImages, error: null };
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create campaign";
      console.error("Error creating campaign:", error);
      return { data: null, error: errorMessage };
    }
  };