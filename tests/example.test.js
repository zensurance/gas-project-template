/**
 * Example test — verifies the GAS mock harness works.
 * Replace this with real tests for your project.
 */

require('../Code.gs');

beforeEach(() => {
  resetGasMocks();
});

describe('GAS mock harness', () => {
  test('SpreadsheetApp is mocked', () => {
    expect(SpreadsheetApp.openById).toBeDefined();
  });

  test('Session returns a mock user', () => {
    Session.getActiveUser.mockReturnValue({
      getEmail: jest.fn(() => 'test@example.com'),
    });
    expect(Session.getActiveUser().getEmail()).toBe('test@example.com');
  });

  test('Script properties can store and retrieve values', () => {
    const { scriptProps } = global.__gasTestHandles;
    scriptProps.setProperty('MY_KEY', 'my_value');
    expect(scriptProps.getProperty('MY_KEY')).toBe('my_value');
  });

  test('makeSheet creates a usable mock sheet', () => {
    const { makeSheet } = global.__gasTestHandles;
    const sheet = makeSheet('TestSheet', [
      ['NAME', 'EMAIL'],
      ['Alice', 'alice@example.com'],
      ['Bob', 'bob@example.com'],
    ]);

    expect(sheet.getName()).toBe('TestSheet');
    expect(sheet.getLastRow()).toBe(3); // header + 2 rows
    expect(sheet.getDataRange().getValues()).toHaveLength(3);
  });
});

describe('Code.gs — doGet', () => {
  test('doGet returns an HtmlOutput', () => {
    const result = doGet({});
    expect(HtmlService.createHtmlOutputFromFile).toHaveBeenCalledWith('Index');
  });
});

describe('Code.gs — getAppData', () => {
  test('returns user email and timestamp', () => {
    Session.getActiveUser.mockReturnValue({
      getEmail: jest.fn(() => 'user@example.com'),
    });

    const data = getAppData();
    expect(data.user).toBe('user@example.com');
    expect(data.timestamp).toBeDefined();
  });
});
