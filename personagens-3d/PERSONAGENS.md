# Personagens 3D salvos (bonecos de blocos)

Modelo de cena com os bonecos, cenário, boca sincronizada com o áudio e câmera: `modelo-cena.html`
(função `boneco(cfg)`; cada personagem é um `cfg`). Render: `renderizar.py <inicio> <fim> <saida.mp4>`
lendo `../dados.json` (fps, envelope do áudio `env` e trechos de quem fala `segs`).

## Esquetes do perfil de historinhas (crédito ao criador original na legenda)

### "Loira do vestido verde" (quem contrata / patroa)  — `A` no modelo
- Pele clara (#e9b48f), cílios, boca rosada (#c4646a), sobrancelha loira escura.
- Cabelo loiro (#f2d58a, sombra #d9b45e), comprido até o peito, franja de lado (lado esquerdo).
- Vestido verde (#1f9a3a) de manga longa, saia até o joelho; sapato preto.
- Pose padrão: braços cruzados, pensativa/desconfiada; cabeça inclinando.

### "Morena do top vermelho" (a noiada)  — `B` no modelo
- Pele morena (#c98b62), sobrancelha escura, boca #9a4a48.
- Cabelo preto (#231812) curtinho tipo chanel com franja reta.
- Top tomara-que-caia vermelho (#d8344a) com elástico branco, barriga de fora, short rosa (#f2a7c3), tênis branco.
- Pose padrão: mão direita na cintura, mão esquerda gesticulando; gesto extra: mãos na cabeça (`GESTO_B`).

### Objetos
- Galinha branca de blocos (crista vermelha, bico amarelo) — aparece nas falas sobre a galinha.

### Cenário
- Rua de paralelepípedo, muro escuro à esquerda, casas coloridas do outro lado, postes, árvores, carros, céu azul.
