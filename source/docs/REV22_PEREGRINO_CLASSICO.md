# REV22 — Peregrino Clássico: cavalo mecânico de capô longo

## Objetivo

Separar visualmente o Peregrino Clássico dos modelos rígidos. O veículo é um cavalo mecânico tradicional de estrada com capô longo, cabine elevada, dormitório, carreta articulada e acabamento de época, sem reproduzir logotipos comerciais.

## Atualização da geometria 3D

- Perfil exclusivo do capô com linhas de chapa, venezianas de ventilação e grade de radiador cromada em profundidade.
- Faróis dianteiros redondos em aros de metal, para-choque com borracha e piscas âmbar.
- Para-brisa bipartido, borrachas, limpadores, portas com janelas, maçanetas, retrovisores e dois degraus.
- Dormitório separado, com teto elevado, janelas escurecidas e acabamentos laterais.
- Cinco lanternas superiores, identificação fictícia Peregrino e faixa lateral de acabamento.
- Escapamentos verticais duplos protegidos por placas térmicas, com grupo de geometria dinâmico para permitir substituir pela customização da oficina.
- Aros, dez porcas e blocos de pneus em todos os 6 eixos do conjunto, além de tanques, para-barros e acabamento da quinta roda.

## Compatibilidade

- Mesma especificação, preço, desempenho, progressão e save `carga-pesada-v1`.
- Preservados articulação do semirreboque, direção das rodas, carreta-baú e opção de carreta com lona.
- A cabine exclusiva não afeta os outros cinco caminhões da frota.
- Os componentes continuam com loteamento estático por material para reduzir draw calls.

## Critérios de entrega

Executar `npm test`, `npm run build` e `npm run check:dist`. Novo conjunto de nove testes para geometria, rodas, articulação, customização e regressão. A inspeção visual em WebGL e dispositivos móveis permanece necessária após a publicação.
