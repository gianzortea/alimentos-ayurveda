import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Balanca, PIVO } from "./componentes/Balanca";
import { Barrado } from "./componentes/Barrado";
import { Coco, Diya, Melao, Pepino, Sol } from "./componentes/Ilustracoes";
import { Papel } from "./componentes/Papel";
import { Chip, faixa, Rotulo, Titulo } from "./componentes/Texto";
import { ALTURA, COR, FONTE } from "./tema";

/* Quadro de estilo: uma cena que prova a linguagem visual antes do roteiro.
   O princípio "o semelhante aumenta, o oposto equilibra" contado por uma
   balança: o dia quente e seco pesa de um lado, o prato fresco e untuoso
   devolve o equilíbrio do outro. */

export const DURACAO = 400;

/* Linha do tempo, em frames (30 fps) */
const T = {
  barrado: 4,
  sobrancelha: 16,
  titulo1: 28,
  devanagari: 58,
  balanca: 38,
  sol: { cai: 92, pousa: 114 },
  chipsDia: 120,
  titulo1Sai: 160,
  titulo2: 176,
  pepino: { cai: 198, pousa: 218 },
  coco: { cai: 230, pousa: 250 },
  melao: { cai: 262, pousa: 284 },
  brilho: 298,
  legenda: 306,
  marca: 332,
};

/* Quanto cada peso inclina o travessão, em graus. A soma volta a zero. */
const PESO = { sol: -13, pepino: 4.5, coco: 5, melao: 3.5 };

/* Altura da queda. Curta de propósito: vindo de mais alto, o item
   atravessava o título. Ele surge durante a descida em vez de vir de fora. */
const QUEDA = 240;

/** Item que cai do alto e pousa no prato. Coordenadas locais do prato. */
const Queda: React.FC<{
  cai: number;
  pousa: number;
  x: number;
  y: number;
  giro0: number;
  children: React.ReactNode;
}> = ({ cai, pousa, x, y, giro0, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [cai, pousa], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacidade = interpolate(frame, [cai, cai + (pousa - cai) * 0.6], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < cai) return null;

  return (
    <g
      opacity={opacidade}
      transform={`translate(${x} ${y - QUEDA * (1 - p)}) rotate(${giro0 * (1 - p)})`}
    >
      {children}
    </g>
  );
};

export const QuadroDeEstilo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* O travessão soma uma mola por peso que pousa. Amortecimento perto do
     crítico: assenta devagar, como latão de verdade, sem quicar. */
  const mola = (t0: number) =>
    spring({
      frame: Math.max(0, frame - t0),
      fps,
      config: { damping: 14, stiffness: 55, mass: 1.3 },
    });
  const angulo =
    PESO.sol * mola(T.sol.pousa) +
    PESO.pepino * mola(T.pepino.pousa) +
    PESO.coco * mola(T.coco.pousa) +
    PESO.melao * mola(T.melao.pousa);

  const balancaEntra = faixa(frame, T.balanca, T.balanca + 40);

  const brilho = faixa(frame, T.brilho, T.brilho + 55, Easing.out(Easing.cubic));
  const brilho2 = faixa(frame, T.brilho + 12, T.brilho + 67, Easing.out(Easing.cubic));
  const halo = faixa(frame, T.brilho, T.brilho + 40);

  const legenda = faixa(frame, T.legenda, T.legenda + 26);
  const marca = faixa(frame, T.marca, T.marca + 26);
  const chama = 1 + 0.07 * Math.sin(frame / 2.1) + 0.04 * Math.sin(frame / 0.9 + 1);

  return (
    <AbsoluteFill>
      <Papel />

      <Barrado id="topo" y={62} revelado={faixa(frame, T.barrado, T.barrado + 36)} />
      <Barrado id="base" y={ALTURA - 126} revelado={faixa(frame, T.barrado, T.barrado + 36)} />

      {/* ---------------------------- a balança ---------------------------- */}
      <AbsoluteFill
        style={{
          opacity: balancaEntra,
          transform: `translateY(${(1 - balancaEntra) * 50}px)`,
        }}
      >
        <Balanca
          angulo={angulo}
          brilho={
            <g>
              <circle cx={PIVO.x} cy={PIVO.y + 150} r={400} fill="url(#halo)" opacity={halo} />
              <defs>
                <radialGradient id="halo">
                  <stop offset="0%" stopColor={COR.acafrao} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={COR.acafrao} stopOpacity={0} />
                </radialGradient>
              </defs>
              {brilho > 0 && (
                <circle cx={PIVO.x} cy={PIVO.y} r={30 + 300 * brilho} fill="none"
                  stroke={COR.acafrao} strokeWidth={6} opacity={0.55 * (1 - brilho)} />
              )}
              {brilho2 > 0 && (
                <circle cx={PIVO.x} cy={PIVO.y} r={30 + 300 * brilho2} fill="none"
                  stroke={COR.acafrao} strokeWidth={4} opacity={0.4 * (1 - brilho2)} />
              )}
            </g>
          }
          conteudoEsq={
            <Queda cai={T.sol.cai} pousa={T.sol.pousa} x={0} y={6} giro0={-10}>
              <Sol giro={frame * 0.35} fase={frame / 7} />
            </Queda>
          }
          conteudoDir={
            <>
              <Queda cai={T.pepino.cai} pousa={T.pepino.pousa} x={58} y={4} giro0={30}>
                <Pepino />
              </Queda>
              <Queda cai={T.coco.cai} pousa={T.coco.pousa} x={-58} y={6} giro0={-24}>
                <Coco />
              </Queda>
              <Queda cai={T.melao.cai} pousa={T.melao.pousa} x={2} y={-90} giro0={-14}>
                <Melao />
              </Queda>
            </>
          }
        />
      </AbsoluteFill>

      {/* ------------- título: acima da balança, nada o encobre ------------- */}
      <Rotulo
        texto="Ayurveda  ·  o princípio"
        style={{
          position: "absolute",
          top: 190,
          width: "100%",
          textAlign: "center",
          opacity: faixa(frame, T.sobrancelha, T.sobrancelha + 24),
        }}
      />

      <Titulo
        y={248}
        inicio={T.titulo1}
        saida={T.titulo1Sai}
        palavras={[
          { t: "O" },
          { t: "semelhante", quebra: true },
          { t: "aumenta.", cor: COR.terra, italico: true },
        ]}
      />
      <Titulo
        y={248}
        inicio={T.titulo2}
        palavras={[
          { t: "O" },
          { t: "oposto", quebra: true },
          { t: "equilibra.", cor: COR.salvia, italico: true },
        ]}
      />

      <div
        style={{
          position: "absolute",
          top: 510,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTE.devanagari,
          fontSize: 40,
          color: COR.tinta3,
          opacity: faixa(frame, T.devanagari, T.devanagari + 30),
        }}
      >
        सामान्य विशेष सिद्धान्त
      </div>

      {/* ------------------- o que cada lado carrega ------------------- */}
      <div style={{ position: "absolute", top: 1212, left: 40, width: 400, textAlign: "center" }}>
        <Rotulo texto="o dia" style={{ opacity: faixa(frame, T.chipsDia - 6, T.chipsDia + 14) }} />
        <div style={{ marginTop: 10 }}>
          <Chip texto="quente" tipo="quente" entrada={T.chipsDia} />
          <Chip texto="seco" tipo="quente" entrada={T.chipsDia + 8} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1212, left: 640, width: 400, textAlign: "center" }}>
        <Rotulo texto="o prato" style={{ opacity: faixa(frame, T.pepino.pousa - 6, T.pepino.pousa + 14) }} />
        <div style={{ marginTop: 10 }}>
          <Chip texto="frio" tipo="fresco" entrada={T.pepino.pousa + 4} />
          <Chip texto="oleoso" tipo="fresco" entrada={T.coco.pousa + 4} />
          <Chip texto="líquido" tipo="fresco" entrada={T.melao.pousa + 4} />
        </div>
      </div>

      {/* ------------------------------ fecho ------------------------------ */}
      <div
        style={{
          position: "absolute",
          top: 1440,
          left: 100,
          right: 100,
          textAlign: "center",
          fontFamily: FONTE.serifa,
          fontSize: 52,
          lineHeight: 1.28,
          color: COR.tinta2,
          opacity: legenda,
          transform: `translateY(${(1 - legenda) * 24}px)`,
        }}
      >
        Um dia <i style={{ color: COR.terra }}>quente e seco</i> pede um prato{" "}
        <i style={{ color: COR.salvia }}>fresco e untuoso</i>.
      </div>

      <div
        style={{
          position: "absolute",
          top: 1602,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: marca,
          transform: `translateY(${(1 - marca) * 16}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Diya chama={chama} />
          <span style={{ fontFamily: FONTE.serifa, fontSize: 58, fontWeight: 600, color: COR.tinta }}>
            Rasoi
          </span>
        </div>
        <Rotulo texto="alimentos segundo o Ayurveda" style={{ fontSize: 22, marginTop: 2 }} />
      </div>
    </AbsoluteFill>
  );
};
