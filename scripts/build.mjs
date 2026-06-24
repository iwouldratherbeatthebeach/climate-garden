import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL("index.html", root), new URL("index.html", dist));
await cp(new URL("src", root), new URL("src", dist), { recursive: true });
await cp(new URL("public", root), dist, { recursive: true });

console.log("Built static Cloudflare Pages output in dist.");
