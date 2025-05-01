import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getAllCampaigns } from "@/app/data/campaigns/get-all";
import CampaignTable from "./components/campaign-table";

export default async function CampaignPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Fetch campaigns data
  const { data: campaigns, error } = await getAllCampaigns();

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
        <div className="p-4 bg-destructive/20 text-destructive rounded-md">
          Error loading campaigns: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
      </div>
      <CampaignTable campaigns={campaigns || []} />
    </div>
  );
}
