# REV23 — Falcão Aero remodelado

## Objetivo

O quinto caminhão da frota agora possui uma modelagem 3D própria e mais convincente, inspirada nas proporções de cavalos mecânicos modernos de capô longo, sem reproduzir marcas registradas de fabricantes.

## Melhorias

- Capô inclinado com crista aerodinâmica, linhas laterais e respiros do motor.
- Cabine alta perfilada e dormitório integrado, com defletor de teto e carenagens laterais.
- Para-brisa panorâmico com vedação e limpadores; vidros das portas e dormitório independentes.
- Frente com grade profunda, aletas cromadas, faróis com assinatura luminosa, piscas e entradas de ar.
- Para-choque moldado com spoiler, estribos antiderrapantes, portas, retrovisores e para-lamas curvos.
- Aros de rodas, porcas e banda de rodagem em todos os seis eixos do conjunto articulado.
- Tanques carenados, quinta roda, travessas e refletores do chassi.

## Compatibilidade

- Mantém os seis veículos, salvamento `carga-pesada-v1`, a pintura e o catálogo de acessórios.
- Mantém as configurações de carreta baú e lona e a articulação da carreta, com direção e giro das rodas.
- A melhoria altera apenas a geometria do `falcao`; nenhuma regra de colisão, preço, física ou desbloqueio é alterada.
- Na interface, o identificador de versão passa para v0.23, com service worker versionado.

## Testes

- 9 novos testes de renderização e regressão de veículo.
- Suíte completa da fonte executada antes do envio.
- Publicação exige CI do GitHub Actions: testes, build Vite e validação de `dist`.
- Aspecto em WebGL e dispositivos reais exige revisão visual posterior.
