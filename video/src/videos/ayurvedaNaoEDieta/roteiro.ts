/* ==========================================================================
   Tema 00 - Ayurveda não é uma dieta
   --------------------------------------------------------------------------
   Todo o texto do vídeo está aqui. Roteiro: video/roteiros/00-ayurveda-nao-e-dieta.md
   ========================================================================== */

export const GANCHO = {
  linha1: ["Ayurveda não é", "uma dieta."],
  linha2: ["É o conhecimento", "dos ritmos da vida."],
};

export const NOME = {
  palavra: "आयुर्वेद",
  partes: [
    { devanagari: "आयुः", translit: "Āyus", sentido: "vida, longevidade" },
    { devanagari: "वेद", translit: "Veda", sentido: "conhecimento" },
  ],
  resultado: "a ciência da vida",
};

/* Charaka, Sū. 1.42: a vida é a união de corpo, sentidos, mente e consciência */
export const UNIAO = {
  titulo: ["E vida, aqui,", "é a união de:"],
  partes: [
    { nome: "corpo", sans: "sharira" },
    { nome: "sentidos", sans: "indriya" },
    { nome: "mente", sans: "sattva" },
    { nome: "consciência", sans: "atma" },
  ],
};

/* Do pulso mais rápido ao mais lento: é a ordem dos anéis, de dentro para fora */
export const PULSOS = {
  titulo: ["Tudo o que é vivo", "pulsa."],
  ciclos: [
    { nome: "a digestão", escala: "horas" },
    { nome: "o sono", escala: "uma noite" },
    { nome: "dia e noite", escala: "um dia" },
    { nome: "as estações", escala: "um ano" },
    { nome: "as fases da vida", escala: "uma vida" },
  ],
};

export const FORCAS_TXT = {
  titulo: ["Cada pulso alterna", "três forças:"],
  forcas: [
    { forca: "umidade", dosha: "Kapha" },
    { forca: "calor", dosha: "Pitta" },
    { forca: "pressão", dosha: "Vata" },
  ],
};

export const ALINHAR = {
  titulo: ["Quando o seu ritmo", "acompanha o de fora,"],
  dentro: "você",
  fora: "o mundo",
  frutos: [
    { antes: "a digestão", depois: "funciona," },
    { antes: "o sono", depois: "reconstrói," },
    { antes: "a mente", depois: "clareia." },
  ],
};

/* Charaka, Sū. 30.26 */
export const OBJETIVOS = {
  titulo: "Por isso o Ayurveda tem dois objetivos.",
  ordem: "Nessa ordem:",
  itens: [
    { texto: "proteger a saúde de quem está bem", sutra: "स्वस्थस्य स्वास्थ्यरक्षणम्" },
    { texto: "acalmar o desequilíbrio de quem adoeceu", sutra: "आतुरस्य विकारप्रशमनम्" },
  ],
  fonte: "Charaka Samhita · Sutrasthana 30.26",
};

export const FECHO = {
  rotulo: "Experimento de hoje",
  experimento: ["Repare a que horas", "a fome aparece sozinha."],
  proximo: "Próximo vídeo",
  proximoTema: "os cinco elementos",
  cta: "link na bio",
};
