
import { format, formatDistance, isToday, isYesterday, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

/**
 * Форматирует дату в зависимости от того, когда она была
 */
export const formatDate = (dateString: string): string => {
  const date = typeof dateString === "string" 
    ? parseISO(dateString) 
    : new Date(dateString);
  
  if (isToday(date)) {
    return "Сегодня";
  } else if (isYesterday(date)) {
    return "Вчера";
  } else {
    return format(date, "d MMMM", { locale: ru });
  }
};

/**
 * Форматирует время для отображения в относительном формате
 * (только что, 5 минут назад, вчера и т.д.)
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = typeof dateString === "string"
      ? parseISO(dateString)
      : new Date(dateString);
    
    // Если дата в текущий день, возвращаем только время
    if (isToday(date)) {
      return format(date, "HH:mm");
    } 
    // Если вчера, возвращаем "Вчера"
    else if (isYesterday(date)) {
      return "Вчера";
    } 
    // Если в текущем году, возвращаем день и месяц
    else if (date.getFullYear() === new Date().getFullYear()) {
      return format(date, "d MMM", { locale: ru });
    } 
    // Иначе возвращаем полную дату
    else {
      return format(date, "dd.MM.yy", { locale: ru });
    }
  } catch (error) {
    console.error("Ошибка форматирования даты:", error, dateString);
    return "";
  }
};

/**
 * Форматирует время для отображения в чате
 */
export const formatMessageTime = (dateString: string): string => {
  try {
    const date = typeof dateString === "string"
      ? parseISO(dateString)
      : new Date(dateString);
    
    return format(date, "HH:mm");
  } catch (error) {
    console.error("Ошибка форматирования времени сообщения:", error, dateString);
    return "";
  }
};

// Alias for formatMessageTime to make the transition easier
export const formatTime = formatMessageTime;
