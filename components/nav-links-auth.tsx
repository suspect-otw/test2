import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function NavLinksAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/campaigns" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Campaigns
          </Link>
        </>
      ) : (
        <>
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link 
            href="/campaigns" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Campaigns
          </Link>
        </>
      )}
    </div>
  );
}
