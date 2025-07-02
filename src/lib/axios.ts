// src/lib/axios.ts or app/lib/axios.ts

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
