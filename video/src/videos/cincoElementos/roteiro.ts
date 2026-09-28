import type { Elemento } from "../../tema";

/* ==========================================================================
   Tema 1 - Os cinco elementos (pancha mahabhuta)
   --------------------------------------------------------------------------
   Todo o texto do vídeo está aqui. As qualidades de cada elemento são ids
   do app (js/data.js); o nome exibido vem de lá.
   ========================================================================== */

export const GANCHO = ["Tudo o que", "você come é", "feito de", "cinco coisas."];

export const NOME = {
  chamada: "O Ayurveda chama de",
  devanagari: "पञ्च महाभूत",
  transliteracao: "pancha mahabhuta",
  traducao: "os cinco grandes elementos",
  ressalva1: "Não é química.",
  ressalva2: "É um jeito de descrever como tudo se comporta.",
};

export type RoteiroElemento = {
  nome: string;
  sanscrito: string;
  devanagari: string;
  essencia: string;
  sentido: string;
  qualidades: string[];
  corpo: string;
  prato: string;
};

export const ELEMENTO: Record<Elemento, RoteiroElemento> = {
  eter: {
    nome: "Éter",
    sanscrito: "Akasha",
    devanagari: "आकाश",
    essencia: "o espaço",
    sentido: "audição",
    qualidades: ["leve", "sutil", "claro"],
    corpo: "Os espaços vazios: boca, pulmões, intestino.",
    prato: "O sabor amargo, das folhas escuras.",
  },
  ar: {
    nome: "Ar",
    sanscrito: "Vayu",
    devanagari: "वायु",
    essencia: "o movimento",
    sentido: "tato",
    qualidades: ["leve", "seco", "frio", "movel"],
    corpo: "Respiração, circulação, os impulsos dos nervos.",
    prato: "O que é seco e cru: torradas, folhas cruas, feijão.",
  },
  fogo: {
    nome: "Fogo",
    sanscrito: "Agni",
    devanagari: "अग्नि",
    essencia: "a transformação",
    sentido: "visão",
    qualidades: ["quente", "penetrante", "leve"],
    corpo: "Digestão, temperatura, fome e raciocínio.",
    prato: "O picante e o ácido: gengibre, pimenta, limão.",
  },
  agua: {
    nome: "Água",
    sanscrito: "Jala",
    devanagari: "जल",
    essencia: "a coesão",
    sentido: "paladar",
    qualidades: ["frio", "liquido", "oleoso", "macio"],
    corpo: "Sangue, saliva, a lubrificação das juntas.",
    prato: "O doce e o salgado: frutas suculentas, leite, pepino.",
  },
  terra: {
    nome: "Terra",
    sanscrito: "Prithvi",
    devanagari: "पृथ्वी",
    essencia: "a estrutura",
    sentido: "olfato",
    qualidades: ["pesado", "estavel", "denso"],
    corpo: "Ossos, músculos, unhas, dentes.",
    prato: "Raízes, grãos e castanhas: batata-doce, arroz, amêndoa.",
  },
};

/* as palavras em destaque ganham a cor do éter e da terra */
export const SINTESE = { de: "Do mais", sutil: "sutil", ate: "ao mais", denso: "denso." };

export const SABORES = {
  linha1: "Cada sabor nasce",
  linha2: "de dois elementos.",
  /* a ordem segue o app; os pares de elementos vêm de js/data.js */
  ordem: ["doce", "acido", "salgado", "picante", "amargo", "adstringente"],
};

export const FECHO = {
  linha1: "Junte dois elementos",
  linha2: "e nasce um dosha.",
  dosha: "vata" as const,
  proximo: "Próximo vídeo",
  proximoTema: "os três doshas",
  cta: "link na bio",
};
