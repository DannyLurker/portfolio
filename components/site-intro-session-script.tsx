"use client";

function SiteIntroSessionScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `try {
        if (window.sessionStorage.getItem("portfolio:site-intro:v1")) {
          document.documentElement.dataset.siteIntroSeen = "true";
        }
        } catch {
          document.documentElement.dataset.siteIntroSeen = "true";
        }`,
      }}
    />
  );
}

export { SiteIntroSessionScript };
