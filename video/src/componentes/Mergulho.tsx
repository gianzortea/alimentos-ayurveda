import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

/* Transição "mergulho no papel". As cenas têm fundo transparente sobre um
   papel fixo, então um crossfade comum sobrepõe os textos das duas. Aqui a
   cena que sai some na primeira metade e a que entra surge na segunda:
   nunca há dois textos na tela ao mesmo tempo. */

type Props = Record<string, never>;

const MergulhoComponente: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const entrando = presentationDirection === "entering";
  const p = entrando
    ? interpolate(presentationProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(presentationProgress, [0, 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  /* um leve deslocamento vertical dá direção à troca */
  const y = entrando ? (1 - p) * 24 : (1 - p) * -24;

  return <AbsoluteFill style={{ opacity: p, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

export const mergulho = (): TransitionPresentation<Props> => ({
  component: MergulhoComponente,
  props: {},
});
