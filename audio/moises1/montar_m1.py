# Dudu e Moisés, Parte 1: corta as 34 falas, monta a trilha de voz, legendas e tempos dos eventos.
import subprocess, wave, json, numpy as np, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SR=48000
NORM="loudnorm=I=-18:TP=-2:LRA=11,aresample=48000"
GRITO="aecho=0.8:0.5:110|240:0.3|0.15"
# id, arquivo, ini, fim, efeito, quem, texto, intervalo antes
F=[
("01","vo",0.00,5.95,"","Vo","Dudu, hoje eu vou te contar a história de um bebê que o rei do Egito mandou matar.",0.6),
("02","dudu",0.00,1.63,"","Dudu","Mandou matar um bebê, vó?",0.5),
("03","vo",7.62,11.42,"","Vo","Êxodo, capítulo um. A história de Moisés.",0.9),
("04","vo",12.52,15.12,"","Vo","Fecha os olhos... e imagina comigo.",1.6),
("05","vo",16.60,22.58,"","Vo","O povo de Israel era escravo no Egito. Faziam tijolos de barro debaixo do sol.",3.4),
("06","soldado",0.00,3.63,GRITO,"Soldado","Mais rápido! O Faraó quer esses tijolos hoje!",0.4),
("07","hebreu",0.00,2.93,"","Hebreu","Abaixa a cabeça, menino. Senão eles te batem.",0.4),
("08","dudu",3.07,5.50,"","Dudu","Isso é... o Egito.",0.5),
("09","vo",23.30,30.75,"","Vo","Mas quanto mais eles sofriam, mais o povo crescia. E o Faraó ficou com medo.",0.6),
("10","soldado",4.65,9.84,GRITO,"Soldado","Ordem do Faraó! Todo menino hebreu que nascer, joguem no rio!",0.4),
("11","hebreu",3.96,6.30,"","Hebreu","Que Deus tenha misericórdia de nós.",0.5),
("12","vo",32.32,37.23,"","Vo","Uma mulher da tribo de Levi teve um filho. E viu que ele era bonito.",2.2),
("13","joquebede",0.00,2.65,"","Joquebede","Shhh... meu filho, por favor, não chora.",0.5),
("14","miria",0.00,2.34,"","Miria","Mãe! Os soldados tão passando na rua!",0.5),
("15","joquebede",5.07,9.74,"","Joquebede","Eu escondi você três meses... eu não consigo mais.",0.6),
("16","joquebede",11.00,15.81,"","Joquebede","Miriã, me ajuda com o cesto. Passa o piche nas beiradas.",0.6),
("17","joquebede",16.74,19.97,"","Joquebede","Deus, cuida dele.",2.4),
("18","joquebede",22.46,25.33,"","Joquebede","Fica aqui de longe, Miriã. Vê o que vai acontecer.",0.6),
("21","vo",38.84,42.90,"","Vo","Então a filha do Faraó desceu ao rio pra se banhar.",2.4),
("19","miria",3.07,3.81,"","Miria","Quem é você?",3.6),
("20","dudu",6.75,8.70,"","Dudu","Eu... só tô olhando também.",0.4),
("22","princesa",0.00,3.21,"","Princesa","O que é aquilo no meio dos juncos? Tragam pra mim.",1.0),
("23","princesa",3.99,6.01,"","Princesa","É um dos meninos dos hebreus.",2.6),
("24","dudu",10.59,11.95,"","Dudu","Ela vai mandar jogar no rio...",0.5),
("25","miria",4.51,7.41,"","Miria","Quer que eu chame uma mulher hebreia pra amamentar o menino?",1.8),
("26","princesa",6.72,7.03,"","Princesa","Vai.",0.4),
("27","princesa",8.10,11.74,"","Princesa","Leva este menino e cria pra mim. Eu te pagarei.",4.6),
("28","dudu",13.70,18.41,"","Dudu","A própria mãe... vai ser paga pra criar o filho dela.",1.4),
("29","vo",44.08,48.17,"","Vo","O menino cresceu, e ela o levou à filha do Faraó.",1.0),
("30","princesa",12.53,17.77,"","Princesa","O nome dele será Moisés... porque das águas eu o tirei.",2.4),
("31","dudu",20.23,23.08,"","Dudu","Moisés... é o Moisés.",0.6),
("32","dudu",24.87,28.30,"","Dudu","Vó... e depois? O que aconteceu com ele?",2.6),
("33","vo",49.52,51.57,"","Vo","Isso... fica pra amanhã.",0.6),
("34","vo",52.65,60.33,"","Vo","Mas lembra, Dudu: quando ninguém podia salvar aquele bebê, Deus já tinha um plano.",0.5),
]
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
clips=[]; fim=0
for n,src,a,b,fx,quem,txt,gap in F:
    out=f"falas/{n}_{src}.wav"
    if fx: fx+=",apad=pad_dur=0.4"
    pre=f"atrim={max(0,a-0.05)}:{b+0.12},asetpts=PTS-STARTPTS,afade=t=in:d=0.02"
    post="volume=-2dB" if src=="soldado" else ""
    chain=",".join(x for x in [pre,fx,NORM,post] if x)
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"brutos/{src}.wav","-af",chain,"-ac","1","-ar","48000",out],check=True)
    x=ler(out); d=len(x)/SR; ini=fim+gap
    clips.append(dict(n=n,quem=quem,txt=txt,ini=round(ini,3),dur=round(d,3),x=x,src=src)); fim=ini+d
c={k['n']:k for k in clips}; I=lambda n:c[n]['ini']; FIM=lambda n:c[n]['ini']+c[n]['dur']
ev={
 "abre_biblia":I("03")-0.3, "zoom_pagina":I("03")+0.2, "fecha_olhos":FIM("04")+0.1, "egito":FIM("04")+1.4,
 "casa":FIM("11")+0.9, "rio":FIM("16")+1.0,
 "empurra":FIM("18")+0.4, "para":I("21")+5.2,
 "cesto_sai":FIM("22")+0.2, "cesto_aberto":FIM("22")+1.6,
 "sai_miria":FIM("26")+0.2, "corte":FIM("26")+1.6, "volta":FIM("26")+2.2,
 "pega":FIM("27")+0.4, "vao":FIM("28")+0.2,
 "anos":FIM("29")+0.3, "fecha_olhos2":FIM("31")+0.3, "quarto2":FIM("31")+1.5,
 "fecha_biblia":I("33")-0.4,
 "cta":round(FIM("34")+0.8,2),
}
total=ev["cta"]+9.0; ev["total"]=round(total,2)
mix=np.zeros(int(total*SR),np.float32)
for k in clips:
    i=int(k['ini']*SR); mix[i:i+len(k['x'])]+=k['x']
pk=np.abs(mix).max(); mix=mix/pk*0.89 if pk>0.89 else mix
w=wave.open("trilha-voz-moises1.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
json.dump({"eventos":ev,"falas":[{k2:v2 for k2,v2 in k.items() if k2!='x'} for k in clips]},open("tempos-moises1.json","w"),ensure_ascii=False,indent=1)
for k in clips: print(f"{k['n']} {k['quem']:9s} {int(k['ini']//60)}:{k['ini']%60:05.2f} {k['dur']:.1f}s {k['txt'][:50]}")
print(json.dumps(ev))
