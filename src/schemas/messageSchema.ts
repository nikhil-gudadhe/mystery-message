import {z} from "zod"

export const messageSchema = z.object({
    content: z.string()
    .min(10, {message: "Content must be at least of 10 characters"})
    .max(300, {message: "Content should not exceed more than 300 characters"})
})