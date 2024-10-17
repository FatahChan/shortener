import type { z } from "zod";
import type { shortenerObjectSchema } from "./schema.ts";

// helper functions
export async function hashAndEncodeUrl(url: string, length: number = 7) {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(url)
  );
  const base64Hash = btoa(String.fromCharCode(...new Uint8Array(hash)));

  return base64Hash.substring(0, length);
}

export function stripUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function getShortenerObject(
  kv: Deno.Kv,
  shortCode: string,
  withAccessCount: boolean = false
) {
  const { value } = await kv.get<z.infer<typeof shortenerObjectSchema>>([
    shortCode,
  ]);
  if (!value) {
    return null;
  }
  if (!withAccessCount) {
    delete value.accessCount;
  }
  return value;
}
