import { FORCAS } from "../tema";

/* Um pulso: anel dividido em três arcos, Kapha, Pitta e Vata, na ordem em que
   se sucedem no dia. Todo ciclo da série (dia, digestão, sono, estações, vida)
   é desenhado com ele. */

const ORDEM = [FORCAS.kapha.cor, FORCAS.pitta.cor, FORCAS.vata.cor];

export const AnelTriplo: React.FC<{
  cx: number;
  cy: number;
  r: number;
  angulo: number;
  espessura?: number;
  opacidade?: number;
  vao?: number;
}> = ({ cx, cy, r, angulo, espessura = 14, opacidade = 1, vao = 10 }) => {
  const C = 2 * Math.PI * r;
  const arco = C / 3 - vao;
  return (
    <g transform={`rotate(${angulo} ${cx} ${cy})`} opacity={opacidade}>
      {ORDEM.map((cor, k) => (
        <circle
          key={cor}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={cor}
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={`${arco} ${C - arco}`}
          strokeDashoffset={-(k * C) / 3}
        />
      ))}
    </g>
  );
};

/* Onda que viaja da esquerda para a direita, trocando de cor a cada trecho:
   umidade, calor, pressão, e de novo. */
export const OndaTripla: React.FC<{
  y: number;
  largura: number;
  amplitude: number;
  trecho: number;
  deslocamento: number;
  espessura?: number;
}> = ({ y, largura, amplitude, trecho, deslocamento, espessura = 16 }) => {
  const caminhos: string[][] = [[], [], []];
  const passo = 6;
  const inicio = -trecho * 3;

  for (let x = inicio; x <= largura + trecho * 3; x += passo) {
    const posicao = x - deslocamento;
    const indice = ((Math.floor(posicao / trecho) % 3) + 3) % 3;
    const yy = y + Math.sin((posicao / trecho) * Math.PI) * amplitude;
    const anterior = x - passo;
    const posAnterior = anterior - deslocamento;
    const mesmoTrecho = Math.floor(posAnterior / trecho) === Math.floor(posicao / trecho);
    const cmd = mesmoTrecho && x !== inicio ? "L" : "M";
    caminhos[indice].push(`${cmd}${x.toFixed(1)},${yy.toFixed(1)}`);
  }

  return (
    <g fill="none" strokeWidth={espessura} strokeLinecap="round" strokeLinejoin="round">
      {caminhos.map((pts, k) => (
        <path key={k} d={pts.join(" ")} stroke={ORDEM[k]} />
      ))}
    </g>
  );
};
