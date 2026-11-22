# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\LENOVO\Desktop\clinisys\fake_screenshots\vue_generale"
os.makedirs(OUT, exist_ok=True)

W, H = 1280, 800
BLUE_DARK = (30, 58, 138)
BLUE = (37, 99, 235)
WHITE = (255, 255, 255)
TEXT = (30, 41, 59)
LIGHT_ROW = (241, 245, 249)
ACCENT = (59, 130, 246)

def font(size):
    for path in ["C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/segoeui.ttf"]:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()

def base(title):
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 56], fill=BLUE_DARK)
    d.text((24, 16), "SAFELY - Gestion hospitalière", font=font(22), fill=WHITE)
    d.rectangle([0, 56, 200, H], fill=(15, 23, 42))
    for i, item in enumerate(["Accueil", "Patients", "Feuille de soins", "Surveillance", "Planning", "Paramètres"]):
        y = 80 + i * 40
        if i == 1:
            d.rectangle([0, y - 8, 200, y + 24], fill=(37, 99, 235))
        d.text((20, y), item, font=font(18), fill=WHITE)
    d.text((230, 100), title, font=font(34), fill=TEXT)
    d.line([230, 155, W - 40, 155], fill=(203, 213, 225), width=2)
    return img, d

def table(d, x, y, headers, rows, col_w=None, row_h=40):
    if col_w is None:
        col_w = [220] * len(headers)
    d.rectangle([x, y, x + sum(col_w), y + row_h], fill=BLUE)
    cx = x
    for h, w in zip(headers, col_w):
        d.text((cx + 12, y + 10), h, font=font(18), fill=WHITE)
        cx += w
    for i, row in enumerate(rows):
        ry = y + row_h * (i + 1)
        d.rectangle([x, ry, x + sum(col_w), ry + row_h], fill=LIGHT_ROW if i % 2 == 0 else WHITE)
        cx = x
        for cell, w in zip(row, col_w):
            d.text((cx + 12, ry + 10), str(cell), font=font(17), fill=TEXT)
            cx += w
        d.line([x, ry + row_h, x + sum(col_w), ry + row_h], fill=(226, 232, 240), width=1)

def button(d, x, y, label, color=ACCENT):
    d.rounded_rectangle([x, y, x + 180, y + 42], radius=8, fill=color)
    d.text((x + 30, y + 10), label, font=font(17), fill=WHITE)

GROUPS = [
    [["Mohamed Bengerden", "45 ans", "Cardiologie", "Actif"],
     ["Fatma Trabelsi", "32 ans", "Pédiatrie", "Actif"],
     ["Ali Kacem", "60 ans", "Neurologie", "Sorti"],
     ["Sana Marzouki", "28 ans", "Dermatologie", "Actif"]],
    [["Youssef Mansouri", "50 ans", "Urgences", "Actif"],
     ["Leila Chaabene", "37 ans", "Chirurgie", "Actif"],
     ["Omar Bouazizi", "65 ans", "Pneumologie", "Sorti"],
     ["Nejla Rahmouni", "29 ans", "Gynécologie", "Actif"]],
    [["Karim Jaziri", "41 ans", "Ophtalmologie", "Actif"],
     ["Amina Dridi", "55 ans", "Oncologie", "Actif"],
     ["Habib Kallel", "70 ans", "Cardiologie", "Sorti"],
     ["Rania Haddad", "24 ans", "Dentaire", "Actif"]],
    [["Walid Feriani", "48 ans", "Urologie", "Actif"],
     ["Meriem Ben Hmida", "33 ans", "Néphrologie", "Actif"],
     ["Tarek Soltani", "59 ans", "Gastrologie", "Sorti"],
     ["Ines Hachicha", "27 ans", "ORL", "Actif"]],
    [["Sami Ben Ali", "52 ans", "Cardiologie", "Actif"],
     ["Houda Jebali", "44 ans", "Rhumatologie", "Actif"],
     ["Rachid Amri", "61 ans", "Néphrologie", "Sorti"],
     ["Wafa Zribi", "30 ans", "Pédiatrie", "Actif"]],
    [["Bilel Mejri", "38 ans", "Dermatologie", "Actif"],
     ["Olfa Ferchichi", "49 ans", "Gastrologie", "Actif"],
     ["Sadok Guermazi", "66 ans", "Urologie", "Sorti"],
     ["Amal Brahmi", "26 ans", "Ophtalmologie", "Actif"]],
    [["Nabil Trabelsi", "43 ans", "Pneumologie", "Actif"],
     ["Cyrine Mabrouk", "35 ans", "Gynécologie", "Actif"],
     ["Hatem Zlitni", "58 ans", "Chirurgie", "Sorti"],
     ["Rama Karray", "31 ans", "Dermatologie", "Actif"]],
    [["Fathi Khemiri", "54 ans", "Neurologie", "Actif"],
     ["Salsabil Rahoui", "40 ans", "Cardiologie", "Actif"],
     ["Med Amine Gharbi", "62 ans", "Pneumologie", "Sorti"],
     ["Lina Essid", "23 ans", "Pédiatrie", "Actif"]],
    [["Zied Ben Salah", "47 ans", "Rhumatologie", "Actif"],
     ["Nour Hachana", "29 ans", "ORL", "Actif"],
     ["Achraf Talbi", "67 ans", "Cardiologie", "Sorti"],
     ["Mariem Rezgui", "36 ans", "Néphrologie", "Actif"]],
    [["Med Ghassen Boughattas", "51 ans", "Oncologie", "Actif"],
     ["Ikram Abdelhedi", "34 ans", "Dentaire", "Actif"],
     ["Chokri Dhif", "63 ans", "Gastrologie", "Sorti"],
     ["Aya Boukthir", "25 ans", "Ophtalmologie", "Actif"]],
]

for i, patients in enumerate(GROUPS, start=1):
    img, d = base(f"Liste des patients - Vue générale (Page {i})")
    table(d, 230, 200, ["Nom", "Âge", "Service", "Statut"], patients)
    button(d, 230, 430, "+ Nouveau patient")
    button(d, 430, 430, "Imprimer", BLUE_DARK)
    d.text((230, 520), f"Page {i} / 10", font=font(18), fill=TEXT)
    img.save(os.path.join(OUT, f"vue_generale_{i:02d}.png"))

print("Done ->", OUT)
print(os.listdir(OUT))
