/**
 * GAS Mock Harness for Jest
 *
 * Provides mock implementations of Google Apps Script services
 * so that .gs files can be tested locally with Jest.
 *
 * Usage in tests:
 *   require('../Code.gs');
 *   const { scriptProps, makeSheet } = global.__gasTestHandles;
 *   beforeEach(() => resetGasMocks());
 */

// ── Script Properties mock ─────────────────────────────────────
const scriptProps = {
  _store: {},
  getProperty(k) { return this._store[k] || null; },
  setProperty(k, v) { this._store[k] = v; },
  deleteProperty(k) { delete this._store[k]; },
  getProperties() { return { ...this._store }; },
  setProperties(props) { Object.assign(this._store, props); },
};

// ── Sheet builder ──────────────────────────────────────────────
/**
 * Creates a mock sheet from a 2D array.
 * @param {string} name - Sheet name
 * @param {Array[]} data - 2D array where data[0] is headers
 * @returns {Object} Mock sheet object
 */
function makeSheet(name, data) {
  const rows = data.map(r => [...r]);
  return {
    getName: () => name,
    getDataRange: () => ({
      getValues: () => rows,
      getNumRows: () => rows.length,
      getNumColumns: () => (rows[0] || []).length,
    }),
    getLastRow: () => rows.length,
    getLastColumn: () => (rows[0] || []).length,
    getRange: jest.fn((r, c, nr, nc) => ({
      getValues: () => rows.slice(r - 1, r - 1 + (nr || 1)).map(row => row.slice(c - 1, c - 1 + (nc || 1))),
      setValues: jest.fn(),
      setValue: jest.fn(),
      getValue: () => rows[r - 1] ? rows[r - 1][c - 1] : undefined,
      clearContent: jest.fn(),
    })),
    appendRow: jest.fn(row => rows.push(row)),
    deleteRow: jest.fn(),
    insertRowAfter: jest.fn(),
    getSheetName: () => name,
  };
}

// ── Reset all GAS mocks ────────────────────────────────────────
function resetGasMocks() {
  global.SpreadsheetApp = {
    openById: jest.fn(),
    getActiveSpreadsheet: jest.fn(),
    create: jest.fn(),
  };

  global.Session = {
    getActiveUser: jest.fn(() => ({
      getEmail: jest.fn(() => ''),
    })),
    getEffectiveUser: jest.fn(() => ({
      getEmail: jest.fn(() => ''),
    })),
  };

  global.Utilities = {
    sleep: jest.fn(),
    formatDate: jest.fn(() => ''),
    newBlob: jest.fn(() => ({
      setName: jest.fn(),
      getContentType: jest.fn(() => 'application/octet-stream'),
    })),
    base64Decode: jest.fn(() => []),
    base64Encode: jest.fn(() => ''),
    getUuid: jest.fn(() => 'mock-uuid'),
    formatString: jest.fn(s => s),
  };

  global.UrlFetchApp = {
    fetch: jest.fn(() => ({
      getContentText: jest.fn(() => '{}'),
      getResponseCode: jest.fn(() => 200),
    })),
    fetchAll: jest.fn(() => []),
  };

  global.PropertiesService = {
    getScriptProperties: jest.fn(() => scriptProps),
    getUserProperties: jest.fn(() => scriptProps),
  };

  global.CacheService = {
    getScriptCache: jest.fn(() => ({
      get: jest.fn(() => null),
      put: jest.fn(),
      remove: jest.fn(),
    })),
  };

  global.LockService = {
    getScriptLock: jest.fn(() => ({
      tryLock: jest.fn(() => true),
      waitLock: jest.fn(),
      releaseLock: jest.fn(),
      hasLock: jest.fn(() => true),
    })),
  };

  global.Logger = {
    log: jest.fn(),
    clear: jest.fn(),
  };

  global.HtmlService = {
    createHtmlOutputFromFile: jest.fn(() => ({
      setTitle: jest.fn().mockReturnThis(),
      setXFrameOptionsMode: jest.fn().mockReturnThis(),
    })),
    createHtmlOutput: jest.fn(() => ({
      setTitle: jest.fn().mockReturnThis(),
      setXFrameOptionsMode: jest.fn().mockReturnThis(),
      getContent: jest.fn(() => ''),
    })),
    createTemplateFromFile: jest.fn(() => ({
      evaluate: jest.fn(() => ({
        getContent: jest.fn(() => ''),
      })),
    })),
    XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
  };

  global.DriveApp = {
    getFolderById: jest.fn(),
    getFileById: jest.fn(),
    createFolder: jest.fn(),
    createFile: jest.fn(),
  };

  global.MailApp = {
    sendEmail: jest.fn(),
    getRemainingDailyQuota: jest.fn(() => 100),
  };

  global.GmailApp = {
    sendEmail: jest.fn(),
  };

  global.ScriptApp = {
    getService: jest.fn(() => ({ getUrl: jest.fn(() => 'https://script.google.com/mock') })),
    newTrigger: jest.fn(),
    getProjectTriggers: jest.fn(() => []),
    deleteTrigger: jest.fn(),
  };

  global.ContentService = {
    createTextOutput: jest.fn(() => ({
      setMimeType: jest.fn().mockReturnThis(),
    })),
    MimeType: { JSON: 'JSON' },
  };

  global.CalendarApp = {
    getCalendarById: jest.fn(),
    getDefaultCalendar: jest.fn(),
  };

  global.FormApp = {
    openById: jest.fn(),
  };

  global.DocumentApp = {
    openById: jest.fn(),
  };

  global.Blob = jest.fn();

  // Reset script properties store
  scriptProps._store = {};
}

// ── Expose to tests ────────────────────────────────────────────
global.__gasTestHandles = { scriptProps, makeSheet };
global.resetGasMocks = resetGasMocks;

// Initialize mocks on load
resetGasMocks();
