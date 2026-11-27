# Monta o vídeo da Parte 3: quadros + olho de peixe + @ + legendas coloridas + voz + efeitos + música.
import json, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
TJ = json.load(open('../../audio/parte3/tempos-parte3.json')); E = TJ['eventos']; DUR = E['total']
def ass_t(s): return f"{int(s//3600)}:{int(s%3600//60):02d}:{s%60:05.2f}"
estilos = """[Script Info]
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Dudu,Inter ExtraBold,40,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Mae,Inter ExtraBold,40,&H00FFA7C9,&H00FFA7C9,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Voz,Inter ExtraBold,40,&H00FFA7C9,&H00FFA7C9,&H00000000,&H96000000,0,1,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Biel,Inter ExtraBold,40,&H003C9AFF,&H003C9AFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: BielEscuro,Inter ExtraBold,40,&H003C9AFF,&H003C9AFF,&H00000000,&H96000000,0,1,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Falso,Inter ExtraBold,40,&H003C9AFF,&H003C9AFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: VozBiel,Inter ExtraBold,40,&H003C9AFF,&H003C9AFF,&H00000000,&H96000000,0,1,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Selo,Inter Black,34,&H00FFFFFF,&H00FFFFFF,&H002828C6,&H002828C6,0,0,0,0,100,100,1,0,3,10,0,8,0,0,120,1
Style: Titulo,Inter Black,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,2,0,1,6,3,8,0,0,185,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,0:00:00.00,0:00:02.80,Selo,,0,0,0,,{\\fad(150,350)}PARTE 3
Dialogue: 1,0:00:00.00,0:00:02.80,Titulo,,0,0,0,,{\\fad(150,350)}O QUE NÃO PISCA
"""
F = TJ['falas']; linhas = []
for i, f in enumerate(F):
    nx = F[i + 1]['ini'] if i + 1 < len(F) else f['ini'] + f['dur'] + 1
    fim = min(f['ini'] + max(f['dur'], 1.0), nx - 0.05)
    linhas.append(f"Dialogue: 0,{ass_t(f['ini'])},{ass_t(fim)},{f['quem']},,0,0,0,,{f['txt']}")
open('legendas3.ass', 'w').write(estilos + '\n'.join(linhas) + '\n')
vf = ("lenscorrection=k1=0.22:k2=0.04,crop=iw*0.85:ih*0.85,scale=720:1280,vignette=PI/4.2,noise=alls=5:allf=t,"
      "drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf:text='@dudu.aventuras_':"
      "fontsize=28:fontcolor=white@0.32:borderw=2:bordercolor=black@0.25:x=(w-tw)/2-115:y=h*0.785,"
      f"ass=legendas3.ass,fade=t=out:st={DUR-0.7}:d=0.7")
MUS_INI = 45.0   # outro trecho da música
cmd = ['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', 'frames3d/f_%04d.jpg',
       '-i', '../../audio/parte3/trilha-voz-parte3.wav', '-i', 'sfx3.wav', '-stream_loop', '-1', '-i', '../../audio/musica/musica-fundo.wav',
       '-filter_complex',
       f'[0:v]{vf}[v];'
       f'[1:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[va][vk];'
       f'[2:a]volume=0.9,aformat=sample_rates=48000:channel_layouts=stereo[sa];'
       f'[3:a]atrim={MUS_INI}:{MUS_INI+DUR},asetpts=PTS-STARTPTS,loudnorm=I=-33:TP=-9:LRA=7,aresample=48000,aformat=sample_rates=48000:channel_layouts=stereo,'
       f'afade=t=in:d=2.5,afade=t=out:st={DUR-3}:d=3[m0];'
       f'[m0][vk]sidechaincompress=threshold=0.02:ratio=4:attack=40:release=700[mu];'
       f'[va][sa][mu]amix=inputs=3:normalize=0,afade=t=out:st={DUR-0.8}:d=0.8[a]',
       '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
       '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', str(DUR), '-movflags', '+faststart',
       'nao-responde-parte3-final.mp4']
subprocess.run(cmd, check=True)
print('ok: nao-responde-parte3-final.mp4')
