const catalogToolbar=document.querySelector('.table-tools');
const catalogControls=document.querySelector('.list-controls');
const tableActionGroup=document.querySelector('.table-actions');

function removeSumColumn(scope){
  scope.querySelectorAll('.price-head span:nth-child(3),.card-price-head span:nth-child(3)').forEach(element=>element.remove());
  scope.querySelectorAll('.prices,.card-prices').forEach(grid=>{
    [...grid.children].forEach((element,index)=>{if((index+1)%3===0)element.remove()});
  });
}

removeSumColumn(document);

document.querySelectorAll('.table-scroll .buy-col').forEach(cell=>{
  const input=cell.querySelector('input[type="number"]');
  if(!input||input.closest('.table-quantity'))return;
  input.insertAdjacentHTML('beforebegin','<div class="table-quantity"><button type="button" class="qty-minus" aria-label="Уменьшить количество">−</button></div>');
  const quantity=input.previousElementSibling;
  quantity.append(input);
  quantity.insertAdjacentHTML('beforeend','<button type="button" class="qty-plus" aria-label="Увеличить количество">+</button>');
});

catalogControls.hidden=false;
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const list=button.dataset.view==='list';
  catalogToolbar.classList.toggle('list-mode',list);
  catalogControls.hidden=false;
  tableActionGroup.hidden=list;
}));

function changeQuantity(control,delta){
  const input=control.querySelector('input');
  const value=control.querySelector('span');
  const current=Number(input?input.value:value.textContent)||1;
  const next=Math.max(1,current+delta);
  if(input)input.value=next;
  else value.textContent=next;
}

document.addEventListener('click',event=>{
  const minus=event.target.closest('.qty-minus,.quantity button:first-child');
  const plus=event.target.closest('.qty-plus,.quantity button:last-child');
  if(minus)changeQuantity(minus.closest('.table-quantity,.quantity'),-1);
  if(plus)changeQuantity(plus.closest('.table-quantity,.quantity'),1);
});
