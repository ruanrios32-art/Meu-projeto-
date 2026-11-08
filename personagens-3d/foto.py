import json, sys, os
from playwright.sync_api import sync_playwright
dados = json.load(open('../dados.json'))
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.add_init_script('window.DADOS=' + json.dumps(dados) + ';')
    pg.on('pageerror', lambda e: print('ERRO:', e))
    pg.goto('file://' + os.path.abspath('cena.html')); pg.wait_for_function('window.PRONTO === true', timeout=60000)
    for t in sys.argv[2:]:
        pg.evaluate(f'window.render({t})'); pg.screenshot(path=f'{sys.argv[1]}_{t}.jpg', type='jpeg', quality=85)
    b.close()
