# REV26 — Correção da abertura da campanha

## Defeito
`Uncaught ReferenceError: introShownThisSession is not defined` ao clicar no botão que inicia o primeiro frete, antes da introdução cinematográfica.

## Causa
`startMission()` consultava e atribuía `introShownThisSession` sem que a variável tivesse sido declarada. O erro não é capturado pela compilação Vite e impedia iniciar a missão.

## Correção
- Declaração explícita `let introShownThisSession=false;` no escopo do módulo, junto do estado global da carreira.
- Em `startMission()`, o valor só muda para `true` quando a abertura é iniciada.
- Sem mudança na chave `carga-pesada-v1`, no save, nos contratos, nos duelos nem nos controles.
- Atualização da versão e do cache PWA para v0.26 para evitar servir o JS antigo offline.
- Teste de regressão garantindo declaração do estado e comportamento da introdução.

## Teste
`npm test && npm run build && npm run check:dist`.
