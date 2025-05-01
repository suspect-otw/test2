"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Types
export type CampaignImage = {
  file: File;
  fileName: string;
  fileSize: number;
  contentType: string;
};

export type CampaignInput = {
  campaignTitle: string;
  brandName: string;
  startDate: string | Date;
  endDate: string | Date;
  budget: string | number;
  description?: string;
  images?: CampaignImage[];
};

/**
 * Get all campaigns
 * @returns Array of campaigns or error
 */
export const getAllCampaigns = async () => {
  try {
    const results = await db.select().from(campaigns);
    return { data: results, error: null };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { data: null, error: "Failed to fetch campaigns" };
  }
};

/**
 * Get campaign by ID with its images
 * @param id The campaign ID
 * @returns Campaign with images or error
 */
export const getCampaignById = async (id: string) => {
  try {
    // Get campaign
    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!campaign.length) {
      return { data: null, error: "Campaign not found" };
    }

    // Get campaign images
    const images = await db
      .select()
      .from(campaignImages)
      .where(eq(campaignImages.campaignId, id));

    return { 
      data: { ...campaign[0], images }, 
      error: null 
    };
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    return { data: null, error: "Failed to fetch campaign" };
  }
};

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
        for (const image of data.images) {
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
        for (const image of data.images) {
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