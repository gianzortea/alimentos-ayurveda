import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Fragment } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ALTURA } from "../tema";
import { Barrado } from "./Barrado";
import { mergulho } from "./Mergulho";
import { Papel } from "./Papel";
import { faixa } from "./Texto";

/* Estrutura comum a todos os vídeos da série: papel e barrados fixos, e as
   cenas encadeadas pela transição "mergulho no papel". */

export const TRANS = 20;

export type Cena = { id: string; dur: number; render: () => React.ReactNode };

/** Onde cada cena começa na linha do tempo final, e a duração total.
    As transições sobrepõem as cenas: cada uma começa TRANS frames antes
    do fim da anterior. */
export function linhaDoTempo(cenas: Cena[]) {
  const inicio: Record<string, number> = {};
  cenas.reduce((acc, c, i) => {
    inicio[c.id] = acc - i * TRANS;
    return acc + c.dur;
  }, 0);
  const duracao = cenas.reduce((s, c) => s + c.dur, 0) - (cenas.length - 1) * TRANS;
  return { inicio, duracao };
}

export const Serie: React.FC<{ cenas: Cena[]; children?: React.ReactNode }> = ({ cenas, children }) => {
  const frame = useCurrentFrame();
  const barrado = faixa(frame, 0, 20);

  return (
    <AbsoluteFill>
      <Papel />
      <Barrado id="topo" y={40} revelado={barrado} />
      <Barrado id="base" y={ALTURA - 104} revelado={barrado} />

      <TransitionSeries>
        {cenas.map((c, i) => (
          <Fragment key={c.id}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={mergulho()}
                timing={linearTiming({ durationInFrames: TRANS })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={c.dur}>{c.render()}</TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>

      {/* camadas fixas por cima das cenas (ex.: a trilha do vídeo 01) */}
      {children}
    </AbsoluteFill>
  );
};
