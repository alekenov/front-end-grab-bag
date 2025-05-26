
// Экспортируем все хуки для работы с чатами
export { useChatApi } from './useChatApi';
export type { ChatApiHook } from './types';
export { useMessages } from './useMessages';
export { useSendMessage } from './useSendMessage';
export { useChats } from './useChats';
export { useToggleAI } from './useToggleAI';

// Новые хуки для улучшенной архитектуры
export { useChatNavigation } from './useChatNavigation';
export { useProductSelection } from './useProductSelection';
export { useChatUpdates } from './useChatUpdates';
