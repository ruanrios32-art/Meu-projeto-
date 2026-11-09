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

## Esquete "Fizeram uma brincadeira com você na rua" (ponto de ônibus) — `modelo-cena-ponto-onibus.html`

### "Moça do cropped" — `C`
- Pele #d9a37e, cílios, boca #b85a5e; expressão chorosa/irritada (sobrancelha alta).
- Cabelo castanho (#5a3a26, pontas #7a5638) comprido até a cintura, franja.
- Cropped creme (#f1e3cc) com cordão, barriga de fora, saia preta (#161616), alça de bolsa marrom, sapato preto.
- Poses: olhos tapados tateando com as mãos; mão na cintura + braço gesticulando.

### "Mendigo da peruca" — `D`
- Pele #c58a63; peruca enorme bagunçada (#2a1a10/#3a2616), bigodão preto falso.
- Camiseta branca com listras cinza, short preto, tênis branco.
- Poses: atrás dela tapando os olhos; depois pula na frente e fala agitado, braços abertos, balançando.

### Cenário
- Ponto de ônibus de vidro (estrutura metálica, banco, placa azul), calçada clara, avenida com faixa, árvores e prédios ao fundo.

## Esquete "Você foi fazer um saque no banco" — `modelo-cena-banco.html`

### "Moça do cabelo vermelho" — `E`
- Pele #c98e66, cílios, boca #a8484e.
- Cabelo vermelho (#c8282e / #a81e24) chanel até o queixo, franja de lado.
- Corpete amarelo (#f6e04a) com costuras e alcinhas, barriga de fora, short jeans (#4b6fa3), bolsa marrom no ombro esquerdo.
- Poses: braços cruzados segurando a bolsa (desconfiada); mão na cintura; apontando o dedo; ameaçando tapa (`gestos` em dados.json).

### "Pedinte de barba" — `F`
- Pele #c48a64; cabelo cacheado escuro, barba cheia, bigode, óculos.
- Camiseta preta comprida, short preto, tênis preto.
- Poses: braços cruzados; gesticula com os dois braços quando fala.

### Cenário
- Fachada de banco genérica (letreiro "BANCO" azul com filete amarelo, porta de vidro com moldura azul, caixa eletrônico), calçada de blocos cinza.
