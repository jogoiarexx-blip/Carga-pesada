# Carga Pesada v0.12 — cenários regionais e faróis

## Implementado

Quatro marcos autorais por região, em metros e fora do corredor de pista/acostamento:

| Região | Construções |
|---|---|
| Ipês | Duas vilas, Posto Farol e cooperativa com silos |
| Porto | Dois pátios de contêineres, posto do cais e guindaste do terminal |
| Vale | Silos, parada Rio Grande, vila da cerâmica e cooperativa |
| Circuito | Três arquibancadas com público estilizado e apoio Farol |

Construções têm fachadas e elementos próprios: janelas, coberturas, bombas, colunas, tanques, cabos, bandeiras e assentos. Geometrias estáticas são agrupadas por material em cada marco, preservando o descarte por distância. Menos de 55 meshes adicionais por região, verificado por teste. Vegetação é afastada dos terrenos reservados. Não são interiores acessíveis, postos de serviço interativos ou obstáculos físicos.

Dois faróis automáticos seguem o nariz e a direção do caminhão, calculados pelo comprimento de cada configuração. Acendem apenas nas fases noturnas, inclusive na pausa/resultado, e apagam ao sair para os menus. Não há botão para mudar o horário. WebGL usa dois SpotLights com alcance de 80 m e sem mapas de sombra; Canvas aplica uma aproximação do cone sobre a pista e faces próximas. Os faróis não concedem desempenho, nem substituem as luzes decorativas compráveis. O material emissivo das janelas/luminárias aparece em WebGL; o renderer Canvas ainda não reproduz emissivos fisicamente.

## Direção e interface

A indicação de curva passa a olhar 200 m adiante. Mostra lado, distância e velocidade sugerida. O aviso FREIE AGORA usa a distância necessária para reduzir, a carga do contrato, os freios do modelo e a melhoria instalada, mais uma margem de reação. Também aparece nos duelos, sem esconder a posição do rival. É assistência informativa: não dirige nem freia pelo jogador, e não muda a física ou os pagamentos.

O rádio foi movido para a parte inferior central para não se sobrepor ao minimapa. No renderer compatível, o horizonte do chão agora é projetado conforme a câmera, corrigindo faixas de céu entre a estrada e o terreno.

## Verificação reproduzida

83 testes passaram, incluindo os 79 anteriores e quatro novos conjuntos: construções finitas e fora do acostamento em todas as regiões; alcance/direção/desligamento dos faróis; montagem em todos os seis caminhões e carrocerias compatíveis; aviso antecipado com freio mais fraco e ausência de alerta na ré. O replay econômico M01–M30 continua chegando ao final com compras, melhorias e salvamento.

No navegador foi dirigido M01 de dia pela página normal, com vila visível e instrumentos funcionando. M02 foi dirigido à noite em uma página temporária com save isolado e M01 previamente concluído. Foram observados pátio de contêineres, iluminação à frente, horário noturno e rádio reposicionado. Nenhum erro da aplicação foi registrado no console filtrado pela URL local. A página e o script temporários foram removidos antes do empacotamento.

Capturas: `evidencias/cenario-dia-v12.png` e `evidencias/farois-noite-v12.png`.

O navegador disponível utilizou Canvas por ausência de WebGL. Aparência dos SpotLights em GPU, desempenho sustentado, celular e campanha inteira jogada manualmente não estão certificados. A iluminação em Canvas continua aproximada e pode mostrar divisões entre trechos. Continuam pendentes relevo físico, pontes/túneis dirigíveis, chuva/vento e as duas regiões adicionais do GDD.
