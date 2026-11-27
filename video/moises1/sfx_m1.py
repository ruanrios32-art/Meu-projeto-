# Dudu e Moisés 1: sincronia das bocas (amp-m1.json), efeitos (sfx-m1.wav) e música suave (musica-m1.wav)
import wave, json, numpy as np
SR=48000; FPS=30; rng=np.random.default_rng(5)
TJ=json.load(open('../../audio/moises1/tempos-moises1.json')); E=TJ['eventos']; DUR=E['total']
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
mapa={'Vo':'vo','Joquebede':'joquebede','Miria':'miria','Princesa':'princesa','Soldado':'soldado','Hebreu':'hebreu'}
amp={k:np.zeros(int(DUR*FPS)+1) for k in mapa.values()}
for f in TJ['falas']:
    if f['quem'] not in mapa: continue
    k=mapa[f['quem']]; x=ler(f"../../audio/moises1/falas/{f['n']}_{f['src']}.wav"); hop=SR//FPS
    for i in range(len(x)//hop):
        j=int(f['ini']*FPS)+i
        if j<len(amp[k]): amp[k][j]=np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))
json.dump({k:[round(float(v),3) for v in np.convolve(np.clip(a/0.12,0,1),[.25,.5,.25],'same')] for k,a in amp.items()},open('amp-m1.json','w'))
n=int(DUR*SR); out=np.zeros(n,np.float32); t=np.arange(n)/SR
def put(sig,at,g=1.0):
    i=int(at*SR); e=min(n,i+len(sig))
    if 0<=i<n: out[i:e]+=g*sig[:e-i]
def lp(x,al):
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=al*(x[i]-acc); y[i]=acc
    return y
def ruido(s): return rng.standard_normal(int(s*SR)).astype(np.float32)
def janela(a,b,f=0.6): return (np.clip((t-a)/f,0,1)*np.clip((b-t)/f,0,1)).astype(np.float32)
quarto=np.maximum(janela(0,E['egito']-0.3),janela(E['quarto2']-0.5,DUR+1)); egito=janela(E['egito']-0.2,E['casa']); casa=janela(E['casa'],E['rio']); rio=janela(E['rio'],E['quarto2']-0.4)
base=lp(ruido(DUR)[:n],0.08)
# quarto: chuva
out+=0.05*(base-lp(base,0.02))*quarto*3
for s in np.arange(0.5,DUR,0.9+rng.random()*0.5):
    if quarto[int(min(s,DUR-0.1)*SR)]>0.5: L=int(0.03*SR); put((rng.standard_normal(L)*np.exp(-np.arange(L)/(L/5))*0.3).astype(np.float32),s,0.15)
# página virando e Bíblia fechando
L=int(0.5*SR); put(lp(ruido(0.5),0.3)*np.sin(np.linspace(0,np.pi,L))**2,E['abre_biblia'],0.35)
L=int(0.2*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*90*tt)*np.exp(-tt/0.05)).astype(np.float32),E['fecha_biblia']+0.5,0.5)
# Egito: vento quente + batidas de tijolo + multidão ao longe
out+=0.05*lp(ruido(DUR)[:n],0.01)*egito*4
for s in np.arange(E['egito'],E['casa'],0.55+rng.random()*0.3):
    L=int(0.08*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*(120+rng.random()*60)*tt)*np.exp(-tt/0.02)+0.3*rng.standard_normal(L)*np.exp(-tt/0.01)).astype(np.float32),s+rng.random()*0.2,0.18)
out+=0.012*lp(ruido(DUR)[:n],0.05)*egito*(1+0.5*np.sin(2*np.pi*0.3*t))
# casa: grilos + chama + choro abafado do bebê
gr=(np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*28*t)>0.6)*(np.sin(2*np.pi*0.8*t)>0)).astype(np.float32); out+=0.01*gr*casa
def choro(dur,g=1.0):
    L=int(dur*SR); tt=np.arange(L)/SR; f0=430+90*np.sin(2*np.pi*1.7*tt)+40*np.sin(2*np.pi*7*tt); ph=2*np.pi*np.cumsum(f0)/SR
    s=np.sin(ph)+0.6*np.sin(2*ph)+0.35*np.sin(3*ph)+0.2*np.sin(4*ph); env=np.clip(np.sin(np.pi*(tt*1.7%1))*1.4,0,1)*np.minimum(1,(dur-tt)/0.2)
    return (lp((s*env).astype(np.float32),0.35)*g).astype(np.float32)
put(choro(2.4),E['casa']+0.9,0.12)
# rio: água + pássaros + choro do bebê ao abrir o cesto
out+=0.03*lp(ruido(DUR)[:n],0.03)*rio*(1+0.4*np.sin(2*np.pi*0.25*t))*3
for s in np.arange(E['rio'],E['quarto2'],1.3+rng.random()):
    for j in range(3):
        L=int(0.09*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*np.cumsum(2600+1800*tt/0.09)/SR)*np.sin(np.pi*tt/0.09)).astype(np.float32),s+j*0.12+rng.random()*0.3,0.04)
put(choro(3.2),E['cesto_aberto']+0.1,0.22)
out=np.clip(out,-1,1)
w=wave.open('sfx-m1.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
# música suave: acordes de cordas (pad) lentos
acordes=[[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7],[164.8,207.7,246.9]]
mus=np.zeros(n,np.float32); dur_ac=6.0
for i,s in enumerate(np.arange(0,DUR,dur_ac)):
    a=acordes[i%4]; L=int((dur_ac+2)*SR); tt=np.arange(L)/SR; env=np.minimum(1,tt/2.0)*np.minimum(1,np.maximum(0,(dur_ac+2-tt)/2.0))
    sig=sum((np.sin(2*np.pi*f*tt+0.3*np.sin(2*np.pi*0.2*tt))+0.3*np.sin(2*np.pi*2*f*tt)) for f in a)/len(a)
    i0=int(s*SR); e=min(n,i0+L); mus[i0:e]+=(sig*env)[:e-i0].astype(np.float32)
mus=lp(mus,0.15); mus/=np.abs(mus).max(); mus*=np.clip(t/3,0,1)*np.clip((DUR-t)/3,0,1)
w=wave.open('musica-m1.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mus*0.6*32767).astype(np.int16).tobytes()); w.close()
print('ok',DUR)
