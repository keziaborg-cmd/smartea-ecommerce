import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/site";

// Gerador de imagem compartilhado por app/opengraph-image.tsx e
// app/twitter-image.tsx (mesmo visual pros dois, tamanhos-padrão praticamente
// idênticos: 1200x630 é o recomendado tanto pro Open Graph quanto pro
// "summary_large_image" card do Twitter/X) — mantém um único lugar pra
// ajustar o design da imagem de compartilhamento do site.
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export async function renderOgImage() {
  const [logoData, carenaFont] = await Promise.all([
    readFile(join(process.cwd(), "public/logo.png")),
    readFile(join(process.cwd(), "public/fonts/Carena-Regular.otf")),
  ]);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fffdf8",
          position: "relative",
        }}
      >
        {/* manchas orgânicas suaves atrás, mesmo espírito visual do resto do site */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#e1ead4",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 380,
            height: 380,
            borderRadius: 9999,
            background: "#f0e1cc",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={260} height={174} alt="" style={{ position: "relative" }} />

        <div
          style={{
            position: "relative",
            marginTop: 28,
            fontFamily: "Carena",
            fontSize: 40,
            color: "#013f24",
            textAlign: "center",
          }}
        >
          Chá 100% natural, um ritual em cada lata
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 14,
            fontSize: 24,
            color: "#568833",
            textAlign: "center",
          }}
        >
          {SITE_HOST}
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [{ name: "Carena", data: carenaFont, style: "normal", weight: 400 }],
    }
  );
}
