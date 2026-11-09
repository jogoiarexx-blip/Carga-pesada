# Carga Pesada — Santa Brava

Jogo de caminhões, fretes, oficina, duelos e história em JavaScript, Three.js e Vite.

**Jogar agora:** https://jogoiarexx-blip.github.io/Carga-pesada/

## Versão da aplicação — v0.27

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

**QA:** 162 testes de código-fonte e build Vite aprovados para a v0.27. A auditoria visual em diferentes navegadores, resoluções de celular e partidas completas permanece como etapa adicional.

## v0.21 — Rochedo 160 realista

Cabine alta exclusiva, grade de radiador em profundidade, novos faróis, vidros, espelhos, estribos duplos, para-lamas e detalhamento dos **quatro eixos**. Código em [source/src/rochedo-160.mjs](source/src/rochedo-160.mjs) e [relatório de testes](source/docs/REV21_ROCHEDO_160_REALISTA.md). O save `carga-pesada-v1` continua compatível. A versão é compilada e publicada automaticamente pelo workflow Vite.

## v0.22 — Peregrino Clássico

O caminhão de capô longo ganhou cabine, faróis redondos, grade cromada, dormitório alto, escapamentos independentes, rodas e chassi mais realistas. Mantidos saves e as opções de carreta-baú e carreta com lona. O [relatório da REV22](source/docs/REV22_PEREGRINO_CLASSICO.md) e a implementação estão em `source/`.

A atualização possui nove novos testes específicos do Peregrino, totalizando 127 testes de código-fonte.

## v0.24 — Imperador Frontal realista

Cabine alta e avançada sobre o motor, com para-brisa dividido, faróis duplos, grade cromada profunda, teto com defletor, portas, estribos, retrovisores, para-lamas, rodas e chassi remodelados. Mantém os cinco eixos do conjunto articulado, baú e lona, pintura, acessórios, saves e as novas artes brasileiras.

O módulo dedicado está em [source/src/imperador-frontal.mjs](source/src/imperador-frontal.mjs), com [relatório](source/docs/REV24_IMPERADOR_FRONTAL_REALISTA.md) e [testes](source/tests/imperador-frontal.test.mjs). A suíte local passou 144 testes; a validação automatizada do GitHub Actions compilou também as artes atuais do projeto.


## v0.27 — Áudio do motor sem repetição da partida

O arquivo gravado `motor.ogg` contém um som de partida que anteriormente tocava em loop. Agora a partida é reproduzida **uma vez por corrida**; durante a viagem, apenas um trecho intermediário da gravação é repetido com transição suave. Pausar/retomar não reinicia a partida. São mantidos os volumes, a buzina, os sons de colisão e os saves.

Detalhes e testes de regressão: [REV27 — correção de áudio](source/docs/REV27_CORRECAO_AUDIO_MOTOR.md).

Para receber a versão atualizada quando o Pages terminar de publicar, recarregue o site com `Ctrl + F5`.
