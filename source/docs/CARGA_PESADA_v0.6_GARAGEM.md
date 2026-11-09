# Carga Pesada v0.6 — Oficina Farol em 2D + 3D

## Antes e depois

| Área | v0.5 | v0.6 |
|---|---|---|
| Principal | Introdução e quatro contratos juntos | Tela de início com carreira, missão atual, frota e atalhos |
| Navegação | Botões abriam overlays | Início, Contratos e Garagem como telas exclusivas com hashes próprios |
| Garagem | Modal central com lista longa | Página inteira com Minha frota, Loja e Oficina |
| Cenário do menu | Estrada procedural 3D | Oficina ilustrada 2D e caminhão 3D em uma área própria |
| Loja | Lista, preço e prévia separada | Lista 2D, modelo 3D, especificações, comparação, requisito e compra na mesma página |
| Pintura | Clique na cor já gastava | Prévia no modelo; aplicar pintura é uma operação explícita |
| Serviços | Atrelados ao caminhão equipado | Aplicados ao caminhão adquirido escolhido na Oficina, preservando equipamento atual |
| Contratos | Parte do início | Mural 2D dedicado, sem desenhar cena 3D enquanto estiver aberto |
| Voltar à oficina | Retornava à tela inicial | Abre a página da garagem, com o caminhão equipado |

## Navegação
`#inicio`, `#contratos`, `#garagem`. Acesso direto, recarga e Voltar entre páginas são suportados. As páginas compartilham o mesmo aplicativo estático; garagem não é modal. Durante uma viagem, voltar pelo navegador pausa antes de navegar.

## Parte 2D
Arte de fundo original em PNG, interface HTML/CSS e miniaturas SVG. A oficina, a estrutura do galpão, ferramentas e iluminação de fundo não exigem malhas 3D. O mapa da estrada só é construído ao iniciar a missão.

## Parte 3D
Malha real do caminhão, pintura em tempo real, carroceria, rotação e zoom. O renderizador usa a região central da página em vez de ocupar o painel de controles. O modo compatível também respeita transparência e recorte da área de prévia. A viagem mantém o cenário 3D já existente.

## Funcionalidades
- Frota: comparar e equipar caminhão adquirido.
- Loja: seis modelos, requisitos de entregas, saldo necessário, compra e preservação da frota antiga.
- Oficina: reparação, motor, freios, carroceria e pintura por veículo.
- Prévia de cor/carretas sem cobrança. Aplicação de pintura custa 300 CR$; troca de carroceria compatível custa 800 CR$.
- Ajustes de menu não apagam o save. Saldo atualizado inclusive ao abrir diretamente a garagem.

## Validação
52 testes passaram, mantendo os 46 anteriores e acrescentando seis casos de serviços direcionados, prévia sem efeitos no save, pintura paga uma vez, operações inválidas bloqueadas, carroceria de um caminhão estacionado e rotas das telas.

No navegador em modo compatível: início, garagem inteira, catálogo/Peregrino/lona, comparação, pintura azul sem custo na prévia, aplicação com saldo de 1.200 para 900, recarga e persistência em `#garagem`, Voltar do navegador, mural 2D, início de M01 e abandono com retorno direto à garagem. A pintura da sessão de teste não integra o save de outros usuários.

WebGL e desempenho em aparelhos móveis reais não foram certificados. CSS responsivo foi implementado, mas não equivale a teste em dispositivo físico. A arte 2D é estática; não há personagem de mecânico controlável nem exploração a pé da oficina. A garagem é uma tela de gestão e preparação.
