export function formatRelativeTime(timestamp: number, locale: string = "ru"): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return locale === "ru" ? "Только что" : locale === "kk" ? "Жаңа ғана" : "Just now";
  }
  if (diffMinutes < 60) {
    return locale === "ru"
      ? `${diffMinutes} мин. назад`
      : locale === "kk"
      ? `${diffMinutes} мин бұрын`
      : `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return locale === "ru"
      ? `${diffHours} ч. назад`
      : locale === "kk"
      ? `${diffHours} сағ бұрын`
      : `${diffHours}h ago`;
  }
  return locale === "ru"
    ? `${diffDays} дн. назад`
    : locale === "kk"
    ? `${diffDays} күн бұрын`
    : `${diffDays}d ago`;
}

export function formatFullDate(timestamp: number, locale: string = "ru"): string {
  const date = new Date(timestamp);
  const lang = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  return date.toLocaleString(lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
