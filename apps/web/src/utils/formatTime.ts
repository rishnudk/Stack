import { format, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";

export function formatPostTime(date: Date) {
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  // If posted today and less than 60 minutes ago
  if (minutes < 60) {
    return `${minutes}m`;
  }

  // If posted today but more than 1 hour
  if (hours < 24) {
    return `${hours}h`;
  }

  // If older than 1 day → show date like "Nov 18"
  return format(date, "MMM d");
}
