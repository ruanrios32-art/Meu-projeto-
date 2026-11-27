# Parte 3: sincronia das bocas (amp3.json) + efeitos sonoros (sfx3.wav)
import wave, json, numpy as np
SR=48000; FPS=30; rng=np.random.default_rng(23)
TJ=json.load(open('../../audio/parte3/tempos-parte3.json')); E=TJ['eventos']; DUR=E['total']
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
amp={'biel':np.zeros(int(DUR*FPS)+1),'falso':np.zeros(int(DUR*FPS)+1)}
src={'Biel':('biel','biel'),'BielEscuro':('biel','biel'),'Falso':('falso','falso-biel')}
for f in TJ['falas']:
    if f['quem'] not in src: continue
    k,arq=src[f['quem']]; x=ler(f"../../audio/parte3/falas/{f['n']}_{arq}.wav"); hop=SR//FPS
    for i in range(len(x)//hop):
        j=int(f['ini']*FPS)+i
        if j<len(amp[k]): amp[k][j]=np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))
json.dump({k:[round(float(v),3) for v in np.convolve(np.clip(a/0.12,0,1),[.25,.5,.25],'same')] for k,a in amp.items()},open('amp3.json','w'))

n=int(DUR*SR); out=np.zeros(n,np.float32); t=np.arange(n)/SR
def put(sig,at,g=1.0):
    i=int(at*SR); e=min(n,i+len(sig))
    if 0<=i<n: out[i:e]+=g*sig[:e-i]
def lp(x,al):
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=al*(x[i]-acc); y[i]=acc
    return y
def ruido(sec): return rng.standard_normal(int(sec*SR)).astype(np.float32)
def clique(d=0.006): L=int(d*SR); return (rng.standard_normal(L)*np.exp(-np.arange(L)/(L/4))).astype(np.float32)
def batida():
    L=int(0.18*SR); tt=np.arange(L)/SR
    return (np.sin(2*np.pi*180*tt)*np.exp(-tt/0.03)+0.5*np.sin(2*np.pi*1450*tt)*np.exp(-tt/0.02)+0.3*rng.standard_normal(L)*np.exp(-tt/0.01)).astype(np.float32)
def boom(g=1.0):
    L=int(1.6*SR); tt=np.arange(L)/SR
    return (g*(np.sin(2*np.pi*42*tt)+0.5*np.sin(2*np.pi*63*tt))*np.exp(-tt/0.45)+0.4*lp(rng.standard_normal(L).astype(np.float32),0.03)*np.exp(-tt/0.2)).astype(np.float32)
# GANCHO: impacto no quadro 0 + batidas fortes no vidro até abrir
put(boom(),0.0,0.55)
for s in np.arange(0.02,E['abre']-0.3,0.23):
    if not (0.5<s<3.2 and rng.random()<0.5): put(batida(),s,0.5 if s<0.5 or s>3.2 else 0.28)
# trinco + porta abre / fecha
put(clique(.012),E['abre']-0.1,0.6); put(clique(.006),E['abre']-0.02,0.4)
put(lp(ruido(0.35),0.05)*np.exp(-np.arange(int(0.35*SR))/(SR*0.08)),E['abre'],0.45)
L=int(0.25*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*70*tt)*np.exp(-tt/0.06)).astype(np.float32),E['fecha'],0.6); put(clique(.01),E['fecha']+0.12,0.5)
# Biel cai no chão
put(boom(0.6)[:int(0.5*SR)],E['entra']+0.45,0.5)
# respiração ofegante do Biel
for s in np.arange(E['fecha']+0.2,E['fecha']+3.0,0.5):
    L=int(0.3*SR); put(lp(ruido(0.3),0.07)*np.sin(np.linspace(0,np.pi,L)),s,0.45)
# zumbido da luz de emergência (falha no fim)
hum=(np.sin(2*np.pi*120*t)+0.4*np.sin(2*np.pi*240*t)).astype(np.float32)
henv=np.clip((t-0.0),0,1)*np.where(t>E['falha'],0.6+0.4*np.sign(np.sin(2*np.pi*3.1*t)),1.0)
out+=0.014*hum*henv
# passos do falso: estalo da luz + passo pesado
for p in (E['passo1'],E['passo2'],E['passo3']):
    for i in range(4): put(clique(.004),p+i*0.07,0.35)
    L=int(0.3*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*55*tt)*np.exp(-tt/0.08)+0.4*lp(ruido(0.3),0.1)*np.exp(-tt/0.05)).astype(np.float32),p+0.12,0.8)
# falhas da luz no fim
for s in np.arange(E['falha'],E['cta']-0.7,0.9): put(clique(.004),s+rng.random()*0.3,0.25)
# "colado": golpe grave
put(boom(),E['colado'],0.7)
# grave de tensão (sobe até o fim) + apagão antes da tela final
env=np.clip(t/1.5,0,1)*(0.7+0.6*np.clip((t-E['falha'])/10,0,1))*np.clip((DUR-t)/1.0,0,1)
out+=0.05*env*(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t+0.3*np.sin(2*np.pi*0.2*t))+0.3*np.sin(2*np.pi*110.3*t))
k=(t>E['cta']-0.7)&(t<E['cta']-0.15); out[k]*=0.1
# quando A Voz fala, o ambiente some
for f in TJ['falas']:
    if f['quem']=='Voz':
        e=np.clip((t-f['ini'])/0.15,0,1)*np.clip((f['ini']+f['dur']-t)/0.3,0,1); out*=(1-0.8*e)
out[-int(0.5*SR):]*=np.linspace(1,0,int(0.5*SR))
w=wave.open('sfx3.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes()); w.close()
print('ok',DUR)
