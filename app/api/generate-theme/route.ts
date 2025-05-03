import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { themeStylePropsSchema } from "@/types/theme";
import kv from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest } from "next/server";

const requestSchema = z.object({
  prompt: z.string().min(1),
});

// Create a new schema based on themeStylePropsSchema excluding 'spacing'
const themeStylePropsWithoutSpacing = themeStylePropsSchema.omit({
  spacing: true,
});

// Define the main theme schema using the modified props schema
const themeSchemaWithoutSpacing = z.object({
  light: themeStylePropsWithoutSpacing,
  dark: themeStylePropsWithoutSpacing,
});

// Create Rate limit - 5 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting based on the request IP
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await ratelimit.limit(ip);

    // Block the request if rate limit exceeded
    if (!success) {
      return new Response("Rate limit exceeded. Please try again later.", {
        status: 429,
      });
    }

    const body = await req.json();
    const { prompt } = requestSchema.parse(body);

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const model = groq("llama-3.3-70b-versatile");

    const { object: theme } = await generateObject({
      model,
      schema: themeSchemaWithoutSpacing,
      system: `You are an AI generating Shadcn UI color themes.
Input: User description or existing theme tokens.
Format: Use Hex values (#000000) exclusively for colors.
Requirement: Ensure light/dark mode cohesion. If asked to change the theme's main color (e.g., "make it green"), adjust related colors (--accent, --secondary, --ring, --border) along with --primary to create a cohesive new palette.`,
      prompt: `Generate Shadcn theme. Input: ${prompt}`,
    });

    return new Response(JSON.stringify(theme), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    // Consider more specific error handling based on AI SDK errors if needed
    return new Response("Error generating theme", { status: 500 });
  }
}
