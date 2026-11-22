/* Dán toàn bộ đoạn này vào Google Apps Script (xem HUONG-DAN.md, mục 4).
   Nó ghi phản hồi "Xác nhận tham dự" và "Lời chúc" vào Google Sheets,
   đồng thời trả danh sách lời chúc để hiện bong bóng trên thiệp. */

function doPost(e) {
  var p = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (p.type === 'rsvp') {
    var sh = sheet_(ss, 'XacNhan', ['Thời gian', 'Họ tên', 'Điện thoại', 'Tham dự', 'Số người', 'Khách của', 'Lời nhắn']);
    sh.appendRow([p.time, p.name, "'" + (p.phone || ''), p.attend, p.guests, p.side, p.message]);
    if (p.message) sheet_(ss, 'LoiChuc', ['Thời gian', 'Tên', 'Lời chúc', 'Hiện (x = ẩn)']).appendRow([p.time, p.name, p.message, '']);
  } else if (p.type === 'wish') {
    sheet_(ss, 'LoiChuc', ['Thời gian', 'Tên', 'Lời chúc', 'Hiện (x = ẩn)']).appendRow([p.time, p.name, p.message, '']);
  }
  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('LoiChuc');
  var out = [];
  if (sh && sh.getLastRow() > 1) {
    var rows = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
    rows.forEach(function (r) { if (r[2] && String(r[3]).toLowerCase() !== 'x') out.push({ name: r[1], text: r[2] }); });
  }
  return ContentService.createTextOutput(JSON.stringify(out.slice(-100))).setMimeType(ContentService.MimeType.JSON);
}

function sheet_(ss, name, header) {
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
