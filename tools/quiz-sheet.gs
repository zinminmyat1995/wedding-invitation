/**
 * Wedding Fun-Quiz answers → Google Sheet
 * -------------------------------------------------------------
 * 1. Create a new Google Sheet (any name).
 * 2. Extensions → Apps Script. Delete what is there and paste this file.
 * 3. Change SECRET below to your own private word (keep it to yourself).
 * 4. Deploy → New deployment → type "Web app"
 *      Execute as: Me      Who has access: Anyone
 *    Copy the Web-app URL (ends with /exec).
 * 5. Put that URL into en/config.js → quizEndpoint: "https://script.google.com/.../exec"
 * 6. Answers page:  https://<your-site>/en/answers.html?key=<SECRET>
 *
 * Guests can only ADD answers. Reading them needs the SECRET.
 */
const SECRET = "change-me";            // ← your private key for the answers page
const SHEET = "Answers";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(["Time", "Name", "Q1", "Q2", "Q3", "Q4", "Q5", "Correct", "Score", "Message"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

// guests submit here
function doPost(e) {
  try {
    const r = JSON.parse(e.postData.contents);
    const clean = (s, n) => String(s == null ? "" : s).replace(/^[=+\-@]/, "'$&").slice(0, n);   // no spreadsheet formulas
    const a = (r.answers || []).slice(0, 5).map((x) => clean(x, 80));
    while (a.length < 5) a.push("");
    sheet_().appendRow([
      new Date(), clean(r.name, 40), ...a,
      (r.correct || []).map((c) => (c ? "1" : "0")).join(""),
      Number(r.score) || 0, clean(r.message, 300),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }
}

// the private answers page reads here (needs ?key=SECRET)
function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "forbidden" })).setMimeType(ContentService.MimeType.JSON);
  }
  const rows = sheet_().getDataRange().getValues().slice(1).map((v) => ({
    time: v[0] instanceof Date ? v[0].toISOString() : String(v[0]),
    name: v[1], answers: v.slice(2, 7), correct: String(v[7]).split("").map((c) => c === "1"),
    score: v[8], message: v[9],
  }));
  return ContentService.createTextOutput(JSON.stringify({ ok: true, rows })).setMimeType(ContentService.MimeType.JSON);
}
