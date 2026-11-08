# Carga Pesada — Santa Brava

Jogo original de caminhões, entregas, oficinas e duelos, desenvolvido com Three.js e publicado no GitHub Pages.

## Jogar

https://jogoiarexx-blip.github.io/Carga-pesada/

## Versão atual

**v0.15 (08/11/2026)**: três perfis de qualidade gráfica (Alta, Equilibrada e Econômica) no menu de pausa e menos trabalho de desenho do minimapa/velocímetro (cerca de 10 Hz), sem alterar física, campanha ou saves. Veja [changelog](docs/VERSAO_0_15.md).

## Estrutura do repositório

Esta é a versão **compilada para GitHub Pages**: `index.html` e `assets/` devem permanecer lado a lado. Os módulos ES e testes da versão editável estão no pacote separado `CARGA_PESADA_v0.15_VITE_FONTE.zip` entregue junto desta revisão. Não há `package.json` neste repositório: **não rode npm install/build aqui até importar a árvore Vite**.

Para evoluir o jogo no código editável: use o pacote Vite (`src/`, `tests/`, `public/`, `package.json`, `package-lock.json`); rode `npm ci`, `npm test`, `npm run build` e `npm run check:dist`. A saída `dist/` pode então substituir o conteúdo publicado. O código-fonte editável deve ser importado ao repositório em uma migração posterior para que o GitHub Actions execute build e testes diretamente.

## Progresso

30 missões, seis modelos procedurais, 48 versões de peças, oficina, campanhas com diálogos, fretes e duelos, medalhas, músicas originais e backup/restauração da carreira.

**Limites:** a v0.15 foi verificada com 95 testes no código-fonte e sintaxe do JS compilado; performance e experiência visual em WebGL/celular ainda precisam ser medidas em dispositivos reais.
