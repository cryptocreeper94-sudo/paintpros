#!/usr/bin/env python3
"""Generate PWA icons for both tenants."""
from PIL import Image
import os

def create_square_icon(input_path, output_path, size, bg_color=None):
    """Create a square icon, optionally adding background."""
    img = Image.open(input_path)
    
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGBA')
    else:
        img = img.convert('RGB')
    
    orig_width, orig_height = img.size
    
    if orig_width != orig_height:
        max_dim = max(orig_width, orig_height)
        if bg_color:
            new_img = Image.new('RGB', (max_dim, max_dim), bg_color)
        else:
            new_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
        
        paste_x = (max_dim - orig_width) // 2
        paste_y = (max_dim - orig_height) // 2
        
        if img.mode == 'RGBA':
            new_img.paste(img, (paste_x, paste_y), img)
        else:
            new_img.paste(img, (paste_x, paste_y))
        img = new_img
    
    img = img.resize((size, size), Image.LANCZOS)
    
    if output_path.endswith('.png'):
        img.save(output_path, 'PNG', quality=95)
    else:
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(output_path, 'JPEG', quality=95)
    
    print(f"Created {output_path} ({size}x{size})")

def create_splash_screen(input_path, output_path, width, height, bg_color):
    """Create a splash screen with the logo centered."""
    img = Image.open(input_path)
    
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGBA')
    else:
        img = img.convert('RGB')
    
    splash = Image.new('RGB', (width, height), bg_color)
    
    logo_max_width = int(width * 0.6)
    logo_max_height = int(height * 0.4)
    
    orig_width, orig_height = img.size
    ratio = min(logo_max_width / orig_width, logo_max_height / orig_height)
    new_width = int(orig_width * ratio)
    new_height = int(orig_height * ratio)
    
    img = img.resize((new_width, new_height), Image.LANCZOS)
    
    paste_x = (width - new_width) // 2
    paste_y = (height - new_height) // 2
    
    if img.mode == 'RGBA':
        splash.paste(img, (paste_x, paste_y), img)
    else:
        splash.paste(img, (paste_x, paste_y))
    
    splash.save(output_path, 'PNG', quality=95)
    print(f"Created {output_path} ({width}x{height})")

npp_green = (58, 79, 65)
paintpros_gold = (180, 144, 80)

npp_logo = "attached_assets/Logo_NPP_Vertical_Light_1_(1)_1765698097222.JPG"
paintpros_mascot = "client/public/icons/icon-512.png"

npp_output = "client/public/pwa/npp"
paintpros_output = "client/public/pwa/paintpros"

print("Generating NPP icons...")
create_square_icon(npp_logo, f"{npp_output}/icon-192.png", 192, npp_green)
create_square_icon(npp_logo, f"{npp_output}/icon-512.png", 512, npp_green)
create_splash_screen(npp_logo, f"{npp_output}/splash-1024.png", 1024, 1024, npp_green)

print("\nGenerating PaintPros icons...")
create_square_icon(paintpros_mascot, f"{paintpros_output}/icon-192.png", 192, paintpros_gold)
create_square_icon(paintpros_mascot, f"{paintpros_output}/icon-512.png", 512, paintpros_gold)
create_splash_screen(paintpros_mascot, f"{paintpros_output}/splash-1024.png", 1024, 1024, paintpros_gold)

print("\nDone! PWA icons generated for both tenants.")
