# Carga Pesada — REV21 / v0.21 — Rochedo 160

## Modelo exclusivo

- Cabine alta de caminhão rígido pesado, com teto reforçado e proporções próprias.
- Para-brisa amplo dividido, vedação, limpadores e janelas laterais.
- Grade de radiador em profundidade, aletas horizontais, duas lentes em cada conjunto de farol e piscas âmbar.
- Para-choque robusto com borracha, placa e faróis auxiliares.
- Portas definidas, maçanetas, retrovisores principais, espelhos de ponto cego, saídas de ar e estribos duplos.
- Quatro eixos com oito rodas animadas, aros, parafusos, pneus com sulcos, vigas de suspensão e para-barros traseiros.
- Baú preservado com reforços superiores, refletores e lanternas laterais.

## Compatibilidade

A nova modelagem só é usada quando `vehicle.id === 'rochedo'`. Não altera posições dos eixos, física, limite de carga, preço, desbloqueio, upgrades, carroceria, controle, carreira, nem o save `carga-pesada-v1`.

## QA

Seis testes novos: cabine/frente, detalhes laterais, quatro eixos e movimento, limites de malha, pintura/carroceria e regressão dos cinco caminhões restantes. Testes de código e build Vite são realizados pelo GitHub Actions antes da publicação. Validação visual em dispositivos reais ainda necessária.
