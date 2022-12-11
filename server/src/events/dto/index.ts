import { z } from 'zod'

export const userSchema = z.object({
  userId: z.string(),
  deviceId: z.string(),
})

export type User = z.infer<typeof userSchema>

export const deviceSchema = z.object({
  type: z.union([z.literal('desktop'), z.literal('mobile')]),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  browser: z.string(),
})

export type Device = z.infer<typeof deviceSchema>

export const websiteSchema = z.object({
  url: z.string(),
  referrer: z.string(),
  title: z.string(),
})

export type Website = z.infer<typeof websiteSchema>

export const baseEventSchema = z.object({
  user: userSchema,
  device: deviceSchema,
  website: websiteSchema,
})

export const visibilityEventSchema = baseEventSchema.extend({
  state: z.string(),
  screenTime: z.number(),
})

export type VisibilityEvent = z.infer<typeof visibilityEventSchema>

export const errorEventSchema = baseEventSchema.extend({
  message: z.string(),
  filename: z.string(),
  lineNumber: z.number().min(0),
  columnNumber: z.number().min(0),
})

export type ErrorEvent = z.infer<typeof errorEventSchema>

export const loadEventSchema = baseEventSchema.extend({
  time: z.number().min(0),
})

export type LoadEvent = z.infer<typeof loadEventSchema>

export const fetchEventSchema = baseEventSchema.extend({
  time: z.number().min(0),
  url: z.string(),
  method: z.string(),
  status: z.number().min(0),
})

export type FetchEvent = z.infer<typeof fetchEventSchema>

export const viewEventSchema = baseEventSchema

export type ViewEvent = z.infer<typeof viewEventSchema>
