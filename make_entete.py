# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\LENOVO\Desktop\clinisys\fake_screenshots\entete_feuille_de_soin"
os.makedirs(OUT, exist_ok=True)

W, H = 1280, 800
BLUE_DARK = (30, 58, 138)
WHITE = (255, 255, 255)
TEXT = (30, 41, 59)

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
        if i == 2:
            d.rectangle([0, y - 8, 200, y + 24], fill=(37, 99, 235))
        d.text((20, y), item, font=font(18), fill=WHITE)
    d.text((230, 100), title, font=font(34), fill=TEXT)
    d.line([230, 155, W - 40, 155], fill=(203, 213, 225), width=2)
    return img, d

PATIENTS = [
    ("Mohamed Bengerden", "45 ans", "Cardiologie", "Dr. Saad", "23006010"),
    ("Fatma Trabelsi", "32 ans", "Pédiatrie", "Dr. Aziz", "23006011"),
    ("Youssef Mansouri", "50 ans", "Urgences", "Dr. Karim", "23006012"),
    ("Leila Chaabene", "37 ans", "Chirurgie", "Dr. Hanen", "23006013"),
    ("Omar Bouazizi", "65 ans", "Pneumologie", "Dr. Saad", "23006014"),
    ("Sana Marzouki", "28 ans", "Dermatologie", "Dr. Mehdi", "23006015"),
    ("Karim Jaziri", "41 ans", "Ophtalmologie", "Dr. Nadia", "23006016"),
    ("Amina Dridi", "55 ans", "Oncologie", "Dr. Aziz", "23006017"),
    ("Ali Kacem", "60 ans", "Neurologie", "Dr. Karim", "23006018"),
    ("Ines Hachicha", "27 ans", "ORL", "Dr. Hanen", "23006019"),
]

for i, (nom, age, service, medecin, dossier) in enumerate(PATIENTS, start=1):
    img, d = base(f"En-tête feuille de soin (Patient {i})")
    d.rectangle([230, 200, 1050, 360], outline=(203, 213, 225), width=2)
    d.text((260, 225), f"Nom : {nom}", font=font(22), fill=TEXT)
    d.text((260, 260), f"Âge : {age}   |   Service : {service}", font=font(22), fill=TEXT)
    d.text((260, 295), f"Médecin : {medecin}   |   N° Dossier : {dossier}", font=font(22), fill=TEXT)
    d.text((260, 330), f"Date d'admission : 2026-10-{i:02d}", font=font(22), fill=TEXT)
    img.save(os.path.join(OUT, f"entete_{i:02d}.png"))

print("Done ->", OUT)
print(os.listdir(OUT))
