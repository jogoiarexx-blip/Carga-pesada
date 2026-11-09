# Carga Pesada — Santa Brava

Jogo original de caminhões, fretes, oficina, duelos e história em Santa Brava, construído com JavaScript, Three.js e Vite.

**Jogar:** https://jogoiarexx-blip.github.io/Carga-pesada/

## Versões

- **v0.16 — jogo publicado (09/11/2026):** suporte offline progressivo, PWA, três opções gráficas, minimapa e velocímetro otimizados.
- **REV17 — manutenção e fonte integrado (09/11/2026):** código-fonte Vite versionado em [source/](source/), 97 testes e build Vite executados com sucesso no [GitHub Actions](https://github.com/jogoiarexx-blip/Carga-pesada/actions/runs/42620474020).

## Onde editar

- [source/src/](source/src/): motor do jogo, caminhões, cenários, IA, HUD, garagem, efeitos e CSS.
- [source/tests/](source/tests/): testes da campanha, física, sessões, veículos, upgrades, save e progressão.
- [source/public/](source/public/): imagens, cenários e PWA.
- [source/package.json](source/package.json) e [source/package-lock.json](source/package-lock.json): ferramentas e dependências fixadas.
- [source/LEIA-ME_FONTE_GITHUB.md](source/LEIA-ME_FONTE_GITHUB.md): instruções de desenvolvimento e arquivo Three.js local.

## Como trabalhar no fonte

Use **Node.js 22.12 ou superior**:

```bash
cd source
npm ci
npm test
npm run build
npm run check:dist
```

O `pretest`/`prebuild` restaura e verifica o arquivo Three.js de um arquivo compactado existente no próprio repositório. O workflow [source-ci.yml](.github/workflows/source-ci.yml) valida a fonte automaticamente e disponibiliza `dist` como artefato.

## Publicação segura

A versão disponível no GitHub Pages ainda é servida a partir do **`index.html` e `assets/` na raiz**. A integração do fonte não substitui automaticamente o jogo em produção. Uma nova versão jogável deve passar nos testes, ser compilada com Vite e ter seu `dist/` publicado na raiz ou por um workflow Pages configurado para Actions.

**Salvamentos:** preservar a chave `carga-pesada-v1` e o formato de backup. Não apagar a pasta `assets/` da raiz até confirmar o novo build.

## Conteúdo

30 missões, seis modelos, carrocerias, acessórios compráveis, duelos, oficina, economia, medalhas, músicas originais, backup/restauração da carreira e controles para teclado, celular e gamepad.

Ainda faltam certificação visual em celulares/WebGL, ensaios prolongados das missões e evolução das físicas e cenários.
