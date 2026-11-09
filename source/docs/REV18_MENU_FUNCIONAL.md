# REV18 — Menu principal funcional

## Referência e implementação

Recriação real do menu principal com HTML, CSS, SVG inline e os dados da carreira. Não usa uma imagem de captura de tela como botão. O cenário existente da Oficina Farol e o modelo 3D real do caminhão permanecem ativos.

## Controles

- Continuar: abre preparação da próxima missão desbloqueada.
- Contratos: mostra os fretes com a progressão normal.
- Garagem: abre a frota e a oficina.
- Opções: qualidade gráfica e volume de música usando as mesmas preferências do jogo.
- Extras: controles, tutorial e backup/restauração da carreira.
- Topo: Perfil, Estatísticas e Conquistas leem os dados reais do save.
- Cartões inferiores: campanha, frota e rádio são clicáveis e levam às respectivas páginas.
- Esc: fecha os painéis do menu.

## Compatibilidade

- Mantida a chave de save `carga-pesada-v1`; nenhuma migração necessária.
- Layout responsivo em desktop, tablet e celular, sem scripts externos.
- PWA atualizado para cache v0.18; atualizar uma vez online ao abrir a página.
- Fluxo de jogo, física e campanha sem alterações nesta revisão.

## QA

Testes automáticos em `tests/main-menu.test.mjs` e nos testes existentes. Build reproduzível pelo GitHub Actions, com smoke do dist e deploy para Pages baseado em branch.
