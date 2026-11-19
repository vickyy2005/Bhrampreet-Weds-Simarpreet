const $=s=>document.querySelector(s);document.body.classList.add('locked');
const audio=$('#audio');async function playMusic(){try{await audio.play();$('#music').setAttribute('aria-label','Pause background music');$('#music span').textContent='Music on'}catch{$('#music span').textContent='Music off'}}
$('#begin').onclick=()=>{$('#gate').classList.add('closed');$('#gate').inert=true;document.body.classList.remove('locked');$('.hero h1').focus({preventScroll:true});playMusic()};
$('#music').onclick=()=>{if(audio.paused)playMusic();else{audio.pause();$('#music').setAttribute('aria-label','Play background music');$('#music span').textContent='Music off'}};
const captions=['A moment, just us','Where our hearts meet','Together is a beautiful place','Under the city lights','A little joy, a little love','A promise to keep','Our everyday kind of magic','Every adventure, together','A lifetime of celebrations'];let photo=0;
// Persistent prints keep their identity, tilt and dimensions throughout a slide.
const track=$('.gallery-track'),mobileGallery=matchMedia('(max-width:600px)');
let position=3,sliding=false,galleryAnimation=null;
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
function galleryX(index=position){const visible=mobileGallery.matches?1:3;return -(index-(visible-1)/2)*$('.gallery').clientWidth/visible}
function updateGallery(){
  photo=(position-3+9)%9;
  $('#photo-count').textContent=`${String(photo+1).padStart(2,'0')} / 09`;
  [...track.children].forEach((card,index)=>{const visible=Math.abs(index-position)<=(mobileGallery.matches?0:1);card.tabIndex=visible?0:-1;card.setAttribute('aria-hidden',String(!visible))});
}
function gallery(){
  for(let index=0;index<15;index++){
    const i=(index-3+9)%9,b=document.createElement('button');
    b.className='photo';b.dataset.photo=String(i);b.style.setProperty('--print-tilt',`${[-1.3,.8,-.5,1.1,-.8,.5,-1,.7,-.4][i]}deg`);
    b.setAttribute('aria-label',`Open photograph ${i+1}: ${captions[i]}`);
    const img=new Image();img.src=i===0?"assets/moment-1-new.png":i===6?"assets/moment-7-new.png":`assets/moment-${i+1}.jpg`;img.alt=`Bhrampreet and Simarpreet — ${captions[i]}`;img.draggable=false;img.width=500;img.height=500;
    const caption=document.createElement('span');caption.textContent=captions[i];b.append(img,caption);
    b.onclick=()=>{$('#lightbox img').src=img.src;$('#lightbox').classList.toggle('upright-photo',i===7);$('#lightbox img').alt=img.alt;$('#lightbox-caption').textContent=caption.textContent;$('#lightbox').showModal()};track.append(b);
  }
  track.style.transform=`translate3d(${galleryX()}px,0,0)`;updateGallery();
}
function finishSlide(next){
  position=next;if(position<3)position+=9;if(position>11)position-=9;
  track.style.transform=`translate3d(${galleryX()}px,0,0)`;
  if(galleryAnimation){galleryAnimation.cancel();galleryAnimation=null}
  sliding=false;$('#prev').disabled=$('#next').disabled=false;updateGallery();
}
function slide(direction){
  if(sliding)return;sliding=true;$('#prev').disabled=$('#next').disabled=true;
  const next=position+direction;
  if(reducedMotion.matches){finishSlide(next);return}
  galleryAnimation=track.animate([{transform:`translate3d(${galleryX()}px,0,0)`},{transform:`translate3d(${galleryX(next)}px,0,0)`}],{duration:850,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
  galleryAnimation.finished.then(()=>finishSlide(next)).catch(()=>{});
}
$('#prev').onclick=()=>slide(-1);$('#next').onclick=()=>slide(1);
new ResizeObserver(()=>{if(sliding)finishSlide(position);else{track.style.transform=`translate3d(${galleryX()}px,0,0)`;updateGallery()}}).observe($('.gallery'));
$('#close-photo').onclick=()=>$('#lightbox').close();$('#lightbox').onclick=e=>{if(e.target===$('#lightbox'))$('#lightbox').close()};gallery();
document.querySelectorAll('#celebrations article.event').forEach(card=>{
  card.addEventListener('click',e=>{
    if(e.target.closest('a'))return;
    const cardImg=card.dataset.card,cardTitle=card.dataset.title;
    if(cardImg){
      $('#lightbox img').src=cardImg;
      $('#lightbox').classList.add('upright-photo');
      $('#lightbox img').alt=cardTitle;
      $('#lightbox-caption').textContent=cardTitle;
      $('#lightbox').showModal();
    }
  });
});

// Scratch away the actual paper layer; the only content below it is the date.
const canvas=$('#scratch'),ctx=canvas.getContext('2d',{willReadFrequently:true});
let drawing=false,revealed=false,lastPoint=null,strokeCount=0,initialAlpha=0,paperReady=false;
const cover=new Image();cover.src='assets/scratch-paper.png';
function drawScratchCover(){
  if(revealed||strokeCount)return;
  ctx.clearRect(0,0,1000,500);ctx.globalCompositeOperation='source-over';
  if(cover.complete&&cover.naturalWidth){ctx.drawImage(cover,0,0,1000,500);paperReady=true}
  else{ctx.fillStyle='#64272d';ctx.fillRect(0,0,1000,500)}
  ctx.textAlign='center';ctx.fillStyle='#efdbb4';ctx.font='58px "Pinyon Script", cursive';ctx.fillText('A little secret awaits',520,220);
  ctx.font='500 17px "DM Sans", sans-serif';ctx.letterSpacing='3px';ctx.fillText('SCRATCH TO REVEAL',520,285);ctx.letterSpacing='0px';
  ctx.strokeStyle='#d7b988';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(390,322);ctx.lineTo(650,322);ctx.stroke();
  const pixels=ctx.getImageData(0,0,1000,500).data;initialAlpha=0;for(let i=3;i<pixels.length;i+=64)initialAlpha+=pixels[i];
}
cover.onload=drawScratchCover;cover.onerror=drawScratchCover;drawScratchCover();document.fonts.ready.then(drawScratchCover);
function reveal(){if(revealed)return;revealed=true;drawing=false;canvas.classList.add('revealed');canvas.style.pointerEvents='none';$('.scratch-card').classList.add('is-revealed');celebratePetals();$('#reveal-button').hidden=true;canvas.setAttribute('aria-label','Wedding day: 17 February 2027')}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1000/r.width,y:(e.clientY-r.top)*500/r.height}}
function scratch(e){
  if(!drawing||revealed)return;
  const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=64;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(lastPoint?.x??p.x,lastPoint?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,32,0,Math.PI*2);ctx.fill();
  // Small irregular fibres soften the boundary of each torn-away stroke.
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*33,p.y+Math.sin(a)*33,2+(i%3),0,Math.PI*2);ctx.fill()}
  lastPoint=p;strokeCount++;
  if(strokeCount%12===0){const pixels=ctx.getImageData(0,0,1000,500).data;let remaining=0;for(let i=3;i<pixels.length;i+=64)remaining+=pixels[i];if(initialAlpha&&remaining/initialAlpha<.48)reveal()}
}
canvas.onpointerdown=e=>{if(revealed)return;drawing=true;lastPoint=point(e);canvas.setPointerCapture(e.pointerId);scratch(e)};
canvas.onpointermove=scratch;canvas.onpointerup=canvas.onpointercancel=()=>{drawing=false;lastPoint=null};$('#reveal-button').onclick=reveal;

const target=new Date('2027-02-17T11:00:00+05:30').getTime();
const clock=$('#clock'),clockLabels=['Days','Hours','Minutes','Seconds'];
const clockUnits=clockLabels.map(label=>{const unit=document.createElement('div');unit.className='clock-unit';const digits=document.createElement('div');digits.className='clock-digits';digits.setAttribute('aria-hidden','true');const caption=document.createElement('span');caption.className='clock-label';caption.textContent=label;unit.append(digits,caption);clock.append(unit);return{unit,digits,label}});
function createDigit(value){
  const el=document.createElement('div');el.className='flip-digit';el.dataset.value=value;
  for(const cls of ['top-static','bottom-static','top-moving','bottom-moving']){const leaf=document.createElement('div');leaf.className=`flip-leaf ${cls}`;const number=document.createElement('b');number.textContent=value;leaf.append(number);el.append(leaf)}
  return el;
}
function setDigit(el,next,animate){
  const old=el.dataset.value;if(old===next)return;el.dataset.value=next;
  el.classList.remove('flipping');
  el.querySelector('.top-static b').textContent=next;el.querySelector('.bottom-static b').textContent=old;
  el.querySelector('.top-moving b').textContent=old;el.querySelector('.bottom-moving b').textContent=next;
  if(!animate||reducedMotion.matches){el.querySelector('.bottom-static b').textContent=next;return}
  // Reflow starts a fresh half-turn only for the digits whose value changed.
  void el.offsetWidth;el.classList.add('flipping');
  clearTimeout(el.flipTimer);el.flipTimer=setTimeout(()=>{el.querySelector('.bottom-static b').textContent=next;el.classList.remove('flipping')},760);
}
let clockInitialized=false;
function tick(){
  const seconds=Math.max(0,Math.floor((target-Date.now())/1000));
  const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
  clockUnits.forEach((unit,i)=>{const value=String(values[i]).padStart(2,'0');
    if(unit.digits.children.length!==value.length){unit.digits.replaceChildren(...[...value].map(createDigit))}
    else [...unit.digits.children].forEach((digit,index)=>setDigit(digit,value[index],clockInitialized));
    unit.unit.setAttribute('aria-label',`${values[i]} ${unit.label.toLowerCase()}`);
  });
  clockInitialized=true;
}
tick();setInterval(tick,1000);

const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch{return null}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};const guest=$('#guests');$('#minus').onclick=()=>guest.value=Math.max(1,Number(guest.value||1)-1);$('#plus').onclick=()=>guest.value=Math.min(20,Number(guest.value||1)+1);
const eventInputs=[...document.querySelectorAll('[name=events]')];eventInputs.forEach(c=>c.onchange=()=>{if(c.id==='unable'&&c.checked)eventInputs.filter(x=>x!==c).forEach(x=>x.checked=false);else if(c.checked)$('#unable').checked=false});
function fillRsvp(){const r=store.get('vintage-rsvp');if(r){$('#name').value=r.name;guest.value=r.guests;eventInputs.forEach(c=>c.checked=r.events.includes(c.value));$('#rsvp-status').textContent='Your previous response is shown above.'}}fillRsvp();
$('#rsvp-form').onsubmit=e=>{
 e.preventDefault();const name=$('#name').value.trim(),events=eventInputs.filter(x=>x.checked).map(x=>x.value);
 if(!name||!events.length){$('#rsvp-status').textContent='Please enter your name and select an event or indicate that you cannot attend.';return}
 const count=Number(guest.value);if(!Number.isInteger(count)||count<1||count>20)return;
 try{store.set('vintage-rsvp',{name,guests:count,events})}catch{}
 const attending=!events.includes('Unable to attend');
 const lines=['Wedding RSVP — Bhrampreet & Simarpreet','','Guest name: '+name,'Attendance: '+(attending?'Attending':'Unable to attend'),'Number of guests: '+(attending?count:0)];
 if(attending){
  lines.push('','Events attending:');
  document.querySelectorAll('#celebrations article.event').forEach(card=>{
   const title=card.querySelector('h3').textContent.trim();if(!events.includes(title))return;
   const date=card.querySelector('.event-date').textContent.trim().replace(/^\w+, (\w+) (\d+), (\d+)$/,'$2 $1 $3');
   lines.push('',title+' — '+date);
   card.querySelectorAll('.event-program > div').forEach(row=>lines.push(row.querySelector('dt').textContent.trim()+': '+row.querySelector('dd').textContent.trim()));
   const venue=card.querySelector('.event-venue');if(venue)lines.push('Venue: '+venue.textContent.trim());
  });
 }
 const message=lines.join('\n');
 const url='https://wa.me/919356334333?text='+encodeURIComponent(message);
 $('#rsvp-status').replaceChildren(document.createTextNode('Tap Send in WhatsApp to deliver your RSVP. '));
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent='Open WhatsApp';$('#rsvp-status').append(link);
 window.open(url,'_blank','noopener');
};
$('#clear').onclick=()=>{try{localStorage.removeItem('vintage-rsvp')}catch{}$('#rsvp-form').reset();$('#rsvp-status').textContent='Response cleared.'};
$('#wish-message').oninput=()=>$('#char-count').textContent=`${$('#wish-message').value.length} / 200`;
let allWishes=[],wishIndex=0;
function showWishes(){
 const host=$('#saved-wishes');host.replaceChildren();
 if(!allWishes.length){const empty=document.createElement('p');empty.className='wishes-empty';empty.textContent='Be the first to leave a little wish.';host.append(empty);return}
 const stack=document.createElement('div');stack.className='wish-stack';
 const card=document.createElement('blockquote');card.className='guest-wish';
 const flower=document.createElement('span');flower.className='wish-flower';flower.textContent='❧';flower.setAttribute('aria-hidden','true');
 const p=document.createElement('p'),cite=document.createElement('cite');p.textContent=allWishes[wishIndex].message;cite.textContent=allWishes[wishIndex].name;card.append(flower,p,cite);stack.append(card);
 const nav=document.createElement('div');nav.className='wish-navigation';
 const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');
 previous.type=next.type='button';previous.textContent='←';next.textContent='→';previous.setAttribute('aria-label','Previous wish');next.setAttribute('aria-label','Next wish');
 previous.disabled=next.disabled=allWishes.length<2;
 previous.onclick=()=>{wishIndex=(wishIndex-1+allWishes.length)%allWishes.length;showWishes()};next.onclick=()=>{wishIndex=(wishIndex+1)%allWishes.length;showWishes()};
 counter.textContent=String(wishIndex+1).padStart(2,'0')+' / '+String(allWishes.length).padStart(2,'0');counter.setAttribute('aria-live','polite');nav.append(previous,counter,next);host.append(stack,nav);
}
async function loadWishes(){try{const response=await fetch('/api/wishes');if(!response.ok)throw Error();const data=await response.json();allWishes=data.wishes||[];wishIndex=Math.min(wishIndex,Math.max(0,allWishes.length-1));showWishes()}catch{allWishes=store.get('local-wishes')||[];wishIndex=0;showWishes()}}
loadWishes();
$('#wish-form').onsubmit=async e=>{
 e.preventDefault();const name=$('#wish-name').value.trim(),message=$('#wish-message').value.trim();if(!name||!message)return;
 const button=$('#wish-form button[type=submit]');button.disabled=true;$('#wish-status').textContent='Saving your wish…';
 try{const response=await fetch('/api/wishes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,message})});if(!response.ok)throw Error();const data=await response.json();allWishes=[data.wish,...allWishes]}catch{const newWish={name,message};allWishes=[newWish,...allWishes];try{store.set('local-wishes',allWishes)}catch{}}finally{wishIndex=0;showWishes();$('#wish-form').reset();$('#char-count').textContent='0 / 200';$('#wish-status').textContent='Your wish is saved. Thank you for the love!';button.disabled=false}
};

// Bounded decorative particles; no pointer interception or motion when reduced motion is requested.
function makePetals(host,count,burst=false){
  if(reducedMotion.matches)return null;
  const layer=document.createElement('div');layer.className='petal-layer'+(burst?' petal-burst':'');layer.setAttribute('aria-hidden','true');
  for(let i=0;i<count;i++){const p=document.createElement('i');p.className='falling-petal';p.style.cssText=`left:${(i*37.7)%100}%;--drift:${(i%2?1:-1)*(24+i%5*17)}px;--turn:${180+i%4*95}deg;--duration:${burst?3.8+i%5*.4:9+i%7}s;--delay:${burst?i*.065:-i*.83}s;--size:${7+i%5*2}px`;layer.append(p)}
  host.append(layer);return layer;
}
function celebratePetals(){const layer=makePetals(document.body,36,true);if(layer)setTimeout(()=>layer.remove(),8500)}
const heroPetals=makePetals($('.hero'),22);const gatePetals=makePetals($('#gate'),14);
if('IntersectionObserver' in window){new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-paused',!e.isIntersecting)),{threshold:0}).observe($('.hero'))}
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)document.querySelectorAll('.petal-layer').forEach(e=>e.remove())});
