/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Allow the Screen Wake Lock API (used to keep the kiosk awake).
          { key: "Permissions-Policy", value: "screen-wake-lock=(self)" },
          // A strict Content-Security-Policy is intentionally omitted: the
          // Travelpayouts widget/Drive/results load scripts, styles, images and
          // iframes from several third-party hosts that can't be verified from
          // here. To harden further, add a CSP allowlisting at least:
          //   script-src/connect-src/frame-src: tpwidg.com tpembars.com
          //     *.travelpayouts.com *.aviasales.com *.aviasales.ru
          //   img-src/style-src: those + 'unsafe-inline' (widget inlines styles)
          // and test the live widget before shipping it.
        ],
      },
    ];
  },
};

module.exports = nextConfig;
