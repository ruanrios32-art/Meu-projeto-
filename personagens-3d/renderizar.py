import json, sys, os, subprocess
from playwright.sync_api import sync_playwright
t0, t1, saida = float(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
dados = json.load(open('../dados.json'))
os.makedirs('quadros', exist_ok=True)
for f in os.listdir('quadros'): os.remove(os.path.join('quadros', f))
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.add_init_script('window.DADOS=' + json.dumps(dados) + ';')
    pg.on('console', lambda m: print('console:', m.text))
    pg.on('pageerror', lambda e: print('ERRO:', e))
    pg.goto('file://' + os.path.abspath('cena.html'))
    pg.wait_for_function('window.PRONTO === true', timeout=60000)
    fps = dados['fps']; n = int(round((t1 - t0) * fps))
    for i in range(n):
        pg.evaluate(f'window.render({t0 + i / fps})')
        pg.screenshot(path=f'quadros/{i:05d}.jpg', type='jpeg', quality=92)
        if i % 60 == 0: print('quadro', i, '/', n, flush=True)
    b.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-i', 'quadros/%05d.jpg', '-ss', str(t0), '-t', str(t1 - t0), '-i', '../audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', saida], check=True)
print('ok', saida)
