"use server";

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isBefore, parseISO, isValid, startOfDay, addDays, addMinutes,format } from "date-fns";


export async function CreateEvent(data) {
  try {
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized: Please sign in to create events.");
    }

    // 2. Data Validation
    const validatedData = eventSchema.parse(data);

 

    // 3. Verify User Exists
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User account not found.");
    }

    return await db.event.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageurl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Event creation failed:", error);


    if (error.name === "ZodError") {
      throw new Error(
        `Invalid event data: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }

    // Handle other errors
    throw new Error(
      error.message || "Failed to create event. Please try again."
    );
  }
}

export async function getAllUserEvents() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please sign in to create events.");
  }

  const existingUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!existingUser) {
    throw new Error("user not found");
  }

  const events = await db.event.findMany({
    where: { userId: existingUser.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: existingUser.username };
}


export async function deleteEvent(eventId) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please sign in to delete events.");
  }

  const existingUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (!eventId) {
    throw new Error("Invalid event ID");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== existingUser.id) {
    throw new Error("Event not found or unauthorized");
  }

  // Wrap in a transaction (optional)
  await db.$transaction([
    db.event.delete({
      where: { id: eventId },
    }),
  ]);

  return { success: true, message: "Event deleted successfully" };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          username: true,
          imageurl: true,
        },
      },
    },
  });
  return event;
}

export async function getEventAvailability(eventId) {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          include: {
            availability: {
              include: { dayAvailabilities: true },
            },
            bookings: {
              where: { eventId },
              select: { startTime: true, endTime: true },
            },
          },
        },
      },
    });

    if (!event?.user?.availability?.dayAvailabilities) {
      // console.log("No day availabilities found");
      return [];
    }

    const { dayAvailabilities, timeGap = 15 } = event.user.availability;
    const { bookings = [] } = event.user;
    
    // Use UTC for all date operations
    const startDate = startOfDay(new Date());
    const endDate = addDays(startDate, 30);

    // console.log("Day availabilities:", JSON.stringify(dayAvailabilities, null, 2));
    // console.log("Bookings count:", bookings.length);

    const availableDates = [];

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { 
        weekday: "long",
        timeZone: 'UTC'
      }).toLowerCase();
      
      const dateStr = format(currentDate, "yyyy-MM-dd");
      // console.log(`Checking ${dateStr} (${dayOfWeek})`);

      const dayAvailability = dayAvailabilities.find(
        (da) => da.day.toLowerCase() === dayOfWeek
      );

      if (!dayAvailability) {
        // console.log(`No availability for ${dayOfWeek}`);
        continue;
      }

      // console.log(`Found availability for ${dayOfWeek}:`, dayAvailability);
      
      // Filter bookings for this specific date (UTC comparison)
      const dateBookings = bookings.filter(booking => {
        const bookingDate = format(new Date(booking.startTime), "yyyy-MM-dd");
        return bookingDate === dateStr;
      });

      // console.log(`Found ${dateBookings.length} bookings for ${dateStr}`);

      const slots = await generateAllAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        dateBookings,
        dateStr,
        timeGap
      );

      // console.log(`Generated ${slots.length} slots for ${dateStr}`);

      if (slots.length > 0) {
        availableDates.push({ 
          date: dateStr, 
          slots,
          day: dayOfWeek 
        });
      }
    }

    // console.log("Final available dates:", JSON.stringify(availableDates, null, 2));
    return availableDates;
  } catch (error) {
    console.error("Error in getEventAvailability:", error);
    return [];
  }
}

export async function generateAllAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap
) {


  
  const slots = [];

  if (!startTime || !endTime) {
    console.error("Missing startTime or endTime");
    return [];
  }

  // Convert to Date objects if they aren't already
  const startDateTime = startTime instanceof Date ? new Date(startTime) : parseISO(startTime);
  const endDateTime = endTime instanceof Date ? new Date(endTime) : parseISO(endTime);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    console.error("Invalid date format", { startTime, endTime });
    return [];
  }

  // Create working dates in UTC
  const currentTime = new Date(dateStr);
  currentTime.setUTCHours(
    startDateTime.getUTCHours(),
    startDateTime.getUTCMinutes(),
    0,
    0
  );

  const slotEndTime = new Date(dateStr);
  slotEndTime.setUTCHours(
    endDateTime.getUTCHours(),
    endDateTime.getUTCMinutes(),
    0,
    0
  );

  // Adjust for timeGap if the date is today (in UTC)
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  
  if (dateStr === todayStr) {
    const adjustedTime = addMinutes(now, timeGap);
    if (isBefore(currentTime, adjustedTime)) {
      currentTime.setTime(adjustedTime.getTime());
      // Ensure we don't go past the end time
      if (currentTime >= slotEndTime) {
        return [];
      }
    }
  }

  // Generate slots
  while (currentTime < slotEndTime) {
    const slotEnd = addMinutes(currentTime, duration);

    // Don't go past the end time
    if (slotEnd > slotEndTime) {
      break;
    }

    // Check for booking conflicts (all comparisons in UTC)
    const isSlotAvailable = !bookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      // Format time in HH:mm (UTC)
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime.setTime(slotEnd.getTime());
  }

  return slots;
}