import nodemailer from 'nodemailer';
import { createEvent } from 'ics';

// Simple SMTP transporter
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email template
export const bookingEmailTemplate = (eventTitle, startTime, endTime, hostName, meetLink, additionalInfo) => {
  const formattedDate = new Date(startTime).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const formattedEndTime = new Date(endTime).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .details {
          background-color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin-top: 10px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin:0;">Booking Confirmed</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Your booking for <strong>${eventTitle}</strong> has been confirmed. Here are the details:</p>
        
        <div class="details">
          <p><strong>📅 Date & Time:</strong> ${formattedDate} - ${formattedEndTime}</p>
          <p><strong>👤 Host:</strong> ${hostName}</p>
          ${additionalInfo ? `<p><strong>📝 Notes:</strong> ${additionalInfo}</p>` : ''}
        </div>

        ${meetLink ? `
        <p>Join the meeting using the link below:</p>
        <a href="${meetLink}" class="button">Join Meeting</a>
        ` : ''}

        <p style="margin-top: 20px;">We look forward to seeing you!</p>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate iCalendar (.ics) file
export const generateICal = async (
  title,
  description,
  startTime,
  endTime,
  organizer,
  attendees,
  meetLink
) => {
  try {
    // Validate URL format if meetLink exists
    const validatedUrl = meetLink && meetLink.match(/^https?:\/\//) ? meetLink : undefined;

    const event = {
      start: [
        startTime.getFullYear(),
        startTime.getMonth() + 1,
        startTime.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
      ],
      end: [
        endTime.getFullYear(),
        endTime.getMonth() + 1,
        endTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
      ],
      title,
      description: description || 'No additional details provided',
      location: validatedUrl || '',
      url: validatedUrl || undefined, // Only include if valid URL
      organizer: {
        name: organizer.name,
        email: organizer.email,
      },
      attendees: attendees.map(attendee => ({
        name: attendee.name,
        email: attendee.email,
      })),
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };

    return new Promise((resolve) => {
      createEvent(event, (error, value) => {
        if (error) {
          // Create a fallback event without the problematic fields
          const fallbackEvent = { ...event };
          delete fallbackEvent.url;
          delete fallbackEvent.location;
          
          createEvent(fallbackEvent, (fallbackError, fallbackValue) => {
            if (fallbackError) {
              console.error('Fallback iCal generation failed:', fallbackError);
              resolve(null);
            } else {
              console.warn('Generated iCal without URL due to validation error');
              resolve(fallbackValue);
            }
          });
        } else {
          resolve(value);
        }
      });
    });
  } catch (error) {
    console.error('Error in generateICal:', error);
    return null;
  }
};

// Send email function
export const sendBookingEmail = async (
  to,
  subject,
  eventTitle,
  startTime,
  endTime,
  hostName,
  meetLink,
  additionalInfo,
  icsContent
) => {
  try {
    const transporter = createTransporter();
    const htmlContent = bookingEmailTemplate(
      eventTitle,
      startTime,
      endTime,
      hostName,
      meetLink,
      additionalInfo
    );

    const mailOptions = {
      from: `"Booking System" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
      text: `Booking confirmed for ${eventTitle}\n\nHost: ${hostName}\nTime: ${new Date(startTime).toLocaleString()} - ${new Date(endTime).toLocaleString()}\n${meetLink ? `Join: ${meetLink}` : ''}\n${additionalInfo ? `Notes: ${additionalInfo}` : ''}`,
    };

    // Add iCal attachment if available
    if (icsContent) {
      mailOptions.attachments = [{
        filename: 'event.ics',
        content: icsContent,
        contentType: 'text/calendar',
      }];
    }

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    return false;
  }
};