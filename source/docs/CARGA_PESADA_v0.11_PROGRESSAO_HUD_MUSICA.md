# Carga Pesada v0.11 — evolução mecânica, duelos e instrumentos

Esta revisão aplica os pontos do GDD sobre progresso da frota, rivais sem teletransporte, narrativa antes das provas, qualidade/prazo e identidade audiovisual. Mantém seis caminhões originais, 30 missões, 48 acessórios e o save versão 1.

## Preparação obrigatória

| Missões | Capacidade mínima | Motor | Freios | Velocidade teórica preparada |
|---|---:|---:|---:|---:|
| M01–M03 | 3 t | N0 | N0 | sem mínimo adicional |
| M04 | 3 t | N1 | N0 | sem mínimo adicional |
| M05–M08 | 3 t | N1 | N1 | sem mínimo adicional |
| M09–M13 | 5 t | N1 | N1 | sem mínimo adicional |
| M14 | 5 t | N2 | N2 | sem mínimo adicional |
| M15–M18 | 12 t | N1 | N1 | sem mínimo adicional |
| M19 | 12 t | N2 | N2 | sem mínimo adicional |
| M20–M23 | 18 t | N1 | N2 | sem mínimo adicional |
| M24–M30 | 18 t | N2 | N2 | 130 km/h |

A velocidade preparada é a máxima-base do veículo mais 12 km/h por nível de motor, sem contar vácuo. No catálogo atual, o Falcão Aero com motor N2 atende ao patamar final. Esse requisito aparece nos contratos mesmo bloqueados para permitir planejar compras. Capacidade depende do modelo; acessórios decorativos não concedem desempenho.

O contrato mostra o motivo do bloqueio e um atalho para a oficina. O núcleo de sessão também recusa entrada incompatível. A história desbloqueia a missão seguinte, mas a autorização de largada exige caminhão preparado. Fretes antigos permanecem repetíveis para recuperar créditos. Não há perda de progresso nem destruição permanente do caminhão por falta de dinheiro.

Nos fretes posteriores ao prólogo, cargas crescem para 2,5 / 4,5 / 9 / 14 / 16 t por capítulo, e prazos passam a depender da extensão. Não foram adicionadas simulação térmica de freio, aderência molhada ou troca de marchas física.

## Duelos

| Prova | Rival | Limite da IA |
|---|---|---:|
| M04 | Coiote | 96 km/h |
| M09 | Coiote | 104 km/h |
| M14 | Nara | 110 km/h |
| M19 | Coiote | 112 km/h |
| M24 | Dante | 116 km/h |
| M29 | Dante | 120 km/h |

Aceleração e limite em curva próprios por perfil. A IA usa velocidade e distância físicas da sessão, sem teletransporte ou aceleração infinita. Colisões levam em conta o comprimento do modelo rival. Coiote usa Estradeiro, Nara usa Rochedo, Dante usa Falcão, com cores, decoração e rodas/articulação animadas.

Antes da largada há quatro falas entre o rival, Lia e Bia. É possível continuar, voltar ao contrato ou pular a conversa. O relógio e a música da corrida começam na largada. As falas são texto, sem dublagem ou retratos faciais; a identificação visual é tipográfica.

## Bônus de frete

Até 20% do pagamento-base, proporcional à antecedência. Valor integral quando sobra pelo menos metade do prazo; redução linear até zero no prazo final. Exige carga de pelo menos 90% e perda de integridade do caminhão de no máximo 5 pontos. Não é pago em derrota, atraso ou duelo. O resultado discrimina bônus de prazo/qualidade, bônus de primeira conclusão e despesas; a resolução da sessão permanece idempotente. Repetições pagam o bônus de prazo normalmente, sem repetir o bônus de estreia.

## Instrumentos e horário

Velocímetro de 0–160 km/h com escala, ponteiro e leitura digital ligada à velocidade da simulação, inclusive na ré em módulo. Não é um velocímetro de veículo real ou um sistema de câmbio físico. Minimap retangular mostra os próximos 650 m, curva da rota, jogador amarelo, tráfego claro, rival vermelho e chegada verde quando no alcance.

Todos os botões de alternar dia/noite foram removidos: menu, garagem e estrada. O horário é aplicado a partir do contrato na partida. O minimapa informa DIA ou NOITE. A oficina mantém a iluminação do estado de apresentação, sem permitir alterar o horário de uma missão.

## Música original

Três temas sintetizados por Web Audio, sem downloads ou músicas de terceiros:

- Horizonte de Santa Brava — estrada, 86 BPM;
- Frequência Vermelha — duelo, 116 BPM;
- Luzes da Oficina — menus após a primeira partida, 72 BPM.

Melodia, baixo e percussão procedurais. Volume na pausa, com zero para silenciar, salvo no navegador. Pausar/fica oculto interrompe o sequenciador; retomar volta a tocar. O motor e a buzina existentes continuam separados. A trilha é sintetizada em tempo real; não há gravação externa ou voz cantada.

## Validação

79 testes passaram. Incluem entrada negada ao Aurora original em M04, evolução por capacidade/freios/velocidade, perfis de rival, bônus e condições de qualidade, pagamento único, instrumentos, conversas e agendamento/volume/pausa de áudio. O replay M01–M30 comprou e melhorou veículos com créditos reais do jogo, recarregou saves e chegou ao final. Uma política de compra de menor preço escolheu Aurora, Estradeiro, Rochedo, Peregrino e Falcão, repetiu 14 fretes para financiamento e encerrou com saldo positivo. Esse número não é uma obrigação fixa: comprar o Falcão antes, por exemplo, pode evitar compras intermediárias.

Navegador Canvas: em sessão isolada com progresso preparado, M04 bloqueou o motor N0; compra de motor N1 descontou 2.000 CR$ e liberou a conversa; quatro falas, largada, minimapa e ponteiro foram observados em movimento. M02 entrou à noite, sem botão de troca de horário. A pausa identificou o tema correto e aceitou volume zero. Não houve erros de áudio na inspeção do console. Também foi iniciado M01 pela página normal, com o painel novo. As páginas temporárias de teste e os saves isolados não fazem parte da publicação.

Capturas: `docs/evidencias/hud-v11.png`, `hud-noite-v11.png` e `conversa-v11.png`. A captura da conversa antecede o ajuste final de espaçamento dos botões.

Não foi jogada manualmente a campanha inteira. Aparência em WebGL, FPS sustentado, áudio em dispositivos físicos e controles de celular continuam sem certificação. O renderer Canvas mantém profundidade aproximada. Requisitos atuais usam os seis modelos já implementados; o catálogo de oito modelos e os sistemas especiais do GDD continuam como visão futura.

Correção adicional: o botão de voltar à oficina no resultado agora chama a navegação sem passar o evento do clique como destino. A assinatura anterior podia esconder as páginas quando o contrato começava em `#inicio`.
