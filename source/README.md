> **v0.16** — qualidade gráfica Alta/Equilibrada/Econômica na pausa, preferências persistentes e minimapa/velocímetro a 10 Hz para reduzir desenho 2D sem alterar a simulação a 60 Hz.

# Carga Pesada v0.16 — Vite + JavaScript

Jogo original de caminhões em Santa Brava, com garagem 3D sobre cenário 2D, 30 missões, seis modelos, quatro carrocerias, duelos, dia/noite fixos e personalização com pinturas e 48 versões de peças compráveis.

Esta versão migra o projeto para Vite 8.3.6, conserva a simulação e as correções da v0.13 e acrescenta medalhas de frete, recordes visíveis e backup transferível da carreira com as pinturas importadas. O Three.js r170 permanece local, com licença incluída; no repositório é armazenado comprimido em `vendor/three.module.js.gz` e restaurado automaticamente pelo pretest/prebuild/predev. Não é necessário um serviço externo para executar o jogo.

## Desenvolvimento

Node.js 22.12+; use Node 22 ou 24 LTS.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
npm run check:dist
npm run preview
```

- `index.html`: entrada do Vite.
- `src/`: jogo, CSS e Three.js local.
- `public/`: cenários, ilustração da oficina, licença e `.nojekyll`.
- `tests/`: simulação, campanha econômica, veículos, peças, backup e medalhas.
- `scripts/check-dist.mjs`: integridade e caminhos relativos do build.
- `dist/`: saída gerada; não editar nem versionar.
- `../.github/workflows/source-ci.yml`: CI real do repositório. A pasta interna `.github/workflows/pages.yml` é apenas referência histórica.
- `docs/`: GDD, relatórios e evidências históricas.

## Publicação

Siga [PUBLICAR_GITHUB_PAGES.md](PUBLICAR_GITHUB_PAGES.md). O código-fonte está integrado à pasta `source/` do GitHub. O CI gera e testa `dist/` automaticamente, sem alterar os arquivos publicados na raiz. Para publicar um novo jogo, aprovar o build e substituir o conteúdo compilado na raiz ou configurar a origem GitHub Pages como GitHub Actions.

## Carreira e desempenho

No menu inicial, Backup e restauração exporta e importa um JSON com a frota, peças, créditos, progresso, recordes e pinturas usadas. A importação exige confirmação, valida formato/imagens e salva novas imagens sob novos IDs. Backups de até 32 MB. Imagens antigas sem referência não são apagadas automaticamente.

Fretes aprovados recebem Bronze, Prata ou Ouro conforme tempo e integridade. A melhor medalha nunca é rebaixada; os pagamentos mantêm as regras existentes. A medalha e o melhor tempo aparecem no mural.

A v0.14 passou em 93 testes e no build. A compilação foi aberta no navegador tanto na raiz quanto numa subpasta e a restauração/exportação com uma pintura foi reproduzida. O navegador usou Canvas; não há certificação de FPS sustentado, GPU ou celulares. [Relatório completo](docs/CARGA_PESADA_v0.14_VITE_PAGES.md).

## v0.16

Modo offline após primeira visita online, manifest PWA, ícone SVG e atualizações do service worker. O GitHub Pages usa a versão compilada e mantém os saves existentes.

## v0.25 — Tráfego nas provas contra chefes

Os seis duelos agora têm carros de apoio na pista nas duas faixas, visíveis no minimapa. Os obstáculos afetam tanto o jogador quanto o rival; ele desvia ou freia e perde velocidade se bater. Saves e fretes comuns preservados. Consulte `docs/REV25_TRAFEGO_CHEFES.md`.
