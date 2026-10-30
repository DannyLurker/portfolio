import { notFound } from "next/navigation"

// Unmatched paths inside a valid locale reach this segment, which hands off to
// the locale level not-found so the 404 keeps the shell and the route language.
export default function CatchAllPage() {
  notFound()
}
