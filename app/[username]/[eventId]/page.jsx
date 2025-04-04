    import { getUserByName } from "@/actions/users";
    import { notFound } from "next/navigation";
    import { Suspense } from "react";
    import EventDetails from "./_components/event-details";
    import BookingForm from "./_components/booking-from";
    import { Card } from "@/components/ui/card";
    import { getEventAvailability, getEventDetails } from "@/actions/events";

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
        console.log("eventIdddddddddd",eventId)


        const event = await getEventDetails(username, eventId);
        console.log("event kittiyo",event)
        const eventAvailability = await getEventAvailability(eventId);
        console.log("eventAvailability kittiyo",eventAvailability)

        if (!event) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Event Details Column */}
                        <div className="w-full">
                            <EventDetails event={event} />
                        </div>

                        {/* Booking Form Column */}
                        <div className="w-full">
                            <Suspense fallback={
                                <Card className="w-full p-6 text-center">
                                    Loading booking form...
                                </Card>
                            }>
                                <BookingForm 
                                    event={event}
                                    eventAvailability={eventAvailability}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default EventPage;