# Carga Pesada v0.3 — Motor Frio

## Implementado
- M02: O Primeiro Frete, entrega de peças de 1,8 t ao Armazém 17, 2,4 km, prazo 3min30, recompensa de até 1.800 CR$ e bônus único de 400 CR$.
- Quarto percurso: acesso ao Porto Salgueiro, traçado suave, paleta e placas próprias, armazéns externos procedurais. Sem interiores.
- Sequência nova: M01 → M02 → M03 → M04. Conclusão por missão, indicador 0–4 e botão que retoma a próxima etapa.
- Briefings, rádio e conclusão específicos para Nilo, Bia e Coiote, conectando a Oficina Farol à história de Teresa.
- Bônus únicos: 250, 400, 500 e 700 CR$, separados no resultado. Repetições pagam contrato normalmente e não repetem bônus.
- Ao concluir o prólogo, contratos permanecem repetíveis e a interface informa que o capítulo seguinte está em produção.

## Migração
Preserva chave de save, moeda, veículos, melhorias, pintura e contadores. Saves antigos reconhecem conclusões por melhores tempos válidos. Contratos já disponíveis na versão anterior continuam acessíveis e são identificados como legado. Não inferimos quais missões foram concluídas somente pelo contador de entregas. A compra do Estradeiro continua disponível após três entregas, sem retomar o bloqueio para quem já o adquiriu.

## Validação
26 testes passaram. Incluem ordem da campanha, repetição sem duplicar bônus, falha/bloqueio sem pagamento, recarga de save, migração de frota e dinheiro, colisões e direção anteriores e simulação dos três fretes completos sem tráfego. Interface verificada em navegador no modo compatível: quatro cards, identificador de legado, requisitos de bloqueio, diálogo M01, início, pausa e retorno. Não foi concluído o prólogo inteiro pela interface. A rota M02 ainda requer playtest visual completo. WebGL e FPS em aparelhos reais não certificados.

## Próxima prioridade
Playtest completo com tráfego e Coiote, ajustes de ritmo/economia, depois Capítulo 1 e evolução visual do porto. A campanha de seis capítulos do GDD não está completa.
