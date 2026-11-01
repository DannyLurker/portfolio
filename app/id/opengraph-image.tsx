import { createHomeSocialCard } from "@/lib/seo/social-card"

export const alt = "Portfolio social preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return createHomeSocialCard("id")
}
