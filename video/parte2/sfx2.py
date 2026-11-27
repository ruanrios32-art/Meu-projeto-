# Parte 2: sincronia da boca do Biel (amp2.json) + efeitos sonoros (sfx2.wav)
import wave, json, numpy as np
SR=48000; FPS=30; rng=np.random.default_rng(11)
TJ=json.load(open('../../audio/parte2/tempos-parte2.json')); E=TJ['eventos']; DUR=E['total']
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
a=np.zeros(int(DUR*FPS)+1)
for f in TJ['falas']:
    if f['quem']!='Biel': continue
    x=ler(f"../../audio/parte2/falas/{f['n']}_biel.wav"); hop=SR//FPS
    for i in range(len(x)//hop):
        k=int(f['ini']*FPS)+i
        if k<len(a): a[k]=np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))
a=np.convolve(np.clip(a/0.12,0,1),[.25,.5,.25],'same')
json.dump({"biel":[round(float(v),3) for v in a],"cida":[]},open('amp2.json','w'))

n=int(DUR*SR); out=np.zeros(n,np.float32); t=np.arange(n)/SR
def put(sig,at,g=1.0):
    i=int(at*SR); e=min(n,i+len(sig))
    if i<n: out[i:e]+=g*sig[:e-i]
def lp(x,al):
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=al*(x[i]-acc); y[i]=acc
    return y
def ruido(sec): return rng.standard_normal(int(sec*SR)).astype(np.float32)
def clique(d=0.006): L=int(d*SR); return (rng.standard_normal(L)*np.exp(-np.arange(L)/(L/4))).astype(np.float32)
# vento (contínuo, mais baixo no escuro e dentro da loja)
wind=np.cumsum(rng.standard_normal(n)).astype(np.float32); wind-=np.convolve(wind,np.ones(4801)/4801,'same'); wind/=np.abs(wind).max()
wenv=np.where(t<E['morre'],1.0,0.55); wenv=np.where(t>E['porta_fecha'],0.25,wenv)
out+=0.05*wind*wenv*(0.6+0.4*np.sin(2*np.pi*t/7.3))
# atender: clique
put(clique(.005),E['atende'],0.35)
# toque do celular (continua da Parte 1) até ele atender
def vib(dur):
    L=int(dur*SR); tt=np.arange(L)/SR; x=np.sign(np.sin(2*np.pi*165*tt))*0.5+0.5*np.sin(2*np.pi*330*tt)
    return lp(x.astype(np.float32),0.12)*np.minimum(1,tt/0.01)*np.minimum(1,(dur-tt)/0.01)
for st in np.arange(0.0,E['atende']-0.2,1.0):
    for j,f in enumerate([784,988,1175,988]):
        L=int(0.35*SR); tt=np.arange(L)/SR; tone=((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt/0.12)).astype(np.float32)
        if st+j*0.16<E['atende']-0.05: put(tone,st+j*0.16,0.09)
    put(vib(0.6),st,0.15)
# chiado de telefone durante a ligação
k=(t>1.9)&(t<E['morre']); out[k]+=0.012*rng.standard_normal(k.sum()).astype(np.float32)
# celular morre: bip descendente e silêncio
L=int(0.35*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*np.cumsum(900-500*tt/0.35)/SR)*np.exp(-tt/0.15)).astype(np.float32),E['morre'],0.18)
k=(t>E['morre']+0.05)&(t<E['morre']+1.5); out[k]*=0.1
# câmera: bip ao ligar
c8=[f for f in TJ['falas'] if f['n']=='08'][0]['ini']
for s in (c8-0.1,c8+0.05):
    L=int(0.06*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*2200*tt)*np.minimum(1,(0.06-tt)/0.01)).astype(np.float32),s,0.06)
# flashes: carga + estalo + grave; no 2º, um chiado da Coisa recuando
for f in (E['flash1'],E['flash2']):
    L=int(0.7*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*np.cumsum(2000+5000*tt/0.7)/SR)*np.linspace(0,1,L)).astype(np.float32),f-0.7,0.03)
    put(clique(.008),f,0.7); put(lp(clique(.04),0.3),f+0.04,0.5)
    L=int(1.2*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*48*tt)*np.exp(-tt/0.5)).astype(np.float32),f,0.35)
L=int(1.1*SR); hiss=ruido(1.1); hiss=hiss-lp(hiss,0.25); hiss*=np.sin(np.linspace(0,np.pi,L))**2; put(hiss[::-1].copy(),E['flash2']+0.05,0.25)
# luz de emergência: estalos ao ligar + zumbido (mais alto dentro da loja)
for i in range(6): put(clique(.004),E['luz_loja']+i*0.11,0.25)
hum=(np.sin(2*np.pi*120*t)+0.4*np.sin(2*np.pi*240*t)).astype(np.float32)
henv=np.clip((t-E['luz_loja'])/0.5,0,1)*np.where(t>E['porta_fecha'],1.0,0.35)
out+=0.012*hum*henv
# corrida
def passo():
    L=int(0.08*SR); tt=np.arange(L)/SR; return (lp(rng.standard_normal(L).astype(np.float32),0.25)*np.exp(-tt/0.02)+0.6*np.sin(2*np.pi*90*tt)*np.exp(-tt/0.03)).astype(np.float32)
for s in np.arange(E['corre']+0.1,E['porta_fecha']-0.4,1/3.0): put(passo(),s,0.32)
# respiração ofegante dentro da loja
for s in np.arange(E['porta_fecha'],E['porta_fecha']+2.4,0.55):
    L=int(0.35*SR); b=lp(ruido(0.35),0.06)*np.sin(np.linspace(0,np.pi,L)); put(b,s,0.5)
# porta: abre e fecha (baque + trinco)
put(lp(ruido(0.3),0.05)*np.exp(-np.arange(int(0.3*SR))/(SR*0.08)),E['porta_fecha']-1.6,0.4)
L=int(0.25*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*70*tt)*np.exp(-tt/0.06)).astype(np.float32),E['porta_fecha'],0.6); put(clique(.01),E['porta_fecha']+0.12,0.5)
# batidas no vidro
def batida():
    L=int(0.18*SR); tt=np.arange(L)/SR
    return (np.sin(2*np.pi*180*tt)*np.exp(-tt/0.03)+0.5*np.sin(2*np.pi*1450*tt)*np.exp(-tt/0.02)+0.3*rng.standard_normal(L)*np.exp(-tt/0.01)).astype(np.float32)
for s in (0,0.28,0.56,1.1,1.36): put(batida(),E['batidas']+s,0.45)
for s in (0,0.2,0.4,0.6,0.8,1.0): put(batida(),E['batidas2']+s,0.6)
# grave de tensão
env=np.clip((t-E['morre'])/2,0,1)*(1+0.5*np.clip((t-E['batidas'])/2,0,1))*np.clip((DUR-t)/1.0,0,1)
out+=0.05*env*(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t+0.3*np.sin(2*np.pi*0.2*t))+0.3*np.sin(2*np.pi*110.3*t))
# quando A Voz fala, o ambiente some
for f in TJ['falas']:
    if f['quem'] in ('Voz','VozBiel'):
        e=np.clip((t-f['ini'])/0.15,0,1)*np.clip((f['ini']+f['dur']-t)/0.3,0,1); out*=(1-0.8*e)
out[-int(0.5*SR):]*=np.linspace(1,0,int(0.5*SR))
out=np.clip(out,-1,1)
w=wave.open('sfx2.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
print('ok', round(DUR,2))
