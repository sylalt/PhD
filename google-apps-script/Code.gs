// Use in the existing spreadsheet-bound Apps Script project.
// Keep the existing deployment URL so the website configuration stays valid.
function doGet(e) {
  try {
    var requestedSheet = e && e.parameter && e.parameter.sheet;
    if (requestedSheet && requestedSheet !== 'QUOTES' && requestedSheet !== 'TASKS' && requestedSheet !== 'Lit review') {
      throw new Error('Unknown sheet requested.');
    }
    var sheetName = requestedSheet || 'Lit review';
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error('Bind this script to the papers spreadsheet.');
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error('Missing tab: ' + sheetName);
    var values = sheet.getDataRange().getDisplayValues();
    var headers = values.shift() || [];
    if (sheetName === 'QUOTES' && headers.indexOf('Quote') === -1 && headers.indexOf('QUOTE') === -1) {
      throw new Error('QUOTES needs a Quote column in the first row.');
    }
    if (sheetName === 'TASKS') {
      var requiredHeaders = ['Task', 'Status', 'Priority', 'Due date', 'Category', 'Milestone', 'Notes(description)'];
      var missingHeaders = requiredHeaders.filter(function (header) { return headers.indexOf(header) === -1; });
      if (missingHeaders.length) {
        throw new Error('TASKS is missing required columns: ' + missingHeaders.join(', ') + '.');
      }
    }
    var rows = values.filter(function (row) {
      return row.some(function (cell) { return String(cell).trim() !== ''; });
    }).map(function (row) {
      var record = {};
      headers.forEach(function (header, index) {
        if (header) record[header] = row[index];
      });
      return record;
    });
    // Preserve the papers API's existing array response.
    return sheetsJson_(sheetName === 'QUOTES' || sheetName === 'TASKS'
      ? { sheet: sheetName, rows: rows }
      : rows);
  } catch (error) {
    return sheetsJson_({ error: error.message });
  }
}

function sheetsJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
