# Carga Pesada — REV31: traseira Dekotora e encaixe de teto
Data: 2026-11-11

## Referências visuais
- Grade traseira com lanternas em linha e acabamento inox: https://nosweb.jp/camion/articles/gallery/6536
- Lanternas traseiras de formatos diferentes e moldura cromada: https://nosweb.jp/camion/articles/detail/6425
- Pintura traseira combinada a detalhes dos cantos: https://nosweb.jp/camion/articles/detail/6645
- Categorias originais de iluminação e acabamento de Art Truck Battle: https://gamefaqs.gamespot.com/ps/572650-bakusou-dekotora-densetsu-otoko-ippiki-yume-kaidoi/faqs/4432

## Principais implementações
- Novo painel de lanternas traseiras com 6, 10 ou 12 lentes, frisos e molduras próprias.
- Novo conjunto de montantes verticais: inox liso, ventilado e decorado com luzes.
- Fixação próxima aos cantos externos do baú; os painéis de arte permanecem livres.
- O para-choque traseiro original e as lanternas originais agora ficam em grupos independentes, ocultados somente quando a peça de substituição correspondente está equipada. Ao remover a peça, voltam a aparecer.
- A lógica funciona com carroceria rígida e carreta articulada, preservando o pivot.
- O letreiro da cabine é reposicionado quando há faróis no teto; a coroa recebe suportes mais altos quando há bagageiro ou defletor.
- O catálogo cresce de 21 para 23 categorias e de 65 para 71 versões, preservando os IDs antigos.
- Ambos os novos equipamentos entram nos conjuntos prontos da oficina; compras continuam exigindo confirmação.
- Uso de geometria estática e materiais compartilhados, sem fontes de luz dinâmicas.

## Testes
Cobertura de posicionamento, afastamento do painel pintado, troca dos conjuntos de fábrica, persistência no save, todos os seis veículos com todas as carrocerias, animação de reboque, geometria finita, custo de draw calls e triângulos.

## Pendente
Inspeção visual manual de todas as combinações sob diferentes ângulos e iluminâncias.
