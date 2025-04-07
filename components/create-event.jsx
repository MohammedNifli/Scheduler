"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSearchParams, useRouter } from "next/navigation";
import EventForm from "./event-form";
import { Toaster } from "sonner";

export default function CreateEventDrawer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isCreateMode = searchParams.get("create") === "true";
  const [isOpen, setIsOpen] = React.useState(isCreateMode);
  
  React.useEffect(() => {
    setIsOpen(isCreateMode);
  }, [isCreateMode]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace(window.location.pathname); // Removes `create=true`
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
      
      <Drawer open={isOpen} onClose={handleClose}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">Create New Event</DrawerTitle>
            <DrawerDescription>
              Fill out the form below to create a new event
            </DrawerDescription>
          </DrawerHeader>
          
          <EventForm 
            onSubmitForm={handleClose}
          />
      
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}