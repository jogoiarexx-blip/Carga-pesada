# Carga Pesada — REV32 | Viseiras corrigidas

## Problema corrigido
As três opções de viseira eram instaladas usando a altura genérica `cab.visorY`, abaixo do topo real dos para-brisas modelados. As abas, frisos e luzes de versões anteriores também usavam essa altura incorreta e atravessavam o vidro.

## Implementação
- Novo módulo `cab-visor-rev32.mjs`, com pontos explícitos de montagem das seis cabines, medidos a partir das geometrias dos para-brisas e dos tetos.
- A borda inferior da viseira fica **acima do topo do vidro**, com folga visual; a face frontal projeta-se à frente do vidro.
- Geometria de pala inclinada e afunilada em 3D (não uma barra plana na metade do para-brisa).
- Suportes na região superior, ponteiras, perfil frontal e três acabamentos:
  1. Pala curta integrada, baixa e discreta.
  2. Touring cromada, com aletas e rebites.
  3. Aba Dekotora com sete luzes e asas cromadas.
- Nos caminhões de capô longo (Peregrino e Falcão), a pala usa a posição do vidro após o capô, não a frente da carroceria.
- No Imperador, a montagem leva em conta a translação de 10 cm da cabine.
- Removidos todos os detalhes antigos que eram adicionados usando `cab.visorY`, para evitar peças residuais atravessando o vidro.
- Mantidos IDs 1, 2 e 3, preços, peças compradas e saves. Apenas nomes de oficina e geometria foram melhorados.
- Mesclagem estática por material preservada, sem adição de luzes dinâmicas.

## Referências externas
- Exemplos reais de viseiras cromadas com recortes e abas: https://kashima-original.com/products/k-306/ e https://kashima-original.com/products/k-321/
- Glossário do Dekotora: https://en-truckshopzare.blogspot.com/2010/

## Validação
Testes automatizados verificam que os limites de Y das malhas finais ficam acima do topo do vidro em cada cabine e que os três estilos têm geometrias diferentes, com suportes e lâmpadas devidos. Os testes também verificam compras, saves e ausência das peças antigas.
Inspeção visual manual no navegador ainda é recomendada em vista frontal e lateral para os seis modelos.
