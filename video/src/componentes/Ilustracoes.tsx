import { COR } from "../tema";

/* Ilustrações planas. Cada uma é desenhada com a base em y = 0 e centrada
   em x = 0, para pousar direto na borda do prato da balança. */

const TRACO = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ------------------------------------------------------------------------ */
/* O dia quente e seco: fogo (o sol) + ar (as linhas de vento)              */
/* ------------------------------------------------------------------------ */

export const Sol: React.FC<{ giro: number; fase: number }> = ({ giro, fase }) => {
  const cy = -86;
  const raios = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 + giro) * Math.PI) / 180;
    const p = (r: number, d: number) => `${Math.cos(a + d) * r},${cy + Math.sin(a + d) * r}`;
    return `M${p(72, -0.13)} L${p(104, 0)} L${p(72, 0.13)} Z`;
  });

  return (
    <g>
      <OndasDeAr fase={fase} />
      {raios.map((d, i) => (
        <path key={i} d={d} fill={COR.acafrao} stroke={COR.lataoEscuro} strokeWidth={3} {...TRACO} />
      ))}
      <circle cx={0} cy={cy} r={64} fill={COR.terra} stroke={COR.terraEscura} strokeWidth={5} />
      <circle cx={-20} cy={cy - 20} r={17} fill="#d0714a" opacity={0.7} />
    </g>
  );
};

/* Linhas onduladas: o glifo do elemento ar. A fase anda com o tempo. */
const OndasDeAr: React.FC<{ fase: number }> = ({ fase }) => {
  const onda = (x0: number, y0: number, largura: number, deslocamento: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= largura; x += 6) {
      const y = y0 + Math.sin(x / 13 + fase + deslocamento) * 7;
      pts.push(`${x === 0 ? "M" : "L"}${x0 + x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <g fill="none" stroke={COR.indigo} strokeWidth={6} opacity={0.85} {...TRACO}>
      <path d={onda(-150, -200, 96, 0)} />
      <path d={onda(-128, -170, 70, 1.4)} />
      <path d={onda(66, -214, 86, 2.2)} />
    </g>
  );
};

/* ------------------------------------------------------------------------ */
/* O prato fresco e untuoso                                                  */
/* ------------------------------------------------------------------------ */

export const Coco: React.FC = () => (
  <g>
    <circle cx={0} cy={-50} r={56} fill="#7a5236" stroke="#4a301d" strokeWidth={5} />
    {[-58, -30, 12, 44, 150, 200].map((ang, i) => {
      const a = (ang * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={Math.cos(a) * 49}
          y1={-50 + Math.sin(a) * 49}
          x2={Math.cos(a) * 56}
          y2={-50 + Math.sin(a) * 56}
          stroke="#4a301d"
          strokeWidth={3}
          {...TRACO}
        />
      );
    })}
    <circle cx={0} cy={-50} r={42} fill="#fbf6ea" stroke="#e3d6bb" strokeWidth={3} />
    <circle cx={0} cy={-50} r={25} fill="#f1e7d2" />
  </g>
);

export const Pepino: React.FC = () => {
  const sementes = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
  return (
    <g>
      <circle cx={0} cy={-46} r={46} fill="#4f7a45" stroke="#2f4f2a" strokeWidth={5} />
      <circle cx={0} cy={-46} r={38} fill="#dbe8c4" />
      <circle cx={0} cy={-46} r={21} fill="#c8dba8" />
      {sementes.map((ang) => (
        <ellipse
          key={ang}
          cx={0}
          cy={-46 - 15}
          rx={3.6}
          ry={7}
          fill="#f7f4e3"
          stroke="#aec290"
          strokeWidth={1.5}
          transform={`rotate(${ang} 0 -46)`}
        />
      ))}
    </g>
  );
};

export const Melao: React.FC = () => (
  <g>
    <path d="M-80 0 A80 80 0 0 1 80 0 Z" fill="#a9c08a" stroke="#5f7446" strokeWidth={5} {...TRACO} />
    <path d="M-68 0 A68 68 0 0 1 68 0 Z" fill="#f0a868" />
    <path d="M-40 0 A40 40 0 0 1 40 0 Z" fill="#e89254" />
    {[-150, -125, -100, -80, -55, -30].map((ang, i) => {
      const a = (ang * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={Math.cos(a) * 30}
          cy={Math.sin(a) * 30}
          rx={3}
          ry={6}
          fill="#fbf1dd"
          transform={`rotate(${ang + 90} ${Math.cos(a) * 30} ${Math.sin(a) * 30})`}
        />
      );
    })}
    <line x1={-80} y1={0} x2={80} y2={0} stroke="#5f7446" strokeWidth={5} {...TRACO} />
  </g>
);

/* ------------------------------------------------------------------------ */
/* Diya: a lamparina de barro que é o ícone do Rasoi                         */
/* ------------------------------------------------------------------------ */

export const Diya: React.FC<{ chama: number }> = ({ chama }) => (
  <svg width={84} height={84} viewBox="-42 -60 84 84">
    {/* a chama estica a partir da base (y = 4), não do centro */}
    <g transform={`translate(4 -30) translate(0 4) scale(1 ${chama}) translate(0 -4)`}>
      <path d="M0 -26 C 9 -14, 10 -4, 0 4 C -10 -4, -9 -14, 0 -26 Z" fill={COR.acafrao} />
      <path d="M0 -14 C 4 -8, 4 -2, 0 2 C -4 -2, -4 -8, 0 -14 Z" fill="#f6d27a" />
    </g>
    <path
      d="M-36 -20 C -30 8, 30 8, 36 -20 C 20 -12, 16 -18, 4 -22 C -8 -18, -22 -14, -36 -20 Z"
      fill={COR.terra}
      stroke={COR.terraEscura}
      strokeWidth={3}
      {...TRACO}
    />
  </svg>
);
