import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariSanskrit";

/* Mesma identidade do app Rasoi: serifada nos títulos, devanágari para os
   termos em sânscrito, paleta de terracota, açafrão e sálvia sobre creme. */

/* latin-ext traz as vogais longas da transliteração do sânscrito (Ā, ā, ū...) */
const fraunces = loadFraunces("normal", {
  weights: ["400", "600"],
  subsets: ["latin", "latin-ext"],
});
loadFraunces("italic", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });

/* As três forças: as mesmas cores dos doshas no app */
export const FORCAS = {
  kapha: { cor: "#5d7d5a", clara: "#e3ecdf" },
  pitta: { cor: "#b4552d", clara: "#f5e4da" },
  vata: { cor: "#4a5b82", clara: "#e2e7f1" },
};

const tiro = loadTiro("normal", { weights: ["400"], subsets: ["devanagari"] });

export const FONTE = {
  serifa: fraunces.fontFamily,
  devanagari: tiro.fontFamily,
};

export const COR = {
  fundo: "#faf6ef",
  fundo2: "#f2ece0",
  tinta: "#2e2721",
  tinta2: "#6b6055",
  tinta3: "#948877",

  terra: "#b4552d",
  terraEscura: "#7c3419",
  terraClara: "#f5e4da",
  acafrao: "#c98a1d",
  salvia: "#5d7d5a",
  salviaClara: "#e3ecdf",
  indigo: "#4a5b82",

  /* latão da balança: o tarazu das feiras indianas */
  latao: "#d9a441",
  lataoClaro: "#f0cf85",
  lataoEscuro: "#8a5d12",
};

/* Os cinco elementos (pancha mahabhuta). As cores foram escolhidas para que
   as misturas batam com as cores dos doshas no app: ar + éter dão o índigo
   de Vata, fogo + água a terracota de Pitta, água + terra a sálvia de Kapha. */
export type Elemento = "eter" | "ar" | "fogo" | "agua" | "terra";

export const ELEMENTOS: Record<Elemento, { cor: string; escura: string; clara: string }> = {
  eter:  { cor: "#8790ba", escura: "#5a6390", clara: "#e6e8f2" },
  ar:    { cor: "#4a5b82", escura: "#2f3b58", clara: "#e2e7f1" },
  fogo:  { cor: "#b4552d", escura: "#7c3419", clara: "#f5e4da" },
  agua:  { cor: "#3d7a94", escura: "#265366", clara: "#dcebf0" },
  terra: { cor: "#9a6a1c", escura: "#62420d", clara: "#f1e4c8" },
};

/* Ordem clássica: do mais sutil ao mais denso. */
export const ORDEM_ELEMENTOS: Elemento[] = ["eter", "ar", "fogo", "agua", "terra"];

export const LARGURA = 1080;
export const ALTURA = 1920;
