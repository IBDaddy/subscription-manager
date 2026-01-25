#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def generate_icon(size):
    """Generate a Subsco icon with Nordic design"""
    # Create image with gradient background
    img = Image.new('RGB', (size, size), '#fdfcf8')
    draw = ImageDraw.Draw(img)

    # Draw gradient background (approximation)
    for y in range(size):
        # Gradient from #fdfcf8 to #f5f5f4
        r = int(253 - (253 - 245) * y / size)
        g = int(252 - (252 - 245) * y / size)
        b = int(248 - (248 - 244) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # Main circle
    center = size / 2
    radius = size * 0.35

    # Draw circle
    circle_bbox = [
        center - radius,
        center - radius,
        center + radius,
        center + radius
    ]
    draw.ellipse(circle_bbox, fill='#57534e')

    # Draw letter "S"
    font_size = int(size * 0.55)
    try:
        # Try to use a system font
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
        except:
            # Fallback to default font
            font = ImageFont.load_default()

    # Get text size and position
    text = "S"

    # Get bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Calculate position to center the text
    text_x = center - text_width / 2
    text_y = center - text_height / 2 - bbox[1]

    draw.text((text_x, text_y), text, fill='#ffffff', font=font)

    # Accent dot (lime)
    dot_radius = size * 0.045
    dot_x = center + size * 0.22
    dot_y = center - size * 0.22

    dot_bbox = [
        dot_x - dot_radius,
        dot_y - dot_radius,
        dot_x + dot_radius,
        dot_y + dot_radius
    ]
    draw.ellipse(dot_bbox, fill='#84cc16')

    return img

# Generate both sizes
print("🎨 Generating Subsco icons...")

icon_192 = generate_icon(192)
icon_512 = generate_icon(512)

# Save to public directory
public_dir = 'public'
if not os.path.exists(public_dir):
    os.makedirs(public_dir)

icon_192.save(f'{public_dir}/icon-192.png', 'PNG')
icon_512.save(f'{public_dir}/icon-512.png', 'PNG')

print("✅ Icons generated successfully!")
print(f"📁 {public_dir}/icon-192.png")
print(f"📁 {public_dir}/icon-512.png")
