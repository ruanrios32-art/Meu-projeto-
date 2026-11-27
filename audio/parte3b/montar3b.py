# Parte 3 ("Eu Sou o Biel"): corta as falas, aplica efeitos, monta a trilha de voz ESTÉREO, legendas e tempos.
import subprocess, wave, json, numpy as np, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR=48000
def ler(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    return x, w.getframerate()
# a 2ª fala das mães saiu com pausas longas: junta os pedaços com pausas menores
x,sr=ler('brutos/maes.wav'); pedacos=[(6.43,8.17),(9.36,9.79),(10.96,12.28),(13.01,13.46)]
y=np.concatenate(sum([[x[int(a*sr):int(b*sr)],np.zeros(int(0.45*sr),np.float32)] for a,b in pedacos],[])[:-1])
w=wave.open('brutos/maes_e2.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((y*32767).astype(np.int16).tobytes()); w.close()

NORM="loudnorm=I=-18:TP=-2:LRA=11,aresample=48000"
VIDRO="lowpass=f=2300,highpass=f=150,aecho=0.8:0.4:35|70:0.35|0.2"
FALSO="asetrate=24000*0.97,aresample=24000"
GRITO="asetrate=24000*0.93,aresample=24000,acrusher=bits=10:mix=0.35:mode=log,aecho=0.8:0.3:60:0.3"
MONSTRO="asetrate=24000*0.82,aresample=24000,aecho=0.8:0.55:90|180:0.35|0.2"
VOZ="asetrate=24000*0.944,aresample=24000,aecho=0.8:0.5:120|260:0.3|0.15"
# id, arquivo, ini, fim, efeito, quem, texto, posição, pan (-1 esq .. 1 dir)
F=[
("01","falso-biel",0.00,2.30,FALSO,"Falso","Dudu. Não abre essa porta.",('abs',0.5),0),
("02","biel",0.00,1.90,VIDRO,"BielEscuro","Abre, Dudu! Por favor!",('apos',0.4),0),
("03","biel",3.28,4.80,"","Biel","Fecha! Fecha a porta!",('apos',1.3),0),
("04","biel",6.04,7.80,"","Biel","Dudu... quem é esse?",('apos',0.9),0),
("05","falso-biel",3.99,6.50,FALSO,"Falso","Eu que pergunto. Eu sou o Biel.",('apos',0.5),0),
("06","biel",8.69,10.66,"","Biel","Mentira! Eu sou o Biel!",('apos',0.3),0),
("07","falso-biel",8.69,12.18,FALSO,"Falso","Não escuta ele, Dudu. Ele é a coisa lá de fora.",('apos',0.4),0),
("08","dudu",0.00,1.65,"","Dudu","Para! Para os dois!",('apos',0.4),0),
("09","dudu",4.17,5.99,"","Dudu","Qual foi a última foto que eu tirei de você?",('apos',0.6),0),
("10","biel",11.07,14.95,"","Biel","Na laje, no teu aniversário! Eu caí da cadeira!",('apos',0.4),0),
("11","falso-biel",13.66,16.41,FALSO,"Falso","Foi... foi... foi...",('apos',0.9),0),
("12","falso-biel",17.16,18.61,GRITO,"Falso","EU SOU O BIEL!",('apos',0.3),0),
("13","monstro",0.00,4.88,MONSTRO,"Monstro","Vocês deviam ter ficado aqui dentro.",('apos',3.2),0),
("14","biel",15.76,16.95,"","Biel","Os fundos! Corre!",('apos',0.4),0),
("15","dudu",8.50,11.13,"","Dudu","Mãe?... Mãe?",('apos',10.6),0),
("16","maes",0.00,3.48,VOZ,"Voz","Eduardo! Aqui! No depósito!",('apos',0.8),-0.75),
("17","maes_e2",0.00,99,VOZ,"Voz","Dudu, filho... vem cá. Sou eu.",('apos',0.9),0.75),
("18","biel",18.09,20.14,"","Biel","Dudu... são duas.",('apos',0.6),0),
("19","monstro",6.04,10.54,MONSTRO,"Monstro","Agora não adianta mais se esconder.",('apos',1.2),0),
]
clips=[]; fim=0
for n,src,a,b,fx,quem,txt,(modo,v),pan in F:
    out=f"falas/{n}_{src}.wav"
    if "aecho" in fx: fx+=",apad=pad_dur=0.5"
    post="volume=-2dB" if fx.startswith("lowpass=f=2300") else ("volume=2dB" if src=="monstro" else ("volume=-3dB" if src.startswith("maes") else ""))
    pre=f"atrim={max(0,a-0.05)}:{b+0.12},asetpts=PTS-STARTPTS,afade=t=in:d=0.02"
    chain=",".join(x for x in [pre,fx,NORM,post] if x)
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"brutos/{src}.wav","-af",chain,"-ac","1","-ar","48000",out],check=True)
    x,_=ler(out); d=len(x)/SR; ini=v if modo=='abs' else fim+v
    clips.append(dict(n=n,quem=quem,txt=txt,ini=round(ini,3),dur=round(d,3),x=x,pan=pan)); fim=ini+d
c={k['n']:k for k in clips}; FIM=lambda n:c[n]['ini']+c[n]['dur']
ev={
 "abre":FIM("02")+0.25, "entra":FIM("02")+0.7, "fecha":c["03"]["ini"]+c["03"]["dur"]+0.2,
 "pisca":c["11"]["ini"], "transf0":c["12"]["ini"], "transf1":FIM("12")+2.9,
 "corre":c["14"]["ini"], "flash":FIM("14")+1.0, "corte":FIM("14")+1.5, "rua0":FIM("14")+1.8, "rua1":FIM("14")+8.8, "deposito":FIM("14")+9.4,
 "olhos":c["19"]["ini"]-0.6, "cta":round(FIM("19")+0.8,2),
}
total=ev["cta"]+8.0; ev["total"]=round(total,2)
mix=np.zeros((int(total*SR),2),np.float32)
for k in clips:
    i=int(k['ini']*SR); g=np.array([min(1,1-k['pan']),min(1,1+k['pan'])],np.float32)
    mix[i:i+len(k['x'])]+=k['x'][:,None]*g[None,:]
pk=np.abs(mix).max(); mix=mix/pk*0.89 if pk>0.89 else mix
w=wave.open("trilha-voz-parte3.wav","wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
json.dump({"eventos":ev,"falas":[{k2:v2 for k2,v2 in k.items() if k2 not in('x',)} for k in clips]},open("tempos-parte3.json","w"),ensure_ascii=False,indent=1)
def ts(s): return f"{int(s//3600):02d}:{int(s%3600//60):02d}:{s%60:06.3f}".replace('.',',')
srt=[]
for i,k in enumerate(clips):
    nx=clips[i+1]['ini'] if i+1<len(clips) else k['ini']+k['dur']+1
    srt.append(f"{i+1}\n{ts(k['ini'])} --> {ts(min(k['ini']+max(k['dur'],1.0),nx-0.05))}\n{k['txt']}\n")
open("../../roteiros/parte-3-eu-sou-o-biel-legendas.srt","w").write("\n".join(srt))
for k in clips: print(f"{k['n']} {k['quem']:10s} {int(k['ini']//60)}:{k['ini']%60:05.2f} {k['dur']:.1f}s {k['txt']}")
print(json.dumps(ev))
