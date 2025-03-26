import React, { Suspense } from 'react';
import { getAllUserEvents } from '../../../actions/events';
import EventCard from '../../../components/event-card';
import { Loader2 } from 'lucide-react';

export default async function EventsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
      </header>

      <Suspense 
        fallback={
          <div className="flex justify-center items-center py-16">
            <Loader2 size={24} className="text-blue-600 animate-spin mr-2" />
            <span className="text-gray-600 font-medium">Loading events...</span>
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
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h2 className="text-lg font-medium text-gray-800 mb-2">No events found</h2>
        <p className="text-gray-600">You haven&apos;t created any events yet.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <div key={event.id} className="h-full">
          <EventCard event={event} username={username} />
        </div>
      ))}
    </div>
  );
};