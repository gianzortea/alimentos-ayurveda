import { Composition, Folder } from "remotion";
import { DURACAO, QuadroDeEstilo } from "./QuadroDeEstilo";
import { ALTURA, LARGURA } from "./tema";
import { AyurvedaNaoEDieta, DURACAO as DURACAO_00 } from "./videos/ayurvedaNaoEDieta/AyurvedaNaoEDieta";
import { CincoElementos, DURACAO as DURACAO_CINCO } from "./videos/cincoElementos/CincoElementos";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuadroDeEstilo"
        component={QuadroDeEstilo}
        durationInFrames={DURACAO}
        fps={30}
        width={LARGURA}
        height={ALTURA}
      />

      <Folder name="Serie">
        <Composition
          id="T00-AyurvedaNaoEDieta"
          component={AyurvedaNaoEDieta}
          durationInFrames={DURACAO_00}
          fps={30}
          width={LARGURA}
          height={ALTURA}
        />
        <Composition
          id="T01-CincoElementos"
          component={CincoElementos}
          durationInFrames={DURACAO_CINCO}
          fps={30}
          width={LARGURA}
          height={ALTURA}
        />
      </Folder>
    </>
  );
};
