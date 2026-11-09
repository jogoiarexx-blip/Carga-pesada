# REV27 — Motor ligando repetidamente

## Causa
`RecordedSounds` executava `motor.ogg` em um elemento `Audio` com `loop=true`. A gravação inclui o som da partida, que reiniciava a cada volta e dava a impressão de o caminhão estar ligando continuamente.

## Correção
- `motor.ogg` é reproduzido **uma única vez** no início da viagem.
- Através de `Web Audio API`, um trecho intermediário gravado (42–87% da gravação) é decodificado e transformado em loop contínuo, com crossfade de até 75 ms na junção. Não se sintetiza áudio novo.
- O loop preserva a variação de rotação com a velocidade. Quando houver bloqueio de reprodução/decodificação, a gravação da partida apenas termina sem repetir.
- Pausar e voltar à viagem não repete a partida. Encerrar viagem ou voltar à garagem reinicializa o motor para a próxima.
- Volume das opções continua controlando a partida e o motor rodando; buzina e batida permanecem inalteradas.
- Cache PWA versionado para `v0.27-audio-v2`, forçando atualização do módulo e da trilha gravada.

## Regressão
Testes cobrem partida única, retomada, clipe curto, transição para trecho contínuo, mixagem e fallback offline.
