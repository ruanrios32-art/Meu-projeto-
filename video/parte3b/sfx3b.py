# Parte 3 ("Eu Sou o Biel"): sincronia das bocas (amp3b.json) + efeitos sonoros (sfx3b.wav)
import wave, json, numpy as np
SR=48000; FPS=30; rng=np.random.default_rng(31)
TJ=json.load(open('../../audio/parte3b/tempos-parte3.json')); E=TJ['eventos']; DUR=E['total']
def ler(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    return x.reshape(-1,w.getnchannels()).mean(1)
amp={'biel':np.zeros(int(DUR*FPS)+1),'falso':np.zeros(int(DUR*FPS)+1)}
src={'Biel':('biel','biel'),'BielEscuro':('biel','biel'),'Falso':('falso','falso-biel')}
for f in TJ['falas']:
    if f['quem'] not in src: continue
    k,arq=src[f['quem']]; x=ler(f"../../audio/parte3b/falas/{f['n']}_{arq}.wav"); hop=SR//FPS
    for i in range(len(x)//hop):
        j=int(f['ini']*FPS)+i
        if j<len(amp[k]): amp[k][j]=np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))
json.dump({k:[round(float(v),3) for v in np.convolve(np.clip(a/0.12,0,1),[.25,.5,.25],'same')] for k,a in amp.items()},open('amp3b.json','w'))
n=int(DUR*SR); out=np.zeros(n,np.float32); t=np.arange(n)/SR
def put(sig,at,g=1.0):
    i=int(at*SR); e=min(n,i+len(sig))
    if 0<=i<n: out[i:e]+=g*sig[:e-i]
def lp(x,al):
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=al*(x[i]-acc); y[i]=acc
    return y
def ruido(s): return rng.standard_normal(int(s*SR)).astype(np.float32)
def clique(d=0.006): L=int(d*SR); return (rng.standard_normal(L)*np.exp(-np.arange(L)/(L/4))).astype(np.float32)
def batida():
    L=int(0.18*SR); tt=np.arange(L)/SR
    return (np.sin(2*np.pi*180*tt)*np.exp(-tt/0.03)+0.5*np.sin(2*np.pi*1450*tt)*np.exp(-tt/0.02)+0.3*rng.standard_normal(L)*np.exp(-tt/0.01)).astype(np.float32)
def boom(g=1.0):
    L=int(1.6*SR); tt=np.arange(L)/SR
    return (g*(np.sin(2*np.pi*42*tt)+0.5*np.sin(2*np.pi*63*tt))*np.exp(-tt/0.45)+0.4*lp(rng.standard_normal(L).astype(np.float32),0.03)*np.exp(-tt/0.2)).astype(np.float32)
loja=(t<E['corte']).astype(np.float32); dep=(t>=E['deposito']).astype(np.float32)
# gancho
put(boom(),0.0,0.55)
for s in np.arange(0.02,E['abre']-0.3,0.23):
    if not (0.5<s<3.0 and rng.random()<0.5): put(batida(),s,0.5 if s<0.5 or s>3.0 else 0.28)
put(clique(.012),E['abre']-0.1,0.6); put(lp(ruido(0.35),0.05)*np.exp(-np.arange(int(0.35*SR))/(SR*0.08)),E['abre'],0.45)
L=int(0.25*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*70*tt)*np.exp(-tt/0.06)).astype(np.float32),E['fecha'],0.6); put(clique(.01),E['fecha']+0.12,0.5)
for s in np.arange(E['fecha']+0.2,E['fecha']+2.4,0.5):
    L=int(0.3*SR); put(lp(ruido(0.3),0.07)*np.sin(np.linspace(0,np.pi,L)),s,0.4)
# zumbido da luz de emergência (só na loja)
out+=0.014*(np.sin(2*np.pi*120*t)+0.4*np.sin(2*np.pi*240*t)).astype(np.float32)*loja
# luz falhando
for s in np.arange(E['pisca'],E['corte'],0.7): put(clique(.004),s+rng.random()*0.3,0.22)
# TRANSFORMAÇÃO: estalos de osso a cada estágio + rosnado crescente
T0,T1=E['transf0'],E['transf1']
for i in range(5):
    st=T0+0.3+i*(T1-T0)/5
    for j in range(6): put(clique(.005),st+j*0.045+rng.random()*0.02,0.5)
    L=int(0.5*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*np.cumsum(90-50*tt)/SR)*np.exp(-tt/0.2)).astype(np.float32),st,0.5)
k=(t>T0)&(t<T1+2.5); g=np.clip((t-T0)/(T1-T0),0,1)
growl=lp(ruido(DUR)[:n],0.02)*(1+np.sin(2*np.pi*33*t))*0.8; out[k]+=(0.25*g*growl)[k]
put(boom(),T1,0.6)
# corrida + flash + porta batendo + silêncio
def passo():
    L=int(0.08*SR); tt=np.arange(L)/SR; return (lp(rng.standard_normal(L).astype(np.float32),0.25)*np.exp(-tt/0.02)+0.6*np.sin(2*np.pi*90*tt)*np.exp(-tt/0.03)).astype(np.float32)
for s in np.arange(E['corre']+0.3,E['flash'],1/3.2): put(passo(),s,0.32)
put(clique(.008),E['flash'],0.7); put(boom(0.8)[:int(0.8*SR)],E['flash'],0.45)
L=int(0.9*SR); h=ruido(0.9); h=h-lp(h,0.25); h*=np.sin(np.linspace(0,np.pi,L))**2; put(h,E['flash']+0.05,0.3)
L=int(0.4*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*60*tt)*np.exp(-tt/0.08)+0.4*lp(ruido(0.4),0.1)*np.exp(-tt/0.05)).astype(np.float32),E['corte'],0.8)
k=(t>E['corte']+0.3)&(t<E['deposito']); out[k]*=0.05
# depósito: zumbido grave da placa verde + gotas
out+=0.008*np.sin(2*np.pi*100*t).astype(np.float32)*dep
for s in np.arange(E['deposito']+1,DUR-2,1.7): 
    L=int(0.06*SR); tt=np.arange(L)/SR; put((np.sin(2*np.pi*1900*tt)*np.exp(-tt/0.015)).astype(np.float32),s+rng.random()*0.5,0.06)
put(boom(),E['olhos'],0.6)
# grave de tensão + ambiente some quando A Voz fala
env=np.clip(t/1.5,0,1)*(0.7+0.6*np.clip((t-E['pisca'])/8,0,1))*np.clip((DUR-t)/1.0,0,1)
out+=0.05*env*(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t)+0.3*np.sin(2*np.pi*110.3*t))
for f in TJ['falas']:
    if f['quem'] in ('Voz','Monstro'):
        e=np.clip((t-f['ini'])/0.15,0,1)*np.clip((f['ini']+f['dur']-t)/0.3,0,1); out*=(1-0.6*e)
out[-int(0.5*SR):]*=np.linspace(1,0,int(0.5*SR))
w=wave.open('sfx3b.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes()); w.close()
print('ok',DUR)
