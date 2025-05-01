"use server";

import { db } from "@/index";
import { campaignImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { CampaignImage } from "@/types/campaign";

/**
 * Get images for a specific campaign
 * @param campaignId Campaign ID
 * @returns Array of campaign images or error
 */
export const getCampaignImages = async (campaignId: string) => {
  try {
    // Get images from database
    const images = await db
      .select()
      .from(campaignImages)
      .where(eq(campaignImages.campaignId, campaignId));

    // Calculate total size
    const totalSizeBytes = images.reduce((total, img) => total + Number(img.fileSize), 0);
    
    return { 
      data: {
        images: images as CampaignImage[],
        totalSizeBytes,
        totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2),
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error(`Error fetching images for campaign ${campaignId}:`, error);
    return { data: null, error: error.message || "Failed to fetch campaign images" };
  }
}; 