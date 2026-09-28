/* Ponte para os dados do app Rasoi (../js). O vídeo lê as mesmas
   qualidades, sabores e alimentos que o site: se um dado mudar lá, o vídeo
   acompanha no próximo render, e os dois nunca se contradizem. */

import dados from "../../js/data.js";
import base from "../../js/alimentos.js";
import type { Elemento } from "./tema";

export const { QUALIDADES, RASAS, CATEGORIAS, DOSHAS } = dados;
export const { ALIMENTOS } = base;

/* No app os elementos de cada sabor vêm como texto ("Terra + Água").
   Aqui viram as chaves dos glifos. */
const NOME_PARA_ELEMENTO: Record<string, Elemento> = {
  "Éter": "eter",
  "Ar": "ar",
  "Fogo": "fogo",
  "Água": "agua",
  "Terra": "terra",
};

function lerPar(texto: string, origem: string): [Elemento, Elemento] {
  const partes = texto.split("+").map((s) => NOME_PARA_ELEMENTO[s.trim()]);
  if (partes.length !== 2 || partes.some((p) => !p)) {
    throw new Error(`Elementos de "${origem}" fora do formato esperado: ${texto}`);
  }
  return [partes[0], partes[1]];
}

export function elementosDoSabor(id: string): [Elemento, Elemento] {
  const rasa = RASAS.find((r) => r.id === id);
  if (!rasa) throw new Error(`Sabor desconhecido no app: ${id}`);
  return lerPar(rasa.el, id);
}

export function elementosDoDosha(id: "vata" | "pitta" | "kapha"): [Elemento, Elemento] {
  return lerPar(DOSHAS[id].el, id);
}

/** Nome da qualidade como o app exibe, em minúsculas para os chips. */
export function nomeQualidade(id: string): string {
  const q = QUALIDADES.find((x) => x.id === id);
  if (!q) throw new Error(`Qualidade desconhecida no app: ${id}`);
  return q.nome.toLowerCase();
}
