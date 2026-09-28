import { ALTURA, COR, LARGURA } from "../tema";

/* Balança de latão (tarazu). O travessão gira no pivô; os pratos ficam
   sempre na vertical, pendurados nas pontas. Ângulo negativo = lado
   esquerdo mais pesado. */

export const PIVO = { x: 540, y: 690 };
const BRACO = 300;          /* metade do travessão */
const CORDA = 236;          /* da ponta do travessão até a borda do prato */
const PRATO = 250;          /* largura do prato */
const PE_Y = 1100;          /* onde a coluna encontra a base */

export function geometria(anguloGraus: number) {
  const t = (anguloGraus * Math.PI) / 180;
  const cos = Math.cos(t), sen = Math.sin(t);
  const pontaEsq = { x: PIVO.x - BRACO * cos, y: PIVO.y - BRACO * sen };
  const pontaDir = { x: PIVO.x + BRACO * cos, y: PIVO.y + BRACO * sen };
  return {
    pontaEsq,
    pontaDir,
    /* centro da borda de cada prato: é a origem do conteúdo */
    pratoEsq: { x: pontaEsq.x, y: pontaEsq.y + CORDA },
    pratoDir: { x: pontaDir.x, y: pontaDir.y + CORDA },
  };
}

const TRACO = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const Prato: React.FC<{
  ponta: { x: number; y: number };
  borda: { x: number; y: number };
  children?: React.ReactNode;
}> = ({ ponta, borda, children }) => {
  const m = PRATO / 2;
  return (
    <g>
      {/* cordas: da ponta do travessão às bordas do prato */}
      <g stroke={COR.tinta2} strokeWidth={3.5} {...TRACO}>
        <line x1={ponta.x} y1={ponta.y + 10} x2={borda.x - m + 10} y2={borda.y} />
        <line x1={ponta.x} y1={ponta.y + 10} x2={borda.x + m - 10} y2={borda.y} />
      </g>

      {/* fundo do prato (interior), depois o conteúdo, depois a frente:
          assim o que está no prato parece estar dentro dele */}
      <ellipse cx={borda.x} cy={borda.y} rx={m} ry={16} fill={COR.lataoEscuro} opacity={0.55} />
      <g transform={`translate(${borda.x} ${borda.y})`}>{children}</g>
      <path
        d={`M${borda.x - m} ${borda.y} Q ${borda.x} ${borda.y + 118} ${borda.x + m} ${borda.y} Z`}
        fill={COR.latao}
        stroke={COR.lataoEscuro}
        strokeWidth={5}
        {...TRACO}
      />
      <path
        d={`M${borda.x - m + 26} ${borda.y + 14} Q ${borda.x - m + 50} ${borda.y + 44} ${borda.x - 30} ${borda.y + 52}`}
        fill="none"
        stroke={COR.lataoClaro}
        strokeWidth={6}
        opacity={0.8}
        {...TRACO}
      />
      <line
        x1={borda.x - m}
        y1={borda.y}
        x2={borda.x + m}
        y2={borda.y}
        stroke={COR.lataoEscuro}
        strokeWidth={6}
        {...TRACO}
      />
    </g>
  );
};

export const Balanca: React.FC<{
  angulo: number;
  conteudoEsq?: React.ReactNode;
  conteudoDir?: React.ReactNode;
  brilho?: React.ReactNode;
}> = ({ angulo, conteudoEsq, conteudoDir, brilho }) => {
  const g = geometria(angulo);

  return (
    <svg width={LARGURA} height={ALTURA} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {/* traço de ilustração impressa: nada de vetor perfeito */}
        <filter id="tinta" filterUnits="userSpaceOnUse" x="0" y="0" width={LARGURA} height={ALTURA}>
          {/* frequência baixa = ondulação larga no contorno, sem esfarelar
              os filetes finos de brilho do latão */}
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>

      <g filter="url(#tinta)">
        {brilho}

        {/* coluna e base */}
        <rect x={PIVO.x - 12} y={PIVO.y} width={24} height={PE_Y - PIVO.y} rx={10}
          fill={COR.latao} stroke={COR.lataoEscuro} strokeWidth={5} />
        <rect x={PIVO.x - 5} y={PIVO.y + 30} width={5} height={PE_Y - PIVO.y - 60} rx={3}
          fill={COR.lataoClaro} opacity={0.8} />
        <path
          d={`M${PIVO.x - 64} ${PE_Y} L${PIVO.x + 64} ${PE_Y} L${PIVO.x + 150} ${PE_Y + 44} L${PIVO.x - 150} ${PE_Y + 44} Z`}
          fill={COR.latao} stroke={COR.lataoEscuro} strokeWidth={5} {...TRACO}
        />
        <rect x={PIVO.x - 172} y={PE_Y + 40} width={344} height={20} rx={10}
          fill={COR.lataoEscuro} />

        {/* pratos antes do travessão: as cordas saem por trás dele */}
        <Prato ponta={g.pontaEsq} borda={g.pratoEsq}>{conteudoEsq}</Prato>
        <Prato ponta={g.pontaDir} borda={g.pratoDir}>{conteudoDir}</Prato>

        {/* travessão */}
        <g transform={`rotate(${angulo} ${PIVO.x} ${PIVO.y})`}>
          <rect x={PIVO.x - BRACO - 16} y={PIVO.y - 10} width={2 * BRACO + 32} height={20} rx={10}
            fill={COR.latao} stroke={COR.lataoEscuro} strokeWidth={5} />
          <rect x={PIVO.x - BRACO} y={PIVO.y - 5} width={2 * BRACO} height={4} rx={2}
            fill={COR.lataoClaro} opacity={0.8} />
          <circle cx={PIVO.x - BRACO} cy={PIVO.y} r={15} fill={COR.latao} stroke={COR.lataoEscuro} strokeWidth={5} />
          <circle cx={PIVO.x + BRACO} cy={PIVO.y} r={15} fill={COR.latao} stroke={COR.lataoEscuro} strokeWidth={5} />
          {/* ponteiro: mostra o equilíbrio contra a coluna */}
          <path d={`M${PIVO.x - 9} ${PIVO.y} L${PIVO.x} ${PIVO.y - 96} L${PIVO.x + 9} ${PIVO.y} Z`}
            fill={COR.terra} stroke={COR.terraEscura} strokeWidth={4} {...TRACO} />
        </g>

        {/* pivô e remate */}
        <circle cx={PIVO.x} cy={PIVO.y} r={22} fill={COR.lataoEscuro} />
        <circle cx={PIVO.x} cy={PIVO.y} r={10} fill={COR.lataoClaro} />
      </g>
    </svg>
  );
};
