# Carga Pesada v0.10 — catálogo e oficina

48 acessórios compráveis: três versões geometricamente diferentes em cada uma das 16 categorias. Preços em créditos do jogo, sem dinheiro real. Os quatro tipos de carroceria e os seis caminhões anteriores continuam disponíveis com suas regras próprias. Esta revisão amplia o catálogo de acessórios; não adiciona outros chassis ou interiores.

## Catálogo

| Categoria | Versão 1 | Versão 2 | Versão 3 |
|---|---|---|---|
| Saia lateral cromada | Lisa de alumínio · CR$ 480 | Ventilada grafite · CR$ 790 | Cromada rebitada · CR$ 1.150 |
| Viseira da cabine | Compacta · CR$ 220 | Touring cromada · CR$ 360 | Aba longa festival · CR$ 530 |
| Bagageiro de teto | Duas travessas · CR$ 380 | Bagageiro touring · CR$ 630 | Cesto de expedição · CR$ 910 |
| Faróis auxiliares no teto | Trio auxiliar · CR$ 420 | Cinco refletores · CR$ 690 | Sete refletores LED · CR$ 1.010 |
| Para-choque decorativo | Urbano compacto · CR$ 550 | Touring cromado · CR$ 910 | Grade de proteção · CR$ 1.320 |
| Escapamentos verticais | Torre simples · CR$ 460 | Duas torres · CR$ 760 | Torres de diâmetro largo · CR$ 1.100 |
| Buzinas no teto (visual) | Corneta simples · CR$ 180 | Dupla rodoviária · CR$ 300 | Trio festival · CR$ 430 |
| Antenas da cabine | Antena curta · CR$ 120 | Dupla rodoviária · CR$ 200 | Dupla com bobinas · CR$ 290 |
| Para-barros traseiros | Borracha lisa · CR$ 180 | Faixa refletiva · CR$ 300 | Três faixas refletivas · CR$ 430 |
| Faixas luminosas inferiores | Linha simples · CR$ 400 | Linha dupla · CR$ 660 | Módulos luminosos · CR$ 960 |
| Calotas cromadas | Seis parafusos · CR$ 300 | Oito parafusos · CR$ 500 | Dez parafusos · CR$ 720 |
| Retrovisores cromados | Capa compacta · CR$ 150 | Capa cromada · CR$ 250 | Capa touring larga · CR$ 360 |
| Defletor de teto | Perfil baixo · CR$ 320 | Defletor touring · CR$ 530 | Defletor com aletas · CR$ 770 |
| Caixas de ferramentas | Caixa única · CR$ 280 | Caixas duplas · CR$ 460 | Caixas reforçadas · CR$ 670 |
| Frisos cromados da carroceria | Linha inferior · CR$ 240 | Contorno duplo · CR$ 400 | Contorno com montantes · CR$ 580 |
| Letreiro na cabine | Placa compacta · CR$ 350 | Placa panorâmica · CR$ 580 | Letreiro com moldura dupla · CR$ 840 |

## Funcionamento

Escolher uma versão ou marcar uma peça altera a prévia e atualiza o total. Comprar e equipar adquire apenas as versões ainda não possuídas naquele caminhão. Reequipar, remover ou voltar à versão adquirida não cobra novamente; não há revenda ou transferência entre caminhões nesta revisão. Descartar prévia restaura o conjunto equipado. A loja permite comparar versões em caminhões não comprados, com aplicação bloqueada.

Peças equipadas em saves anteriores são reconhecidas como versão 1 adquirida sem cobrar novamente. O save antigo não registra peças anteriormente removidas, portanto apenas as equipadas podem ser identificadas. As novas versões são pagas. Pinturas de cabine, carrocerias, reparo e mecânica conservam os preços anteriores. Importação de arte e efeitos de luz continuam gratuitos.

As variantes mudam medidas dentro dos encaixes, número de faróis/cornetas/antenas, detalhes, travessas, montantes, calotas ou carcaças — não apenas cor. As versões maiores de peças continuam respeitando a família da cabine e as folgas da carroceria. Os escapamentos decorativos substituem visualmente os de fábrica no modelo clássico enquanto equipados. Para-brisas ganharam limpadores e as traseiras faixas refletivas.

## Menus

- Oficina: abas Peças/Arte/Luzes; filtro Cabine/Carroceria/Rodas/Luzes; preços e indicação Adquirida; resumo de compra e saldo insuficiente; descartar prévia. Mecânica/pintura têm seção recolhível que preserva a abertura ao alterar opções.
- Garagem e loja: comparação e prévia por veículo, sem equipar ou comprar silenciosamente. As 48 versões aparecem também na loja.
- Contratos: filtros por capítulo, dia/noite e disponibilidade/conclusão, incluindo mensagem quando nenhum contrato corresponde. A ordem da campanha e os desbloqueios não mudam.
- Início: horário do próximo contrato no resumo.

## Verificação

71 testes passaram. Incluem compra única, saldo insuficiente sem alterações parciais, independência por caminhão, migração das peças equipadas, propriedade após remover/recarregar, três geometrias distintas em cada categoria e todos os três conjuntos completos nos seis modelos e suas carrocerias compatíveis. Regressão do escapamento de fábrica adicionada. A campanha M01–M30 continua passando na simulação compartilhada.

Na interface Canvas: bloqueio de CR$ 1.320 com saldo CR$ 1.200, compra da viseira de CR$ 360 (saldo 840), recarga com propriedade preservada, reaplicação sem nova cobrança; aba de luzes e modo fixo; filtros capítulo 3/noite e concluídos vazios; prévia Aero com faróis, saia, bagageiro, escapamentos e buzinas versão 3; salvamento bloqueado no caminhão não adquirido. Captura: `docs/evidencias/catalogo-v10.png`.

WebGL, desempenho sustentado, celular físico e condução contínua longa continuam pendentes de validação. O modo compatível conserva limitações de profundidade aproximada. Sem interior de cabine, posicionamento livre de peças, faróis projetados na estrada, áudio diferente para cada corneta ou formatos inteiramente novos de carroceria. A interface e o catálogo foram ampliados; isso não certifica que todas as opções futuras do GDD estejam concluídas.
