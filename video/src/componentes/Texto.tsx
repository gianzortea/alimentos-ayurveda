import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COR, FONTE } from "../tema";

const ENTRA = Easing.bezier(0.16, 1, 0.3, 1);
const SAI = Easing.in(Easing.cubic);

const faixa = (frame: number, de: number, ate: number, easing = ENTRA) =>
  interpolate(frame, [de, ate], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export type Palavra = { t: string; cor?: string; italico?: boolean; quebra?: boolean };

/* Título que entra palavra por palavra, subindo de leve. Sai todo junto. */
export const Titulo: React.FC<{
  palavras: Palavra[];
  inicio: number;
  saida?: number;
  y: number;
  tamanho?: number;
}> = ({ palavras, inicio, saida, y, tamanho = 118 }) => {
  const frame = useCurrentFrame();
  const fora = saida === undefined ? 0 : faixa(frame, saida, saida + 16, SAI);

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 80,
        right: 80,
        textAlign: "center",
        fontFamily: FONTE.serifa,
        fontSize: tamanho,
        lineHeight: 1.04,
        fontWeight: 400,
        letterSpacing: "-0.015em",
        color: COR.tinta,
        opacity: 1 - fora,
        transform: `translateY(${-34 * fora}px)`,
      }}
    >
      {palavras.map((p, i) => {
        const e = faixa(frame, inicio + i * 6, inicio + i * 6 + 26);
        return (
          <span key={i}>
            <span
              style={{
                display: "inline-block",
                opacity: e,
                transform: `translateY(${(1 - e) * 36}px)`,
                color: p.cor ?? COR.tinta,
                fontStyle: p.italico ? "italic" : "normal",
                fontWeight: p.italico ? 600 : 400,
              }}
            >
              {p.t}
            </span>
            {p.quebra ? <br /> : " "}
          </span>
        );
      })}
    </div>
  );
};

type CoresChip = { fundo: string; texto: string; borda: string };

const PALETA_CHIP: Record<"quente" | "fresco", CoresChip> = {
  quente: { fundo: COR.terraClara, texto: COR.terra, borda: "#e8c3b0" },
  fresco: { fundo: COR.salviaClara, texto: COR.salvia, borda: "#c3d3bc" },
};

/* Pílula de qualidade, na mesma linguagem visual dos chips do app.
   Use `tipo` para as duas paletas padrão ou `cores` para uma própria. */
export const Chip: React.FC<{
  texto: string;
  entrada: number;
  tipo?: "quente" | "fresco";
  cores?: CoresChip;
}> = ({ texto, entrada, tipo = "quente", cores }) => {
  const frame = useCurrentFrame();
  const e = faixa(frame, entrada, entrada + 18);
  const c = cores ?? PALETA_CHIP[tipo];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "10px 26px 12px",
        margin: 6,
        borderRadius: 999,
        fontFamily: FONTE.serifa,
        fontSize: 36,
        backgroundColor: c.fundo,
        color: c.texto,
        border: `2px solid ${c.borda}`,
        opacity: e,
        transform: `translateY(${(1 - e) * 14}px) scale(${0.9 + 0.1 * e})`,
      }}
    >
      {texto}
    </span>
  );
};

/* Bloco de texto centralizado que sobe de leve ao entrar. */
export const Linha: React.FC<{
  y: number;
  entrada: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ y, entrada, children, style }) => {
  const frame = useCurrentFrame();
  const e = faixa(frame, entrada, entrada + 24);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 90,
        right: 90,
        textAlign: "center",
        textWrap: "balance",   /* sem palavra órfã na segunda linha */
        opacity: e,
        transform: `translateY(${(1 - e) * 22}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* Rótulo em versalete, espaçado. */
export const Rotulo: React.FC<{ texto: string; style?: React.CSSProperties }> = ({ texto, style }) => (
  <div
    style={{
      fontFamily: FONTE.serifa,
      fontSize: 27,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: COR.tinta3,
      ...style,
    }}
  >
    {texto}
  </div>
);

export { faixa };
