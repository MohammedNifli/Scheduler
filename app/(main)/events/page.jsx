
import React, { Suspense, use } from 'react';
import { getAllUserEvents } from '../../../actions/events';
import EventCard from '../../../components/event-card';
import { Loader2, Calendar, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';


export default async function EventsPage() {
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming and past events and book your events</p>
        </div>
       
        
       
      </header>

      <Suspense 
        fallback={
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 size={36} className="text-blue-600 animate-spin mx-auto mb-4" />
              <span className="text-gray-600 font-medium block">Loading your events...</span>
            </div>
          
          </div>
        }
      >
        <Events />
      </Suspense>
    </div>
  );
}

const Events = async() => {
  const { events, username } = await getAllUserEvents();

  
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Calendar size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-800 mb-2">No events found</h2>
        <p className="text-gray-600 mb-6">You haven&apos;t created any events yet.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/events/new">
            <Plus size={18} className="mr-2" />
            Create Your First Event
          </Link>
        </Button>
      </div>
    );
  }
  
  // Filter events by status for tabs
  const upcomingEvents = events.filter(event => new Date(event.createdAt) > new Date());
  const pastEvents = events.filter(event => new Date(event.createdAt) <= new Date());
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Events ({events.length})</TabsTrigger>
            {/* <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger> */}
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="h-full">
                    <EventCard event={event} username={username} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="h-full">
                    <EventCard event={event} username={username} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <div key={event.id} className="h-full">
                    <EventCard event={event} username={username} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};