const SHEET_NAME='2026手搖飲點餐記錄';
const HEADERS=['送出時間','姓名','品項','分類','容量','數量','甜度','冰量','加料','備註','單價','總價'];
function doGet(e){
  const sheet=getOrderSheet_();const values=sheet.getDataRange().getValues();
  const orders=values.slice(1).filter(row=>row[1]).map(row=>({timestamp:row[0],name:row[1],drink:row[2],category:row[3],size:row[4],quantity:row[5],sugar:row[6],ice:row[7],toppings:row[8],note:row[9],unitPrice:row[10],totalPrice:row[11]}));
  const callback=e&&e.parameter&&e.parameter.callback;const body=JSON.stringify({orders});
  if(callback&&/^[a-zA-Z_$][\w$]*$/.test(callback))return ContentService.createTextOutput(`${callback}(${body});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  const data=JSON.parse(e.postData.contents);const sheet=getOrderSheet_();const quantity=Math.max(1,Math.min(20,Number(data.quantity)||1));const unitPrice=Math.max(0,Number(data.unitPrice)||0);const totalPrice=Math.max(0,Number(data.totalPrice)||unitPrice*quantity);
  if(!String(data.name||'').trim()||!String(data.drink||'').trim())throw new Error('姓名與品項不可空白');
  sheet.appendRow([new Date(),String(data.name).trim(),String(data.drink),String(data.category||''),String(data.size||''),quantity,String(data.sugar||''),String(data.ice||''),String(data.toppings||'無'),String(data.note||''),unitPrice,totalPrice]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
function getOrderSheet_(){
  const spreadsheet=SpreadsheetApp.getActiveSpreadsheet();let sheet=spreadsheet.getSheetByName(SHEET_NAME);if(!sheet)sheet=spreadsheet.insertSheet(SHEET_NAME);
  if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold');}return sheet;
}