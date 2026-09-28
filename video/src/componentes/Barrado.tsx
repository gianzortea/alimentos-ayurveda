import { COR, LARGURA } from "../tema";

/* Faixa de estamparia em bloco (block print): gotas "buti" alternadas com
   losangos, entre dois filetes. `revelado` vai de 0 a 1 e abre a faixa do
   centro para as bordas, como um carimbo sendo pressionado. */

const ALTURA_FAIXA = 64;

export const Barrado: React.FC<{ y: number; revelado: number; id: string }> = ({ y, revelado, id }) => {
  const largura = LARGURA * revelado;

  return (
    <svg
      width={LARGURA}
      height={ALTURA_FAIXA}
      style={{ position: "absolute", left: 0, top: y, overflow: "visible" }}
    >
      <defs>
        <pattern id={`buti-${id}`} x={LARGURA / 2 - 48} y="0" width="96" height={ALTURA_FAIXA} patternUnits="userSpaceOnUse">
          <path
            d="M48 14 C 61 25, 63 40, 48 50 C 33 40, 35 25, 48 14 Z"
            fill={COR.terra}
          />
          <circle cx="48" cy="38" r="4.5" fill={COR.fundo} />
          <path d="M0 26 L7 32 L0 38 L-7 32 Z" fill={COR.acafrao} />
          <path d="M96 26 L103 32 L96 38 L89 32 Z" fill={COR.acafrao} />
          <circle cx="24" cy="32" r="2.6" fill={COR.terra} />
          <circle cx="72" cy="32" r="2.6" fill={COR.terra} />
        </pattern>

        <clipPath id={`abre-${id}`}>
          <rect x={(LARGURA - largura) / 2} y="-4" width={largura} height={ALTURA_FAIXA + 8} />
        </clipPath>

        {/* leve irregularidade de tinta: o carimbo nunca imprime perfeito */}
        <filter id={`carimbo-${id}`} x="-2%" y="-20%" width="104%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>

      <g clipPath={`url(#abre-${id})`} filter={`url(#carimbo-${id})`} opacity={0.82}>
        <rect x="0" y="2" width={LARGURA} height="3" fill={COR.terra} />
        <rect x="0" y="8" width={LARGURA} height="1.5" fill={COR.terra} opacity={0.6} />
        <rect x="0" y="0" width={LARGURA} height={ALTURA_FAIXA} fill={`url(#buti-${id})`} />
        <rect x="0" y={ALTURA_FAIXA - 9.5} width={LARGURA} height="1.5" fill={COR.terra} opacity={0.6} />
        <rect x="0" y={ALTURA_FAIXA - 5} width={LARGURA} height="3" fill={COR.terra} />
      </g>
    </svg>
  );
};
