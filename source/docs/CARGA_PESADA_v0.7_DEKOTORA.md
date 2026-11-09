# Carga Pesada v0.7 — Oficina de arte, luzes e peças externas

A v0.6 entregava a página de garagem, pintura de cabine e configuração de carroceria, mas não o sistema de arte lateral e iluminação decorativa. A v0.7 implementa esses sistemas e amplia a personalização externa. Esta entrega não representa todas as categorias de customização do GDD concluídas.

## Uso

Garagem → Oficina. Selecione um veículo da sua frota. No painel direito, após manutenção/pintura, selecione o painel da carroceria, escolha uma arte predefinida ou importe uma imagem. Marque as peças, configure as luzes e clique em **Salvar personalização**. As mudanças da prévia não cobram créditos; a configuração equipada permanece naquele caminhão e aparece nas viagens. Alterar a pintura básica e trocar carroceria conservam seus preços anteriores.

| Categoria | Implementação atual |
| --- | --- |
| Imagem lateral | Independente à esquerda/direita, ou aplicação simultânea nas duas laterais |
| Imagem traseira | Painel independente |
| Importação | PNG/JPEG/WebP, até 8 MB e 20 MP; redução para até 1024 × 768 |
| Enquadramento | Preencher com recorte ou imagem inteira com margens |
| Artes incluídas | Serra ao luar, Raios da estrada, Sol de Santa Brava; desenho original por Canvas |
| Luzes de contorno | Materiais emissivos/instancing, fixas, pulsantes ou sequenciais |
| Paletas | Festival, âmbar, azul/ciano |
| Dia/noite | Botão manual no menu/HUD, com preferência persistida; luzes também funcionam de dia |
| Letreiro | Placa luminosa na cabine com texto de até 24 caracteres |
| Persistência | Configuração no save por caminhão; imagens no IndexedDB do navegador |

## Dezesseis acessórios opcionais

| Cabine/chassi | Carroceria/rodas |
| --- | --- |
| Viseira | Saia lateral cromada |
| Bagageiro de teto | Caixas de ferramentas |
| Faróis auxiliares | Frisos cromados |
| Para-choque decorativo | Para-barros |
| Escapamentos verticais | Faixas luminosas inferiores |
| Buzinas de teto (visuais) | Calotas cromadas |
| Antenas | Capas cromadas dos retrovisores |
| Defletor de teto | Letreiro de cabine com texto |

As posições acompanham as dimensões da cabine/carroceria; acessórios do semirreboque acompanham o pivô de articulação. São cosméticos, sem ganho mecânico oculto. Peças de fábrica de alguns modelos não são removidas por desligar um acessório adicional. Calotas são sobrepostas às rodas atuais, sem catálogo de pneus ou troca do conjunto inteiro. As buzinas adicionadas são visuais; a buzina sintetizada existente continua disponível no H.

## Validação reproduzida

- 57 testes automatizados passaram, incluindo a regressão completa de campanha, direção, tráfego, economia e garagem.
- Novos testes verificam normalização e dados inválidos, salvamento independente por caminhão, ausência de cobrança, recarga do save, fases dos efeitos, painéis em todas as carrocerias e criação/remoção repetida dos acessórios em seis veículos e suas variantes compatíveis.
- Navegador: arte predefinida, luzes sequenciais e dia/noite; seleção e aplicação de peças sem alterar saldo (900 → 900); persistência após recarregar; importação de um PNG de teste e reaparecimento da imagem após salvar/recarregar; seis acessórios adicionais, texto de letreiro e reaparecimento das peças após recarga.
- A imagem importada usada no teste foi a ilustração de oficina do próprio projeto. As capas de jogos fornecidas pelo usuário são referências de estilo, não foram incorporadas como pinturas distribuídas.
- WebGL não está habilitado neste ambiente. A inspeção visual usou o fallback Canvas. Seu suporte a texturas foi adicionado nesta versão; interpola UV de forma afim, podendo distorcer a arte em ângulos fortes. Não são testes de FPS/GPU ou de controles em aparelho físico.

Evidência: `docs/evidencias/garagem-v07.png` (prévia noturna, arte, luzes e controles de acessórios).

## Pendências explícitas

| Recurso previsto/desejado | Estado |
| --- | --- |
| Interior de cabine, cortinas, painel e objetos internos | Pendente |
| Editor de camadas, pincel e posicionamento livre de adesivos | Pendente |
| Pacote exportável/importável de imagens e backup entre dispositivos | Pendente; ZIP do código não contém imagens importadas pelo jogador |
| Troca completa de rodas/pneus e catálogo de formatos de espelhos/peças | Pendente; opções atuais são acessórios predefinidos |
| Letreiros móveis, anexos escolhidos livremente e peças por ponto de encaixe | Pendente |
| Ciclo automático, chuva e aderência noturna/molhada | Pendente; noite atual é manual e visual |
| Faróis que projetem luz, bloom opcional e refletores dinâmicos | Pendente; iluminação decorativa atual é emissiva |
| Fotografias, exposição e competição de estilo | Pendente |
| Compra, reputação e desbloqueio próprios para acessórios | Pendente; personalização desta versão é gratuita |
| Performance WebGL e celular | Precisa de medição em hardware real |

Imagens e progresso são locais ao navegador, sem sincronização de conta. Apagar os dados do site pode removê-los. A seleção Fixo interrompe a animação das luzes; pulsação/sequência usam transições suaves e não flashes binários rápidos.
