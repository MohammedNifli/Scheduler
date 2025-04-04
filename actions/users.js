"use server";

import { db } from "../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateUsername(username) {
  // Get session using NextAuth.js
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized: No user session found.");
  }

  // Find user by email
  const existingUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!existingUser) {
    throw new Error("User not found in database.");
  }

  // Check if username is taken
  const existingUsername = await db.user.findUnique({
    where: { username },
  });

  if (existingUsername && existingUsername.id !== existingUser.id) {
    throw new Error("Username already taken.");
  }

  // Update username
  await db.user.update({
    where: { id: existingUser.id },
    data: { username },
  });

  return { success: true };
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