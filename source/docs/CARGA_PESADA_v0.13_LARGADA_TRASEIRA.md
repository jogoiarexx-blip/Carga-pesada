# Carga Pesada v0.13 — largada e acabamento dos caminhões

## Correções

- Na partida, modelo e câmera recebem diretamente a posição da sessão. O caminhão não passa mais do ponto de exposição (22 m) para o início (0 m) no primeiro update. A câmera começa na posição de acompanhamento calculada para o comprimento do conjunto, em vez de convergir de uma posição genérica.
- A apresentação interpola os dois últimos passos fixos da simulação, inclusive direção e articulação. O estado físico, colisões, progressão e pagamentos permanecem no runtime fixo. A interpolação acrescenta até um passo de apresentação (16,7 ms).
- A suavização da câmera usa até 250 ms do tempo transcorrido; o teto anterior de 50 ms fazia a câmera ficar atrasada quando a simulação avançava mais em um quadro lento.
- O Canvas usa um limite temporal de desenho de aproximadamente 30 Hz, em vez de ignorar todo segundo quadro, o que antes reduzia uma máquina que atualizasse a 30 Hz a cerca de 15 desenhos/s. Isso não é uma certificação de FPS sustentado.
- Corrigida a ordenação das faces traseiras no Canvas: a parede do baú, portas, arte e travas são comparadas em um raio de referência comum. Profundidade pelo centro de cada triângulo fazia manchas triangulares de uma superfície cobrir outra durante mudanças de câmera. O semirreboque usa seu próprio pivô articulado como referência.
- A pintura traseira fica fisicamente acima da folha da porta e abaixo das ferragens. Seu viés de profundidade Canvas caiu de 0,85 m para 0,015 m; WebGL ganhou também polygonOffsetUnits. Removida a disputa visual exagerada entre arte e ferragens.

## Aparência

Portas traseiras rebaixadas com tom próprio, dobradiças e suportes; lanternas em molduras escuras, com lentes vermelha/âmbar/clara separadas; molduras e lentes adicionais nos faróis; acabamento sobre os para-lamas. Os detalhes são gerados pelas medidas da carroceria e pelos eixos de cada configuração. A lona mantém construção própria. A rotação das rodas agora usa o raio cadastrado de cada roda, em vez de um valor único de 0,64 m.

É uma melhoria incremental dos seis modelos procedurais, não uma substituição por novos modelos GLB. As 48 peças e a personalização existentes continuam disponíveis.

## Verificação

88 testes aprovados. Cinco novos testes cobrem interpolação sem alterar a física, câmera inicial para todos os modelos/carrosserias, largadas monotônicas a 20/30/60/120 Hz, geometria de portas/lanternas e rotação proporcional das rodas, além da ordem física parede → pintura → travas independente dos centros dos triângulos. A campanha econômica M01–M30 e os testes de montagem das peças continuam aprovados.

No navegador Canvas foi iniciado M01 normal, com aceleração desde a largada e traseira sem pintura. Em páginas de teste isoladas, M04 foi iniciado com Aurora N1 e pintura Serra, e depois com Peregrino/semirreboque baú, também pintado. As manchas de parede sobre as portas foram reproduzidas durante a inspeção e deixaram de aparecer nas vistas posteriores à correção. Conferidos instrumentos, conversa antes do duelo, movimento inicial e montagem do conjunto; console da aplicação sem erros. Conferida a prévia do Peregrino na loja. Saves de teste eram separados; as páginas e scripts de QA foram removidos da publicação.

Evidências: `evidencias/traseira-v13.png`, `duelo-traseira-v13.png`, `articulado-v13.png`.

Limites: navegador disponível sem WebGL. A estabilidade em GPU e dispositivos móveis precisa ser validada nesses dispositivos. O Canvas continua sendo um pintor aproximado, com possíveis artefatos em superfícies laterais, rodas e encontros de geometrias; esta revisão corrige especificamente a ordenação das superfícies traseiras observada no teste, não implementa um z-buffer completo. Não foi feita uma nova campanha inteira manualmente.
