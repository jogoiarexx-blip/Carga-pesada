# Carga Pesada — REV30: Ornamentos Dekotora e presets de oficina
Data: 2026-11-11

## Objetivo
Evoluir o acabamento 3D do Carga Pesada, usando categorias históricas de Bakusou Dekotora Densetsu / Art Truck Battle sem reproduzir artes de terceiros.

## Fontes
- Guia de personalização do jogo de PlayStation: https://gamefaqs.gamespot.com/ps/572650-bakusou-dekotora-densetsu-otoko-ippiki-yume-kaidoi/faqs/4432
- Descrição das peças clássicas front deck, visor e para-choque: https://en-truckshopzare.blogspot.com/2010/
- Caminhão Dekotora real com viseira e para-choque ornamentado: https://japspirit.com/isuzu-dump-truck-dekotora-style-decorated-big-front-visor-bumper/

## Implementação
- Nova coroa de cabine com 3 variantes: varão inox, arco touring e coroa festival.
- Nova grade artística com 3 variantes: filetes, máscara cromada e escudo festival.
- Contornos 3D extrudados em vez de apenas cubos nas novas peças, spoilers e ponteiras dos dois para-choques.
- Defletores aprimorados sem perder versões e propriedade de compra já existentes.
- Catálogo ampliado para 21 categorias e 65 versões.
- Três presets de prévia: Clássico Inox, Rodoviário Cromado e Festival de Luzes.
- Presets ajustam peças, cores e padrão de iluminação; preservam o nome do caminhão e as artes existentes. Não efetuam compras até a confirmação normal da oficina.
- Geometria estática compartilhando material e batching existente. Nenhuma luz dinâmica adicionada por elemento.

## Validação
Os novos testes verificam as variantes, todas as seis cabines e opções de baú, saves, prévias, e os limites atuais de triângulos e draw calls. Recomenda-se inspeção visual no navegador, especialmente combinações de faróis e coroa de cabine, de dia e à noite.
