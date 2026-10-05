/// <reference types="node" />

import axios from "axios";
import type { ApiErrorResponse } from "@repo/types/auth";

/** Use the public backend URL, or the consuming app's /api proxy. */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (Array.isArray(message) && message.length) return message.join(" ");
    if (!error.response) return "Unable to reach the server. Please try again.";
    return "The request failed. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
