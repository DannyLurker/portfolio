import { isLocale, type Locale } from "./locales"

export function swapLocalePath(pathname: string, nextLocale: Locale): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  const segments = path.split("/").filter(Boolean)

  if (segments.length === 0) {
    return `/${nextLocale}`
  }

  const [first, ...rest] = segments

  if (isLocale(first)) {
    return rest.length === 0 ? `/${nextLocale}` : `/${nextLocale}/${rest.join("/")}`
  }

  return `/${nextLocale}/${segments.join("/")}`
}

