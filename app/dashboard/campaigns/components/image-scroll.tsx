"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CampaignImage } from "@/types/campaign"
import Image from "next/image"

// Format file size to readable format
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(2) + ' MB';
};

interface ImageScrollProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaignTitle: string;
  images: CampaignImage[];
}

export function ImageScrollModal({ isOpen, onOpenChange, campaignTitle, images }: ImageScrollProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Images for {campaignTitle}</DialogTitle>
          </div>
        </DialogHeader>
        
        {images.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No images available for this campaign.
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border" onClick={(e) => e.stopPropagation()}>
            <div className="flex w-max space-x-6 p-6">
              {images.map((image) => {
                const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${image.filePath}`;
                
                return (
                  <figure key={image.id} className="shrink-0">
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={imageUrl}
                        alt={image.fileName || "Campaign image"}
                        className="aspect-[3/4] max-h-[500px] object-contain bg-muted"
                        width={300}
                        height={400}
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/png?text=Error';
                        }}
                      />
                    </div>
                    <figcaption className="pt-2 text-sm text-muted-foreground">
                      <div className="truncate max-w-[300px]">{image.fileName}</div>
                      <div className="font-semibold text-foreground">
                        {formatFileSize(Number(image.fileSize))}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
