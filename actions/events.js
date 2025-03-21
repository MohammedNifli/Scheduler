"use server"

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server"


export async function CreateEvent(data){
    const userData=await currentUser()
    const userId=userData.id ;

    if(!userId){
        throw new Error("Unauthorized")
    }

    const validatedData=eventSchema.parse(data);

    const existingUser=await db.user.findUnique({
        where:{clerkUsrId:userId},
    })

    if(!existingUser){
        throw new Error("user not found")
    }

    const event=await db.event.create({
        data:{
            ...validatedData,
            userId:existingUser.id,

        }

    })


    return event;
    
}