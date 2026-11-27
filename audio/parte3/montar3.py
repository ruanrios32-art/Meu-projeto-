# Parte 3: corta as falas, aplica efeitos, monta a trilha de voz, legendas (SRT) e tempos dos eventos (JSON).
import subprocess, wave, json, numpy as np, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR=48000
NORM="loudnorm=I=-18:TP=-2:LRA=11,aresample=48000"
FONE="highpass=f=320,lowpass=f=3300,acompressor=threshold=0.1:ratio=3"
VOZ="asetrate=24000*0.944,aresample=24000"
VOZ_GRAVE="asetrate=24000*0.90,aresample=24000"
VIDRO="lowpass=f=2300,highpass=f=150,aecho=0.8:0.4:35|70:0.35|0.2"
FALSO="asetrate=24000*0.97,aresample=24000"
LONGE="lowpass=f=4500,aecho=0.8:0.5:120|260:0.3|0.15"
# id, arquivo, ini, fim, efeito, quem (legenda), texto, regra de posição: ('abs',t) ou ('apos',gap)
F=[
("01","falso-biel",0.00,2.49,FALSO,"Falso","Dudu. Não abre essa porta.",('abs',0.5)),
("02","biel",0.00,3.02,VIDRO,"BielEscuro","Dudu, pelo amor de Deus, abre! Ela tá aqui atrás!",('apos',0.4)),
("03","dudu",0.00,0.99,"","Dudu","Desculpa, Biel.",('apos',0.4)),
("04","biel",4.55,5.68,"","Biel","Fecha! Fecha a porta!",('apos',1.4)),
("05","biel",7.06,8.82,"","Biel","Dudu... quem é esse?",('apos',1.0)),
("06","falso-biel",3.55,4.47,FALSO,"Falso","Eu sou o Biel.",('apos',0.7)),
("07","falso-biel",5.74,7.76,FALSO,"Falso","Eu respondi quando meu pai me chamou.",('apos',0.6)),
("08","falso-biel",9.37,11.18,FALSO,"Falso","Agora eu fico no lugar dele.",('apos',0.6)),
("09","dudu",1.81,3.49,"","Dudu","Biel, sai de perto dele!",('apos',0.7)),
("10","biel",9.83,11.83,"","Biel","Para! Não fala meu nome!",('apos',1.3)),
("11","biel",13.02,15.89,"","Biel","Toda vez que alguém fala... ele chega mais perto.",('apos',0.5)),
("12","falso-biel",12.53,14.16,FALSO,"Falso","Fala de novo, Dudu.",('apos',0.7)),
("13","dudu",4.91,6.01,"","Dudu","A luz tá acabando...",('apos',1.4)),
("14","biel",17.20,20.41,"","Biel","O mercado é a duas quadras. Tua mãe tá lá?",('apos',0.6)),
("15","dudu",7.05,9.29,"","Dudu","Tá. Trancada no depósito.",('apos',0.5)),
("16","voz-mae",0.00,5.15,f"{VOZ},{LONGE}","Voz","Eduardo... vem. Eu tô te esperando.",('apos',0.9)),
("17","falso-biel",15.37,17.62,"","Falso","Ela também respondeu, Dudu.",('apos',1.2)),
]
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
clips=[]; fim=0
for n,src,a,b,fx,quem,txt,(modo,v) in F:
    out=f"falas/{n}_{src}.wav"
    corte_seco = False
    pre=f"atrim={max(0,a-0.05)}:{b+(0.0 if corte_seco else 0.12)},asetpts=PTS-STARTPTS,afade=t=in:d=0.02"
    if corte_seco: pre+=f",afade=t=out:st={b-a+0.05-0.015}:d=0.015"
    if "aecho" in fx: fx+=",apad=pad_dur=0.5"
    post="volume=-2dB" if fx==VIDRO+",apad=pad_dur=0.5" else ("volume=-4dB" if "120|260" in fx else "")
    if n=="17": post="volume=2dB"
    chain=",".join(x for x in [pre,fx,NORM,post] if x)
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"brutos/{src}.wav","-af",chain,"-ac","1","-ar","48000",out],check=True)
    x=ler(out); d=len(x)/SR
    ini = v if modo=='abs' else fim+v
    clips.append(dict(n=n,quem=quem,txt=txt,ini=round(ini,3),dur=round(d,3),x=x)); fim=ini+d
c={k['n']:k for k in clips}
ev={
 "abre":c["03"]["ini"]+c["03"]["dur"]+0.15,
 "entra":c["04"]["ini"]-0.7,
 "fecha":c["04"]["ini"]+c["04"]["dur"]+0.2,
 "passo1":c["03"]["ini"]+c["03"]["dur"]+0.05,
 "passo2":c["09"]["ini"]+c["09"]["dur"]+0.15,
 "passo3":c["12"]["ini"]-0.35,
 "falha":c["13"]["ini"]-0.8,
 "colado":c["17"]["ini"]-0.45,
 "cta":round(c["17"]["ini"]+c["17"]["dur"]+1.0,2),
}
total=ev["cta"]+8.0; ev["total"]=round(total,2)
mix=np.zeros(int(total*SR),np.float32)
for k in clips:
    i=int(k['ini']*SR); mix[i:i+len(k['x'])]+=k['x']
pk=np.abs(mix).max(); mix=mix/pk*0.89 if pk>0.89 else mix
w=wave.open("trilha-voz-parte3.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
json.dump({"eventos":ev,"falas":[{k2:v2 for k2,v2 in k.items() if k2!='x'} for k in clips]},open("tempos-parte3.json","w"),ensure_ascii=False,indent=1)
def ts(s): return f"{int(s//3600):02d}:{int(s%3600//60):02d}:{s%60:06.3f}".replace('.',',')
srt=[]
for i,k in enumerate(clips):
    nx=clips[i+1]['ini'] if i+1<len(clips) else k['ini']+k['dur']+1
    srt.append(f"{i+1}\n{ts(k['ini'])} --> {ts(min(k['ini']+max(k['dur'],1.0),nx-0.05))}\n{k['txt']}\n")
open("../../roteiros/parte-3-legendas.srt","w").write("\n".join(srt))
for k in clips: print(f"{k['n']} {k['quem']:8s} {int(k['ini']//60)}:{k['ini']%60:05.2f}  {k['dur']:.1f}s  {k['txt']}")
print(json.dumps(ev))
