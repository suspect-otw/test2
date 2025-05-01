"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, FilterX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignsFilterProps {
  totalCount: number;
}

export default function CampaignsFilter({ totalCount }: CampaignsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const initialSearch = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialStatus = searchParams.get("status") || "all";
  
  // State for filter values
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [status, setStatus] = useState(initialStatus);

  // Check if any filters are applied
  const hasFilters = search || sort !== "newest" || status !== "all";
  
  // Apply filters
  const applyFilters = useCallback((param: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    
    router.push(`/campaigns?${params.toString()}`);
  }, [router, searchParams]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters("q", search);
    }
  };
  
  // Apply sort and status filters immediately when changed
  useEffect(() => {
    // Don't apply on initial load
    if (sort !== searchParams.get("sort") || status !== searchParams.get("status")) {
      if (sort !== searchParams.get("sort")) {
        applyFilters("sort", sort === "newest" ? null : sort);
      }
      if (status !== searchParams.get("status")) {
        applyFilters("status", status === "all" ? null : status);
      }
    }
  }, [sort, status, searchParams, applyFilters]);
  
  // Apply filters when the search input changes after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchParams.get('q')) {
        applyFilters('q', search || null);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, searchParams, applyFilters]);
  
  return (
    <div className="py-4 mb-6 border-b space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="flex flex-row items-center gap-2 self-end">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-xs"
              onClick={() => {
                setSearch("");
                setSort("newest");
                setStatus("all");
                router.push("/campaigns");
              }}
            >
              <FilterX className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            className="h-9"
            onClick={() => applyFilters("q", search)}
          >
            Search
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {totalCount} {totalCount === 1 ? "campaign" : "campaigns"}
        </p>
        
        <div className="flex flex-row gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Sort by:</span>
            <Select
              value={sort}
              onValueChange={setSort}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="budget-high">Budget (High to Low)</SelectItem>
                <SelectItem value="budget-low">Budget (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Status:</span>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 