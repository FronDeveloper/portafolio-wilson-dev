"use client";

/**
 * Carga GA4 y Meta Pixel SOLO después del consentimiento.
 * La atribución (UTM) se guarda siempre porque no identifica personas.
 */

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getConsent,
  onConsentChange,
  type ConsentValue,
} from "@/lib/analytics/consent";
import { captureUTMParams } from "@/lib/analytics/meta-events";

const GA_ID = "G-09M3XYKZ1L";
const META_ID = "864423433128485";

export function Analytics() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const pathname = usePathname();
  const primeraRuta = useRef(true);

  useEffect(() => {
    setConsent(getConsent());
    captureUTMParams();
    return onConsentChange(setConsent);
  }, []);

  useEffect(() => {
    captureUTMParams();
  }, [pathname]);

  // GA4 configura el primer page_view solo; las rutas siguientes se
  // registran manualmente porque es una SPA.
  useEffect(() => {
    if (consent !== "granted") return;
    if (primeraRuta.current) {
      primeraRuta.current = false;
      return;
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname, consent]);

  if (consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>

      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_ID}');
        `}
      </Script>
    </>
  );
}
