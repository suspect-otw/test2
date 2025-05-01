"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCampaign } from "@/app/data/campaigns/delete";
import { useRouter } from "next/navigation";

interface DeleteCampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSuccess?: () => void;
}

export default function DeleteCampaignDialog({
  isOpen,
  onOpenChange,
  campaign,
  onSuccess,
}: DeleteCampaignDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!campaign) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const { error } = await deleteCampaign(campaign.id);
      
      if (error) {
        setError(error);
        return;
      }
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto my-5">
        <DialogHeader>
          <DialogTitle>Delete Campaign</DialogTitle>
          <DialogDescription asChild>
            <div>
              Are you sure you want to delete &quot;{campaign?.campaignTitle}&quot;? 
              This action cannot be undone.
            </div>
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="p-3 bg-destructive/20 text-destructive rounded-md">
            {error}
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 