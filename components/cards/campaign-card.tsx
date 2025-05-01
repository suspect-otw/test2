import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { CalendarRange, Music } from "lucide-react";

import { Campaign } from "@/types/campaign";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getImageUrl } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  imagePath?: string;
  imageUrl?: string;
  href?: string;
}

export default function CampaignCard({ campaign, imagePath, imageUrl, href }: CampaignCardProps) {
  const isActive = new Date(campaign.endDate) >= new Date();
  
  // Format dates for display
  const startDate = format(new Date(campaign.startDate), "MMM d, yyyy");
  const endDate = format(new Date(campaign.endDate), "MMM d, yyyy");
  
  // Format budget
  const budget = formatCurrency(Number(campaign.budget));
  
  // Generate campaign link
  const campaignLink = href || `/campaigns/${campaign.id}`;
  
  // Determine the image source
  const imageSource = imagePath ? getImageUrl(imagePath) : imageUrl;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <Link href={campaignLink} className="relative aspect-[4/3] overflow-hidden bg-muted flex justify-center items-center">
        {imageSource ? (
          <Image
            src={imageSource}
            alt={campaign.campaignTitle}
            fill
            className="object-cover transition-all duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-campaign.jpg';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <Music size={48} strokeWidth={1.5} />
            <span className="mt-2 text-sm">No image available</span>
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${isActive ? 'bg-green-600' : 'bg-slate-600'}`}
        >
          {isActive ? 'Active' : 'Ended'}
        </Badge>
      </Link>
      
      <CardHeader className="p-4 pb-2">
        <Link 
          href={campaignLink}
          className="font-semibold text-xl hover:underline line-clamp-2 leading-tight"
        >
          {campaign.campaignTitle}
        </Link>
        <p className="text-muted-foreground text-sm">{campaign.brandName}</p>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2 flex-grow">
        {campaign.description && (
          <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
            {campaign.description}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarRange className="h-4 w-4 mr-1" />
          <span>
            {startDate} - {endDate}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
        <span className="text-sm font-medium">{budget}</span>
        <Link 
          href={campaignLink}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
} 