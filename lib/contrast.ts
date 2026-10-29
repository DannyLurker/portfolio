const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function parseHex(value: string): [number, number, number] | null {
  const match = HEX_PATTERN.exec(value.trim())
  if (!match) return null

  const digits =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : match[1]

  return [0, 2, 4].map((offset) =>
    Number.parseInt(digits.slice(offset, offset + 2), 16)
  ) as [number, number, number]
}

function channel(value: number): number {
  const ratio = value / 255
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(color: string): number | null {
  const rgb = parseHex(color)
  if (!rgb) return null

  const [red, green, blue] = rgb.map(channel)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function contrastRatio(background: string, color: string): number | null {
  const backgroundLuminance = relativeLuminance(background)
  const colorLuminance = relativeLuminance(color)

  if (backgroundLuminance === null || colorLuminance === null) return null

  const lighter = Math.max(backgroundLuminance, colorLuminance)
  const darker = Math.min(backgroundLuminance, colorLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

export function formatContrast(background: string, color: string): string {
  const ratio = contrastRatio(background, color)
  return ratio === null ? "not measurable" : `${ratio.toFixed(2)}:1`
}
