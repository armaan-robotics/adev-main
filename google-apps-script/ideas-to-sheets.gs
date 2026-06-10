/*
  Google Apps Script endpoint for ADev idea submissions.

  Setup:
  1. Create a Google Sheet that only you can access.
  2. Copy that spreadsheet's ID from its URL.
  3. Paste the ID into SPREADSHEET_ID below.
  4. In Google Apps Script, deploy this as a Web App.
  5. Set "Execute as" to "Me".
  6. Set "Who has access" to "Anyone".
  7. Copy the Web App URL into ARMAANDEV_IDEA_ENDPOINT in js/ideas.js.

  Visitors can submit ideas, but only your Google account needs access
  to the private spreadsheet.
*/

var SPREADSHEET_ID = "14Icc-zdnI5Qx0wpQvJWuA7zjuEtzDEezCU49xW_T0BQ";
var SHEET_NAME = "Ideas";

function doPost(event) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var payload = JSON.parse(event.postData.contents || "{}");
    var sheet = getIdeasSheet_();

    sheet.appendRow([
      new Date(),
      String(payload.text || "").slice(0, 300),
      String(payload.pageUrl || ""),
      String(payload.source || "ADev"),
      String(payload.userAgent || ""),
      String(payload.timestamp || "")
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function getIdeasSheet_() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received At", "Idea", "Page URL", "Source", "User Agent", "Visitor Timestamp"]);
  }

  return sheet;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
