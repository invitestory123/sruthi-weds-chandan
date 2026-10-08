import os
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bg_path = os.path.join(base_dir, "public", "assets", "og-aarav-ananya.png")
output_public = os.path.join(base_dir, "public", "og-image.png")
output_assets = os.path.join(base_dir, "public", "assets", "og-image.png")

target_w, target_h = 1200, 630

bg = Image.open(bg_path).convert("RGBA")
bg_ratio = bg.width / bg.height
target_ratio = target_w / target_h

if bg_ratio > target_ratio:
    new_h = target_h
    new_w = int(target_h * bg_ratio)
else:
    new_w = target_w
    new_h = int(target_w / bg_ratio)

bg_resized = bg.resize((new_w, new_h), Image.Resampling.LANCZOS)
left = (new_w - target_w) // 2
top = (new_h - target_h) // 2
canvas = bg_resized.crop((left, top, left + target_w, top + target_h))

# Cover/blur the left side where template text originally was
blurred = canvas.filter(ImageFilter.GaussianBlur(radius=8))

mask = Image.new("L", (target_w, target_h), 255)
for x in range(target_w):
    if x > 720:
        val = int(255 * (1 - (x - 720) / 480))
        for y in range(target_h):
            mask.putpixel((x, y), val)

canvas = Image.composite(blurred, canvas, mask)

# Luxury Scrim
scrim = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
scrim_draw = ImageDraw.Draw(scrim)
for y in range(target_h):
    dist = abs(y - target_h / 2) / (target_h / 2)
    alpha = int(120 + dist * 95)
    scrim_draw.line([(0, y), (target_w, y)], fill=(22, 12, 6, alpha))
canvas = Image.alpha_composite(canvas, scrim)

# Center luxury ornate plaque
plaque = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
plaque_draw = ImageDraw.Draw(plaque)
card_pad_x, card_pad_y = 65, 32
cx0, cy0 = card_pad_x, card_pad_y
cx1, cy1 = target_w - card_pad_x, target_h - card_pad_y

# Velvet brown glass
plaque_draw.rounded_rectangle([cx0, cy0, cx1, cy1], radius=20, fill=(32, 18, 9, 238), outline=(228, 181, 84, 190), width=2)
# Inner double gold frame
plaque_draw.rounded_rectangle([cx0 + 8, cy0 + 8, cx1 - 8, cy1 - 8], radius=16, fill=None, outline=(228, 181, 84, 85), width=1)

# Corner gold accents
accent_len = 22
for (px, py, dx, dy) in [(cx0+16, cy0+16, 1, 1), (cx1-16, cy0+16, -1, 1), (cx0+16, cy1-16, 1, -1), (cx1-16, cy1-16, -1, -1)]:
    plaque_draw.line([(px, py), (px + dx * accent_len, py)], fill=(233, 195, 110, 220), width=2)
    plaque_draw.line([(px, py), (px, py + dy * accent_len)], fill=(233, 195, 110, 220), width=2)
    plaque_draw.ellipse([px-2, py-2, px+2, py+2], fill=(245, 215, 135, 240))

canvas = Image.alpha_composite(canvas, plaque)

draw = ImageDraw.Draw(canvas)
font_title = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 60)
font_amp = ImageFont.truetype("C:/Windows/Fonts/georgiai.ttf", 44)
font_kicker = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 15)
font_names = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 20)
font_date = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 25)
font_venue_title = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 16)
font_venue = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 16)
font_hint = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 14)

def draw_centered(y, text, font, fill=(255, 242, 214, 255), shadow=True):
    bbox = font.getbbox(text)
    w = bbox[2] - bbox[0]
    x = (target_w - w) // 2
    if shadow:
        draw.text((x + 1, y + 2), text, font=font, fill=(10, 5, 2, 220))
    draw.text((x, y), text, font=font, fill=fill)
    return y + (bbox[3] - bbox[1])

# Header
draw_centered(54, "S H U B H   V I V A H", font_kicker, fill=(233, 195, 110, 240))

top_line_y = 78
draw.line([(target_w // 2 - 90, top_line_y), (target_w // 2 + 90, top_line_y)], fill=(228, 181, 84, 130), width=1)
draw.ellipse([target_w // 2 - 3, top_line_y - 3, target_w // 2 + 3, top_line_y + 3], fill=(228, 181, 84, 220))

# Couple Names: Sruthi & Chandan
draw_centered(96, "Sruthi  &  Chandan", font_title, fill=(255, 245, 224, 255))

# Full Names
draw_centered(182, "Bride: SRUTHI SATHIYA SEKAR    ·    Groom: CHANDAN RAO S", font_names, fill=(235, 198, 115, 240))

# Divider line with center jewel
line_y = 228
draw.line([(target_w // 2 - 190, line_y), (target_w // 2 + 190, line_y)], fill=(228, 181, 84, 150), width=1)
draw.ellipse([target_w // 2 - 5, line_y - 5, target_w // 2 + 5, line_y + 5], fill=(235, 198, 115, 255))
draw.ellipse([target_w // 2 - 18, line_y - 2, target_w // 2 - 14, line_y + 2], fill=(228, 181, 84, 180))
draw.ellipse([target_w // 2 + 14, line_y - 2, target_w // 2 + 18, line_y + 2], fill=(228, 181, 84, 180))

# Date
draw_centered(252, "Sunday, 25th October 2026", font_date, fill=(255, 248, 235, 255))

# Timing badge
draw_centered(294, "Muhurtham: 7:00 AM – 8:00 AM   |   Brunch: From 9:30 AM onwards", font_venue, fill=(238, 208, 138, 230))

line_y2 = 338
draw.line([(target_w // 2 - 140, line_y2), (target_w // 2 + 140, line_y2)], fill=(228, 181, 84, 100), width=1)

# Venue 1 - Muhurtham
v1_y = 362
draw_centered(v1_y, "Muhurtham Venue: Sri Bhoga Nandishwara Gudi", font_venue_title, fill=(255, 242, 218, 250))
draw_centered(v1_y + 24, "SH 74, Nandi, Karnataka 562103", font_venue, fill=(230, 205, 160, 210))

# Venue 2 - Brunch
v2_y = 426
draw_centered(v2_y, "Brunch Venue: Hotel Sri Sierra", font_venue_title, fill=(255, 242, 218, 250))
draw_centered(v2_y + 24, "1552/110, Opp Agalagurki Gate, BB Rd, Chikkaballapur, Karnataka 562103", font_venue, fill=(230, 205, 160, 210))

# Bottom invite note
draw_centered(498, "Together with their families, cordially invite you to celebrate with us", font_hint, fill=(230, 192, 110, 210))
draw_centered(526, "Wedding Invitation  ·  Karnataka", font_hint, fill=(200, 165, 105, 180))

os.makedirs(os.path.dirname(output_public), exist_ok=True)
os.makedirs(os.path.dirname(output_assets), exist_ok=True)

final_img = canvas.convert("RGB")
final_img.save(output_public, format="PNG", optimize=True, compress_level=9)
final_img.save(output_assets, format="PNG", optimize=True, compress_level=9)

print(f"Lossless OG image saved successfully ({target_w}x{target_h}, {os.path.getsize(output_public)} bytes)")
