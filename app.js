const APPS_SCRIPT_URL = '';
const products = [
  {category:'嚴選茗品',name:'玉露青茶',prices:{L:35}},{category:'嚴選茗品',name:'桂花青茶',prices:{L:40}},
  {category:'經典純粹',name:'翡翠綠茶',prices:{L:35}},{category:'經典純粹',name:'紅玉紅茶',prices:{L:35}},{category:'經典純粹',name:'御品冬瓜露',prices:{L:35}},{category:'經典純粹',name:'熟成油切蕎麥（含咖啡因／無咖啡因）',prices:{L:35}},{category:'經典純粹',name:'冷萃東方美人',prices:{L:55}},{category:'經典純粹',name:'冷萃半熟金萱',prices:{L:55}},
  {category:'香醇濃郁',name:'玉露奶青',prices:{L:60}},{category:'香醇濃郁',name:'桂花奶青',prices:{L:60}},{category:'香醇濃郁',name:'懷舊經典奶茶',prices:{L:55}},{category:'香醇濃郁',name:'翡翠奶綠',prices:{L:55}},{category:'香醇濃郁',name:'鐵觀音奶茶',prices:{L:55}},{category:'香醇濃郁',name:'熟成蕎麥奶茶（含咖啡因／無咖啡因）',prices:{L:60}},{category:'香醇濃郁',name:'珍珠奶茶',prices:{L:60}},{category:'香醇濃郁',name:'烤糖蕎麥凍奶青',prices:{L:69}},{category:'香醇濃郁',name:'咖啡粉粿蕎麥奶',prices:{L:69}},
  {category:'抹茶系列',name:'青抹浮島',prices:{M:89,L:89}},{category:'抹茶系列',name:'抹一點酸',prices:{M:99,L:99}},{category:'抹茶系列',name:'抹茶拿鐵 ESPRESSO',prices:{M:99,L:99}},{category:'抹茶系列',name:'抹茶拿鐵',prices:{M:79,L:89}},{category:'抹茶系列',name:'青抹蕎麥凍奶',prices:{M:89,L:89}},
  {category:'期間限定',name:'芒果青',prices:{M:69,L:69}},{category:'期間限定',name:'芒果優格飲',prices:{M:88,L:88}},
  {category:'雲朵奶蓋',name:'酪梨奶蓋紅玉',prices:{L:69}},{category:'雲朵奶蓋',name:'酪梨奶蓋綠茶',prices:{L:69}},{category:'雲朵奶蓋',name:'酪梨奶蓋烏龍',prices:{L:69}},{category:'雲朵奶蓋',name:'酪梨奶蓋冬瓜露',prices:{L:69}},
  {category:'匠人茶點',name:'酪梨奶蓋泡芙（2 入）',prices:{'2入':85}},{category:'匠人茶點',name:'酪梨奶蓋泡芙（4 入）',prices:{'4入':170}},{category:'匠人茶點',name:'酪梨奶蓋泡芙（6 入）',prices:{'6入':255}},
  {category:'職人手作',name:'蘋果玉露青（最低甜度 1 分糖）',prices:{L:69}},{category:'職人手作',name:'老奶奶的鳳梨田（含堅果類）',prices:{L:69}},{category:'職人手作',name:'甘蔗玉露青',prices:{L:65}},{category:'職人手作',name:'冬瓜玉露青',prices:{L:50}},{category:'職人手作',name:'纖檸冬瓜露',prices:{L:55}},{category:'職人手作',name:'翡翠多多青',prices:{L:60}},{category:'職人手作',name:'檸檬桂花青（最低甜度 1 分糖）',prices:{L:69}},{category:'職人手作',name:'柳橙翡翠青（最低甜度 1 分糖）',prices:{L:69}},
  {category:'牧場直送',name:'紅茶拿鐵',prices:{M:70,L:70}},{category:'牧場直送',name:'翡翠拿鐵',prices:{M:70,L:70}},{category:'牧場直送',name:'鐵觀音拿鐵',prices:{M:70,L:70}},{category:'牧場直送',name:'仙草嫩奶（含奶精）',prices:{M:70,L:70}},{category:'牧場直送',name:'珍珠粉粿牛奶（珈琲粉粿）',prices:{M:75,L:75}}
];
const toppings=[{name:'波霸珍珠',price:10},{name:'嫩仙草',price:10},{name:'烤糖蕎麥凍',price:20},{name:'酪梨奶蓋',price:35},{name:'咖啡粉粿',price:20}];
const sugarLevels=['正常','少糖','半糖','微糖','1 分糖','無糖'];
const iceLevels=['正常冰','少冰','微冰','去冰','完全去冰'];
const form=document.querySelector('#order-form');
const drinkSelect=document.querySelector('#drink');
const sizeSelect=document.querySelector('#size');
const quantityInput=document.querySelector('#quantity');
const priceFormatter=new Intl.NumberFormat('zh-TW');

function addChoice(containerId,name,values,selectedValue){
  const container=document.getElementById(containerId);
  values.forEach((value,index)=>{
    const label=document.createElement('label');label.className='choice-pill';
    label.innerHTML=`<input type="radio" name="${name}" value="${value}"${value===selectedValue?' checked':''} required><span>${value}</span>`;
    label.querySelector('input').id=`${name}-${index}`;container.append(label);
  });
}
function populateProducts(){
  const groups=new Map();products.forEach((product,index)=>{if(!groups.has(product.category))groups.set(product.category,[]);groups.get(product.category).push({...product,index});});
  groups.forEach((items,category)=>{const group=document.createElement('optgroup');group.label=category;items.forEach(product=>{const option=document.createElement('option');option.value=String(product.index);option.textContent=`${product.name} / $${Math.min(...Object.values(product.prices))}`;group.append(option);});drinkSelect.append(group);});
}
function populateSizes(){
  const product=drinkSelect.value===''?null:products[Number(drinkSelect.value)];sizeSelect.replaceChildren();
  if(!product){sizeSelect.add(new Option('請先選飲品',''));sizeSelect.disabled=true;return;}
  sizeSelect.disabled=false;Object.entries(product.prices).forEach(([size,price])=>sizeSelect.add(new Option(`${size} / $${price}`,size)));
}
function selectedToppings(){return Array.from(document.querySelectorAll('input[name="toppings"]:checked')).map(input=>toppings[Number(input.value)]);}
function calculateOrder(){
  const product=drinkSelect.value===''?null:products[Number(drinkSelect.value)];const size=sizeSelect.value;const quantity=Math.max(1,Number(quantityInput.value)||1);const chosenToppings=selectedToppings();
  const toppingTotal=chosenToppings.reduce((sum,topping)=>sum+topping.price,0);const unitPrice=product&&size?product.prices[size]:0;const total=(unitPrice+toppingTotal)*quantity;
  document.getElementById('summary-drink').textContent=product?product.name:'尚未選擇飲品';document.getElementById('summary-size').textContent=product&&size?`容量 / ${size}`:'容量待選';
  document.getElementById('summary-unit').textContent=`$ ${priceFormatter.format(unitPrice)}`;document.getElementById('summary-toppings').textContent=`加料 / $ ${priceFormatter.format(toppingTotal)}`;
  document.getElementById('summary-quantity').textContent=`× ${quantity}`;document.getElementById('total-price').textContent=`$ ${priceFormatter.format(total)}`;
  return {product,size,quantity,chosenToppings,unitPrice,total};
}
function renderToppings(){
  const container=document.getElementById('topping-options');toppings.forEach((topping,index)=>{const label=document.createElement('label');label.className='topping-option';label.innerHTML=`<span><input type="checkbox" name="toppings" value="${index}"> ${topping.name}</span><span>+$${topping.price}</span>`;container.append(label);});
}
async function submitOrder(order){
  const message=document.getElementById('form-message');
  if(!APPS_SCRIPT_URL){message.className='form-message is-error';message.textContent='訂單表單尚未連結 Google Sheet。請先依 README 部署 Apps Script 並填入網址。';return false;}
  const payload={name:form.elements.name.value.trim(),drink:order.product.name,category:order.product.category,size:order.size,quantity:order.quantity,sugar:form.elements.sugar.value,ice:form.elements.ice.value,toppings:order.chosenToppings.map(topping=>topping.name).join('、')||'無',note:form.elements.note.value.trim(),unitPrice:order.unitPrice,totalPrice:order.total};
  try{await fetch(APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',body:JSON.stringify(payload)});message.className='form-message';message.textContent='已送出，訂單已記錄。';form.reset();sizeSelect.disabled=true;sizeSelect.replaceChildren(new Option('請先選飲品',''));calculateOrder();return true;}
  catch{message.className='form-message is-error';message.textContent='送出失敗，請確認網路後重試。';return false;}
}
populateProducts();populateSizes();renderToppings();addChoice('sugar-options','sugar',sugarLevels,'半糖');addChoice('ice-options','ice',iceLevels,'少冰');
form.addEventListener('change',event=>{if(event.target===drinkSelect)populateSizes();calculateOrder();});form.addEventListener('input',calculateOrder);
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type="submit"]');button.disabled=true;await submitOrder(calculateOrder());button.disabled=false;});calculateOrder();