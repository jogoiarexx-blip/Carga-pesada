# Carga Pesada v0.8 — proporções, acabamento e correções

## Resultado

Peças externas passam a usar medidas e encaixes próprios das quatro famílias de cabine e das carrocerias compatíveis. A escala é interna ao jogo, em metros aproximados; os veículos são modelos originais estilizados, não réplicas homologadas de caminhões reais.

| Problema encontrado na v0.7 | Correção |
| --- | --- |
| Calotas presas ao chassi | Instalação no pivô da roda: giram e esterçam junto com ela |
| Mesma largura de peças em cabines diferentes | Larguras calculadas a partir da cabine compacta ou pesada |
| Acessórios suspensos no teto Aero | Ponto de instalação deslocado para a parte alta efetiva do teto |
| Saia lateral sem folga explícita para os eixos | Comprimento limitado pelo primeiro eixo traseiro e raio da roda |
| Para-barros distantes das rodas | Instalados após o último eixo, com folga para o pneu |
| Pintura da lona escondia seu formato | Arte aplicada à lateral inferior; a lona superior fica aparente |
| Remoção de peças não tratava calotas móveis | Limpeza inclui todos os pontos de roda, cabine e carreta |
| Materiais compartilhados descartados repetidas vezes | Descarte único de geometrias, materiais e texturas |
| Mudança de letreiro dependia de perder foco | Prévia acompanha digitação e Salvar lê o texto atual |
| Upload podia terminar após trocar veículo/tela | Descarte do resultado visual obsoleto; painel alvo capturado no início |
| Mensagem de sucesso mesmo se navegador recusasse save | Confirmação condicionada à gravação local |
| Lateral recortada por polígonos no Canvas | Painéis subdivididos, prioridade local de profundidade e sobreposição subpixel na textura |
| Retomada podia contar tempo anterior da pausa/inicialização | Reinicialização do relógio ao partir/continuar |

## Acabamento

- Pintura com material físico, verniz e rugosidade próprios; metais e borrachas separados.
- Iluminação de reflexão procedural pequena, criada localmente, para o renderizador WebGL.
- Bordas chanfradas em peças principais, pneus de perfil arredondado, juntas e maçanetas das portas e travessas de piso.
- Acessórios com suportes, aros e carcaças de faróis, entradas no para-choque, bocas de buzina, abraçadeiras de escapamento, canaletas e refletores nos para-barros.
- Sombra de contato suave sob o caminhão. Continua sendo uma projeção leve; não é uma sombra física completa da iluminação da oficina ilustrada.
- Acessórios agrupados por material, preservando as partes móveis. Renderizador Canvas descarta objetos fora do campo e evita alocações por vértice.
- A Loja permite experimentar o conjunto completo sem comprar ou mudar o veículo equipado. Salvar continua disponível apenas em caminhões adquiridos.

## Validação

62 testes automatizados passam: os 57 anteriores mais proporções e folgas nas seis famílias/modelos e suas variantes, pontos de teto, calotas móveis, remoção repetida, orçamento de geometria e descarte único. A simulação compartilhada continua concluindo fretes com os seis veículos, tráfego e rival; isso não equivale a dirigir o prólogo inteiro pela interface.

A inspeção da interface incluiu Aurora, Estradeiro, Rochedo, Peregrino (baú e lona), Falcão e Imperador com acessórios; dia/noite; salvamento do texto e recarga; bloqueio do save em caminhão não adquirido; começo de M01 e tentativa de retomada. No ambiente de teste WebGL está desabilitado e a viagem sofreu interrupções que acionaram a pausa protetora. A condução contínua e a aparência final em GPU/celular permanecem pendentes; nenhuma certificação de FPS é declarada. Uma amostra Canvas de aproximadamente 13 ms para 5.151 triângulos não constitui medição de FPS sustentado.

## Limites

Os modelos seguem estilizados. O renderizador Canvas usa ordenação aproximada de profundidade e interpolação afim; ainda pode mostrar artefatos em ângulos extremos. O WebGL usa a profundidade e a perspectiva próprias da GPU, mas não foi validado neste ambiente. Imagens importadas continuam locais ao navegador; não há sincronização ou backup incluído. Interior de cabine, peças posicionadas livremente e faróis que iluminem a pista continuam fora desta entrega.

## Reteste final

Após recuperar a cópia local de trabalho, os 62 testes passaram novamente, assim como a verificação de sintaxe de todos os módulos. Na interface, confirmado conjunto de acessórios no Aurora, letreiro `CARGA PESADA` salvo após recarregar e saldo preservado em 1.200 CR$. O teste de M01 percorreu aproximadamente 140 m, atingiu 56 km/h, manteve carga/integridade em 100%, alternou para noite e voltou à garagem sem pagamento indevido. A pausa protetora voltou a ocorrer em tentativas mais longas; a correção do relógio de retomada está implementada, mas não elimina as interrupções observadas neste ambiente. Não foi concluída a missão inteira pela interface.

Captura real do reteste: `docs/evidencias/garagem-v08.png`. A captura representa o modo Canvas, não comprova o acabamento em WebGL.
