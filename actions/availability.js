'use server'

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { defaultAvailability } from "../app/(main)/availability/data"; 

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth"; // Ensure correct auth options import


export async function getUserAvailability() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please sign in.");
  }

  // Fetch user from DB using email
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { 
      availability: {
        include: {
          dayAvailabilities: true,
        }
      }
    }
  });

  console.log("User Data:", user);

  if (!user || !user.availability || !user.availability.dayAvailabilities) {
    return defaultAvailability;
  }

  const availabilityData = {
    timeGap: user.availability?.timeGap || defaultAvailability?.timeGap,
  };

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  daysOfWeek.forEach((day) => {
    // Safely find matching day availability
    const dayAvailability = user.availability.dayAvailabilities.find((d) => {
      // Add null checks and ensure days is a string
      if (!d || typeof d.days !== 'string') return false;
      return d.days.toLowerCase() === day;
    });

    availabilityData[day] = {
      isAvailable: Boolean(dayAvailability),
      startTime: dayAvailability?.startTime
        ? dayAvailability.startTime.toISOString().slice(11, 16)
        : "09:00",
      endTime: dayAvailability?.endTime
        ? dayAvailability.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}


export async function updateAvailability(data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized: Please sign in.");
    }

    // Validate input structure
    if (!data || typeof data !== 'object') {
      throw new Error("Invalid availability data format");
    }

    // Get user with availability
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { availability: { include: { dayAvailabilities: true } }
  }
});

    if (!user) throw new Error("User not found");

    // Update or create availability
    const availability = user.availability 
      ? await db.availability.update({
          where: { id: user.availability.id },
          data: { timeGap: data.timeGap || 15 }
        })
      : await db.availability.create({
          data: {
            userId: user.id,
            timeGap: data.timeGap || 15
          }
        });

    // Delete existing day availabilities
    await db.dayAvailability.deleteMany({
      where: { availabilityId: availability.id }
    });

    // Process new availability data
    const availabilityUpdates = [];
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    for (const day of days) {
      if (data[day]?.isAvailable) {
        const { startTime, endTime } = data[day];
        
        // Validate time format
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
          throw new Error(`Invalid time format for ${day}. Use HH:mm (24-hour format)`);
        }

        // Validate time order
        if (startTime >= endTime) {
          throw new Error(`End time must be after start time for ${day}`);
        }

        // Create date objects (using arbitrary date)
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(`${today}T${startTime.padStart(5, '0')}:00`);
        const endDate = new Date(`${today}T${endTime.padStart(5, '0')}:00`);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error(`Invalid time values for ${day}`);
        }

        availabilityUpdates.push({
          availabilityId: availability.id,
          day: day.toLowerCase(), // Consistent lowercase
          startTime: startDate,
          endTime: endDate
        });
      }
    }

    // Create new records if any
    if (availabilityUpdates.length > 0) {
      await db.dayAvailability.createMany({
        data: availabilityUpdates
      });
    }

    return {
      success: true,
      message: "Availability updated successfully",
      timeGap: availability.timeGap
    };

  } catch (error) {
    console.error("Error updating availability:", error);
    throw new Error(error.message || "Failed to update availability");
  }
}