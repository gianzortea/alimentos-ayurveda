import { AbsoluteFill } from "remotion";
import { ALTURA, COR, LARGURA } from "../tema";

/* Fundo de papel: creme liso + manchas largas + grão fino + vinheta quente.
   Tudo estático, para o papel não "ferver" entre um frame e outro. */
export const Papel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <svg width={LARGURA} height={ALTURA} style={{ position: "absolute" }}>
        <defs>
          <filter id="manchas" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves="3" seed="7" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.55
                      0 0 0 0 0.40
                      0 0 0 0 0.22
                      0 0 0 1.4 -0.55"
            />
          </filter>

          <filter id="grao" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <radialGradient id="vinheta" cx="50%" cy="46%" r="75%">
            <stop offset="60%" stopColor="#7a5a32" stopOpacity="0" />
            <stop offset="100%" stopColor="#7a5a32" stopOpacity="0.16" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" filter="url(#manchas)" opacity="0.22" />
        <rect width="100%" height="100%" filter="url(#grao)" opacity="0.07" style={{ mixBlendMode: "multiply" }} />
        <rect width="100%" height="100%" fill="url(#vinheta)" />
      </svg>
    </AbsoluteFill>
  );
};
