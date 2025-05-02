import { Campaign, CampaignImage } from "@/types/campaign";
import { format } from "date-fns";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import CampaignTableActions from "./campaign-table-actions";
import Image from "next/image";

interface CampaignTableRowProps {
  campaign: Campaign;
  thumbnail?: CampaignImage;
  imageCount: number;
  isLoadingImages: boolean;
  onRowClick: (campaign: Campaign, e: React.MouseEvent) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export default function CampaignTableRow({
  campaign,
  thumbnail,
  imageCount,
  isLoadingImages,
  onRowClick,
  onEdit,
  onDelete
}: CampaignTableRowProps) {
  return (
    <TableRow 
      key={campaign.id}
      className="cursor-pointer"
      onClick={(e) => onRowClick(campaign, e)}
    >
      {/* Thumbnail */}
      <TableCell className="hidden sm:table-cell">
        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {isLoadingImages ? (
            <div className="animate-pulse bg-muted w-full h-full" />
          ) : thumbnail ? (
            <>
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${thumbnail.filePath}`}
                alt={campaign.campaignTitle}
                className="w-full h-full object-cover"
                fill
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/png?text=Error';
                }}
              />
              {imageCount > 1 && (
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded-tl-md">
                  +{imageCount - 1}
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground text-xs text-center p-1">
              No image
            </div>
          )}
        </div>
      </TableCell>

      {/* Campaign Title */}
      <TableCell>
        <div className="font-medium">{campaign.campaignTitle}</div>
        <div className="text-xs text-muted-foreground md:hidden">
          {campaign.brandName}
        </div>
      </TableCell>

      {/* Brand Name */}
      <TableCell className="hidden md:table-cell">
        {campaign.brandName}
      </TableCell>

      {/* Date Range */}
      <TableCell className="hidden lg:table-cell">
        <div className="text-sm">
          {format(new Date(campaign.startDate), "MMM d, yyyy")} -
        </div>
        <div className="text-sm">
          {format(new Date(campaign.endDate), "MMM d, yyyy")}
        </div>
      </TableCell>

      {/* Budget */}
      <TableCell className="hidden md:table-cell">
        ${new Intl.NumberFormat().format(Number(campaign.budget))}
      </TableCell>

      {/* Created Date */}
      <TableCell className="hidden lg:table-cell">
        {format(new Date(campaign.createdAt), "MMM d, yyyy")}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <CampaignTableActions
          campaignId={campaign.id}
          onEdit={() => onEdit(campaign)}
          onDelete={() => onDelete(campaign)}
        />
      </TableCell>
    </TableRow>
  );
} 