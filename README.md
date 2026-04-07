# Google Apps Script — Project Template

A ready-to-go template for Google Apps Script projects with CI/CD, security scanning, linting, and testing built in.

## What's included

| Tool | Purpose |
|---|---|
| **clasp** | Push/deploy `.gs` and `.html` files to Apps Script |
| **ESLint** | Linting with `eslint-plugin-security` + `eslint-plugin-no-unsanitized` |
| **Jest** | Unit testing with a full GAS mock harness |
| **GitHub Actions** | Lint → Test → Deploy pipeline on push to `main` |
| **CodeQL** | Security & code quality scanning (PR + weekly) |
| **Dependabot** | Automated PRs for npm + Actions version updates |

## Quick start

### 1. Use this template

Click **"Use this template"** → **"Create a new repository"** on GitHub.

### 2. Clone and install

```bash
git clone https://github.com/your-org/your-new-repo.git
cd your-new-repo
npm install
```

### 3. Link to Apps Script

```bash
npm install -g @google/clasp
clasp login
clasp create --type webapp --title "My App"
# Or: clasp clone <your-script-id>
```

### 4. Verify everything works

```bash
npm run lint    # Should pass clean
npm test        # Should pass (6 example tests)
```

### 5. Set up GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `CLASPRC_JSON` | Contents of `~/.clasprc.json` |
| `SCRIPT_ID` | Your script ID from `.clasp.json` |

### 6. Enable branch protection (recommended)

**Settings → Branches → Add rule** for `main`:
- Require pull request before merging
- Require status checks: `test`, `Analyze (javascript-typescript)`
- Require branches to be up to date

## Project structure

```
├── .github/
│   ├── dependabot.yml          # Automated dependency updates
│   └── workflows/
│       ├── codeql.yml          # Security & quality scanning
│       └── deploy.yml          # Lint → Test → Deploy pipeline
├── tests/
│   ├── setup/
│   │   ├── gasGlobals.js       # GAS mock harness (all services)
│   │   └── gsTransform.js      # Jest transformer for .gs files
│   └── example.test.js         # Example tests — replace with yours
├── .clasp.json                 # git-ignored — created by clasp
├── .claspignore                # Only push .gs, .html, appsscript.json
├── .gitignore
├── Code.gs                     # Starter app entry point
├── Index.html                  # Starter HTML page
├── appsscript.json             # Apps Script manifest
├── eslint.config.mjs           # ESLint config with security rules
└── package.json                # npm scripts, Jest config, dependencies
```

## npm scripts

| Command | Description |
|---|---|
| `npm run lint` | Run ESLint on all `.gs` files |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## CI/CD pipeline

```
Push to main ──→ Lint ──→ Test ──→ Deploy to Apps Script
                  ↓        ↓
                 Fail = deploy blocked
```

- **Pull requests**: Lint + Test + CodeQL (no deploy)
- **Push to main**: Lint + Test + CodeQL + Deploy
- **Weekly (Friday)**: CodeQL security scan
- **Weekly (Monday)**: Dependabot checks for updates

## Adding cross-file functions to ESLint

GAS loads all `.gs` files into one global scope. When you define a function in one file and call it from another, add it to the `gasGlobals` object in `eslint.config.mjs`:

```javascript
const gasGlobals = {
  // ... existing globals ...
  mySharedFunction: 'readonly',
  _myPrivateHelper_: 'readonly',
};
```

## Writing tests

```javascript
require('../MyService.gs');

const { scriptProps, makeSheet } = global.__gasTestHandles;

beforeEach(() => resetGasMocks());

describe('myFunction', () => {
  test('does something', () => {
    // Set up mock data
    scriptProps.setProperty('SPREADSHEET_ID', 'mock-id');
    const sheet = makeSheet('Data', [
      ['NAME', 'EMAIL'],
      ['Alice', 'alice@example.com'],
    ]);
    SpreadsheetApp.openById.mockReturnValue({
      getSheetByName: jest.fn(() => sheet),
    });

    // Call your function
    const result = myFunction();

    // Assert
    expect(result.success).toBe(true);
  });
});
```
