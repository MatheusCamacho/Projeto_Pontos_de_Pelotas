# Pontos de Pelotas — mapa interativo

Projeto de demonstração da integração de mapas em uma aplicação React, utilizando **React Leaflet**, **Leaflet** e os mapas do **OpenStreetMap**.

## O que a aplicação faz

- Exibe um mapa interativo centralizado em Pelotas/RS.
- Mostra marcadores de locais de referência da cidade.
- Abre um cartão de informações ao selecionar um marcador.
- Permite pesquisar locais pelo nome ou pela descrição.
- Permite filtrar os locais por categoria.
- Permite cadastrar um ponto clicando diretamente no mapa.
- Salva os pontos cadastrados no `localStorage` do navegador.
- Permite excluir pontos adicionados pelo usuário.
- Pode solicitar a localização atual do usuário, mediante autorização do navegador.
- Abre a posição selecionada no site do OpenStreetMap.

## Requisitos

- Node.js **20.19 ou superior**.
- npm (instalado junto com o Node.js).
- Acesso à internet para baixar as dependências e carregar os mapas.

## Como executar

Abra o terminal dentro da pasta do projeto e execute:

```bash
npm install
npm run dev
```

O Vite exibirá um endereço local, normalmente `http://localhost:5173`. Abra esse endereço no navegador.

Para gerar a versão de produção:

```bash
npm run build
```

Para testar a versão de produção localmente:

```bash
npm run preview
```

## Como demonstrar em sala

1. Abra a aplicação e mostre o mapa de Pelotas com os marcadores iniciais.
2. Clique em um marcador e explique que o `Popup` apresenta informações do ponto.
3. Pesquise por “Mercado” e mostre o filtro por texto.
4. Selecione uma categoria para mostrar o filtro por tipo de local.
5. Clique em **Adicionar local** e, depois, clique em uma área vazia do mapa.
6. Informe nome, categoria e descrição; salve o novo ponto.
7. Atualize a página e mostre que o ponto continua salvo no mesmo navegador.
8. Clique em **Minha localização**. O navegador solicitará permissão; autorize para mostrar o marcador de localização.
9. Selecione um ponto criado pelo usuário e demonstre a opção de removê-lo.

## Organização do código

```text
src/
├── components/
│   ├── MapControls.jsx  # Controla o foco do mapa e os cliques no mapa
│   └── MapView.jsx      # Monta o mapa, os marcadores, os pop-ups e a camada base
├── data/
│   ├── categories.js    # Categorias, cores e símbolos dos marcadores
│   └── initialPlaces.js # Locais iniciais usados na demonstração
├── utils/
│   └── storage.js       # Leitura e gravação dos pontos no localStorage
├── App.jsx              # Interface, filtros, cadastro e regras da aplicação
├── main.jsx             # Inicialização do React e importação dos estilos
└── styles.css           # Estilos e comportamento responsivo
```

## Como a integração funciona

1. O `MapContainer`, do React Leaflet, cria e mantém a instância do mapa Leaflet.
2. O `TileLayer` solicita as imagens cartográficas ao servidor de tiles do OpenStreetMap.
3. Cada `Marker` recebe uma posição geográfica (`latitude` e `longitude`).
4. O `Popup` é exibido quando o marcador é selecionado.
5. `useMapEvents` captura o clique no mapa. Durante o cadastro, as coordenadas do clique são aproveitadas como posição do novo local.
6. `useMap` permite acessar a instância do mapa e centralizá-la em um ponto selecionado.
7. A API de geolocalização do navegador (`navigator.geolocation`) fornece as coordenadas do usuário somente depois de uma ação e da autorização correspondente.
8. O `localStorage` mantém os pontos cadastrados no navegador, mesmo depois de atualizar a página.

## Bibliotecas utilizadas

| Pacote | Função no projeto |
|---|---|
| `react` e `react-dom` | Construção e renderização da interface. |
| `leaflet` | Biblioteca responsável pelo mapa interativo. |
| `react-leaflet` | Componentes React que conectam a interface ao Leaflet. |
| `vite` | Servidor de desenvolvimento e ferramenta de build. |
| `@vitejs/plugin-react` | Suporte ao React no Vite. |

## Limites desta demonstração

- Não existe servidor ou banco de dados. Os pontos criados ficam no navegador e não são compartilhados entre computadores.
- A aplicação precisa de internet para carregar os tiles do OpenStreetMap.
- A localização atual depende do suporte do navegador, da permissão do usuário e de um contexto seguro (localhost também é aceito para desenvolvimento).
- Os três locais iniciais servem como exemplos de referência em Pelotas; as coordenadas são aproximadas.
- O serviço público de tiles do OpenStreetMap é destinado a uso compatível com sua política. Não faça download em massa, pré-carregamento de áreas ou uso offline desses tiles.

## Créditos e referências técnicas

- React Leaflet — documentação de instalação: https://react-leaflet.js.org/docs/start-installation/
- React Leaflet — configuração inicial: https://react-leaflet.js.org/docs/start-setup/
- Leaflet — guia rápido: https://leafletjs.com/examples/quick-start/
- OpenStreetMap — política de uso dos tiles: https://operations.osmfoundation.org/policies/tiles/
- OpenStreetMap — direitos autorais e atribuição: https://www.openstreetmap.org/copyright

As coordenadas iniciais foram obtidas de referências públicas de localização:

- Praça Coronel Pedro Osório: https://guiamapa.com/rs/pelotas/centro/praca-coronel-pedro-osorio
- Mercado Público Central: https://mapcarta.com/pt/37362428
- Catedral do Redentor: https://brfirmas.org/Catedral%2Bdo%2BRedentor%2BIgreja%2BCabeluda-2737322

**Crédito do mapa:** © OpenStreetMap contributors. A atribuição aparece no canto inferior do próprio mapa.
