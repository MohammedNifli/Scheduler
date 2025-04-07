"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Clipboard, Check, Calendar, Clock, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/actions/events";
import useFetch from "@/hooks/use-fetch";
import { Badge } from "@/components/ui/badge";

const EventCard = ({ event, username, isPublic = false }) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  
  const copyEventLink = (e) => {
    e.stopPropagation();
    const eventUrl = `${window.location.origin}/${username}/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window?.confirm("Are you sure you want to delete this event?")) {
      try {
        await fnDeleteEvent(event.id);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleCardClick = (e) => {
    // Only open in new tab if clicking on the card background
    if (e.target === e.currentTarget || 
        e.target.classList.contains('card-content')) {
      window?.open(
        `${window.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <Card 
      className="w-full h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden" 
      onClick={handleCardClick}
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2" />
      
      <CardHeader className="pb-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold line-clamp-1 text-gray-800">
            {event.title}
          </CardTitle>
          <Badge variant={event.isPrivate ? "outline" : "default"} className="ml-2">
            {event.isPrivate ? "Private" : "Public"}
          </Badge>
        </div>
        <CardDescription className="flex justify-between text-sm mt-2">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{event.duration} mins</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{event._count?.bookings || 0} Bookings</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent 
        className="py-2 flex-grow card-content"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-gray-600 line-clamp-2">
          {event.description?.split(".")[0] || "No description available."}
        </p>
        
        {event.createdAt && (
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Created: {formatDate(event.createdAt)}</span>
          </div>
        )}
      </CardContent>

      {!isPublic && (
        <CardFooter 
          className="pt-4 flex justify-between gap-2 flex-wrap border-t border-gray-100 bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center bg-white"
            onClick={copyEventLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-2" />
                <span>Copy Link</span>
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
            <span>{loading ? "Deleting..." : "Delete"}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;