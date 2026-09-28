import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Glifo } from "../../componentes/Glifos";
import { Diya } from "../../componentes/Ilustracoes";
import { Chip, faixa, Linha, Rotulo, Titulo } from "../../componentes/Texto";
import { DOSHAS, elementosDoDosha, elementosDoSabor, nomeQualidade, RASAS } from "../../dadosApp";
import { COR, Elemento, ELEMENTOS, FONTE, LARGURA, ORDEM_ELEMENTOS } from "../../tema";
import { ELEMENTO, FECHO, GANCHO, NOME, SABORES, SINTESE } from "./roteiro";

const POP = Easing.bezier(0.34, 1.4, 0.64, 1);

/* ------------------------------------------------------------------------ */
/* 1. Gancho: o texto já está na tela no primeiro segundo                    */
/* ------------------------------------------------------------------------ */

export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Titulo
        y={400}
        inicio={0}
        tamanho={124}
        palavras={GANCHO.map((t, i) =>
          i === GANCHO.length - 1
            ? { t, cor: COR.terra, italico: true }
            : { t, quebra: true },
        )}
      />
      <div
        style={{
          position: "absolute",
          top: 1010,
          width: LARGURA,
          display: "flex",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {ORDEM_ELEMENTOS.map((el, i) => {
          const e = faixa(frame, 26 + i * 7, 26 + i * 7 + 22, POP);
          return (
            <div key={el} style={{ opacity: Math.min(1, e * 1.5), transform: `scale(${0.4 + 0.6 * e})` }}>
              <Glifo tipo={el} tamanho={160} t={frame} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 2. O nome: pancha mahabhuta                                               */
/* ------------------------------------------------------------------------ */

export const Nome: React.FC = () => {
  return (
    <AbsoluteFill>
      <Linha y={470} entrada={4}>
        <Rotulo texto={NOME.chamada} />
      </Linha>
      <Linha y={520} entrada={14} style={{ fontFamily: FONTE.devanagari, fontSize: 136, color: COR.tinta, lineHeight: 1.3 }}>
        {NOME.devanagari}
      </Linha>
      <Linha y={710} entrada={30} style={{ fontFamily: FONTE.serifa, fontSize: 52, fontStyle: "italic", color: COR.terra }}>
        {NOME.transliteracao}
      </Linha>
      <Linha y={790} entrada={42} style={{ fontFamily: FONTE.serifa, fontSize: 66, color: COR.tinta }}>
        {NOME.traducao}
      </Linha>

      <Linha y={1020} entrada={96} style={{ fontFamily: FONTE.serifa, fontSize: 54, color: COR.tinta, fontWeight: 600 }}>
        {NOME.ressalva1}
      </Linha>
      <Linha y={1096} entrada={112} style={{ fontFamily: FONTE.serifa, fontSize: 46, color: COR.tinta2, lineHeight: 1.3 }}>
        {NOME.ressalva2}
      </Linha>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 3 a 7. Um elemento                                                        */
/* ------------------------------------------------------------------------ */

/* Cada glifo entra com o gesto do próprio elemento. */
const ENTRADA: Record<Elemento, { dx: number; dy: number; s0: number }> = {
  eter: { dx: 0, dy: 0, s0: 0.5 },       /* o espaço se abre */
  ar: { dx: -160, dy: 0, s0: 0.9 },      /* o vento chega de lado */
  fogo: { dx: 0, dy: 90, s0: 0.7 },      /* a chama sobe */
  agua: { dx: 0, dy: -180, s0: 1 },      /* a gota cai */
  terra: { dx: 0, dy: -220, s0: 1 },     /* o peso assenta */
};

export const CenaElemento: React.FC<{ tipo: Elemento }> = ({ tipo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = ELEMENTO[tipo];
  const c = ELEMENTOS[tipo];
  const ent = ENTRADA[tipo];

  const m = spring({
    frame,
    fps,
    config: tipo === "terra" ? { damping: 14, stiffness: 140, mass: 1.6 } : { damping: 18, stiffness: 90 },
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: (LARGURA - 300) / 2,
          opacity: Math.min(1, m * 1.6),
          transform: `translate(${ent.dx * (1 - m)}px, ${ent.dy * (1 - m)}px) scale(${ent.s0 + (1 - ent.s0) * m})`,
        }}
      >
        <Glifo tipo={tipo} tamanho={300} t={frame} />
      </div>

      <Linha y={640} entrada={12} style={{ fontFamily: FONTE.serifa, fontSize: 132, color: COR.tinta, lineHeight: 1 }}>
        {r.nome}
      </Linha>
      <Linha y={790} entrada={24} style={{ fontSize: 44, color: COR.tinta3 }}>
        <span style={{ fontFamily: FONTE.devanagari }}>{r.devanagari}</span>
        <span style={{ fontFamily: FONTE.serifa, margin: "0 16px" }}>·</span>
        <span style={{ fontFamily: FONTE.serifa, fontStyle: "italic" }}>{r.sanscrito}</span>
      </Linha>
      <Linha y={866} entrada={34} style={{ fontFamily: FONTE.serifa, fontSize: 62, fontStyle: "italic", fontWeight: 600, color: c.cor }}>
        {r.essencia}
      </Linha>
      <Linha y={956} entrada={44}>
        <Rotulo texto={`sentido · ${r.sentido}`} style={{ fontSize: 25 }} />
      </Linha>

      <div style={{ position: "absolute", top: 1010, left: 60, right: 60, textAlign: "center" }}>
        {r.qualidades.map((q, i) => (
          <Chip
            key={q}
            texto={nomeQualidade(q)}
            entrada={56 + i * 8}
            cores={{ fundo: c.clara, texto: c.escura, borda: `${c.cor}55` }}
          />
        ))}
      </div>

      <Linha y={1150} entrada={96}>
        <Rotulo texto="no corpo" style={{ color: c.cor }} />
        <div style={{ fontFamily: FONTE.serifa, fontSize: 44, color: COR.tinta2, lineHeight: 1.3, marginTop: 8 }}>
          {r.corpo}
        </div>
      </Linha>
      <Linha y={1320} entrada={146}>
        <Rotulo texto="no prato" style={{ color: c.cor }} />
        <div style={{ fontFamily: FONTE.serifa, fontSize: 44, color: COR.tinta2, lineHeight: 1.3, marginTop: 8 }}>
          {r.prato}
        </div>
      </Linha>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 8. Síntese: do mais sutil ao mais denso                                   */
/* ------------------------------------------------------------------------ */

export const Sintese: React.FC = () => {
  const frame = useCurrentFrame();
  const Y0 = 560, PASSO = 185, TAM = 130;
  const alturaSeta = PASSO * 4 + TAM;
  const seta = faixa(frame, 24, 24 + 5 * 16 + 20, Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill>
      <Titulo
        y={240}
        inicio={0}
        tamanho={104}
        palavras={[
          { t: SINTESE.de },
          { t: SINTESE.sutil, cor: ELEMENTOS.eter.cor, italico: true, quebra: true },
          { t: SINTESE.ate },
          { t: SINTESE.denso, cor: ELEMENTOS.terra.cor, italico: true },
        ]}
      />

      {/* a seta desce enquanto os elementos se condensam */}
      <svg width={LARGURA} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={230} y1={Y0} x2={230} y2={Y0 + alturaSeta}
          stroke={COR.tinta3} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={alturaSeta} strokeDashoffset={alturaSeta * (1 - seta)}
        />
        <path
          d={`M214 ${Y0 + alturaSeta - 18} L230 ${Y0 + alturaSeta + 4} L246 ${Y0 + alturaSeta - 18}`}
          fill="none" stroke={COR.tinta3} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
          opacity={faixa(frame, 110, 124)}
        />
      </svg>
      <Rotulo texto="sutil" style={{ position: "absolute", top: Y0 - 50, left: 180, width: 100, textAlign: "center", fontSize: 22, opacity: faixa(frame, 20, 36) }} />
      <Rotulo texto="denso" style={{ position: "absolute", top: Y0 + alturaSeta + 18, left: 180, width: 100, textAlign: "center", fontSize: 22, opacity: faixa(frame, 112, 128) }} />

      {ORDEM_ELEMENTOS.map((el, i) => {
        const e = faixa(frame, 30 + i * 16, 30 + i * 16 + 24);
        const r = ELEMENTO[el];
        return (
          <div
            key={el}
            style={{
              position: "absolute",
              top: Y0 + i * PASSO,
              left: 300,
              display: "flex",
              alignItems: "center",
              gap: 40,
              opacity: e,
              transform: `translateX(${(1 - e) * -30}px)`,
            }}
          >
            <Glifo tipo={el} tamanho={TAM} t={frame} />
            <div>
              <div style={{ fontFamily: FONTE.serifa, fontSize: 64, color: COR.tinta, lineHeight: 1 }}>{r.nome}</div>
              <div style={{ fontFamily: FONTE.serifa, fontSize: 34, fontStyle: "italic", color: ELEMENTOS[el].cor, marginTop: 6 }}>
                {r.essencia}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 9. Os seis sabores, cada um com seus dois elementos (dados do app)        */
/* ------------------------------------------------------------------------ */

export const Sabores: React.FC = () => {
  const frame = useCurrentFrame();
  const Y0 = 520, PASSO = 150;

  return (
    <AbsoluteFill>
      <Titulo
        y={230}
        inicio={0}
        tamanho={96}
        palavras={[
          { t: SABORES.linha1, quebra: true },
          { t: SABORES.linha2, cor: COR.acafrao, italico: true },
        ]}
      />

      {SABORES.ordem.map((id, i) => {
        const [a, b] = elementosDoSabor(id);
        const nome = RASAS.find((r) => r.id === id)?.nome ?? id;
        const e = faixa(frame, 36 + i * 20, 36 + i * 20 + 24);
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              top: Y0 + i * PASSO,
              left: 110,
              right: 110,
              height: 130,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: i < SABORES.ordem.length - 1 ? `2px solid ${COR.fundo2}` : "none",
              opacity: e,
              transform: `translateX(${(1 - e) * -36}px)`,
            }}
          >
            <span style={{ fontFamily: FONTE.serifa, fontSize: 62, color: COR.tinta }}>{nome}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Glifo tipo={a} tamanho={104} t={frame} />
              <span style={{ fontFamily: FONTE.serifa, fontSize: 52, color: COR.tinta3 }}>+</span>
              <Glifo tipo={b} tamanho={104} t={frame} />
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 10. Fecho: dois elementos viram um dosha, e o gancho para o próximo vídeo */
/* ------------------------------------------------------------------------ */

export const Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = elementosDoDosha(FECHO.dosha);
  const dosha = DOSHAS[FECHO.dosha];
  const corDosha = ELEMENTOS.ar.cor; /* o índigo de Vata no app */

  const aparece = faixa(frame, 24, 50);
  const junta = faixa(frame, 62, 104, Easing.inOut(Easing.cubic));
  const TAM = 230;
  const xA = interpolate(junta, [0, 1], [290, 440]) - TAM / 2;
  const xB = interpolate(junta, [0, 1], [790, 640]) - TAM / 2;

  return (
    <AbsoluteFill>
      <Titulo
        y={240}
        inicio={0}
        tamanho={88}
        palavras={[
          { t: FECHO.linha1, quebra: true },
          { t: FECHO.linha2, cor: corDosha, italico: true },
        ]}
      />

      {/* halo que nasce quando os dois se encontram */}
      <div
        style={{
          position: "absolute",
          top: 560 + TAM / 2 - 220,
          left: LARGURA / 2 - 220,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${corDosha}33 0%, ${corDosha}00 70%)`,
          opacity: faixa(frame, 96, 130),
        }}
      />
      {[
        { el: a, x: xA },
        { el: b, x: xB },
      ].map(({ el, x }) => (
        <div key={el} style={{ position: "absolute", top: 560, left: x, opacity: aparece }}>
          <Glifo tipo={el} tamanho={TAM} t={frame} />
        </div>
      ))}

      <Linha y={830} entrada={108} style={{ fontFamily: FONTE.serifa, fontSize: 132, color: corDosha, fontWeight: 600, lineHeight: 1 }}>
        {dosha.nome}
      </Linha>
      <Linha y={980} entrada={118}>
        <Rotulo texto={dosha.el} />
      </Linha>

      <Linha y={1090} entrada={150}>
        <Rotulo texto={FECHO.proximo} />
        <div style={{ fontFamily: FONTE.serifa, fontSize: 64, fontStyle: "italic", color: COR.tinta, marginTop: 6 }}>
          {FECHO.proximoTema}
        </div>
      </Linha>

      <Linha y={1290} entrada={182}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Diya chama={1 + 0.07 * Math.sin(frame / 2.1) + 0.04 * Math.sin(frame / 0.9 + 1)} />
          <span style={{ fontFamily: FONTE.serifa, fontSize: 60, fontWeight: 600, color: COR.tinta }}>Rasoi</span>
        </div>
        <Rotulo texto={FECHO.cta} style={{ fontSize: 24, marginTop: 4 }} />
      </Linha>
    </AbsoluteFill>
  );
};
