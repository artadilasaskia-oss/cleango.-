/* CleanGo: logika pemesanan, lacak, admin, owner, asisten tanya, dan animasi.
   Dimuat dari index.html dengan atribut defer. */
'use strict';

/* ikon untuk setiap menu dashboard */
const NAV_IC={'#layanan':'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
'#harga':'<path d="M20 12 12 4H4v8l8 8z"/><path d="M7.5 7.5h.01"/>',
'#promo':'<path d="M3 8h18v4H3zM5 12h14v9H5zM12 8v13"/><path d="M12 8c-2-4-6-4-6-1s4 1 6 1zM12 8c2-4 6-4 6-1s-4 1-6 1z"/>',
'#antar':'<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
'#mesin':'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
'#cara':'<circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z"/>',
'#artikel':'<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
'#faq':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
'#kontak':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
'#lacak':'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
'#pesan':'<path d="M3 4h2l2.5 11h10L20 7H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
'#dashboard':'<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="5"/><rect x="13" y="10" width="8" height="11"/><rect x="3" y="13" width="8" height="8"/>',
'#riwayat':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'#profil':'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
'#admin':'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
'#owner':'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
'#keuangan':'<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 7l12-3v3M16 13h2"/>',
'#login':'<path d="M15 3h4v18h-4M10 17l5-5-5-5M15 12H3"/>',
'#keluar':'<path d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9"/>'};
function decorateNav(){$$('#nav a').forEach(a=>{if(a.querySelector('.lb'))return;const key=a.hasAttribute('data-out')?'#keluar':a.getAttribute('href');const label=a.textContent.trim();a.innerHTML=`<svg class="ni" viewBox="0 0 24 24" aria-hidden="true">${NAV_IC[key]||'<circle cx="12" cy="12" r="2"/>'}</svg><span class="lb">${label}</span>`})}

const WA='6285710423097',IG='itscleango.laundry';
const STATUS=['Menunggu jemput','Telah diambil','Sedang diproses','Selesai'],STEPS=STATUS.slice(1);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db={get(k,d){try{const v=localStorage.getItem('cg_'+k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){try{localStorage.setItem('cg_'+k,JSON.stringify(v))}catch(e){toast('Penyimpanan browser penuh atau diblokir.')}}};
const SEED_SERVICES=[
 {id:'kiloan',name:'Laundry kiloan',unit:'kg',price:7000,note:'Cuci, kering, lipat. 2 hari.'},
 {id:'cs',name:'Cuci dan setrika',unit:'kg',price:9000,note:'Cuci, setrika, kemas. 2 hari.'},
 {id:'express',name:'Laundry express',unit:'kg',price:13000,note:'Selesai 6 jam.'},
 {id:'satuan',name:'Laundry satuan',unit:'pcs',price:8000,note:'Per potong: kemeja, celana, jaket.'}];
const SEED_COURIERS=[{id:'k1',name:'Budi',phone:'0812-0000-0001'},{id:'k2',name:'Sari',phone:'0812-0000-0002'}];
const SEED_NEW=[{id:'sepatu',name:'Cuci sepatu',unit:'pcs',price:35000,note:'Sepatu dibersihkan per pasang.'},{id:'selimut',name:'Cuci selimut dan bed cover',unit:'pcs',price:35000,note:'Dicuci per potong, 2 hari.'},{id:'jas',name:'Cuci jas dan gaun',unit:'pcs',price:45000,note:'Perawatan khusus per potong, 2 hari.'}];
if(!db.get('services'))db.set('services',SEED_SERVICES);
if(!db.get('svc_v2')){const sv0=db.get('services')||[];SEED_NEW.forEach(s=>{if(!sv0.some(x=>x.id===s.id))sv0.push(s)});db.set('services',sv0);db.set('svc_v2',1)}
if(!db.get('couriers'))db.set('couriers',SEED_COURIERS);
if(!db.get('orders'))db.set('orders',[]);
/* Akun admin: selalu dipastikan ada & role admin setiap halaman dibuka (tidak bergantung data lama di browser) */
const ADMIN_ACCOUNTS=[
 {email:'admin@cleango.id',pass:'admin123',name:'Admin CleanGo',phone:'',address:'',role:'admin'},
 {email:'admin@cleargo.id',pass:'admin123',name:'Admin CleanGo',phone:'',address:'',role:'admin'}, /* alias salah-ketik "cleargo" */
 {email:'owner@cleango.id',pass:'CleanGo#2026',name:'Owner CleanGo',phone:'',address:'',role:'owner'}
];
{let us=db.get('users',[]);if(!Array.isArray(us))us=[];
 ADMIN_ACCOUNTS.forEach(a=>{const i=us.findIndex(u=>u.email===a.email);if(i>=0)us[i]=Object.assign({},us[i],a);else us.push(Object.assign({},a));});
 db.set('users',us);}
const services=()=>db.get('services',[]),orders=()=>db.get('orders',[]),users=()=>db.get('users',[]),couriers=()=>db.get('couriers',[]);
const me=()=>users().find(u=>u.email===db.get('session'));
{const OLD={Pending:'Menunggu jemput','Pickup Scheduled':'Menunggu jemput',Received:'Telah diambil',Weighed:'Telah diambil',Washing:'Sedang diproses',Drying:'Sedang diproses',Ironing:'Sedang diproses',Packaging:'Sedang diproses',Delivery:'Sedang diproses',Completed:'Selesai'};
 const a=orders();let ch=0;a.forEach(o=>{if(OLD[o.status]){o.status=OLD[o.status];ch=1}(o.log||[]).forEach(l=>{if(OLD[l.s]){l.s=OLD[l.s];ch=1}})});if(ch)db.set('orders',a)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2800)}
function waLink(t){return `https://wa.me/${WA}?text=${encodeURIComponent(t)}`}
const PROMO_CODES=['CLEANGO10','ANTARGRATIS','HEMAT15'];
function calc(o){const sub=o.price*o.qty,c=o.promo;let disc=0;if(c==='CLEANGO10')disc=sub*.1;else if(c==='HEMAT15'&&sub>=100000)disc=sub*.15;const fee=(sub>50000||c==='ANTARGRATIS')?0:5000;return{sub,fee,disc,total:sub+fee-disc}}
const go=h=>{location.hash=h};
const PHONE_MSG='No. WhatsApp/HP harus angka, minimal 12 digit.',PW_MSG='Kata sandi minimal 6 karakter.';
const phoneOk=v=>/^\d{12,15}$/.test(String(v).trim());
const EYE='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.2"/><path d="M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const BANKS=['Bank Mandiri','Bank BRI','Bank BCA','Bank BNI','Bank BTN','Bank Syariah Indonesia (BSI)','CIMB Niaga','Bank Danamon','Bank Permata','Bank Panin','OCBC NISP','Maybank Indonesia','Bank Mega','Bank BTPN / Jenius','Bank Jatim','Bank Muamalat','Bank UOB Indonesia','Bank DBS Indonesia','Bank Sinarmas','Bank Mayapada','KB Bukopin','Bank Neo Commerce','SeaBank','Bank Jago'];
const BIKE='<svg class="cr-bike" viewBox="0 0 130 72" width="130" height="72" fill="none" stroke="#123D52" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="22" width="30" height="20" rx="4" fill="#168BAF"/><path d="M34 40h42M76 40l8-22h12M36 34h20"/><circle cx="46" cy="12" r="6" fill="#BCEAF4"/><path d="M46 19l3 15M49 24l36-6"/><g class="whl"><circle cx="30" cy="54" r="11" fill="#fff"/><path d="M30 46v16M22 54h16" stroke-width="2.5"/></g><g class="whl"><circle cx="100" cy="54" r="11" fill="#fff"/><path d="M100 46v16M92 54h16" stroke-width="2.5"/></g></svg>';
const TICK='<svg class="tk-ic" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="#c9f0d8" stroke="#2fa866" stroke-width="3"/><path d="M15 27l8 8 15-17" fill="none" stroke="#2fa866" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>';
/* ---------- nav & router ---------- */
function renderNav(){
 const u=me(),L=[['#layanan','Layanan'],['#harga','Harga'],['#promo','Promo'],['#antar','Antar-jemput'],['#mesin','Proses'],['#faq','FAQ'],['#kontak','Kontak'],['#lacak','Lacak']];
 let h=L.map(x=>`<a href="${x[0]}">${x[1]}</a>`).join('');
 if(!u)h+='<a href="#login" class="btn sm">Masuk / Daftar</a>';
 else if(u.role==='owner')h+='<a href="#owner">Keuangan</a><a href="#admin">Admin</a><a href="#" data-out class="btn sm alt">Keluar</a>';
  else if(u.role==='admin')h+='<a href="#admin">Admin</a><a href="#" data-out class="btn sm alt">Keluar</a>';
 else h+='<a href="#pesan">Pesan</a><a href="#dashboard">Dashboard</a><a href="#riwayat">Riwayat</a><a href="#profil">Profil</a><a href="#" data-out class="btn sm alt">Keluar</a>';
 $('#nav').innerHTML=h; decorateNav();
}
const VIEWS={login:renderAuth,pesan:renderOrder,konfirmasi:renderConf,lacak:renderTrack,riwayat:renderHist,dashboard:renderDash,profil:renderProf,admin:renderAdmin,owner:renderOwner};
const NEED={pesan:1,riwayat:1,dashboard:1,profil:1,konfirmasi:1,admin:2,owner:3};
let redirecting=false;const redirect=h=>{redirecting=true;go(h)};
function routeNow(){
 let k=location.hash.slice(1)||'beranda',u=me();
 if(NEED[k]&&!u){toast('Silakan masuk dulu.');return redirect('login')}
 if(NEED[k]===2&&u.role!=='admin'&&u.role!=='owner'){toast('Halaman khusus admin.');return redirect('dashboard')}
  if(NEED[k]===3&&u.role!=='owner'){toast('Halaman khusus owner.');return redirect(u.role==='admin'?'admin':'dashboard')}
 if(k==='admin'||k==='login'||k==='pesan'){}
 const isView=VIEWS[k]||LANDING.includes(k);
 $$('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+(isView?k:'beranda')));
 renderNav();$('#nav').classList.remove('open');
 $$('#nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+k));
 if(VIEWS[k])VIEWS[k]();
 if(k==='harga')renderPrices();
 window.scrollTo(0,0);
}
addEventListener('hashchange',route);
document.addEventListener('click',e=>{
 const w=e.target.closest('[data-wa]');
 if(w){e.preventDefault();window.open(waLink(w.dataset.wa),'_blank','noopener')}
 if(e.target.closest('[data-out]')){e.preventDefault();db.set('session',null);toast('Anda sudah keluar.');go('beranda');route()}
});
$('#menu').onclick=()=>$('#nav').classList.toggle('open');
$$('[data-wa]').forEach(a=>{a.href=waLink(a.dataset.wa);a.target='_blank';a.rel='noopener'});
/* ---------- beranda ---------- */
function renderPrices(){
 $('#priceList').innerHTML=services().map(s=>`<div class="card"><h3>${esc(s.name)}</h3><p class="price">${rp(s.price)}<small style="font:600 14px var(--fb)"> / ${s.unit}</small></p><p>${esc(s.note)}</p></div>`).join('');
}
/* ---------- login & registrasi ---------- */
function renderAuth(mode='login'){
 const reg=mode==='reg';
 $('#authBox').innerHTML=`<h2>${reg?'Daftar akun':'Masuk'}</h2>
 <form id="af">${reg?`<label for="n">Nama lengkap</label><input id="n" required><label for="p">No. WhatsApp</label><input id="p" type="tel" data-digits inputmode="numeric" pattern="[0-9]{12,15}" minlength="12" maxlength="15" required placeholder="Minimal 12 digit, contoh 081234567890" title="Hanya angka, minimal 12 digit">`:''}
 <label for="e">Email</label><input id="e" type="email" required><label for="pw">Kata sandi</label><div class="pwbox"><input id="pw" type="password" required minlength="6" autocomplete="${reg?'new-password':'current-password'}"><button type="button" class="pwtog" aria-label="Tampilkan kata sandi" aria-pressed="false">${EYE}</button></div>
 <p class="note" style="margin:10px 0">${reg?'Kata sandi minimal 6 karakter (huruf atau angka). No. WhatsApp minimal 12 digit angka.':'SILAHKAN MASUKKAN EMAIL DAN KATA SANDI'}</p>
 <button class="btn" style="width:100%">${reg?'Daftar':'Masuk'}</button></form>
 <p style="margin-top:14px">${reg?'Sudah punya akun?':'Belum punya akun?'} <a href="#login" id="sw">${reg?'Masuk':'Daftar'}</a></p>
 <p class="note"></p>`;
 $('#sw').onclick=e=>{e.preventDefault();renderAuth(reg?'login':'reg')};
 $('#af').onsubmit=e=>{e.preventDefault();
  const em=$('#e').value.trim().toLowerCase(),pw=$('#pw').value,us=users();
  if(reg){
   if(!phoneOk($('#p').value))return toast(PHONE_MSG);if(pw.length<6)return toast(PW_MSG);
   if(us.some(u=>u.email===em))return toast('Email sudah terdaftar.');
   us.push({email:em,pass:pw,name:$('#n').value.trim(),phone:$('#p').value.trim(),address:'',role:'customer'});
   db.set('users',us);db.set('session',em);toast('Akun dibuat. Selamat datang!');go('dashboard');
  }else{
   const u=us.find(x=>x.email===em&&x.pass===pw);
   if(!u)return toast('Email atau kata sandi salah.');
   db.set('session',em);toast('Berhasil masuk.');go(u.role==='owner'?'owner':u.role==='admin'?'admin':'dashboard');
  }
  route();};
}
/* ---------- pemesanan ---------- */
function renderOrder(){
 const u=me(),sv=services(),today=new Date().toISOString().slice(0,10);
 $('#orderBox').innerHTML=`<div class="ttl"><h2>Pesan laundry</h2></div><form id="of" class="cols">
 <div class="panel"><label for="sv">Jenis layanan</label><select id="sv">${sv.map(s=>`<option value="${s.id}">${esc(s.name)} – ${rp(s.price)}/${s.unit}</option>`).join('')}</select>
 <label for="q" id="ql"></label><input id="q" type="number" min="1" step="0.5" value="3" required>
 <p class="note">Berat final ditimbang kurir dan bisa berubah sedikit.</p>
 <label for="d">Tanggal jemput</label><input id="d" type="date" min="${today}" value="${today}" required>
 <label for="a">Alamat jemput (Madiun)</label><textarea id="a" rows="3" required>${esc(u.address)}</textarea>
 <label for="no">Catatan (opsional)</label><input id="no" placeholder="Contoh: pisahkan baju putih"></div>
 <div class="panel"><h3>Ringkasan biaya</h3><label for="pr">Kode promo</label><input id="pr" placeholder="CLEANGO10">
 <label for="pm">Pembayaran</label><select id="pm"><option>Tunai saat antar</option><option>Transfer bank</option><option>QRIS (simulasi)</option></select>
 <div id="bankBox" hidden><h4 style="margin-top:14px">Data transfer bank</h4>
 <label for="bk">Bank</label><select id="bk"><option value="">Pilih bank</option>${BANKS.map(b=>`<option>${b}</option>`).join('')}</select>
 <label for="bn">Nomor rekening</label><input id="bn" data-digits inputmode="numeric" minlength="8" maxlength="20" placeholder="Hanya angka">
 <label for="bh">Nama lengkap pemilik rekening</label><input id="bh" autocomplete="name" value="${esc(u.name)}">
 <p class="note">Data ini dipakai untuk mencocokkan pembayaran Anda.</p></div>
 <div class="total" id="tt"></div><button class="btn" style="width:100%">Checkout dan konfirmasi</button></div></form>`;
 const upd=()=>{const tf=$('#pm').value==='Transfer bank';$('#bankBox').hidden=!tf;['bk','bn','bh'].forEach(i=>$('#'+i).required=tf);const s=sv.find(x=>x.id===$('#sv').value);$('#ql').textContent=s.unit==='kg'?'Perkiraan berat (kg)':'Jumlah potong';
  const o={price:s.price,qty:+$('#q').value||0,promo:$('#pr').value.trim().toUpperCase()},c=calc(o);
  $('#tt').innerHTML=`<div><span>Subtotal</span><span>${rp(c.sub)}</span></div><div><span>Antar-jemput</span><span>${c.fee?rp(c.fee):'Gratis'}</span></div>
  ${c.disc?`<div><span>Diskon 10%</span><span>-${rp(c.disc)}</span></div>`:''}<div class="big"><span>Total</span><span>${rp(c.total)}</span></div>`};
 $$('#of input,#of select').forEach(i=>i.oninput=upd);upd();
 $('#of').onsubmit=e=>{e.preventDefault();
  const s=sv.find(x=>x.id===$('#sv').value),promo=$('#pr').value.trim().toUpperCase();
  if(promo&&!PROMO_CODES.includes(promo))return toast('Kode promo tidak dikenal.');
   if(promo==='HEMAT15'&&s.price*(+$('#q').value||0)<100000)return toast('Kode HEMAT15 berlaku untuk pesanan minimal Rp100.000.');
  if(!(+$('#q').value>0))return toast('Isi berat atau jumlah.');
  const bank=$('#pm').value==='Transfer bank'?{bank:$('#bk').value,no:$('#bn').value.trim(),name:$('#bh').value.trim()}:null;
  if(bank&&(!bank.bank||bank.no.length<8||!bank.name))return toast('Lengkapi bank, nomor rekening (min. 8 angka), dan nama lengkap.');
  const id='CG'+new Date().toISOString().slice(2,10).replace(/-/g,'')+Math.floor(1000+Math.random()*9000),now=new Date().toISOString();
  const o={id,email:u.email,name:u.name,phone:u.phone,sid:s.id,sname:s.name,unit:s.unit,price:s.price,qty:+$('#q').value,promo,
   date:$('#d').value,address:$('#a').value.trim(),note:$('#no').value.trim(),pay:$('#pm').value,bank,paid:false,courier:'',status:'Menunggu jemput',created:now,log:[{s:'Menunggu jemput',t:now}]};
  const all=orders();all.push(o);db.set('orders',all);db.set('last',id);
  if(!u.address){const us=users();us.find(x=>x.email===u.email).address=o.address;db.set('users',us)}
  toast('Pesanan dibuat.');go('konfirmasi');};
}
const QRIS_SRC="assets/qris.jpg";
const thanks=t=>`<div class="thanks" role="status">${TICK}<h3>Terima kasih telah mempercayai CleanGo</h3><p>${t}</p></div>`;
function renderConf(){
 const o=orders().find(x=>x.id===db.get('last'));
 if(!o){$('#confBox').innerHTML='<div class="panel">Belum ada pesanan. <a href="#pesan">Buat pesanan</a></div>';return}
 const c=calc(o),cash=/^Tunai/.test(o.pay),qr=/^QRIS/.test(o.pay),bk=o.bank||{};
 let pay;
 if(cash)pay=`<div class="courier" role="status"><div class="cr-road">${BIKE}</div><h3>Kurir menuju lokasi Anda</h3><p>Siapkan pembayaran tunai saat cucian diantar.</p><p class="cr-thx">Terima kasih telah mempercayai CleanGo</p></div>`;
 else if(o.paid)pay=thanks(`Pembayaran ${qr?'QRIS':'transfer bank'} untuk pesanan ${o.id} sudah dicatat.`);
 else if(qr)pay=`<div style="text-align:center;margin:18px 0"><h3 style="margin-bottom:10px">Bayar dengan QRIS</h3><img src="${QRIS_SRC}" alt="QRIS CleanGo (GoPay Merchant)" style="width:100%;max-width:320px;height:auto;border-radius:16px;box-shadow:0 4px 14px #123d522a;margin:auto"><p class="note" style="margin-top:8px">Scan dengan GoPay, BCA, Mandiri, BNI, BRI, atau aplikasi pembayaran lain.</p><button class="btn" id="paid" style="margin-top:14px">Saya sudah bayar</button></div>`;
 else pay=`<div class="total"><b>Data transfer Anda</b><div><span>Bank</span><span>${esc(bk.bank||'-')}</span></div><div><span>No. rekening</span><span>${esc(bk.no||'-')}</span></div><div><span>Atas nama</span><span>${esc(bk.name||'-')}</span></div></div><button class="btn" id="paid" style="width:100%;margin-bottom:6px">Saya sudah transfer</button>`;
 $('#confBox').innerHTML=`<div class="panel narrow"><h2>Pesanan diterima</h2><p>Nomor pesanan <b>${o.id}</b></p>
 <div class="total"><div><span>${esc(o.sname)}</span><span>${o.qty} ${o.unit}</span></div><div><span>Jemput</span><span>${o.date}</span></div><div><span>Pembayaran</span><span>${esc(o.pay)}</span></div><div class="big"><span>Total</span><span>${rp(c.total)}</span></div></div>
 ${pay}
 <div class="row"><a class="btn" href="#lacak">Lacak pesanan</a><a class="btn alt" href="${waLink(`Halo CleanGo, saya baru memesan ${o.id} (${o.sname}, ${o.qty} ${o.unit}). Mohon konfirmasi jadwal jemput ${o.date}.`)}" target="_blank" rel="noopener">Konfirmasi via WhatsApp</a></div></div>`;
 const pb=$('#paid');if(pb)pb.onclick=()=>{const a=orders();a.find(y=>y.id===o.id).paid=true;db.set('orders',a);toast('Pembayaran dicatat. Terima kasih!');renderConf()};
}
/* ---------- pelacakan ---------- */
function renderTrack(){
 $('#trackBox').innerHTML=`<div class="panel narrow" style="max-width:600px"><h2>Lacak pesanan</h2><form id="tf" class="row" style="flex-wrap:nowrap;align-items:end"><div style="flex:1"><label for="ti">Nomor pesanan</label><input id="ti" value="${esc(db.get('last')||'')}" placeholder="CG261112xxxx"></div><button class="btn">Cari</button></form><div id="tr"></div></div>`;
 const show=()=>{const id=$('#ti').value.trim().toUpperCase(),o=orders().find(x=>x.id===id),b=$('#tr');
  if(!id){b.innerHTML='';return}
  if(!o){b.innerHTML='<p style="margin-top:14px">Nomor pesanan tidak ditemukan. Periksa kembali nomornya atau cari di browser yang sama dengan saat memesan.</p>';return}
  const i=STATUS.indexOf(o.status);
  b.innerHTML=`<p style="margin-top:16px"><b>${esc(o.sname)}</b> · ${o.qty} ${o.unit} · ${rp(calc(o).total)}</p>${i<1?'<p class="note" style="margin-top:8px">Menunggu kurir menjemput cucian Anda.</p>':''}<ul class="track">${STEPS.map((s,k)=>{const n=k+1,l=o.log.find(x=>x.s===s);return `<li class="${n<i?'ok':n===i?'ok now':''}">${s}${l?` <small>${new Date(l.t).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}</small>`:''}</li>`}).join('')}</ul>`};
 $('#tf').onsubmit=e=>{e.preventDefault();show()};show();
}
/* ---------- riwayat, dashboard, profil ---------- */
const badge=s=>`<span class="badge ${s==='Selesai'?'done':''}">${s}</span>`;
const mine=()=>orders().filter(o=>o.email===db.get('session')).reverse();
function renderHist(){
 const m=mine();
 $('#histBox').innerHTML=`<div class="ttl"><h2>Riwayat pesanan</h2></div><div class="panel tw">${m.length?`<table><tr><th>No.</th><th>Layanan</th><th>Jumlah</th><th>Total</th><th>Status</th><th></th></tr>${m.map(o=>`<tr><td>${o.id}</td><td>${esc(o.sname)}</td><td>${o.qty} ${o.unit}</td><td>${rp(calc(o).total)}</td><td>${badge(o.status)}</td><td><button class="btn sm alt" data-t="${o.id}">Lacak</button></td></tr>`).join('')}</table>`:'<p>Belum ada pesanan. <a href="#pesan">Pesan sekarang</a></p>'}</div>`;
 $$('[data-t]').forEach(b=>b.onclick=()=>{db.set('last',b.dataset.t);go('lacak')});
}
function renderDash(){
 const u=me(),m=mine(),act=m.filter(o=>o.status!=='Selesai'),spent=m.filter(o=>o.status==='Selesai').reduce((a,o)=>a+calc(o).total,0);
 $('#dashBox').innerHTML=`<div class="ttl"><h2>Halo, ${esc(u.name.split(' ')[0])}</h2><p>Ringkasan laundry Anda.</p></div>
 <div class="stats"><div class="card stat"><b>${m.length}</b>Total pesanan</div><div class="card stat"><b>${act.length}</b>Sedang diproses</div><div class="card stat"><b>${rp(spent)}</b>Total selesai</div></div>
 <div class="panel"><h3>Pesanan terbaru</h3>${m[0]?`<p>${m[0].id} · ${esc(m[0].sname)} ${badge(m[0].status)}</p><a class="btn sm" href="#lacak" data-last="${m[0].id}">Lacak</a>`:'<p>Belum ada pesanan.</p>'}</div>
 <a class="btn" href="#pesan">Pesan laundry baru</a>`;
 const l=$('[data-last]');if(l)l.onclick=()=>db.set('last',l.dataset.last);
}
function renderProf(){
 const u=me();
 $('#profBox').innerHTML=`<div class="panel narrow"><h2>Profil</h2><form id="pf"><label for="pn">Nama</label><input id="pn" value="${esc(u.name)}" required><label>Email</label><input value="${esc(u.email)}" disabled><label for="pp">No. WhatsApp</label><input id="pp" data-digits inputmode="numeric" pattern="[0-9]{12,15}" minlength="12" maxlength="15" placeholder="Minimal 12 digit angka" value="${esc(String(u.phone||'').replace(/\D/g,''))}"><label for="pa">Alamat</label><textarea id="pa" rows="3">${esc(u.address)}</textarea><br><button class="btn">Simpan profil</button></form></div>`;
 $('#pf').onsubmit=e=>{e.preventDefault();const pv=$('#pp').value.trim();if(pv&&!phoneOk(pv))return toast(PHONE_MSG);const us=users(),x=us.find(a=>a.email===u.email);x.name=$('#pn').value.trim();x.phone=$('#pp').value.trim();x.address=$('#pa').value.trim();db.set('users',us);toast('Profil disimpan.')};
}
/* ---------- admin ---------- */
let tab='dash';
function renderAdmin(){
 const T=[['dash','Dashboard'],['ord','Pesanan'],['cus','Pelanggan'],['srv','Layanan & harga'],['kur','Kurir'],['lap','Laporan']];
 const os=orders(),done=os.filter(o=>o.status==='Selesai'),rev=done.reduce((a,o)=>a+calc(o).total,0);
 let body='';
 if(tab==='dash')body=`<div class="stats"><div class="card stat"><b>${os.length}</b>Pesanan</div><div class="card stat"><b>${os.filter(o=>o.status==='Menunggu jemput').length}</b>Menunggu</div><div class="card stat"><b>${os.filter(o=>o.status!=='Selesai').length}</b>Berjalan</div><div class="card stat"><b>${rp(rev)}</b>Pendapatan selesai</div></div><div class="panel"><p>Buka tab Pesanan untuk memperbarui status. Pelanggan langsung melihat perubahan di halaman Lacak.</p></div>`;
 if(tab==='ord')body=`<div class="panel tw">${os.length?`<table><tr><th>No.</th><th>Pelanggan</th><th>Layanan</th><th>Jml</th><th>Total</th><th>Kurir</th><th>Status</th></tr>${[...os].reverse().map(o=>`<tr><td>${o.id}</td><td>${esc(o.name)}<br><small>${esc(o.phone)}</small></td><td>${esc(o.sname)}</td><td style="width:90px"><input data-q="${o.id}" type="number" min="0.5" step="0.5" value="${o.qty}"> ${o.unit}</td><td>${rp(calc(o).total)}</td><td><select data-c="${o.id}"><option value="">-</option>${couriers().map(k=>`<option ${k.name===o.courier?'selected':''}>${esc(k.name)}</option>`).join('')}</select></td><td><select data-s="${o.id}">${STATUS.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</table>`:'<p>Belum ada pesanan masuk.</p>'}</div>`;
 if(tab==='cus'){const cs=users().filter(u=>u.role!=='admin'&&u.role!=='owner');body=`<div class="panel tw">${cs.length?`<table><tr><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Pesanan</th></tr>${cs.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.email)}</td><td>${esc(c.phone)}</td><td>${os.filter(o=>o.email===c.email).length}</td></tr>`).join('')}</table>`:'<p>Belum ada pelanggan terdaftar.</p>'}</div>`}
 if(tab==='srv')body=`<div class="panel tw"><table><tr><th>Layanan</th><th>Satuan</th><th>Harga (Rp)</th></tr>${services().map(s=>`<tr><td>${esc(s.name)}</td><td>/${s.unit}</td><td style="width:140px"><input data-p="${s.id}" type="number" min="0" step="500" value="${s.price}"></td></tr>`).join('')}</table></div>`;
 if(tab==='kur')body=`<div class="panel tw"><table><tr><th>Kurir</th><th>Telepon</th><th>Tugas aktif</th><th></th></tr>${couriers().map(k=>`<tr><td>${esc(k.name)}</td><td>${esc(k.phone)}</td><td>${os.filter(o=>o.courier===k.name&&o.status!=='Selesai').length}</td><td><button class="btn sm alt" data-kdel="${k.id}">Hapus</button></td></tr>`).join('')}</table></div><form id="kf" class="panel row" style="align-items:end"><div><label for="kn">Nama kurir</label><input id="kn" required></div><div><label for="kp">Telepon</label><input id="kp" data-digits inputmode="numeric" pattern="[0-9]{12,15}" minlength="12" maxlength="15" required placeholder="Minimal 12 digit"></div><button class="btn">Tambah kurir</button></form>`;
 if(tab==='lap')body=`<div class="stats"><div class="card stat"><b>${rp(rev)}</b>Pendapatan selesai</div><div class="card stat"><b>${rp(os.reduce((a,o)=>a+calc(o).total,0))}</b>Nilai semua pesanan</div></div><div class="panel tw"><table><tr><th>Layanan</th><th>Pesanan</th><th>Nilai</th></tr>${services().map(s=>{const l=os.filter(o=>o.sid===s.id);return `<tr><td>${esc(s.name)}</td><td>${l.length}</td><td>${rp(l.reduce((a,o)=>a+calc(o).total,0))}</td></tr>`}).join('')}</table></div>`;
 $('#adminBox').innerHTML=`<div class="ttl"><h2>Panel admin</h2></div><div class="tabs">${T.map(t=>`<button data-tab="${t[0]}" class="${t[0]===tab?'on':''}">${t[1]}</button>`).join('')}</div>${body}`;
 $$('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;renderAdmin()});
 const upd=(id,fn)=>{const a=orders(),o=a.find(x=>x.id===id);fn(o);db.set('orders',a)};
 $$('[data-s]').forEach(s=>s.onchange=()=>{upd(s.dataset.s,o=>{o.status=s.value;o.log.push({s:s.value,t:new Date().toISOString()})});toast('Status diperbarui: '+s.value);renderAdmin()});
 $$('[data-c]').forEach(s=>s.onchange=()=>{upd(s.dataset.c,o=>o.courier=s.value);toast('Kurir ditetapkan.')});
 $$('[data-q]').forEach(s=>s.onchange=()=>{if(+s.value>0){upd(s.dataset.q,o=>o.qty=+s.value);toast('Jumlah dan total diperbarui.');renderAdmin()}});
 $$('[data-p]').forEach(s=>s.onchange=()=>{const a=services();a.find(x=>x.id===s.dataset.p).price=+s.value||0;db.set('services',a);toast('Harga disimpan.')});
 $$('[data-kdel]').forEach(b=>b.onclick=()=>{const k=couriers().find(x=>x.id===b.dataset.kdel);if(!k)return;const act=orders().filter(o=>o.courier===k.name&&o.status!=='Selesai').length;if(!confirm(act?`Hapus kurir ${k.name}? Ia masih punya ${act} tugas aktif, tugas tersebut akan dilepas dari kurir.`:`Hapus kurir ${k.name}?`))return;const a=orders();a.forEach(o=>{if(o.courier===k.name&&o.status!=='Selesai')o.courier=''});db.set('orders',a);db.set('couriers',couriers().filter(x=>x.id!==k.id));toast('Kurir dihapus.');renderAdmin()});
const kf=$('#kf');if(kf)kf.onsubmit=e=>{e.preventDefault();if(!phoneOk($('#kp').value))return toast(PHONE_MSG);const a=couriers();a.push({id:'k'+Date.now(),name:$('#kn').value.trim(),phone:$('#kp').value.trim()});db.set('couriers',a);toast('Kurir ditambahkan.');renderAdmin()};
}
/* ---------- tanya langsung: asisten otomatis CleanGo ---------- */
const KB=[
 {k:['beda','perbedaan','bedanya','kiloan','satuan'],
  a:()=>'Kiloan dihitung per kilogram: cucian dicuci, dikeringkan, dan dilipat, cocok untuk pakaian harian. Satuan dihitung per potong, misalnya kemeja, jaket, atau selimut.'},
 {k:['harga','biaya','tarif','per kg','per kilo','per pcs','berapa bayar','kiloan','cuci setrika','setrika','satuan','layanan','jenis'],
  a:()=>'Layanan dan harga CleanGo saat ini:\n'+services().map(s=>'• '+s.name+': '+rp(s.price)+'/'+s.unit+' ('+s.note+')').join('\n')+'\nSubtotal di atas Rp50.000 gratis antar-jemput, selain itu ongkos Rp5.000. Kode CLEANGO10 memberi diskon 10%.'},
 {k:['lama','durasi','selesai','kapan jadi','kapan selesai','berapa hari','estimasi','express','kilat','cepat'],
  a:()=>'Layanan reguler (kiloan dan cuci setrika) selesai dalam 2 hari. Laundry express selesai dalam 6 jam, dihitung setelah cucian ditimbang. Statusnya bisa dipantau di menu Lacak.'},
 {k:['jemput','antar','ongkir','gratis','kurir','ambil cucian','delivery','pickup'],
  a:()=>'Pilih tanggal jemput saat memesan, lalu kurir mengambil cucian di alamat Anda dan mengantarnya kembali setelah selesai. Ongkos antar-jemput Rp5.000, gratis jika subtotal di atas Rp50.000.'},
 {k:['bayar','pembayaran','transfer','qris','tunai','cash','rekening','gopay','cod'],
  a:()=>'Pembayaran bisa tunai saat cucian diantar, transfer bank, atau QRIS. Pilih metodenya saat checkout di halaman Pesan.'},
 {k:['promo','diskon','potongan','voucher','kode','murah'],
  a:()=>'Masukkan kode CLEANGO10 di halaman Pesan untuk diskon 10%. Antar-jemput juga gratis jika subtotal di atas Rp50.000.'},
 {k:['area','daerah','wilayah','lokasi','alamat','madiun','dimana','di mana','jangkauan','luar kota','dekat'],
  a:()=>'CleanGo melayani Kota Madiun dan sekitarnya. Alamat kami: Jl. Pahlawan No. 03, Madiun. Kalau lokasi Anda di luar Madiun, tanyakan dulu lewat WhatsApp.',wa:1},
 {k:['berat','timbang','selisih','perkiraan'],
  a:()=>'Berat final ditentukan saat cucian diambil dan ditimbang kurir. Total akan diperbarui admin sesuai berat sebenarnya, jadi bisa sedikit berbeda dari perkiraan.'},
 {k:['pesan','order','memesan','cara pesan','daftar','akun','login','masuk','booking'],
  a:()=>'Cara pesan: 1) masuk atau daftar akun, 2) buka halaman Pesan, 3) pilih layanan, isi perkiraan berat, tanggal dan alamat jemput, 4) checkout. Nomor pesanan muncul di halaman konfirmasi.'},
 {k:['lacak','status','tracking','pesanan saya','nomor pesanan','sampai mana','posisi'],
  a:()=>'Buka menu Lacak, lalu masukkan nomor pesanan (diawali CG). Statusnya: Menunggu jemput, Telah diambil, Sedang diproses, lalu Selesai.'},
 {k:['kontak','whatsapp','wa','hubungi','telepon','telpon','nomor hp','instagram','ig','customer service','cs'],
  a:()=>'Hubungi kami lewat WhatsApp 0857-1042-3097 atau Instagram @'+IG+'.',wa:1},
 {k:['jam buka','buka jam','jam operasional','tutup','hari libur'],
  a:()=>'Jam operasional belum tercantum di website ini. Silakan tanyakan lewat WhatsApp supaya jawabannya akurat.',wa:1},
 {k:['sepatu','selimut','bedcover','karpet','boneka','gorden','tas','sprei','bantal'],
  a:()=>'Layanan yang tersedia di website: '+services().map(s=>s.name).join(', ')+'. Untuk item tersebut belum ada harganya di daftar, silakan tanyakan lewat WhatsApp.',wa:1},
 {k:['rusak','hilang','luntur','komplain','kecewa','tertukar','sobek'],
  a:()=>'Mohon maaf atas ketidaknyamanannya. Kirim nomor pesanan dan foto kondisi cucian lewat WhatsApp supaya tim kami bisa menindaklanjuti.',wa:1},
 {k:['terima kasih','makasih','thanks','thx','oke','ok'],a:()=>'Sama-sama! Kalau ada pertanyaan lain, tulis saja di sini.'},
 {k:['halo','hai','hi','selamat pagi','selamat siang','selamat sore','selamat malam','assalamualaikum','permisi'],
  a:()=>'Halo! Saya asisten otomatis CleanGo. Silakan tanya soal harga, lama pengerjaan, jemput-antar, pembayaran, atau promo.'}
];
const norm=t=>t.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
function answerFor(q){
 const t=' '+norm(q)+' ';let best=null,sc=0;
 KB.forEach(e=>{const n=e.k.reduce((a,w)=>a+(t.includes(w.length<=3?' '+w+' ':' '+w)?1:0),0);if(n>sc){sc=n;best=e}});
 return best?{t:best.a(),wa:best.wa}:{t:'Maaf, saya belum punya jawaban pasti untuk itu. Coba tanyakan soal harga, lama pengerjaan, jemput-antar, pembayaran, promo, atau area layanan. Untuk hal lain, tim kami siap membantu lewat WhatsApp.',wa:1};
}
let asking=false;
function askBot(q){
 q=String(q).trim().slice(0,200);if(!q||asking)return;asking=true;
 const log=$('#askLog'),inp=$('#askIn'),btn=$('#askBtn');
 const u=document.createElement('div');u.className='qa u';u.textContent=q;
 const b=document.createElement('div');b.className='qa b';b.innerHTML='<span class="typing" role="img" aria-label="Asisten sedang mengetik"><i></i><i></i><i></i></span>';
 log.append(u,b);log.scrollTop=log.scrollHeight;
 inp.value='';inp.disabled=btn.disabled=true;btn.textContent='Menjawab…';
 const ms=3000+Math.random()*2000; /* jawaban muncul 3–5 detik */
 setTimeout(()=>{
  const r=answerFor(q);b.textContent=r.t;
  if(r.wa){const a=document.createElement('a');a.href=waLink('Halo CleanGo, saya mau tanya: '+q);a.target='_blank';a.rel='noopener';a.textContent='Tanya via WhatsApp';a.className='btn sm';a.style.cssText='display:block;margin-top:8px;text-align:center';b.appendChild(a)}
  log.scrollTop=log.scrollHeight;asking=false;inp.disabled=btn.disabled=false;btn.textContent='Kirim'},ms);
}
$('#askForm').onsubmit=e=>{e.preventDefault();askBot($('#askIn').value)};
$$('#askChips button').forEach(b=>b.onclick=()=>askBot(b.textContent));
/* ---------- owner: laporan keuangan ---------- */
const EXP_CATS=['Sabun cuci','Parfum laundry','Listrik','Air','Plastik laundry','Gaji karyawan','Servis motor kurir','Bensin motor kurir','Sewa tempat','Lain-lain'];
const expenses=()=>db.get('expenses',[]);
const ym=d=>{const x=new Date(d);return isNaN(x)?'':x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')};
const shiftM=(m,n)=>{const p=m.split('-').map(Number),d=new Date(p[0],p[1]-1+n,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const mLabel=m=>new Date(m+'-01T00:00:00').toLocaleDateString('id-ID',{month:'long',year:'numeric'});
const mShort=m=>new Date(m+'-01T00:00:00').toLocaleDateString('id-ID',{month:'short',year:'2-digit'});
const dLabel=v=>{const d=new Date(String(v).slice(0,10)+'T00:00:00');return isNaN(d)?'-':d.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})};
const rpS=n=>(n<0?'-':'')+rp(Math.abs(n));
const doneAt=o=>{const l=(o.log||[]).slice().reverse().find(x=>x.s==='Selesai');return l?l.t:o.created};
const incomeOf=m=>orders().filter(o=>o.status==='Selesai'&&ym(doneAt(o))===m);
const outOf=m=>expenses().filter(e=>String(e.date).slice(0,7)===m);
const sumIn=m=>incomeOf(m).reduce((a,o)=>a+calc(o).total,0),sumOut=m=>outOf(m).reduce((a,e)=>a+e.amt,0);
let ownerMonth=ym(new Date()),otab='ring';
function renderOwner(){
 const m=ownerMonth,inc=incomeOf(m),out=outOf(m),tin=sumIn(m),tout=sumOut(m),net=tin-tout,now=new Date();
 const last=new Date(+m.slice(0,4),+m.slice(5,7),0).getDate(),pad=n=>String(n).padStart(2,'0');
 const T=[['ring','Ringkasan'],['in','Uang masuk'],['out','Uang keluar']];
 const cats=[...new Set([...EXP_CATS,...out.map(e=>e.cat)])].map(c=>[c,out.filter(e=>e.cat===c).reduce((a,e)=>a+e.amt,0)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 let body='';
 if(otab==='ring'){
  const data=[5,4,3,2,1,0].map(n=>shiftM(m,-n)).map(x=>[x,sumIn(x),sumOut(x)]),mx=Math.max(1,...data.map(d=>Math.max(d[1],d[2]))),run=orders().filter(o=>o.status!=='Selesai').length;
  body=`<div class="stats"><div class="card stat"><b class="fin-in">${rp(tin)}</b>Uang masuk</div><div class="card stat"><b class="fin-out">${rp(tout)}</b>Uang keluar</div><div class="card stat"><b style="color:${net<0?'#c0392b':'#1b8a4c'}">${rpS(net)}</b>${net<0?'Rugi':'Laba'} bersih</div></div>
  <div class="panel"><h3>Tren 6 bulan</h3><p class="note">Bar biru = uang masuk, bar merah = uang keluar, angka di kanan = selisih.</p>${data.map(d=>`<div class="mrow"><span>${esc(mShort(d[0]))}</span><div><div class="bar"><i style="width:${d[1]/mx*100}%"></i></div><div class="bar out" style="margin-top:4px"><i style="width:${d[2]/mx*100}%"></i></div></div><span>${rpS(d[1]-d[2])}</span></div>`).join('')}</div>
  <div class="panel"><h3>Pengeluaran per kategori – ${esc(mLabel(m))}</h3>${cats.length?cats.map(c=>`<div class="crow"><span>${esc(c[0])}</span><div class="bar out"><i style="width:${c[1]/tout*100}%"></i></div><span>${rp(c[1])} · ${Math.round(c[1]/tout*100)}%</span></div>`).join(''):'<p>Belum ada pengeluaran pada bulan ini.</p>'}</div>
  <p class="note">Uang masuk dihitung dari pesanan berstatus Selesai pada bulan terpilih (berdasarkan tanggal selesai). Saat ini ada ${run} pesanan yang masih berjalan dan belum dihitung.</p>`;
 }
 if(otab==='in')body=`<div class="panel tw"><h3>Uang masuk dari pesanan selesai – ${esc(mLabel(m))}</h3>${inc.length?`<table><tr><th>Selesai</th><th>No.</th><th>Pelanggan</th><th>Layanan</th><th>Jml</th><th>Bayar</th><th class="r">Total</th></tr>${[...inc].sort((a,b)=>doneAt(a)<doneAt(b)?1:-1).map(o=>`<tr><td>${dLabel(doneAt(o))}</td><td>${esc(o.id)}</td><td>${esc(o.name)}</td><td>${esc(o.sname)}</td><td>${o.qty} ${esc(o.unit)}</td><td>${esc(o.pay)}</td><td class="r">${rp(calc(o).total)}</td></tr>`).join('')}<tr><th colspan="6">Total uang masuk</th><th class="r fin-in">${rp(tin)}</th></tr></table>`:'<p>Belum ada pesanan selesai pada bulan ini.</p>'}</div>`;
 if(otab==='out'){
  const def=ym(now)===m?m+'-'+pad(now.getDate()):m+'-01';
  body=`<div class="panel"><h3>Catat belanja atau biaya</h3><form id="ef"><div class="fgrid">
   <div><label for="ed">Tanggal</label><input id="ed" type="date" min="${m}-01" max="${m}-${pad(last)}" value="${def}" required></div>
   <div><label for="ec">Kategori</label><select id="ec">${EXP_CATS.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
   <div><label for="ea">Jumlah (Rp)</label><input id="ea" type="number" min="1" step="1" inputmode="numeric" placeholder="Contoh: 150000" required></div>
   <div><label for="en">Keterangan (opsional)</label><input id="en" maxlength="80" placeholder="Contoh: Deterjen 5 liter"></div></div>
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn">Simpan pengeluaran</button><button type="button" class="btn alt" id="eCopy">Salin dari bulan lalu</button></div></form></div>
  <div class="panel tw"><h3>Uang keluar – ${esc(mLabel(m))}</h3>${out.length?`<table><tr><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th class="r">Jumlah</th><th></th></tr>${[...out].sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(e=>`<tr><td>${dLabel(e.date)}</td><td>${esc(e.cat)}</td><td>${esc(e.note)||'-'}</td><td class="r">${rp(e.amt)}</td><td><button class="btn sm alt" data-del="${esc(e.id)}">Hapus</button></td></tr>`).join('')}<tr><th colspan="3">Total uang keluar</th><th class="r fin-out">${rp(tout)}</th><th></th></tr></table>`:'<p>Belum ada pengeluaran pada bulan ini. Catat belanja sabun, parfum, listrik, air, plastik, gaji, servis dan bensin motor kurir lewat formulir di atas.</p>'}</div>`;
 }
 $('#ownerBox').innerHTML=`<div class="ttl"><h2>Laporan keuangan</h2><p>${esc(mLabel(m))} · uang masuk dari pesanan laundry, uang keluar dari belanja dan biaya bulanan.</p></div>
  <div class="tools"><div><label for="om">Bulan</label><input id="om" type="month" value="${m}"></div><button class="btn sm alt" id="oCsv">Unduh CSV</button><button class="btn sm alt" id="oPrint">Cetak</button></div>
  <div class="tabs">${T.map(t=>`<button data-otab="${t[0]}" class="${t[0]===otab?'on':''}">${t[1]}</button>`).join('')}</div>${body}`;
 $('#om').onchange=e=>{if(/^\d{4}-\d{2}$/.test(e.target.value)){ownerMonth=e.target.value;renderOwner()}};
 $$('[data-otab]').forEach(b=>b.onclick=()=>{otab=b.dataset.otab;renderOwner()});
 $('#oPrint').onclick=()=>window.print();
 $('#oCsv').onclick=()=>{
  const q=v=>{let x=String(v??'');if(typeof v==='string'&&/^[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'},rows=[['Tipe','Tanggal','Kategori / Layanan','Keterangan','Jumlah']];
  inc.forEach(o=>rows.push(['Masuk',doneAt(o).slice(0,10),o.sname,o.id+' - '+o.name,calc(o).total]));
  out.forEach(e=>rows.push(['Keluar',e.date,e.cat,e.note,e.amt]));
  rows.push([],['','','','Uang masuk',tin],['','','','Uang keluar',tout],['','','','Laba bersih',net]);
  const blob=new Blob(['\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='laporan-keuangan-'+m+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 const ef=$('#ef');if(ef)ef.onsubmit=e=>{e.preventDefault();const amt=Math.round(+$('#ea').value);if(!(amt>0))return toast('Isi jumlah pengeluaran.');
  const a=expenses();a.push({id:'x'+Date.now()+Math.floor(Math.random()*1e6),date:$('#ed').value,cat:$('#ec').value,note:$('#en').value.trim(),amt});db.set('expenses',a);toast('Pengeluaran dicatat.');renderOwner()};
 $$('[data-del]').forEach(b=>b.onclick=()=>{if(!confirm('Hapus catatan ini?'))return;db.set('expenses',expenses().filter(x=>x.id!==b.dataset.del));toast('Catatan dihapus.');renderOwner()});
 const ec=$('#eCopy');if(ec)ec.onclick=()=>{const src=outOf(shiftM(m,-1));if(!src.length)return toast('Belum ada pengeluaran di bulan lalu.');
  if(out.length&&!confirm('Bulan ini sudah ada catatan. Tetap salin dari bulan lalu?'))return;
  const a=expenses();src.forEach(x=>{const dd=Math.min(+String(x.date).slice(8,10)||1,last);a.push(Object.assign({},x,{id:'x'+Date.now()+Math.floor(Math.random()*1e6),date:m+'-'+pad(dd)}))});db.set('expenses',a);toast(src.length+' catatan disalin dari bulan lalu.');renderOwner()};
}
/* ---------- efek gelembung sabun ---------- */
const REDUCED=matchMedia('(prefers-reduced-motion:reduce)').matches;
const layer=document.body.appendChild(Object.assign(document.createElement('div'),{id:'bubbleLayer'}));
function bubble(x,y,o={}){
 const r=Math.random,s=o.size||8+r()*28,b=document.createElement('div');
 b.className='bub';b.style.cssText=`width:${s}px;height:${s}px;left:${x-s/2}px;top:${y-s/2}px`;
 layer.appendChild(b);
 const dx=(r()-.5)*(o.spread||130),rise=o.rise||60+r()*150,sw=(r()-.5)*44;
 b.animate([
  {transform:'translate(0,0) scale(.2)',opacity:0},
  {transform:`translate(${dx*.4+sw}px,${-rise*.4}px) scale(1)`,opacity:1,offset:.2},
  {transform:`translate(${dx*.8-sw}px,${-rise*.85}px) scale(1.05)`,opacity:.9,offset:.8},
  {transform:`translate(${dx}px,${-rise}px) scale(1.4)`,opacity:0}
 ],{duration:o.dur||900+r()*900,delay:o.delay||0,easing:'cubic-bezier(.3,.6,.4,1)',fill:'backwards'}).onfinish=()=>b.remove();
}
document.addEventListener('click',e=>{
 if(REDUCED)return;
 const t=e.target.closest('.btn,button:not(.pwtog)');
 if(!t||t.disabled)return;
 const r=t.getBoundingClientRect(),kb=!e.clientX&&!e.clientY;
 const x=kb?r.left+r.width/2:e.clientX,y=kb?r.top+r.height/2:e.clientY;
 for(let i=0;i<14;i++)bubble(x+(Math.random()-.5)*24,y+(Math.random()-.5)*12);
},true);
/* ---------- transisi antar halaman ---------- */
const SHEET_ROT=[-3,2.2,-1.4,0];
const cv=document.body.appendChild(Object.assign(document.createElement('div'),{id:'stack',innerHTML:'<div class="sheet"></div><div class="sheet"></div><div class="sheet"></div><div class="sheet"><div class="cv-logo">Clean<span>Go</span></div></div>'}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let covering=false,booted=false,tid=0;
const curKey=()=>$('.view.on').id.slice(2);
const LANDING=['layanan','harga','cara','faq','artikel','kontak','promo','antar','mesin'];
const wantKey=()=>{const k=location.hash.slice(1)||'beranda';return (VIEWS[k]||LANDING.includes(k))?k:'beranda'};
function foam(n,delay=0){for(let i=0;i<n;i++)bubble(Math.random()*innerWidth,innerHeight+10,{size:14+Math.random()*42,rise:innerHeight*(.5+Math.random()*.6),dur:1100+Math.random()*700,delay:delay+Math.random()*260,spread:90})}
async function transition(){
 const id=++tid,ease='cubic-bezier(.7,0,.25,1)',sh=[...cv.children],N=sh.length,mn=$('main'),R=SHEET_ROT,ST=80;
 covering=true;
 cv.getAnimations({subtree:true}).forEach(a=>a.cancel());mn.getAnimations().forEach(a=>a.cancel());
 mn.style.transformOrigin=`50% ${scrollY+innerHeight/2}px`;
 cv.classList.add('on');
 try{
  foam(14);
  /* halaman lama mundur ke belakang, lembar-lembar menumpuk di atasnya */
  mn.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.92)',opacity:.55}],{duration:460+N*ST,easing:ease,fill:'forwards'});
  await Promise.all(sh.map((s,i)=>s.animate(
   [{transform:`translateY(110%) rotate(${R[i]+6}deg)`},{transform:`translateY(0) rotate(${R[i]}deg)`}],
   {duration:460,delay:i*ST,easing:ease,fill:'forwards'}).finished));
  covering=false;routeNow();
  mn.getAnimations().forEach(a=>a.cancel());
  mn.style.transformOrigin='50% 0';
  /* halaman baru maju ke depan saat tumpukan diangkat satu per satu */
  mn.animate([{transform:'scale(.92)',opacity:.55},{transform:'scale(1)',opacity:1}],{duration:520+N*ST,delay:120,easing:ease,fill:'backwards'});
  $('.view.on').animate([{transform:'translateY(26px)'},{transform:'translateY(0)'}],{duration:620,delay:260,easing:'ease-out',fill:'backwards'});
  await sleep(120);foam(10);
  await Promise.all(sh.map((s,i)=>s.animate(
   [{transform:`translateY(0) rotate(${R[i]}deg)`},{transform:`translateY(-112%) rotate(${R[i]-5}deg)`}],
   {duration:480,delay:(N-1-i)*ST,easing:ease,fill:'forwards'}).finished));
 }catch(e){return}
 if(id===tid){cv.getAnimations({subtree:true}).forEach(a=>a.cancel());cv.classList.remove('on')}
}
function route(){
 if(covering)return;
 if(redirecting){redirecting=false;routeNow();return}
 if(!booted||REDUCED||wantKey()===curKey()){booted=true;routeNow();return}
 transition();
}
/* ---------- dekorasi latar ---------- */
(function(){
 const S='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
 +'<symbol id="i-shirt" viewBox="0 0 64 64"><path d="M22 8 8 17l6 11 6-3v31h24V25l6 3 6-11L42 8c-2 5-6 8-10 8s-8-3-10-8z"/><path d="M26 24v26" stroke="#fff" stroke-width="3"/><circle cx="32" cy="24" r="1.4"/><circle cx="32" cy="32" r="1.4"/><circle cx="32" cy="40" r="1.4"/></symbol>'
 +'<symbol id="i-pants" viewBox="0 0 64 64"><path d="M19 6h26l5 52H36l-4-28-4 28H14z"/><path d="M19 14h26"/><path d="M23 20l-2 30" stroke="#fff" stroke-width="3"/></symbol>'
 +'<symbol id="i-drop" viewBox="0 0 64 64"><path d="M32 5C25 16 14 28 14 40a18 18 0 0 0 36 0C50 28 39 16 32 5z"/><path d="M23 41a9 9 0 0 0 6 8" fill="none" stroke="#fff" stroke-width="3"/></symbol>'
 +'<symbol id="i-wave" viewBox="0 0 64 64"><path d="M2 22q7-9 15 0t15 0 15 0 15 0" fill="none"/><path d="M2 36q7-9 15 0t15 0 15 0 15 0" fill="none"/><path d="M2 50q7-9 15 0t15 0 15 0 15 0" fill="none"/></symbol>'
 +'<symbol id="i-soap" viewBox="0 0 64 64"><rect x="6" y="28" width="52" height="26" rx="11"/><rect x="13" y="34" width="38" height="14" rx="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="20" cy="17" r="6" fill="rgba(188,234,244,.45)"/><circle cx="33" cy="9" r="3.5" fill="rgba(188,234,244,.45)"/><circle cx="45" cy="16" r="4.5" fill="rgba(188,234,244,.45)"/></symbol>'
 +'<symbol id="i-bubble" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26"/><path d="M17 27a16 16 0 0 1 11-12" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="45" cy="45" r="2.4" fill="#fff" stroke="none"/></symbol>'
 +'</defs></svg>';
 /* [simbol, kiri%, atas%, ukuran px, rotasi, sembunyikan di ponsel] */
 const D=[['shirt',3,12,96,-14],['drop',91,8,54,10,1],['bubble',80,22,74,0],['soap',90,46,100,16],['pants',2,46,86,12],
  ['bubble',11,72,54,0,1],['wave',20,86,104,-6],['drop',47,5,40,-8,1],['shirt',84,74,92,16],['soap',33,66,74,-18,1],
  ['bubble',58,88,48,0],['drop',68,58,46,14],['bubble',24,28,36,0,1],['pants',57,16,66,-16,1],['wave',72,38,92,4,1],
  ['bubble',95,90,36,0],['shirt',38,36,60,10,1],['drop',8,92,44,-10]];
 const el=document.createElement('div');el.id='decor';el.setAttribute('aria-hidden','true');
 el.innerHTML=S+D.map((d,i)=>`<i class="dc ${d[0]}${d[5]?' x':''}" style="left:${d[1]}%;top:${d[2]}%;width:calc(var(--k)*${d[3]}px);height:calc(var(--k)*${d[3]}px);--r:${d[4]}deg;--d:${(7+(i*1.7)%6).toFixed(1)}s;--dl:-${(i*1.3%7).toFixed(1)}s"><b><svg viewBox="0 0 64 64"><use href="#i-${d[0]}"/></svg></b></i>`).join('');
 document.body.insertBefore(el,document.body.firstChild);
 if(REDUCED)return;
 const its=[...el.querySelectorAll('.dc')];let tk=0;
 addEventListener('scroll',()=>{if(tk)return;tk=requestAnimationFrame(()=>{tk=0;const y=scrollY;
  its.forEach((e,i)=>e.style.translate=`${Math.sin(y/700+i)*14}px ${Math.sin(y/420+i*1.7)*34}px`)})},{passive:true});
})();
route();
/* logo 3D: berputar 360° mengikuti gerakan kursor di hero + ayunan pelan saat diam */
(()=>{const obj=document.querySelector('.l3-obj'),hero=document.querySelector('.hero');if(!obj||!hero)return;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const sh=document.querySelector('.l3-shadow');
 let spin=0,lastX=null,ty=0,cx=0,cy=0,last=0,vis=true;
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();
  /* kursor digeser selebar ~70% hero = satu putaran penuh */
  if(lastX!==null)spin+=(e.clientX-lastX)*360/(r.width*.7);
  lastX=e.clientX;ty=((e.clientY-r.top)/r.height-.5)*2;last=performance.now()});
 hero.addEventListener('pointerleave',()=>{lastX=null;ty=0});
 new IntersectionObserver(en=>{vis=en[0].isIntersecting;if(vis)requestAnimationFrame(tick)}).observe(hero);
 function tick(t){if(!vis)return;
  const idle=Math.sin(t/1700)*8*(performance.now()-last>2500?1:0), idleX=Math.sin(t/2300+1)*3.5;
  const ry=spin+idle, rx=-ty*9+idleX;
  cx+=(ry-cx)*.08;cy+=(rx-cy)*.07;
  obj.style.setProperty('--ry',cx.toFixed(2)+'deg');obj.style.setProperty('--rx',cy.toFixed(2)+'deg');
  if(sh){const a=cx*Math.PI/180;sh.style.setProperty('--sx',(-Math.sin(a)*20).toFixed(1)+'px');sh.style.setProperty('--ss',(.8+.2*Math.abs(Math.cos(a))).toFixed(3))}
  requestAnimationFrame(tick)}
 requestAnimationFrame(tick)})();
/* kata sandi hide/see + kolom angka */
document.addEventListener('click',e=>{const t=e.target.closest('.pwtog');if(!t)return;
 const i=t.parentElement.querySelector('input'),show=i.type==='password';
 i.type=show?'text':'password';t.setAttribute('aria-pressed',show);
 t.setAttribute('aria-label',show?'Sembunyikan kata sandi':'Tampilkan kata sandi');t.innerHTML=show?EYE_OFF:EYE});
document.addEventListener('input',e=>{const t=e.target;if(t.matches&&t.matches('input[data-digits]')){const v=t.value.replace(/\D/g,'');if(v!==t.value)t.value=v}});
/* efek scroll: tiap blok muncul terpotong + bergerak, naik maupun turun */
(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const SEL='.ttl,.grid>.card,.promo,details,.split>*,.kc,.panel,.stats>.card,.thanks,.courier',L=[];let raf=0;
 const check=()=>{raf=0;const vh=innerHeight;L.forEach(el=>{const r=el.getBoundingClientRect(),vis=r.height>0&&r.top<vh*.96&&r.bottom>0;
  if(vis){if(!el.classList.contains('in'))el.classList.add('in')}
  else if(el.classList.contains('in')||r.height>0){el.classList.remove('in');el.classList.toggle('up',r.bottom<=0)}})};
 const ask=()=>{if(!raf)raf=requestAnimationFrame(check)};
 const scan=()=>{document.querySelectorAll(SEL).forEach(el=>{
  if(el.dataset.rv||el.closest('.hero,#v-admin,#v-owner,header,footer'))return;
  el.dataset.rv=1;el.classList.add('rv');
  el.style.setProperty('--dly',Math.min([...el.parentElement.children].indexOf(el),5)*90+'ms');L.push(el)});ask()};
 addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);addEventListener('hashchange',()=>setTimeout(ask,50));
 let t;const m=document.querySelector('main');
 new MutationObserver(()=>{clearTimeout(t);t=setTimeout(scan,40)}).observe(m,{childList:true,subtree:true});
 new MutationObserver(ask).observe(m,{attributes:true,attributeFilter:['class'],subtree:true});
 scan()})();

/* gelembung hero & dekorasi: klik untuk meletuskannya dengan percikan */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const SEL='.hero-bubbles i,.dc.bubble';
 const INTER='a,button,input,select,textarea,label,summary,details,form';
 function burst(x,y,r){
  const ring=document.createElement('div');ring.className='pop-ring';
  ring.style.cssText=`left:${x-r}px;top:${y-r}px;width:${r*2}px;height:${r*2}px`;
  document.body.appendChild(ring);
  ring.animate([{transform:'scale(.3)',opacity:1},{transform:'scale(1.3)',opacity:0}],{duration:420,easing:'ease-out'}).finished.then(()=>ring.remove());
  for(let i=0;i<12;i++){
   const p=document.createElement('div');p.className='pop-spark';
   const s=2+Math.random()*5,a=Math.random()*Math.PI*2,d=r*(.9+Math.random()*1.4);
   p.style.cssText=`left:${x-s/2}px;top:${y-s/2}px;width:${s}px;height:${s}px`;
   document.body.appendChild(p);
   p.animate([{transform:'translate(0,0) scale(1)',opacity:1},
              {transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-r*.3}px) scale(.3)`,opacity:0}],
             {duration:520+Math.random()*260,easing:'cubic-bezier(.2,.7,.3,1)'}).finished.then(()=>p.remove());
  }
 }
 function pop(el){
  const R=el.getBoundingClientRect(),x=R.left+R.width/2,y=R.top+R.height/2,r=R.width/2;
  el.dataset.popped=1;
  const op=getComputedStyle(el).opacity;
  burst(x,y,r);
  /* gelembung membesar lalu hilang, lalu muncul lagi beberapa detik kemudian */
  el.animate([{transform:'scale(1)',opacity:op},{transform:'scale(1.35)',opacity:0}],{duration:110,easing:'ease-out',fill:'forwards'})
    .finished.then(a=>{el.style.visibility='hidden';a.cancel()});
  setTimeout(()=>{
   el.style.visibility='';delete el.dataset.popped;
   el.animate([{opacity:0},{opacity:op}],{duration:700,easing:'ease-out'});
  },3500+Math.random()*2000);
 }
 document.addEventListener('pointerdown',e=>{
  if(e.target.closest&&e.target.closest(INTER))return;
  let best=null,bd=Infinity;
  document.querySelectorAll(SEL).forEach(el=>{
   if(el.dataset.popped)return;
   const R=el.getBoundingClientRect();if(!R.width)return;
   const d=Math.hypot(e.clientX-(R.left+R.width/2),e.clientY-(R.top+R.height/2));
   if(d<=R.width/2*1.05&&d<bd){bd=d;best=el}
  });
  if(best)pop(best);
 },{passive:true});
})();

/* intro: tetesan bergerak lalu tulisan CleanGo saat website pertama dibuka */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const ov=document.createElement('div');ov.id='intro';ov.setAttribute('aria-hidden','true');
 const letters='CleanGo'.split('').map((c,i)=>`<span class="${i>4?'g':''}" style="animation-delay:${(1.05+i*.07).toFixed(2)}s">${c}</span>`).join('');
 ov.innerHTML='<div class="in-stage">'
  +'<svg class="in-drop" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5C25 16 14 28 14 40a18 18 0 0 0 36 0C50 28 39 16 32 5z"/></svg>'
  +'<div class="in-word"><div class="in-logo">'+letters+'</div><i class="in-bar"></i></div></div>';
 document.body.appendChild(ov);
 const hide=()=>{if(ov.classList.contains('done'))return;ov.classList.add('done');setTimeout(()=>ov.remove(),800)};
 ov.addEventListener('click',hide);
 setTimeout(hide,3000);
})();
