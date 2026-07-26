from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "review" / "ai-label-samples"
LABEL = "图片由 AI 生成，仅供参考"

SAMPLES = [
    ROOT / "images" / "news1.png",
    ROOT / "images" / "news4.png",
    ROOT / "images" / "news_changgao_visit.png",
]

FINAL_ASSETS = [
    ROOT / "images" / "news1.png",
    ROOT / "images" / "news3.png",
    ROOT / "images" / "news4.png",
    ROOT / "images" / "news_changgao_visit.png",
    ROOT / "assets" / "vip-list.png",
    ROOT / "media" / "cwb-112304.png",
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    font_name = "msyhbd.ttc" if bold else "msyh.ttc"
    font_path = Path("C:/Windows/Fonts") / font_name
    return ImageFont.truetype(str(font_path), size=size)


def add_label(source: Path, destination: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    width, height = image.size
    scale = max(0.75, width / 1024)
    font = load_font(round(16 * scale), bold=False)

    padding_x = round(13 * scale)
    padding_y = round(8 * scale)
    margin = round(14 * scale)
    radius = round(9 * scale)
    border_width = 1

    scratch = ImageDraw.Draw(image)
    text_box = scratch.textbbox((0, 0), LABEL, font=font)
    text_width = text_box[2] - text_box[0]
    text_height = text_box[3] - text_box[1]
    badge_width = text_width + padding_x * 2
    badge_height = text_height + padding_y * 2
    left = width - margin - badge_width
    top = height - margin - badge_height
    right = width - margin
    bottom = height - margin

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (left + 2, top + 3, right + 2, bottom + 3),
        radius=radius,
        fill=(15, 10, 35, 65),
    )
    draw.rounded_rectangle(
        (left, top, right, bottom),
        radius=radius,
        fill=(40, 26, 74, 168),
        outline=(190, 151, 255, 180),
        width=border_width,
    )
    draw.text(
        (left + padding_x, top + padding_y - text_box[1]),
        LABEL,
        font=font,
        fill=(255, 255, 255, 255),
    )

    labeled = Image.alpha_composite(image, overlay).convert("RGB")
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.suffix.lower() == ".png":
        labeled.save(destination, optimize=True)
    else:
        labeled.save(destination, quality=95)
    return labeled


def make_contact_sheet(items: list[tuple[str, Image.Image]]) -> None:
    card_width = 1024
    title_height = 64
    gap = 24
    outer = 32
    card_height = title_height + 558
    sheet_height = outer * 2 + len(items) * card_height + (len(items) - 1) * gap
    sheet = Image.new("RGB", (card_width + outer * 2, sheet_height), "#f1f5f9")
    draw = ImageDraw.Draw(sheet)
    title_font = load_font(25, bold=True)

    y = outer
    for title, image in items:
        draw.rounded_rectangle(
            (outer, y, outer + card_width, y + card_height),
            radius=18,
            fill="#ffffff",
        )
        draw.text((outer + 22, y + 16), title, font=title_font, fill="#1e293b")
        preview = image.copy()
        preview.thumbnail((card_width, 558), Image.Resampling.LANCZOS)
        image_y = y + title_height + (558 - preview.height) // 2
        sheet.paste(preview, (outer + (card_width - preview.width) // 2, image_y))
        y += card_height + gap

    sheet.save(OUTPUT_DIR / "ai-label-samples-contact-sheet.jpg", quality=92)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    labeled_images: list[tuple[str, Image.Image]] = []
    for index, source in enumerate(SAMPLES, start=1):
        destination = OUTPUT_DIR / f"{index:02d}-{source.stem}-ai-labeled.jpg"
        labeled = add_label(source, destination)
        labeled_images.append((f"样例 {index} · {source.name}", labeled))
    make_contact_sheet(labeled_images)

    for source in FINAL_ASSETS:
        destination = source.with_name(f"{source.stem}-ai-labeled.png")
        add_label(source, destination)


if __name__ == "__main__":
    main()
