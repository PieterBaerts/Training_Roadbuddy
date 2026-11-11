// Base URL of the backend. Local dev talks to uvicorn on port 8000;
// production builds (Vercel) use the same-origin /api rewrite.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
