
import { title } from 'process'
import {z} from 'zod'


export const usernameSchema = z.object({
  username: z.string()
    .min(3, "Must be at least 3 characters")
    .max(20, "Cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores")
});

export const eventSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  duration: z.number()
    .min(15, "Duration must be at least 15 minutes")
    .max(240, "Duration cannot exceed 4 hours"),
  isPrivate: z.boolean().default(true),
});



export const daySchema = z.object({
  isAvailable: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional()  // ✅ Fixed typo (was "endTIme")
}).refine((data) => {
  if (data.isAvailable && data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: "End time must be later than start time",
  path: ["endTime"]  // ✅ Added path to target "endTime" field
});

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, { message: "Time gap must be more than 0 minutes" }).int(),
});

export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  additionalInfo: z.string().optional(),
});