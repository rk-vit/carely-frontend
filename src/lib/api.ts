const CARELY_BACKEND_URL = (
  process.env.CARELY_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${CARELY_BACKEND_URL}/${path.replace(/^\//, "")}`;
