
/**
 * Форматирует дату для группировки сообщений
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    // Проверка на сегодня
    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    }
    
    // Проверка на вчера
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    }
    
    // Остальные даты
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Неизвестная дата";
  }
};

/**
 * Форматирует время для отображения в сообщении
 */
export const formatMessageTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting message time:', error);
    return "--:--";
  }
};

// Алиас для обратной совместимости
export const formatTime = formatMessageTime;

/**
 * Форматирует относительное время для последнего сообщения в списке чатов
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "только что";
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} мин. назад`;
    }
    
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ч. назад`;
    }
    
    if (diffInSeconds < 172800) {
      return "вчера";
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return "неизвестно";
  }
};
