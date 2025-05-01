"use server";

import { db } from "@/index";
import { campaigns } from "@/drizzle/schema";
import { Campaign } from "@/types/campaign";


/**
 * Get all campaigns
 * @returns Array of campaigns or error
 */
export const getAllCampaigns = async () => {
    try {
      const results = await db.select().from(campaigns);
      return { data: results as Campaign[], error: null };
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return { data: null, error: "Failed to fetch campaigns" };
    }
  };