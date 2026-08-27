/** "3 days ago", "2 hours ago", "yesterday" */
export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

/** "OCTOBER 24, 2024" — the composer's date badge, uppercase to match the design. */
export function longDateLabel(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'TODAY'
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
}

/** Groups memories by calendar day, newest day first, newest item first within a day. */
export function groupByDay<T extends { createdAt: string }>(items: T[]): Array<[string, T[]]> {
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const groups = new Map<string, T[]>()
  for (const item of sorted) {
    const key = new Date(item.createdAt).toDateString()
    const bucket = groups.get(key)
    if (bucket) bucket.push(item)
    else groups.set(key, [item])
  }
  return Array.from(groups.entries()).map(([key, bucket]) => [longDateLabel(bucket[0].createdAt), bucket])
}

/** 194 -> "3:14" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** "OCTOBER 24, 2024" — uppercase month day year. */
export function fullDateUpper(iso: string): string {
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

/** "SEP 04, 2023" — short month. */
export function shortDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

/** "LAST EDITED 2 DAYS AGO" */
export function lastEditedLabel(iso: string): string {
  return `LAST EDITED ${relativeTime(iso).toUpperCase()}`
}
