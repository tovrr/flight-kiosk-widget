# Contributing

Thanks for your interest in **Flight Kiosk Widget**! This is a small, focused
template — contributions that keep it simple, generic and easy to fork are very
welcome.

## Ways to contribute

- 🐛 **Bug reports** — open an issue with steps to reproduce, your browser, and
  a screenshot if it's visual.
- 💡 **Ideas** — open an issue to discuss before large changes, so we can keep
  the template lean.
- 🌍 **Translations / copy** — the on-screen strings live in
  `components/AttractScreen.js` and `components/KioskScreen.js`.
- 🔧 **Pull requests** — see below.

## Local setup

```bash
git clone https://github.com/tovrr/flight-kiosk-widget
cd flight-kiosk-widget
cp .env.example .env.local   # fill in your Travelpayouts values
npm install
npm run dev                  # http://localhost:3000/?ref=demo-shop
```

> The Travelpayouts widget loads from `tpwidg.com`; if your network blocks it
> you'll see the offline fallback card — that's expected locally.

## Pull request checklist

- Keep it **generic** — no personal markers, domains, brand names or secrets.
  All account-specific values must stay in environment variables.
- `npm run build` **passes** (CI runs this on every PR).
- One logical change per PR; a clear title and description.
- Update the `README` / `.env.example` if you add or rename an env var.
- Match the existing code style (comments explain the *why*, not the *what*).

## Guiding principles

1. **Fork-and-deploy first** — anyone should be able to ship their own kiosk
   with only environment variables, no code edits.
2. **Kiosk UX** — fullscreen, tablet-first, no scroll, resets between customers.
3. **Preserve `?ref=` tracking** — it's the core of the affiliate model; any
   change to the front end must keep it intact.
4. **No secrets in the repo** — `NEXT_PUBLIC_*` values are identifiers, never
   API tokens.

## Security

Found a security issue? Please **don't** open a public issue — email the
maintainer or use GitHub's private "Report a vulnerability" flow instead.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
