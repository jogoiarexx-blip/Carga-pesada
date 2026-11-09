# Código-fonte Vite — Carga Pesada

Esta pasta contém o projeto editável original (módulos ES, testes, assets e documentação). A versão jogável do GitHub Pages ainda usa os arquivos compilados na **raiz**; publicar estes arquivos na branch não substitui automaticamente o site.

## Comandos

Requisitos: Node.js >=22.12

```sh
cd source
npm ci
npm test
npm run build
npm run check:dist
```

O Three.js original fica compactado em `vendor/three.module.js.gz` para manter o repositório leve; os scripts `predev`, `pretest` e `prebuild` restauram e verificam automaticamente o SHA-256 exato do arquivo. Não há dependência de CDN.

O workflow `.github/workflows/source-ci.yml` testa e compila o projeto, produzindo um artefato `dist`. O GitHub Pages continua com deploy a partir da raiz de `main` até que seja feita a migração controlada. Não apagar `/index.html` e `/assets` antes dessa migração.

Carreiras existentes usam `localStorage['carga-pesada-v1']`; preservar a chave.
