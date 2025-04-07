"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, User, Video, ExternalLink, Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cancelMeeting } from "@/actions/meetings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

const MeetingList = ({ meetings, type }) => {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState(null);

  const handleJoinMeeting = (meetingUrl) => {
    window.open(`${meetingUrl}?authuser=1`, "_blank");
  };

  const { loading, fn: cancelMeetingHandler } = useFetch(cancelMeeting)


  const handleCancelMeeting = async (meetId) => {
    if (!meetId) return toast.error("Invalid Meeting ID");
  
    setCancellingId(meetId);
  
    try {
      const cancelledMeeting = await cancelMeetingHandler(meetId);
      console.log("Cancelled Meeting:", cancelledMeeting);
  
      toast.success("Meeting cancelled successfully");
      router.refresh();
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      toast.error("Failed to cancel meeting");
    } finally {
      setCancellingId(null);
    }
  };
  
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
        <Calendar className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-muted-foreground font-medium">No {type} meetings found</p>
        <p className="text-sm text-gray-400 mt-1">Meetings will appear here once scheduled</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        const meetingUrl = meeting.meetLink;
        const isUpcoming = type === "upcoming";
        const isCancelled = meeting.status === "CANCELLED";
        const startTime = new Date(meeting.startTime);
        const endTime = new Date(meeting.endTime);
        const duration = Math.round((endTime - startTime) / (1000 * 60));
        const durationText = duration < 60 
          ? `${duration} min` 
          : `${Math.floor(duration / 60)}h ${duration % 60 > 0 ? `${duration % 60}m` : ''}`;
        
        return (
          <Card 
            key={meeting.id} 
            className={`overflow-hidden flex flex-col h-full transition-all ${
              isCancelled 
                ? "border-l-4 border-l-red-500 bg-red-50/30" 
                : isUpcoming 
                  ? "border-l-4 border-l-blue-500 hover:shadow-md" 
                  : "border-l-4 border-l-gray-300"
            }`}
          >
            <CardHeader className={`pb-3 ${
              isCancelled 
                ? "bg-red-50/50" 
                : isUpcoming 
                  ? "bg-blue-50/50" 
                  : "bg-gray-50/50"
            }`}>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="line-clamp-1 text-lg font-semibold">
                  {meeting.event?.title || "Meeting"}
                </CardTitle>
                <Badge variant={
                  isCancelled 
                    ? "destructive" 
                    : isUpcoming 
                      ? "default" 
                      : "secondary"
                } className="shrink-0">
                  {isCancelled ? "Cancelled" : isUpcoming ? "Upcoming" : "Completed"}
                </Badge>
              </div>
              <CardDescription className="mt-1.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 font-medium">
                    {meeting.event?.user?.name || "Host"}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="py-4 flex-grow">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCancelled ? "bg-red-100" : "bg-blue-100"
                  }`}>
                    <Calendar className={`h-4 w-4 ${
                      isCancelled ? "text-red-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {format(startTime, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCancelled ? "bg-red-100" : "bg-green-100"
                  }`}>
                    <Clock className={`h-4 w-4 ${
                      isCancelled ? "text-red-600" : "text-green-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time ({durationText})</p>
                    <p className="font-medium">
                      {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                    </p>
                  </div>
                </div>
                
                {meeting.additionalInfo && (
                  <div className="flex items-start gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Info className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="text-sm line-clamp-2">{meeting.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 pb-4">
              <div className="w-full space-y-2">
                {isCancelled ? (
                  <div className="w-full text-center py-2 text-sm text-red-600 font-medium">
                    This meeting has been cancelled
                  </div>
                ) : isUpcoming ? (
                  <>
                    {meeting.meetLink && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleJoinMeeting(meeting.meetLink)}
                            >
                              <Video className="h-4 w-4" />
                              Join Meeting
                              <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Opens meeting in a new tab</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleCancelMeeting(meeting.id)}
                      disabled={cancellingId === meeting.id}
                    >
                      <X className="h-4 w-4" />
                      {cancellingId === meeting.id ? "Cancelling..." : "Cancel Meeting"}
                    </Button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-sm text-gray-500">
                    Meeting {new Date() > endTime ? "ended" : "completed"}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MeetingList;