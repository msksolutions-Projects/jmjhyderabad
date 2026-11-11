"""Verify every client-approved photo and every referenced website media path."""

import json
import re
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = json.loads((ROOT / "tools" / "drive_inventory.json").read_text())
GALLERY = json.loads((ROOT / "public" / "data" / "gallery.json").read_text())
PUBLIC = ROOT / "public"
# Folders added from local uploads (not in the Drive inventory). Count = photos in each.
LOCAL_FOLDERS = {"jmj-subodha": 27, "senior-sisters-day-2025": 78, "jubilee-2025": 44, "pc-installation": 35, "jubilee-2024": 27, "temporary-profession-2025": 5, "temporary-profession-2026": 23, "lgbtq-2025": 8, "ps-installation-2024": 79}

expected = {
    f"{folder['slug']}-{file['id']}"
    for folder in SOURCE
    for file in folder["files"]
    if file["mimeType"].startswith("image/")
}
actual = [photo["id"] for photo in GALLERY["images"] if photo["category"] not in LOCAL_FOLDERS]
assert len(expected) == len(actual), f"Expected {len(expected)} photos; manifest contains {len(actual)}"
assert set(actual) == expected, "Missing or unapproved file IDs in gallery manifest"
assert len(actual) == len(set(actual)), "Duplicate photo IDs in manifest"

counts = Counter(photo["category"] for photo in GALLERY["images"])
drive_categories = [c for c in GALLERY["categories"] if c["id"] not in LOCAL_FOLDERS]
assert len(drive_categories) == len(SOURCE) == 12
for slug, count in LOCAL_FOLDERS.items():
    category = next(c for c in GALLERY["categories"] if c["id"] == slug)
    assert category["count"] == counts[slug] == count, f"Local folder {slug}: expected {count} photos"
for source_folder, category in zip(SOURCE, drive_categories):
    assert category["id"] == source_folder["slug"]
    assert category["count"] == counts[category["id"]] == source_folder["imageCount"]

variants = []
for photo in GALLERY["images"]:
    for field in ("src", "thumbnail"):
        path = PUBLIC / photo[field].lstrip("/")
        assert path.is_file(), f"Missing {field}: {photo['id']} → {path}"
        assert path.stat().st_size > 100, f"Empty asset: {path}"
        with Image.open(path) as image:
            image.verify()
        variants.append(path)
    with Image.open(PUBLIC / photo["src"].lstrip("/")) as large:
        assert large.size == (photo["width"], photo["height"])

# Check explicitly referenced editorial images (outside gallery.json).
code = "\n".join(path.read_text(errors="replace") for path in (ROOT / "src").rglob("*.tsx"))
refs = set(re.findall(r'/(?:brand|media/client-2026)/[A-Za-z0-9_./-]+\.(?:webp|png|svg)', code))
for ref in refs:
    assert (PUBLIC / ref.lstrip("/")).is_file(), f"Editorial image missing: {ref}"

assert not (PUBLIC / "media" / "gallery").exists(), "The old gallery media tree is still published"
assert not list((PUBLIC / "brand").glob("*.webp")), "Old branded photographs remain in public/brand"

source_bytes = sum(int(file["size"]) for folder in SOURCE for file in folder["files"] if file["mimeType"].startswith("image/"))
optimized_bytes = sum(path.stat().st_size for path in variants)
photos_per_folder = ", ".join(f"{folder['slug']}: {folder['imageCount']}" for folder in SOURCE)
print(f"LOCAL folders: {LOCAL_FOLDERS}")
print(f"VERIFIED {len(actual)} of {len(expected)} photos, {len(GALLERY['categories'])} filters, {len(variants)} valid WebP assets")
print(photos_per_folder)
print(f"Original total: {source_bytes / 1048576:.1f} MiB")
print(f"Optimized total: {optimized_bytes / 1048576:.1f} MiB ({optimized_bytes / source_bytes:.1%} of original)")
print(f"Editorial media references: {len(refs)} — all files exist")
print("Old gallery and brand photos: not published")
