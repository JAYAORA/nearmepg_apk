"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "../ui/drawer";

interface AdvancedFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AdvancedFiltersModal({
  open,
  onOpenChange,
  children,
}: AdvancedFiltersModalProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="w-3/5 min-w-[48vw] max-h-[72vh] overflow-hidden bg-white px-3 py-4 flex flex-col"
            aria-describedby={undefined}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>
                Advanced Filters
              </DialogTitle>
            </DialogHeader>

            {children}
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent
            className="h-full rounded-t-xl bg-white text-black"
            aria-describedby={undefined}
          >
            <DrawerTitle className="sr-only">
              Advanced Filters
            </DrawerTitle>

            {children}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}