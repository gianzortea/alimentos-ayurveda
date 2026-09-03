/* ==========================================================================
   RASOI — Aplicação
   ========================================================================== */

const $  = function (s, ctx) { return (ctx || document).querySelector(s); };
const $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

const LS = {
  favoritos: 'rasoi.favoritos',
  tema: 'rasoi.tema'
};

const estado = {
  aba: 'qualidades',
  qualidades: new Set(),
  modoQualidade: 'todas',
  rasas: new Set(),
  categoria: '',
  dosha: '',
  busca: '',
  ordem: 'relevancia',
  clima: { temp: 33, umid: 25, vento: false },
  estacao: 'verao-seco',
  agrupar: true,
  mostrarEvitar: false,
  favoritos: new Set(carregar(LS.favoritos, [])),
  tema: localStorage.getItem(LS.tema) || 'claro'
};

function carregar(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) || padrao; }
  catch (e) { return padrao; }
}
function salvarFavoritos() {
  localStorage.setItem(LS.favoritos, JSON.stringify(Array.from(estado.favoritos)));
}

/* ----------------------------- utilitários ------------------------------ */

const MAPA_QUALIDADE = {};
QUALIDADES.forEach(function (q) { MAPA_QUALIDADE[q.id] = q; });

const MAPA_RASA = {};
RASAS.forEach(function (r) { MAPA_RASA[r.id] = r; });

/** As qualidades efetivas de um alimento incluem a térmica, derivada do virya. */
function gunasDe(alimento) {
  return [alimento.virya].concat(alimento.gunas);
}

function normalizar(txt) {
  return (txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function nomeQual(id) { return MAPA_QUALIDADE[id] ? MAPA_QUALIDADE[id].nome : id; }
function nomeRasa(id) { return MAPA_RASA[id] ? MAPA_RASA[id].nome : id; }

/* --------------------------- filtros comuns ----------------------------- */

function passaFiltrosBase(a) {
  if (estado.categoria && a.cat !== estado.categoria) return false;
  if (estado.dosha && a.dosha[estado.dosha] > 0) return false;
  if (estado.busca) {
    const alvo = normalizar(a.nome + ' ' + CATEGORIAS[a.cat].nome + ' ' + a.dica);
    if (alvo.indexOf(normalizar(estado.busca)) === -1) return false;
  }
  return true;
}

/* ===================== MODO 1 — BUSCA POR QUALIDADES ===================== */

function buscarPorQualidades() {
  const pedidas = Array.from(estado.qualidades);
  const rasasPedidas = Array.from(estado.rasas);

  const resultados = ALIMENTOS.filter(passaFiltrosBase).map(function (a) {
    const g = gunasDe(a);
    const casadas = pedidas.filter(function (q) { return g.indexOf(q) !== -1; });
    const rasaCasadas = rasasPedidas.filter(function (r) { return a.rasa.indexOf(r) !== -1; });

    return {
      alimento: a,
      casadas: casadas,
      rasaCasadas: rasaCasadas,
      total: casadas.length + rasaCasadas.length
    };
  }).filter(function (r) {
    const pedidoTotal = pedidas.length + rasasPedidas.length;
    if (pedidoTotal === 0) return true;

    if (estado.modoQualidade === 'todas') {
      return r.casadas.length === pedidas.length && r.rasaCasadas.length === rasasPedidas.length;
    }
    return r.total > 0;
  });

  const pedidoTotal = pedidas.length + rasasPedidas.length;
  resultados.forEach(function (r) {
    r.pct = pedidoTotal ? Math.round((r.total / pedidoTotal) * 100) : null;
  });

  ordenar(resultados, function (r) { return r.total; });
  return resultados;
}

function ordenar(lista, chaveRelevancia) {
  if (estado.ordem === 'nome') {
    lista.sort(function (a, b) { return a.alimento.nome.localeCompare(b.alimento.nome, 'pt'); });
  } else if (estado.ordem === 'categoria') {
    lista.sort(function (a, b) {
      const c = CATEGORIAS[a.alimento.cat].nome.localeCompare(CATEGORIAS[b.alimento.cat].nome, 'pt');
      return c !== 0 ? c : a.alimento.nome.localeCompare(b.alimento.nome, 'pt');
    });
  } else {
    lista.sort(function (a, b) {
      const d = chaveRelevancia(b) - chaveRelevancia(a);
      return d !== 0 ? d : a.alimento.nome.localeCompare(b.alimento.nome, 'pt');
    });
  }
}

/* ======================= MODO 2 — BUSCA POR CLIMA ======================== */

function pontuarNoClima(a, perfil) {
  const g = gunasDe(a);
  let pontos = 0;
  const prol = [], contra = [];

  g.forEach(function (q) {
    if (perfil.favorecer.indexOf(q) !== -1) { pontos += 2; prol.push(nomeQual(q)); }
    if (perfil.evitar.indexOf(q) !== -1)    { pontos -= 2; contra.push(nomeQual(q)); }
  });

  a.rasa.forEach(function (r) {
    if (perfil.rasaFav.indexOf(r) !== -1)  { pontos += 1.5; prol.push(nomeRasa(r)); }
    if (perfil.rasaEvit.indexOf(r) !== -1) { pontos -= 1.5; contra.push(nomeRasa(r)); }
  });

  ['vata', 'pitta', 'kapha'].forEach(function (d) {
    const peso = perfil.doshas[d];
    if (!peso) return;
    pontos -= a.dosha[d] * peso * 1.5;
    if (a.dosha[d] < 0) prol.push('pacifica ' + DOSHAS[d].nome);
    if (a.dosha[d] > 0) contra.push('agrava ' + DOSHAS[d].nome);
  });

  return { alimento: a, pontos: pontos, prol: prol, contra: contra };
}

function buscarPorClima(perfil) {
  const brutos = ALIMENTOS.filter(passaFiltrosBase).map(function (a) {
    return pontuarNoClima(a, perfil);
  });

  const maxAbs = brutos.reduce(function (m, r) { return Math.max(m, Math.abs(r.pontos)); }, 1);
  brutos.forEach(function (r) {
    r.pct = Math.max(0, Math.min(100, Math.round(50 + (r.pontos / maxAbs) * 50)));
  });
  return brutos;
}

function faixaAfinidade(pct) {
  if (pct >= 72) return { rot: 'Muito indicado', cls: 'otimo' };
  if (pct >= 58) return { rot: 'Indicado',       cls: 'bom' };
  if (pct >= 45) return { rot: 'Neutro',         cls: 'neutro' };
  if (pct >= 30) return { rot: 'Moderar',        cls: 'ruim' };
  return { rot: 'Evitar', cls: 'pessimo' };
}

/* ============================== RENDERIZAÇÃO ============================= */

function chipQualidade(q, ativo) {
  return '<button class="chip chip-qual' + (ativo ? ' ativo' : '') + '" data-qual="' + q.id + '" ' +
         'title="' + esc(q.sans + ' — ' + q.desc) + '">' +
         '<span class="chip-nome">' + esc(q.nome) + '</span>' +
         '<span class="chip-sans">' + esc(q.sans) + '</span></button>';
}

function renderChipsQualidades() {
  let html = '';
  for (let i = 0; i < QUALIDADES.length; i += 2) {
    const a = QUALIDADES[i], b = QUALIDADES[i + 1];
    html += '<div class="par">' +
              chipQualidade(a, estado.qualidades.has(a.id)) +
              '<span class="par-vs">ou</span>' +
              chipQualidade(b, estado.qualidades.has(b.id)) +
            '</div>';
  }
  $('#chipsQualidades').innerHTML = html;
}

function renderChipsRasas() {
  $('#chipsRasas').innerHTML = RASAS.map(function (r) {
    return '<button class="chip chip-rasa' + (estado.rasas.has(r.id) ? ' ativo' : '') + '" ' +
           'data-rasa="' + r.id + '" title="' + esc(r.sans + ' (' + r.el + ') — ' + r.desc) + '">' +
           esc(r.nome) + '</button>';
  }).join('');
}

function barrasDosha(a) {
  return ['vata', 'pitta', 'kapha'].map(function (d) {
    const v = a.dosha[d];
    const cls = v < 0 ? 'baixa' : (v > 0 ? 'sobe' : 'igual');
    const sinal = v < 0 ? '↓' : (v > 0 ? '↑' : '=');
    const txt = v < 0 ? 'pacifica' : (v > 0 ? 'agrava' : 'neutro para');
    return '<span class="dosha-tag ' + cls + '" title="' + txt + ' ' + DOSHAS[d].nome + '">' +
           sinal + ' ' + DOSHAS[d].nome + '</span>';
  }).join('');
}

function cardAlimento(a, extra) {
  extra = extra || {};
  const fav = estado.favoritos.has(a.nome);
  const g = gunasDe(a);

  let selo = '';
  if (extra.pct != null) {
    const f = extra.faixa || faixaAfinidade(extra.pct);
    selo = '<div class="selo ' + f.cls + '"><b>' + extra.pct + '%</b><span>' + f.rot + '</span></div>';
  }

  return '<article class="card" data-alimento="' + esc(a.nome) + '">' +
    '<header class="card-topo">' +
      '<div class="card-id">' +
        '<span class="card-icone">' + CATEGORIAS[a.cat].icone + '</span>' +
        '<div><h3>' + esc(a.nome) + '</h3>' +
        '<p class="card-cat">' + esc(CATEGORIAS[a.cat].nome) + '</p></div>' +
      '</div>' + selo +
    '</header>' +
    '<div class="card-gunas">' +
      g.map(function (q) {
        const marc = extra.destacar && extra.destacar.indexOf(q) !== -1 ? ' marcado' : '';
        return '<span class="mini' + (q === 'quente' ? ' quente' : q === 'frio' ? ' frio' : '') + marc + '">' +
               esc(nomeQual(q)) + '</span>';
      }).join('') +
    '</div>' +
    '<div class="card-rasas">' + (a.rasa.length
      ? a.rasa.map(function (r) {
          const marc = extra.destacarRasa && extra.destacarRasa.indexOf(r) !== -1 ? ' marcado' : '';
          return '<span class="mini rasa' + marc + '">' + esc(nomeRasa(r)) + '</span>';
        }).join('')
      : '<span class="mini rasa">sem sabor definido</span>') +
    '</div>' +
    '<div class="card-doshas">' + barrasDosha(a) + '</div>' +
    (extra.motivo ? '<p class="card-motivo">' + esc(extra.motivo) + '</p>' : '') +
    '<footer class="card-rodape">' +
      '<button class="btn-link ver" data-ver="' + esc(a.nome) + '">Ver detalhes</button>' +
      '<button class="btn-fav' + (fav ? ' ativo' : '') + '" data-fav="' + esc(a.nome) + '" ' +
      'title="' + (fav ? 'Remover da lista' : 'Salvar na minha lista') + '">' + (fav ? '★' : '☆') + '</button>' +
    '</footer>' +
  '</article>';
}

/* Ordem em que as categorias aparecem quando os resultados são agrupados:
   a sequência de quem monta um prato, não a ordem alfabética. */
const ORDEM_CAT = ['grao', 'leguminosa', 'vegetal', 'fruta', 'laticinio', 'oleaginosa',
                   'oleo', 'especiaria', 'adocante', 'animal', 'bebida'];

function renderGrade(lista, extraFn) {
  if (!estado.agrupar) {
    return '<div class="grade-cards">' + lista.map(function (r) {
      return cardAlimento(r.alimento, extraFn(r));
    }).join('') + '</div>';
  }

  const grupos = {};
  lista.forEach(function (r) {
    (grupos[r.alimento.cat] = grupos[r.alimento.cat] || []).push(r);
  });

  return ORDEM_CAT.filter(function (c) { return grupos[c]; }).map(function (c) {
    return '<section class="grupo-cat">' +
             '<h4>' + CATEGORIAS[c].icone + ' ' + esc(CATEGORIAS[c].nome) +
             ' <span>' + grupos[c].length + '</span></h4>' +
             '<div class="grade-cards">' + grupos[c].map(function (r) {
               return cardAlimento(r.alimento, extraFn(r));
             }).join('') + '</div>' +
           '</section>';
  }).join('');
}

function vazio(msg, sub) {
  return '<div class="vazio"><p class="vazio-titulo">' + esc(msg) + '</p>' +
         (sub ? '<p class="vazio-sub">' + esc(sub) + '</p>' : '') + '</div>';
}

/* ------------------------- painel: qualidades --------------------------- */

function renderQualidades() {
  const res = buscarPorQualidades();
  const pedidas = Array.from(estado.qualidades);
  const rasasPedidas = Array.from(estado.rasas);
  const alvo = $('#resultadosQualidades');

  let resumo = '';
  if (pedidas.length || rasasPedidas.length) {
    const partes = pedidas.map(nomeQual).concat(rasasPedidas.map(nomeRasa));
    const conector = estado.modoQualidade === 'todas' ? ' + ' : ' ou ';
    resumo = '<p class="resumo-busca">Alimentos <b>' + esc(partes.join(conector)) + '</b>' +
             (estado.dosha ? ' que não agravam <b>' + DOSHAS[estado.dosha].nome + '</b>' : '') +
             ' — <span>' + res.length + ' encontrado' + (res.length === 1 ? '' : 's') + '</span></p>';
  } else {
    resumo = '<p class="resumo-busca">Mostrando toda a base — <span>' + res.length + ' alimentos</span>. ' +
             'Selecione qualidades acima para filtrar.</p>';
  }

  $('#resumoQualidades').innerHTML = resumo;

  if (!res.length) {
    alvo.innerHTML = vazio('Nenhum alimento reúne todas essas qualidades.',
      'Tente o modo "qualquer uma" ou remova alguma qualidade — combinações como Pesado + Seco + Penetrante são raras na natureza.');
    return;
  }

  alvo.innerHTML = res.map(function (r) {
    return cardAlimento(r.alimento, {
      pct: (pedidas.length + rasasPedidas.length) && estado.modoQualidade === 'qualquer' ? r.pct : null,
      faixa: { rot: r.total + ' de ' + (pedidas.length + rasasPedidas.length), cls: 'bom' },
      destacar: r.casadas,
      destacarRasa: r.rasaCasadas
    });
  }).join('');
}

/* ---------------------------- painel: clima ----------------------------- */

function renderClima() {
  const c = estado.clima;
  const perfil = perfilClimatico(c.temp, c.umid, c.vento);

  $('#valTemp').textContent = c.temp + '°C';
  $('#valUmid').textContent = c.umid + '%';
  $('#sliderTemp').value = c.temp;
  $('#sliderUmid').value = c.umid;
  $('#checkVento').checked = c.vento;

  $$('#chipsEstacoes .chip').forEach(function (b) {
    b.classList.toggle('ativo', b.dataset.estacao === estado.estacao);
  });

  const doshasSubindo = ['vata', 'pitta', 'kapha'].filter(function (d) { return perfil.doshas[d] > 0; });

  const diagnostico =
    '<div class="clima-cabecalho">' +
      '<div>' +
        '<p class="clima-rotulo">Leitura ayurvédica do clima</p>' +
        '<h3 class="clima-nome">' + esc(perfil.nome) + '</h3>' +
      '</div>' +
      '<div class="clima-doshas">' +
        (doshasSubindo.length
          ? doshasSubindo.map(function (d) {
              return '<span class="dosha-pill ' + d + '">' + DOSHAS[d].icone + ' ' + DOSHAS[d].nome +
                     ' <b>↑</b></span>';
            }).join('')
          : '<span class="dosha-pill neutro">Nenhum dosha em alta</span>') +
      '</div>' +
    '</div>' +
    '<p class="clima-texto">' + esc(textoClima(perfil, doshasSubindo)) + '</p>' +
    '<div class="clima-listas">' +
      blocoQualidades('Buscar estas qualidades', perfil.favorecer, 'fav') +
      blocoQualidades('Reduzir estas qualidades', perfil.evitar, 'evi') +
      blocoSabores('Sabores que equilibram', perfil.rasaFav, 'fav') +
      blocoSabores('Sabores a moderar', perfil.rasaEvit, 'evi') +
      (perfil.ambivalentes.length
        ? blocoQualidades('Depende do contexto', perfil.ambivalentes, 'amb')
        : '') +
    '</div>';

  $('#diagnosticoClima').innerHTML = diagnostico;

  const todos = buscarPorClima(perfil);
  const bons = todos.filter(function (r) { return r.pontos > 0; });
  const ruins = todos.filter(function (r) { return r.pontos < 0; });

  ordenar(bons, function (r) { return r.pontos; });
  ruins.sort(function (a, b) { return a.pontos - b.pontos; });

  $('#tituloRecomendados').textContent = 'Coma isto — ' + bons.length + ' alimento' + (bons.length === 1 ? '' : 's');

  $('#resultadosClima').innerHTML = bons.length
    ? renderGrade(bons, function (r) {
        return {
          pct: r.pct,
          destacar: gunasDe(r.alimento).filter(function (q) { return perfil.favorecer.indexOf(q) !== -1; }),
          destacarRasa: r.alimento.rasa.filter(function (x) { return perfil.rasaFav.indexOf(x) !== -1; }),
          motivo: r.prol.length ? 'A favor: ' + r.prol.slice(0, 4).join(', ') + '.' : ''
        };
      })
    : '<div class="grade-cards">' +
      vazio('Nenhum alimento se destaca com os filtros atuais.', 'Limpe a categoria ou o dosha selecionado.') +
      '</div>';

  $('#tituloEvitar').textContent = 'Modere ou evite — ' + ruins.length + ' alimento' + (ruins.length === 1 ? '' : 's');
  $('#resultadosEvitar').innerHTML = estado.mostrarEvitar
    ? (ruins.length
        ? renderGrade(ruins, function (r) {
            return {
              pct: r.pct,
              motivo: r.contra.length ? 'Contra: ' + r.contra.slice(0, 4).join(', ') + '.' : ''
            };
          })
        : '<div class="grade-cards">' + vazio('Nada a evitar por aqui.') + '</div>')
    : '';
  $('#blocoEvitar').classList.toggle('aberto', estado.mostrarEvitar);
  $('#btnEvitar').textContent = estado.mostrarEvitar ? 'Ocultar lista' : 'Mostrar lista';
}

function textoClima(perfil, doshasSubindo) {
  const partes = [];
  if (perfil.termica === 'quente') partes.push('o calor externo soma-se ao fogo interno');
  if (perfil.termica === 'frio')   partes.push('o frio externo apaga o fogo digestivo e contrai os tecidos');
  if (perfil.hidrica === 'seco')   partes.push('o ar seco puxa umidade da pele, das mucosas e do intestino');
  if (perfil.hidrica === 'umido')  partes.push('a umidade do ar dificulta a evaporação e pesa sobre a digestão');
  if (perfil.vento)                partes.push('o vento acrescenta movimento e irregularidade');

  if (!partes.length) {
    return 'Clima neutro: nada no ambiente força um desequilíbrio. Este é o momento de comer segundo a sua ' +
           'própria constituição e não segundo o tempo lá fora.';
  }

  const causa = partes.join('; ') + '.';
  const efeito = doshasSubindo.length
    ? ' Isso tende a elevar ' + doshasSubindo.map(function (d) { return DOSHAS[d].nome; }).join(' e ') + '.'
    : '';
  const remedio = ' O prato deve oferecer o oposto: ' +
    perfil.favorecer.map(nomeQual).join(', ').toLowerCase() + '.';

  return causa.charAt(0).toUpperCase() + causa.slice(1) + efeito + remedio;
}

function blocoQualidades(titulo, ids, tipo) {
  if (!ids.length) return '';
  return '<div class="bloco-lista ' + tipo + '"><h4>' + esc(titulo) + '</h4><div class="linha-chips">' +
    ids.map(function (id) {
      const q = MAPA_QUALIDADE[id];
      return '<button class="mini-acao" data-usar-qual="' + id + '" title="' +
             esc(q ? q.sans + ' — ' + q.desc : '') + '">' + esc(nomeQual(id)) + '</button>';
    }).join('') + '</div></div>';
}

function blocoSabores(titulo, ids, tipo) {
  if (!ids.length) return '';
  return '<div class="bloco-lista ' + tipo + '"><h4>' + esc(titulo) + '</h4><div class="linha-chips">' +
    ids.map(function (id) {
      const r = MAPA_RASA[id];
      return '<span class="mini-acao estatico" title="' + esc(r ? r.desc : '') + '">' +
             esc(nomeRasa(id)) + '</span>';
    }).join('') + '</div></div>';
}

/* ---------------------------- painel: guia ------------------------------ */

function renderGuia() {
  $('#guiaQualidades').innerHTML = QUALIDADES.map(function (q) {
    return '<div class="verbete"><h4>' + esc(q.nome) + ' <span>' + esc(q.sans) + '</span></h4>' +
           '<p>' + esc(q.desc) + '</p>' +
           '<p class="oposto">Oposto: ' + esc(nomeQual(q.oposto)) + '</p></div>';
  }).join('');

  $('#guiaRasas').innerHTML = RASAS.map(function (r) {
    const ef = ['vata', 'pitta', 'kapha'].map(function (d) {
      const v = r.efeito[d];
      return '<span class="dosha-tag ' + (v < 0 ? 'baixa' : 'sobe') + '">' +
             (v < 0 ? '↓' : '↑') + ' ' + DOSHAS[d].nome + '</span>';
    }).join('');
    return '<div class="verbete"><h4>' + esc(r.nome) + ' <span>' + esc(r.sans) + '</span></h4>' +
           '<p class="elementos">' + esc(r.el) + '</p><p>' + esc(r.desc) + '</p>' +
           '<div class="card-doshas">' + ef + '</div></div>';
  }).join('');

  $('#guiaDoshas').innerHTML = Object.keys(DOSHAS).map(function (d) {
    const o = DOSHAS[d];
    return '<div class="verbete dosha-' + d + '"><h4>' + o.icone + ' ' + esc(o.nome) +
           ' <span>' + esc(o.el) + '</span></h4><p>' + esc(o.desc) + '</p>' +
           '<div class="linha-chips">' + o.qualidades.map(function (q) {
             return '<span class="mini">' + esc(nomeQual(q)) + '</span>';
           }).join('') + '</div>' +
           '<button class="btn-secundario" data-equilibrar="' + d + '">Ver alimentos que equilibram ' +
           esc(o.nome) + '</button></div>';
  }).join('');
}

/* -------------------------- lista do usuário ---------------------------- */

function renderFavoritos() {
  const nomes = Array.from(estado.favoritos);
  $('#contadorFav').textContent = nomes.length;
  $('#btnLista').classList.toggle('tem', nomes.length > 0);

  const itens = ALIMENTOS.filter(function (a) { return estado.favoritos.has(a.nome); });
  itens.sort(function (a, b) {
    const c = CATEGORIAS[a.cat].nome.localeCompare(CATEGORIAS[b.cat].nome, 'pt');
    return c !== 0 ? c : a.nome.localeCompare(b.nome, 'pt');
  });

  if (!itens.length) {
    $('#conteudoLista').innerHTML = vazio('Sua lista está vazia.',
      'Toque na estrela de qualquer alimento para montar sua lista de compras.');
    return;
  }

  let html = '', catAtual = '';
  itens.forEach(function (a) {
    if (a.cat !== catAtual) {
      if (catAtual) html += '</ul>';
      catAtual = a.cat;
      html += '<h4 class="lista-cat">' + CATEGORIAS[a.cat].icone + ' ' + esc(CATEGORIAS[a.cat].nome) + '</h4><ul class="lista-itens">';
    }
    html += '<li><span>' + esc(a.nome) + '</span>' +
            '<button class="btn-x" data-remover="' + esc(a.nome) + '" title="Remover">×</button></li>';
  });
  html += '</ul>';
  $('#conteudoLista').innerHTML = html;
}

function textoDaLista() {
  const itens = ALIMENTOS.filter(function (a) { return estado.favoritos.has(a.nome); });
  const porCat = {};
  itens.forEach(function (a) {
    (porCat[a.cat] = porCat[a.cat] || []).push(a.nome);
  });
  return 'Lista de compras — Rasoi\n\n' + Object.keys(porCat).map(function (c) {
    return CATEGORIAS[c].nome + '\n' + porCat[c].map(function (n) { return '- ' + n; }).join('\n');
  }).join('\n\n');
}

/* ------------------------------- detalhe -------------------------------- */

function abrirDetalhe(nome) {
  const a = ALIMENTOS.find(function (x) { return x.nome === nome; });
  if (!a) return;

  const perfil = perfilClimatico(estado.clima.temp, estado.clima.umid, estado.clima.vento);
  const noClima = pontuarNoClima(a, perfil);
  const maxRef = buscarPorClima(perfil).reduce(function (m, r) { return Math.max(m, Math.abs(r.pontos)); }, 1);
  const pct = Math.max(0, Math.min(100, Math.round(50 + (noClima.pontos / maxRef) * 50)));
  const faixa = faixaAfinidade(pct);

  $('#detalheConteudo').innerHTML =
    '<header class="detalhe-topo">' +
      '<span class="detalhe-icone">' + CATEGORIAS[a.cat].icone + '</span>' +
      '<div><h2>' + esc(a.nome) + '</h2><p>' + esc(CATEGORIAS[a.cat].nome) + '</p></div>' +
    '</header>' +

    '<section class="detalhe-secao">' +
      '<h3>Potência térmica <span>virya</span></h3>' +
      '<p class="virya-' + a.virya + '">' + (a.virya === 'quente' ? '🔥 Quente (ushna)' : '❄️ Fria (shita)') +
      ' — ' + (a.virya === 'quente'
        ? 'aquece o corpo, acende o agni e aumenta a circulação.'
        : 'refresca o corpo, acalma a inflamação e desacelera a digestão.') + '</p>' +
    '</section>' +

    '<section class="detalhe-secao">' +
      '<h3>Qualidades <span>gunas</span></h3>' +
      '<div class="verbetes-mini">' + gunasDe(a).map(function (q) {
        const o = MAPA_QUALIDADE[q];
        return '<div class="verbete-mini"><b>' + esc(o.nome) + '</b> <i>' + esc(o.sans) + '</i>' +
               '<p>' + esc(o.desc) + '</p></div>';
      }).join('') + '</div>' +
    '</section>' +

    (a.rasa.length ? '<section class="detalhe-secao">' +
      '<h3>Sabores <span>rasa</span></h3>' +
      '<div class="verbetes-mini">' + a.rasa.map(function (r) {
        const o = MAPA_RASA[r];
        return '<div class="verbete-mini"><b>' + esc(o.nome) + '</b> <i>' + esc(o.sans) + ' · ' + esc(o.el) + '</i>' +
               '<p>' + esc(o.desc) + '</p></div>';
      }).join('') + '</div></section>' : '') +

    '<section class="detalhe-secao">' +
      '<h3>Efeito sobre os doshas</h3>' +
      '<div class="detalhe-doshas">' + ['vata', 'pitta', 'kapha'].map(function (d) {
        const v = a.dosha[d];
        const cls = v < 0 ? 'baixa' : (v > 0 ? 'sobe' : 'igual');
        const txt = v < 0 ? 'Reduz / pacifica' : (v > 0 ? 'Aumenta / agrava' : 'Neutro');
        return '<div class="dosha-linha ' + cls + '">' +
               '<span class="dl-nome">' + DOSHAS[d].icone + ' ' + DOSHAS[d].nome + '</span>' +
               '<span class="dl-barra"><i style="width:' + (v === 0 ? 50 : v < 0 ? 20 : 85) + '%"></i></span>' +
               '<span class="dl-txt">' + txt + '</span></div>';
      }).join('') + '</div>' +
    '</section>' +

    '<section class="detalhe-secao destaque">' +
      '<h3>Como usar</h3><p>' + esc(a.dica) + '</p>' +
    '</section>' +

    '<section class="detalhe-secao">' +
      '<h3>No clima selecionado <span>' + esc(perfil.nome).toLowerCase() + '</span></h3>' +
      '<div class="afinidade ' + faixa.cls + '"><b>' + pct + '%</b><span>' + faixa.rot + '</span></div>' +
      (noClima.prol.length ? '<p><b>A favor:</b> ' + esc(noClima.prol.join(', ')) + '.</p>' : '') +
      (noClima.contra.length ? '<p><b>Contra:</b> ' + esc(noClima.contra.join(', ')) + '.</p>' : '') +
    '</section>' +

    '<footer class="detalhe-rodape">' +
      '<button class="btn-primario" data-fav="' + esc(a.nome) + '">' +
      (estado.favoritos.has(a.nome) ? '★ Remover da minha lista' : '☆ Salvar na minha lista') + '</button>' +
    '</footer>';

  $('#detalhe').showModal();
}

/* ============================== EVENTOS ================================= */

function trocarAba(aba) {
  estado.aba = aba;
  $$('.aba').forEach(function (b) { b.classList.toggle('ativa', b.dataset.aba === aba); });
  $$('.painel').forEach(function (p) { p.hidden = p.dataset.painel !== aba; });
  if (aba === 'clima') renderClima();
  if (aba === 'qualidades') renderQualidades();
}

function alternarQualidade(id) {
  const q = MAPA_QUALIDADE[id];
  if (estado.qualidades.has(id)) {
    estado.qualidades.delete(id);
  } else {
    estado.qualidades.add(id);
    estado.qualidades.delete(q.oposto);   /* não faz sentido pedir uma coisa e o seu oposto */
  }
  renderChipsQualidades();
  renderQualidades();
}

function aplicarEstacao(id) {
  const e = ESTACOES.find(function (x) { return x.id === id; });
  if (!e) return;
  estado.estacao = id;
  estado.clima = { temp: e.temp, umid: e.umid, vento: e.vento };
  renderClima();
}

function sincronizarEstacao() {
  const c = estado.clima;
  const igual = ESTACOES.find(function (e) {
    return e.temp === c.temp && e.umid === c.umid && e.vento === c.vento;
  });
  estado.estacao = igual ? igual.id : null;
}

function alternarFavorito(nome) {
  if (estado.favoritos.has(nome)) estado.favoritos.delete(nome);
  else estado.favoritos.add(nome);
  salvarFavoritos();
  renderFavoritos();
  redesenharAtual();
  if ($('#detalhe').open) {
    const btn = $('#detalheConteudo [data-fav]');
    if (btn) btn.textContent = estado.favoritos.has(nome) ? '★ Remover da minha lista' : '☆ Salvar na minha lista';
  }
}

function redesenharAtual() {
  if (estado.aba === 'qualidades') renderQualidades();
  else if (estado.aba === 'clima') renderClima();
}

function aplicarTema() {
  document.documentElement.dataset.tema = estado.tema;
  $('#btnTema').textContent = estado.tema === 'escuro' ? '☀️' : '🌙';
}

function init() {
  aplicarTema();

  /* estações */
  $('#chipsEstacoes').innerHTML = ESTACOES.map(function (e) {
    return '<button class="chip chip-estacao" data-estacao="' + e.id + '" title="' + esc(e.nota) + '">' +
           e.icone + ' ' + esc(e.nome) + '</button>';
  }).join('');

  /* categorias */
  $('#filtroCategoria').innerHTML = '<option value="">Todas as categorias</option>' +
    Object.keys(CATEGORIAS).map(function (c) {
      return '<option value="' + c + '">' + CATEGORIAS[c].icone + '  ' + esc(CATEGORIAS[c].nome) + '</option>';
    }).join('');

  renderChipsQualidades();
  renderChipsRasas();
  renderGuia();
  renderFavoritos();
  renderQualidades();
  renderClima();

  /* --- delegação global de cliques --- */
  document.addEventListener('click', function (ev) {
    const t = ev.target.closest('[data-qual],[data-rasa],[data-aba],[data-estacao],[data-fav],[data-ver],' +
                                '[data-remover],[data-usar-qual],[data-equilibrar]');
    if (!t) return;

    if (t.dataset.qual)      return alternarQualidade(t.dataset.qual);
    if (t.dataset.rasa)      {
      const r = t.dataset.rasa;
      estado.rasas.has(r) ? estado.rasas.delete(r) : estado.rasas.add(r);
      renderChipsRasas(); return renderQualidades();
    }
    if (t.dataset.aba)       return trocarAba(t.dataset.aba);
    if (t.dataset.estacao)   return aplicarEstacao(t.dataset.estacao);
    if (t.dataset.fav)       return alternarFavorito(t.dataset.fav);
    if (t.dataset.ver)       return abrirDetalhe(t.dataset.ver);
    if (t.dataset.remover)   return alternarFavorito(t.dataset.remover);
    if (t.dataset.usarQual)  {
      estado.qualidades.clear();
      estado.qualidades.add(t.dataset.usarQual);
      estado.modoQualidade = 'todas';
      $('#modoTodas').checked = true;
      renderChipsQualidades();
      trocarAba('qualidades');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (t.dataset.equilibrar) {
      estado.dosha = t.dataset.equilibrar;
      $('#filtroDosha').value = estado.dosha;
      estado.qualidades.clear();
      renderChipsQualidades();
      trocarAba('qualidades');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  });

  /* --- controles --- */
  $$('input[name=modo]').forEach(function (r) {
    r.addEventListener('change', function () {
      estado.modoQualidade = r.value;
      renderQualidades();
    });
  });

  $('#busca').addEventListener('input', function (e) {
    estado.busca = e.target.value;
    redesenharAtual();
  });

  $('#filtroCategoria').addEventListener('change', function (e) {
    estado.categoria = e.target.value;
    redesenharAtual();
  });

  $('#filtroDosha').addEventListener('change', function (e) {
    estado.dosha = e.target.value;
    redesenharAtual();
  });

  $('#filtroOrdem').addEventListener('change', function (e) {
    estado.ordem = e.target.value;
    redesenharAtual();
  });

  $('#btnLimpar').addEventListener('click', function () {
    estado.qualidades.clear();
    estado.rasas.clear();
    estado.categoria = ''; estado.dosha = ''; estado.busca = '';
    $('#filtroCategoria').value = ''; $('#filtroDosha').value = ''; $('#busca').value = '';
    renderChipsQualidades(); renderChipsRasas(); redesenharAtual();
  });

  $('#sliderTemp').addEventListener('input', function (e) {
    estado.clima.temp = +e.target.value;
    sincronizarEstacao();
    renderClima();
  });

  $('#sliderUmid').addEventListener('input', function (e) {
    estado.clima.umid = +e.target.value;
    sincronizarEstacao();
    renderClima();
  });

  $('#checkVento').addEventListener('change', function (e) {
    estado.clima.vento = e.target.checked;
    sincronizarEstacao();
    renderClima();
  });

  $('#checkAgrupar').addEventListener('change', function (e) {
    estado.agrupar = e.target.checked;
    renderClima();
  });

  $('#btnEvitar').addEventListener('click', function () {
    estado.mostrarEvitar = !estado.mostrarEvitar;
    renderClima();
  });

  $('#btnTema').addEventListener('click', function () {
    estado.tema = estado.tema === 'escuro' ? 'claro' : 'escuro';
    localStorage.setItem(LS.tema, estado.tema);
    aplicarTema();
  });

  $('#btnLista').addEventListener('click', function () { $('#lista').showModal(); });
  $('#fecharLista').addEventListener('click', function () { $('#lista').close(); });
  $('#fecharDetalhe').addEventListener('click', function () { $('#detalhe').close(); });

  $('#btnCopiar').addEventListener('click', function () {
    const txt = textoDaLista();
    navigator.clipboard.writeText(txt).then(function () {
      $('#btnCopiar').textContent = 'Copiado!';
      setTimeout(function () { $('#btnCopiar').textContent = 'Copiar lista'; }, 1600);
    }).catch(function () {
      window.prompt('Copie sua lista:', txt);
    });
  });

  $('#btnEsvaziar').addEventListener('click', function () {
    if (!estado.favoritos.size) return;
    if (!window.confirm('Remover todos os itens da sua lista?')) return;
    estado.favoritos.clear();
    salvarFavoritos();
    renderFavoritos();
    redesenharAtual();
  });

  /* fechar diálogo clicando fora */
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (ev) { if (ev.target === d) d.close(); });
  });
}

document.addEventListener('DOMContentLoaded', init);
