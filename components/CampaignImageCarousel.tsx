"use client";

import * as React from "react";
import Image from "next/image";
import { CampaignImage } from "@/types/campaign";
import { getImageUrl } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CampaignImageCarouselProps {
  campaignImages: CampaignImage[];
  campaignTitle: string;
}

export default function CampaignImageCarousel({ 
  campaignImages, 
  campaignTitle 
}: CampaignImageCarouselProps) {
  // Handle no images case
  if (!campaignImages || campaignImages.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 flex justify-center items-center h-64">
        <p className="text-muted-foreground">No images available for this campaign</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {campaignImages.map((image, index) => {
          const imageUrl = getImageUrl(image.filePath);
          
          return (
            <CarouselItem key={image.id || index}>
              <div className="p-1">
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src={imageUrl}
                      alt={`${campaignTitle} - Image ${index + 1}`}
                      fill
                      className="object-contain bg-muted"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
} 