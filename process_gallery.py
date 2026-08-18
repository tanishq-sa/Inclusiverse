import os
import json
from pathlib import Path
from PIL import Image
import pillow_heif

pillow_heif.register_heif_opener()

source_dir = Path("temp_downloads")
target_dir = Path("public/gallery")
target_dir.mkdir(parents=True, exist_ok=True)

supported = ['.heic', '.jpg', '.jpeg', '.png', '.webp']
gallery_data = []

for file_path in source_dir.rglob('*'):
    if file_path.is_file():
        ext = file_path.suffix.lower()
        if ext in supported:
            output_filename = file_path.stem + '.webp'
            output_path = target_dir / output_filename
            
            try:
                with Image.open(file_path) as img:
                    if img.mode in ('RGBA', 'P') and ext != '.webp':
                        img = img.convert('RGB')
                    img.save(output_path, 'WEBP', quality=85)
                    
                    gallery_data.append({
                        "src": f"/gallery/{output_filename}",
                        "alt": file_path.stem.replace('-', ' ').replace('_', ' '),
                        "caption": file_path.stem.replace('-', ' ').replace('_', ' ').title(),
                        "cat": "All"
                    })
            except Exception as e:
                pass

with open("gallery_data.json", "w") as f:
    json.dump(gallery_data, f)
print(f"Processed {len(gallery_data)} images.")
