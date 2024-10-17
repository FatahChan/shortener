import type { Context } from "hono";
import { hashAndEncodeUrl, stripUrl } from "./helpers.ts";
import { postShortenerSchema } from "./schema.ts";
import { getShortenerObject } from "./helpers.ts";

export async function postShortener(c: Context, kv: Deno.Kv) {
  const { data: { url = "" } = {}, success } = postShortenerSchema.safeParse(
    await c.req.json()
  );

  if (!success) {
    return c.json({ error: "Invalid URL" }, 400);
  }
  const strippedUrl = stripUrl(url);

  const existingPair = await kv.get<{ shortCode: string }>([strippedUrl]);
  if (existingPair && existingPair?.value?.shortCode) {
    const value = await getShortenerObject(kv, existingPair.value.shortCode);
    if (!value) {
      // delete the existing pair if the short code is not found
      await kv.delete([strippedUrl]);
    } else {
      return c.json(value, 200);
    }
  }
  const id = crypto.randomUUID();
  const shortCode = await hashAndEncodeUrl(url);

  const res = await kv
    .atomic()
    .set([shortCode], {
      id,
      url: strippedUrl,
      shortCode,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      accessCount: 0,
    })
    .set([strippedUrl], { shortCode })
    .commit();

  if (!res.ok) {
    return c.json({ error: "Failed to create short URL" }, 500);
  }
  const value = await getShortenerObject(kv, shortCode);
  if (!value) {
    return c.json({ error: "Failed to create short URL" }, 500);
  }
  return c.json(value, 201);
}

export async function getShortener(
  c: Context,
  kv: Deno.Kv,
  withStats: boolean = false
) {
  const shortCode = c.req.param("shortCode");
  const value = await getShortenerObject(kv, shortCode, withStats);
  if (!value) {
    return c.json({ error: "Short URL not found" }, 404);
  }
  return c.json(value, 200);
}

export async function putShortener(c: Context, kv: Deno.Kv) {
  const shortCode = c.req.param("shortCode");
  const value = await getShortenerObject(kv, shortCode);
  if (!value) {
    return c.json({ error: "Short URL not found" }, 404);
  }
  const { data: { url = "" } = {}, success } = postShortenerSchema.safeParse(
    await c.req.json()
  );

  if (!success) {
    return c.json({ error: "Invalid URL" }, 400);
  }
  const strippedUrl = stripUrl(url);

  const res = await kv
    .atomic()
    .set([shortCode], {
      ...value,
      url: strippedUrl,
      updateAt: new Date().toISOString(),
    })
    .delete([value.url])
    .set([strippedUrl], { shortCode })
    .commit();

  if (!res.ok) {
    return c.json({ error: "Failed to update short URL" }, 500);
  }
  const updatedValue = await getShortenerObject(kv, shortCode);
  return c.json(updatedValue, 200);
}

export async function deleteShortener(c: Context, kv: Deno.Kv) {
  const shortCode = c.req.param("shortCode");
  const value = await getShortenerObject(kv, shortCode);
  if (!value) {
    return c.json({ error: "Short URL not found" }, 404);
  }
  const res = await kv
    .atomic()
    .delete([shortCode])
    .delete([value.url])
    .commit();

  if (!res.ok) {
    return c.json({ error: "Failed to delete short URL" }, 500);
  }
  return c.json({ success: true }, 200);
}

export async function redirect(c: Context, kv: Deno.Kv) {
  const shortCode = c.req.param("shortCode");
  const value = await getShortenerObject(kv, shortCode);
  if (!value) {
    return c.json({ error: "Short URL not found" }, 404);
  }
  await kv.set([shortCode], {
    ...value,
    accessCount: value?.accessCount ?? 0 + 1,
  });
  return c.redirect(value.url);
}
