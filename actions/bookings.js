"use server";
import { db } from "@/lib/prisma";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendBookingEmail, generateICal } from "@/lib/email";

export async function createBookings(bookingData) {
  try {
    // 1. Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized: Please sign in to create bookings.");
    }

    // 2. Get event details
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });
    if (!event) throw new Error("Event not found");

    // 3. Validate time
    const startTime = new Date(bookingData.startTime);
    const endTime = new Date(bookingData.endTime);
    if (isNaN(startTime.getTime())) throw new Error("Invalid start time");
    if (startTime >= endTime) throw new Error("End time must be after start time");

    // 4. Create booking
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime,
        endTime,
        additionalInfo: bookingData.additionalInfo || '',
      },
    });

    let meetLink = null;
    let icsContent = null;

    // 5. (Optional) Google Calendar integration
    if (event.user.oauthAccessToken) {
      try {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.NEXTAUTH_URL
        );
        oauth2Client.setCredentials({
          access_token: event.user.oauthAccessToken,
          refresh_token: event.user.oauthRefreshToken,
        });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const eventResponse = await calendar.events.insert({
          calendarId: "primary",
          conferenceDataVersion: 1,
          requestBody: {
            summary: `${event.title} with ${bookingData.name}`,
            start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
            end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
            attendees: [
              { email: bookingData.email, displayName: bookingData.name },
              { email: event.user.email, displayName: event.user.name || 'Host' },
            ],
            conferenceData: {
              createRequest: { conferenceSolutionKey: { type: "hangoutsMeet" } },
            },
          },
        });
        meetLink = eventResponse.data.hangoutLink;

        // Update booking with Google Meet link
        await db.booking.update({
          where: { id: booking.id },
          data: { meetLink },
        });

        // Generate iCal invite
        icsContent = await generateICal(
          event.title,
          bookingData.additionalInfo || '',
          startTime,
          endTime,
          { name: event.user.name || 'Host', email: event.user.email },
          [{ name: bookingData.name, email: bookingData.email }],
          meetLink
        );
      } catch (error) {
        console.error("Google Calendar failed (proceeding without it):", error);
      }
    }

    // 6. Send emails
    const emailResults = {
      guest: await sendBookingEmail(
        bookingData.email,
        `Booking Confirmed: ${event.title}`,
        event.title,
        startTime,
        endTime,
        event.user.name || 'Host',
        meetLink,
        bookingData.additionalInfo,
        icsContent
      ),
      host: await sendBookingEmail(
        event.user.email,
        `New Booking: ${event.title} with ${bookingData.name}`,
        event.title,
        startTime,
        endTime,
        bookingData.name,
        meetLink,
        bookingData.additionalInfo,
        icsContent
      ),
    };

    return {
      success: true,
      booking: { ...booking, meetLink, emailsSent: emailResults },
    };
  } catch (error) {
    console.error("Booking failed:", error);
    return { success: false, error: error.message };
  }
}