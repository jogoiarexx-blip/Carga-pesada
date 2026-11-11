# Carga Pesada — REV33: Materiais retrô otimizados (2026-11-11)

## Escopo efetivamente aplicado
A REV33 centraliza os materiais dos seis caminhões (`aurora`, `estradeiro`, `rochedo`, `peregrino`, `falcao`, `imperador`) e todos os tipos de baú/lona sem alterar malhas, física, hierarquia de eixos, contratos ou formato do save.

### Implementação
- Novo `source/src/truck-materials.mjs` com paleta individual de vidro, metal, portas, baú e lona para cada caminhão.
- **Pintura**: `MeshStandardMaterial`, metalness 0.17 e roughness 0.55; preserva a cor salva/equipada e continua editável pelo seletor da oficina.
- **Cromados**: perfil polido com metalness 0.83 e roughness 0.24, distinto de inox escovado (0.67 / 0.40). As cores originais dos detalhes são preservadas, sem reflexos em tempo real.
- **Vidros**: substituição de `MeshPhysicalMaterial` transparente com `clearcoat` por material tingido opaco `MeshStandardMaterial` (metalness 0.07; roughness 0.24). Como a cabine sólida está atrás do vidro, isto evita overdraw e artefatos visuais no celular.
- **Borracha e pneus**: acabamento fosco, roughness 0.93 e metalness 0.0.
- **Baú/portas**: tons independentes por modelo, pintura levemente acetinada (roughness 0.65 e 0.60). Lona com acabamento mate e colorido.
- **Luzes de fábrica**: emissivo discreto sem fontes dinâmicas adicionais.
- **Detalhes de cabine e rodas**: os materiais dos seis módulos e seus chassis são criados pelo mesmo sistema, não individualmente com `new MeshPhysicalMaterial` ou vários `new MeshStandardMaterial` espalhados.
- **Acessórios da oficina**: cromado inox neutro atualizado, porém mantido **independente** da base para permitir remover/descartar customizações sem destruir materiais da cabine.
- **Cache por caminhão**: materiais com aparência efetivamente idêntica são reutilizados na mesma instância; o cache é intencionalmente não global para evitar que repintar um caminhão recolora outro.
- **Gerenciamento de memória**: o descarte liberta materiais sem uso; materiais usados são liberados uma única vez pela rotina já existente de liberação de geometria e texturas.

### Metas e limites
- Nenhuma textura extra, envmap, transmission, reflexão em screen space ou luz dinâmica.
- Materiais de carroceria/teto não alteram física, desempenho do caminhão ou compras.
- Mesclagem das malhas estáticas por material continua ativa para reduzir draw calls; rodas e carreta seguem seus pivôs.
- Qualidade gráfica Eco/Equilibrado/Alto e a instalação PWA permanecem intactas.

### Verificação
`source/tests/truck-materials-rev33.test.mjs` cobre:
1. As seis paletas e os acabamentos cromado/escovado/vidro/borracha.
2. Reutilização e isolamento entre materiais, inclusive a mudança da pintura.
3. Continuidade dos saves, créditos e cor personalizada.
4. As seis cabines em todas as carrocerias compatíveis sem `MeshPhysicalMaterial` na frota básica.
5. Limites existentes de draw calls, vértices e animação das carretas.
6. Descarte de materiais usados e órfãos sem duplicação de eventos.

### Limitação
Teste automatizado de geometria e renderização não substitui inspeção visual de reflexos/tonalidades em celulares reais. Na oficina recomenda-se comparar vista frontal, traseira, lateral e fases diurna/noturna com qualidade Eco.
