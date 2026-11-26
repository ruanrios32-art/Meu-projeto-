# Gera sincronia da boca (amp.json) e a trilha de efeitos (sfx.wav) para a prévia de 27 s
import wave, json, re, numpy as np
SR=48000; DUR=27.0; FPS=30
rng=np.random.default_rng(7)
def ler(p):
    w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
# início exato de cada fala a partir do SRT (mesma ordem da montagem)
srt=open('../../roteiros/parte-1-legendas.srt').read()
starts=[int(h)*3600+int(m)*60+float(s.replace(',','.')) for h,m,s in re.findall(r'(\d\d):(\d\d):(\d\d,\d\d\d) -->',srt)]
ordem=["01_dudu","02_dudu","03_cida","04_dudu","05_cida","06_dudu","07_cida","08_dudu","09_voz","10_dudu","11_cida","12_voz","13_dudu","15_voz","16_dudu"]
amp={"cida":np.zeros(int(DUR*FPS)),"dudu":np.zeros(int(DUR*FPS))}
for nome,st in zip(ordem,starts):
    who=nome.split('_')[1]
    if who not in amp: continue
    x=ler(f'../../audio/falas/{nome}.wav'); hop=SR//FPS
    for i in range(len(x)//hop):
        f=int(st*FPS)+i
        if f<len(amp[who]): amp[who][f]=np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2))
for k in amp:
    a=amp[k]; a=np.clip(a/0.12,0,1); amp[k]=np.convolve(a,[.25,.5,.25],'same')
json.dump({k:[round(float(v),3) for v in amp[k]] for k in amp},open('amp.json','w'))
json.dump({"starts":starts[:6]},open('tempos.json','w'))

n=int(DUR*SR); out=np.zeros(n,np.float32); t=np.arange(n)/SR
def put(sig,at,g=1.0):
    i=int(at*SR); e=min(n,i+len(sig)); out[i:e]+=g*sig[:e-i]
def lp(x,a):  # passa-baixa de 1 polo
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc); y[i]=acc
    return y
def reverb(x,sec=0.9,mix=0.35):
    L=int(sec*SR); ir=rng.standard_normal(L)*np.exp(-np.arange(L)/(SR*sec/5)); ir/=np.abs(ir).sum()/3
    w=np.convolve(x,ir)[:len(x)+L]; d=np.zeros_like(w); d[:len(x)]=x; return d*(1-mix)+w*mix
# vento: ruído marrom filtrado, constante e baixo
wind=np.cumsum(rng.standard_normal(n)).astype(np.float32); wind-=np.convolve(wind,np.ones(4801)/4801,'same'); wind/=np.abs(wind).max()
wind*= (0.6+0.4*np.sin(2*np.pi*t/7.3)) ; out+=0.05*wind
# latidos distantes 0–6 s, param TODOS em 6,0 s
def latido(f0):
    L=int(0.16*SR); tt=np.arange(L)/SR; f=f0*(1.15-0.5*tt/0.16)
    ph=2*np.pi*np.cumsum(f)/SR; s=np.sin(ph)+0.5*np.sin(2*ph)+0.3*np.sin(3*ph)+0.6*rng.standard_normal(L)
    env=np.minimum(1,tt/0.01)*np.exp(-tt/0.06); return (s*env).astype(np.float32)
barks=np.zeros(int(6.0*SR)+SR,np.float32); tb=0.15
while tb<5.85:
    b=latido(rng.uniform(330,520)); i=int(tb*SR); barks[i:i+len(b)]+=b*rng.uniform(.5,1)
    tb+=rng.choice([0.22,0.25,0.6,0.9,1.3])
barks=lp(barks,0.18); barks=reverb(barks,1.1,0.55)[:int(6.0*SR)]
barks[-int(0.02*SR):]*=np.linspace(1,0,int(0.02*SR))   # corte seco
out[:len(barks)]+=0.30*barks/np.abs(barks).max()
# depois do corte, o vento também cai por 2 s ("silêncio estranho")
k=(t>=6.0)&(t<8.5); out[k]*=0.35
def clique(dur=0.006,g=1.0):
    L=int(dur*SR); return (rng.standard_normal(L)*np.exp(-np.arange(L)/(L/4))*g).astype(np.float32)
# obturador da câmera em 0,6 s
put(clique(.008),0.60,0.5); put(lp(clique(.03),0.3),0.645,0.45)
# clique da lanterna em 5,3 s
put(clique(.004),5.30,0.35); put(clique(.004),5.33,0.2)
# fósforo riscando em 8,4 s + chama
L=int(0.28*SR); s=rng.standard_normal(L)*np.exp(-np.arange(L)/(SR*0.07)); s=s-lp(s.astype(np.float32),0.2)
put(s.astype(np.float32),8.40,0.35)
L=int(0.9*SR); fl=lp(rng.standard_normal(L).astype(np.float32),0.03)*np.exp(-np.arange(L)/(SR*0.4)); put(fl,8.50,0.6)
# grave de tensão a partir de 16 s (fala 05 começa ~18 s)
env=np.clip((t-16)/3,0,1)*np.clip((26.8-t)/0.6,0,1)
drone=(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t+0.3*np.sin(2*np.pi*0.2*t))+0.3*np.sin(2*np.pi*110.3*t))
out+=0.06*env*drone
out[-int(0.5*SR):]*=np.linspace(1,0,int(0.5*SR))
out=np.clip(out,-1,1)
w=wave.open('sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
print("ok", starts[:6])
