// Compatibility shim for Netlify — Next.js 16 uses proxy.ts but Netlify expects middleware.ts
export { default, config } from "./src/proxy";
