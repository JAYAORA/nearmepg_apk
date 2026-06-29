"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  disabledDates?: { start: Date; end: Date }[];
}

export function DateRangePicker({
  className,
  date,
  setDate,
  disabledDates = [],
}: DateRangePickerProps) {
  const [currentDate, setCurrentDate] = React.useState<DateRange | undefined>(date);

  React.useEffect(() => {
    setCurrentDate(date);
  }, [date]);
  // We need to disable dates that fall within the disabled ranges
  const isDateDisabled = (day: Date) => {
    // Also disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return true;

    return disabledDates.some((range) => {
      // Need to normalize times for comparison
      const checkDate = new Date(day);
      checkDate.setHours(0, 0, 0, 0);
      
      const rStart = new Date(range.start);
      rStart.setHours(0, 0, 0, 0);
      
      const rEnd = new Date(range.end);
      rEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= rStart && checkDate <= rEnd;
    });
  };

  const handleSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      // Prevent selecting a range that contains disabled dates
      let current = new Date(newDate.from);
      current.setHours(0, 0, 0, 0);
      const toDate = new Date(newDate.to);
      toDate.setHours(0, 0, 0, 0);

      let hasDisabled = false;
      while (current <= toDate) {
        if (isDateDisabled(current)) {
          hasDisabled = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }

      if (hasDisabled) {
        // Range contains disabled dates, fallback to just selecting the start date
        setCurrentDate({ from: newDate.from, to: undefined });
        setDate({ from: newDate.from, to: undefined });
        return;
      }
    }
    
    setCurrentDate(newDate);
    setDate(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white/50 backdrop-blur-md border-slate-200 h-12 rounded-xl",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select your stay dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="center">
          <Calendar
            mode="range"
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={isDateDisabled}
          />
          <div className="border-t border-slate-100 p-3 bg-slate-50 rounded-b-2xl flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300 opacity-50"></div>
              <span>Sold Out / Unavailable</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
