import HeaderAuth from "@/components/header-auth";
import NavLinksAuth from "@/components/nav-links-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Image from "next/image";
import Logo from "@/app/logo.png";
import Link from "next/link";
import MobileDropdown from "./mobile-dropdown";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center bg-background border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="flex items-center">
            <Image
              src={Logo}
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>      
        </div>
        <div className="flex items-center gap-4">
          <NavLinksAuth />
        </div>
        
        {/* Desktop view - show components normally */}
        <div className="hidden md:flex items-center gap-4">
          <HeaderAuth />
          <ThemeSwitcher />
        </div>
        
        {/* Mobile view - show dropdown menu */}
        <div className="flex md:hidden justify-center items-center">
          <MobileDropdown>
            <>
              <div>
                <HeaderAuth />
              </div>
              <div className="flex justify-end">
                <ThemeSwitcher />
              </div>
            </>
          </MobileDropdown>
        </div>
      </div>
    </nav>
  );
}