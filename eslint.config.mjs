import security from 'eslint-plugin-security';
import noUnsanitized from 'eslint-plugin-no-unsanitized';

// Google Apps Script globals — add your own cross-file functions below
const gasGlobals = {
  // GAS built-in services
  SpreadsheetApp: 'readonly', DriveApp: 'readonly', GmailApp: 'readonly',
  MailApp: 'readonly', UrlFetchApp: 'readonly', HtmlService: 'readonly',
  PropertiesService: 'readonly', CacheService: 'readonly', LockService: 'readonly',
  Utilities: 'readonly', Logger: 'readonly', Session: 'readonly',
  ScriptApp: 'readonly', ContentService: 'readonly', CalendarApp: 'readonly',
  FormApp: 'readonly', DocumentApp: 'readonly', Blob: 'readonly',

  // Add your cross-file function names here so ESLint doesn't flag them:
  // mySharedHelper: 'readonly',
};

export default [
  {
    files: ['**/*.gs'],
    plugins: { security, 'no-unsanitized': noUnsanitized },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script', // GAS uses script scope, not ES modules
      globals: gasGlobals,
    },
    rules: {
      // ── Security ─────────────────────────────────────────────
      'security/detect-unsafe-regex': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'warn',

      // Too noisy for GAS — row[header] and dynamic field matching
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-regexp': 'off',

      // ── XSS / HTML injection ─────────────────────────────────
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',

      // ── General best practices ───────────────────────────────
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-proto': 'error',
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-alert': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_|^e$' }],
      'no-undef': 'warn',  // warn, not error — GAS cross-file functions trigger false positives
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
    },
  },

  // Relaxed rules for test files
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        ...gasGlobals,
        describe: 'readonly', test: 'readonly', expect: 'readonly',
        beforeEach: 'readonly', afterEach: 'readonly',
        beforeAll: 'readonly', afterAll: 'readonly',
        jest: 'readonly', require: 'readonly', module: 'readonly', global: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'security/detect-object-injection': 'off',
      'no-unsanitized/method': 'off',
      'no-unsanitized/property': 'off',
    },
  },
];
