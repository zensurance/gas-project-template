# Google Apps Script Project

## About
- Google Apps Script web app using clasp for local development
- Push to main auto-deploys via GitHub Actions (lint → test → deploy)
- Web app access is set to DOMAIN (Anyone within Zensurance)

## Development workflow
- Run `npm run lint` before committing
- Run `npm test` to verify changes
- Push to GitHub and merge PR to deploy — never run `clasp deploy` manually
- Bump version stamp in Index.html sidebar on each deploy

## Key files
- `.gs` files: server-side Google Apps Script code
- `.html` files: client-side HTML/CSS/JS
- `appsscript.json`: Apps Script manifest — keep `"access": "DOMAIN"`
- `eslint.config.mjs`: add cross-file function names to `gasGlobals`
- `tests/`: Jest tests with GAS mock harness

## Commands
- `npm run lint` — check for errors
- `npm run lint:fix` — auto-fix simple issues
- `npm test` — run tests
- `clasp open` — open Apps Script editor in browser
