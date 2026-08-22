const CARELY_BACKEND_URL = (process.env.NEXT_PUBLIC_CARELY_BACKEND_URL || "http://localhost:8080").replace(/\/$/, "");

export const apiUrl = (path: string) => `${CARELY_BACKEND_URL}/${path.replace(/^\//, "")}`;
