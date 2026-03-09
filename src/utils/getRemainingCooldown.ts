export function getRemainingCooldown(lastUsed: number, cooldown: number) {
  const now = Date.now()
  const remaining = cooldown - (now - lastUsed)

  if (remaining <= 0) return null

  const hours = Math.floor(remaining / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')

  return { hours, minutes, seconds }
}
