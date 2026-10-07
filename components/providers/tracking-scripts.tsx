"use client";

import Script from "next/script";
import { useConsentStore } from "@/lib/consent/consent";

// Measurement ID do GA4 é público (aparece no HTML de qualquer site), então o
// default fica no código: o tracking funciona sem depender de configurar a env
// var na Vercel. NEXT_PUBLIC_GA4_MEASUREMENT_ID continua tendo precedência.
const DEFAULT_GA4_MEASUREMENT_ID = "G-PV98V0QPPC";

// GA4 só carrega com "Análise" aceito e o Meta Pixel só com "Marketing" (banner de cookies) — a
// Política de Privacidade diz que cookies não necessários dependem dessa escolha.
export function TrackingScripts() {
  const analytics = useConsentStore((s) => s.choice?.analytics === true);
  const marketing = useConsentStore((s) => s.choice?.marketing === true);
  const ga4Id = analytics
    ? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || DEFAULT_GA4_MEASUREMENT_ID
    : null;
  const pixelId = marketing ? process.env.NEXT_PUBLIC_META_PIXEL_ID : null;

  return (
    <>
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');
              window.gtag = gtag;`}
          </Script>
        </>
      )}
      {pixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
