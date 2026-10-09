/* ---------- Quyết tâm: aura + ngọn lửa tăng theo chặng ---------- */
function setAura(lv){
  const size=170+lv*14;
  const aura=$('auraStage');
  aura.style.width=aura.style.height=size+'px';
  aura.style.opacity=Math.min(.35+lv*.05,.95);
  const mapAura=$('aura');
  if(mapAura){mapAura.style.width=mapAura.style.height=(100+lv*10)+'px';
    mapAura.style.left='50%';mapAura.style.top='62%';mapAura.style.transform='translate(-50%,-50%)';}
  $('flameCount').textContent=lv;
  const mh=$('mapHero'); if(mh) mh.style.height=(76+lv*3)+'px';
  const sh=$('stageHero'); if(sh) sh.style.height=(140+lv*6)+'px';
}

function renderHearts(popIndex=-1){
  $('hearts').innerHTML=Array.from({length:TOTAL_HP},(_,i)=>
    `<span class="${i<hp?'':'off'}${i===popIndex?' pop':''}">❤️</span>`).join('');
  $('stageLabel').textContent= stage<=TOTAL_STAGE?`Chặng ${stage}/${TOTAL_STAGE}`:'Chặng cuối!';
  setAura(Math.min(stage,TOTAL_STAGE));
}

/* ---------- Chặng đi rừng (đồ hoạ mới) ---------- */
function enterStage(){
  markMapProgress();renderHearts();
  placeHero(stage);sfx.walk();
  show('screen-stage');
  const hero=$('stageHero');
  const card=$('snakeCard');
  card.classList.remove('show','poof','defeated');
  $('snakeImg').src='assets/snake_1.jpg';           // rắn khiêu khích
  $('snakeBubble').textContent=['Hừm! Đố bé qua nổi! 🐍','Lại đây nào, bé con! 😜','Ta đói lắm rồi đấy! 🍖','Coi chừng nanh của ta! ⚠️'][stage%4];
  hero.classList.add('walk');
  setTimeout(()=>{
    hero.classList.remove('walk');
    card.classList.add('show');
    setTimeout(openQuiz,700);
  },950);
}

/* ---------- Trả lời ĐÚNG: lao vào đánh, rắn chết rồi tan biến ---------- */
function snakePoof(){
  const hero=$('stageHero'),card=$('snakeCard');
  hero.classList.add('lunge');sfx.slash();
  const fx=$('fxLayer');
  const p=document.createElement('div');
  p.className='fx-slash';p.textContent='⚔️💥';
  p.style.right='14%';p.style.bottom='34%';
  fx.appendChild(p);setTimeout(()=>p.remove(),550);
  setTimeout(()=>{
    hero.classList.remove('lunge');
    $('snakeImg').src='assets/snake_0.jpg';          // rắn chết xèo
    $('snakeBubble').textContent='Xừ... ta thua rồi... 💀';
    card.classList.add('defeated');
    sfx.correct();
    setTimeout(()=>{
      card.classList.add('poof');
      const q=document.createElement('div');
      q.className='fx-poof';q.textContent='💨✨';
      q.style.right='12%';q.style.bottom='30%';
      fx.appendChild(q);setTimeout(()=>q.remove(),750);
    },900);
  },480);
}

/* ---------- Trả lời SAI: rắn cắn, nhân vật biểu cảm đáng thương ---------- */
function snakeBite(){
  const hero=$('stageHero'),card=$('snakeCard'),ov=$('biteOverlay');
  card.classList.add('show');
  ov.classList.remove('hidden');                     // ảnh rắn cắn phủ lên
  hero.src='assets/hero_sad.png';                    // mặt lo lắng, đáng thương
  hero.classList.add('suffer');
  sfx.bite();
  const oldHp=hp;hp--;bites++;
  renderHearts(oldHp-1);
  $('biteCount').textContent=bites;
  const stamp=$('biteStamp');
  stamp.classList.remove('bitten');void stamp.offsetWidth;stamp.classList.add('bitten');
  const flash=$('biteFlash');
  flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on');
  const scene=document.querySelector('#screen-stage .scene');
  scene.classList.remove('shake');void scene.offsetWidth;scene.classList.add('shake');
  setTimeout(()=>{                                   // trở lại vẻ quyết tâm
    ov.classList.add('hidden');
    hero.src='assets/hero_happy.png';
    hero.classList.remove('suffer');
  },1400);
}