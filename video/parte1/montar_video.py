# Monta a prévia: legendas coloridas (ASS) + quadros + olho de peixe + voz + efeitos.
# Uso: python3 montar_video.py   (antes: python3 sfx.py e node render.js frames)
import re, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
DUR = 27.0
srt = open('../../roteiros/parte-1-legendas.srt').read()
blocos = re.findall(r'\d+\n(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\n(.+?)(?:\n\n|\n?$)', srt, re.S)
quem = ['Dudu', 'Dudu', 'Cida', 'Dudu', 'Cida', 'Dudu', 'Cida', 'Dudu', 'Voz', 'Dudu', 'Cida', 'Voz', 'Dudu', 'Voz', 'Dudu']
def ass_t(s):  # 00:00:09,000 -> 0:00:09.00
    h, m, r = s.split(':'); sec, ms = r.split(','); return f"{int(h)}:{m}:{sec}.{ms[:2]}"
def seg(s):
    h, m, r = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(r.replace(',', '.'))
# cores em formato ASS (&HAABBGGRR)
estilos = """[Script Info]
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Dudu,Inter ExtraBold,40,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Cida,Inter ExtraBold,40,&H004DD8FF,&H004DD8FF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Voz,Inter ExtraBold,40,&H00FFA7C9,&H00FFA7C9,&H00000000,&H96000000,0,1,0,0,100,100,0,0,1,4,2,2,50,50,380,1
Style: Selo,Inter Black,34,&H00FFFFFF,&H00FFFFFF,&H002828C6,&H002828C6,0,0,0,0,100,100,1,0,3,10,0,8,0,0,120,1
Style: Titulo,Inter Black,78,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,2,0,1,6,3,8,0,0,185,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,0:00:00.00,0:00:02.40,Selo,,0,0,0,,{\\fad(150,350)}PARTE 1
Dialogue: 1,0:00:00.00,0:00:02.40,Titulo,,0,0,0,,{\\fad(150,350)}O APAGÃO
"""
linhas = []
for (a, b, txt), w in zip(blocos, quem):
    if seg(a) >= DUR: break
    linhas.append(f"Dialogue: 0,{ass_t(a)},{ass_t(b)},{w},,0,0,0,,{txt.strip().replace(chr(10), '\\N')}")
open('legendas.ass', 'w').write(estilos + '\n'.join(linhas) + '\n')

vf = ("lenscorrection=k1=0.16:k2=0.03,crop=iw*0.88:ih*0.88,scale=720:1280,"
      "vignette=PI/4.2,noise=alls=5:allf=t,"
      "ass=legendas.ass,fade=t=out:st=26.3:d=0.7")
cmd = ['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', 'frames/f_%04d.jpg',
       '-i', '../../audio/trilha-voz-parte1.wav', '-i', 'sfx.wav',
       '-filter_complex',
       f'[0:v]{vf}[v];[1:a]atrim=0:{DUR},asetpts=PTS-STARTPTS[va];[2:a]volume=0.9[sa];'
       f'[va][sa]amix=inputs=2:normalize=0,afade=t=out:st=26.3:d=0.7[a]',
       '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
       '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', str(DUR), '-movflags', '+faststart',
       'previa-parte1-0a27s.mp4']
subprocess.run(cmd, check=True)
print('ok: previa-parte1-0a27s.mp4')
