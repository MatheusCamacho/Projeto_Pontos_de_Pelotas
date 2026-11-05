# Explicação do projeto — Pontos de Pelotas

## 1. Objetivo

O projeto demonstra como adicionar um mapa interativo a uma aplicação React. A pessoa consegue consultar pontos de referência, pesquisar e filtrar locais, selecionar posições no mapa e cadastrar novos pontos usando latitude e longitude obtidas pelo clique.

O exemplo foi mantido sem backend para que a apresentação fique concentrada na integração com mapas. Os pontos novos ficam armazenados no navegador por meio do `localStorage`.

## 2. Tecnologias e responsabilidades

### React

É utilizado para montar a interface e controlar os dados que mudam durante o uso. Por exemplo, a lista de locais, o termo de pesquisa, o filtro selecionado e os dados do formulário são estados React.

### React Leaflet

É a camada de integração entre React e Leaflet. Ele disponibiliza componentes e hooks que permitem descrever o mapa dentro da estrutura de componentes React.

### Leaflet

É a biblioteca que executa o mapa interativo. Neste projeto, ela é utilizada para criar ícones dos marcadores e trabalhar com o mapa que o React Leaflet disponibiliza.

### OpenStreetMap

É a fonte dos dados cartográficos utilizados na camada visual do mapa. O componente `TileLayer` solicita as imagens correspondentes à área que está sendo visualizada. O crédito do OpenStreetMap aparece no próprio mapa.

### Vite

É a ferramenta que inicia o servidor de desenvolvimento e prepara a versão de produção da aplicação.

## 3. Como a tela é organizada

- `App.jsx`: controla os estados e as ações da aplicação, como pesquisa, filtros, cadastro e localização do usuário.
- `MapView.jsx`: apresenta o mapa e cria os marcadores com base na lista recebida por propriedades.
- `MapControls.jsx`: contém componentes auxiliares que acessam o mapa e escutam o evento de clique.
- `categories.js`: centraliza as categorias e suas cores.
- `initialPlaces.js`: contém os pontos de referência iniciais.
- `storage.js`: lê e grava a lista no armazenamento local do navegador.
- `styles.css`: organiza a aparência e a adaptação para telas menores.

## 4. Fluxo de carregamento do mapa

1. `main.jsx` importa o CSS do Leaflet e os estilos da aplicação.
2. `createRoot` renderiza o componente principal `App`.
3. `App` carrega os locais guardados no navegador. Se ainda não existir uma lista salva, utiliza os locais iniciais.
4. `MapView` cria o `MapContainer` com centro e zoom iniciais.
5. O `TileLayer` carrega os tiles do OpenStreetMap.
6. Para cada local, o React gera um `Marker` na posição correspondente.
7. Cada marcador possui um `Popup` com nome, categoria, descrição e link para abrir aquela coordenada no OpenStreetMap.

## 5. Como funciona o cadastro por clique

1. A pessoa ativa o modo **Adicionar local**.
2. O estado `isAdding` passa a ser `true`.
3. O componente `MapClickHandler` recebe essa informação e registra o evento `click` por meio de `useMapEvents`.
4. Quando a pessoa clica no mapa, o evento entrega `event.latlng.lat` e `event.latlng.lng`.
5. Essas coordenadas são guardadas no estado `draftPoint`.
6. O formulário aparece para receber nome, categoria e descrição.
7. Ao salvar, o sistema valida o nome e monta um novo objeto com identificador, dados e coordenadas.
8. O novo ponto é adicionado ao estado `places`. Como a lista é usada para renderizar os marcadores, o ponto também aparece no mapa.
9. Um `useEffect` observa mudanças em `places` e grava a lista no `localStorage`.

## 6. Busca e filtros

A busca compara o texto informado com o nome e a descrição de cada local. O filtro compara a categoria selecionada com a categoria registrada no ponto. Os dois critérios são aplicados juntos com `Array.filter`, de modo que a lista lateral e os marcadores exibidos no mapa representem os mesmos resultados.

## 7. Centralização do mapa

Quando um local é selecionado na lista, a aplicação atualiza `focusRequest` com a latitude, a longitude e o zoom desejado. O componente `MapController` usa `useMap` para acessar a instância do Leaflet e chama `map.setView(...)`. Isso move o mapa até o local escolhido.

## 8. Geolocalização

O botão **Minha localização** chama `navigator.geolocation.getCurrentPosition`. O navegador solicita permissão e, quando ela é concedida, retorna as coordenadas. A aplicação mostra um círculo azul nessa posição e centraliza o mapa nela. Se o usuário negar o acesso ou o navegador não suportar o recurso, uma mensagem explica o problema.

## 9. Persistência com localStorage

`localStorage` é um recurso do navegador para guardar pares de chave e valor como texto. A aplicação transforma a lista de locais em JSON com `JSON.stringify` antes de salvar. Na leitura, utiliza `JSON.parse` para reconstruir a lista.

Isso resolve a persistência dentro do mesmo navegador, mas não substitui um banco de dados. Os registros não são compartilhados com o computador de outra pessoa e podem ser apagados quando os dados do navegador forem limpos.

## 10. O que poderia ser implementado depois

Uma evolução natural seria criar uma API para guardar os pontos em um banco de dados. Assim, vários usuários poderiam consultar a mesma lista. Também seria possível incluir autenticação, edição de locais, busca de endereços e cálculo de rotas usando um serviço próprio para cada necessidade.

## 11. Resumo em uma frase

React organiza a interface; React Leaflet conecta os componentes React ao Leaflet; Leaflet controla o mapa; e OpenStreetMap fornece a camada cartográfica exibida ao usuário.
