# Batida original (120 BPM) para os vídeos da Chef Jade. uso: batida.py saida.wav [segundos]
import sys, numpy as np, wave
SR = 48000; BPM = 120; B = 60 / BPM
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 15.5
N = int(SR * dur); mix = np.zeros(N)
rng = np.random.default_rng(7)
def add(sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += g * sig[:j - i]
def env(n, a=.003, d=.2):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def kick():
    n = int(.35 * SR); t = np.arange(n) / SR; f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .16)
def clap():
    n = int(.2 * SR); s = rng.standard_normal(n); s = np.diff(np.concatenate([[0], s])) * .6
    e = sum(np.exp(-np.maximum(0, np.arange(n) / SR - k * .012) * 60) * (np.arange(n) / SR >= k * .012) for k in range(3)) / 3 + np.exp(-np.arange(n) / SR / .08) * .5
    return s * e
def hat(o=False):
    n = int((.12 if o else .04) * SR); s = rng.standard_normal(n); s = np.diff(np.concatenate([[0], s]))
    return s * env(n, .001, .05 if o else .012) * .5
def nota(f, d=.3, tipo='pluck'):
    n = int(d * SR) + int(.4 * SR); t = np.arange(n) / SR
    if tipo == 'baixo':
        s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.4 for k in range(1, 6)); return s * env(n, .004, .18) * .5
    if tipo == 'sino':
        s = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 9); return s * env(n, .002, .35)
    s = np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 12) + .2 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 20)
    return s * env(n, .002, .16)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
acordes = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [59, 62, 67])]   # C Am F G
melodia = [72, 76, 79, 76, 81, 79, 76, 74, 72, 74, 76, 79, 77, 76, 74, 72]
nb = int(dur / B)
for k in range(nb):
    t = k * B; bar = (k // 4) % 4; raiz, ac = acordes[bar]; fim = t >= dur - 1.6
    if fim: continue
    add(kick(), t, .95)
    if k % 2 == 1: add(clap(), t, .55)
    add(hat(), t + B / 2, .35); add(hat(k % 4 == 3), t, .18)
    add(nota(hz(raiz - 12), .2, 'baixo'), t + B / 2, .55)
    if k % 4 == 0: add(nota(hz(raiz - 12), .2, 'baixo'), t, .4)
    if k >= 4:
        m = melodia[k % 16]; add(nota(hz(m), .2), t, .22)
        if k % 2 == 0: add(nota(hz(m + 7 if m + 7 < 86 else m - 5), .15), t + B / 2, .12)
    if k % 4 == 0:
        for c in ac: add(nota(hz(c), 1.5, 'sino'), t, .06)
# final "tchan!"
tf = (nb - 3) * B
for c in [60, 64, 67, 72, 76]: add(nota(hz(c), 1.2, 'sino'), tf, .14)
add(kick(), tf, 1); add(clap(), tf, .6)
mix /= np.max(np.abs(mix)) * 1.12
with wave.open(sys.argv[1], 'w') as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1], dur, 's')
