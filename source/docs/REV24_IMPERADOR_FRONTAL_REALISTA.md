# Carga Pesada — REV24 · Imperador Frontal

## Objetivo

Substituir a cabine genérica sobre o motor do último veículo da frota por geometria 3D exclusiva, com linguagem visual de cavalo mecânico 4x2 de cabine avançada. O modelo mantém a identidade ficcional Imperador, sem reproduzir marcas ou logotipos de terceiros.

## Alterações implementadas

- Cabine alta esculpida com teto, calhas, defletor superior discreto e carenagens laterais.
- Para-brisa dividido, vidros laterais, borrachas, molduras, limpadores e braços independentes.
- Frente vertical de radiador profundo, sete lâminas cromadas, faróis duplos, piscas âmbar, neblinas, placa e para-choque pesado.
- Portas e juntas de chapa, puxadores, venezianas de ventilação, dois estribos antiderrapantes, espelhos principais e auxiliares.
- Aro e porcas de roda com materiais reaproveitados, pneus com blocos de banda de rodagem, tanques, para-barros e travessas de chassi.
- Preservados o pivô da quinta roda, carreta articulada, o baú e a lona, pintura e sistema de acessórios.

## QA

Oito testes de regressão em `tests/imperador-frontal.test.mjs`: cabine própria, vidros, frente, laterais, direção/rodas/carreta, carrocerias/pintura, dimensões/desempenho e compatibilidade com a frota e save. Execução da suíte completa e build Vite são pré-condições para publicação. A inspeção visual real em WebGL/celular permanece distinta dos testes estáticos.

## Dados da carreira preservados

`vehicleId=imperador`, `cab=frontal`, `category=tractor`, `axles=2`, `bodyOptions=['box_trailer','tarp_trailer']`, `price=39000`, `length=15.8`, dados da frota e chave `carga-pesada-v1` inalterados.
