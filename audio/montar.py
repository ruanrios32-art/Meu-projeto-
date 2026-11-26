import subprocess, wave, numpy as np, os
B='brutos/'; SR=48000
NORM="loudnorm=I=-18:TP=-2:LRA=11,aresample=48000"
VOZ="asetrate=24000*0.944,aresample=24000"           # ~1 semitom abaixo e ~6% mais lenta
ECO="aecho=0.8:0.55:140|300:0.30|0.18"
LONGE="highpass=f=300,lowpass=f=3200,aecho=0.8:0.7:180|380:0.45|0.28,volume=1dB"
# nº, arquivo, inicio, fim, filtro_extra, nome, personagem, texto, inicio_desejado
falas=[
("01","dudu",0.00,3.69,"","dudu","Dudu","Apagou tudo... e a minha mãe não atende.",1.0),
("02","dudu",4.71,6.36,"","dudu","Dudu","Até os cachorros pararam.",6.0),
("03","dona-cida",0.00,3.11,"","cida","Dona Cida","Psiu! Menino! Sai do meio da rua!",9.0),
("04","dudu",7.43,12.24,"","dudu","Dudu","Dona Cida? A senhora viu minha mãe?",12.0),
("05","dona-cida",3.74,9.39,"","cida","Dona Cida","Escuta bem. Se chamarem teu nome... não responde.",15.0),
("06","dudu",13.35,14.86,"","dudu","Dudu","Como assim, não responde?",19.0),
("07","dona-cida",10.07,14.14,"","cida","Dona Cida","O Juninho respondeu. Faz uma hora.",21.0),
("08","dudu",16.34,19.15,"","dudu","Dudu","Tá. Normal. Super normal.",24.0),
("09","a-voz",0.00,3.37,f"{VOZ},{ECO}","voz","A Voz","Dudu? Dudu, é a mãe...",48.0),
("10","dudu",20.19,20.42,"afade=t=out:st=0.17:d=0.06","dudu","Dudu","Mã—",0),
("11","dona-cida",14.75,16.72,LONGE,"cida","Dona Cida","NÃO RESPONDE!",0),
("12","a-voz",4.78,8.71,f"{VOZ},{ECO}","voz","A Voz","Filho... por que cê não fala comigo?",0),
("13","dudu",21.88,26.95,"","dudu","Dudu","Numa hora dessas... ela me chamaria de Eduardo.",0),
("15","a-voz",9.94,13.31,f"{VOZ},volume=2dB","voz","A Voz","Eduardo... atende, vai.",0),
("16","dudu",27.67,32.51,"","dudu","Dudu","Se ela tá ligando... quem tá ali na esquina?",0),
]
GAP={"10":0.6,"11":0.35,"12":0.8,"13":0.7,"15":2.6,"16":0.6}  # 15: espaço para o toque do celular (14)
def ler(p):
    w=wave.open(p); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; return a
clips=[]; t_end=0
for n,src,a,b,fx,nome,pers,txt,want in falas:
    out=f"falas/{n}_{nome}.wav"
    pre=f"atrim={max(0,a-0.05)}:{b+0.12},asetpts=PTS-STARTPTS,afade=t=in:d=0.02"
    chain=",".join(x for x in [pre,fx,NORM] if x)
    if "11"==n: chain=",".join([pre,"loudnorm=I=-18:TP=-2,aresample=48000",LONGE])
    if fx and "aecho" in fx: chain+=",apad=pad_dur=0.6"
    subprocess.run(["ffmpeg","-v","error","-y","-i",B+src+".wav","-af",chain,"-ac","1","-ar","48000",out],check=True)
    x=ler(out); dur=len(x)/SR
    start = want if want else t_end+GAP[n]
    start=max(start,t_end+0.5) if n!="11" else start
    clips.append((n,pers,txt,start,dur,x)); t_end=start+dur
total=t_end+9.0   # tela final + respiro
mix=np.zeros(int(total*SR),np.float32)
for n,p,t,s,d,x in clips:
    i=int(s*SR); mix[i:i+len(x)]+=x
pk=np.abs(mix).max(); mix=mix/pk*0.89 if pk>0.89 else mix
w=wave.open("trilha-voz-parte1.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
def ts(s): h=int(s//3600); m=int(s%3600//60); return f"{h:02d}:{m:02d}:{s%60:06.3f}".replace('.',',')
srt=[]; rows=[]
for k,(n,p,t,s,d,x) in enumerate(clips,1):
    nxt=clips[k][3] if k<len(clips) else s+d+1
    e=min(s+max(d,1.0), nxt-0.05)
    srt.append(f"{k}\n{ts(s)} --> {ts(e)}\n{t}\n")
    rows.append(f"| {n} | {p} | {int(s//60)}:{s%60:04.1f} | {d:.1f} s | {t} |")
open("../roteiros/parte-1-legendas.srt","w").write("\n".join(srt))
print(f"total {total:.1f}s"); print("\n".join(rows))
