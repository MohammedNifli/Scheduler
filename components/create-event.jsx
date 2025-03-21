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
    router.replace(window.location.pathname); // ✅ Removes `create=true`
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
   
          <DrawerHeader>
            <DrawerTitle>Create New Event</DrawerTitle>
           
          </DrawerHeader>
          <EventForm 
          onSubmiForm={()=>{
            handleClose();
          }}
          />
      
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
     
      </DrawerContent>
    </Drawer>
  );
}
