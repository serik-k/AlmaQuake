export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6.0) return "#EF4444"; // Severe red
  if (magnitude >= 4.5) return "#F97316"; // Warning orange
  if (magnitude >= 3.0) return "#EAB308"; // Moderate yellow
  return "#22C55E"; // Minor green
}

export function getSeverityLabel(magnitude: number, locale: string = "ru"): string {
  if (magnitude >= 6.0) {
    return locale === "ru" ? "Сильное" : locale === "kk" ? "Күшті" : "Strong";
  }
  if (magnitude >= 4.5) {
    return locale === "ru" ? "Умеренное" : locale === "kk" ? "Орташа" : "Moderate";
  }
  if (magnitude >= 3.0) {
    return locale === "ru" ? "Слабое" : locale === "kk" ? "Әлсіз" : "Weak";
  }
  return locale === "ru" ? "Незначительное" : locale === "kk" ? "Төмен" : "Minor";
}
