# Carga Pesada v0.14 — Vite, GitHub Pages e carreira transferível

Data: 08/11/2026.

## Entregue

Código separado em `src/`, recursos em `public/`, entrada HTML na raiz. Vite 8.3.6 fixado no lockfile; JS e CSS minificados, Three.js local separado em chunk. Base relativa, fundos carregados a partir da URL do documento, navegação hash. Verificador detecta referências ausentes/absolutas e confirma os oito panoramas e a oficina no build. Licença MIT do Three acompanha fonte e saída compilada. Não foi introduzido framework de UI ou CDN.

Workflow GitHub Actions com instalação pelo lockfile, testes, build, verificação de arquivos e deploy. Permissões de publicação ficam no job de deploy; PRs não publicam. Ações fixadas nos commits da referência oficial do Vite consultada nesta revisão. O workflow foi preparado e inspecionado localmente; não executado no repositório GitHub do usuário.

## Melhorias no jogo

Backup JSON de até 32 MB, com prévia de missões, frota, créditos e pinturas antes de substituir a carreira. Inclui apenas pinturas importadas referenciadas pela frota; presets são recriados pelo jogo. Formato, frota e imagens são validados. As imagens são gravadas em transação IndexedDB com novos IDs; se o salvamento da carreira falhar, as novas imagens são removidas e o save anterior permanece. Arquivos/pinturas inválidos não viram uma carreira nova silenciosamente. O importador não executa conteúdo do arquivo nem busca imagens externas.

Medalhas por frete: Ouro com carga ≥98%, avaria do caminhão ≤1 e tempo ≤65% do prazo; Prata com carga ≥90%, avaria ≤5 e tempo ≤85%; Bronze para os demais fretes aprovados. Duelo não recebe medalha de frete. Melhor classificação e menor tempo ficam no mural; repetir não rebaixa uma medalha já obtida. Resultados indicam novo recorde. Medalhas não alteram dinheiro, desbloqueios ou dificuldade. Saves antigos continuam válidos e ganham medalhas nas próximas entregas.

## Evidência

93 testes passaram, incluindo os 88 anteriores, campanha econômica M01–M30, montagem de caminhões/peças, backup com compras/recordes e rejeição de dados inválidos, integridade das referências de pintura, classificação e persistência de medalhas. `npm run build` e `npm run check:dist` passaram.

O build de produção, e não o servidor dev, foi aberto na raiz e numa subpasta de teste. Foi importado um backup artificial com M01 concluído, Ouro e uma pintura PNG pequena. A UI mostrou resumo correto; após restaurar, foram verificados saldo/progresso e nova exportação com a pintura remapeada e incorporada ao JSON. Mural mostrou recorde 1:30 e Ouro. M02 noturno foi dirigido na subpasta com cenário, faróis, instrumentos e pintura restaurada. Console da aplicação sem erros. A cópia temporária de teste foi removida antes do pacote final. O cenário de teste não foi publicado como progresso padrão.

Capturas: `evidencias/vite-mural-v14.png` e `vite-subpasta-v14.png`.

## Limites e próximos incrementos

A publicação no GitHub depende do envio do pacote ao repositório e da seleção do método em Pages. Não foi executada aqui uma Action remota ou verificada uma URL GitHub nova. Não há PWA/offline garantido. Vite organiza/compila arquivos, não altera a física ou garante mais FPS.

Prioridades seguintes do GDD: (1) relevo físico e pontes dirigíveis, com rodas/câmera/colisão coerentes; (2) refino de cabines, carrocerias e ordenação/LOD no renderer compatível; (3) clima e IA com decisões de ultrapassagem; (4) ampliar as quatro regiões atuais para seis. A validação em WebGL e aparelhos móveis continua pendente; a campanha inteira foi simulada, não jogada manualmente nesta revisão.
