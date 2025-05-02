"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageScrollModal } from "@/app/dashboard/campaigns/components/image-scroll";
import { CampaignImage } from "@/types/campaign";
import { getImageUrl } from "@/lib/utils";

interface ClientImageGalleryProps {
  campaignImages: CampaignImage[];
  campaignTitle: string;
}

export default function ClientImageGallery({ campaignImages, campaignTitle }: ClientImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!campaignImages || campaignImages.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 flex justify-center items-center h-64">
        <p className="text-muted-foreground">No images available for this campaign</p>
      </div>
    );
  }
  
  const firstImage = campaignImages[0];
  const imageUrl = getImageUrl(firstImage.filePath);
  
  return (
    <>
      <div 
        className="rounded-xl border border-border overflow-hidden cursor-pointer relative"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={imageUrl}
            alt={campaignTitle}
            fill
            className="object-contain bg-muted"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
        
        {campaignImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
            +{campaignImages.length - 1} more images
          </div>
        )}
      </div>
      
      {/* Image Gallery Modal */}
      <ImageScrollModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        campaignTitle={campaignTitle}
        images={campaignImages}
      />
    </>
  );
} 