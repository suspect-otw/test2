"use client";

import { Plus } from "lucide-react";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CampaignForm from "./campaign-form";
import DeleteCampaignDialog from "./delete-campaign-dialog";
import { ImageScrollModal } from "./image-scroll";
import CampaignTableRow from "@/components/tables/campaign-table-row";
import useCampaignTable from "@/hooks/use-campaign-table";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const {
    selectedCampaign,
    isDeleteDialogOpen,
    isEditDialogOpen,
    isCreateDialogOpen,
    isImageModalOpen,
    campaignImages,
    isLoadingImages,
    handleEditClick,
    handleDeleteClick,
    handleImageModalOpen,
    setIsDeleteDialogOpen,
    setIsEditDialogOpen,
    setIsCreateDialogOpen,
    setIsImageModalOpen,
    handleEditSuccess,
    handleCreateSuccess,
    handleDeleteSuccess
  } = useCampaignTable({ campaigns });

  return (
    <div className="w-full px-2 sm:px-0">
      {/* Create Campaign Button */}
      <div className="flex justify-end mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto my-5">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm 
              onSuccess={handleCreateSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 hidden sm:table-cell">Image</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead className="hidden md:table-cell">Brand</TableHead>
              <TableHead className="hidden lg:table-cell">Date Range</TableHead>
              <TableHead className="hidden md:table-cell">Budget</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No campaigns found. Create your first campaign!
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => {
                const campaignImageData = campaignImages[campaign.id];
                const thumbnailImage = campaignImageData?.images?.[0]; 
                const imageCount = campaignImageData?.totalCount || 0;
                
                return (
                  <CampaignTableRow
                    key={campaign.id}
                    campaign={campaign}
                    thumbnail={thumbnailImage}
                    imageCount={imageCount}
                    isLoadingImages={isLoadingImages}
                    onRowClick={handleImageModalOpen}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto my-5">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignForm 
              initialData={selectedCampaign}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteCampaignDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleDeleteSuccess}
      />

      {/* Image Modal */}
      {selectedCampaign && campaignImages[selectedCampaign.id]?.images && (
        <ImageScrollModal
          isOpen={isImageModalOpen}
          onOpenChange={setIsImageModalOpen}
          campaignTitle={selectedCampaign.campaignTitle}
          images={campaignImages[selectedCampaign.id].images}
        />
      )}
    </div>
  );
} 