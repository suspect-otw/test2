import Link from "next/link";
import { notFound } from "next/navigation";
import GradientText from "@/components/gradientText";
import { getAllCampaigns } from "@/app/data/campaigns/get-all";
import { getCampaignById } from "@/app/data/campaigns/get-single";
import { Suspense } from "react";
import { formatCurrency, formatDate, createSlug } from "@/lib/utils";
import CampaignImageCarousel from "@/components/CampaignImageCarousel";

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: campaigns } = await getAllCampaigns();
  
  // Find campaign by slug
  const campaign = campaigns?.find(c => createSlug(c.campaignTitle) === slug);
  
  if (!campaign) {
    return {
      title: 'Campaign Not Found',
      description: 'The campaign you are looking for does not exist.',
    };
  }
  
  return {
    title: `${campaign.campaignTitle} | Music Campaign`,
    description: campaign.description || `Details about ${campaign.campaignTitle} by ${campaign.brandName}`,
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CampaignPage({ params }: PageProps) {
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
  
  // Get detailed campaign data with images
  const { data: campaign, error: campaignError } = await getCampaignById(campaignBySlug.id);
  
  if (campaignError || !campaign) {
    notFound();
  }
  
  // Convert values for formatting functions
  const budget = typeof campaign.budget === 'string' ? parseFloat(campaign.budget) : campaign.budget;
  const startDate = typeof campaign.startDate === 'string' ? new Date(campaign.startDate) : campaign.startDate;
  const endDate = typeof campaign.endDate === 'string' ? new Date(campaign.endDate) : campaign.endDate;

  return (
    <div className="w-full py-5">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/campaigns"
          className="inline-flex items-center text-sm font-medium mb-8 hover:text-primary transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Campaigns
        </Link>
        
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-sm text-muted-foreground">{campaign.brandName}</span>
            <h1 className="text-4xl font-bold mt-2 mb-4">
              <GradientText
                colors={["#8acfcf", "#A86523", "#8acfcf"]}
                animationSpeed={6}
                showBorder={false}
              >
                {campaign.campaignTitle}
              </GradientText>
            </h1>
          </div>
          
          {/* Campaign image carousel */}
          <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse"></div>}>
            <CampaignImageCarousel 
              campaignImages={campaign.images} 
              campaignTitle={campaign.campaignTitle} 
            />
          </Suspense>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-border p-5">
              <h3 className="text-sm text-muted-foreground mb-1">Budget</h3>
              <p className="text-lg font-medium">{formatCurrency(budget)}</p>
            </div>
            
            <div className="rounded-xl bg-card border border-border p-5">
              <h3 className="text-sm text-muted-foreground mb-1">Start Date</h3>
              <p className="text-lg font-medium">{formatDate(startDate)}</p>
            </div>
            
            <div className="rounded-xl bg-card border border-border p-5">
              <h3 className="text-sm text-muted-foreground mb-1">End Date</h3>
              <p className="text-lg font-medium">{formatDate(endDate)}</p>
            </div>
          </div>
          
          <div className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-2xl font-semibold mb-4">Campaign Description</h2>
            <div className="text-foreground/80 space-y-4">
              <p>{campaign.description}</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              href={`/campaigns/${slug}/apply`} 
              className="px-8 py-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold text-lg"
            >
              Apply for This Campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 