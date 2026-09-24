const DAY = 86_400_000
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const startOfDay = (t: number) => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Compact age for lists: "now", "5m", "3h", "Tue", "Sep 19". */
export function ago(t: number, now = Date.now()) {
  const mins = Math.floor((now - t) / 60_000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  if (mins < 24 * 60) return `${Math.floor(mins / 60)}h`
  const d = new Date(t)
  if (now - t < 7 * DAY) return WEEKDAYS[d.getDay()]!
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** Clock time, e.g. "4:07 PM". */
export function clock(t: number) {
  const d = new Date(t)
  const h = d.getHours()
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/** Day separator label: "Today", "Yesterday", "Tuesday", "Sep 19". */
export function dayLabel(t: number, now = Date.now()) {
  const diff = Math.round((startOfDay(now) - startOfDay(t)) / DAY)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  const d = new Date(t)
  if (diff < 7) return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]!
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

export const sameDay = (a: number, b: number) => startOfDay(a) === startOfDay(b)
