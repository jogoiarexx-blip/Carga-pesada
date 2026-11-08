# Carga Pesada v0.15 — desempenho gráfico e manutenção

Data: 08/11/2026

## Mudanças publicadas

- Três opções gráficas em Pausar: Alta (DPR até 1,7), Equilibrada (até 1,2) e Econômica (até 0,8). A preferência persiste na chave `carga-pesada-graphics` e não altera o save `carga-pesada-v1`.
- Minimapa e velocímetro passam a desenhar a cerca de 10 Hz, sem diminuir a simulação de direção de 60 Hz nem o tempo dos fretes, controle, HUD digital ou câmera.
- A versão passa a aparecer como v0.15. Layout responsivo para o controle de qualidade.

## Verificações

- 95/95 testes do código-fonte Vite (eram 93 na v0.14).
- `node --check` no arquivo fonte `src/game.js` e no arquivo de produção `assets/index-DHdQ5Cn1.js` atualizado.
- Não foi possível executar o build Vite local desta revisão por indisponibilidade do download de dependências no ambiente; por isso os recursos compilados existentes foram atualizados diretamente, com alterações equivalentes às do fonte.
- Não foi executado playtest visual completo no GitHub Pages, WebGL ou celular; verificar esses pontos antes de certificar FPS e jogabilidade.

## Próximas prioridades

1. Migrar `VITE_FONTE` ao repositório e habilitar CI de testes/build para que toda atualização seja reprodutível.
2. Adicionar telemetria de FPS no jogo e ajustar qualidade automaticamente sob quedas sustentadas de desempenho.
3. Refinar terreno, pontes físicas e colisões de estrada; consolidar a compatibilidade Canvas/WebGL.
4. Melhorar tráfego e IA de ultrapassagens, efeitos de clima fixos por missão e ampliar regiões.
