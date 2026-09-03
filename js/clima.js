/* ==========================================================================
   RASOI — Motor climático
   --------------------------------------------------------------------------
   Princípio: "samanya vishesha siddhanta" — o semelhante aumenta o
   semelhante, o oposto reduz. O clima é um conjunto de qualidades que entra
   no corpo. Para equilibrar, come-se o oposto do que o ambiente oferece.
   ========================================================================== */

const ESTACOES = [
  { id: 'verao-seco',      nome: 'Verão seco',        icone: '🏜️', temp: 33, umid: 25, vento: false,
    nota: 'Calor forte com ar ressecado — o clima que mais desidrata.' },
  { id: 'verao-umido',     nome: 'Verão abafado',     icone: '🌴', temp: 31, umid: 85, vento: false,
    nota: 'Calor tropical com umidade alta: peso, moleza e digestão lenta.' },
  { id: 'outono-ventoso',  nome: 'Outono ventoso',    icone: '🍂', temp: 20, umid: 35, vento: true,
    nota: 'Vento, secura e temperatura instável — a estação de Vata.' },
  { id: 'inverno-seco',    nome: 'Inverno seco',      icone: '❄️', temp: 9,  umid: 30, vento: true,
    nota: 'Frio cortante e ar seco: rigidez, pele áspera, articulações duras.' },
  { id: 'inverno-umido',   nome: 'Inverno chuvoso',   icone: '🌧️', temp: 10, umid: 85, vento: false,
    nota: 'Frio úmido: muco, congestão, letargia. O território de Kapha.' },
  { id: 'primavera',       nome: 'Primavera',         icone: '🌸', temp: 21, umid: 75, vento: false,
    nota: 'O Kapha acumulado no inverno derrete: alergias e peso matinal.' },
  { id: 'temperado',       nome: 'Ameno e equilibrado', icone: '🌤️', temp: 22, umid: 55, vento: false,
    nota: 'Clima neutro — a hora de comer segundo a sua constituição, não o clima.' }
];

/* Regras: cada eixo do clima gera qualidades a favorecer e a evitar. */
const REGRAS_CLIMA = {
  quente: { doshas: { pitta: 2 },
            favorecer: ['frio','suave','liquido'],  evitar: ['quente','penetrante'],
            rasaFav: ['doce','amargo','adstringente'], rasaEvit: ['picante','salgado','acido'] },
  frio:   { doshas: { vata: 1, kapha: 2 },
            favorecer: ['quente','penetrante'],     evitar: ['frio'],
            rasaFav: ['picante','acido','salgado'], rasaEvit: ['amargo','adstringente'] },
  seco:   { doshas: { vata: 2 },
            favorecer: ['oleoso','liquido','macio','pesado','estavel'], evitar: ['seco','aspero','leve'],
            rasaFav: ['doce','acido','salgado'],    rasaEvit: ['amargo','adstringente','picante'] },
  umido:  { doshas: { kapha: 2 },
            favorecer: ['seco','leve','aspero','claro'], evitar: ['oleoso','viscoso','pesado','liquido'],
            rasaFav: ['picante','amargo','adstringente'], rasaEvit: ['doce','salgado','acido'] },
  vento:  { doshas: { vata: 2 },
            favorecer: ['estavel','oleoso','pesado','macio'], evitar: ['movel','seco','leve','aspero'],
            rasaFav: ['doce','acido','salgado'],    rasaEvit: ['amargo','adstringente','picante'] }
};

function faixaTermica(temp) {
  if (temp <= 14) return 'frio';
  if (temp >= 27) return 'quente';
  return 'ameno';
}

function faixaHidrica(umid) {
  if (umid <= 40) return 'seco';
  if (umid >= 71) return 'umido';
  return 'equilibrado';
}

/**
 * Monta o perfil ayurvédico de um clima.
 * @param {number} temp   temperatura em °C
 * @param {number} umid   umidade relativa em %
 * @param {boolean} vento se o ar está em movimento constante
 */
function perfilClimatico(temp, umid, vento) {
  const eixos = [];
  const term = faixaTermica(temp);
  const hidr = faixaHidrica(umid);

  if (term !== 'ameno') eixos.push(term);
  if (hidr !== 'equilibrado') eixos.push(hidr);
  if (vento) eixos.push('vento');

  const doshas = { vata: 0, pitta: 0, kapha: 0 };
  let favorecer = [], evitar = [], rasaFav = [], rasaEvit = [];

  eixos.forEach(function (eixo) {
    const r = REGRAS_CLIMA[eixo];
    Object.keys(r.doshas).forEach(function (d) { doshas[d] += r.doshas[d]; });
    favorecer = favorecer.concat(r.favorecer);
    evitar    = evitar.concat(r.evitar);
    rasaFav   = rasaFav.concat(r.rasaFav);
    rasaEvit  = rasaEvit.concat(r.rasaEvit);
  });

  /* Quando o clima pede uma qualidade e, por outro eixo, a desaconselha,
     ela é ambivalente: sai das duas listas e vira "depende". */
  const resolvido = resolverConflitos(favorecer, evitar);
  const resolvidoRasa = resolverConflitos(rasaFav, rasaEvit);

  return {
    temp: temp, umid: umid, vento: vento,
    termica: term, hidrica: hidr,
    nome: nomeClima(term, hidr, vento),
    doshas: doshas,
    doshaDominante: dominante(doshas),
    favorecer: resolvido.favorecer,
    evitar: resolvido.evitar,
    ambivalentes: resolvido.ambivalentes,
    rasaFav: resolvidoRasa.favorecer,
    rasaEvit: resolvidoRasa.evitar
  };
}

function resolverConflitos(fav, evi) {
  const setFav = new Set(fav), setEvi = new Set(evi);
  const ambivalentes = [].concat(Array.from(setFav)).filter(function (q) { return setEvi.has(q); });
  ambivalentes.forEach(function (q) { setFav.delete(q); setEvi.delete(q); });
  return { favorecer: Array.from(setFav), evitar: Array.from(setEvi), ambivalentes: ambivalentes };
}

function dominante(doshas) {
  let maior = null, valor = 0;
  Object.keys(doshas).forEach(function (d) {
    if (doshas[d] > valor) { valor = doshas[d]; maior = d; }
  });
  return maior;
}

function nomeClima(term, hidr, vento) {
  const t = { frio: 'Frio', quente: 'Quente', ameno: 'Ameno' }[term];
  const h = { seco: 'seco', umido: 'úmido', equilibrado: '' }[hidr];
  let n = h ? t + ' e ' + h : t;
  if (vento) n += ', com vento';
  return n;
}
