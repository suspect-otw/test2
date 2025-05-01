"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { 
  CampaignImageUpload, 
  CampaignInput 
} from "@/types/campaign";


/**
 * Update an existing campaign
 * @param id Campaign ID
 * @param data Updated campaign data
 * @returns Success status or error
 */
export const updateCampaign = async (id: string, data: CampaignInput) => {
    try {
      // Create transaction
      return await db.transaction(async (tx) => {
        // Format date values if needed
        const startDate = typeof data.startDate === 'string' ? data.startDate : data.startDate.toISOString().split('T')[0];
        const endDate = typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString().split('T')[0];
        const budget = typeof data.budget === 'string' ? data.budget : data.budget.toString();
  
        // Update campaign
        await tx
          .update(campaigns)
          .set({
            campaignTitle: data.campaignTitle,
            brandName: data.brandName,
            startDate,
            endDate,
            budget,
            description: data.description,
            updatedAt: new Date(),
          })
          .where(eq(campaigns.id, id));
  
        // Handle images if provided
        if (data.images && data.images.length > 0) {
          // Get Supabase client for storage operations
          const supabase = await createClient();
          
          // Process each new image
          for (const image of data.images as CampaignImageUpload[]) {
            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('campaign_images')
              .upload(
                `${id}/${image.fileName}`, 
                image.file
              );
  
            if (uploadError) {
              throw new Error(`Failed to upload image: ${uploadError.message}`);
            }
  
            // Add image record to database
            await tx
              .insert(campaignImages)
              .values({
                campaignId: id,
                fileName: image.fileName,
                filePath: uploadData.path,
                fileSize: image.fileSize,
                contentType: image.contentType,
              });
          }
        }
  
        // Revalidate path to update UI
        revalidatePath('/campaigns');
        revalidatePath(`/campaigns/${id}`);
        
        return { success: true, error: null };
      });
    } catch (error: any) {
      console.error(`Error updating campaign ${id}:`, error);
      return { success: false, error: error.message || "Failed to update campaign" };
    }
  };