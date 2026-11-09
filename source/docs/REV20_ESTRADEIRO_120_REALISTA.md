# REV20 — Estradeiro 120 mais realista

Atualização visual do segundo caminhão da frota com cabine própria de caminhão rígido de verdade: frente mais trabalhada, grade em profundidade, para-brisa amplo, portas, maçanetas, degraus, para-lamas curvos, retrovisores e rodas mais detalhadas.

## O que muda
- modelo exclusivo em `src/estradeiro-120.mjs`;
- integração no `truck-model.mjs` sem alterar o save;
- parafusos, aros e sulcos nas rodas;
- detalhes de chassi e laterais.

## Compatibilidade
Mantém os outros caminhões, a física, upgrades, garagem, campanhas, carrocerias e a chave `carga-pesada-v1`.

## QA
+5 testes de modelagem do Estradeiro, elevando a suíte local para 112 testes. Build Vite e `check:dist` continuam obrigatórios antes da publicação.
