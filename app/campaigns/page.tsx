import Link from "next/link";
import Image from "next/image";
import GradientText from "@/components/gradientText";
import { getAllCampaigns } from "@/app/data/campaigns/get-all";
import { getCampaignImages } from "@/app/data/campaigns/get-images";
import { formatCurrency, formatDate, createSlug, getImageUrl } from "@/lib/utils";

export default async function CampaignsPage() {
  // Fetch campaigns from the server
  const { data: campaigns, error } = await getAllCampaigns();
  
  // Fetch first image for each campaign
  const campaignsWithFirstImage = await Promise.all(
    (campaigns || []).map(async (campaign) => {
      const { data: imageData } = await getCampaignImages(campaign.id);
      const firstImage = imageData?.images?.[0] || null;
      return {
        ...campaign,
        firstImage
      };
    })
  );
  
  return (
    <div className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6">
            <GradientText
              colors={["#8acfcf", "#A86523", "#8acfcf"]}
              animationSpeed={6}
              showBorder={false}
            >
              Music Campaigns
            </GradientText>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of music campaigns and find the perfect opportunity for your music.
          </p>
        </div>
        
        {error && (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">Failed to load campaigns</div>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        )}
        
        {/* Server-side rendered form for search */}
        <div className="mb-12 max-w-md mx-auto">
          <form className="relative" action="/campaigns/search" method="GET">
            <input
              type="text"
              name="q"
              placeholder="Search campaigns..."
              className="w-full px-4 py-3 rounded-full bg-card border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="absolute right-4 top-3.5">
              <svg
                className="h-5 w-5 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Campaign grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignsWithFirstImage.length === 0 && !error && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No campaigns available at the moment.</p>
            </div>
          )}
          
          {campaignsWithFirstImage.map((campaign) => {
            const slug = createSlug(campaign.campaignTitle);
            const imageUrl = campaign.firstImage ? getImageUrl(campaign.firstImage.filePath) : null;
            
            // Convert values for formatting functions
            const budget = typeof campaign.budget === 'string' ? parseFloat(campaign.budget) : campaign.budget;
            const startDate = typeof campaign.startDate === 'string' ? new Date(campaign.startDate) : campaign.startDate;
            const endDate = typeof campaign.endDate === 'string' ? new Date(campaign.endDate) : campaign.endDate;
            
            return (
              <Link 
                key={campaign.id} 
                href={`/campaigns/${slug}`}
                className="group"
              >
                <div className="h-full flex flex-col rounded-2xl border border-border bg-card transition-all hover:border-primary/20 hover:scale-[1.02]">
                  {imageUrl ? (
                    <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={campaign.campaignTitle}
                        fill
                        className="object-cover"
                        priority={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-t-2xl bg-muted flex items-center justify-center">
                      <svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground">{campaign.brandName}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary/80">
                      {campaign.campaignTitle}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
                      {campaign.description}
                    </p>
                    <div className="mt-auto space-y-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Budget: {formatCurrency(budget)}</span>
                        <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-sm font-medium text-primary/80">
                          View Campaign →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 