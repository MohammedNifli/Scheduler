    import { getUserByName } from "@/actions/users";
    import { notFound } from "next/navigation";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import EventCard from "@/components/event-card";
import { getEventDetails } from "@/actions/events";
import { Suspense } from "react";
import EventDetails from "./_components/event-details";
import BookingForm from "./_components/booking-from";

   


    export async function generateMetadata(props) {
        const { params } = props;
        const { username,eventId } = await params; // Await the params promise
        console.log("seooo", username);
        const event = await getEventDetails(username,eventId);
        if (!event) {
            return {
                title: "User Not Found"
            };
        }
    
        return {
            title: `Book ${event.title} with ${event.user.name}` || "Scheduler",
            description: `Schedule a ${event.duratio} minute.${event.title} event with ${event.user.name}`
        };
    }
    


    const EventPage = async ({ params }) => {
    const { username,eventId } = await params; // Extract the username from params

    const event = await getEventDetails(username,eventId);
    if (!event) {
        notFound();
    }

    return (

        <div className="flex  flex-col justify-center lg:flex-row px-8 py-4">
            Event page
            <EventDetails event={event}/>
            <Suspense fallback={<div>Loading booking form...</div>}>
                <BookingForm/>
            </Suspense>
        </div>
       

        
    );
    };

    export default EventPage;
