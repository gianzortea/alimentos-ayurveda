/* ==========================================================================
   RASOI - Base de dados ayurvédica de alimentos
   --------------------------------------------------------------------------
   Modelo de cada alimento:
     nome   : nome usual em português
     cat    : categoria (chave de CATEGORIAS)
     rasa   : sabores predominantes (os 6 rasas)
     virya  : potência térmica - 'quente' (ushna) ou 'frio' (shita)
     gunas  : qualidades físicas além da térmica (a térmica vem do virya)
     dosha  : efeito sobre cada dosha  -1 = pacifica | 0 = neutro | +1 = agrava
     dica   : orientação prática de preparo/uso
   ========================================================================== */

const QUALIDADES = [
  { id: 'pesado',     nome: 'Pesado',      sans: 'Guru',      oposto: 'leve',       desc: 'Nutre, satisfaz, dá peso e estabilidade. Pesa na digestão.' },
  { id: 'leve',       nome: 'Leve',        sans: 'Laghu',     oposto: 'pesado',     desc: 'Fácil de digerir, desobstrui, alivia. Pode não sustentar.' },
  { id: 'quente',     nome: 'Quente',      sans: 'Ushna',     oposto: 'frio',       desc: 'Aquece, acende o fogo digestivo (agni), dilata e move.' },
  { id: 'frio',       nome: 'Frio',        sans: 'Shita',     oposto: 'quente',     desc: 'Refresca, acalma inflamação, contrai. Reduz o agni.' },
  { id: 'oleoso',     nome: 'Oleoso',      sans: 'Snigdha',   oposto: 'seco',       desc: 'Lubrifica, amacia, hidrata os tecidos, dá untuosidade.' },
  { id: 'seco',       nome: 'Seco',        sans: 'Ruksha',    oposto: 'oleoso',     desc: 'Absorve, enxuga, adstringe. Em excesso, resseca.' },
  { id: 'penetrante', nome: 'Penetrante',  sans: 'Tikshna',   oposto: 'suave',      desc: 'Agudo e rápido: abre canais, queima, estimula.' },
  { id: 'suave',      nome: 'Suave',       sans: 'Manda',     oposto: 'penetrante', desc: 'Lento e gentil, age aos poucos, acalma.' },
  { id: 'liquido',    nome: 'Líquido',     sans: 'Drava',     oposto: 'denso',      desc: 'Hidrata, dissolve, distribui. Bom contra a secura.' },
  { id: 'denso',      nome: 'Denso',       sans: 'Sandra',    oposto: 'liquido',    desc: 'Compacto e concentrado, constrói massa e firmeza.' },
  { id: 'movel',      nome: 'Móvel',       sans: 'Chala',     oposto: 'estavel',    desc: 'Estimula movimento, circulação e eliminação.' },
  { id: 'estavel',    nome: 'Estável',     sans: 'Sthira',    oposto: 'movel',      desc: 'Ancora, sustenta, dá firmeza e continuidade.' },
  { id: 'macio',      nome: 'Macio',       sans: 'Slakshna',  oposto: 'aspero',     desc: 'Liso e cremoso, acalma mucosas e tecidos.' },
  { id: 'aspero',     nome: 'Áspero',      sans: 'Khara',     oposto: 'macio',      desc: 'Fibroso e raspante, limpa e esfrega os canais.' },
  { id: 'viscoso',    nome: 'Viscoso',     sans: 'Picchila',  oposto: 'claro',      desc: 'Pegajoso e mucilaginoso, protege e adere.' },
  { id: 'claro',      nome: 'Claro',       sans: 'Vishada',   oposto: 'viscoso',    desc: 'Limpa, desengordura, deixa leve e sem resíduo.' },
  { id: 'sutil',      nome: 'Sutil',       sans: 'Sukshma',   oposto: 'grosseiro',  desc: 'Chega aos canais mais finos, penetra profundo.' },
  { id: 'grosseiro',  nome: 'Grosseiro',   sans: 'Sthula',    oposto: 'sutil',      desc: 'Volumoso, atua no plano físico grosso, dá saciedade.' }
];

const RASAS = [
  { id: 'doce',        nome: 'Doce',        sans: 'Madhura', el: 'Terra + Água',  efeito: { vata: -1, pitta: -1, kapha:  1 }, desc: 'Nutre, constrói tecidos, acalma. Em excesso: peso e muco.' },
  { id: 'acido',       nome: 'Ácido',       sans: 'Amla',    el: 'Terra + Fogo',  efeito: { vata: -1, pitta:  1, kapha:  1 }, desc: 'Desperta o apetite, aquece, dá sabor. Em excesso: acidez.' },
  { id: 'salgado',     nome: 'Salgado',     sans: 'Lavana',  el: 'Água + Fogo',   efeito: { vata: -1, pitta:  1, kapha:  1 }, desc: 'Hidrata, amolece, retém água. Em excesso: inchaço.' },
  { id: 'picante',     nome: 'Picante',     sans: 'Katu',    el: 'Fogo + Ar',     efeito: { vata:  1, pitta:  1, kapha: -1 }, desc: 'Acende o agni, seca, abre canais. Em excesso: irritação.' },
  { id: 'amargo',      nome: 'Amargo',      sans: 'Tikta',   el: 'Ar + Éter',     efeito: { vata:  1, pitta: -1, kapha: -1 }, desc: 'Depura, refresca, desintoxica. Em excesso: secura.' },
  { id: 'adstringente',nome: 'Adstringente',sans: 'Kashaya', el: 'Ar + Terra',    efeito: { vata:  1, pitta: -1, kapha: -1 }, desc: 'Contrai, seca, firma os tecidos. Em excesso: prisão de ventre.' }
];

const CATEGORIAS = {
  grao:        { nome: 'Grãos e cereais',       icone: '🌾' },
  leguminosa:  { nome: 'Leguminosas',           icone: '🫘' },
  vegetal:     { nome: 'Vegetais',              icone: '🥬' },
  fruta:       { nome: 'Frutas',                icone: '🍎' },
  laticinio:   { nome: 'Laticínios',            icone: '🥛' },
  oleaginosa:  { nome: 'Oleaginosas e sementes',icone: '🥜' },
  oleo:        { nome: 'Óleos e gorduras',      icone: '🫒' },
  especiaria:  { nome: 'Especiarias e ervas',   icone: '🌿' },
  adocante:    { nome: 'Adoçantes',             icone: '🍯' },
  animal:      { nome: 'Proteínas animais',     icone: '🍳' },
  bebida:      { nome: 'Bebidas',               icone: '🍵' }
};

const DOSHAS = {
  vata:  { nome: 'Vata',  el: 'Ar + Éter',    icone: '🌬️', qualidades: ['seco','leve','frio','aspero','sutil','movel'],
           desc: 'Seco, leve, frio, móvel. Governa o movimento, o sistema nervoso e a eliminação.' },
  pitta: { nome: 'Pitta', el: 'Fogo + Água',  icone: '🔥', qualidades: ['quente','penetrante','oleoso','leve','liquido','movel'],
           desc: 'Quente, penetrante, oleoso. Governa a digestão, o metabolismo e a transformação.' },
  kapha: { nome: 'Kapha', el: 'Água + Terra', icone: '💧', qualidades: ['pesado','frio','oleoso','macio','estavel','viscoso','denso'],
           desc: 'Pesado, frio, úmido, estável. Governa a estrutura, a lubrificação e a imunidade.' }
};
