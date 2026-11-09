# Carga Pesada — Santa Brava

Jogo de caminhões, fretes, oficina, duelos e história em JavaScript, Three.js e Vite.

**Jogar agora:** https://jogoiarexx-blip.github.io/Carga-pesada/

## Versão publicada — v0.21

Menu principal completamente remodelado e **funcional**, seguindo a referência visual fornecida:
- cinco botões laterais: Continuar, Contratos, Garagem, Opções e Extras;
- Perfil, Estatísticas e Conquistas exibem dados reais da carreira;
- cenografia da Oficina Farol e caminhão tridimensional ativo no menu;
- cartões inferiores clicáveis com campanha, frota e rádio;
- responsivo para computador e celular;
- mantém os 30 contratos, a oficina, opções gráficas, áudio, PWA offline e a chave de save `carga-pesada-v1`.

## Código-fonte

Os arquivos editáveis estão em [source/](source/) e a documentação da implementação em [source/docs/REV18_MENU_FUNCIONAL.md](source/docs/REV18_MENU_FUNCIONAL.md). A raiz `index.html` e `assets/` contém o jogo compilado e publicado.

```bash
cd source
npm ci
npm test
npm run build
npm run check:dist
```

## Publicação automatizada

- [source-ci.yml](.github/workflows/source-ci.yml): valida os módulos e gera artefato compilado.
- [publish-vite.yml](.github/workflows/publish-vite.yml): executa testes, compila com Vite e copia `source/dist/` para a raiz da `main`, preservando os arquivos de configuração e código-fonte.
- [verify-pages.yml](.github/workflows/verify-pages.yml): verifica a integridade dos recursos publicados.

## Conteúdo da carreira

30 missões, seis caminhões, personalização de acessórios/carrocerias, duelos, economia, medalhas, músicas próprias, controles de teclado, touch e gamepad, backup/restauração de save.

**QA:** 102 testes de código-fonte e build Vite aprovados. A auditoria visual em diferentes navegadores, resoluções de celular e partidas completas permanece como etapa adicional.

## v0.21 — Rochedo 160 realista

Cabine alta exclusiva, grade de radiador em profundidade, novos faróis, vidros, espelhos, estribos duplos, para-lamas e detalhamento dos **quatro eixos**. Código em [source/src/rochedo-160.mjs](source/src/rochedo-160.mjs) e [relatório de testes](source/docs/REV21_ROCHEDO_160_REALISTA.md). O save `carga-pesada-v1` continua compatível. A versão é compilada e publicada automaticamente pelo workflow Vite.
