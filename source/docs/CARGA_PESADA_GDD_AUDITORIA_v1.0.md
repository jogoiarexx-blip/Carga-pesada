# CARGA PESADA
## Auditoria de referência + Game Design Document (GDD) + Plano de produção

**Versão:** 1.0 — Documento-mestre inicial  
**Data:** 05/11/2026  
**Status:** projeto conceitual; nenhuma funcionalidade aqui é declarada como implementada  
**Plataforma-alvo:** navegador (Three.js / WebGL, GitHub Pages), com arquitetura preparada para versão de PC offline no futuro  
**Idioma principal:** português brasileiro  
**Referência de gênero:** *Bakusou Dekotora Densetsu: Art Truck Battle* (PS1, 1998)  
**Autoria de universo:** personagens, mundo, cidades, empresas, caminhões e roteiro originais

> **Resumo da visão:** começar com um caminhão antigo, aceitar fretes, disputar provas contra caminhoneiros rivais, restaurar a oficina da família, comprar outros veículos e construir uma frota respeitada. Misturar direção arcade acessível, caminhões com peso e comportamento próprios, customização visual exuberante, progressão econômica e histórias marcantes pelas estradas.

---

# PARTE I — AUDITORIA DO ART TRUCK BATTLE ORIGINAL

## 1. Escopo e confiabilidade

Esta é uma **auditoria documental e de design**, baseada em registros do título e em um guia extenso de época. **Não é uma auditoria de execução:** não foram fornecidos a imagem do jogo, gravações integrais, arquivos de estado ou capturas de playtest. Portanto, não se afirma que todas as fases foram jogadas, que bugs foram reproduzidos nem que dados de desempenho foram medidos. As observações sobre balanceamento e fraquezas são avaliações de projeto, não medições objetivas ou defeitos comprovados.

**Referências consultadas:**

1. GameFAQs, guia de Gonad, versão 0.5 (1999): https://gamefaqs.gamespot.com/ps/572650-bakusou-dekotora-densetsu-otoko-ippiki-yume-kaidoi/faqs/4432
2. Catálogo japonês PicoPico, lançamento e apresentação oficial: https://www.gavas.jp/products/detail.php?product_id=9218
3. PSX Data Center, ficha técnica e descrição: https://psxdatacenter.com/games/J/B/SCPS-45264.html

**Legenda:** `[V]` documentado nas referências; `[I]` inferência de design com fundamento; `[P]` proposta original para Carga Pesada; `[T]` exige verificação por playtest do jogo original.

## 2. Perfil do jogo de referência

- `[V]` Lançado no Japão em **25 de junho de 1998**, para PlayStation, pela **Human Entertainment**.
- `[V]` Fantasia central: dois caminhoneiros competem para entregar suas cargas primeiro, em estradas japonesas com tráfego e contato entre veículos.
- `[V]` Mecânicas de corrida arcade, prêmios, rivais, customização ornamental de caminhões e narrativa em modos próprios.
- `[V]` O modo de campeonato libera desafios e adversários; o contrarrelógio usa também caminhões desbloqueados.
- `[V]` O título inclui editor de pintura; troca de câmeras; buzina; opções de controles; salvamento no memory card; e competição entre dois jogadores.
- `[V]` O guia registra duas formas de direção associadas ao volante selecionado: assistência por faixa com indicação de mudança e direção manual mais livre.
- `[V]` O guia descreve um impulso de velocidade ao seguir de perto o caminhão adversário na mesma faixa, além de dano à carga que diminui o prêmio.
- `[V]` O guia de 1999 menciona cinco veículos iniciais, aproximadamente 21 categorias de customização mais a opção de sair, e oito rotas de contrarrelógio para determinado desbloqueio. Esses números vêm do guia, não de uma contagem própria completa.

## 3. Matriz de auditoria — o que manter e o que evoluir

As notas abaixo são **avaliações subjetivas de utilidade para inspiração**, numa escala 0–10. Não são benchmarks técnicos do executável de PS1.

| Subsistema | Referência PS1 (0–10) | O que funciona | Limitação/oportunidade | Decisão para Carga Pesada | Prioridade |
|---|---:|---|---|---|---|
| Identidade e fantasia | 9,0 | Caminhões extravagantes, rivalidade, personagens | Ambientação específica; precisamos de identidade própria | Cultura de caminhoneiros fictícia inspirada no Brasil | P0 |
| Corrida arcade | 8,0 | Ultrapassagem, tráfego, confrontos diretos | Risco de depender demais de colisões | Corridas especiais e contratos com condições claras | P0 |
| Sensação de direção | 7,5 | Assistência de faixa e modo livre | Transição entre modos e resposta precisam ser refinadas `[T]` | Dois perfis de controle opcionais; física ajustável | P0 |
| Progressão | 7,0 | Dinheiro e oponente desbloqueado a cada vitória | Evolução de desempenho pouco ligada à compra de peças | Compra, venda, oficina, motores e classes de carga | P0 |
| Personalização externa | 9,5 | Pinturas, luzes e acessórios variados | Arte e UI limitadas por hardware da época | Pintura por camadas, luzes com custo gráfico controlado | P1 |
| Pintura autoral | 8,0 | Editor integrado com ferramentas básicas | Controles e armazenamento limitados na descrição do guia | Editor simplificado com mouse/toque e presets | P2 |
| IA dos rivais | 7,5 | Disputa de posição e mudança estratégica de faixa | Balanceamento parece agressivo em relato de jogador `[T]` | Perfis distintos, telemetria e limites para rubber-band | P0 |
| Trânsito e cenários | 7,0 | Tráfego cria decisões rápidas | Repetição de pistas e objetos deve ser avaliada `[T]` | Biomas, postos, pontes, túneis e incidentes | P0 |
| Carga e risco | 8,0 | Dano afeta recompensa | Pouca variedade de atributos de carga documentada | Peso, fragilidade, prazo e compatibilidade do veículo | P0 |
| Narrativa | 7,0 | Histórias e rostos rivais | Fragmentação dos modos e localização japonesa | Campanha contínua com oficina e conflitos originais | P1 |
| Interface e acessibilidade | 5,5 | Funções centrais identificáveis | Menus de época; idioma e regras pouco claros para público brasileiro | UI PT-BR com tutorial, ícones, gamepad e mobile | P0 |
| Rejogabilidade | 7,5 | Contra o tempo, rivais e desbloqueios | Falta de variedade de objetivos de entrega em evidências consultadas | Contratos variáveis, medalhas e eventos de elite | P1 |

### 3.1 Acertos essenciais a preservar

1. O caminhão precisa ser a estrela visual, não apenas um carro grande.
2. Rivais devem ter nome, retrato, personalidade e caminhão reconhecível.
3. Dinheiro ganho na estrada precisa se transformar em mudanças visíveis.
4. As curvas, o tráfego e o tamanho do caminhão devem importar.
5. Cada etapa precisa ter começo, tensão, ultrapassagem ou escolha, chegada e recompensa.
6. Buzina, retrovisores, câmera traseira e som de motor são parte da identidade.
7. As pinturas e acessórios precisam ser mostrados em garagem 3D, de dia e de noite.

### 3.2 Lacunas a superar no projeto novo

- **Progressão de frota:** não ficar preso à escolha inicial; comprar novos caminhões deve mudar as possibilidades de trabalho.
- **Direção distinta por peso e classe:** caminhão pequeno ágil, caminhão pesado estável mas com freio e aceleração diferentes.
- **Economia legível:** contrato, pagamento, gasto, dano, manutenção e lucro líquido.
- **Missões diversas:** não repetir corrida pura em todas as entregas.
- **Continuidade narrativa:** o mundo responde a rivais vencidos, reputação e decisões.
- **Cargas variadas:** frágeis, pesadas, refrigeradas e especiais com equipamentos compatíveis.
- **Confiabilidade:** nada de missões impossíveis, adversários que teleportam, trânsito que surge sem aviso ou perda de progresso.
- **Mobile e PC:** condução agradável em teclado, gamepad e tela sensível ao toque, sem simplificar demais no PC.

### 3.3 O que falta validar sobre o original

Antes de alegar auditoria total do PS1 por execução, precisamos de: gameplay das rotas, vídeos dos três arcos de história, registros de upgrades, tabelas de tempo, comportamento de câmera, taxa de quadros e peculiaridades de áudio. **Não confundir itens não observados com bugs confirmados.**

---

# PARTE II — VISÃO DE CARGA PESADA

## 4. Pitch

**CARGA PESADA — Entre Fretes e Rivalidades** (subtítulo provisório) é um jogo 3D de carreira de caminhoneiro, com direção arcade de influência retrô, estradas brasileiras fictícias e personalização profunda de veículos. Começa com um caminhão velho e termina com uma frota construída por trabalho, talento e escolhas. Há dois eixos de atividade: **fretes legais e disputas esportivas organizadas** em circuitos controlados, cada qual com suas regras, riscos e recompensas.

**Pilares de design:**

1. **Cada caminhão conta uma história:** o veículo adquirido modifica a direção, o volume, os fretes e o status do jogador.
2. **Estrada como personagem:** lugares reconhecíveis, clima, tráfego, aclives e personagens recorrentes.
3. **Personalização que vale a pena:** pintura e acessórios únicos; desempenho real vindo de mecânica e acerto.
4. **Arcade com consequência:** fácil entrar, difícil dominar, mas sem simulação burocrática.
5. **Progressão honesta:** sem grind obrigatório, sem pay-to-win, sem compra com dinheiro real.
6. **Performance de PS1 refinado:** geometria estilizada, excelente silhueta e leitura visual; iluminação leve e efeitos moderados.

## 5. Público, plataforma e escopo

- **Modo inicial:** single-player; campanha, entregas, corridas, contrarrelógio e garagem.
- **Plataforma de estreia:** GitHub Pages, jogável offline após instalação PWA apenas se a evolução futura implementar cache adequado; não prometer offline antes disso.
- **Controles:** teclado, gamepad e toque; troca de comandos nas configurações.
- **Modo de câmera:** traseira de seguimento, próxima do caminhão, capô/cabine simplificada e retrovisor; permitir alternar.
- **Estilo gráfico:** low poly entre PS1 e PS2, resolução de texturas contida, UI moderna sem excesso.
- **Mapa:** regiões ligadas por seleção de rotas e rodovias contínuas por missão. Não prometer Brasil inteiro aberto e sem carregamento na primeira versão.
- **Sessão:** 3–8 minutos por corrida curta; 6–15 minutos por frete principal; sessões maiores apenas no fim do jogo.

## 6. Identidade e atmosfera

**Cenário:** República de **Santa Brava**, país fictício sul-americano de paisagens inspiradas no Brasil, com estados, cidades e rodovias inventadas. Caminhões e marcas também são originais, evitando reprodução de logotipos comerciais. O mundo mistura festivais de caminhões iluminados, postos de parada, serras perigosas, estradas de terra e centros industriais.

**Período:** começo dos anos 2000 fictício. Sem smartphones atuais; contatos chegam por rádio, orelhão, cartazes de carga e escritórios de transporte. A interface do jogador pode oferecer mapa e objetivos por conveniência sem simular celular moderno.

**Tom:** aventura de estrada, drama familiar, humor nos postos e rivalidades fortes; personagens humanos, sem caricaturar trabalhadores. Visual caloroso durante o dia, luzes de caminhões e cidades à noite. Música original com influências de moda de viola, rock de estrada e ritmos regionais; **não reutilizar músicas do jogo japonês ou de artistas sem licença**.

---

# PARTE III — LORE E CAMPANHA ORIGINAL

## 7. Premissa

Depois de anos longe de **Porto Salgueiro**, **Lia Duarte**, 27 anos, recebe a notícia de que a **Oficina Farol**, fundada por sua mãe **Teresa Duarte**, está prestes a ser leiloada. Teresa foi uma caminhoneira famosa por levar mantimentos até regiões isoladas durante uma grande enchente, mas morreu antes de esclarecer por que perdeu o maior contrato de sua vida.

Tudo o que resta é um caminhão de dois eixos chamado **Aurora**, parado debaixo de uma lona; um rádio antigo; e um livro-caixa com viagens que não batem com as contas. A transportadora **Rota Imperial**, chefiada por **Augusto Valença**, domina os fretes mais lucrativos e faz propostas abusivas a pequenos motoristas.

Lia decide voltar à estrada. Primeiro quer quitar dívidas; depois descobre documentos que apontam para um acordo oculto de desvio de cargas em uma obra rodoviária. Para restaurar a oficina, precisa vencer contratos, criar alianças, enfrentar rivais em provas legais e formar sua própria frota. O grande mistério não será resolvido com violência, mas reunindo manifestos, depoimentos e comprovantes dispersos ao longo das rotas.

**Tema:** ninguém constrói uma estrada sozinho; vencer é trazer a carga e as pessoas até o destino.

## 8. Personagens centrais

| Personagem | Papel | Arco narrativo | Caminhão/elemento |
|---|---|---|---|
| **Lia Duarte** | Protagonista personalizável na aparência | De herdeira endividada a dona de transportadora respeitada | **Aurora**, restaurável |
| **Seu Nilo** | Mecânico e amigo da família | Revela gradualmente o passado de Teresa | Oficina Farol |
| **Bia Campos** | Operadora de rádio e agenciadora de fretes | Confiança crescente; controla contatos e rastros documentais | Rádio **Frequência 17** |
| **Rafa “Coiote” Braga** | Rival impulsivo, mas leal | De provocador a aliado de comboio | Caminhão **Dente de Aço** |
| **Nara Venturini** | Especialista em serra e transportes sensíveis | Testa a disciplina da protagonista; ajuda no capítulo final | Caminhão **Serra Alta** |
| **Tomás “Farol” Rezende** | Lenda das estradas, ex-parceiro de Teresa | Guarda a última peça da investigação | Caminhão **Peregrino** |
| **Augusto Valença** | Antagonista; empresário da Rota Imperial | Tenta monopolizar os fretes e esconder contratos antigos | Frota **Imperial** |
| **Dante Valença** | Chefe das provas de elite | Rival técnico; muda de atitude conforme as escolhas | Caminhão **Imperial Zero** |

**Diretriz:** cenas curtas de 10–35 segundos, retratos 2D autorais, diálogo rápido e nenhum bloqueio prolongado de controle.

## 9. Estrutura em seis capítulos

| Capítulo | Local | Objetivo narrativo | Marco de progressão |
|---|---|---|---|
| **Prólogo — Motor Frio** | Porto Salgueiro | Reativar Aurora e salvar o primeiro contrato | Caminhão inicial e garagem básica |
| **1 — Poeira e Promessas** | Vale do Rio Grande | Ganhar confiança de pequenos comerciantes | Primeiro upgrade e veículo leve alternativo |
| **2 — Curvas da Verdade** | Serra da Neblina | Recuperar registros de carga que sumiram | Novas categorias e freios de montanha |
| **3 — Luzes na Noite** | Litoral das Marés | Entrar no festival regional de caminhões | Editor de pintura e eventos de estilo |
| **4 — O Peso do Nome** | Planalto da Ferrugem | Enfrentar o cartel dos contratos sem perder a oficina | Cavalo mecânico e frota com vários veículos |
| **5 — A Última Entrega** | Chapada Rubra e rota final | Comprovar a fraude e decidir o futuro da empresa | Conclusão e modo pós-jogo |

**Final:** o jogador apresenta a documentação reunida, a Rota Imperial enfrenta investigação, a Oficina Farol permanece aberta, e os rivais que ganharam confiança comparecem ao festival de caminhões em homenagem a Teresa. O encerramento não exige um único caminhão: a sequência mostra os veículos da frota adquirida ao longo da campanha.

**Pós-jogo:** contratos especiais, rematches de rivais, customização definitiva da frota e desafio de travessia nacional.

## 10. Missões de campanha — 30 missões definidas

| ID | Capítulo | Missão | Mecânica principal | Recompensa/desbloqueio |
|---|---|---|---|---|
| M01 | Prólogo | **A Aurora Desperta** | Aprender aceleração, curva, freio, ré e entrega | Libera Oficina Farol |
| M02 | Prólogo | **O Primeiro Frete** | Entrega de peças por percurso curto | Caixa inicial e contratos |
| M03 | Prólogo | **Não Arranhe a Pintura** | Preservar carga frágil | Oficina de funilaria |
| M04 | Prólogo | **Coiote na Pista** | Primeira prova autorizada contra rival | Rádio e ranking regional |
| M05 | Cap. 1 | **Sacos de Esperança** | Carga média, aclive e consumo | Contrato de cooperativa |
| M06 | Cap. 1 | **Ponte das Duas Margens** | Estreita passagem e peso permitido | Nova rota |
| M07 | Cap. 1 | **Mercado Antes da Alvorada** | Prazo curto e trânsito de madrugada | Bônus de reputação |
| M08 | Cap. 1 | **Troca de Cavalo** | Comprar/selecionar outro veículo de frota | Segundo modelo acessível |
| M09 | Cap. 1 | **Poeira contra Coiote** | Duelo em circuito fechado de terra | Rivalidade evolui |
| M10 | Cap. 2 | **Freio de Serra** | Descida longa e controle térmico simplificado | Upgrade de freios |
| M11 | Cap. 2 | **Carga que Não Pode Balançar** | Estabilidade e dano progressivo | Cliente especial |
| M12 | Cap. 2 | **A Curva do Silêncio** | Neblina, faróis e sinalização | Primeiro documento |
| M13 | Cap. 2 | **Sem Atalho** | Escolha de rota conforme classe/peso | Mapa avançado |
| M14 | Cap. 2 | **Nara da Neblina** | Duelo técnico sem contato | Rival Nara desbloqueada |
| M15 | Cap. 3 | **Luzes de Maré Alta** | Entrega noturna em pista costeira | Iluminação decorativa |
| M16 | Cap. 3 | **Cores da Estrada** | Oficina e competição de visual | Editor de pinturas |
| M17 | Cap. 3 | **Peixe Fresco** | Refrigerado, prazo e danos | Carroceria frigorífica |
| M18 | Cap. 3 | **Desvio pelo Farol** | Chuva e mudança de rota | Estação meteorológica |
| M19 | Cap. 3 | **Festival das Lanternas** | Prova noturna e julgamento visual | Troféu de personalização |
| M20 | Cap. 4 | **Peso de Ferro** | Carga pesada e torque | Categoria pesada |
| M21 | Cap. 4 | **Dois Caminhões, Um Contrato** | Troca de veículo entre serviços | Gerência de frota |
| M22 | Cap. 4 | **O Preço do Pedágio** | Rotas de custo/tempo diferentes | Descontos de contrato |
| M23 | Cap. 4 | **O Manifesto Rasgado** | Recuperar evidência em entrega secundária | Segundo documento |
| M24 | Cap. 4 | **Imperial na Reta** | Corrida de rival de elite | Acesso à Chapada |
| M25 | Cap. 5 | **Ventos da Chapada** | Rajadas laterais e carga alta | Suspensão reforçada |
| M26 | Cap. 5 | **Comboio Farol** | Escolta colaborativa com NPCs | Aliança de rivais |
| M27 | Cap. 5 | **O Último Recibo** | Escolha de frete arriscado porém legal | Prova documental final |
| M28 | Cap. 5 | **Sem Deixar Ninguém** | Entrega solidária sob tempestade | Reputação comunitária |
| M29 | Cap. 5 | **Rota Imperial** | Grande prova oficial contra Dante | Troféu da estrada |
| M30 | Cap. 5 | **O Nome de Teresa** | Entrega final, conclusão narrativa e festival | Créditos e pós-jogo |

**Importante:** corridas são realizadas em eventos autorizados/circuitos separados de fretes comuns; contratos de estrada valorizam integridade e segurança da carga. O sistema de acidentes é consequência de jogo, não incentivo a agredir trânsito civil.

---

# PARTE IV — SISTEMAS DE JOGO

## 11. Loop principal

**Selecionar frete/prova → escolher caminhão compatível → ajustar peças/carga → dirigir → entregar/chegar → conferir danos, tempo e custos → receber pagamento → reparar, personalizar ou comprar caminhão → desbloquear missão ou região.**

**Loop curto (3–5 min):** corrida ou entrega rápida.  
**Loop médio (15–30 min):** três contratos, retorno ao posto, upgrade significativo.  
**Loop longo (2–4 h):** concluir arco regional, adquirir novo caminhão e vencer rival de capítulo.

## 12. Modos de jogo

1. **Carreira:** campanha e contratos livres dentro das regiões desbloqueadas.
2. **Frete Livre:** gerar entregas variadas com peso, tipo de carga, prazo, recompensa e clima.
3. **Batalha de Estrada:** provas esportivas contra caminhões rivais, com regras de penalidade por contato.
4. **Contrarrelógio:** placar local de melhores tempos por rota, classe e dificuldade.
5. **Oficina e Exposição:** customização, fotografia e apresentação da frota à noite.
6. **Desafio de Comboio:** missão PvE com parceiro controlado por IA.
7. **Passeio Livre (pós-MVP):** dirigir por trechos desbloqueados sem contrato ativo.
8. **Multijogador:** **não incluído no escopo inicial**; estudar só após estabilidade da campanha.

## 13. Direção e sensação dos caminhões

**Objetivo de sensação:** veículos pesados devem ter inércia reconhecível, sem direção excessivamente simuladora. A cabine não deve parecer um carro de corrida; também não deve demorar segundos para responder ao comando.

### 13.1 Estados principais

- Velocidade longitudinal, velocidade lateral simplificada, ângulo de direção, marcha virtual, rotação do motor, massa total, frenagem e estabilidade.
- Aceleração por curva de torque aproximada; resistência dependente de velocidade, aclive e carga.
- Frenagem com desaceleração limitada por massa, pneus, superfície e temperatura virtual opcional na serra.
- Tombamento **evitável**: apenas em curvas violentas com velocidade incompatível, altura de carga e centro de massa altos; queda controlável e penalizada, sem ragdolls custosos.
- Colisão com guardrail, veículos, obstáculos de estrada, paredes e objetos grandes; colisões leves não devem travar o caminhão.
- Carga integrada ao peso total, não apenas textura na carroceria.

### 13.2 Dois modelos de condução

- **Clássico arcade:** eixo de direção normal, muita assistência de estabilidade, freio inteligente opcional e câmera próxima.
- **Troca de faixa assistida:** comando curto agenda mudança de faixa segura (pode cancelar); útil para controles de toque e acessibilidade. **Não exigir dois toques** para a manobra. Acessível em menu de configuração.
- Mesmo conteúdo e economia em ambos; não impor punição por usar assistência.

### 13.3 Boost de vácuo (inspirado no original, redesenhado)

- Só em **provas esportivas** e quando o jogador permanece a uma distância segura de jogo por tempo suficiente na trilha de ar do rival.
- Enche um medidor e concede aceleração curta; é um recurso arcade declarado, não um simulador físico de vácuo.
- Tempo de ativação, cooldown e magnitude são parâmetros de balanceamento, jamais vantagem infinita.
- Não deve ser aplicado a veículos comuns nem a entregas em vias abertas.

### 13.4 Danos e recuperação

- Três medidores independentes: **integridade do caminhão**, **integridade da carga** e **desgaste**.
- Batida leve causa risco cosmético e custo menor; choque forte causa perda de velocidade, avaria e dano à carga.
- Reaparecimento seguro após sair da pista; sem spawn dentro do trânsito.
- Missão com carga crítica só falha após limite explícito de integridade, prazo ou evento narrativo.
- Assistência opcional de resgate; custo exposto antes de aceitar.

## 14. Tráfego e IA

### 14.1 Trânsito cotidiano

- Classes: carros compactos, sedãs, ônibus, caminhões, vans, veículos rurais e motocicletas (quando adequadas à rota).
- IA usa spline/waypoints, respeita faixa, distância, velocidade de estrada, sinalização e obstáculos.
- Mudanças de faixa verificam espaços frontal/traseiro; ultrapassagens possuem intenção e duração, sem movimentos instantâneos.
- Emissões de buzina próximas podem provocar reação leve de atenção, **não fuga irrealista**.
- Ao carregar cena, impedir veículos aparecendo visualmente em cima do jogador.
- Caminhões de IA usam raios de curva e comprimentos maiores que carros.

### 14.2 IA rival: perfis

| Perfil | Estilo | Fraqueza | Leitura audiovisual |
|---|---|---|---|
| Coiote | Agressivo e rápido em retas | Erra freada em curva | Buzina dupla, caminhão vermelho |
| Nara | Técnica, poucas batidas | Menor aceleração inicial | Faróis altos, pintura azul |
| Dante | Inteligente e constante | Vulnerável a erros de escolha de rota | Cabine escura, luzes douradas |
| Novato local | Conservador | Excesso de frenagem | Caminhão quase original |
| Veterano | Defesa de posição | Pouca velocidade final | Pintura de estrada antiga |

**Regras de justiça:** nunca teletransportar rivais; nunca criar aceleração ilimitada para alcançarem o jogador; limites de velocidade por classe; colisões avaliadas por ambos os lados; todas as derrotas devem ser explicáveis pela telemetria. Rubber-banding, se houver, será sutil, documentado e desligável em dificuldade avançada.

## 15. Cargas, contratos e economia

### 15.1 Tipos de carga

| Tipo | Requisito | Risco especial |
|---|---|---|
| Secos gerais | Baú/carroceria geral | Danos por colisão |
| Alimentos frágeis | Proteção de carga | Queda de qualidade ao trepidar |
| Madeira | Carroceria adequada e amarração | Massa e frenagem |
| Maquinário | Plataforma/prancha e limite de peso | Altura e largura de rota |
| Refrigerados | Baú frigorífico | Prazo e condição térmica simplificada |
| Volumosos leves | Baú de capacidade adequada | Restrições de altura |
| Ajuda humanitária | Veículo compatível | Prazo da campanha e reputação |

**Segurança:** mercadorias perigosas reais ficam fora do primeiro lançamento. Nunca ensinar a transportar cargas ilegais.

### 15.2 Payout, custos e reputação

Moeda fictícia de interface **CR$ (Créditos de Rota)**, para evitar vincular economia a preços reais. Tabela de preços é exclusivamente **balanceamento de jogo**.

`receita_bruta = contrato_base × multiplicador_prazo × multiplicador_dificuldade`

`receita_final = receita_bruta × qualidade_entrega + bonus_opcionais`

`lucro_liquido = receita_final − combustível − pedágio − reparos − resgate`

- **Qualidade de entrega:** 0,40–1,00; abaixo do limiar de missão crítica, aplica-se reprovação explicitada antes da saída.
- **Prazo:** multiplica a premiação do contrato; não deve converter corrida de frete em direção imprudente necessária para vencer.
- **Reputação:** 0–100 por região; desbloqueia transportadoras clientes e eventos, não dá poder mecânico mágico.
- **Combustível:** gerenciado por consumo simplificado; o primeiro tutorial sempre entrega reserva suficiente.
- **Pedágios:** indicados na escolha de rota; estradas alternativas podem demandar mais tempo ou ser piores.
- **Falha:** não apaga veículo nem progresso da campanha; oferece recomeço ou frete menor para recuperação financeira.

**Parâmetros iniciais de economia (a ajustar com playtests):** primeiro frete paga ~1.500 CR$ brutos, melhor frete inicial ~2.500, pintura simples ~300–700, pneus de nível 1 ~2.000, freios de nível 1 ~2.500 e primeiro caminhão alternativo ~12.000. O jogador deve comprar ao menos um upgrade relevante após cerca de **3–4 serviços**, sem precisar repetir a mesma missão obrigatoriamente.

## 16. Frota e troca real de caminhões

**Não existe 'troca de skin' disfarçada de veículo novo.** Cada modelo deve ter geometria, número de eixos, distância entre eixos, massa, limites de carga, raio de curva, aceleração e freio próprios.

### 16.1 Catálogo inicial — marcas e modelos fictícios

| ID | Modelo | Classe | Carga útil-alvo (jogo) | Comportamento | Preço-base CR$ | Desbloqueio |
|---|---|---|---:|---|---:|---|
| T01 | **Aurora 90** | leve, 2 eixos | 3 t | Ágil, pouco torque, freio simples | Inicial | M01 |
| T02 | **Estradeiro 120** | leve-médio, 2 eixos | 5 t | Econômico, confortável | 12.000 | M08 |
| T03 | **Rochedo 160** | médio, 3 eixos | 9 t | Forte em terra, direção lenta | 24.000 | M09 |
| T04 | **Falcão 180** | médio, 3 eixos | 11 t | Rápido e menos estável em curva | 34.000 | M14 |
| T05 | **Maré 210** | pesado, 3 eixos | 15 t | Robusto, bom em litoral | 50.000 | M19 |
| T06 | **Titã 260** | pesado, 4 eixos | 20 t | Muito torque, freada longa | 72.000 | M20 |
| T07 | **Imperador 300** | cavalo mecânico + semirreboque | 24 t por combinação homologada no universo | Alta capacidade, articulação difícil | 110.000 | M24 |
| T08 | **Peregrino 350** | cavalo mecânico de elite | 27 t por combinação | Melhor conjunto de elite, caro | 160.000 | M29 |

*Os pesos são atributos balanceados para o universo fictício, não fichas técnicas/homologações reais. Cavalo mecânico só transporta carga útil quando há semirreboque compatível.*

### 16.2 Regras de frota

1. Na garagem, selecionar qualquer veículo **adquirido** e em condição de uso.
2. Seleção de frete filtra os caminhões compatíveis por carga útil, carroceria, categoria, altura e rota.
3. Upgrade fica no caminhão onde foi instalado; somente acessórios explicitamente compatíveis podem ser removidos e reaproveitados mediante taxa pequena.
4. Pinturas, adesivos e placas personalizadas são salvos por veículo, não compartilhados à força.
5. Compra de novo veículo não apaga os anteriores; limite inicial de **8 vagas de garagem**, expansível após concluir campanha.
6. Venda mostra preço e perda de investimento antes de confirmar; caminhão de história **Aurora** não pode ser vendido (pode ficar guardado).
7. Modelo anterior continua útil em fretes baratos e estreitos, pois pesado não é sempre melhor.
8. Alternar caminhão é instantâneo na garagem; na estrada é necessário retornar a posto/oficina ou encerrar o contrato, não trocar magicamente durante uma entrega.
9. Contratos não aparecem como disponíveis se não houver veículo elegível, exceto quando marcados como objetivo futuro com motivo claro.

## 17. Mecânica e upgrades

### 17.1 Grupos de peças

- **Motor:** torque, aceleração, consumo e aquecimento abstrato.
- **Câmbio:** número de marchas virtual, resposta em subida e velocidade de cruzeiro.
- **Freios:** distância de parada e resistência em descidas.
- **Pneus:** aderência em asfalto, chuva ou terra; escolha com trade-off.
- **Suspensão:** estabilidade e dano em irregularidades.
- **Chassi/eixos:** compatibilidade e carga útil conforme classe.
- **Aerodinâmica:** economia em velocidade; benefício modesto.
- **Carroceria/semirreboque:** tipo de frete; peso, altura e comprimento próprios.
- **Faróis funcionais:** visibilidade e conforto de direção noturna, com limite para evitar vantagem irrealista.
- **Decoração:** estética, reputação em festivais e identidade, **sem boost mecânico oculto**.

### 17.2 Regra de balanceamento

Todo upgrade precisa mostrar `antes → depois` de 2–4 atributos relevantes, além de preço e desvantagem quando houver. Não permitir estatística infinita. Evolução máxima por veículo precisa ser limitada para que comprar caminhão melhor continue fazendo sentido.

## 18. Customização visual — coração do jogo

**Itens:** pintura base, faixas, adesivos, painéis laterais, nome do caminhão, frisos de metal, para-choques, rodas, antenas, espelhos, defletores, caixas de ferramentas, saias laterais, luzes de contorno, lanternas traseiras, cabine interna simplificada, buzinas e padrões de luz.

**Editor:**

- Modelo gira com mouse/toque; opção de parar rotação; zoom e câmeras de frente/lado/traseira.
- Comparação dia/noite e visual antes/depois.
- Paleta cromática; 10 pinturas-base originais; 20 adesivos autorais para o primeiro lançamento completo.
- Editor por camadas com texto, geometria e decalque; exportar/importar **somente dados declarativos** do desenho (sem scripts).
- Cada slot tem máscara UV dedicada; não permitir que personalização esconda faróis obrigatórios ou placas de missão.
- Luzes emissivas com efeitos leves; no máximo alguns pontos luminosos reais por veículo, restante via emissive maps/halos em sprites.
- Presets de luz armazenados como configuração; velocidade de pisca limitada para conforto e opção de reduzir flashes.

**Direção de arte:** caminhões do jogo devem ser originais; podem evocar estilo dekotora em detalhes, mas sem copiar pinturas protegidas, marcas ou caminhões específicos do título de PS1.

## 19. Regiões, mapa e rotas

| Região | Bioma | Identidade | Obstáculo | Conteúdo-chave |
|---|---|---|---|---|
| **Porto Salgueiro** | Centro urbano e litoral de cargas | Porto, oficina, pátios, pontes | Trânsito e estreiteza | Tutorial e garagem |
| **Vale do Rio Grande** | Campos e zona rural | Silos, galpões e plantações | Terra e pequenas pontes | Fretes comunitários |
| **Serra da Neblina** | Mata montanhosa | Viadutos, túneis, curvas | Chuva, neblina e declives | Freio e controle |
| **Litoral das Marés** | Costa e cidades turísticas | Faróis, passarelas, mercado | Noite, chuva e vento | Festival e refrigerados |
| **Planalto da Ferrugem** | Zona industrial | Chaminés, usinas, ferrovia | Cargas longas e tráfego pesado | Compra de pesados |
| **Chapada Rubra** | Planalto árido | Cânions, postos isolados | Rajada lateral, longas retas | Endgame |

**Design das rotas:** cada pista principal deve ter 2–4 km de extensão jogável no MVP/protótipos; expandir conforme testes. Curvas e marcos visuais são criados por combinação de trechos autorais e variações procedurais controladas. Evitar loops de 'reta infinita' sem mudanças de jogabilidade.

**Estrutura de mundo:**

`Mapa de regiões → selecionar região/contrato → carregar rota → dirigir → posto/entrega → mapa/garagem`

Na versão avançada, concatenar segmentos de 2–4 km por streaming contínuo quando a abordagem estiver comprovadamente estável. Sem comprometer a qualidade para fingir mundo aberto.

### 19.1 Pontos funcionais

- Oficina Farol: upgrades, armazenamento e história.
- Postos Estrada Viva: abastecer, reparar, salvar e rever contratos.
- Pátios de carga: escolher frete e ver carga visualmente.
- Trechos de serviço: iniciar missões oficiais e desafios.
- Mirantes: pontos opcionais para fotografar caminhões.
- Festivais: competições de personalização e rivais.

## 20. Tempo, clima e perigos

- Dia/noite definidos pela missão inicialmente; ciclo dinâmico só depois de as cenas estarem bem iluminadas e testadas.
- Chuvas fraca/forte; piso molhado reduz aderência de forma previsível.
- Neblina por distância de visibilidade, sem introduzir veículos invisíveis tarde demais.
- Vento lateral na Chapada atua sobre caminhões altos e cargas específicas.
- Pedras ou galhos como obstáculos controlados por telemetria; evitar spawns injustos.
- Reduzir piscadas intensas e flashes repetidos; disponibilizar opção de acessibilidade.

## 21. Interface, fluxo de telas e controles

**Fluxo:** `Tela inicial → Continuar/Novo Jogo → Mapa/Oficina → Quadro de fretes → Escolha de caminhão → Loading curto → Missão → Resultado → Garagem/Mapa`.

**HUD obrigatório:** velocímetro; marcha virtual; minimapa de faixa/rota; distância restante; integridade da carga; integridade do caminhão; cronômetro somente quando relevante; objetivo curto; combustível quando aplicável. **Evitar texto permanente desnecessário.**

**Menus:** Começar, Continuar, Carreira, Fretes, Oficina, Frota, Personalização, Estatísticas, Configurações, Créditos. Pausar deve congelar progressão da missão sem perder foco ou habilitar controles sob overlays.

**PC padrão (remapeável):** W/S acelerar/frear-ré; A/D direção; Espaço freio de estacionamento; C câmera; H buzina; Q/E seta; R olhar para trás; Esc pausa; M mapa.

**Gamepad:** gatilhos para acelerar/frear, analógico esquerdo para dirigir, botões para câmera, buzina e pause; vibração configurável quando disponível.

**Mobile:** direção por botões grandes ou volante virtual, acelerador/freio separados, controle de câmera com gesto, botão de buzina e pause; orientação paisagem; nenhum texto minúsculo; áreas de toque confortáveis.

**Acessibilidade:** sensibilidade, inversão de câmera, zona morta do analógico, assistência de faixa, auxílio de freio, modo sem flashes, volume separado, escala da UI, legenda de diálogos e opção de reduzir vibração.

## 22. Save, progresso e integridade de dados

- Save automático após resultado de missão, compra/venda, conclusão de capítulo e mudança significativa de frota.
- Save local via IndexedDB com versão de esquema, transação atômica quando viável; alternativa localStorage apenas para pequena configuração.
- **Exportar e importar arquivo JSON** de progresso para transferir entre dispositivos; arquivo validado por esquema, tamanho e versão.
- Não escrever código executável, links externos ou HTML importado no jogo.
- Preservar último save válido, manter backup lógico ao migrar versão; bloquear gravação parcial se a aba fechar durante transação.
- Auto-reparo de referência de veículo ausente: selecionar Aurora sem apagar créditos/campanha; alertar em vez de travar.
- Dados persistentes: capítulo, missão, créditos, região, garagem, upgrades, pinturas, recordes, opções, indicadores narrativos e versão de save.
- GitHub Pages **não sincroniza saves entre celulares** automaticamente; sincronização online exigiria serviço adicional aprovado.

---

# PARTE V — ARQUITETURA THREE.JS E OTIMIZAÇÃO

## 23. Estrutura de projeto sugerida

```text
carga-pesada/
  index.html
  public/
    assets/
      trucks/
      trailers/
      scenery/
      portraits/
      audio/
      ui/
    manifest.webmanifest
  src/
    main.js
    app/GameApp.js
    core/GameLoop.js
    core/EventBus.js
    core/SaveManager.js
    scenes/MenuScene.js
    scenes/GarageScene.js
    scenes/RoadScene.js
    scenes/ResultScene.js
    vehicle/TruckController.js
    vehicle/VehicleDynamics.js
    vehicle/UpgradeResolver.js
    vehicle/TrailerSystem.js
    world/RoadBuilder.js
    world/RouteStreamer.js
    world/TrafficDirector.js
    world/WeatherSystem.js
    ai/TrafficAI.js
    ai/RivalAI.js
    missions/MissionDirector.js
    economy/EconomySystem.js
    ui/HUD.js
    ui/GarageUI.js
    input/InputRouter.js
    data/trucks.json
    data/missions.json
    data/regions.json
    data/upgrades.json
  tests/
    smoke/
    physics/
    economy/
    save/
    gameplay/
  docs/
    CARGA_PESADA_GDD.md
    QA_AUDITORIA.md
    CHANGELOG.md
```

**Padrão de código:** sistemas desacoplados via eventos e estado explícito; evitar um único `main.js` enorme. Dados de caminhões, contratos e upgrades em JSON validado por esquema. Não misturar UI, colisão, regras de economia e IA no mesmo módulo.

## 24. Pipeline 3D e visual retrô

- Caminhão principal próximo: `.glb` otimizado ou geometria procedural de qualidade uniforme.
- Caminhões e prédios distantes: LOD geométrico (substituto simplificado) e, quando apropriado, impostors/billboards `.webp`.
- **Regra crítica:** imagem distante deve manter **mesma proporção aparente, posição, direção e silhueta** do GLB/procedural antes da troca. Não gerar efeito de objeto encolher/crescer na aproximação.
- Usar hierarquia de referências, pivô e dimensões em metros-unidade de jogo para transições 1:1.
- Crossfade de curta duração com histerese nas distâncias de LOD para evitar popping constante.
- Rodas próximas animadas e com sombra simples; caminhão distante pode ser uma malha única.
- Vegetação com instancing; placas e postos autorais; texturas WebP, atlas para props repetidos.
- Sombras seletivas: caminhão do jogador e rival próximo; distância usa sombras falsas/sprites.
- Lanternas e neon principalmente por emissive; poucos pontos de luz reais; bloom somente como ajuste gráfico opcional.
- Evitar assets duplicados com URLs diferentes; cache de geometria/textura/material por ID e liberar referências em troca de região.
- Não carregar todos os capítulos, músicas e caminhões no boot.

## 25. Orçamento e metas de performance

Estas são **metas de engenharia para aferição**, não resultados medidos:

| Indicador | Meta desktop de referência | Meta celular intermediário | Como validar |
|---|---:|---:|---|
| FPS durante direção | 60 estáveis quando possível | 30 estáveis | P95/P99 de frame time em rota de stress |
| Tempo de resposta de direção | Sem atrasos perceptíveis | Sem atrasos perceptíveis | Input-to-visible-motion em test harness |
| Draw calls em corrida | Ideal abaixo de 250 | Ideal abaixo de 150 | Renderer.info + profiler |
| Assets iniciais | Carregar apenas menu e rota inicial | Ainda mais enxuto | Network/Performance |
| Memória/GC | Sem tendência de crescimento por 20 min | Sem tendência por 20 min | Heap snapshots e monitor de frames |
| Loading de troca de rota | Assíncrono, com feedback | Assíncrono, com feedback | Medir aparelhos de teste reais |
| Perda de progresso | 0 incidentes em 100 ciclos de salvamento simulados | Igual | Testes de importação/fechamento |

- Loop fixo de física recomendado com passo `1/60 s`, acumulador limitado e render independente.
- Quando a aba ficar oculta, pausar simulação e áudio; ao retornar, não acumular dezenas de segundos de delta.
- IA distante em frequência menor; colisão apenas para área ativa; object pooling para tráfego e obstáculos.
- Recursos de alta qualidade configuráveis; modo econômico escolhido por perfil do dispositivo.
- WebGL fallback e erros de contexto com tela clara de recuperação.
- Não usar `PCFSoftShadowMap` se a versão do Three.js escolhida não disponibilizar esse símbolo; escolher sombras suportadas pelo renderer atual e testar.

## 26. Modelo de dados mínimo

```json
{
  "truck": {
    "id": "T01",
    "model": "Aurora 90",
    "class": "light",
    "axles": 2,
    "baseMassKg": 3200,
    "payloadLimitKg": 3000,
    "handling": 0.82,
    "torque": 0.40,
    "braking": 0.55,
    "upgradeSlots": ["engine", "gearbox", "brakes", "tires", "suspension", "body"],
    "visualSlots": ["paint", "lights", "bumper", "wheels", "decals"]
  },
  "mission": {
    "id": "M02",
    "title": "O Primeiro Frete",
    "region": "porto-salgueiro",
    "routeId": "porto-armazem-01",
    "type": "delivery",
    "baseReward": 1500,
    "cargoType": "dry",
    "cargoMassKg": 1800,
    "minCargoIntegrity": 0.50,
    "allowedTruckClasses": ["light", "medium", "heavy"],
    "unlocks": ["contracts-board"]
  }
}
```

**Observação:** números servem de exemplo coerente para protótipo; não representam leis de trânsito nem homologações reais.

---

# PARTE VI — AUDITORIA DE RISCO E PLANO DE EXECUÇÃO

## 27. Backlog prioritário, do maior impacto ao menor

### P0 — Sem isso não existe jogo funcional

| ID | Trabalho | Critério de aceite |
|---|---|---|
| P0-01 | Boot GitHub Pages confiável | Menu aparece em URL de projeto, sem erro 404 de assets; paths relativos corretos |
| P0-02 | Cena de estrada completa | Início, meio, chegada e retorno à garagem sem travar |
| P0-03 | Dirigibilidade | A/D/W/S e gamepad funcionam corretamente; curva, freio, ré e colisão testados |
| P0-04 | Caminhão jogador visível | Modelo, rodas e orientação corretos; sem sumir após reiniciar missão |
| P0-05 | Trânsito e rival | Percorrem rota sem teleporte; mudam faixa com verificação de segurança |
| P0-06 | Entrega e resultado | Calcula tempo, integridade, receita e custo de modo consistente |
| P0-07 | Duas classes de veículo | Trocar veículo altera estatísticas, colisão, geometria e dirigibilidade |
| P0-08 | Garagem econômica | Comprar, guardar, selecionar, reparar e instalar 1 upgrade persistem |
| P0-09 | Save/Load | Fechar e reabrir preserva missão, créditos, veículo e upgrades |
| P0-10 | Pausa/retomada | Tempo e física congelam, áudio ajustado e foco de comandos preservado |
| P0-11 | Mobile funcional | Direção, frenagem, pause e menus utilizáveis sem teclado |
| P0-12 | Testes automatizados | CI cobre smoke, cálculo de economia, saves e estados de missão |

### P1 — Faz o jogo ter identidade

- P1-01: Oficina Farol com câmera 3D e 12 peças visuais.
- P1-02: Primeiro capítulo com 5 missões após o prólogo.
- P1-03: Retratos e sistema de diálogo com 3 rivais.
- P1-04: Chuva e noite com variação de aderência e luzes.
- P1-05: Seis caminhões funcionalmente distintos.
- P1-06: Missões de carga frágil, pesada e refrigerada.
- P1-07: Editor de pintura com presets e import/export.
- P1-08: Recursos de perfil gráfico, acessibilidade e controle customizado.

### P2 — Expansão e polimento

- P2-01: Todos os capítulos e 30 missões.
- P2-02: Oito caminhões e carrocerias especializadas.
- P2-03: Festival de luzes, exposições e fotos.
- P2-04: Comboios de IA, eventos pós-jogo e contrarrelógio.
- P2-05: Paisagens LOD avançadas e streaming prolongado.
- P2-06: Áudio autoral completo, dublagem seletiva e cenas finais.
- P2-07: Empacotamento para PC offline **quando solicitado**, separado de uma versão realmente nativa de motor gráfico.

## 28. Etapas de publicação sugeridas

| Revisão planejada | Conteúdo | Definição de pronto |
|---|---|---|
| **REV00 — Fundação** | Menu, save, garagem básica, Aurora, estrada de teste | Jogo inicia e dirige até a chegada |
| **REV01 — Primeira Entrega** | M01/M02, economia, dano à carga, resultado | Frete paga corretamente e salva |
| **REV02 — Rival** | Coiote, corrida, IA e trânsito | Completar disputa sem IA teleportar |
| **REV03 — Frota** | Estradeiro 120, compra, troca, upgrades | Caminhões diferentes em geometria/física |
| **REV04 — Oficina Farol** | Personalização, pinturas, luzes e câmera | Preview 3D preserva aparência em corrida |
| **REV05 — Região Viva** | Vale, tráfego otimizado, clima básico | 20 min de jogo sem crescimento anormal de memória |
| **REV06 — Campanha I** | Prólogo e capítulo 1 completos | M01–M09 terminam e progridem corretamente |
| **REV07 — Serra** | Física de declive, Nara, capítulo 2 | Sem missão impossível por equilíbrio |
| **REV08 — Festival** | Litoral, noite, editor, capítulo 3 | Customização persiste e desempenho aceitável |
| **REV09 — Pesados** | Planalto, cavalo mecânico, capítulo 4 | Veículos articulados compatíveis com rotas |
| **REV10 — Final** | Chapada, capítulo 5, final e pós-jogo | M01–M30 completáveis, save e créditos |
| **REV11 — Certificação** | QA, performance, bugs, acessibilidade | Todos os testes críticos verdes e playtests documentados |

**Regra:** cada revisão deve partir do projeto real existente, preservar o que funciona, aplicar correções nos arquivos, rodar testes e publicar apenas depois de verificar. Não marcar etapa como concluída sem evidência. GitHub Pages exige configuração correta do repositório e da publicação; criar o MD não significa que o jogo esteja publicado.

## 29. Vertical slice obrigatório

Construir primeiro uma experiência com **Aurora 90, Estradeiro 120, Porto Salgueiro, duas rotas, uma entrega frágil, uma disputa contra Coiote, garagem, 3 upgrades, compra/troca de veículo, save local e resultado de missão**.

**Teste de aceitação completo:**

1. Abrir a URL GitHub Pages sem precisar de servidor próprio ou console de depuração.
2. Começar novo jogo, dirigir Aurora sem comandos invertidos ou caminhão invisível.
3. Completar entrega sem bater e verificar qualidade 100% e saldo coerente.
4. Repetir com colisão e verificar redução de pagamento e custo de reparo.
5. Vencer Coiote sem exploit, travamento ou teleporte de IA.
6. Acumular créditos, comprar Estradeiro 120 e verificar diferença real de geometria, raio de curva, frenagem e capacidade.
7. Instalar upgrade, alterar pintura e executar segundo contrato.
8. Fechar a guia, recarregar e conferir veículo selecionado, upgrades, dinheiro e missão.
9. Jogar 20 minutos sem vazamento progressivo ou queda contínua de FPS.
10. Repetir fluxo em tela de toque e gamepad, sem dependências de mouse.

## 30. Plano de testes e QA

### 30.1 Unitários

- Economia: valores nunca NaN/negativos indevidos; recompensa no máximo e mínimo previstos.
- Upgrade: mudança de atributo é previsível e limitada.
- Frota: veículo não comprado não pode ser selecionado; Aurora preservado.
- Missão: máquina de estados `locked → available → active → success/fail → completed`.
- Save: migração, integridade, importação inválida, escrita interrompida, seleção de veículo órfã.

### 30.2 Integração

- Cena de garagem → missão → resultado → garagem.
- Troca de caminhão → carga compatível → rota compatível.
- Derrota → reinício → retorno à economia normal sem crédito duplicado.
- Troca de câmera → pause → resume → sem movimento acidental.
- Gerenciamento de áudio → mute/aba oculta → voltar sem tocar múltiplas fontes.

### 30.3 Playtest automatizado (onde viável)

- Navegador Chromium com scripts de direção por frames e checkpoints.
- Rotas com veículo parado, tráfego denso, chuva, caminhão grande e trailer.
- Capturas de cada tela-chave e resultado JSON por cenário.
- Telemetria: frame time, colisões, motivo de dano, distâncias de rival, consumo e créditos.
- Testar progressão M01 até último conteúdo disponível; comparar **executado** contra apenas **definido**.

### 30.4 Checklist manual de aceite

- [ ] Aceleração/frenagem naturais para a classe.
- [ ] Volante virtual, teclado e gamepad não estão invertidos.
- [ ] Pneus tocam o chão; não atravessam pontes/obstáculos.
- [ ] Caminhões não giram sozinhos nem mudam de escala por LOD.
- [ ] Carga permanece visualmente conectada à carroceria/semirreboque.
- [ ] Tráfego não gera colisões inevitáveis ao spawnar.
- [ ] Rival perde velocidade sob colisão e segue as mesmas regras de trajetória.
- [ ] Tempo da missão fica parado durante pause.
- [ ] A câmera acompanha o caminhão corretamente em curvas e marcha à ré.
- [ ] Luzes funcionam à noite sem destruir FPS.
- [ ] Compra, instalação, venda e troca não duplicam créditos.
- [ ] Save sobrevive a refresh, crash simulado e migração de versão.
- [ ] Missão pode ser reiniciada sem duplicar prêmios.
- [ ] UI e controles funcionam em Android e computador.
- [ ] Página publicada corresponde ao commit verificado.

## 31. Registro de riscos

| Risco | Gravidade | Mitigação |
|---|---|---|
| Escopo exagerado de mundo aberto | Crítica | Mapas segmentados até o jogo básico estar divertido |
| Direção parecer carro leve ou tijolo | Crítica | Teste comparativo entre dois caminhões e telemetria |
| Economia emperrar | Alta | Contratos de recuperação e simulação automática de 50 serviços |
| IA rival injusta | Alta | Velocidades limitadas, logs e testes determinísticos |
| Frota virar apenas skin | Crítica | Fichas de dinâmica individuais + teste de curva/frenagem |
| Tocar em cenário e carroceria visualmente desencaixada | Alta | Pivô e escala unificados, QA de LOD |
| Excesso de luzes e props reduzir FPS | Alta | Emissivos e instancing, budget por cenário |
| GitHub Pages mostrar versão velha / 404 | Alta | Build reprodutível, caminhos relativos, deploy CI com smoke HTTP |
| Save perder dados de revisão anterior | Crítica | Migração versionada, backup e teste de regressão |
| Semelhança com IP original | Alta | Marca, trilha, história, cenários, nomes e assets completamente originais |
| Conflito com o título 'Carga Pesada' | Alta | Verificar distintividade, marcas registradas e disponibilidade comercial antes de distribuição |

## 32. Considerações de originalidade e nome

**Não é port, ROM hack nem reprodução 1:1 do jogo de 1998.** A inspiração se limita a características gerais de gênero, como caminhões personalizados e provas de estrada. Não reproduzir texturas, músicas, personagens, logos, trechos de código, mapas ou diálogos do original sem licença.

O nome **Carga Pesada** também foi usado por uma conhecida série brasileira de televisão da TV Globo. Isso **não determina automaticamente** proibição para um jogo, mas exige verificação de marcas e do risco de confusão antes de distribuição pública/comercial, preferencialmente no banco do INPI com orientação jurídica. O GDD usa o nome escolhido pelo criador como **título de trabalho**, sem sugerir vínculo com o seriado.

Referência do seriado: https://memoriaglobo.globo.com/google/amp/entretenimento/series/carga-pesada/noticia/carga-pesada.ghtml

---

# PARTE VII — DECISÕES FIXADAS PARA AS PRÓXIMAS REVISÕES

## 33. O que NÃO faremos nas primeiras versões

- Não gerar um país inteiro de terreno infinito antes de a direção funcionar.
- Não incluir multiplayer online, servidor ou chat no MVP.
- Não usar marcas reais de caminhão, pinturas protegidas ou músicas sem autorização.
- Não transformar todo frete em corrida de colisões; alternar contratos e esportes.
- Não forçar GPU de celular a renderizar dezenas de luzes dinâmicas.
- Não permitir perda irreversível de progresso por erro do jogo.
- Não prometer gráficos “PS1” como desculpa para qualidade ruim, pop-in ou colisão quebrada.

## 34. Critérios de evolução contínua

Para cada revisão, registrar:

- **O que mudou no código**, com arquivos e commits (quando existirem).
- **Antes/depois real**, incluindo direção, câmera, IA, frota, missões, assets, FPS e saves.
- **Testes executados**, separados dos testes apenas planejados.
- **Pendências abertas**, severidade e próximo item de maior impacto.
- **Compatibilidade GitHub Pages** e nome do build publicado.

### 34.1 Ordem obrigatória após receber código do jogo

1. Inspecionar repositório/ZIP e identificar o que já existe.
2. Auditar execução, dependências, bugs reais e desempenho.
3. Corrigir primeiro P0 que bloqueiam controle e ciclo de jogo.
4. Desenvolver a menor funcionalidade vertical completa.
5. Testar no navegador automatizado e manualmente quando possível.
6. Publicar, caso haja autorização/acesso de gravação ao repositório e verificações aprovadas.
7. Atualizar GDD, auditoria e changelog com evidências.

## 35. Definição do sucesso

O projeto estará no caminho certo **quando o usuário começar com Aurora 90, ganhar dinheiro, comprar um segundo caminhão realmente diferente, escolher o veículo certo para um frete, vencer Coiote, personalizar o caminhão e fechar/abrir a página sem perder nada**.

O projeto só estará completo como campanha quando todas as 30 missões estiverem implementadas, acessíveis, concluíveis, testadas e conectadas à narrativa do início aos créditos.

---

## Fontes e nota de rastreabilidade

- [Guia de época do Art Truck Battle, GameFAQs (1999)](https://gamefaqs.gamespot.com/ps/572650-bakusou-dekotora-densetsu-otoko-ippiki-yume-kaidoi/faqs/4432)
- [Catálogo japonês do jogo (1998)](https://www.gavas.jp/products/detail.php?product_id=9218)
- [Ficha do PS1, PSX Data Center](https://psxdatacenter.com/games/J/B/SCPS-45264.html)
- [Memória Globo: seriado Carga Pesada](https://memoriaglobo.globo.com/google/amp/entretenimento/series/carga-pesada/noticia/carga-pesada.ghtml)

**Fim do documento — GDD v1.0.**


## Implementação v0.9 — estado real

A narrativa M01–M30 tem sequência jogável, dia/noite, final e pós-jogo. As mecânicas específicas de cada linha da visão original ainda não estão todas implementadas. Consulte `CARGA_PESADA_v0.9_CAMPANHA_COMPLETA.md` para roteiro, horários, testes e limites.


## Implementação v0.11 — atualização de regras
A progressão exige evolução mecânica e maior capacidade; os horários são fixos, os duelos têm conversa e perfis próprios e os fretes têm bônus de prazo condicionado à qualidade. HUD com ponteiro/minimapa e música original procedural. Esta seção substitui a opção de caminhão inicial para toda a campanha descrita nas revisões anteriores. Tabela completa e validação em `CARGA_PESADA_v0.11_PROGRESSAO_HUD_MUSICA.md`.

## Estado implementado — v0.12

As quatro regiões atuais receberam 16 marcos de cenário, com terrenos reservados e construções agrupadas. Faróis automáticos acompanham as dimensões de cada caminhão. Aviso de frenagem considera carga e freios. Corrigidos horizonte Canvas e sobreposição de rádio/minimapa. Não equivale ao relevo físico, às seis regiões ou aos postos interativos previstos acima. Evidências, 83 testes e limitações em `CARGA_PESADA_v0.12_CENARIOS_FAROIS.md`.

## Estado implementado — v0.13

Corrigidas transição da exposição para a largada, sincronização da apresentação/câmera e sobreposição de faces traseiras no modo Canvas. Acrescentados acabamentos de portas, lanternas e faróis respeitando as medidas dos modelos. 88 testes aprovados; relatório e limites em `CARGA_PESADA_v0.13_LARGADA_TRASEIRA.md`.

## Estado implementado — v0.14

Migração para Vite/JavaScript com fonte em `src/`, recursos em `public/`, build relativo para GitHub Pages e workflow de publicação. Acrescentados backup da carreira/pinturas e medalhas/recordes dos fretes. 93 testes. Consulte `CARGA_PESADA_v0.14_VITE_PAGES.md` e `../PUBLICAR_GITHUB_PAGES.md`.
