"use server";

import { db } from "../lib/prisma";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username) {
    const userData = await currentUser();
    if (!userData) {
        throw new Error("Unauthorized: No user data found.");
    }

    const userId = userData.id;
    if (!userId) {
        throw new Error("Unauthorized: No user ID found.");
    }

    const existingUsername = await db.user.findUnique({
        where: { username },
    });

    if (existingUsername && existingUsername.clerkUsrId !== userId) {
        throw new Error("Username already taken.");
    }

    
    const existingUser = await db.user.findUnique({
        where: { clerkUsrId: userId },
    });

    if (!existingUser) {
        throw new Error("User not found in database.");
    }

  
    await db.user.update({
        where: { clerkUsrId: userId },
        data: { username },
    });

    try {
        
        const updatedUser = await clerkClient.users.update(userId, {
            username,
        });

        console.log("Clerk update response:", updatedUser);

        return { success: true };
    } catch (error) {
        console.error("Error updating user in Clerk:", error);
        throw new Error("Failed to update username .");
    }
}