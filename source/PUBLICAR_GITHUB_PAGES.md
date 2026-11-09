# Publicar Carga Pesada v0.14 no GitHub Pages

## Opção recomendada — fonte com Vite e GitHub Actions

1. Extraia `CARGA_PESADA_v0.14_VITE_FONTE.zip`.
2. Envie seu conteúdo para a raiz do repositório: `index.html`, `src/`, `public/`, `tests/`, `scripts/`, `package.json`, `package-lock.json`, `vite.config.js` e a pasta **`.github/workflows/`**. Inclua os arquivos ocultos. Não envie `node_modules/`.
3. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
4. Faça commit na branch padrão `main` ou `master`. O workflow testa, compila e publica. Acompanhe a aba **Actions** e depois abra a URL mostrada em Pages. Para outra branch padrão, acrescente seu nome em `branches` no workflow.

O arquivo `.github/workflows/pages.yml` já está incluído. Não é necessário configurar tokens pessoais, secrets ou servidor. PRs executam as verificações; somente a branch padrão publica. A aprovação/configuração de ambiente do próprio repositório pode ser exigida pelo GitHub.

A configuração `base: './'` e os caminhos dos cenários funcionam tanto na raiz quanto dentro da pasta de um repositório, sem precisar descobrir seu nome. As telas usam hash (`#inicio`, `#garagem`, `#contratos`), sem exigir redirecionamentos de SPA.

## Opção rápida — arquivos já compilados

Extraia `CARGA_PESADA_v0.14_PAGES_PRONTO.zip` e envie o conteúdo à raiz de uma branch para publicação estática. Em Settings → Pages, escolha **Deploy from a branch**, essa branch e **/(root)**. O `index.html` precisa estar nessa raiz, ao lado de `assets/` e `.nojekyll`.

Este ZIP já contém o resultado do Vite. Ele serve para publicar, mas use o ZIP fonte para continuar editando o jogo. Não misture as duas opções no mesmo diretório: no projeto fonte o `index.html` aponta para `/src/game.js` e precisa do build; no ZIP compilado ele aponta para os bundles.

## Trabalhar no PC

Instale Node.js 22.12 ou superior (preferencialmente 22 LTS ou 24 LTS). No diretório extraído:

```bash
npm ci
npm run dev
```

Para verificar e compilar:

```bash
npm test
npm run build
npm run check:dist
npm run preview
```

A saída para hospedagem é `dist/`. Não abra o HTML via `file://`; use o servidor de desenvolvimento/prévia ou o GitHub Pages. Todas as dependências de execução, imagens e Three.js são entregues com o jogo, sem CDN. O pacote não inclui service worker ou instalação PWA.

## Levar a carreira para o GitHub

No endereço antigo atualizado para v0.14, abra **Backup e restauração da carreira → Exportar carreira e pinturas**. Guarde o JSON. No novo endereço, selecione esse arquivo, confira o resumo e escolha **Restaurar e substituir carreira**. A restauração é manual porque os navegadores separam o armazenamento por origem. As medalhas antigas começam vazias; podem ser conquistadas repetindo fretes.

Referências oficiais: https://vite.dev/guide/static-deploy e https://vite.dev/guide/build#relative-base .
