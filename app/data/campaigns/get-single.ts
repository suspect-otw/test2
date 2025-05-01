"use server";

import { db } from "@/index";
import { campaigns, campaignImages } from "@/drizzle/schema";
import { CampaignWithImages }  from "@/types/campaign";
import { eq } from "drizzle-orm";

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
        data: { ...campaign[0], images } as CampaignWithImages, 
        error: null 
      };
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      return { data: null, error: "Failed to fetch campaign" };
    }
  };