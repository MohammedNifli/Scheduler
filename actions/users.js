"use server";

import { db } from "../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";




export async function updateUsername(username) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error("Unauthorized: Please sign in to update your username.");
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      throw new Error("Username must be 3-20 characters (letters, numbers, _ or -)");
    }

    const existingUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!existingUser) {
      throw new Error("User account not found.");
    }

    // Case-insensitive check
    const existingUsername = await db.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' },
        NOT: { id: existingUser.id }
      }
    });

    if (existingUsername) {
      throw new Error(`Username "${username}" is already taken.`);
    }

    const updatedUser = await db.user.update({
      where: { id: existingUser.id },
      data: { username },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    return {
      success: true,
      user: updatedUser,
      message: "Username updated successfully!"
    };

  } catch (error) {
    console.error("Username update failed:", error);
    throw error;
  }
}

export async function getUserByName(username) {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        email: true,
        imageurl: true,
        events: {
          where: {
            isPrivate: false
          },
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            isPrivate: true,
            _count: {
              select: { bookings: true }
            }
          }
        }
      }
    });
  
    return user;
  }


  // actions/users.js
export async function getCurrentUsername() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        username: true
      }
    });

    return user?.username || null;
    
  } catch (error) {
    console.error("Failed to fetch username:", error);
    return null;
  }
}