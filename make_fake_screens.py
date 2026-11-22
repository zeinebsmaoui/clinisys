# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\LENOVO\Desktop\clinisys\fake_screenshots"
os.makedirs(OUT, exist_ok=True)

W, H = 1280, 800
BLUE_DARK = (30, 58, 138)
BLUE = (37, 99, 235)
GRAY_BAR = (226, 232, 240)
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

def base(title, subtitle="SAFELY - Gestion hospitalière"):
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)
    # top app bar
    d.rectangle([0, 0, W, 56], fill=BLUE_DARK)
    d.text((24, 16), subtitle, font=font(22), fill=WHITE)
    # left sidebar
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

PATIENTS = [
    ["Mohamed Bengerden", "45 ans", "Cardiologie", "Actif"],
    ["Fatma Trabelsi", "32 ans", "Pédiatrie", "Actif"],
    ["Ali Kacem", "60 ans", "Neurologie", "Sorti"],
    ["Sana Marzouki", "28 ans", "Dermatologie", "Actif"],
]

def vue_generale():
    img, d = base("Liste des patients - Vue générale")
    table(d, 230, 200, ["Nom", "Âge", "Service", "Statut"], PATIENTS)
    button(d, 230, 430, "+ Nouveau patient")
    button(d, 430, 430, "Imprimer", BLUE_DARK)
    img.save(os.path.join(OUT, "vue_generale.png"))

def bouton_actions():
    img, d = base("Liste des patients - Boutons actions")
    table(d, 230, 200, ["Nom", "Âge", "Service", "Actions"], [[p[0], p[1], p[2], "✏ 🗑 👁"] for p in PATIENTS])
    d.text((230, 430), "Boutons disponibles : Modifier (✏), Supprimer (🗑), Détails (👁)", font=font(18), fill=TEXT)
    img.save(os.path.join(OUT, "bouton_actions.png"))

def accueil():
    img, d = base("Accueil")
    d.text((230, 200), "Bienvenue dans le système de gestion hospitalière", font=font(22), fill=TEXT)
    for i, t in enumerate(["Patients : 124", "Lits occupés : 38", "Médecins : 12", "Rendez-vous : 25"]):
        x = 230 + (i % 2) * 380
        y = 260 + (i // 2) * 120
        d.rounded_rectangle([x, y, x + 340, y + 90], radius=10, fill=LIGHT_ROW)
        d.text((x + 30, y + 30), t, font=font(22), fill=BLUE)
    img.save(os.path.join(OUT, "accueil.png"))

def feuille_de_soins():
    img, d = base("Feuille de soins")
    table(d, 230, 200, ["Soin", "Date", "Médecin", "Statut"], [
        ["Consultation", "01/10/2026", "Dr. Saad", "Fait"],
        ["Prise de sang", "02/10/2026", "Dr. Aziz", "Fait"],
        ["Radiographie", "05/10/2026", "Dr. Saad", "Planifié"],
    ])
    button(d, 230, 430, "+ Ajouter un soin")
    img.save(os.path.join(OUT, "feuille_de_soins.png"))

def entete():
    img, d = base("En-tête feuille de soin")
    d.rectangle([230, 200, 1000, 320], outline=(203, 213, 225), width=2)
    d.text((260, 220), "Nom : Mohamed Bengerden", font=font(20), fill=TEXT)
    d.text((260, 250), "Âge : 45 ans   |   Service : Cardiologie", font=font(20), fill=TEXT)
    d.text((260, 280), "Médecin : Dr. Saad   |   N° Dossier : 23006010", font=font(20), fill=TEXT)
    img.save(os.path.join(OUT, "entete_feuille_de_soin.png"))

def infos_generales():
    img, d = base("Informations générales")
    table(d, 230, 200, ["Champ", "Valeur"], [
        ["Nom complet", "Mohamed Bengerden"],
        ["Date de naissance", "12/03/1981"],
        ["Adresse", "Kairouan, Tunisie"],
        ["Téléphone", "55 123 456"],
    ], col_w=[280, 420])
    img.save(os.path.join(OUT, "informations_generales.png"))

def courbe():
    img, d = base("Courbe de surveillance")
    d.rectangle([230, 200, 1100, 560], outline=(203, 213, 225), width=2)
    for i in range(1, 6):
        d.line([230, 200 + i * 60, 1100, 200 + i * 60], fill=(241, 245, 249), width=1)
    pts = [(280, 350), (450, 300), (620, 420), (790, 330), (960, 280)]
    d.line(pts, fill=BLUE, width=4)
    for p in pts:
        d.ellipse([p[0] - 6, p[1] - 6, p[0] + 6, p[1] + 6], fill=ACCENT)
    d.text((600, 600), "Tension artérielle (mmHg) - 7 derniers jours", font=font(18), fill=TEXT)
    img.save(os.path.join(OUT, "courbe_de_surveillance.png"))

def surveillance():
    img, d = base("Surveillance")
    table(d, 230, 200, ["Heure", "Tension", "Température", "Pouls"], [
        ["08:00", "13/8", "36.8", "72"],
        ["12:00", "12/8", "37.1", "75"],
        ["16:00", "14/9", "36.9", "70"],
        ["20:00", "12/8", "36.7", "68"],
    ])
    img.save(os.path.join(OUT, "surveillance.png"))

def planning():
    img, d = base("Planification du temps")
    table(d, 230, 200, ["Jour", "Soin prévu", "Heure"], [
        ["Lundi", "Médicament A", "08:00"],
        ["Mardi", "Consultation", "10:00"],
        ["Mercredi", "Analyse", "09:30"],
        ["Jeudi", "Médicament B", "20:00"],
    ])
    img.save(os.path.join(OUT, "planification_du_temps.png"))

def entree_sortie():
    img, d = base("Entrée / Sortie")
    table(d, 230, 200, ["Date", "Type", "Service", "Chambre"], [
        ["01/10/2026", "Entrée", "Cardiologie", "205"],
        ["05/10/2026", "Sortie", "Pédiatrie", "112"],
    ])
    img.save(os.path.join(OUT, "entree_sortie.png"))

vue_generale(); bouton_actions(); accueil(); feuille_de_soins(); entete()
infos_generales(); courbe(); surveillance(); planning(); entree_sortie()
print("Done ->", OUT)
print(os.listdir(OUT))
