
export const TEST_CHATS = [
  {
    id: '1',
    name: 'Техподдержка',
    aiEnabled: true,
    unreadCount: 2,
    lastMessage: {
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'Иван Петров',
    aiEnabled: false,
    unreadCount: 0,
    lastMessage: {
      content: 'Спасибо за помощь!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // вчера
    }
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    aiEnabled: true,
    unreadCount: 5,
    lastMessage: {
      content: 'Когда будет доставка?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 часа назад
    }
  }
];

export const TEST_MESSAGES = {
  '1': [
    {
      id: '1-1',
      content: 'Здравствуйте! У меня проблема с заказом',
      role: 'USER',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '1-2',
      content: 'Здравствуйте! Подскажите пожалуйста номер заказа',
      role: 'BOT',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: '1-3',
      content: 'Заказ №12345',
      role: 'USER',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    },
    {
      id: '1-4',
      content: 'Спасибо! Я проверю информацию по вашему заказу. Подождите пару минут.',
      role: 'BOT',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: '2-1',
      content: 'Заказ доставлен?',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2-2',
      content: 'Да, заказ успешно доставлен',
      role: 'BOT',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2-3',
      content: 'Спасибо за помощь!',
      role: 'USER',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '3': [
    {
      id: '3-1',
      content: 'Здравствуйте, когда будет доставка заказа №54321?',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ]
};
