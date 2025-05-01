import { Campaign, CampaignImage } from "@/types/campaign";
import CampaignCard from "@/components/cards/campaign-card";

interface CampaignsGridProps {
  campaigns: Array<
    Campaign & { 
      thumbnailUrl?: string | null;
      thumbnailPath?: string | null;
      images?: CampaignImage[] | null;
    }
  >;
  emptyMessage?: string;
}

export default function CampaignsGrid({ 
  campaigns,
  emptyMessage = "No campaigns found"
}: CampaignsGridProps) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {campaigns.map((campaign) => {
        // Determine which image property to use
        const thumbnailPath = campaign.images?.[0]?.filePath || campaign.thumbnailPath || null;
        const thumbnailUrl = campaign.thumbnailUrl || null;
        
        return (
          <div key={campaign.id} className="h-full">
            <CampaignCard 
              campaign={campaign}
              imagePath={thumbnailPath || undefined}
              imageUrl={thumbnailUrl || undefined}
            />
          </div>
        );
      })}
    </div>
  );
} 