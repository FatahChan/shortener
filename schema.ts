import z from "zod";

export const postShortenerSchema = z.object({
  url: z.string().url(),
});

export const shortenerObjectSchema = z.object({
  id: z.string(),
  url: z.string(),
  shortCode: z.string(),
  createAt: z.string(),
  updateAt: z.string(),
  accessCount: z.number().default(0).optional(),
});
