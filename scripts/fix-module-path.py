"""批量替换 Go module path: github.com/libra/ → github.com/goodie1972/"""
import os
import sys

OLD = 'github.com/libra/'
NEW = 'github.com/goodie1972/'
BASE = os.path.join(os.path.dirname(__file__), '..', 'packages')
PKGS = ['go-tokens', 'go-templ', 'go-cli', 'go-mcp', 'go-server']

count = 0
for pkg in PKGS:
    pkgdir = os.path.join(BASE, pkg)
    if not os.path.isdir(pkgdir):
        print(f'SKIP: {pkgdir} not found')
        continue
    for root, dirs, files in os.walk(pkgdir):
        for fname in files:
            if not (fname.endswith('.go') or fname.endswith('.mod')):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                txt = f.read()
            if OLD not in txt:
                continue
            txt2 = txt.replace(OLD, NEW)
            with open(fpath, 'w', encoding='utf-8', newline='\n') as f:
                f.write(txt2)
            rel = os.path.relpath(fpath, BASE)
            print(f'PATCHED: {rel}')
            count += 1

print(f'\nTotal: {count} files patched')
