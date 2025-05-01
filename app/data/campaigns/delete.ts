"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


/**
 * Delete a campaign and its images
 * @param id Campaign ID
 * @returns Success status or error
 */
export const deleteCampaign = async (id: string) => {
    try {
      // Create transaction
      return await db.transaction(async (tx) => {
        // Get Supabase client for storage operations
        const supabase = await createClient();
        
        // Get images for this campaign
        const images = await tx
          .select({ filePath: campaignImages.filePath })
          .from(campaignImages)
          .where(eq(campaignImages.campaignId, id));
        
        // Delete images from storage if they exist
        if (images.length > 0) {
          const { error: deleteStorageError } = await supabase
            .storage
            .from('campaign_images')
            .remove(images.map(img => img.filePath));
            
          if (deleteStorageError) {
            console.error("Error removing images from storage:", deleteStorageError);
            // Continue with deletion even if storage removal fails
          }
        }
        
        // Delete campaign (will cascade delete campaign_images due to foreign key)
        await tx
          .delete(campaigns)
          .where(eq(campaigns.id, id));
  
        // Revalidate path to update UI
        revalidatePath('/campaigns');
        
        return { success: true, error: null };
      });
    } catch (error: any) {
      console.error(`Error deleting campaign ${id}:`, error);
      return { success: false, error: error.message || "Failed to delete campaign" };
    }
  };