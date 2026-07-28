let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.createElement('button');
  btn.textContent = '📱 Instal·la l\'App';
  btn.className = 'btn btn-sec';
  btn.style.position = 'fixed';
  btn.style.bottom = '80px';
  btn.style.right = '20px';
  btn.style.zIndex = '999';
  btn.onclick = () => {
    deferredPrompt.prompt();
    btn.remove();
  };
  document.body.appendChild(btn);
});

// main.js - RPG Món de Girona - Versió Girona
let musicaActivada = true;
let BIBLIOTECA_EMOJIS_BASE = [];
let FRASES_MINIJOC = [];
let FRASES_MIXTAS = [];
let CATEGORIES_EMOJI = {};
let EMOJIS_JUGABLES = [];

const EMOJIS_STARTER = [
  {emoji: "😀", nom_cat: "Somriure", categoria: "emocio", para_frases: ["riu", "content"], genere: "m"},
  {emoji: "😊", nom_cat: "Feliç", categoria: "emocio", para_frases: ["feliç", "content"], genere: "m"},
  {emoji: "😂", nom_cat: "Riure", categoria: "emocio", para_frases: ["riure", "riure"], genere: "m"},
  {emoji: "👨", nom_cat: "Home", categoria: "persona", para_frases: ["home", "pare"], genere: "m"},
  {emoji: "👩", nom_cat: "Dona", categoria: "persona", para_frases: ["dona", "mare"], genere: "f"},
  {emoji: "🐶", nom_cat: "Gos", categoria: "animal", para_frases: ["gos", "gosset"], genere: "m"},
  {emoji: "🏠", nom_cat: "Casa", categoria: "lloc", para_frases: ["casa", "casa meva"], genere: "f"},
  {emoji: "🍎", nom_cat: "Poma", categoria: "menjar", para_frases: ["poma", "fruita"], genere: "f"},
  {emoji: "🚗", nom_cat: "Cotxe", categoria: "transport", para_frases: ["cotxe", "anar"], genere: "m"},
  {emoji: "⚽", nom_cat: "Futbol", categoria: "esport", para_frases: ["futbol", "jugar"], genere: "m"}
];

let estat = {
  monedes: parseInt(localStorage.getItem('cat_monedes')) || 0,
  capitolsCompletats: JSON.parse(localStorage.getItem('cat_completats')) || [],
  objectes: JSON.parse(localStorage.getItem('cat_objectes')) || [],
  rutesDesbloquejades: JSON.parse(localStorage.getItem('cat_rutes')) || [],
  capitols100Counts: JSON.parse(localStorage.getItem('cat_capitols100')) || {},
  stats: { seny: parseInt(localStorage.getItem('cat_seny')) || 0, rauxa: parseInt(localStorage.getItem('cat_rauxa')) || 0, arrel: parseInt(localStorage.getItem('cat_arrel')) || 0, obert: parseInt(localStorage.getItem('cat_obert')) || 0 },
  totem: localStorage.getItem('cat_totem') || 'neutral',
  personatge: JSON.parse(localStorage.getItem('cat_personatge')) || null,
  capitolActual: null,
  pasActual: 0,
  fallades: JSON.parse(localStorage.getItem('cat_fallades')) || [],
  falladesCapitol: 0,
  bloquejat: false,
  compres: JSON.parse(localStorage.getItem('cat_compres')) || [],
  emojisDesbloquejats: JSON.parse(localStorage.getItem('cat_emojis')) || ['😀','😊','😂','👨','👩','🐶','🏠','🍎','🚗','⚽'],
  packs_botiga: [],
  minijoc: {fraseObjectiu: null, emojisTriats: [], emojisDisponibles: [], modo: 'corta'}
};

const LANGS = {
  es: {app_titol: "RPG Món de Girona", monedes: "Monedas", tab_mapa: "Món Girona", tab_missio: "Missió", tab_gremi: "Gremi", tab_botiga: "Botiga", text_mon: "🗺️ Mapa de Girona", text_botiga: "🛒 Botiga de Girona", entrar: "Entrar", bloquejat: "Bloqueado", completat: "Completado", repetir: "Repetir", volver_mapa: "Volver al mapa", mision_completada: "¡Misión completada!", item_desbloquejat: "¡Item desbloqueado!", ruta_secreta: "Ruta secreta desbloquejada!", repas_rapido: "Repàs Ràpid", repas_titulo: "Repàs Ràpid - 5 Preguntes", tria_personatge: "Tria el teu personatge", nom_personatge: "Com et dius?", canviar_personatge: "Canviar Personatge", biblioteca: "Biblioteca", biblioteca_desc: "Llegendes i secrets de Girona", biblioteca_cta: "💡 Compra packs a la botiga i desbloqueja Girona!", minijoc_titol: "Arma la frase", minijoc_desc: "Tria els emojis per formar la frase", comprovar: "Comprovar", correcte: "Correcte!", incorrecte: "No és així. Era:", no_prou_monedes: "No tens prou monedes!", comprat: "Comprat", desbloqueja_ruta: "Amb 3 ítems del capítol {n} desbloqueges la ruta secreta de {ciutat}", no_frases_disponibles: "Compra més emojis per desbloquejar frases!"},
  ca: {app_titol: "RPG Món de Girona", monedes: "Monedes", tab_mapa: "Món Girona", tab_missio: "Missió", tab_gremi: "Gremi", tab_botiga: "Botiga", text_mon: "🗺️ Mapa de Girona - 2000 anys d'història", text_botiga: "🛒 Botiga del Barri Vell", entrar: "Entrar", bloquejat: "Bloquejat", completat: "Completat", repetir: "Repetir", volver_mapa: "Tornar al mapa", mision_completada: "Missió completada!", item_desbloquejat: "Item desbloquejat!", ruta_secreta: "Ruta secreta desbloquejada!", repas_rapido: "Repàs Ràpid", repas_titulo: "Repàs Ràpid - 5 Preguntes", tria_personatge: "Tria el teu personatge", nom_personatge: "Com et dius?", canviar_personatge: "Canviar Personatge", biblioteca: "Biblioteca", biblioteca_desc: "Llegendes i secrets de Girona - Call, Lleona, Flors...", biblioteca_cta: "💡 Compra packs d'emoji a la botiga i desbloqueja tota Girona!", minijoc_titol: "Arma la frase", minijoc_desc: "Tria els emojis per formar la frase", comprovar: "Comprovar", correcte: "Correcte!", incorrecte: "No és així. Era:", no_prou_monedes: "No tens prou monedes!", comprat: "Comprat", desbloqueja_ruta: "Amb 3 ítems del capítol {n} desbloqueges la ruta secreta de {ciutat}", no_frases_disponibles: "Compra més emojis per desbloquejar frases!"}
};

let idioma = localStorage.getItem('cat_idioma') || 'ca';
let LANG = LANGS[idioma];

const PERSONATGES_JUGADOR = [
  {id: 'joven', emoji: '👦', nom: 'Joven'},
  {id: 'jova', emoji: '👧', nom: 'Jova'},
  {id: 'noi', emoji: '👦', nom: 'Noi'},
  {id: 'noia', emoji: '👧', nom: 'Noia'},
  {id: 'home', emoji: '👨', nom: 'Home'},
  {id: 'dona', emoji: '👩', nom: 'Dona'}
];

const NIVELL_MINIJOC = {minEmojis: 2, maxEmojis: 5, nivelActual: parseInt(localStorage.getItem('cat_nivell_minijoc')) || 1};

// MON GIRONA - 4 Capitols, mateixa estructura que abans
const CAPITOLS = [
  {id: "capitol_01_forca_vella", nom: "Força Vella - Gerunda", icona: "🏛️", desbloquejat: true, desc: `Gerunda Romana. Via Augusta.
2000 anys sota els teus peus 🏛️`, archivo: "capitol_01_forca_vella.json", recompensa_100: {item_id: "pedra_gerunda", ruta: "ruta_forca_secreta"}},
  {id: "capitol_02_temps_flors", nom: "Temps de Flors", icona: "🌸", desbloquejat: false, desc: "113 espais. Flors al Barri Vell.\nCatalà lent, de poble.", archivo: "capitol_02_temps_flors.json", requereix: "capitol_01_forca_vella", recompensa_100: {item_id: "flor_suprema_temps_flors", ruta: "ruta_girona_muralla_viva"}},
  {id: "capitol_03_call_jueu", nom: "El Call Jueu", icona: "✡️", desbloquejat: false, desc: "El Call més ben conservat.\nCàbala i misteri jueu.", archivo: "capitol_03_call_jueu.json", requereix: "capitol_02_temps_flors", recompensa_100: {item_id: "llibre_cabala", ruta: "ruta_call_secret"}},
  {id: "capitol_04_sant_narcis", nom: "Sant Narcís - Fires", icona: "🪰", desbloquejat: false, desc: "Per Sant Narcís, cada mosca val per sis.\nFires i Lleona.", archivo: "capitol_04_sant_narcis.json", requereix: "capitol_03_call_jueu", recompensa_100: {item_id: "mosca_daura", ruta: "ruta_fires_narcis"}}
];

// RUTES SECRETES - Tot Girona
const RUTES_SECRETES = [
  {id: "ruta_forca_secreta", nom: "Força Secreta", icona: "🗝️", requereix_capitol: "capitol_01_forca_vella", desc: "Desbloqueja fent 3x100 Força Vella"},
  {id: "ruta_girona_muralla_viva", nom: "Muralla Viva", icona: "🗝️", requereix_capitol: "capitol_02_temps_flors", desc: "Desbloqueja fent 3x100 Temps de Flors"},
  {id: "ruta_call_secret", nom: "Call Secret", icona: "🗝️", requereix_capitol: "capitol_03_call_jueu", desc: "Desbloqueja fent 3x100 El Call"},
  {id: "ruta_fires_narcis", nom: "Fires de Nit", icona: "🗝️", requereix_capitol: "capitol_04_sant_narcis", desc: "Desbloqueja fent 3x100 Sant Narcís"}
];

let ITEMS = {};
let AUDIO_ENCERT = null;
let AUDIO_FALLADA = null;
let audioCtx = false;
let musicaLoop = false;
let melodiaActual = false;

const MELODIAS = {
  gremi: [{freq: 196, dur: 1.5}, {freq: 220, dur: 1.5}, {freq: 196, dur: 3.0}],
  estudio: [{freq: 174, dur: 2.0}, {freq: 196, dur: 2.0}, {freq: 220, dur: 4.0}],
  calma: [{freq: 147, dur: 3.0}, {freq: 165, dur: 3.0}],
  fallero: [
    {freq: 130, dur: 0.25}, {freq: 0, dur: 0.25}, {freq: 146, dur: 0.25}, {freq: 0, dur: 0.25},
    {freq: 130, dur: 0.25}, {freq: 0, dur: 0.25}, {freq: 146, dur: 0.25}, {freq: 196, dur: 0.25},
    {freq: 196, dur: 0.2}, {freq: 220, dur: 0.2}, {freq: 246, dur: 0.2}, {freq: 261, dur: 0.2},
    {freq: 293, dur: 0.4}, {freq: 261, dur: 0.2}, {freq: 246, dur: 0.2}, {freq: 220, dur: 0.2},
    {freq: 196, dur: 0.4}, {freq: 174, dur: 0.2}, {freq: 196, dur: 0.2}, {freq: 220, dur: 0.2},
    {freq: 246, dur: 0.3}, {freq: 293, dur: 0.3}, {freq: 329, dur: 0.6}, {freq: 0, dur: 0.3}
  ]
};

let accioPendents = null;
function mostrarModal(text, accio = null) {
  document.getElementById('modalText').textContent = text;
  accioPendents = accio;
  document.getElementById('modal').classList.remove('hidden');
}
function tancarModal() {
  document.getElementById('modal').classList.add('hidden');
  accioPendents = null;
}
function confirmarAccio() {
  tancarModal();
  if(accioPendents) accioPendents();
}
function vibrar() { if (navigator.vibrate) navigator.vibrate(20); }
function quitarSkinTone(emoji) { return emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/u, ''); }
function iniciarMusicaChiptune(nombreMelodia = 'estudio') {
  if (!musicaActivada) return;
  if (melodiaActual === nombreMelodia && musicaLoop) return;
  pararMusica();
  melodiaActual = nombreMelodia;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notas = MELODIAS[nombreMelodia];
  let tiempo = audioCtx.currentTime;
  function tocarNota(nota) {
    if (nota.freq === 0) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = nota.freq;
    gain.gain.value = 0.001;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(tiempo);
    osc.stop(tiempo + nota.dur);
    tiempo += nota.dur;
  }
  function loop() {
    tiempo = audioCtx.currentTime;
    notas.forEach(nota => tocarNota(nota));
    musicaLoop = setTimeout(loop, notas.reduce((a, b) => a + b.dur, 0) * 1000);
  }
  loop();
}
function pararMusica() {
  if (musicaLoop) clearTimeout(musicaLoop);
  if (audioCtx) audioCtx.close();
  musicaLoop = null;
  melodiaActual = null;
}
function tocarJingleCompletado() {
  if (!musicaActivada) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notas = [{freq: 523, dur: 0.15}, {freq: 659, dur: 0.15}, {freq: 784, dur: 0.15}, {freq: 1047, dur: 0.4}];
  let tiempo = audioCtx.currentTime;
  notas.forEach(nota => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = nota.freq;
    gain.gain.value = 0.001;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(tiempo);
    osc.stop(tiempo + nota.dur);
    tiempo += nota.dur;
  });
}
async function carregarDades() {
  try {
    const res = await fetch('./data/biblioteca_emojis.json');
    BIBLIOTECA_EMOJIS_BASE = await res.json();
  } catch(err) { BIBLIOTECA_EMOJIS_BASE = []; }
  let packsComprats = [];
  try {
    const resBotiga = await fetch('./data/botiga_emojis.json');
    const dataBotiga = await resBotiga.json();
    packsComprats = dataBotiga.filter(p => estat.compres.includes(p.id));
  } catch(err) { packsComprats = []; }
  EMOJIS_JUGABLES = [...EMOJIS_STARTER,...BIBLIOTECA_EMOJIS_BASE];
  packsComprats.forEach(pack => { EMOJIS_JUGABLES = EMOJIS_JUGABLES.concat(pack.emojis); });
  EMOJIS_JUGABLES = EMOJIS_JUGABLES.filter((v,i,a)=>a.findIndex(t=>(t.emoji===v.emoji))===i);
  CATEGORIES_EMOJI = {};
  EMOJIS_JUGABLES.forEach(e => {
    const cat = e.categoria || 'altres';
    if (!CATEGORIES_EMOJI[cat]) CATEGORIES_EMOJI[cat] = [];
    if (!CATEGORIES_EMOJI[cat].includes(e.emoji)) { CATEGORIES_EMOJI[cat].push(e.emoji); }
  });
  try {
    const res = await fetch('./data/minijoc_frases.json');
    const data = await res.json();
    FRASES_MINIJOC = data.frases;
  } catch(err) { FRASES_MINIJOC = []; }
}
document.addEventListener('DOMContentLoaded', async () => {
  const jaVistaEnAquestaSessio = sessionStorage.getItem('introVista');
  if (!jaVistaEnAquestaSessio) {
    sessionStorage.setItem('introVista', 'true');
    setTimeout(() => { mostrarIntro(); }, 100);
  }
  aplicarIdioma();
  document.body.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });
  await carregarDades();
  await carregarItems();
  actualitzarUI();
  actualitzarTotem();
  carregarMapa();
});
function mostrarIntro() {
  const introEl = document.getElementById('intro');
  if (!introEl) { canviarTab('missio', null); return; }
  introEl.style.display = 'flex';
  introEl.onclick = () => { introEl.style.display = 'none'; canviarTab('missio', null); };
}
function aplicarIdioma() {
  const titol = document.getElementById('app-titol');
  if (titol) titol.textContent = LANG.app_titol;
  const monedes = document.getElementById('text-monedes');
  if (monedes) monedes.textContent = LANG.monedes;
  const tabMapa = document.getElementById('tab-mapa-txt');
  if (tabMapa) tabMapa.textContent = LANG.tab_mapa;
  const tabMissio = document.getElementById('tab-missio-txt');
  if (tabMissio) tabMissio.textContent = LANG.tab_missio;
  const tabGremi = document.getElementById('tab-gremi-txt');
  if (tabGremi) tabGremi.textContent = LANG.tab_gremi;
  const tabBotiga = document.getElementById('tab-botiga-txt');
  if (tabBotiga) tabBotiga.textContent = LANG.tab_botiga;
  const textMon = document.getElementById('text-mon');
  if (textMon) textMon.textContent = LANG.text_mon;
  const textBotiga = document.getElementById('text-botiga');
  if (textBotiga) textBotiga.textContent = LANG.text_botiga;
}
function canviarTab(tab, e) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const tabEl = document.getElementById('tab-'+tab);
  if (tabEl) tabEl.classList.add('active');
  if(e && e.target) e.target.closest('.nav-item').classList.add('active');
  if(tab === 'mapa') {pararMusica(); carregarMapa();}
  if(tab === 'missio') {pararMusica(); carregarMissioTab();}
  if(tab === 'gremi') {iniciarMusicaChiptune('fallero'); mostrarGremi('personatges', e);}
  if(tab === 'botiga') {iniciarMusicaChiptune('fallero'); carregarBotiga();}
}
async function carregarItems() {
  try {
    const res = await fetch('./data/items.json');
    const arr = await res.json();
    ITEMS = {};
    arr.forEach(i => ITEMS[i.id] = i);
  } catch(e) { ITEMS = {}; }
}
function carregarMapa() {
  const mapaDiv = document.getElementById('mapa');
  if (!mapaDiv) return;
  mapaDiv.innerHTML = '';
  CAPITOLS.forEach(capitol => {
    const completat = estat.capitolsCompletats.includes(capitol.id);
    const desbloquejat = capitol.desbloquejat || estat.capitolsCompletats.includes(capitol.requereix);
    const card = document.createElement('div');
    card.className = 'capitol-card' + (completat? ' completat' : '') + (!desbloquejat? ' bloquejat' : '');
    let html = `<div class="capitol-icona">${capitol.icona}</div><h3>${capitol.nom}</h3><p>${capitol.desc}</p>`;
    if (completat) {
      html += `✓ ${LANG.completat} <button class="btn btn-sec" style="margin-top:10px;" onclick="repetirCapitol('${capitol.id}'); event.stopPropagation()">${LANG.repetir}</button>`;
    } else if (desbloquejat) {
      html += `<button class="btn" onclick="entrarCapitol('${capitol.id}')">${LANG.entrar}</button>`;
    } else {
      html += `<p style="color:#888; margin-top:10px;">${LANG.bloquejat}</p>`;
    }
    card.innerHTML = html;
    mapaDiv.appendChild(card);
  });
  RUTES_SECRETES.forEach(ruta => {
    const desbloquejada = estat.rutesDesbloquejades.includes(ruta.id);
    const card = document.createElement('div');
    card.className = 'capitol-card ruta-secreta' + (desbloquejada? '' : ' bloquejat');
    if(desbloquejada) {
      card.innerHTML = `
        <div class="capitol-icona">${ruta.icona}</div>
        <h3>${ruta.nom}</h3>
        <p style="color:#FFD700;">${LANG.ruta_secreta}</p>
        <button class="btn" onclick="carregarCapitol('${ruta.id}.json')">Entrar</button>
      `;
    } else {
      card.innerHTML = `
        <div class="capitol-icona" style="filter:grayscale(1) brightness(0.3);">${ruta.icona}</div>
        <h3 style="color:#555;">???</h3>
        <p style="color:#666; font-size:12px;">${ruta.desc}</p>
        <p style="color:#444; margin-top:8px;">🔒 ${LANG.bloquejat}</p>
      `;
    }
    mapaDiv.appendChild(card);
  });
}
function entrarCapitol(id) {
  const capitol = CAPITOLS.find(c => c.id === id);
  if (capitol && capitol.archivo) carregarCapitol(capitol.archivo);
}
function repetirCapitol(id) {
  const capitol = CAPITOLS.find(c => c.id === id);
  if (!capitol) return;
  estat.capitolsCompletats = estat.capitolsCompletats.filter(c => c!== id);
  guardarEstat();
  carregarCapitol(capitol.archivo);
}
async function carregarCapitol(nombreArchivo) {
  pararMusica();
  try {
    const res = await fetch(`./data/${nombreArchivo}`);
    if (!res.ok) throw new Error('Archivo no encontrado: ' + nombreArchivo);
    const data = await res.json();
    let capitolInfo = CAPITOLS.find(c => c.archivo === nombreArchivo);
    if (!capitolInfo) {
      const resCap = await fetch('./data/capitols.json');
      const capitolsData = await resCap.json();
      capitolInfo = capitolsData.find(c => c.arxiu === `./data/${nombreArchivo}` || c.archivo === nombreArchivo);
    }
    if (!capitolInfo) throw new Error('Capítol no trobat');
    estat.capitolActual = {id: capitolInfo.id, passos: data, recompensa_100: capitolInfo.recompensa_100 || null};
    estat.pasActual = 0;
    estat.falladesCapitol = 0;
    document.getElementById('missio-card').innerHTML = `
      <h3 id="missio-titol">Selecciona una missió al mapa</h3>
      <div id="npc-box" style="display:none;">
        <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px;">
          <span id="npc-emoji" style="font-size:42px; line-height:1;"></span>
          <div style="flex:1;">
            <strong id="npc-nom" style="font-size:16px; display:block; margin-bottom:4px;"></strong>
            <p id="npc-dialog" style="margin:0; line-height:1.4;"></p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px; margin-top:15px; padding-top:12px; border-top:1px solid #333; opacity:0.8;">
          <span id="jugador-emoji" style="font-size:32px;"></span>
          <span id="jugador-nom" style="font-size:14px; color:#aaa;"></span>
        </div>
      </div>
      <div id="missio-escenari"></div>
      <div id="missio-opcions"></div>
      <div id="missio-feedback"></div>
    `;
    canviarTab('missio', null);
    setTimeout(() => carregarPas(), 0);
  } catch(e) {
    mostrarModal('Error carregant capítol: ' + e.message + '. Crea el fitxer./data/' + nombreArchivo);
  }
}
function carregarPas() {
  if (!estat.capitolActual) return;
  const pas = estat.capitolActual.passos[estat.pasActual];
  if (!pas) { completarCapitol(); return; }
  const esperarElemento = (id, callback, intentos = 20) => {
    const el = document.getElementById(id);
    if (el) { callback(el); } else if (intentos > 0) { setTimeout(() => esperarElemento(id, callback, intentos - 1), 50); }
  };
  esperarElemento('npc-box', (npcBox) => {
    const npcEmoji = pas.npc_emoji || '👤';
    const npcNom = pas.npc_nom || 'NPC';
    const jugadorEmoji = estat.personatge?.emoji || '🧑';
    const jugadorNom = estat.personatge?.nom || 'Tu';
    npcBox.style.display = 'block';
    document.getElementById('npc-emoji').textContent = npcEmoji;
    document.getElementById('npc-nom').textContent = npcNom;
    const textoCA = pas.dialog || '';
    const textoES = pas.dialog_es || pas.dialog;
    document.getElementById('npc-dialog').innerHTML = `
      ${textoCA}
      <button onclick="parlarNPC(\`${textoCA.replace(/`/g, '\\`')}\`, 'ca')"
        style="background:none; border:none; font-size:20px; margin-left:8px; cursor:pointer; opacity:0.7;"
        title="Escoltar en català">🔊</button>
      <button onclick="parlarNPC(\`${textoES.replace(/`/g, '\\`')}\`, 'es')"
        style="background:none; border:none; font-size:20px; margin-left:4px; cursor:pointer; opacity:0.7;"
        title="Escuchar en español">🗣️</button>
    `;
    document.getElementById('jugador-emoji').textContent = jugadorEmoji;
    document.getElementById('jugador-nom').textContent = jugadorNom;
    document.getElementById('missio-titol').textContent = pas.pregunta;
    const opcionsDiv = document.getElementById('missio-opcions');
    opcionsDiv.innerHTML = '';
    pas.opcions.forEach((opcio, i) => {
      const div = document.createElement('div');
      div.className = 'opcio';
      div.innerHTML = `<span class="opcio-text">${opcio.text}</span>`;
      div.onclick = () => seleccionarOpcio(i);
      opcionsDiv.appendChild(div);
    });
    document.getElementById('missio-feedback').innerHTML = '';
  });
}
function seleccionarOpcio(idx) {
  if(estat.bloquejat) return;
  vibrar();
  const pas = estat.capitolActual.passos[estat.pasActual];
  const opcio = pas.opcions[idx];
  const feedback = opcio.feedback;
  estat.bloquejat = true;
  document.querySelectorAll('.opcio').forEach(o => o.classList.add('disabled'));
  const duracio = 8000;
  mostrarFeedback(feedback, duracio);
  if(opcio.correcte && AUDIO_ENCERT) AUDIO_ENCERT.play();
  if(!opcio.correcte && AUDIO_FALLADA) AUDIO_FALLADA.play();
  if (opcio.correcte) {
    estat.monedes += opcio.guany?.monedes || 5;
    estat.stats.seny += opcio.guany?.seny || 0;
    estat.stats.rauxa += opcio.guany?.rauxa || 0;
    estat.stats.arrel += opcio.guany?.arrel || 0;
    estat.stats.obert += opcio.guany?.obert || 0;
    if(opcio.stats) Object.keys(opcio.stats).forEach(k => {estat.stats[k] += opcio.stats[k];});
  } else {
    estat.falladesCapitol = (estat.falladesCapitol || 0) + 1;
    estat.fallades.push({capitol: estat.capitolActual.id, pas: estat.pasActual});
  }
  actualitzarTotem();
  guardarEstat();
  actualitzarUI();
  setTimeout(() => {
    estat.bloquejat = false;
    estat.pasActual++;
    carregarPas();
  }, duracio);
}
function mostrarFeedback(text, duracio) {
  const feedbackDiv = document.getElementById('missio-feedback');
  feedbackDiv.innerHTML = `<div id="feedback-box">
    <p>${text}</p>
    <div id="feedback-barra" style="height:4px; background:var(--accent); width:0%; animation: fillBar ${duracio}ms linear forwards; margin-top:10px; border-radius:2px;"></div>
  </div>`;
}
function completarCapitol() {
  tocarJingleCompletado();
  if (!estat.capitolsCompletats.includes(estat.capitolActual.id)) {
    estat.capitolsCompletats.push(estat.capitolActual.id);
  }
  const seguent = CAPITOLS.find(c => c.requereix === estat.capitolActual.id);
  if (seguent) seguent.desbloquejat = true;
  document.getElementById('npc-box').style.display = 'none';
  const es100 = (estat.falladesCapitol || 0) === 0;
  const fallades = estat.falladesCapitol || 0;
  let htmlPremi = '';
  const vecesNecesarias = 3;
  if(es100 && estat.capitolActual.recompensa_100) {
    estat.capitols100Counts[estat.capitolActual.id] = (estat.capitols100Counts[estat.capitolActual.id] || 0) + 1;
    const veces100 = estat.capitols100Counts[estat.capitolActual.id];
    const item = ITEMS[estat.capitolActual.recompensa_100.item_id];
    if(item &&!estat.objectes.includes(estat.capitolActual.recompensa_100.item_id)) {
      estat.objectes.push(estat.capitolActual.recompensa_100.item_id);
    }
    if(veces100 >= vecesNecesarias && estat.capitolActual.recompensa_100.ruta) {
      if(!estat.rutesDesbloquejades.includes(estat.capitolActual.recompensa_100.ruta)) {
        estat.rutesDesbloquejades.push(estat.capitolActual.recompensa_100.ruta);
      }
    }
    const imgHtmlPremi = item?.emoji? `<div style="font-size: 80px; margin-bottom: 15px;">${item.emoji}</div>` : `<img src="${item?.imatge}" style="width:100px; height:100px; object-fit:contain;">`;
    htmlPremi = `<div class="item-desbloquejat">${imgHtmlPremi}<h3>${item?.nom || 'Premi'}</h3><p>${item?.descripcio || ''}</p><div style="color:#FFD700; font-weight:bold;">${veces100 >= vecesNecesarias? '<span style="color:#4CAF50;">Ruta secreta desbloquejada!</span>' : `Falten ${vecesNecesarias - veces100} cops per la ruta secreta`}</div></div>`;
  } else {
    htmlPremi = `<div style="text-align:center; margin-top:20px;"><p style="color:#ff6b6b; font-size:18px; font-weight:bold;">Has fallat ${fallades} pregunta${fallades > 1? 's' : ''}</p><p style="color:#888; margin-top:10px;">Fes 0 fallos per guanyar l'item especial.</p></div>`;
  }
  document.getElementById('missio-card').innerHTML = `
    <div class="completion-screen">
      <h2>✅ ${LANG.mision_completada}</h2>
      ${htmlPremi}
      <div class="completion-buttons">
        <button class="btn btn-sec" onclick="window.tornarMapa()">${LANG.volver_mapa}</button>
        <button class="btn" onclick="window.repetirCapitolActual()">${LANG.repetir}</button>
      </div>
    </div>
  `;
  guardarEstat();
}
function actualitzarTotem() {
  const stats = estat.stats;
  let maxStat = 'neutral';
  let maxVal = 0;
  Object.keys(stats).forEach(k => { if(stats[k] > maxVal) {maxVal = stats[k]; maxStat = k;} });
  estat.totem = maxVal >= 20? maxStat : 'neutral';
  document.documentElement.setAttribute('data-totem', estat.totem);
  const emojis = { seny: '🦉', rauxa: '🔥', arrel: '🌳', obert: '🌍', neutral: '' };
  const totemDisplay = document.getElementById('totem-display');
  if (totemDisplay) { totemDisplay.textContent = estat.totem!== 'neutral'? `Tòtem: ${emojis[estat.totem]} ${estat.totem.toUpperCase()}` : ''; }
}
function repetirCapitolActual() { if (!estat.capitolActual) return; repetirCapitol(estat.capitolActual.id); }
window.repetirCapitolActual = repetirCapitolActual;
function tornarMapa() {
  estat.capitolActual = null; estat.pasActual = 0; estat.bloquejat = false;
  const npcBox = document.getElementById('npc-box');
  if (npcBox) npcBox.style.display = 'none';
  const missioCard = document.getElementById('missio-card');
  if (missioCard) { missioCard.innerHTML = `<h3 id="missio-titol">Selecciona una missió al mapa</h3><div id="missio-escenari"></div><div id="missio-opcions"></div><div id="missio-feedback"></div>`; }
  canviarTab('mapa', null);
}
window.tornarMapa = tornarMapa;
function carregarMissioTab() {
  const rutes = document.getElementById('rutes-secretes');
  if (rutes) { rutes.style.display = estat.capitolActual? 'none' : 'block'; }
}
function guardarEstat() {
  localStorage.setItem('cat_monedes', estat.monedes);
  localStorage.setItem('cat_completats', JSON.stringify(estat.capitolsCompletats));
  localStorage.setItem('cat_objectes', JSON.stringify(estat.objectes));
  localStorage.setItem('cat_rutes', JSON.stringify(estat.rutesDesbloquejades));
  localStorage.setItem('cat_capitols100', JSON.stringify(estat.capitols100Counts));
  localStorage.setItem('cat_seny', estat.stats.seny);
  localStorage.setItem('cat_rauxa', estat.stats.rauxa);
  localStorage.setItem('cat_arrel', estat.stats.arrel);
  localStorage.setItem('cat_obert', estat.stats.obert);
  localStorage.setItem('cat_totem', estat.totem);
  localStorage.setItem('cat_fallades', JSON.stringify(estat.fallades));
  localStorage.setItem('cat_personatge', JSON.stringify(estat.personatge));
  localStorage.setItem('cat_compres', JSON.stringify(estat.compres));
  localStorage.setItem('cat_emojis', JSON.stringify(estat.emojisDesbloquejats));
  localStorage.setItem('cat_nivell_minijoc', NIVELL_MINIJOC.nivelActual);
}
function actualitzarUI() {
  const coins = document.getElementById('coins');
  if (coins) coins.innerHTML = `🪙 ${estat.monedes} <span id="text-monedes">${LANG.monedes}</span>`;
  const stats = document.getElementById('stats');
  if (stats) stats.textContent = `Seny: ${estat.stats.seny} | Rauxa: ${estat.stats.rauxa} | Arrel: ${estat.stats.arrel} | Obert: ${estat.stats.obert}`;
}
function mostrarGremi(tab, e) {
  document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
  if(e) e.target.classList.add('active');
  const cont = document.getElementById('gremi-contenidor');
  const bibSubtabs = document.getElementById('biblioteca-subtabs');
  if (!cont) return;
  cont.innerHTML = '';
  if (tab === 'biblioteca') {
    if (bibSubtabs) bibSubtabs.style.display = 'flex';
    mostrarBibliotecaTab('diccionari');
    return;
  } else { if (bibSubtabs) bibSubtabs.style.display = 'none'; }
  if(tab === 'personatges') {
    if(!estat.personatge) {
      let html = `<h3 style="text-align:center; margin-bottom:20px;">${LANG.tria_personatge}</h3>`;
      html += `<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; max-width:300px; margin:0 auto;">`;
      PERSONATGES_JUGADOR.forEach(p => { html += `<button class="btn" style="font-size:48px; padding:20px;" onclick="seleccionarPersonatge('${p.id}')">${p.emoji}<div style="font-size:14px; margin-top:5px;">${p.nom}</div></button>`; });
      html += `</div><div style="margin-top:20px; text-align:center;"><input type="text" id="nom-jugador" placeholder="${LANG.nom_personatge}" style="padding:10px; width:80%; border-radius:8px; border:none; background:#2a2a2a; color:#fff;"></div>`;
      cont.innerHTML = html;
    } else {
      const emojis = { seny: '🦉', rauxa: '🔥', arrel: '🌳', obert: '🌍', neutral: '😐' };
      const titols = { seny: 'Estratèg', rauxa: 'Impulsiu', arrel: 'Arrelat', obert: 'Cosmopolita', neutral: 'Novell' };
      const totalStats = estat.stats.seny + estat.stats.rauxa + estat.stats.arrel + estat.stats.obert;
      const rang = totalStats < 20? 'Novell' : totalStats < 50? 'Viatjant' : totalStats < 100? 'Mestre' : 'Llegendari';
      cont.innerHTML = `<div class="gremi-item" style="grid-column:1/-1; text-align:center;"><div style="font-size:64px;">${estat.personatge.emoji}</div><h3 style="margin:10px 0;">${estat.personatge.nom}</h3><p style="color:#888;">${estat.personatge.nom_cat}</p><hr style="border-color:#333; margin:15px 0;"><p><b>Rang:</b> ${rang}</p><p><b>Títol:</b> ${titols[estat.totem]}</p><p><b>Capítols 100%:</b> ${estat.capitolsCompletats.length}/${CAPITOLS.length}</p><button class="btn btn-sec" style="margin-top:15px;" onclick="canviarPersonatge()">${LANG.canviar_personatge}</button></div>`;
    }
  }
  if(tab === 'objectes') {
    if(estat.objectes.length === 0) { cont.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#888;">Encara no tens objectes</div>`; }
    else { estat.objectes.forEach(id => { const item = ITEMS[id]; if(item) { const esEmoji = item.imatge?.length <= 2 &&!item.imatge.startsWith('./'); const imgHtml = esEmoji? `<div style="font-size: 60px; margin-bottom: 10px;">${item.imatge}</div>` : `<img src="${item.imatge}" style="width:80px; height:80px; object-fit:contain;">`; cont.innerHTML += `<div class="gremi-item">${imgHtml}<div>${item.nom}</div><div style="font-size:12px; color:#888;">${item.descripcio}</div></div>`; } }); }
  }
  if(tab === 'llegendes') {
    Promise.all([
      fetch('./data/llegendes_girona.json').then(r => r.json()).catch(()=>[]),
      fetch('./data/llegendes_forca.json').then(r => r.json()).catch(()=>[]),
      fetch('./data/llegendes_call.json').then(r => r.json()).catch(()=>[]),
      fetch('./data/llegendes_barcelona.json').then(r => r.json()).catch(()=>[]),
      fetch('./data/llegendes_valencia.json').then(r => r.json()).catch(()=>[])
    ])
 .then(([girona, forca, call, barcelona, valencia]) => {
      const totes = [...girona,...forca,...call,...barcelona,...valencia];
      cont.innerHTML = '';
      if(totes.length === 0) { cont.innerHTML = '<p style="text-align:center; color:#666;">No hi ha llegendes encara - Completa missions!</p>'; return; }
      totes.forEach(l => {
        let desbloquejada = false;
        if(l.condicio && l.condicio.startsWith('completar_')) {
          const idCapitol = l.condicio.replace('completar_', '');
          desbloquejada = estat.capitolsCompletats.includes(idCapitol);
        } else if(l.condicio) {
          const idCapitol = l.condicio.replace('.json','');
          desbloquejada = estat.capitolsCompletats.includes(idCapitol);
        } else { desbloquejada = true; }
        if(desbloquejada) {
          cont.innerHTML += `<div class="gremi-item" style="grid-column:1/-1;"><div style="font-size:36px;">${l.icona}</div><h3 style="margin:10px 0;">${l.titol}</h3><p style="font-size:14px; color:#ccc; line-height:1.6; text-align:left;">${l.text}</p><div style="color:#4CAF50; font-size:12px; margin-top:10px;">✓ Desbloquejada</div></div>`;
        } else {
          cont.innerHTML += `<div class="gremi-item" style="grid-column:1/-1; opacity:0.4;"><div style="font-size:36px;">🔒</div><h3 style="margin:10px 0;">???</h3><p style="font-size:14px; color:#666;">Completa el capítol per desbloquejar</p></div>`;
        }
      });
    }).catch(err => console.error('Error carregant llegendes:', err));
  }
}
function mostrarBibliotecaTab(tab, e) {
  document.querySelectorAll('#biblioteca-subtabs.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  if(e) e.target.classList.add('active');
  const cont = document.getElementById('gremi-contenidor');
  if (!cont) return;
  if(tab === 'diccionari') {
    const desbloquejats = new Set(estat.emojisDesbloquejats || []);
    let html = `<h3 style="text-align:center; margin-bottom:10px;">${LANG.biblioteca}</h3>`;
    html += `<p style="text-align:center; color:#888; margin-bottom:20px; font-size:14px;">${LANG.biblioteca_desc}</p>`;
    html += `<div style="background:linear-gradient(135deg, var(--accent), var(--accent2)); padding:12px; border-radius:12px; margin-bottom:20px; text-align:center; font-weight:700; font-size:14px;">${LANG.biblioteca_cta}</div>`;
    for (const [cat, emojis] of Object.entries(CATEGORIES_EMOJI)) {
      html += `<h4 style="margin:15px 0 8px; color:#4CAF50; text-transform:capitalize;">${cat}</h4>`;
      html += `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px;">`;
      emojis.forEach(emoji => {
        const info = EMOJIS_JUGABLES.find(e => e.emoji === emoji);
        const nom = info? info.nom_cat : emoji;
        const paraules = info? info.para_frases.join(', ') : '';
        const comprat = desbloquejats.has(emoji);
        const opacidad = comprat? '1' : '0.12';
        const filtro = comprat? '' : 'grayscale(1) brightness(0.4)';
        const pointer = comprat? 'pointer' : 'not-allowed';
        const colorTexto = comprat? '#fff' : '#444';
        const colorParaules = comprat? '#aaa' : '#222';
        html += `<div style="text-align:center; padding:12px 8px; background:#1a1a1a; border-radius:10px; opacity:${opacidad}; filter:${filtro}; pointer-events:${pointer};"><div style="font-size:42px; margin-bottom:6px;">${emoji}</div><div style="font-size:13px; font-weight:600; color:${colorTexto};">${nom}</div><div style="font-size:10px; color:${colorParaules}; margin-top:4px;">${paraules}</div></div>`;
      });
      html += `</div>`;
    }
    cont.innerHTML = html;
  }
  if(tab === 'minijocs') {
    cont.innerHTML = `<h3>${LANG.minijoc_titol}</h3><p id="minijoc-nivell" style="color:#4CAF50; font-weight:bold; margin:8px 0;">Nivell ${NIVELL_MINIJOC.nivelActual} - ${NIVELL_MINIJOC.minEmojis} emojis</p><p style="color:var(--text-sec); margin:12px 0;">${LANG.minijoc_desc}</p><div id="minijoc-frase" style="background:#222; padding:15px; border-radius:12px; min-height:50px; margin-bottom:15px; text-align:center; font-size:18px;">Prem "Nova frase" per començar</div><button class="btn btn-sec" onclick="novaFraseMinijoc()" style="margin-bottom:15px;">Nova frase</button><div id="minijoc-emojis" class="emoji-grid"></div><div id="minijoc-triats" style="background:#222; padding:15px; border-radius:12px; min-height:50px; margin:15px 0; text-align:center; font-size:24px;"></div><button class="btn" onclick="comprovarMinijoc()">${LANG.comprovar}</button><div id="minijoc-feedback" style="margin-top:15px;"></div>`;
    novaFraseMinijoc();
  }
}
function novaFraseMinijoc() { carregarFrasesMinijoc(); }
function carregarFrasesMinijoc() {
  if (!FRASES_MINIJOC || FRASES_MINIJOC.length === 0) return;
  const emojisDisponibles = EMOJIS_JUGABLES;
  if (emojisDisponibles.length < 2) {
    const fraseEl = document.getElementById('minijoc-frase');
    if (fraseEl) fraseEl.textContent = "Error: no hi ha emojis per jugar.";
    const emojisEl = document.getElementById('minijoc-emojis');
    if (emojisEl) emojisEl.innerHTML = '';
    return;
  }
  const plantilla = FRASES_MINIJOC[Math.floor(Math.random() * FRASES_MINIJOC.length)];
  const { text, solucio } = generarFraseDinamica(plantilla, emojisDisponibles.map(e => e.emoji));
  estat.minijoc.fraseObjectiu = { text, solucio };
  estat.minijoc.emojisTriats = [];
  const fraseEl = document.getElementById('minijoc-frase');
  if (fraseEl) fraseEl.textContent = text;
  const triatsEl = document.getElementById('minijoc-triats');
  if (triatsEl) triatsEl.textContent = '';
  const feedbackEl = document.getElementById('minijoc-feedback');
  if (feedbackEl) feedbackEl.innerHTML = '';
  const nivellEl = document.getElementById('minijoc-nivell');
  if (nivellEl) nivellEl.textContent = `Nivell ${NIVELL_MINIJOC.nivelActual} - ${solucio.length} emojis`;
  generarEmojisParaFraseCorta({solucio});
}
function generarEmojisParaFraseCorta(frase) {
  const emojisJugador = EMOJIS_JUGABLES.map(e => e.emoji);
  const emojisFalsos = emojisJugador.filter(e =>!frase.solucio.some(eSol => quitarSkinTone(e) === quitarSkinTone(eSol))).sort(() => 0.5 - Math.random()).slice(0, 10 - frase.solucio.length);
  const emojisAMostrar = [...frase.solucio,...emojisFalsos].sort(() => 0.5 - Math.random());
  estat.minijoc.emojisDisponibles = emojisAMostrar;
  let html = '';
  emojisAMostrar.forEach((emoji, i) => {
    const emojiData = EMOJIS_JUGABLES.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji));
    html += `<div class="emoji-item" onclick="triarEmojiMinijoc(${i})" style="cursor:pointer;"><div class="emoji-large">${emoji}</div><div class="emoji-name">${emojiData?.nom_cat || ''}</div></div>`;
  });
  const emojisEl = document.getElementById('minijoc-emojis');
  if (emojisEl) emojisEl.innerHTML = html;
}
function obtenirArticle(emoji) {
  const emojiData = EMOJIS_JUGABLES.find(e => quitarSkinTone(e.emoji) === quitarSkinTone(emoji));
  if (!emojiData ||!emojiData.genere) return emojiData?.nom_cat || emoji;
  const nom = emojiData.nom_cat;
  const article = emojiData.genere === 'f'? 'La' : 'El';
  return `${article} ${nom}`;
}
function generarFraseDinamica(plantilla, emojisJugador) {
  let text = plantilla.text;
  let solucio = [];
  for (const cat of plantilla.categories) {
    const emojisDisponibles = CATEGORIES_EMOJI[cat]?.filter(eBase => emojisJugador.some(eJug => quitarSkinTone(eJug) === quitarSkinTone(eBase))) || [];
    if (!emojisDisponibles || emojisDisponibles.length === 0) {
      return generarFraseDinamica(FRASES_MINIJOC[Math.floor(Math.random() * FRASES_MINIJOC.length)], emojisJugador);
    }
    const emojiElegit = emojisDisponibles[Math.floor(Math.random() * emojisDisponibles.length)];
    text = text.replace(`{${cat}}`, obtenirArticle(emojiElegit));
    solucio.push(emojiElegit);
  }
  return { text, solucio };
}
function triarEmojiMinijoc(index) {
  vibrar();
  const emoji = estat.minijoc.emojisDisponibles[index];
  const maxEmojis = estat.minijoc.fraseObjectiu.solucio.length;
  if (estat.minijoc.emojisTriats.length < maxEmojis) {
    estat.minijoc.emojisTriats.push(emoji);
    actualitzarTriatsMinijoc();
  }
}
function actualitzarTriatsMinijoc() {
  const div = document.getElementById('minijoc-triats');
  if (div) div.textContent = estat.minijoc.emojisTriats.join(' ');
}
function comprovarMinijoc() {
  vibrar();
  const frase = estat.minijoc.fraseObjectiu;
  const solucioCorrecta = frase.solucio.map(quitarSkinTone).join('');
  const triatsCorrecte = estat.minijoc.emojisTriats.map(quitarSkinTone).join('');
  const esCorrecte = solucioCorrecta === triatsCorrecte;
  const feedback = document.getElementById('minijoc-feedback');
  if (esCorrecte) {
    if (feedback) feedback.innerHTML = `<p style="color:#4CAF50; font-weight:bold;">${LANG.correcte}</p>`;
    estat.monedes += 5; estat.stats.arrel += 5; actualitzarUI(); guardarEstat();
  } else {
    if (feedback) feedback.innerHTML = `<p style="color:#f44336; font-weight:bold;">${LANG.incorrecte} ${frase.solucio.join(' ')}</p>`;
  }
  setTimeout(() => novaFraseMinijoc(), 2000);
}
function seleccionarPersonatge(id) {
  const p = PERSONATGES_JUGADOR.find(x => x.id === id);
  const nomInput = document.getElementById('nom-jugador')?.value.trim();
  estat.personatge = { id: p.id, emoji: p.emoji, nom: nomInput || 'Jugador', nom_cat: p.nom };
  guardarEstat(); mostrarGremi('personatges', null);
}
function canviarPersonatge() { estat.personatge = null; guardarEstat(); mostrarGremi('personatges', null); }
async function carregarBotiga() {
  const cont = document.getElementById('botiga-contenidor');
  if (!cont) return;
  try {
    const res = await fetch('./data/botiga_emojis.json');
    const data = await res.json();
    estat.packs_botiga = data;
    cont.innerHTML = '';
    data.forEach(pack => {
      const comprat = estat.compres.includes(pack.id);
      const card = document.createElement('div');
      card.className = 'capitol-card';
      card.innerHTML = `<div class="capitol-icona">🎁</div><h3>${pack.nom}</h3><p style="color:var(--text-sec); margin:8px 0;">${pack.descripcio}</p><p style="font-size:24px;">${pack.emojis.map(e => e.emoji).join(' ')}</p><button class="btn ${comprat? 'btn-sec' : ''}" onclick="comprarPack('${pack.id}', ${pack.preu}, event)" ${comprat? 'disabled' : ''}>${comprat? LANG.comprat : `🪙 ${pack.preu}`}</button>`;
      cont.appendChild(card);
    });
  } catch(e) { console.error(e); cont.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#f44336;">Error: ${e.message}</div>`; }
}
async function comprarPack(id, preu, event) {
  if (event) event.stopPropagation();
  if (estat.monedes < preu) { mostrarModal(LANG.no_prou_monedes); return; }
  vibrar(); estat.monedes -= preu; estat.compres.push(id);
  const pack = estat.packs_botiga.find(p => p.id === id);
  if (pack) { pack.emojis.forEach(e => { if (!estat.emojisDesbloquejats.includes(e.emoji)) { estat.emojisDesbloquejats.push(e.emoji); } }); await carregarDades(); }
  NIVELL_MINIJOC.nivelActual = Math.min(NIVELL_MINIJOC.nivelActual + 1, NIVELL_MINIJOC.maxEmojis);
  guardarEstat(); actualitzarUI(); renderitzarBotiga(); mostrarModal("Pack desbloquejat!", null);
}
function renderitzarBotiga() {
  const cont = document.getElementById('botiga-contenidor');
  if (!cont ||!estat.packs_botiga) return;
  cont.innerHTML = '';
  estat.packs_botiga.forEach(pack => {
    const comprat = estat.compres.includes(pack.id);
    const card = document.createElement('div');
    card.className = 'capitol-card';
    card.innerHTML = `<div class="capitol-icona">🎁</div><h3>${pack.nom}</h3><p style="color:var(--text-sec); margin:8px 0;">${pack.descripcio}</p><p style="font-size:24px;">${pack.emojis.map(e => e.emoji).join(' ')}</p><button class="btn ${comprat? 'btn-sec' : ''}" onclick="comprarPack('${pack.id}', ${pack.preu}, event)" ${comprat? 'disabled' : ''}>${comprat? 'Desbloquejat' : `🪙 ${pack.preu}`}</button>`;
    cont.appendChild(card);
  });
}
function parlarNPC(texto, lang = 'ca') {
  if (!('speechSynthesis' in window)) { mostrarModal('El teu navegador no suporta veu'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  if (lang === 'es') { utterance.lang = 'es-ES'; utterance.rate = 0.9; utterance.pitch = 1; }
  else {
    utterance.lang = 'ca-ES'; utterance.rate = 0.85; utterance.pitch = 1.05;
    const veus = speechSynthesis.getVoices();
    const veuGirona = veus.find(v => v.name.toLowerCase().includes('montserrat'));
    const veuNuria = veus.find(v => v.name.toLowerCase().includes('nuria'));
    const veuCat = veus.find(v => v.lang === 'ca-ES');
    if (veuGirona) utterance.voice = veuGirona;
    else if (veuNuria) utterance.voice = veuNuria;
    else if (veuCat) utterance.voice = veuCat;
  }
  speechSynthesis.speak(utterance);
}
if ('speechSynthesis' in window) { speechSynthesis.onvoiceschanged = () => {}; }
window.repetirCapitolActual = repetirCapitolActual;
window.tornarMapa = tornarMapa;
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err)); }
