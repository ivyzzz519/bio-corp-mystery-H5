from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PROOF_DIR = ROOT / "review" / "taptap-ai-proof"
OUTPUT = PROOF_DIR / "taptap-ai-proof-contact-sheet.jpg"

ITEMS = [
    ("证明 1 · 园区调研新闻", "01-news1-page.png"),
    ("证明 2 · 湖山县区情图片", "02-news3-page.png"),
    ("证明 3 · 医院赠旗新闻", "03-news4-page.png"),
    ("证明 4 · 市长调研新闻", "04-mayor-page.png"),
    ("证明 5 · 日记中的名单截图", "05-vip-diary-page.png"),
    ("证明 6 · 影子档案汇款单", "06-archive-receipt-page.png"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "msyhbd.ttc" if bold else "msyh.ttc"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size=size)


def main() -> None:
    column_width = 460
    gap = 24
    outer = 32
    title_height = 54
    card_padding = 14
    images = [(title, Image.open(PROOF_DIR / filename).convert("RGB")) for title, filename in ITEMS]

    row_heights: list[int] = []
    prepared: list[tuple[str, Image.Image]] = []
    for title, image in images:
        target_width = column_width - card_padding * 2
        target_height = round(image.height * target_width / image.width)
        prepared.append((title, image.resize((target_width, target_height), Image.Resampling.LANCZOS)))
    for row in range(3):
        pair = prepared[row * 2 : row * 2 + 2]
        row_heights.append(max(image.height for _, image in pair) + title_height + card_padding * 2)

    width = outer * 2 + column_width * 2 + gap
    height = outer * 2 + sum(row_heights) + gap * 2
    sheet = Image.new("RGB", (width, height), "#eef2f7")
    draw = ImageDraw.Draw(sheet)
    title_font = font(20, bold=True)

    y = outer
    for row in range(3):
        row_height = row_heights[row]
        for col in range(2):
            title, image = prepared[row * 2 + col]
            x = outer + col * (column_width + gap)
            draw.rounded_rectangle((x, y, x + column_width, y + row_height), radius=16, fill="#ffffff")
            draw.text((x + card_padding, y + 15), title, font=title_font, fill="#1e293b")
            sheet.paste(image, (x + card_padding, y + title_height))
        y += row_height + gap

    sheet.save(OUTPUT, quality=88, optimize=True)


if __name__ == "__main__":
    main()
