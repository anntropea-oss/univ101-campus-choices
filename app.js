(() => {
'use strict';
const $ = id => document.getElementById(id);
const KEY = 'univ101-campus-choices-v2';
const colors = ['#81d6c3','#ffd16b','#b9adff','#ffad92','#8ec9ff','#f4a4ce'];
let game = null, interval = null, remaining = 0, setupReturn = false;
function valid(s) {
 const isKey = k => typeof k === 'string' && /^[0-5]-[0-4]$/.test(k);
 if (!s || s.version!==2 || !Array.isArray(s.teams) || s.teams.length<2 || s.teams.length>6 || !s.teams.every(t=>t && typeof t.name==='string' && Number.isFinite(t.score))) return false;
 const scores = a => Array.isArray(a) && a.length===s.teams.length && a.every(Number.isFinite);
 const teamIndex = i => Number.isInteger(i) && i>=0 && i<s.teams.length;
 if (!Array.isArray(s.played) || !s.played.every(isKey) || new Set(s.played).size!==s.played.length || !Array.isArray(s.history) || !s.history.every(h=>h && isKey(h.key) && scores(h.before)) || ![0,15,30,60].includes(s.timer) || typeof s.penalties!=='boolean') return false;
 const a=s.active;
 return a===null || !!(a && isKey(a.key) && !s.played.includes(a.key) && scores(a.before) && typeof a.revealed==='boolean' && typeof a.started==='boolean' && (a.choice===null || (Number.isInteger(a.choice) && a.choice>=0 && a.choice<3)) && Array.isArray(a.wrong) && a.wrong.every(teamIndex) && (a.winner===null || teamIndex(a.winner)));
}
function save() {
 try { localStorage.setItem(KEY,JSON.stringify(game)); $('saveStatus').textContent='Progress saved on this browser'; }
 catch { $('saveStatus').textContent='Browser storage unavailable • keep this tab open'; }
}
function render() {
 $('teams').style.setProperty('--team-count', game.teams.length);
 $('teams').replaceChildren(...game.teams.map((t,i)=>{
  const el=document.createElement('div'); el.className='team';el.style.setProperty('--team-color',colors[i]);
  const name=document.createElement('span');name.className='team-name';name.textContent=t.name;
  const score=document.createElement('strong');score.className='score';score.textContent=t.score.toLocaleString();el.append(name,score);return el;
 }));
 $('board').replaceChildren(...QUIZ.map((cat,c)=>{
  const col=document.createElement('div');col.className='category';const title=document.createElement('h3');title.textContent=cat.title;col.append(title);
  cat.clues.forEach((_,r)=>{const key=`${c}-${r}`,played=game.played.includes(key),btn=document.createElement('button');btn.className='tile';btn.textContent=played?'✓':(r+1)*100;btn.disabled=played;btn.setAttribute('aria-label',`${cat.title}, ${(r+1)*100} points${played?', completed':''}`);btn.onclick=()=>openClue(key);col.append(btn);});return col;
 }));
 $('progress').textContent=`${game.played.length} / 30`;$('progressBar').style.width=`${game.played.length/30*100}%`;
 $('undo').disabled=!game.history.length || !!game.active;
 const learned=game.history.filter(h=>h.learned);
 $('toolkitCount').textContent=`${learned.length} idea${learned.length===1?'':'s'} collected`;
 $('toolkitCards').replaceChildren(...learned.map(h=>{const [c,r]=h.key.split('-').map(Number),m=QUIZ[c].clues[r];const item=document.createElement('article'),title=document.createElement('h3'),note=document.createElement('p');title.textContent=m.title;note.textContent=m.takeaway;item.append(title,note);return item;}));
 $('results').hidden=game.played.length!==30;
 if(game.played.length===30){const max=Math.max(...game.teams.map(t=>t.score)),winners=game.teams.filter(t=>t.score===max).map(t=>t.name);$('winner').textContent=winners.length===1?`${winners[0]} wins with ${max.toLocaleString()} points!`:`A tie: ${winners.join(' & ')} • ${max.toLocaleString()} points` ;}
}
function names() {
 const existing=[...$('nameFields').querySelectorAll('input')].map(x=>x.value);
 $('nameFields').replaceChildren(...Array.from({length:Number($('teamCount').value)},(_,i)=>{const label=document.createElement('label');label.textContent=`Team ${i+1}`;const input=document.createElement('input');input.type='text';input.maxLength=30;input.required=true;input.value=existing[i]||`Team ${i+1}`;input.setAttribute('aria-label',`Name for team ${i+1}`);label.append(input);return label;}));
}
function setup() {names();$('cancelSetup').hidden=!game;setupReturn=!!game;$('setup').showModal();}
$('teamCount').onchange=names;
$('setupForm').onsubmit=e=>{
 e.preventDefault();const teams=[...$('nameFields').querySelectorAll('input')].map((x,i)=>({name:x.value.trim()||`Team ${i+1}`,score:0}));
 game={version:2,teams,timer:Number($('timerSetting').value),penalties:$('penalties').checked,played:[],history:[],active:null};$('setup').close();save();render();
};
$('setup').addEventListener('cancel',e=>{if(!setupReturn)e.preventDefault();});
$('cancelSetup').onclick=()=>$('setup').close();
function stopTimer(){if(interval!==null)clearInterval(interval);interval=null;}
function updateTimer(){ $('timerDisplay').textContent=game.timer?`${remaining}s`:''; }
function openClue(key, restored=false) {
 stopTimer();
 if(!restored){game.active={key,before:game.teams.map(t=>t.score),wrong:[],winner:null,revealed:false,started:false,choice:null};save();}
 const [c,r]=key.split('-').map(Number),clue=QUIZ[c].clues[r];
 $('clueCategory').textContent=QUIZ[c].title;$('clueValue').textContent=`${(r+1)*100} points`;
 $('missionTitle').textContent=clue.title;$('lessonText').textContent=clue.lesson;$('clueText').textContent=clue.scenario;
 $('answerText').textContent=`${String.fromCharCode(65+clue.correct)} · ${clue.options[clue.correct][0]}`;
 $('teachingNote').textContent=clue.takeaway;$('discussionPrompt').textContent=clue.discussion;
 $('source').textContent=`Primary source: AY 26–27 UNIV 101 Updates • slides ${clue.slides}. Scenarios and discussion activities adapted for classroom teaching.`;
 $('referenceLinks').replaceChildren(...clue.links.map(([label,url])=>{const p=document.createElement('p'),link=document.createElement('a');link.textContent=label;link.href=url;link.target='_blank';link.rel='noopener noreferrer';p.append(link);return p;}));
 $('methodExplorer').hidden=!clue.cards;
 $('methodCards').replaceChildren(...(clue.cards||[]).map(([title,text])=>{const card=document.createElement('details'),heading=document.createElement('summary'),note=document.createElement('p');heading.textContent=title;note.textContent=text;card.append(heading,note);return card;}));
 $('clueDialog').querySelector('.references').open=false;
 remaining=game.timer;$('timerMessage').textContent='';updateTimer();$('timerButton').textContent='Start timer';
 showAnswerState();$('clueDialog').showModal();
}
function currentMission(){const [c,r]=game.active.key.split('-').map(Number);return QUIZ[c].clues[r];}
function showAnswerState(){
 const a=game.active,clue=currentMission();
 $('learnPanel').hidden=a.started;$('challengePanel').hidden=!a.started||a.revealed;
 $('answerPanel').hidden=!a.revealed;$('timerButton').hidden=!game.timer||a.revealed;
 $('timerDisplay').hidden=!game.timer;
 $('back').hidden=a.wrong.length>0||a.winner!==null;
 $('finish').textContent=a.revealed?'Finish mission →':'Skip mission →';
 ['stepLearn','stepDecide','stepDiscuss'].forEach((id,i)=>{const stage=a.revealed?2:a.started?1:0;$(id).classList.toggle('current',i===stage);if(i===stage)$(id).setAttribute('aria-current','step');else $(id).removeAttribute('aria-current');});
 $('choices').replaceChildren(...clue.options.map(([text],i)=>{
  const btn=document.createElement('button');btn.className='choice';btn.textContent=`${String.fromCharCode(65+i)} · ${text}`;
  btn.setAttribute('aria-pressed',String(a.choice===i));btn.onclick=()=>{a.choice=i;save();showAnswerState();$('choices').children[i].focus();};return btn;
 }));
 $('choiceResult').textContent=a.choice===null?'Compare the reasoning behind all three choices.':a.choice===clue.correct?'Your marked choice fits. Explain the reasoning in your own words.':'Your marked choice opens a useful discussion. Compare it with the best next move below.';
 $('feedback').replaceChildren(...clue.options.map(([text,explanation],i)=>{
  const item=document.createElement('div');item.className='feedback-item';if(i===clue.correct)item.classList.add('best');
  const title=document.createElement('strong');title.textContent=`${String.fromCharCode(65+i)} · ${text}`;
  const note=document.createElement('p');note.textContent=explanation;item.append(title,note);return item;
 }));
 renderJudging();
}
$('startChallenge').onclick=()=>{game.active.started=true;save();showAnswerState();$('choices').children[0].focus();};

function renderJudging(){
 const a=game.active,value=(Number(a.key.split('-')[1])+1)*100;
 $('judging').replaceChildren(...game.teams.map((t,i)=>{
  const row=document.createElement('div');row.className='judge-row';const name=document.createElement('span');name.textContent=t.name;
  const buttons=document.createElement('div');const right=document.createElement('button'),wrong=document.createElement('button');
  right.textContent=a.winner===i?'✓ Awarded':`Correct +${value}`;wrong.textContent=a.wrong.includes(i)?'Incorrect recorded':game.penalties?`Incorrect −${value}`:'Incorrect (no loss)';
  right.disabled=a.winner!==null||a.wrong.includes(i);wrong.disabled=right.disabled;
  right.onclick=()=>judge(i,true);wrong.onclick=()=>judge(i,false);buttons.append(right,wrong);row.append(name,buttons);return row;
 }));
}
function judge(i,correct){
 const a=game.active;if(!a.revealed||a.winner!==null||a.wrong.includes(i))return;
 const value=(Number(a.key.split('-')[1])+1)*100;
 if(correct){game.teams[i].score+=value;a.winner=i;}else{a.wrong.push(i);if(game.penalties)game.teams[i].score-=value;}
 save();render();showAnswerState();
}
$('timerButton').onclick=()=>{
 if(!game.active.started||game.active.revealed)return;
 if(interval!==null){stopTimer();$('timerButton').textContent='Resume timer';return;}
 if(remaining===0)remaining=game.timer;
 const end=Date.now()+remaining*1000;$('timerMessage').textContent='';$('timerButton').textContent='Pause timer';
 interval=setInterval(()=>{remaining=Math.max(0,Math.ceil((end-Date.now())/1000));updateTimer();if(remaining===0){stopTimer();$('timerButton').textContent='Restart timer';$('timerMessage').textContent='Time’s up • host decides when to reveal';}},150);
};
function reveal(){if(!game?.active||!game.active.started||game.active.revealed)return;stopTimer();game.active.revealed=true;$('timerButton').hidden=true;save();showAnswerState();$('answerText').tabIndex=-1;$('answerText').focus();}
$('reveal').onclick=reveal;
function finish(){const a=game.active;stopTimer();game.history.push({key:a.key,before:a.before,learned:a.revealed});game.played.push(a.key);game.active=null;$('clueDialog').close();save();render();focusTile(a.key);}
function focusTile(key){const [c,r]=key.split('-').map(Number);const column=$('board').children[c];const tile=column?.children[r+1];if(tile&&!tile.disabled)tile.focus();else $('undo').focus();}
function back(){const a=game.active;if(!a)return;if(a.wrong.length||a.winner!==null){finish();return;}stopTimer();game.active=null;$('clueDialog').close();save();render();focusTile(a.key);}
$('finish').onclick=finish;$('back').onclick=back;
$('clueDialog').addEventListener('cancel',e=>{e.preventDefault();if(game.active.wrong.length||game.active.winner!==null){$('finish').focus();return;}back();});
$('undo').onclick=()=>{if(game.active||!game.history.length)return;const h=game.history.pop();game.played=game.played.filter(k=>k!==h.key);game.teams.forEach((t,i)=>t.score=h.before[i]);save();render();focusTile(h.key);};
$('help').onclick=()=>$('helpDialog').showModal();$('closeHelp').onclick=()=>$('helpDialog').close();
$('newGame').onclick=()=>$('resetDialog').showModal();$('cancelReset').onclick=()=>$('resetDialog').close();$('confirmReset').onclick=()=>{$('resetDialog').close();setup();};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Use browser full screen';}};

try{const stored=JSON.parse(localStorage.getItem(KEY));if(valid(stored))game=stored;}catch{}
if(game){render();save();if(game.active)openClue(game.active.key,true);}else{game={version:2,teams:[{name:'Team 1',score:0},{name:'Team 2',score:0},{name:'Team 3',score:0}],timer:0,penalties:false,played:[],history:[],active:null};render();game=null;setup();}
})();
