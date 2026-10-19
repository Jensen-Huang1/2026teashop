const APPS_SCRIPT_URL='https://script.google.com/macros/s/AKfycbyDxJs2d4j437jAnMs9FSRzBhT9NkmQv3XjINJSHHff0eRTjcyd5F51fV5rcQrIqmQHUA/exec';
const list=document.querySelector('#orders-list');const formatter=new Intl.NumberFormat('zh-TW');
function setMessage(text,isError=false){const message=document.querySelector('#status-message');message.textContent=text;message.className=`status-message${isError?' is-error':''}`;}
function formatTime(value){const date=new Date(value);return Number.isNaN(date.getTime())?String(value||''):new Intl.DateTimeFormat('zh-TW',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(date);}
function appendCell(row,text){const cell=document.createElement('td');cell.textContent=text==null?'':String(text);row.append(cell);}
function renderOrders(orders){
  list.replaceChildren();const drinkCount=orders.reduce((sum,order)=>sum+Number(order.quantity||0),0);const total=orders.reduce((sum,order)=>sum+Number(order.totalPrice||0),0);
  document.querySelector('#order-count').textContent=formatter.format(orders.length);document.querySelector('#drink-count').textContent=formatter.format(drinkCount);document.querySelector('#order-total').textContent=`$${formatter.format(total)}`;
  if(!orders.length){const row=document.createElement('tr');const cell=document.createElement('td');cell.colSpan=6;cell.className='empty-state';cell.textContent='目前還沒有訂單，第一杯等你來點。';row.append(cell);list.append(row);return;}
  orders.slice().reverse().forEach(order=>{const row=document.createElement('tr');appendCell(row,order.name);appendCell(row,`${order.drink} / ${order.size||''}`);appendCell(row,[order.sugar,order.ice,order.toppings&&`加料：${order.toppings}`,order.note&&`備註：${order.note}`].filter(Boolean).join(' · '));appendCell(row,order.quantity);appendCell(row,`$${formatter.format(Number(order.totalPrice||0))}`);appendCell(row,formatTime(order.timestamp));list.append(row);});
}
function loadOrders(){
  if(!APPS_SCRIPT_URL){document.querySelector('#order-count').textContent='—';document.querySelector('#drink-count').textContent='—';document.querySelector('#order-total').textContent='—';list.innerHTML='<tr><td class="empty-state" colspan="6">Google Sheet 尚未連線。完成 README 的 Apps Script 部署後，這裡會顯示訂單。</td></tr>';document.querySelector('#updated-at').textContent='尚未連線';return;}
  setMessage('正在更新…');const callbackName=`receiveOrders_${Date.now()}`;const script=document.createElement('script');
  const timeout=window.setTimeout(()=>{cleanup();setMessage('讀取逾時，請確認 Apps Script 部署權限。',true);},12000);
  function cleanup(){window.clearTimeout(timeout);delete window[callbackName];script.remove();}
  window[callbackName]=result=>{cleanup();if(!result||result.error){setMessage(result?.error||'讀取訂單失敗。',true);return;}renderOrders(result.orders||[]);document.querySelector('#updated-at').textContent=`更新於 ${new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}`;setMessage('訂單已更新。');};
  script.onerror=()=>{cleanup();setMessage('讀取失敗，請確認網路與 Apps Script 網址。',true);};script.src=`${APPS_SCRIPT_URL}?callback=${encodeURIComponent(callbackName)}&t=${Date.now()}`;document.head.append(script);
}
document.querySelector('#refresh-orders').addEventListener('click',loadOrders);loadOrders();