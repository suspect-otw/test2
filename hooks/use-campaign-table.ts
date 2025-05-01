import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Campaign, CampaignImage } from "@/types/campaign";
import { getCampaignImages } from "@/app/data/campaigns/get-images";

interface CampaignImageData {
  campaignId: string;
  images: CampaignImage[];
  totalCount: number;
}

interface UseCampaignTableProps {
  campaigns: Campaign[];
}

interface UseCampaignTableResult {
  selectedCampaign: Campaign | null;
  isDeleteDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isImageModalOpen: boolean;
  campaignImages: Record<string, CampaignImageData>;
  isLoadingImages: boolean;
  handleEditClick: (campaign: Campaign) => void;
  handleDeleteClick: (campaign: Campaign) => void;
  handleImageModalOpen: (campaign: Campaign, e: React.MouseEvent) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setIsImageModalOpen: (isOpen: boolean) => void;
  handleEditSuccess: () => void;
  handleCreateSuccess: () => void;
  handleDeleteSuccess: () => void;
}

export default function useCampaignTable({ 
  campaigns 
}: UseCampaignTableProps): UseCampaignTableResult {
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

  return {
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
  };
} 