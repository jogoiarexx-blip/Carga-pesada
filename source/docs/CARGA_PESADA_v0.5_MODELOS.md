# Carga Pesada v0.5 — Caminhões e carrocerias de referência

## Correspondência das referências

| Referência enviada | Implementação original no jogo |
|---|---|
| Americano azul com capô longo e escapamento alto (`istockphoto-1530773359-1024x1024.jpg`) | Peregrino Clássico: capô reto, dormitório, escapamentos cromados, três eixos no cavalo |
| Americano branco aerodinâmico (`ca 2.jpg`) | Falcão Aero: capô inclinado, cabine alta com teto aerodinâmico, três eixos no cavalo |
| Cabine frontal branca (`ca 1.jpg`) | Imperador Frontal: cabine sobre o motor, grade ampla, dois eixos no cavalo |
| Caminhão compacto com baú (`carga 3.jpg`) | Aurora 90 com baú curto e dois eixos |
| Baú rígido longo (`carga 2.webp`) | Rochedo 160 com baú longo e quatro eixos; Estradeiro usa variante menor |
| Semirreboque baú de três eixos (`carga 1.webp`) | Carreta baú compatível com os três cavalos mecânicos |
| Semirreboque de laterais e lona laranja (`lona.webp`) | Carreta com lona, laterais, montantes, amarrações e três eixos |

As imagens serviram de referência visual. O jogo utiliza malhas originais em Three.js, sem inserir essas fotos na pista. Os nomes, cores e proporções são estilizados para o universo de Santa Brava.

## Frota e acesso

| Modelo | Eixos no cavalo/chassi | Eixos com carreta | Comprimento de jogo | Preço CR$ | Requisito |
|---|---:|---:|---:|---:|---|
| Aurora 90 | 2 | — | 7,3 m | Inicial | Disponível |
| Estradeiro 120 | 2 | — | 8,8 m | 12.000 | 3 entregas |
| Rochedo 160 | 4 | — | 11,8 m | 24.000 | 5 entregas |
| Peregrino Clássico | 3 | 6 | 18,2 m | 34.000 | 6 entregas |
| Falcão Aero | 3 | 6 | 18,4 m | 44.000 | 7 entregas |
| Imperador Frontal | 2 | 5 | 15,8 m | 39.000 | 6 entregas |

A compra de um cavalo já inclui sua carroceria padrão. Troca entre baú e lona custa 800 CR$ por operação. Nenhum caminhão anterior é removido. Valores e capacidades são balanceamento fictício de jogo.

## Uso
No início, abrir **VER MODELOS 3D**. Escolher caminhão e carroceria, girar e ajustar a distância. Todos podem ser vistos sem compra. A prévia não altera save ou o caminhão equipado. Na oficina, **VER EM 3D** abre a mesma prévia. Para jogar, comprar/selecionar na garagem; trocar carroceria na seção do caminhão adquirido.

## Implementação
`fleet.mjs` centraliza catálogo, compatibilidade e layouts. `truck-model.mjs` constrói cabine, chassi, eixos, rodas, vidros, grades, retrovisores, tanques, baú e lona. Cabines possuem geometria diferente. Semirreboque e rodas têm pivôs independentes. Agrupamento de geometrias por material limita as chamadas de desenho. A câmera de capô foi reposicionada para o comprimento das novas cabines.

## Validação e limites
46 testes passaram. Modelos e carrocerias foram construídos em Node com verificação de coordenadas finitas, dimensões, eixos, contagem de meshes, folga entre cabine e carreta e detalhes específicos. M02 concluída na simulação pelos seis caminhões. Migração preserva saldo, cor, melhorias e veículos e define uma carroceria válida para saves antigos.

No navegador, modo compatível: inspeção das cabines clássica, aero e frontal; troca baú/lona; catálogo do Rochedo; retorno à oficina; saldo mantido em 1.200 após prévias; início e abandono de M01 com Aurora original equipado. WebGL, qualidade em GPU e FPS em celulares não certificados. O renderizador Canvas pode apresentar sobreposição de triângulos que exige refinamento. Não foi completado um frete humano com cada modelo pela interface.

Articulação segue a trajetória de forma aproximada e visual. Não há simulação completa de manobra de carreta, suspensão, deformação da lona ou portas animadas. A campanha ainda tem quatro missões; fretes específicos para a capacidade dos caminhões pesados são uma evolução seguinte.
