import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = "Almara — Chá 100% natural, um ritual em cada lata";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage();
}
