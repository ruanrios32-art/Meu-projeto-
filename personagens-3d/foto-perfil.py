import os, sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1080})
    pg.on('pageerror', lambda e: print('ERRO:', e))
    pg.goto('file://' + os.path.abspath('foto-perfil.html')); pg.wait_for_function('window.PRONTO === true', timeout=60000)
    pg.screenshot(path=sys.argv[1], type='png')
    b.close()
