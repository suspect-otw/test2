import { notFound, redirect } from "next/navigation";
import { getAllCampaigns } from "@/app/data/campaigns/get-all";
import { getCampaignById } from "@/app/data/campaigns/get-single";
import { createSlug } from "@/lib/utils";

export default async function CampaignApplyPageWrapper({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // First, get all campaigns to find the matching ID
  const { data: campaigns, error: campaignsError } = await getAllCampaigns();
  
  if (campaignsError || !campaigns) {
    notFound();
  }
  
  // Find campaign by slug to get the ID
  const campaignBySlug = campaigns.find(c => createSlug(c.campaignTitle) === slug);
  
  if (!campaignBySlug) {
    notFound();
  }
  
  // Get full campaign details
  const { data: campaign, error: campaignError } = await getCampaignById(campaignBySlug.id);
  
  if (campaignError || !campaign) {
    notFound();
  }
  
  // Redirect to the client-side apply page with necessary data
  const searchParams = new URLSearchParams({
    campaignTitle: campaign.campaignTitle,
    brandName: campaign.brandName,
    description: campaign.description || ''
  });
  
  redirect(`/campaigns/apply/${campaign.id}?${searchParams.toString()}`);
} 