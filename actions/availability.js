'use server'

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { defaultAvailability } from "../app/(main)/availability/data"; 

export async function getUserAvailability() {
  const userData = await currentUser();
  const userId = userData?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUsrId: userId },
    include: { 
      availability: {
        include: {
          dayAvailabilities: true // ✅ Correct field name
        }
      } 
    }
  });

  console.log("usssssssssss",user)

  if (!user || !user.availability || !user.availability.days) {
    return defaultAvailability; 
  }

  const availabilityData = {
    timeGap: user.availability?.timeGap || defaultAvailability?.timeGap,
  };

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  daysOfWeek.forEach((day) => {
    const dayAvailability = user.availability.days.find(
      (d) => d.days.toLowerCase() === day
    );

    availabilityData[day] = {
      isAvailable: !!dayAvailability,
      startTime: dayAvailability? dayAvailability.startTime.toISOString().slice(11,16):"9:00 " ,
      endime: dayAvailability? dayAvailability.endTime.toISOString().slice(11,16):"17:00 " ,
    };
  });

  return availabilityData;
}


export async function updateAvailability(data) {
  const userData = await currentUser();
  const userId = userData?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUsrId: userId },
    include: {
      availability: {
        include: {
          dayAvailabilities: true
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  let availability = user.availability;
  if (!availability) {
    availability = await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap || 15,
      },
    });
  }

  await db.dayAvailability.deleteMany({
    where: { availabilityId: availability.id },
  });

  // Prepare new availability records with proper date handling
  const availabilityUpdates = Object.entries(data)
    .filter(([_, { isAvailable }]) => isAvailable)
    .map(([day, { startTime, endTime }]) => {
      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        throw new Error(`Invalid time format for ${day}. Use HH:mm format (e.g., "09:00")`);
      }

      // Construct proper ISO date strings
      const today = new Date().toISOString().split('T')[0];
      const startDateStr = `${today}T${startTime.padStart(5, '0')}:00`;
      const endDateStr = `${today}T${endTime.padStart(5, '0')}:00`;
      
      return {
        availabilityId: availability.id,
        day: day.toUpperCase(),
        startTime: new Date(startDateStr),
        endTime: new Date(endDateStr),
      };
    });

  console.log("New availability records:", availabilityUpdates);

  if (availabilityUpdates.some(record => 
    isNaN(record.startTime.getTime()) || 
    isNaN(record.endTime.getTime())
  )) {
    throw new Error("Invalid date values detected");
  }

  if (availabilityUpdates.length > 0) {
    await db.dayAvailability.createMany({
      data: availabilityUpdates,
    });
  }

  return {
    message: "Availability updated successfully",
    timeGap: data.timeGap || 15,
  };
}