import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define form schema using zod
export const campaignFormSchema = z.object({
  campaignTitle: z.string().min(1, "Campaign title is required"),
  brandName: z.string().min(1, "Brand name is required"),
  dateRange: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date({ required_error: "End date is required" }),
  }),
  budget: z.string().min(1, "Budget is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Budget must be a valid number greater than 0" }
  ),
  description: z.string().optional(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export default function CampaignFormFields() {
  const form = useFormContext<CampaignFormValues>();
  
  return (
    <div className="grid gap-5 py-4">
      <FormField
        control={form.control}
        name="campaignTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Title</FormLabel>
            <FormControl>
              <Input placeholder="Summer Promotion 2023" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="brandName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Brand Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dateRange"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Campaign Period</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "PPP")} -{" "}
                          {format(field.value.to, "PPP")}
                        </>
                      ) : (
                        format(field.value.from, "PPP")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value?.from}
                  selected={field.value as DateRange}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget (USD)</FormLabel>
            <FormControl>
              <Input placeholder="5000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Campaign details..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 