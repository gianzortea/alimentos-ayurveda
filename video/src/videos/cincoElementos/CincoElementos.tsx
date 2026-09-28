import { useCurrentFrame } from "remotion";
import { Glifo } from "../../componentes/Glifos";
import { Cena, linhaDoTempo, Serie, TRANS } from "../../componentes/Serie";
import { faixa } from "../../componentes/Texto";
import { Elemento, ELEMENTOS, LARGURA, ORDEM_ELEMENTOS } from "../../tema";
import { CenaElemento, Fecho, Gancho, Nome, Sabores, Sintese } from "./Cenas";

/* ==========================================================================
   Tema 01 - Os cinco elementos
   ========================================================================== */

const CENAS: Cena[] = [
  { id: "gancho", dur: 120, render: () => <Gancho /> },
  { id: "nome", dur: 195, render: () => <Nome /> },
  ...ORDEM_ELEMENTOS.map((el) => ({ id: el, dur: 270, render: () => <CenaElemento tipo={el} /> })),
  { id: "sintese", dur: 210, render: () => <Sintese /> },
  { id: "sabores", dur: 300, render: () => <Sabores /> },
  { id: "fecho", dur: 255, render: () => <Fecho /> },
];

const { inicio: INICIO, duracao } = linhaDoTempo(CENAS);
export const DURACAO = duracao;

/* ------------------------------------------------------------------------ */
/* Trilha: os cinco glifos no topo, acendendo conforme o vídeo avança.       */
/* Fica fora das cenas para não piscar a cada transição.                     */
/* ------------------------------------------------------------------------ */

const Trilha: React.FC = () => {
  const frame = useCurrentFrame();
  const primeiro = INICIO[ORDEM_ELEMENTOS[0]];
  const fim = INICIO.sintese;
  const visivel = faixa(frame, primeiro, primeiro + TRANS) - faixa(frame, fim, fim + TRANS / 2);
  if (visivel <= 0) return null;

  /* quanto cada elemento está "aceso": sobe na entrada da sua cena, desce na próxima */
  const aceso = (el: Elemento, i: number) => {
    const entra = faixa(frame, INICIO[el], INICIO[el] + TRANS);
    const proximo = ORDEM_ELEMENTOS[i + 1];
    const sai = proximo ? faixa(frame, INICIO[proximo], INICIO[proximo] + TRANS) : 0;
    return entra - sai;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 158,
        width: LARGURA,
        display: "flex",
        justifyContent: "center",
        gap: 40,
        opacity: visivel,
      }}
    >
      {ORDEM_ELEMENTOS.map((el, i) => {
        const a = aceso(el, i);
        return (
          <div key={el} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ opacity: 0.25 + 0.75 * a, transform: `scale(${1 + 0.16 * a})` }}>
              <Glifo tipo={el} tamanho={62} vivo={false} />
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: ELEMENTOS[el].cor,
                opacity: a,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const CincoElementos: React.FC = () => (
  <Serie cenas={CENAS}>
    <Trilha />
  </Serie>
);
