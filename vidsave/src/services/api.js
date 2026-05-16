import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 45000
});

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getVideoInfo(url) {
  const response = await api.get("/api/info", {
    params: { url }
  });
  return response.data;
}

export function getDownloadUrl({ url, formatId, title }) {
  const params = new URLSearchParams({
    url,
    title: title || "vidsave-video"
  });

  if (formatId) {
    params.set("formatId", formatId);
  }

  return `${apiBaseUrl}/api/download?${params.toString()}`;
}
