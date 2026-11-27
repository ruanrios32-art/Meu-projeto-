# Parte 2: corta as falas, aplica efeitos, monta a trilha de voz, legendas (SRT) e tempos dos eventos (JSON).
import subprocess, wave, json, numpy as np, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR=48000
NORM="loudnorm=I=-18:TP=-2:LRA=11,aresample=48000"
FONE="highpass=f=320,lowpass=f=3300,acompressor=threshold=0.1:ratio=3"
VOZ="asetrate=24000*0.944,aresample=24000"
VOZ_GRAVE="asetrate=24000*0.90,aresample=24000"
VIDRO="lowpass=f=2300,highpass=f=150,aecho=0.8:0.4:35|70:0.35|0.2"
LONGE="lowpass=f=4500,aecho=0.8:0.5:120|260:0.3|0.15"
# id, arquivo, ini, fim, efeito, quem (legenda), texto, regra de posição: ('abs',t) ou ('apos',gap)
F=[
("01","mae",0.00,3.51,FONE,"Mae","Eduardo. Não fala nada. Só escuta.",('abs',2.0)),
("02","mae",4.66,6.73,FONE,"Mae","Eu tô presa no depósito do mercado.",('apos',0.6)),
("03","mae",7.99,11.08,FONE,"Mae","Tem uma coisa aqui dentro... falando igual a mim.",('apos',0.6)),
("04","mae",12.04,14.80,FONE,"Mae","Se ela te chamar, não sou eu. Não confia em—",('apos',0.6)),
("05","dudu",0.00,1.53,"","Dudu","Mãe? Mãe!",('apos',2.0)),
("06","voz-mae",0.00,4.36,VOZ,"Voz","Eduardo? A ligação caiu, filho.",('apos',1.4)),
("07","dudu",2.40,5.07,"","Dudu","Não responde... não responde...",('apos',0.7)),
("08","dudu",6.56,8.86,"","Dudu","O flash. Cadê o flash...",('apos',0.8)),
("09","dudu",9.74,11.14,"","Dudu","Tá chegando mais perto.",('apos',2.6)),   # flash 1 antes
("10","voz-mae",5.42,7.70,VOZ_GRAVE,"Voz","Apaga essa luz, Eduardo.",('apos',2.3)),  # flash 2 antes
("11","biel",0.00,2.60,LONGE,"Biel","Dudu! Aqui! Corre pra luz!",('apos',1.6)),
("12","biel",4.15,6.79,"","Biel","Entra! Entra! Ela não chega perto da luz!",('apos',3.2)),  # corrida antes
("13","dudu",11.95,15.40,"","Dudu","Biel... ela tá com a voz da minha mãe.",('apos',1.0)),
("14","biel",8.40,11.71,"","Biel","Com a do meu pai também. Ele saiu faz duas horas.",('apos',0.6)),
("15","biel",12.98,17.05,"","Biel","Essa luz aguenta umas três horas. Depois...",('apos',0.6)),
("16","dudu",16.42,19.80,"","Dudu","Minha mãe tá viva, Biel. Tá no mercado.",('apos',0.6)),
("17","voz-biel",0.00,3.39,f"asetrate=24000*0.97,aresample=24000,{VIDRO}","VozBiel","Dudu! Abre aí! Sou eu, o Biel!",('apos',2.2)),  # batidas antes
("18","biel",18.63,20.65,"","Biel","Dudu... eu tô aqui.",('apos',1.8)),
("19","voz-biel",4.11,7.36,f"asetrate=24000*0.97,aresample=24000,{VIDRO}","VozBiel","Não acredita nele! Ele não pisca, Dudu! Olha o olho dele!",('apos',0.8)),
("20","dudu",20.80,23.02,"","Dudu","Qual de vocês... é o Biel?",('apos',1.0)),
]
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
clips=[]; fim=0
for n,src,a,b,fx,quem,txt,(modo,v) in F:
    out=f"falas/{n}_{src}.wav"
    corte_seco = n=="04"
    pre=f"atrim={max(0,a-0.05)}:{b+(0.0 if corte_seco else 0.12)},asetpts=PTS-STARTPTS,afade=t=in:d=0.02"
    if corte_seco: pre+=f",afade=t=out:st={b-a+0.05-0.015}:d=0.015"
    if "aecho" in fx: fx+=",apad=pad_dur=0.5"
    post={"LONGE":"volume=-3dB","VIDRO":"volume=-2dB"}.get("VIDRO" if fx.startswith("asetrate=24000*0.97") else ("LONGE" if "120|260" in fx else ""),"")
    if n=="06": post="volume=1dB"
    chain=",".join(x for x in [pre,fx,NORM,post] if x)
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"brutos/{src}.wav","-af",chain,"-ac","1","-ar","48000",out],check=True)
    x=ler(out); d=len(x)/SR
    ini = v if modo=='abs' else fim+v
    clips.append(dict(n=n,quem=quem,txt=txt,ini=round(ini,3),dur=round(d,3),x=x)); fim=ini+d
c={k['n']:k for k in clips}
ev={
 "atende":1.0,
 "morre":c["04"]["ini"]+c["04"]["dur"],
 "flash1":c["09"]["ini"]-1.4,
 "flash2":c["10"]["ini"]-1.2,
 "luz_loja":c["11"]["ini"]-0.8,
 "corre":c["11"]["ini"]+c["11"]["dur"]+0.1,
 "porta_fecha":c["12"]["ini"]+1.2,
 "batidas":c["17"]["ini"]-1.6,
 "batidas2":c["19"]["ini"]-0.5,
 "cta":round(c["20"]["ini"]+c["20"]["dur"]+0.8,2),
}
total=ev["cta"]+8.0; ev["total"]=round(total,2)
mix=np.zeros(int(total*SR),np.float32)
for k in clips:
    i=int(k['ini']*SR); mix[i:i+len(k['x'])]+=k['x']
pk=np.abs(mix).max(); mix=mix/pk*0.89 if pk>0.89 else mix
w=wave.open("trilha-voz-parte2.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
json.dump({"eventos":ev,"falas":[{k2:v2 for k2,v2 in k.items() if k2!='x'} for k in clips]},open("tempos-parte2.json","w"),ensure_ascii=False,indent=1)
def ts(s): return f"{int(s//3600):02d}:{int(s%3600//60):02d}:{s%60:06.3f}".replace('.',',')
srt=[]
for i,k in enumerate(clips):
    nx=clips[i+1]['ini'] if i+1<len(clips) else k['ini']+k['dur']+1
    srt.append(f"{i+1}\n{ts(k['ini'])} --> {ts(min(k['ini']+max(k['dur'],1.0),nx-0.05))}\n{k['txt']}\n")
open("../../roteiros/parte-2-legendas.srt","w").write("\n".join(srt))
for k in clips: print(f"{k['n']} {k['quem']:8s} {int(k['ini']//60)}:{k['ini']%60:05.2f}  {k['dur']:.1f}s  {k['txt']}")
print(json.dumps(ev))
