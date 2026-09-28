import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { AnelTriplo, OndaTripla } from "../../componentes/Ciclos";
import { Glifo } from "../../componentes/Glifos";
import { Diya } from "../../componentes/Ilustracoes";
import { faixa, Linha, Rotulo, Titulo } from "../../componentes/Texto";
import { ALTURA, COR, FONTE, FORCAS, LARGURA, ORDEM_ELEMENTOS } from "../../tema";
import { ALINHAR, FECHO, FORCAS_TXT, GANCHO, NOME, OBJETIVOS, PULSOS, UNIAO } from "./roteiro";

/* As cenas que não são a primeira ficam invisíveis nos ~10 primeiros frames
   (metade da transição). Por isso as entradas começam a partir do frame 12. */

const CORES_FORCA = [FORCAS.kapha.cor, FORCAS.pitta.cor, FORCAS.vata.cor];

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={LARGURA} height={ALTURA} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------------ */
/* 1. Gancho                                                                 */
/* ------------------------------------------------------------------------ */

export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* o pulso já está no fundo desde o primeiro quadro, bem discreto */}
      <Tela>
        <AnelTriplo cx={540} cy={800} r={400} angulo={frame * 0.3} espessura={10} opacidade={0.1} />
        <AnelTriplo cx={540} cy={800} r={320} angulo={-frame * 0.5} espessura={10} opacidade={0.08} />
      </Tela>
      <Titulo
        y={500}
        inicio={0}
        tamanho={122}
        palavras={[{ t: GANCHO.linha1[0], quebra: true }, { t: GANCHO.linha1[1] }]}
      />
      <Titulo
        y={840}
        inicio={40}
        tamanho={84}
        palavras={[
          { t: GANCHO.linha2[0], quebra: true },
          { t: GANCHO.linha2[1], cor: COR.terra, italico: true },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 2. O nome: Āyus + Veda                                                    */
/* ------------------------------------------------------------------------ */

export const Nome: React.FC = () => {
  const frame = useCurrentFrame();
  const traco = faixa(frame, 44, 74, Easing.inOut(Easing.cubic));
  const COLUNAS = [300, 780];

  return (
    <AbsoluteFill>
      <Linha y={300} entrada={12} style={{ fontFamily: FONTE.devanagari, fontSize: 156, color: COR.tinta, lineHeight: 1.3 }}>
        {NOME.palavra}
      </Linha>

      {/* a palavra se abre em duas */}
      <Tela>
        {COLUNAS.map((x) => {
          const y1 = 540, y2 = 600;
          const comp = Math.hypot(x - 540, y2 - y1);
          return (
            <line key={x} x1={540} y1={y1} x2={x} y2={y2} stroke={COR.tinta3} strokeWidth={3}
              strokeLinecap="round" strokeDasharray={comp} strokeDashoffset={comp * (1 - traco)} />
          );
        })}
      </Tela>

      {NOME.partes.map((p, i) => {
        const e = faixa(frame, 64 + i * 22, 64 + i * 22 + 26);
        return (
          <div
            key={p.translit}
            style={{
              position: "absolute",
              top: 620,
              left: COLUNAS[i] - 210,
              width: 420,
              textAlign: "center",
              opacity: e,
              transform: `translateY(${(1 - e) * 20}px)`,
            }}
          >
            <div style={{ fontFamily: FONTE.devanagari, fontSize: 88, color: COR.tinta, lineHeight: 1.3 }}>{p.devanagari}</div>
            <div style={{ fontFamily: FONTE.serifa, fontSize: 54, fontStyle: "italic", fontWeight: 600, color: COR.terra, marginTop: 4 }}>
              {p.translit}
            </div>
            <div style={{ fontFamily: FONTE.serifa, fontSize: 42, color: COR.tinta2, marginTop: 6 }}>{p.sentido}</div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 690,
          width: LARGURA,
          textAlign: "center",
          fontFamily: FONTE.serifa,
          fontSize: 64,
          color: COR.tinta3,
          opacity: faixa(frame, 76, 96),
        }}
      >
        +
      </div>

      <Linha y={990} entrada={132}>
        <div style={{ width: 120, height: 3, backgroundColor: COR.acafrao, margin: "0 auto 28px", borderRadius: 2 }} />
        <div style={{ fontFamily: FONTE.serifa, fontSize: 88, fontStyle: "italic", fontWeight: 600, color: COR.terra, lineHeight: 1.1 }}>
          {NOME.resultado}
        </div>
      </Linha>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 3. A vida como união de corpo, sentidos, mente e consciência              */
/* ------------------------------------------------------------------------ */

export const Uniao: React.FC = () => {
  const frame = useCurrentFrame();
  const CX = 540, CY = 870, R = 200;
  const C = 2 * Math.PI * R;
  const circulo = faixa(frame, 44, 150, Easing.inOut(Easing.cubic));
  const centro = faixa(frame, 150, 180);

  /* corpo no topo, depois em sentido horário */
  const POS = [
    { x: CX, y: CY - R, lado: "cima" },
    { x: CX + R, y: CY, lado: "direita" },
    { x: CX, y: CY + R, lado: "baixo" },
    { x: CX - R, y: CY, lado: "esquerda" },
  ] as const;

  return (
    <AbsoluteFill>
      <Titulo
        y={250}
        inicio={12}
        tamanho={96}
        palavras={[{ t: UNIAO.titulo[0], quebra: true }, { t: UNIAO.titulo[1] }]}
      />

      <div
        style={{
          position: "absolute",
          top: CY - 240,
          left: CX - 240,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COR.acafrao}44 0%, ${COR.acafrao}00 65%)`,
          opacity: centro,
        }}
      />

      <Tela>
        <circle
          cx={CX} cy={CY} r={R} fill="none" stroke={COR.acafrao} strokeWidth={5}
          strokeDasharray={C} strokeDashoffset={C * (1 - circulo)}
          transform={`rotate(-90 ${CX} ${CY})`} strokeLinecap="round"
        />
        {POS.map((p, i) => {
          const e = faixa(frame, 40 + i * 26, 40 + i * 26 + 16);
          return <circle key={i} cx={p.x} cy={p.y} r={15 * e} fill={COR.tinta} />;
        })}
      </Tela>

      {POS.map((p, i) => {
        const e = faixa(frame, 44 + i * 26, 44 + i * 26 + 22);
        const parte = UNIAO.partes[i];
        const base: React.CSSProperties = {
          position: "absolute",
          opacity: e,
          fontFamily: FONTE.serifa,
          lineHeight: 1.1,
        };
        const posicao: React.CSSProperties =
          p.lado === "cima" ? { left: CX - 250, width: 500, top: p.y - 128, textAlign: "center" } :
          p.lado === "baixo" ? { left: CX - 250, width: 500, top: p.y + 34, textAlign: "center" } :
          p.lado === "direita" ? { left: p.x + 36, top: p.y - 38, textAlign: "left" } :
          { right: LARGURA - p.x + 36, top: p.y - 38, textAlign: "right" };
        return (
          <div key={parte.nome} style={{ ...base, ...posicao }}>
            <div style={{ fontSize: 48, color: COR.tinta }}>{parte.nome}</div>
            <div style={{ fontSize: 30, fontStyle: "italic", color: COR.tinta3, marginTop: 6 }}>{parte.sans}</div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          top: CY - 44,
          width: LARGURA,
          textAlign: "center",
          fontFamily: FONTE.serifa,
          fontSize: 72,
          fontStyle: "italic",
          fontWeight: 600,
          color: COR.terra,
          opacity: centro,
          transform: `scale(${0.9 + 0.1 * centro})`,
        }}
      >
        vida
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 4. Tudo pulsa: o relógio de ciclos                                        */
/* ------------------------------------------------------------------------ */

const RAIOS = [88, 148, 208, 268, 328];
const VELOCIDADES = [2.2, 1.2, 0.7, 0.35, 0.15];   /* do pulso mais rápido ao mais lento */

export const Pulsos: React.FC = () => {
  const frame = useCurrentFrame();
  const aceso = (i: number) => faixa(frame, 56 + i * 48, 56 + i * 48 + 22);

  return (
    <AbsoluteFill>
      <Titulo
        y={220}
        inicio={12}
        tamanho={100}
        palavras={[
          { t: PULSOS.titulo[0], quebra: true },
          { t: PULSOS.titulo[1], cor: COR.terra, italico: true },
        ]}
      />

      <Tela>
        {RAIOS.map((r, i) => {
          const a = aceso(i);
          const entra = faixa(frame, 18 + i * 6, 18 + i * 6 + 20);
          return (
            <AnelTriplo
              key={r}
              cx={540}
              cy={810}
              r={r}
              angulo={frame * VELOCIDADES[i] + i * 47}
              espessura={9 + 7 * a}
              opacidade={entra * (0.16 + 0.84 * a)}
            />
          );
        })}
        <circle cx={540} cy={810} r={10} fill={COR.tinta} opacity={faixa(frame, 18, 30)} />
      </Tela>

      {PULSOS.ciclos.map((c, i) => {
        const a = aceso(i);
        return (
          <div
            key={c.nome}
            style={{
              position: "absolute",
              top: 1175 + i * 62,
              width: LARGURA,
              textAlign: "center",
              opacity: a,
              transform: `translateY(${(1 - a) * 14}px)`,
            }}
          >
            <span style={{ fontFamily: FONTE.serifa, fontSize: 46, color: COR.tinta }}>{c.nome}</span>
            <span style={{ fontFamily: FONTE.serifa, fontSize: 32, fontStyle: "italic", color: COR.tinta3, marginLeft: 18 }}>
              {c.escala}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 5. As três forças                                                         */
/* ------------------------------------------------------------------------ */

export const Forcas: React.FC = () => {
  const frame = useCurrentFrame();
  const revela = faixa(frame, 24, 84, Easing.inOut(Easing.cubic));
  const amplitude = 88 * (0.85 + 0.15 * Math.sin(frame / 12));

  return (
    <AbsoluteFill>
      <Titulo
        y={250}
        inicio={12}
        tamanho={100}
        palavras={[
          { t: FORCAS_TXT.titulo[0], quebra: true },
          { t: FORCAS_TXT.titulo[1], cor: COR.acafrao, italico: true },
        ]}
      />

      <Tela>
        <defs>
          <clipPath id="revela-onda">
            <rect x={0} y={0} width={LARGURA * revela} height={ALTURA} />
          </clipPath>
        </defs>
        <g clipPath="url(#revela-onda)">
          <OndaTripla y={780} largura={LARGURA} amplitude={amplitude} trecho={360} deslocamento={0} espessura={18} />
        </g>
      </Tela>

      {FORCAS_TXT.forcas.map((f, i) => {
        const e = faixa(frame, 72 + i * 24, 72 + i * 24 + 24);
        return (
          <div
            key={f.forca}
            style={{
              position: "absolute",
              top: 960,
              left: i * 360,
              width: 360,
              textAlign: "center",
              opacity: e,
              transform: `translateY(${(1 - e) * 18}px)`,
            }}
          >
            <div style={{ fontFamily: FONTE.serifa, fontSize: 60, color: COR.tinta }}>{f.forca}</div>
            <div style={{ fontFamily: FONTE.serifa, fontSize: 46, fontStyle: "italic", fontWeight: 600, color: CORES_FORCA[i], marginTop: 6 }}>
              {f.dosha}
            </div>
          </div>
        );
      })}

      <Linha y={1210} entrada={170} style={{ fontFamily: FONTE.serifa, fontSize: 46, color: COR.tinta2 }}>
        E se sucedem sempre nessa ordem.
      </Linha>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 6. Alinhar o ritmo de dentro com o de fora                                */
/* ------------------------------------------------------------------------ */

export const Alinhar: React.FC = () => {
  const frame = useCurrentFrame();
  const CX = 540, CY = 770;

  /* o anel de fora gira constante; o de dentro começa fora de fase e se ajusta */
  const fora = frame * 0.9;
  const ajuste = faixa(frame, 110, 190, Easing.inOut(Easing.cubic));
  const deriva = (170 + 1.3 * frame) * (1 - ajuste);
  const dentro = fora + deriva;

  const encaixe = faixa(frame, 186, 226);
  const onda = faixa(frame, 190, 250, Easing.out(Easing.cubic));
  const entra = faixa(frame, 16, 40);

  return (
    <AbsoluteFill>
      <Titulo
        y={230}
        inicio={12}
        tamanho={84}
        palavras={[
          { t: ALINHAR.titulo[0], quebra: true },
          { t: ALINHAR.titulo[1], cor: COR.terra, italico: true },
        ]}
      />

      <div
        style={{
          position: "absolute",
          top: CY - 340,
          left: CX - 340,
          width: 680,
          height: 680,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COR.acafrao}3a 0%, ${COR.acafrao}00 65%)`,
          opacity: encaixe,
        }}
      />

      <Tela>
        <g opacity={entra}>
          <AnelTriplo cx={CX} cy={CY} r={250} angulo={fora} espessura={16} />
          <AnelTriplo cx={CX} cy={CY} r={165} angulo={dentro} espessura={16} />
        </g>
        {onda > 0 && onda < 1 && (
          <circle cx={CX} cy={CY} r={260 + 160 * onda} fill="none" stroke={COR.acafrao}
            strokeWidth={5} opacity={0.5 * (1 - onda)} />
        )}
      </Tela>

      <Rotulo texto={ALINHAR.fora} style={{ position: "absolute", top: CY - 318, width: LARGURA, textAlign: "center", opacity: entra }} />
      <Rotulo texto={ALINHAR.dentro} style={{ position: "absolute", top: CY - 16, width: LARGURA, textAlign: "center", opacity: entra }} />

      {ALINHAR.frutos.map((f, i) => (
        <Linha key={f.antes} y={1090 + i * 76} entrada={208 + i * 30} style={{ fontFamily: FONTE.serifa, fontSize: 60, color: COR.tinta }}>
          {f.antes} <i style={{ color: COR.salvia, fontWeight: 600 }}>{f.depois}</i>
        </Linha>
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 7. Os dois objetivos, nessa ordem                                         */
/* ------------------------------------------------------------------------ */

export const Objetivos: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Linha y={240} entrada={12} style={{ fontFamily: FONTE.serifa, fontSize: 76, color: COR.tinta, lineHeight: 1.1 }}>
        {OBJETIVOS.titulo}
      </Linha>
      <Linha y={450} entrada={40} style={{ fontFamily: FONTE.serifa, fontSize: 64, fontStyle: "italic", fontWeight: 600, color: COR.acafrao }}>
        {OBJETIVOS.ordem}
      </Linha>

      {OBJETIVOS.itens.map((item, i) => {
        const e = faixa(frame, 76 + i * 70, 76 + i * 70 + 26);
        return (
          <div
            key={item.texto}
            style={{
              position: "absolute",
              top: 610 + i * 290,
              left: 110,
              right: 110,
              display: "flex",
              gap: 36,
              alignItems: "flex-start",
              opacity: e,
              transform: `translateX(${(1 - e) * -30}px)`,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: `4px solid ${COR.acafrao}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTE.serifa,
                fontSize: 54,
                fontWeight: 600,
                color: COR.acafrao,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontFamily: FONTE.serifa, fontSize: 58, color: COR.tinta, lineHeight: 1.15 }}>{item.texto}</div>
              <div style={{ fontFamily: FONTE.devanagari, fontSize: 38, color: COR.tinta3, marginTop: 14 }}>{item.sutra}</div>
            </div>
          </div>
        );
      })}

      <Linha y={1250} entrada={200}>
        <Rotulo texto={OBJETIVOS.fonte} style={{ fontSize: 22 }} />
      </Linha>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* 8. Fecho: experimento de hoje e próximo vídeo                             */
/* ------------------------------------------------------------------------ */

export const Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const chama = 1 + 0.07 * Math.sin(frame / 2.1) + 0.04 * Math.sin(frame / 0.9 + 1);

  return (
    <AbsoluteFill>
      <Linha y={300} entrada={12}>
        <Rotulo texto={FECHO.rotulo} style={{ color: COR.acafrao }} />
      </Linha>
      <Linha y={356} entrada={20} style={{ fontFamily: FONTE.serifa, fontSize: 74, color: COR.tinta, lineHeight: 1.1 }}>
        {FECHO.experimento[0]}
        <br />
        <i style={{ color: COR.terra, fontWeight: 600 }}>{FECHO.experimento[1]}</i>
      </Linha>

      <Tela>
        <g opacity={faixa(frame, 30, 56)}>
          <AnelTriplo cx={540} cy={720} r={78} angulo={frame * 1.6} espessura={11} />
          <circle cx={540} cy={720} r={8} fill={COR.tinta} />
        </g>
      </Tela>

      <Linha y={880} entrada={70}>
        <Rotulo texto={FECHO.proximo} />
        <div style={{ fontFamily: FONTE.serifa, fontSize: 62, fontStyle: "italic", color: COR.tinta, marginTop: 6 }}>
          {FECHO.proximoTema}
        </div>
      </Linha>
      <div
        style={{
          position: "absolute",
          top: 1030,
          width: LARGURA,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          opacity: faixa(frame, 88, 112),
        }}
      >
        {ORDEM_ELEMENTOS.map((el) => (
          <Glifo key={el} tipo={el} tamanho={58} vivo={false} />
        ))}
      </div>

      <Linha y={1200} entrada={118}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Diya chama={chama} />
          <span style={{ fontFamily: FONTE.serifa, fontSize: 60, fontWeight: 600, color: COR.tinta }}>Rasoi</span>
        </div>
        <Rotulo texto={FECHO.cta} style={{ fontSize: 24, marginTop: 4 }} />
      </Linha>
    </AbsoluteFill>
  );
};
