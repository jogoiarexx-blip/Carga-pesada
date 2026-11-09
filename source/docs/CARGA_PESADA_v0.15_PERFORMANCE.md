# Carga Pesada v0.15 — Perfil gráfico e redução de custo do HUD

- Adicionadas três opções de resolução do render 3D no menu de pausa: **Alta** (máximo DPR 1,7), **Equilibrada** (1,2) e **Econômica** (0,8). A opção é armazenada em `carga-pesada-graphics`, sem tocar na carreira `carga-pesada-v1`.
- O Canvas do velocímetro e do minimapa passa a redesenhar cerca de dez vezes por segundo, sem limitar a simulação fixa a 60 Hz, o tempo do frete, controles, câmera ou o restante do HUD. O início de cada missão força uma atualização imediata.
- A versão é informada no cabeçalho e no modo Canvas compatível.
- Novos testes verificam mapeamento de qualidade, dados inválidos e frequência de atualização do HUD.

## Limites

A mudança economiza comandos 2D e permite resolução mais leve; não constitui medição real de FPS em cada aparelho. A renderização WebGL e Canvas precisa de teste visual em diferentes GPUs e celulares. A fonte está neste pacote Vite; o repositório publicado inicialmente contém apenas o build, portanto a publicação de código-fonte ainda requer migrá-lo para o repositório.
