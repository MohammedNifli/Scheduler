"use server";

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";

export async function CreateEvent(data) {

  console.log("evetn dafffffffffffffdata",data)
  const userData = await currentUser();
  const userId = userData.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(data);

  const existingUser = await db.user.findUnique({
    where: { clerkUsrId: userId },
  });

  if (!existingUser) {
    throw new Error("user not found");
  }

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: existingUser.id,
    },
  });

  return event;
}


export async function getAllUserEvents() {
    const userData = await currentUser();
    const userId = userData.id;
  
    if (!userId) {
      throw new Error("Unauthorized");
    }


    const existingUser = await db.user.findUnique({
        where: { clerkUsrId: userId },
      });
    
      if (!existingUser) {
        throw new Error("user not found");
      }


      const events=await db.event.findMany({
        where:{userId:existingUser.id},
        orderBy:{createdAt:"desc" },
        include:{
            _count:{
                select:{bookings:true}
            }
        }
      });

      return {events,username:existingUser.username}

    
}



export async function deleteEvent(eventId) {
  const userData = await currentUser();
  const userId = userData.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }


  const existingUser = await db.user.findUnique({
      where: { clerkUsrId: userId },
    });
  
    if (!existingUser) {
      throw new Error("user not found");
    }


    const event=await db.event.findUnique({

      where:{id:eventId},
       
    });
   
    if(!event || event.userId !==existingUser.id){
      throw new Error("Event not found or unauthorized")
    }

     
await db.event.delete({
where:{id:eventId}
})


    return {success:true}

  
}


export async function getEventDetails(username,eventId){
    const event=await db.event.findFirst({
      where:{
        id:eventId,
        user:{
          username:username
        }
      },
      include:{
        user:{
          select:{
            name:true,
            email:true,
            username:true,
            imageurl:true,

          }

        }
      }
    })
    return event;
}