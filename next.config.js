/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    // Shared safe headers. A strict Content-Security-Policy is intentionally
    // omitted: the Travelpayouts widget/Drive/results load scripts, styles,
    // images and iframes from several third-party hosts that can't be verified
    // from here. To harden, add a CSP allowlisting at least:
    //   script-src/connect-src/frame-src: tpwidg.com tpembars.com
    //     *.travelpayouts.com *.aviasales.com *.aviasales.ru
    //   img-src/style-src: those + 'unsafe-inline' (widget inlines styles)
    // and test the live widget before shipping it.
    const safe = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "screen-wake-lock=(self)" },
    ];

    return [
      {
        // Embeddable widget: allow framing from any site (that's the point).
        source: "/embed",
        headers: [
          ...safe,
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
      {
        // Everything else: deny third-party framing (clickjacking protection).
        source: "/((?!embed).*)",
        headers: [...safe, { key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
};

module.exports = nextConfig;
