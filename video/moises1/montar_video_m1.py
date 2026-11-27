# Monta o vídeo "Dudu e Moisés - Parte 1": quadros + olho de peixe + @ + legendas + voz + efeitos + música suave.
import json, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
TJ = json.load(open('../../audio/moises1/tempos-moises1.json')); E = TJ['eventos']; DUR = E['total']
def ass_t(s): return f"{int(s//3600)}:{int(s%3600//60):02d}:{s%60:05.2f}"
st = lambda nome, cor, it=0: f"Style: {nome},Inter ExtraBold,40,{cor},{cor},&H00000000,&H96000000,0,{it},0,0,100,100,0,0,1,4,2,2,50,50,380,1"
estilos = "\n".join(["[Script Info]","ScriptType: v4.00+","PlayResX: 720","PlayResY: 1280","WrapStyle: 0","",
 "[V4+ Styles]","Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
 st("Vo","&H004DD8FF"), st("Dudu","&H00FFFFFF"), st("Joquebede","&H00FFA7C9"), st("Miria","&H003C9AFF"), st("Princesa","&H0058D5F5"),
 st("Soldado","&H004D4DFF"), st("Hebreu","&H00FFD38F"),
 "Style: Selo,Inter Black,30,&H00FFFFFF,&H00FFFFFF,&H001F1F7A,&H001F1F7A,0,0,0,0,100,100,1,0,3,10,0,8,0,0,120,1",
 "Style: Titulo,Inter Black,58,&H004EBFE8,&H004EBFE8,&H00000000,&H64000000,0,0,0,0,100,100,2,0,1,6,3,8,0,0,180,1",
 "","[Events]","Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
 "Dialogue: 1,0:00:00.00,0:00:03.20,Selo,,0,0,0,,{\\fad(200,400)}DUDU E MOISÉS · PARTE 1",
 "Dialogue: 1,0:00:00.00,0:00:03.20,Titulo,,0,0,0,,{\\fad(200,400)}O CESTO NO RIO"])
F = TJ['falas']; L = []
for i, f in enumerate(F):
    nx = F[i+1]['ini'] if i+1 < len(F) else f['ini']+f['dur']+1
    L.append(f"Dialogue: 0,{ass_t(f['ini'])},{ass_t(min(f['ini']+max(f['dur'],1.0),nx-0.05))},{f['quem']},,0,0,0,,{f['txt']}")
open('legendas-m1.ass','w').write(estilos+"\n"+"\n".join(L)+"\n")
vf = ("lenscorrection=k1=0.16:k2=0.03,crop=iw*0.88:ih*0.88,scale=720:1280,vignette=PI/4.6,noise=alls=4:allf=t,"
      "drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf:text='@dudu.aventuras_':"
      "fontsize=28:fontcolor=white@0.32:borderw=2:bordercolor=black@0.25:x=(w-tw)/2-115:y=h*0.785,"
      f"ass=legendas-m1.ass,fade=t=in:d=0.4,fade=t=out:st={DUR-0.8}:d=0.8")
cmd = ['ffmpeg','-v','error','-y','-framerate','30','-i','frames3d/f_%04d.jpg',
       '-i','../../audio/moises1/trilha-voz-moises1.wav','-i','sfx-m1.wav','-i','musica-m1.wav',
       '-filter_complex',
       f'[0:v]{vf}[v];'
       f'[1:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[va][vk];'
       f'[2:a]volume=0.9,aformat=sample_rates=48000:channel_layouts=stereo[sa];'
       f'[3:a]atrim=0:{DUR},loudnorm=I=-30:TP=-8:LRA=7,aresample=48000,aformat=sample_rates=48000:channel_layouts=stereo[m0];'
       f'[m0][vk]sidechaincompress=threshold=0.02:ratio=3:attack=60:release=800[mu];'
       f'[va][sa][mu]amix=inputs=3:normalize=0,afade=t=out:st={DUR-1}:d=1[a]',
       '-map','[v]','-map','[a]','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',
       '-t',str(DUR),'-movflags','+faststart','dudu-e-moises-parte1.mp4']
subprocess.run(cmd, check=True); print('ok: dudu-e-moises-parte1.mp4')
