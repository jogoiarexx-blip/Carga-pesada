# Carga Pesada v0.4 — Viagens verificáveis

## Falhas corrigidas

| Área | Antes | Agora |
|---|---|---|
| Relógio | Cada quadro era limitado a 0,05 s: FPS baixo causava câmera lenta | Acumulador com passos fixos de 1/60 s; intervalos acima de 1 s pausam a viagem |
| Boost | Limite normal cortava o impulso no passo seguinte | Limite esportivo +15 km/h e aceleração adicional durante o boost |
| Chegada com colisão | Integridade era julgada antes da batida daquele quadro | Colisões e danos resolvidos antes de pagar ou conceder vitória |
| Prazo | Quadro que ultrapassava prazo podia negar chegada válida | Passo limitado ao prazo, chegada na linha dentro dele é aceita |
| Pagamento | Mutação estava dentro da função de interface | Resultado terminal idempotente na sessão compartilhada |
| Largada | Coiote começava 30 m à frente | Mesma posição longitudinal, faixas distintas |
| Verificação | Física isolada e dinheiro testados separadamente | Sessão inteira compartilhada com a interface, incluindo tráfego e rival |

## Replays da simulação

Controlador automático, Aurora original, sem upgrades, tráfego ligado nos fretes. Tempo de entrada a 30 FPS, passos de física a 60 Hz. Estes números não medem capacidade da GPU nem uma partida humana.

| Missão | Tempo | Carga | Colisões | Líquido | Bônus único | Caixa acumulado |
|---|---:|---:|---:|---:|---:|---:|
| M01 | 89,60 s | 100% | 0 | 1.476 | 250 | 2.926 |
| M02 | 118,22 s | 100% | 0 | 1.768 | 400 | 5.094 |
| M03 | 156,38 s | 100% | 0 | 2.398 | 500 | 7.992 |
| M04 | 115,55 s | 100% | 0 | 2.165 | 700 | 10.857 |

Valores em CR$. Caixa inicial de 1.200. Uma repetição de M01 ou M03, sem avarias, permite atingir 12.000 para o Estradeiro. A compra preserva o Aurora. A sessão do Estradeiro em M02 também foi concluída pelo teste.

Arquivo detalhado: `CARGA_PESADA_v0.4_REPLAYS.json`. O mesmo controlador percorre o frete M01 a 5, 30 e 144 FPS, com resultados equivalentes. Seu trajeto é programado e não mede dificuldade para um jogador iniciante.

## Verificação reproduzida
37 testes passaram. Além da campanha e dos subsistemas anteriores, há viagens completas com tráfego, vitória e derrota contra Coiote, colisão destrutiva no quadro final, prazo esgotado, carga insuficiente, tanque vazio, passagem por fora da entrega, ativação/expiração de boost e proteção contra duplicar o pagamento. Save recarregado entre missões.

No navegador: início de M01, HUD, pausa por interrupção, retomada, pausa manual e retorno à oficina sem pagamento. O modo compatível acionou proteção após uma interrupção longa deste ambiente.

## Limites e próxima etapa
WebGL indisponível no navegador de QA. Não há certificação de FPS em celulares, gamepad físico ou conclusão humana do prólogo pela interface. A renderização Canvas continua simples. Campanha permanece no prólogo de quatro missões. Próximas tarefas: playtest em GPU real, ajustes de dificuldade e desenvolvimento do Capítulo 1.
