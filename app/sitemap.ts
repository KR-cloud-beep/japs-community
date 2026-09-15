import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://zaps-app-free.vercel.app"; return ["/japs","/","/posts","/posts/popular","/community","/terms","/privacy"].map(path=>({url:`${base}${path}`,lastModified:new Date()})); }
