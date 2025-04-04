    import { getUserByName } from "@/actions/users";
    import { notFound } from "next/navigation";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import EventCard from "@/components/event-card";

   


    export async function generateMetadata(props) {
        const { params } = props;
        const { username } = await params; // Await the params promise
        console.log("seooo", username);
        const user = await getUserByName(username);
        if (!user) {
            return {
                title: "User Not Found"
            };
        }
    
        return {
            title: `${user.name}'s Profile` || "Scheduler",
            description: `Book an event with ${user.name}. View available public events and schedules.`
        };
    }
    


    const UserPage = async ({ params }) => {
    const { username } = await params; // Extract the username from params

    const user = await getUserByName(username);
    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
  <div className="flex flex-col items-center space-y-4">
    {/* User Avatar and Information */}
    <Avatar>
      <AvatarImage src={user?.imageurl} alt={user?.name} />
      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <h1 className="text-3xl font-bold">{user.name}</h1>
    <p>Welcome to my scheduling page. Please select an event below to book a call with me.</p>
  </div>

  {/* Events Section */}
  <div className="mt-8">
    {user.events.length === 0 ? (
      <p className="text-center text-gray-600">No Public events available</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            username={username}
            isPublic 
          />
        ))}
      </div>
    )}
  </div>
</div>

        
    );
    };

    export default UserPage;
