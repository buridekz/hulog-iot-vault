"""Crop white-backed stamp rasters; keep paper white for mix-blend multiply."""
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import os

src = r"C:\Users\lance\.cursor\projects\c-Users-lance-technopreneurship\assets"
out = r"C:\Users\lance\technopreneurship\hulog-web\public\notice"
os.makedirs(out, exist_ok=True)


def crop_ink(im: Image.Image, pad: int = 18, thresh: int = 246) -> Image.Image:
    im = im.convert("RGB")
    arr = np.array(im)
    ink = (arr[:, :, 0] < thresh) | (arr[:, :, 1] < thresh) | (arr[:, :, 2] < thresh)
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return im
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(im.width, int(xs.max()) + pad + 1)
    y1 = min(im.height, int(ys.max()) + pad + 1)
    return im.crop((x0, y0, x1, y1))


def fit_width(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im
    h = round(im.height * (width / im.width))
    return im.resize((width, h), Image.Resampling.LANCZOS)


def save(im: Image.Image, name: str) -> None:
    path = os.path.join(out, name)
    im.save(path, "PNG", optimize=True)
    print(name, im.size, os.path.getsize(path))


cta = fit_width(crop_ink(Image.open(os.path.join(src, "hulog-notice-cta.png")), pad=12), 560)
save(cta, "cta-try.png")

ex = crop_ink(Image.open(os.path.join(src, "hulog-notice-exhibit.png")), pad=10, thresh=248)
ex = ex.resize((420, 420), Image.Resampling.LANCZOS)
save(ex, "stamp-exhibit.png")

dt = fit_width(crop_ink(Image.open(os.path.join(src, "hulog-notice-date.png")), pad=14), 280)
save(dt, "stamp-date.png")

tg = fit_width(crop_ink(Image.open(os.path.join(src, "hulog-notice-toggle.png")), pad=10), 220)
save(tg, "toggle-pill.png")

g = Image.open(os.path.join(src, "hulog-notice-grain.png")).convert("RGB")
g = g.crop((160, 160, 864, 864)).resize((1024, 1024), Image.Resampling.LANCZOS)
g = ImageEnhance.Contrast(g).enhance(1.65)
g = ImageEnhance.Sharpness(g).enhance(1.25)
arr = np.array(g).astype(np.float32)
rng = np.random.default_rng(1250200)
speck = rng.random(arr.shape[:2])
toner = rng.uniform(0.32, 0.62, arr.shape[:2])
arr[speck < 0.05] *= toner[speck < 0.05, None]
fiber = rng.random(arr.shape[:2])
arr[fiber > 0.993] = np.clip(arr[fiber > 0.993] + 22, 0, 255)
target = np.array([246, 245, 241], dtype=np.float32)
mean = arr.reshape(-1, 3).mean(axis=0)
arr = np.clip(arr - mean + target, 0, 255)
grain = Image.fromarray(arr.astype(np.uint8))
grain = grain.filter(ImageFilter.UnsharpMask(radius=0.6, percent=80, threshold=2))
save(grain, "grain.png")
print("done")
