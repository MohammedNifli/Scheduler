import { getUserByName } from "@/actions/users";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getEventAvailability, getEventDetails } from "@/actions/events";
import { Video, Clock, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Import the BookingForm component
import BookingForm from "./_components/booking-from";

// Loading component with tooltip style
function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="flex items-center gap-2 bg-background text-foreground text-sm px-4 py-2 rounded-full shadow-md border">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span>Loading event details...</span>
      </div>
    </div>
  );
}

export async function generateMetadata(props) {
  const { params } = props;
  const { username, eventId } = await params;
  const event = await getEventDetails(username, eventId);
  
  if (!event) {
    return {
      title: "User Not Found"
    };
  }

  return {
    title: `Book ${event.title} with ${event.user.name}` || "Scheduler",
    description: `Schedule a ${event.duration} minute ${event.title} event with ${event.user.name}`
  };
}

const EventPage = async ({ params }) => {
  const { username, eventId } = await params;
  const event = await getEventDetails(username, eventId);
  const eventAvailability = await getEventAvailability(eventId);

  if (!event) {
    notFound();
  }

  const { user } = event;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage 
                src={user.imageurl} 
                alt={`${user.name}'s profile`} 
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-700 text-white text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold">{event.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                    @{user.username}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="h-4 w-4" />
                  <span>{event.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Video className="h-4 w-4" />
                  <span>Google Meet</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x">
            {/* User details section - 2 columns on desktop */}
            <div className="p-6 md:col-span-2 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">Book a time to connect</p>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{event.duration} Minute Meeting</p>
                    <p className="text-sm text-gray-500">Video call via Google Meet</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Select a Date & Time</p>
                    <p className="text-sm text-gray-500">Choose from available slots</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Instant Confirmation</p>
                    <p className="text-sm text-gray-500">Receive meeting link immediately</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking form section - 3 columns on desktop */}
            <div className="md:col-span-3">
              <Suspense fallback={<LoadingIndicator />}>
                <BookingForm 
                  event={event}
                  eventAvailability={eventAvailability}
                />
              </Suspense>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventPage;