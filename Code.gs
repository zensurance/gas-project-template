/**
 * Entry point for the web app.
 * @param {Object} e - The event object
 * @returns {HtmlOutput}
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('My App')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Example server-side function callable from the client.
 * @returns {Object}
 */
function getAppData() {
  var user = Session.getActiveUser().getEmail();
  return {
    user: user,
    timestamp: new Date().toISOString(),
  };
}
