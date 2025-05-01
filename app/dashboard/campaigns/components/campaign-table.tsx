"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Image, MoreHorizontal } from "lucide-react";
import { Campaign, CampaignImage } from "@/types/campaign";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getCampaignImages } from "@/app/data/campaigns/get-images";
import CampaignForm from "./campaign-form";
import DeleteCampaignDialog from "./delete-campaign-dialog";
import { ImageScrollModal } from "./image-scroll";

interface CampaignImageData {
  campaignId: string;
  images: CampaignImage[];
  totalCount: number;
}

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaignImages, setCampaignImages] = useState<Record<string, CampaignImageData>>({});
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch images for all campaigns
  useEffect(() => {
    const fetchAllCampaignImages = async () => {
      if (campaigns.length === 0) {
        setIsLoadingImages(false);
        return;
      }

      setIsLoadingImages(true);
      const imageData: Record<string, CampaignImageData> = {};
      
      for (const campaign of campaigns) {
        try {
          const { data } = await getCampaignImages(campaign.id);
          if (data && data.images) {
            imageData[campaign.id] = {
              campaignId: campaign.id,
              images: data.images,
              totalCount: data.images.length
            };
          }
        } catch (error) {
          console.error(`Error fetching images for campaign ${campaign.id}:`, error);
        }
      }
      
      setCampaignImages(imageData);
      setIsLoadingImages(false);
    };
    
    fetchAllCampaignImages();
  }, [campaigns]);

  const handleEditClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    router.refresh();
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    router.refresh();
  };

  const handleImageModalOpen = (campaign: Campaign, e: React.MouseEvent) => {
    // Don't open modal if clicking on action buttons or if a dialog is open
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('.actions-cell') ||
        isEditDialogOpen || 
        isDeleteDialogOpen ||
        isCreateDialogOpen) {
      return;
    }
    
    setSelectedCampaign(campaign);
    setIsImageModalOpen(true);
  };

  return (
    <div className="w-full px-2 sm:px-0">
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
                  <TableRow 
                    key={campaign.id} 
                    className="cursor-pointer" 
                    onClick={(e) => handleImageModalOpen(campaign, e)}
                  >
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {isLoadingImages ? (
                          <div className="animate-pulse bg-muted w-full h-full" />
                        ) : thumbnailImage ? (
                          <>
                            <img
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${thumbnailImage.filePath}`}
                              alt={campaign.campaignTitle}
                              className="w-full h-full object-cover"
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
                          <Image className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {/* Mobile Thumbnail */}
                        <div className="sm:hidden relative w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center mr-1">
                          {isLoadingImages ? (
                            <div className="animate-pulse bg-muted w-full h-full" />
                          ) : thumbnailImage ? (
                            <>
                              <img
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign_images/${thumbnailImage.filePath}`}
                                alt={campaign.campaignTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/png?text=Error';
                                }}
                              />
                              {imageCount > 1 && (
                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded-tl-md">
                                  +{imageCount - 1}
                                </div>
                              )}
                            </>
                          ) : (
                            <Image className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          {campaign.campaignTitle}
                          <span className="text-xs text-muted-foreground md:hidden block">
                            {campaign.brandName}
                          </span>
                          <span className="text-xs text-muted-foreground md:hidden block">
                            ${Number(campaign.budget).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{campaign.brandName}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(campaign.startDate), "MMM dd, yyyy")} - {format(new Date(campaign.endDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">${Number(campaign.budget).toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">{format(new Date(campaign.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-right actions-cell">
                      {/* Desktop Actions */}
                      <div className="hidden sm:flex justify-end gap-2">
                        <Dialog open={isEditDialogOpen && selectedCampaign?.id === campaign.id} onOpenChange={(open: boolean) => !open && setIsEditDialogOpen(false)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(campaign)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
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

                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(campaign)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile Actions */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog open={isEditDialogOpen && selectedCampaign?.id === campaign.id} onOpenChange={(open: boolean) => !open && setIsEditDialogOpen(false)}>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onClick={() => handleEditClick(campaign)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto my-5">
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
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(campaign)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <DeleteCampaignDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleDeleteSuccess}
      />

      {/* Image Modal */}
      {selectedCampaign && campaignImages[selectedCampaign.id] && (
        <ImageScrollModal
          isOpen={isImageModalOpen}
          onOpenChange={setIsImageModalOpen}
          campaignTitle={selectedCampaign.campaignTitle}
          images={campaignImages[selectedCampaign.id]?.images || []}
        />
      )}
    </div>
  );
} 