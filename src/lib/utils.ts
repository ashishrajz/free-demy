import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    // Shortened URL
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1); // remove leading "/"
    }

    // Standard URL
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      return parsedUrl.searchParams.get("v");
    }

    return null;
  } catch (e) {
    console.error("Invalid YouTube URL", e);
    return null;
  }
}

