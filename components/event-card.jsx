"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/actions/events";
import useFetch from "@/hooks/use-fetch";

const EventCard = ({ event, username, isPublic = false }) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter(); // ✅ Initialize useRouter

  const copyEventLink = () => {
    const eventUrl = `${window.location.origin}/${username}/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("Are you sure you want to delete?")) {
      try {
        await fnDeleteEvent(event.id);
        router.refresh(); // ✅ Refresh only after successful delete
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };


  const handleCardClick=(e)=>{
    if(e.target.tagName!=="BUTTON" && e.target.tagName!=="SVG"){
      window?.open(
        `${window.location.origin}/${username}/${event.id}`,
        "_blank"
      )
    }

  }
  return (
    <Card className="w-full h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold line-clamp-1">
          {event.title}
        </CardTitle>
        <CardDescription className="flex justify-between text-sm mt-1">
          <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>
          <span>{event._count?.bookings || 0} Bookings</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description?.split(".")[0] || "No description available."}
        </p>
      </CardContent>

      {!isPublic && (
        <CardFooter className="pt-3 flex justify-between gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={copyEventLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
