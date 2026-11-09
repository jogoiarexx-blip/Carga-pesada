# Carga Pesada v0.2 — revisão de direção e percursos

## Antes → depois

| Área | v0.1 | v0.2 |
|---|---|---|
| Contratos | Mesma estrada com comprimentos distintos | Três traçados, paletas, distribuição de árvores e placas próprios |
| Direção | Deslocamento lateral imediato relativo à estrada | Volante gradual, retorno, resposta pela velocidade e chassi, comportamento de ré |
| Peso e freio | Peso alterava só aceleração | Carga amplia a distância de parada e afeta a estabilidade |
| Colisão | Teste apenas na posição final | Varredura do movimento relativo nos dois eixos |
| Trânsito | Velocidade fixa por carro | Limite em curva e seguimento de veículo mais lento na faixa |
| Chegada | Distância final e ordem de atualização | Fração de cruzamento da linha, com verificação da posição lateral |
| Aviso de curva | Nenhum | Curvatura adiante e velocidade sugerida no HUD |
| Memória de cenário | Apenas cenário inicial | Reconstrução e liberação de geometria, materiais e texturas ao mudar de rota |

## Evidências
19 testes Node passaram. Início de fretes, pausa, retorno à oficina e visual do Vale verificados por navegador em renderização compatível. Dois percursos completos foram simulados por um controlador conservador, sem tráfego. Os resultados não equivalem a uma certificação de playtest completo pela interface.

## Continuidade
Save v1 permanece compatível: dinheiro, frota, peças e pintura são preservados. Rotas novas não invalidam o save. Melhores tempos antigos continuam gravados, mas não são comparáveis como benchmarks às pistas alteradas.

## Limites
Modelo arcade em coordenadas de estrada, sem tombamento físico ou pneu simulado. Vegetação e construções ainda simples. Trânsito não ultrapassa. WebGL, gamepad físico, FPS no celular, equilíbrio com Coiote e conclusão pela interface precisam de playtest. Campanha completa não implementada.
