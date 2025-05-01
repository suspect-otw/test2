"use server";

import { db } from "@/index";
import { campaignImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Delete a campaign image from both storage and database
 * @param imageId Image ID to delete
 * @returns Success status or error
 */
export const deleteCampaignImage = async (imageId: string) => {
  try {
    // Create transaction
    return await db.transaction(async (tx) => {
      // First get the image details to know what to delete from storage
      const [imageToDelete] = await tx
        .select()
        .from(campaignImages)
        .where(eq(campaignImages.id, imageId))
        .limit(1);

      if (!imageToDelete) {
        return { success: false, error: "Image not found" };
      }

      // Delete from storage
      const supabase = await createClient();
      const { error: storageError } = await supabase.storage
        .from('campaign_images')
        .remove([imageToDelete.filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
        // The storage cleanup can be handled separately if needed
      }

      // Delete from database
      await tx
        .delete(campaignImages)
        .where(eq(campaignImages.id, imageId));

      // Revalidate path to update UI
      revalidatePath('/dashboard/campaigns');
      
      return { success: true, error: null };
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
    console.error(`Error deleting image ${imageId}:`, error);
    return { success: false, error: errorMessage };
  }
}; 