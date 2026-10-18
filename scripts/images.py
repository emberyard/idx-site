#!/usr/bin/env python3
"""Turn fresh product captures (5120x2880 retina PNGs from scripts/capture-v2.mjs, <name>-dark.png / <name>-light.png)
into the site's WebP set.

  RAW=/path/to/raw python3 scripts/images.py        (default RAW = ./_work/raw)

Writes public/img/<id>-<theme>-<w>.webp (several widths for srcset) and public/img/dims.json.
Crops are fractions (left, top, right, bottom) of the source, cut from the retina original so text stays sharp.
A spec's source may be a list of (source, box) pieces: they are stacked top to bottom with a gap.
Captures are of the current build (v0.1.26 plus what is merged for v0.1.27), invented demo data only.
"""
import json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.environ.get('RAW', os.path.join(ROOT, '_work', 'raw'))
OUT = os.path.join(ROOT, 'public', 'img')
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):  # old captures (v0.1.21) must not linger
    if f.endswith('.webp') or f == 'dims.json':
        os.remove(os.path.join(OUT, f))

FULL = (1280, 2560, 3840)
# id: (source capture, crop box or None, widths)
SPEC = {
    'hero':      ('hero-panel', None, FULL),
    'home':      ('home', None, FULL),
    'project':   ('hero-chat', None, FULL),
    'details':   ('details-open', None, FULL),
    'details-thread': ('details-thread', (0.0, 0.0, 1.0, 0.62), (1280, 2560)),
    'details-running': ('details-running', None, (1280, 2560)),
    'hero-m':    ('hero-panel', (0.20, 0.0, 0.58, 0.88), (640, 1200)),
    'folds':     ('hero-panel', (0.24, 0.07, 0.59, 0.64), (900, 1600)),
    'needs':     ('needs', (0.27, 0.08, 0.84, 0.40), (900, 1600)),
    'switcher':  ('palette', (0.36, 0.03, 0.65, 0.38), (900, 1600)),
    'accounts':  ('accounts', (0.29, 0.10, 0.84, 0.26), (900, 1600)),
    'trust':     ('trust', (0.29, 0.05, 0.84, 0.40), (900, 1600)),
    'terminal':  ('terminal', (0.695, 0.0, 1.0, 0.34), (900, 1600)),
    'shortcuts': ('shortcuts', (0.33, 0.04, 0.67, 0.98), (900, 1500)),
    'sendnow':   ([('sendnow', (0.235, 0.09, 0.595, 0.20)), ('sendnow', (0.235, 0.875, 0.595, 0.99))], None, (900, 1600)),
    'limit':     ([('accounts', (0.29, 0.10, 0.84, 0.26)), ('limit', (0.29, 0.06, 0.84, 0.19)), ('limit', (0.29, 0.86, 0.84, 0.99))], None, (900, 1600)),
    'menu':      ('folds-menu', (0.0, 0.05, 0.40, 0.90), (900, 1400)),
    'sandbox':   ('sandbox', None, (1280, 2560)),
    'archive':   ('archive', (0.20, 0.0, 0.90, 0.30), (900, 1600)),
}

def load(src, theme):
    p = os.path.join(RAW, f'{src}-{theme}.png')
    if not os.path.exists(p) and src == 'terminal':
        p = os.path.join(RAW, f'{src}-dark.png')  # the terminal is drawn dark in both themes
    if not os.path.exists(p):
        return None
    return Image.open(p).convert('RGB')

def crop(im, box):
    if not box:
        return im
    W, H = im.size
    return im.crop((round(box[0] * W), round(box[1] * H), round(box[2] * W), round(box[3] * H)))

dims = {}
for iid, (src, box, widths) in SPEC.items():
    for theme in ('dark', 'light'):
        if isinstance(src, list):
            parts = []
            for s, b in src:
                im = load(s, theme)
                if im is None:
                    parts = None; break
                parts.append(crop(im, b))
            if not parts:
                print('MISSING', iid, theme); continue
            w0 = max(p.size[0] for p in parts); gap = 24
            im = Image.new('RGB', (w0, sum(p.size[1] for p in parts) + gap * (len(parts) - 1)), parts[0].getpixel((5, 5)))
            y = 0
            for p in parts:
                im.paste(p, (0, y)); y += p.size[1] + gap
        else:
            im = load(src, theme)
            if im is None:
                print('MISSING', src, theme); continue
            im = crop(im, box)
        w0, h0 = im.size
        for w in widths:
            w = min(w, w0)
            r = im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
            r.save(os.path.join(OUT, f'{iid}-{theme}-{w}.webp'), 'WEBP', quality=80, method=6)
        dims[iid] = {'w': w0, 'h': h0, 'widths': sorted({min(w, w0) for w in widths})}
json.dump(dims, open(os.path.join(OUT, 'dims.json'), 'w'), indent=1)
print('done', len(dims), 'images')
