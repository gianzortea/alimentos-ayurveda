import { Cena, linhaDoTempo, Serie } from "../../componentes/Serie";
import { Alinhar, Fecho, Forcas, Gancho, Nome, Objetivos, Pulsos, Uniao } from "./Cenas";

/* ==========================================================================
   Tema 00 - Ayurveda não é uma dieta
   ========================================================================== */

const CENAS: Cena[] = [
  { id: "gancho", dur: 135, render: () => <Gancho /> },
  { id: "nome", dur: 270, render: () => <Nome /> },
  { id: "uniao", dur: 210, render: () => <Uniao /> },
  { id: "pulsos", dur: 450, render: () => <Pulsos /> },
  { id: "forcas", dur: 330, render: () => <Forcas /> },
  { id: "alinhar", dur: 450, render: () => <Alinhar /> },
  { id: "objetivos", dur: 360, render: () => <Objetivos /> },
  { id: "fecho", dur: 210, render: () => <Fecho /> },
];

export const DURACAO = linhaDoTempo(CENAS).duracao;

export const AyurvedaNaoEDieta: React.FC = () => <Serie cenas={CENAS} />;
