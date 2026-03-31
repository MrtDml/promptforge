import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prompt Forge – AI SaaS Code Generator",
    short_name: "Prompt Forge",
    description:
      "Prompt Forge generates production-ready SaaS backends from natural language prompts.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b14",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["developer tools", "productivity", "utilities"],
    lang: "en",
  };
}
