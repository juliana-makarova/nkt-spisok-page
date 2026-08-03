const connectors=[
 {id:'SMA-M-R',type:'SMA',gender:'male',name:'SMA вилка, прямая',cables:['RG-316','LMR-195'],price:1850,availability:'На складе'},
 {id:'SMA-F-R',type:'SMA',gender:'female',name:'SMA розетка, прямая',cables:['RG-316','LMR-195'],price:2100,availability:'Под заказ'},
 {id:'N-M-R',type:'N',gender:'male',name:'N вилка, прямая',cables:['LMR-195','LMR-400'],price:2950,availability:'На складе'},
 {id:'N-F-P',type:'N',gender:'female',name:'N розетка, панельная',cables:['LMR-195','LMR-400'],price:3250,availability:'Под заказ'},
 {id:'TNC-M-R',type:'TNC',gender:'male',name:'TNC вилка, прямая',cables:['RG-316','LMR-195'],price:2400,availability:'На складе'},
 {id:'TNC-F-R',type:'TNC',gender:'female',name:'TNC розетка, прямая',cables:['RG-316','LMR-195'],price:2650,availability:'Под заказ'},
 {id:'OPEN',type:'OPEN',gender:'none',name:'Без разъёма — открытый конец',cables:['RG-316','LMR-195','LMR-400'],price:0,availability:'Доступно'}
];
const cables=[
 {id:'RG-316',name:'RG-316',note:'Гибкий · до 3 ГГц',meter:420,min:.15,max:10,availability:'На складе'},
 {id:'LMR-195',name:'LMR-195',note:'Малые потери · до 6 ГГц',meter:680,min:.2,max:20,availability:'На складе'},
 {id:'LMR-400',name:'LMR-400',note:'Низкие потери · до 6 ГГц',meter:1350,min:.5,max:100,availability:'Под заказ'}
];
const state={a:null,b:null,cable:null,step:0,maxStep:0};
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const types=[...new Set(connectors.filter(x=>x.id!=='OPEN').map(x=>x.type))];
function fillSelect(id,items){$(id).insertAdjacentHTML('beforeend',items.map(x=>`<option value="${x}">${x}</option>`).join(''))}
fillSelect('typeA',types);fillSelect('typeB',types);fillSelect('cableType',cables.map(x=>x.id));

function availability(item){return `<small class="availability ${item.availability==='На складе'?'in-stock':''}">${item.availability}</small>`}
function renderConnectors(side){
 const type=$(side==='a'?'typeA':'typeB').value,gender=$(side==='a'?'genderA':'genderB').value,list=$(side==='a'?'listA':'listB');
 let items=connectors.filter(x=>x.id!=='OPEN'&&(!type||x.type===type)&&x.gender===gender);if(side==='b')items.push(connectors.find(x=>x.id==='OPEN'));
 list.innerHTML=items.map(x=>{const incompatible=state.cable&&!x.cables.includes(state.cable.id);return `<button type="button" class="choice ${state[side]?.id===x.id?'selected':''}" data-side="${side}" data-id="${x.id}" ${incompatible?'disabled':''}><span><strong>${x.name}</strong><small>${x.id}</small>${availability(x)}</span><b>${incompatible?'Несовместим':money(x.price)}</b></button>`}).join('');
}
function renderCables(){
 const type=$('cableType').value,selected=[state.a,state.b].filter(Boolean);let items=cables.filter(x=>!type||x.id===type);
 $('listCable').innerHTML=items.map(x=>{const incompatible=selected.some(c=>!c.cables.includes(x.id));return `<button type="button" class="choice ${state.cable?.id===x.id?'selected':''}" data-cable="${x.id}" ${incompatible?'disabled':''}><span><strong>${x.name}</strong><small>${x.note}</small>${availability(x)}</span><b>${incompatible?'Несовместим':money(x.meter)+'/м'}</b></button>`}).join('');
}
function selectConnector(side,id){state[side]=connectors.find(x=>x.id===id);const prefix=side==='a'?'A':'B';if(id!=='OPEN'){$('type'+prefix).value=state[side].type;$('gender'+prefix).value=state[side].gender}if(state.cable&&!state[side].cables.includes(state.cable.id))state.cable=null;renderAll()}
function selectCable(id){state.cable=cables.find(x=>x.id===id);$('cableType').value=id;if(state.a&&!state.a.cables.includes(id))state.a=null;if(state.b&&!state.b.cables.includes(id))state.b=null;$('length').min=state.cable.min;$('length').max=state.cable.max;renderAll()}
function lengthMeters(){const n=Number($('length').value)||0;return n*({m:1,cm:.01,mm:.001}[$('lengthUnit').value])}
function lengthLabel(){return `${$('length').value||0} ${$('lengthUnit').selectedOptions[0].textContent}`}
function frequencyValue(){return $('frequency').value==='custom'?Number($('customFrequency').value)||0:Number($('frequency').value)||0}
function componentsValid(){return Boolean(state.a&&state.b&&state.cable)}
function paramsValid(){const l=lengthMeters(),f=frequencyValue();return componentsValid()&&l>=state.cable.min&&l<=state.cable.max&&f>0}
function selectedTests(){return [...document.querySelectorAll('[name="test"]:checked')].map(x=>x.value)}

function goToStep(step){
 if(step>state.maxStep)return;state.step=step;
 document.querySelectorAll('.step-panel').forEach(x=>x.classList.toggle('active',Number(x.dataset.panel)===step));
 document.querySelectorAll('.stepper li').forEach((li,i)=>{li.classList.toggle('active',i===step);li.classList.toggle('completed',i<step);li.querySelector('button').disabled=i>state.maxStep});
 $('finalActions').hidden=step!==2;$('summaryGate').hidden=step===2;$('resetButton').hidden=step===2;
 updateSummary();document.querySelector('.workspace').scrollIntoView({behavior:'smooth',block:'start'});
}
function updateNavigation(){
 const c=componentsValid(),p=paramsValid();document.querySelector('[data-next="1"]').disabled=!c;document.querySelector('[data-next="2"]').disabled=!p;
 if(c)state.maxStep=Math.max(state.maxStep,1);if(p)state.maxStep=Math.max(state.maxStep,2);
 document.querySelectorAll('.stepper button').forEach((b,i)=>b.disabled=i>state.maxStep);
}
function updateSummary(){
 const l=lengthMeters(),complete=componentsValid(),valid=paramsValid();
 $('summaryA').textContent=state.a?`${state.a.name} · ${state.a.availability}`:'—';$('summaryB').textContent=state.b?`${state.b.name} · ${state.b.availability}`:'—';$('summaryCable').textContent=state.cable?`${state.cable.name} · ${state.cable.availability}`:'—';$('summaryLength').textContent=lengthLabel();$('mapLength').textContent=lengthLabel();$('mapA').textContent=state.a?.id||'Не выбран';$('mapB').textContent=state.b?.id||'Не выбран';$('summaryFrequency').textContent=frequencyValue()?frequencyValue().toLocaleString('ru-RU')+' МГц':'—';
 const options=[];if($('heatshrink').checked)options.push('Термоусадка');options.push(...selectedTests());$('summaryOptions').textContent=options.join(', ')||'Без дополнительных опций';
 const status=$('status');let message='Выберите разъёмы и кабель',kind='warning';if(complete&&!valid){kind='warning';message=frequencyValue()?`Проверьте длину: для ${state.cable.name} допустимо ${state.cable.min}–${state.cable.max} м`:'Укажите рабочую частоту'}if(valid){kind='valid';message=state.step===2?'Готово к отправке':'Обязательные данные заполнены'}status.className='status '+kind;status.querySelector('span').textContent=message;
 const code=complete?`НКТ-${state.a.type}-${state.cable.id}-${state.b.type}-${String(Math.round(l*1000)).padStart(4,'0')}`:'Сборка не завершена';$('assemblyCode').textContent=code;$('price').textContent=complete?money(state.a.price+state.b.price+state.cable.meter*l+1200):'—';$('addToCart').disabled=!(valid&&state.step===2);
 updateNavigation();history.replaceState(null,'','#'+new URLSearchParams({a:state.a?.id||'',c:state.cable?.id||'',b:state.b?.id||'',l:$('length').value,u:$('lengthUnit').value,f:frequencyValue()||'',s:state.step}).toString());
}
function renderAll(){renderConnectors('a');renderConnectors('b');renderCables();updateSummary()}
document.addEventListener('click',e=>{const c=e.target.closest('.choice');if(c?.dataset.side)selectConnector(c.dataset.side,c.dataset.id);if(c?.dataset.cable)selectCable(c.dataset.cable);const n=e.target.closest('[data-focus]');if(n){$(n.dataset.focus).scrollIntoView({behavior:'smooth',block:'center'})}const next=e.target.closest('[data-next]');if(next&&!next.disabled)goToStep(Number(next.dataset.next));const prev=e.target.closest('[data-prev]');if(prev)goToStep(Number(prev.dataset.prev));const tab=e.target.closest('[data-step]');if(tab&&!tab.disabled)goToStep(Number(tab.dataset.step))});
['typeA','genderA','typeB','genderB'].forEach(id=>$(id).addEventListener('change',()=>renderConnectors(id.endsWith('A')?'a':'b')));$('cableType').addEventListener('change',renderCables);
$('frequency').addEventListener('change',()=>{$('customFrequencyWrap').hidden=$('frequency').value!=='custom';updateSummary()});
['length','lengthUnit','customFrequency','markingA','markingCable','markingB','heatshrink','extraTests','comment'].forEach(id=>$(id).addEventListener('input',updateSummary));document.querySelectorAll('[name="test"]').forEach(x=>x.addEventListener('change',updateSummary));
$('resetButton').addEventListener('click',()=>{state.a=state.b=state.cable=null;state.step=state.maxStep=0;$('configForm').reset();$('customFrequencyWrap').hidden=true;renderAll();goToStep(0)});$('printButton').addEventListener('click',()=>window.print());
$('addToCart').addEventListener('click',()=>{localStorage.setItem('nkt-demo-cart',JSON.stringify({code:$('assemblyCode').textContent,a:state.a,b:state.b,cable:state.cable,length:lengthLabel(),frequency:frequencyValue()}));$('cartCount').textContent='1';$('cartContent').innerHTML=`<strong>${$('assemblyCode').textContent}</strong><p>${state.a.name} · ${state.cable.name} · ${state.b.name}<br>${lengthLabel()} · ${frequencyValue()} МГц</p>`;$('cartDialog').showModal()});
$('cartButton').addEventListener('click',()=>{$('cartContent').innerHTML=localStorage.getItem('nkt-demo-cart')?'В корзине сохранена одна демонстрационная конфигурация.':'Корзина пока пуста.';$('cartDialog').showModal()});document.querySelector('.dialog-close').addEventListener('click',()=>$('cartDialog').close());
function loadHash(){const p=new URLSearchParams(location.hash.slice(1));if(p.get('a'))state.a=connectors.find(x=>x.id===p.get('a'))||null;if(p.get('b'))state.b=connectors.find(x=>x.id===p.get('b'))||null;if(p.get('c'))state.cable=cables.find(x=>x.id===p.get('c'))||null;if(p.get('l'))$('length').value=p.get('l');if(p.get('u'))$('lengthUnit').value=p.get('u');if(p.get('f')){$('frequency').value=[...$('frequency').options].some(x=>x.value===p.get('f'))?p.get('f'):'custom';if($('frequency').value==='custom'){$('customFrequency').value=p.get('f');$('customFrequencyWrap').hidden=false}}if(state.a){$('typeA').value=state.a.type;$('genderA').value=state.a.gender}if(state.b&&state.b.id!=='OPEN'){$('typeB').value=state.b.type;$('genderB').value=state.b.gender}if(state.cable)$('cableType').value=state.cable.id;$('cartCount').textContent=localStorage.getItem('nkt-demo-cart')?'1':'0';renderAll();state.maxStep=paramsValid()?2:componentsValid()?1:0;goToStep(Math.min(Number(p.get('s'))||0,state.maxStep))}loadHash();
