import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  deleteShortener,
  getShortener,
  postShortener,
  putShortener,
  redirect,
} from "./handlers.ts";

const app = new Hono();
const kv = await Deno.openKv();

app.use(cors());

app.post("/api/shorten", async (c) => {
  return await postShortener(c, kv);
});

app.get("/api/shorten/:shortCode", async (c) => {
  return await getShortener(c, kv);
});

app.get("/api/shorten/:shortCode/stats", async (c) => {
  return await getShortener(c, kv, true);
});

app.put("/api/shorten/:shortCode", async (c) => {
  return await putShortener(c, kv);
});

app.delete("/api/shorten/:shortCode", async (c) => {
  return await deleteShortener(c, kv);
});

app.get("/:shortCode", async (c) => {
  return await redirect(c, kv);
});

Deno.serve(app.fetch);
