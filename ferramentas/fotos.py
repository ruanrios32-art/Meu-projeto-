# Tira fotos de instantes do projeto e monta uma folha (uso: fotos.py <proj> <saida.jpg> t1 t2 ...)
import sys, os, json
MAQ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.claude', 'skills', 'maquina-de-reels', 'motor')
sys.path.insert(0, MAQ)
from mq import pagina
from mq.base import ler
from PIL import Image
proj_dir = os.path.abspath(sys.argv[1]); trab = os.path.join(proj_dir, '.trabalho'); out = sys.argv[2]; ts = [float(x) for x in sys.argv[3:]]
proj = ler(os.path.join(trab, 'projeto.json'))
rd = os.path.join(trab, 'render-fotos'); html = pagina.montar(trab, proj, rd, 1080, 1920, True)
from playwright.sync_api import sync_playwright
ims = []
with sync_playwright() as pw:
    b, pg, erros = pagina.abrir(pw, html, 1080, 1920, .25)
    for i, t in enumerate(ts):
        pg.evaluate('t => window.seek(t)', t); p = os.path.join(rd, f's{i}.jpg'); pg.screenshot(path=p, type='jpeg', quality=85); ims.append(Image.open(p).copy())
    b.close()
if erros: print('ERROS:', sorted(set(erros))[:10])
cols = 6; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (w * cols, h * rows), 'black')
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * w, (i // cols) * h))
sh.save(out, quality=88); print('ok', out, sh.size)
