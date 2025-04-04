
import { title } from 'process'
import {z} from 'zod'


export const usernameSchema=z.object({
  username:z.string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9]+$/,
   'username can only contain letters, and underscores')

})

export const eventSchema=z.object({
  title:z.string()
  .min(1,"Title is required")
  .max(100,"Title must be include 100 characters or less"),


  description:z.string()
  .min(1,"Description is required")
  .max(500,"Description  must be 500 characters or less"),

  duration:z.number().int().positive("Duration must be a postive number"),
  isPrivate: z.boolean(),
})


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