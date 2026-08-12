const BRANDS = [
  {name:'Renault', icon:'renault', models:['Clio','Captur','Mégane','Austral','Scénic','Arkana','Twingo','Kangoo']},
  {name:'Peugeot', icon:'peugeot', models:['208','2008','308','3008','5008','508','Partner','Rifter']},
  {name:'Citroën', icon:'citroen', models:['C3','C3 Aircross','C4','C5 Aircross','Berlingo','Ami']},
  {name:'Dacia', icon:'dacia', models:['Sandero','Duster','Jogger','Spring','Logan']},
  {name:'Volkswagen', icon:'volkswagen', models:['Golf','Polo','T-Roc','T-Cross','Tiguan','Passat','ID.3','ID.4','Transporter']},
  {name:'Toyota', icon:'toyota', models:['Yaris','Yaris Cross','Corolla','C-HR','RAV4','Aygo X','Prius','Land Cruiser']},
  {name:'Ford', icon:'ford', models:['Fiesta','Focus','Puma','Kuga','Mustang','Ranger','Transit']},
  {name:'BMW', icon:'bmw', models:['1 Series','2 Series','3 Series','4 Series','5 Series','X1','X3','X5','i4']},
  {name:'Mercedes-Benz', icon:'mercedesbenz', models:['A-Class','B-Class','C-Class','E-Class','GLA','GLC','GLE','Vito','Sprinter']},
  {name:'Audi', icon:'audi', models:['A1','A3','A4','A5','A6','Q2','Q3','Q5','Q7','e-tron']},
  {name:'Nissan', icon:'nissan', models:['Micra','Juke','Qashqai','X-Trail','Leaf','Ariya','Navara']},
  {name:'Kia', icon:'kia', models:['Picanto','Rio','Ceed','Stonic','Niro','Sportage','Sorento','EV3','EV6']},
  {name:'Hyundai', icon:'hyundai', models:['i10','i20','i30','Bayon','Kona','Tucson','Santa Fe','Ioniq 5']},
  {name:'Fiat', icon:'fiat', models:['500','500X','Panda','Tipo','Doblo','Ducato']},
  {name:'Opel', icon:'opel', models:['Corsa','Astra','Mokka','Crossland','Grandland','Combo','Vivaro']},
  {name:'Vauxhall', icon:'vauxhall', models:['Corsa','Astra','Mokka','Crossland','Grandland','Combo','Vivaro']},
  {name:'Škoda', icon:'skoda', models:['Fabia','Scala','Octavia','Superb','Kamiq','Karoq','Kodiaq','Enyaq']},
  {name:'SEAT', icon:'seat', models:['Ibiza','Leon','Arona','Ateca','Tarraco']},
  {name:'CUPRA', icon:'cupra', models:['Formentor','Born','Leon','Ateca','Tavascan']},
  {name:'Volvo', icon:'volvo', models:['EX30','XC40','XC60','XC90','V60','V90','S60']},
  {name:'Tesla', icon:'tesla', models:['Model 3','Model Y','Model S','Model X']},
  {name:'MINI', icon:'mini', models:['Cooper','Countryman','Clubman','Aceman']},
  {name:'Mazda', icon:'mazda', models:['Mazda2','Mazda3','CX-30','CX-5','CX-60','MX-5']},
  {name:'Honda', icon:'honda', models:['Jazz','Civic','HR-V','ZR-V','CR-V','e:Ny1']},
  {name:'Suzuki', icon:'suzuki', models:['Swift','Ignis','Vitara','S-Cross','Jimny']},
  {name:'MG', icon:'mg', models:['MG3','MG4','MG5','ZS','HS','Cyberster']},
  {name:'Land Rover', icon:'landrover', models:['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Evoque','Velar']},
  {name:'Jeep', icon:'jeep', models:['Avenger','Renegade','Compass','Wrangler','Grand Cherokee']},
  {name:'Porsche', icon:'porsche', models:['911','718','Macan','Cayenne','Panamera','Taycan']},
  {name:'Alfa Romeo', icon:'alfaromeo', models:['Giulia','Stelvio','Tonale','Junior']},
  {name:'Mitsubishi', icon:'mitsubishi', models:['Colt','ASX','Eclipse Cross','Outlander','L200']},
  {name:'Lexus', icon:'lexus', models:['LBX','UX','NX','RX','RZ','ES']},
  {name:'Jaguar', icon:'jaguar', models:['XE','XF','F-Pace','E-Pace','I-Pace','F-Type']},
  {name:'DS', icon:'dsautomobiles', models:['DS 3','DS 4','DS 7','DS 9']},
  {name:'Polestar', icon:'polestar', models:['Polestar 2','Polestar 3','Polestar 4']},
  {name:'BYD', icon:'byd', models:['Dolphin','Atto 3','Seal','Seal U']},
  {name:'Smart', icon:'smart', models:['Fortwo','Forfour','#1','#3']},
  {name:'Ferrari', icon:'ferrari', models:['Roma','296','SF90','Purosangue','812']},
  {name:'Lamborghini', icon:'lamborghini', models:['Huracán','Revuelto','Urus']},
  {name:'Bentley', icon:'bentley', models:['Continental GT','Flying Spur','Bentayga']},
  {name:'Maserati', icon:'maserati', models:['Grecale','Ghibli','Levante','GranTurismo','MC20']}
];

const STORAGE_KEY = 'roadSpotter.v1';
let state = loadState();
let pressTimer = null;
let longPressed = false;
let toastTimer = null;

const els = {
  grid: document.getElementById('brandGrid'), total: document.getElementById('totalCount'), search: document.getElementById('brandSearch'),
  undo: document.getElementById('undoBtn'), uniqueBrands: document.getElementById('uniqueBrands'), uniqueModels: document.getElementById('uniqueModels'),
  leaderboard: document.getElementById('leaderboard'), reset: document.getElementById('resetBtn'), sheet: document.getElementById('modelSheet'),
  sheetTitle: document.getElementById('sheetTitle'), sheetLogo: document.getElementById('sheetLogo'), modelButtons: document.getElementById('modelButtons'),
  close: document.getElementById('sheetClose'), backdrop: document.getElementById('sheetBackdrop'), toast: document.getElementById('toast')
};

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {sightings:[], counts:{}, models:{}}; }
  catch { return {sightings:[], counts:{}, models:{}}; }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function logoUrl(icon){ return `https://cdn.simpleicons.org/${icon}/181818`; }
function total(){ return Object.values(state.counts).reduce((a,b)=>a+b,0); }

function renderBrands(filter=''){
  const q = filter.trim().toLowerCase();
  const filtered = BRANDS.filter(b => b.name.toLowerCase().includes(q));
  els.grid.innerHTML = '';
  filtered.forEach(brand => {
    const btn = document.createElement('button');
    btn.type='button'; btn.className='brand-card' + ((state.counts[brand.name]||0) ? ' spotted' : '');
    btn.setAttribute('aria-label', `${brand.name}: ${state.counts[brand.name]||0} spotted`);
    const wrap=document.createElement('span'); wrap.className='brand-logo-wrap';
    const img=document.createElement('img'); img.className='brand-logo'; img.alt=''; img.src=logoUrl(brand.icon);
    img.onerror=()=>{ wrap.innerHTML=`<span class="brand-fallback">${brand.name.slice(0,3).toUpperCase()}</span>`; };
    wrap.appendChild(img);
    const name=document.createElement('span'); name.className='brand-name'; name.textContent=brand.name;
    const count=document.createElement('span'); const n=state.counts[brand.name]||0; count.className='brand-count'+(n?'':' zero'); count.textContent=n;
    btn.append(wrap,name,count);

    const start = e => { if(e.type==='pointerdown' && e.pointerType==='mouse' && e.button!==0) return; longPressed=false; pressTimer=setTimeout(()=>{longPressed=true; openModels(brand);},500); };
    const cancel = ()=>{ clearTimeout(pressTimer); pressTimer=null; };
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', ()=>{ cancel(); if(!longPressed) addSighting(brand.name,null); });
    btn.addEventListener('pointercancel', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('contextmenu', e=>e.preventDefault());
    els.grid.appendChild(btn);
  });
}

function addSighting(brand, model){
  state.counts[brand]=(state.counts[brand]||0)+1;
  if(model){ state.models[brand] ||= {}; state.models[brand][model]=(state.models[brand][model]||0)+1; }
  state.sightings.push({brand,model:model||null,time:Date.now()});
  save(); renderAll(); closeModels(); showToast(model ? `${brand} ${model} +1` : `${brand} +1`);
}

function undo(){
  const last=state.sightings.pop(); if(!last) return;
  state.counts[last.brand]=Math.max(0,(state.counts[last.brand]||0)-1);
  if(last.model && state.models[last.brand]) state.models[last.brand][last.model]=Math.max(0,(state.models[last.brand][last.model]||0)-1);
  save(); renderAll(); showToast(`Removed ${last.brand}${last.model?' '+last.model:''}`);
}

function openModels(brand){
  els.sheet.hidden=false; document.body.style.overflow='hidden'; els.sheetTitle.textContent=brand.name;
  els.sheetLogo.innerHTML=`<img src="${logoUrl(brand.icon)}" alt="">`;
  els.modelButtons.innerHTML='';
  brand.models.forEach(model=>{ const b=document.createElement('button'); b.type='button'; b.textContent=model; b.onclick=()=>addSighting(brand.name,model); els.modelButtons.appendChild(b); });
  const other=document.createElement('button'); other.type='button'; other.className='other'; other.textContent='Model unknown / other'; other.onclick=()=>addSighting(brand.name,null); els.modelButtons.appendChild(other);
}
function closeModels(){ els.sheet.hidden=true; document.body.style.overflow=''; }

function renderStats(){
  const spotted=BRANDS.filter(b=>(state.counts[b.name]||0)>0).sort((a,b)=>(state.counts[b.name]||0)-(state.counts[a.name]||0));
  els.uniqueBrands.textContent=spotted.length;
  const modelSet = new Set();
  Object.entries(state.models).forEach(([brand,models])=>Object.entries(models).forEach(([model,n])=>{ if(n>0) modelSet.add(`${brand}|${model}`); }));
  els.uniqueModels.textContent=modelSet.size;
  if(!spotted.length){ els.leaderboard.innerHTML='<div class="empty">No vehicles spotted yet.</div>'; return; }
  els.leaderboard.innerHTML='';
  spotted.forEach(brand=>{
    const row=document.createElement('div'); row.className='leader-row';
    const img=document.createElement('img'); img.src=logoUrl(brand.icon); img.alt=''; img.onerror=()=>img.style.visibility='hidden';
    const text=document.createElement('div'); text.className='leader-text';
    const modelEntries=Object.entries(state.models[brand.name]||{}).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
    const detail=modelEntries.length ? modelEntries.slice(0,3).map(([m,n])=>`${m} ${n}`).join(' · ') : 'No models identified';
    text.innerHTML=`<strong>${brand.name}</strong><small>${detail}</small>`;
    const count=document.createElement('div'); count.className='leader-count'; count.textContent=state.counts[brand.name]||0;
    row.append(img,text,count); els.leaderboard.appendChild(row);
  });
}

function renderAll(){
  els.total.textContent=total(); els.undo.disabled=!state.sightings.length; renderBrands(els.search.value); renderStats();
}
function showToast(text){ clearTimeout(toastTimer); els.toast.textContent=text; els.toast.classList.add('show'); toastTimer=setTimeout(()=>els.toast.classList.remove('show'),1000); }

els.search.addEventListener('input',e=>renderBrands(e.target.value));
els.undo.addEventListener('click',undo);
els.close.addEventListener('click',closeModels); els.backdrop.addEventListener('click',closeModels);
els.reset.addEventListener('click',()=>{ if(confirm('Reset every vehicle you have spotted?')){ state={sightings:[],counts:{},models:{}}; save(); renderAll(); }});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(tab.dataset.view+'View').classList.add('active');
}));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModels(); });

renderAll();