const tableColumns=[
  {id:'brand',label:'Бренд',checked:true,width:85,value:'NKT PRO'},
  {id:'family',label:'Семейство',checked:false,width:120,value:'TestFlex'},
  {id:'cableCategory',label:'Категория кабеля',checked:false,width:145,value:'Фазостабильный'},
  {id:'maxFrequency',label:'Верхняя рабочая частота макс., ГГц',checked:false,width:160,value:'40'},
  {id:'connector1',label:'Соединитель 1',checked:true,width:135,value:'2.4мм вилка'},
  {id:'connector2',label:'Соединитель 2',checked:true,width:135,value:'2.4мм розетка'},
  {id:'protection',label:'Наличие защиты',checked:false,width:120,value:'Да'},
  {id:'returnLoss',label:'КСВН / обратные потери, не хуже',checked:true,width:180,value:'14,9 дБ'},
  {id:'minTemperature',label:'Нижняя рабочая температура, °C',checked:false,width:155,value:'−55'},
  {id:'maxTemperature',label:'Верхняя рабочая температура, °C',checked:false,width:155,value:'+125'},
  {id:'diameter',label:'Внешний диаметр, мм',checked:false,width:130,value:'6'},
  {id:'length',label:'Длина, мм',checked:true,width:90,value:'1000'},
  {id:'application',label:'Применение',checked:false,width:165,value:'Измерительные системы'}
];
const settingsModal=document.querySelector('#tableSettingsModal');
const settingsForm=document.querySelector('#tableSettingsForm');
const settingsOptions=document.querySelector('#settingsOptions');
const productsTable=document.querySelector('#productsTable');
let appliedColumns=new Set(tableColumns.filter(column=>column.checked).map(column=>column.id));
const oldColumnClasses=['brand-col','connector-col','connector-col','return-loss-col','length-col'];
const oldColumnIds=['brand','connector1','connector2','returnLoss','length'];
productsTable.querySelectorAll('tbody tr').forEach(row=>{
  oldColumnClasses.forEach((className,index)=>{const cells=row.querySelectorAll(`.${className}`);const cell=className==='connector-col'?cells[index-1]:cells[0];if(cell){cell.classList.add('config-col');cell.dataset.column=oldColumnIds[index]}});
  tableColumns.filter(column=>!oldColumnIds.includes(column.id)).forEach(column=>row.insertAdjacentHTML('beforeend',`<td class="config-col extra-col" data-column="${column.id}" hidden>${column.value}</td>`));
});
settingsOptions.innerHTML=tableColumns.map(column=>`<label class="settings-option"><input type="checkbox" name="tableColumn" value="${column.id}"><span>${column.label}</span></label>`).join('');
function fillSettings(){settingsOptions.querySelectorAll('input').forEach(input=>input.checked=appliedColumns.has(input.value))}
function openSettings(){fillSettings();settingsModal.hidden=false;document.body.classList.add('modal-open');requestAnimationFrame(()=>settingsOptions.querySelector('input')?.focus())}
function closeSettings(){settingsModal.hidden=true;document.body.classList.remove('modal-open');document.querySelector('#openTableSettings').focus()}
function applyColumns(){document.querySelectorAll('[data-column]').forEach(cell=>cell.hidden=!appliedColumns.has(cell.dataset.column));const width=805+tableColumns.reduce((sum,column)=>sum+(appliedColumns.has(column.id)?column.width:0),0);productsTable.style.width=`${width}px`;productsTable.style.minWidth=`${width}px`;requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'));document.querySelector('#tableScroll').dispatchEvent(new Event('scroll'))})}
document.querySelector('#openTableSettings').addEventListener('click',openSettings);
document.querySelectorAll('[data-close-settings]').forEach(button=>button.addEventListener('click',closeSettings));
settingsForm.addEventListener('submit',event=>{event.preventDefault();appliedColumns=new Set([...settingsOptions.querySelectorAll('input:checked')].map(input=>input.value));applyColumns();closeSettings();toast(`Таблица настроена: ${appliedColumns.size} колонок`)});
document.querySelector('#resetTableSettings').addEventListener('click',()=>settingsOptions.querySelectorAll('input').forEach(input=>input.checked=false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!settingsModal.hidden)closeSettings()});
applyColumns();
