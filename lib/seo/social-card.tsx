import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { cacheLife } from "next/cache"
import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { getProfile, getProjectBySlug } from "@/lib/content"
import { socialImageSize } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/locales"

const fontPath = join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
  "Geist-Regular.ttf",
)

async function readAssetAsBase64(path: string) {
  "use cache"
  cacheLife("max")

  return (await readFile(path)).toString("base64")
}

async function createImageResponse(element: React.ReactElement) {
  const geist = Buffer.from(await readAssetAsBase64(fontPath), "base64")

  return new ImageResponse(element, {
    ...socialImageSize,
    fonts: [{ name: "Geist", data: geist, style: "normal", weight: 400 }],
  })
}

function CardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 36,
        backgroundColor: "#0a0a0c",
        color: "#f8fafc",
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          border: "1px solid #1e2029",
          borderRadius: 12,
          backgroundColor: "#111216",
          padding: 42,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function createHomeSocialCard(locale: Locale) {
  const profile = getProfile(locale)

  return createImageResponse(
    <CardFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 5,
            borderRadius: 4,
            backgroundColor: "#3b82f6",
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 82,
            fontWeight: 400,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            maxWidth: 880,
            margin: 0,
            color: "#94a3b8",
            fontSize: 34,
            lineHeight: 1.3,
          }}
        >
          {profile.role}
        </p>
      </div>
    </CardFrame>,
  )
}

export async function createProjectSocialCard(locale: Locale, slug: string) {
  const project = getProjectBySlug(locale, slug)
  if (!project) notFound()

  const imagePath = join(process.cwd(), "public", project.cover.src.slice(1))
  const coverData = `data:image/png;base64,${await readAssetAsBase64(imagePath)}`

  return createImageResponse(
    <CardFrame>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 520,
            gap: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 4,
              backgroundColor: "#3b82f6",
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 49,
              fontWeight: 400,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: 22,
              lineHeight: 1.35,
            }}
          >
            {project.summary}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse rasterizes this local asset. */}
        <img
          src={coverData}
          alt={project.cover.alt}
          width={490}
          height={450}
          style={{
            width: 490,
            height: 450,
            objectFit: "cover",
            border: "1px solid #1e2029",
            borderRadius: 8,
          }}
        />
      </div>
    </CardFrame>,
  )
}
