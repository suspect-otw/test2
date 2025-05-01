import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CampaignList() {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return redirect("/");
    }       

  return (
    <div>
      <h1>Campaigns</h1>
      <p>Welcome, {user.email}</p>
      {/* Campaign listing will go here */}
    </div>
  );
}
