# Rasoi - Alimentos segundo o Ayurveda

Aplicação em HTML, CSS e JavaScript puros (sem build, sem dependências) para escolher alimentos
por **qualidade** (gunas) ou pelo **clima do dia**, seguindo os princípios clássicos do Ayurveda.

## Como abrir

Basta abrir `index.html` no navegador. Como o projeto carrega scripts separados, alguns navegadores
bloqueiam `file://` - se acontecer, sirva a pasta:

```bash
python -m http.server 8777
```

E acesse `http://localhost:8777`.

## Os três modos

**Por qualidades** - escolha as qualidades que você quer levar ao corpo. Elas vêm em pares opostos
(pesado/leve, quente/frio, oleoso/seco…), então selecionar uma desmarca automaticamente a oposta.
Dois modos de combinação: reunir *todas* as qualidades ou ter *qualquer uma* delas.
Opcionalmente refine por sabor (rasa).

**Por clima** - informe temperatura, umidade e vento (ou use um dos sete presets de estação).
O app aplica o princípio *samanya vishesha*: o semelhante aumenta, o oposto equilibra. Ele diagnostica
quais doshas o clima eleva, deriva as qualidades a buscar e a evitar, e pontua os 135 alimentos.
Os resultados vêm agrupados por categoria, ordenados por afinidade dentro de cada grupo,
com uma lista separada do que moderar.

**Guia** - dicionário das 18 qualidades, dos 6 sabores e dos 3 doshas, com atalhos para buscar
alimentos a partir de qualquer verbete.

Em qualquer tela: busca por nome, filtro por categoria, filtro "não agravar dosha X",
detalhe completo de cada alimento e uma lista de compras salva no navegador.

## Estrutura

```
index.html          marcação e diálogos
css/style.css       tema claro e escuro, layout responsivo
js/data.js          taxonomia: qualidades, sabores, categorias, doshas
js/alimentos.js     base de 135 alimentos classificados
js/clima.js         motor climático (regras por eixo térmico, hídrico e de vento)
js/app.js           estado, filtros, pontuação e renderização
```

## Modelo de dados

Cada alimento carrega:

| campo   | significado |
|---------|-------------|
| `rasa`  | sabores predominantes entre os seis |
| `virya` | potência térmica: `quente` (ushna) ou `frio` (shita) |
| `gunas` | demais qualidades físicas - a térmica é derivada do virya, nunca duplicada |
| `dosha` | efeito em Vata, Pitta e Kapha: `-1` pacifica, `0` neutro, `+1` agrava |
| `icone` | *(opcional)* emoji do próprio alimento; sem ele, herda o da categoria |
| `dica`  | orientação prática de preparo |

Para acrescentar alimentos, basta adicionar objetos no mesmo formato em `js/alimentos.js`,
nada mais precisa ser alterado.

## Como o clima é traduzido

Três eixos independentes (térmico, hídrico e vento) somam suas regras em `js/clima.js`.
Quando dois eixos pedem coisas opostas - vento pede oleoso, umidade pede seco - a qualidade sai
das duas listas e aparece como "depende do contexto", em vez de ser decidida arbitrariamente.

A pontuação de cada alimento soma: +2 por qualidade favorecida, −2 por qualidade a evitar,
±1,5 por sabor, e um peso proporcional ao efeito sobre os doshas que o clima já está elevando.

## Ao publicar uma mudança

O GitHub Pages serve **tudo** com `Cache-Control: max-age=600`, inclusive o `index.html`. Ou seja:
quem já visitou o site pode continuar vendo a versão antiga por até 10 minutos, e não há como
encurtar isso, o Pages não deixa configurar os cabeçalhos.

O que dá para evitar é o pior caso: o navegador buscar o HTML novo e mesmo assim reaproveitar o CSS
e o JS velhos do cache, servindo uma mistura das duas versões. Por isso os assets carregam com
sufixo de versão:

```html
<link rel="stylesheet" href="css/style.css?v=3">
<script src="js/app.js?v=3"></script>
```

**Ao alterar o CSS ou qualquer JS, incremente esse `?v=` nas cinco linhas.** O sufixo muda a URL,
então o navegador é obrigado a baixar o arquivo novo assim que pegar o HTML novo, nunca uma
metade de cada versão.

Para conferir um deploy sem esperar o cache expirar, acesse com uma query qualquer na ponta:
`https://gianzortea.github.io/alimentos-ayurveda/?cb=1`.

## Aviso

Conteúdo educativo, baseado em princípios clássicos do Ayurveda. Não substitui avaliação médica
ou nutricional individual.
