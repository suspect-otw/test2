"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { 
  CampaignImageUpload,
  CampaignInput 
} from "@/types/campaign";



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
            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('campaign_images')
              .upload(
                `${newCampaign.id}/${image.fileName}`, 
                image.file
              );
  
            if (uploadError) {
              throw new Error(`Failed to upload image: ${uploadError.message}`);
            }
  
            // Add image record to database
            await tx
              .insert(campaignImages)
              .values({
                campaignId: newCampaign.id,
                fileName: image.fileName,
                filePath: uploadData.path,
                fileSize: image.fileSize,
                contentType: image.contentType,
              });
          }
        }
  
        // Revalidate path to update UI
        revalidatePath('/campaigns');
        
        return { data: newCampaign.id, error: null };
      });
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      return { data: null, error: error.message || "Failed to create campaign" };
    }
  };