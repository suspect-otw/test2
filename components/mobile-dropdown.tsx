"use client"

import React from "react";
import { Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileDropdownProps {
  children?: React.ReactNode;
}

export default function MobileDropdown({ children }: MobileDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const childrenArray = React.Children.toArray(children);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          type="button" 
          className="p-0 border-0 bg-transparent outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="sr-only">Open main menu</span>
          {open ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-2 border border-white/15 shadow-none animate-none" align="end">
        <DropdownMenuGroup className="flex flex-row items-center justify-between gap-4">
          {childrenArray.map((child, index) => (
            <div key={index} className={index === 1 ? "border rounded-sm p-1" : ""}>
              {child}
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 