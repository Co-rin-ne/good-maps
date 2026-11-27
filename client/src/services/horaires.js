// Mise en forme des horaires des lieux

// "17:00" -> "17h", "09:30" -> "9h30"
export function formaterHeure(heure) {
  const [heures, minutes] = heure.split(':')
  return `${Number(heures)}h${minutes === '00' ? '' : minutes}`
}
