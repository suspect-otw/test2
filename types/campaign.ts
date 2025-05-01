/**
 * Type definitions for campaign-related data
 */

/**
 * Complete Campaign entity as stored in the database
 */
export interface Campaign {
  id: string;
  campaignTitle: string;
  brandName: string;
  startDate: string | Date;
  endDate: string | Date;
  budget: string | number;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Campaign entity with images
 */
export type CampaignWithImages = Campaign & {
  images: CampaignImage[];
};

/**
 * Campaign image as stored in the database
 */
export interface CampaignImage {
  id: string;
  campaignId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  createdAt: string | Date;
}

/**
 * Campaign image file for upload
 */
export interface CampaignImageUpload {
  file: File;
  fileName: string;
  fileSize: number;
  contentType: string;
}

/**
 * Input data for creating or updating a campaign
 */
export interface CampaignInput {
  campaignTitle: string;
  brandName: string;
  startDate: string | Date;
  endDate: string | Date;
  budget: string | number;
  description?: string;
  images?: CampaignImageUpload[];
} 