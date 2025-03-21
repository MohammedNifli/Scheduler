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

  duration:z.number().int().positive("Duration must be a postive number")
})