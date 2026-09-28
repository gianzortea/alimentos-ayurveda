import { ELEMENTOS, Elemento } from "../tema";

/* Os glifos dos cinco elementos. Formas simples, uma por elemento:
     éter  = círculo vazado (o espaço)
     ar    = linhas onduladas (o movimento)
     fogo  = triângulo (a chama que sobe)
     água  = gota
     terra = quadrado (a forma mais estável)
   Desenhados num quadro de -150 a 150. `t` são os frames desde que o glifo
   entrou em cena; com `vivo`, cada um tem seu movimento próprio em repouso. */

const TRACO = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const Eter: React.FC<{ t: number; vivo: boolean }> = ({ t, vivo }) => {
  const c = ELEMENTOS.eter;
  return (
    <g>
      {vivo &&
        [0, 1, 2].map((k) => {
          /* ondas que nascem no centro e se dissolvem na borda: espaço se expandindo */
          const fase = ((t + k * 22) % 66) / 66;
          return (
            <circle key={k} cx={0} cy={0} r={18 + 84 * fase} fill="none"
              stroke={c.cor} strokeWidth={5} opacity={0.5 * (1 - fase)} />
          );
        })}
      <circle cx={0} cy={0} r={108} fill="none" stroke={c.cor} strokeWidth={16} />
      <circle cx={0} cy={0} r={108} fill="none" stroke={c.escura} strokeWidth={3} opacity={0.5} />
      {!vivo && <circle cx={0} cy={0} r={14} fill={c.cor} />}
    </g>
  );
};

const Ar: React.FC<{ t: number; vivo: boolean }> = ({ t, vivo }) => {
  const c = ELEMENTOS.ar;
  const fase = vivo ? t / 7 : 0;
  const onda = (y0: number, desloc: number) => {
    const pts: string[] = [];
    for (let x = -112; x <= 112; x += 8) {
      const y = y0 + Math.sin(x / 22 + fase + desloc) * 15;
      pts.push(`${x === -112 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <g fill="none" stroke={c.cor} strokeWidth={17} {...TRACO}>
      <path d={onda(-62, 0)} />
      <path d={onda(0, 1.3)} />
      <path d={onda(62, 2.6)} />
    </g>
  );
};

const Fogo: React.FC<{ t: number; vivo: boolean }> = ({ t, vivo }) => {
  const c = ELEMENTOS.fogo;
  /* a chama estica a partir da base, nunca do centro */
  const sy = vivo ? 1 + 0.04 * Math.sin(t / 2.7) + 0.025 * Math.sin(t / 1.2 + 1) : 1;
  const sk = vivo ? 2.5 * Math.sin(t / 4.1) : 0;
  return (
    <g transform={`translate(0 80) scale(1 ${sy}) skewX(${sk}) translate(0 -80)`}>
      <path d="M0 -118 L108 80 L-108 80 Z" fill={c.cor} stroke={c.escura} strokeWidth={8} {...TRACO} />
      <path d="M0 -26 L50 64 L-50 64 Z" fill="#e0a13a" {...TRACO} />
    </g>
  );
};

const Agua: React.FC<{ t: number; vivo: boolean }> = ({ t, vivo }) => {
  const c = ELEMENTOS.agua;
  const dy = vivo ? 7 * Math.sin(t / 11) : 0;
  return (
    <g transform={`translate(0 ${dy})`}>
      <path
        d="M0 -120 C 40 -62, 88 -10, 88 34 A 88 88 0 0 1 -88 34 C -88 -10, -40 -62, 0 -120 Z"
        fill={c.cor}
        stroke={c.escura}
        strokeWidth={8}
        {...TRACO}
      />
      <ellipse cx={-34} cy={30} rx={16} ry={30} fill="#ffffff" opacity={0.3} transform="rotate(20 -34 30)" />
    </g>
  );
};

const Terra: React.FC = () => {
  const c = ELEMENTOS.terra;
  return (
    <g>
      <rect x={-98} y={-98} width={196} height={196} rx={10} fill={c.cor} stroke={c.escura} strokeWidth={8} />
      <rect x={-54} y={-54} width={108} height={108} rx={4} fill="none" stroke={c.clara} strokeWidth={9} opacity={0.75} />
    </g>
  );
};

export const Glifo: React.FC<{
  tipo: Elemento;
  tamanho: number;
  t?: number;
  vivo?: boolean;
  style?: React.CSSProperties;
}> = ({ tipo, tamanho, t = 0, vivo = true, style }) => {
  return (
    <svg width={tamanho} height={tamanho} viewBox="-150 -150 300 300" style={{ overflow: "visible", ...style }}>
      <defs>
        <filter id={`tinta-glifo-${tipo}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <g filter={`url(#tinta-glifo-${tipo})`}>
        {tipo === "eter" && <Eter t={t} vivo={vivo} />}
        {tipo === "ar" && <Ar t={t} vivo={vivo} />}
        {tipo === "fogo" && <Fogo t={t} vivo={vivo} />}
        {tipo === "agua" && <Agua t={t} vivo={vivo} />}
        {tipo === "terra" && <Terra />}
      </g>
    </svg>
  );
};
