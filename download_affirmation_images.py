"""
Download all AI-generated affirmation images from Pollinations.ai
Run: python download_affirmation_images.py
"""

import urllib.request
import os
import time

# Create output folder
os.makedirs('assets/affirmations', exist_ok=True)

# All image URLs with their filenames
images = [
    # Learning & Growth (101-113)
    ("101", "neural%20network%20brain%20growing%20digital%20art%20neon"),
    ("102", "gradient%20descent%20path%20mountains%20abstract%20art"),
    ("103", "curious%20mind%20lightbulb%20AI%20digital%20art"),
    ("104", "attention%20focus%20spotlight%20neural%20network"),
    ("105", "future%20city%20AI%20technology%20futuristic"),
    ("106", "transformer%20architecture%20digital%20abstract"),
    ("107", "decreasing%20graph%20success%20progress%20neon"),
    ("108", "breakthrough%20explosion%20light%20discovery"),
    ("109", "multidimensional%20space%20vectors%20cosmic"),
    ("110", "convergence%20spiral%20unity%20abstract"),
    ("111", "tuning%20dial%20perfect%20balance%20tech"),
    ("112", "growth%20from%20errors%20phoenix%20rising"),
    ("113", "knowledge%20graph%20network%20connections%20glow"),
    
    # Career & Purpose (201-214)
    ("201", "AI%20ethics%20balance%20scales%20digital"),
    ("202", "human%20potential%20infinite%20stars%20cosmic"),
    ("203", "human%20AI%20handshake%20collaboration%20future"),
    ("204", "persistence%20mountain%20climber%20summit"),
    ("205", "career%20rocket%20trajectory%20upward"),
    ("206", "writing%20history%20code%20ancient%20scroll%20tech"),
    ("207", "builder%20architect%20AI%20construction"),
    ("208", "frontier%20horizon%20technology%20explorer"),
    ("209", "unique%20fingerprint%20colorful%20identity"),
    ("210", "explorer%20telescope%20stars%20discovery"),
    ("211", "person%20beyond%20code%20wholeness%20light"),
    ("212", "bright%20future%20sunrise%20technology"),
    ("213", "long%20horizon%20path%20patience%20journey"),
    ("214", "confidence%20mirror%20reflection%20strength"),
    
    # Balance & Wellbeing (301-308)
    ("301", "balance%20perfect%20zen%20harmony"),
    ("302", "rest%20peaceful%20nature%20calm%20water"),
    ("303", "rested%20mind%20brain%20glowing%20peaceful"),
    ("304", "cooling%20breeze%20refreshing%20nature"),
    ("305", "nature%20walk%20forest%20sunlight%20peace"),
    ("306", "peaceful%20sleep%20stars%20night%20dreams"),
    ("307", "self%20care%20filling%20cup%20energy"),
    ("308", "self%20care%20meditation%20wellness%20glow"),
    
    # Technical Inspiration (401-410)
    ("401", "resilience%20strength%20phoenix%20fire"),
    ("402", "patterns%20life%20fractals%20beautiful"),
    ("403", "connections%20bridge%20past%20present"),
    ("404", "diversity%20colorful%20unity%20strength"),
    ("405", "positive%20energy%20light%20rays%20burst"),
    ("406", "perspectives%20prism%20rainbow%20light"),
    ("407", "distributed%20network%20global%20connected"),
    ("408", "momentum%20wave%20energy%20motion"),
    ("409", "teamwork%20collaboration%20hands%20together"),
    ("410", "journey%20beginning%20path%20sunrise"),
    
    # Innovation & Creativity (501-510)
    ("501", "publication%20spotlight%20achievement%20star"),
    ("502", "valuable%20ideas%20gems%20treasure"),
    ("503", "innovation%20building%20creation%20sparks"),
    ("504", "understanding%20bridge%20two%20worlds"),
    ("505", "shaping%20future%20hands%20clay%20creation"),
    ("506", "steps%20progress%20stairway%20light"),
    ("507", "intersection%20magic%20sparkles%20convergence"),
    ("508", "side%20project%20hidden%20gem%20glowing"),
    ("509", "possibilities%20galaxy%20infinite%20space"),
    ("510", "brain%20lightbulb%20idea%20breakthrough%20glow"),
]

print(f"Downloading {len(images)} images...")
print("=" * 50)

for i, (seed, prompt) in enumerate(images):
    url = f"https://image.pollinations.ai/prompt/{prompt}?width=400&height=200&seed={seed}&nologo=true"
    filename = f"assets/affirmations/{seed}.jpg"
    
    print(f"[{i+1}/{len(images)}] Downloading {seed}.jpg...")
    
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"  [OK] Saved to {filename}")
        time.sleep(1)  # Be nice to the API
    except Exception as e:
        print(f"  [ERROR] {e}")

print("=" * 50)
print("Done! All images saved to assets/affirmations/")
print("\nNext step: Update index.html to use local paths")

