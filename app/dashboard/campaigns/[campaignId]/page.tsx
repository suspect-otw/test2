import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function CampaignPage() {

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/");
    }

    
  return (
  <div>Campaign 1</div>
);
}

