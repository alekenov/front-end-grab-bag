
export const TEST_CHATS = [
  {
    id: '1',
    name: 'Техподдержка',
    aiEnabled: true,
    unreadCount: 2,
    lastMessage: {
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date().toISOString()
    },
    source: 'web'
  },
  {
    id: '2',
    name: 'Иван Петров',
    aiEnabled: false,
    unreadCount: 0,
    lastMessage: {
      content: 'Спасибо за помощь!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // вчера
    },
    source: 'whatsapp'
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    aiEnabled: true,
    unreadCount: 5,
    lastMessage: {
      content: 'Когда будет доставка?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 часа назад
    },
    source: 'telegram'
  },
  {
    id: '4',
    name: 'Анна Иванова',
    aiEnabled: true,
    unreadCount: 3,
    lastMessage: {
      content: 'Можете подобрать букет на день рождения?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 часов назад
    },
    source: 'web'
  },
  {
    id: '5',
    name: 'Сергей Соколов',
    aiEnabled: false,
    unreadCount: 0,
    lastMessage: {
      content: 'Заказ успешно доставлен! Спасибо.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 дня назад
    },
    source: 'phone'
  },
  {
    id: '6',
    name: 'Елена Кузнецова',
    aiEnabled: true,
    unreadCount: 1,
    lastMessage: {
      content: 'Подскажите адрес магазина',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 минут назад
    },
    source: 'whatsapp'
  },
  {
    id: '7',
    name: 'Максим Григорьев',
    aiEnabled: false,
    unreadCount: 7,
    lastMessage: {
      content: 'Возможен ли возврат?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 час назад
    },
    source: 'telegram'
  },
  {
    id: '8',
    name: 'Алёна Морозова',
    aiEnabled: true,
    unreadCount: 0,
    lastMessage: {
      content: 'Букет за 8500 ₸',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 часов назад
      hasProduct: true,
      price: 8500
    },
    source: 'web'
  },
  {
    id: '9',
    name: 'Николай Волков',
    aiEnabled: false,
    unreadCount: 2,
    lastMessage: {
      content: 'Какие цветы есть в наличии?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 часа назад
    },
    source: 'whatsapp'
  },
  {
    id: '10',
    name: 'Ольга Смирнова',
    aiEnabled: true,
    unreadCount: 0,
    lastMessage: {
      content: 'Букет за 12000 ₸',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
      hasProduct: true,
      price: 12000
    },
    source: 'phone'
  },
  {
    id: '11',
    name: 'Дмитрий Попов',
    aiEnabled: false,
    unreadCount: 4,
    lastMessage: {
      content: 'Можно ли добавить открытку к букету?',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 часов назад
    },
    source: 'telegram'
  },
  {
    id: '12',
    name: 'Юлия Васильева',
    aiEnabled: true,
    unreadCount: 0,
    lastMessage: {
      content: 'Спасибо за прекрасный сервис',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 дней назад
    },
    source: 'web'
  },
  {
    id: '13',
    name: 'Артём Новиков',
    aiEnabled: false,
    unreadCount: 3,
    lastMessage: {
      content: 'Есть ли доставка в пригород?',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 часов назад
    },
    source: 'whatsapp'
  },
  {
    id: '14',
    name: 'Светлана Козлова',
    aiEnabled: true,
    unreadCount: 1,
    lastMessage: {
      content: 'Букет за 5000 ₸',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 часов назад
      hasProduct: true,
      price: 5000
    },
    source: 'phone'
  },
  {
    id: '15',
    name: 'Евгений Лебедев',
    aiEnabled: false,
    unreadCount: 0,
    lastMessage: {
      content: 'Заказ оформлен, жду доставку',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 минут назад
    },
    source: 'telegram'
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
    },
    {
      id: '1-5',
      content: 'У вас возникла проблема с доставкой?',
      role: 'BOT',
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString()
    },
    {
      id: '1-6',
      content: 'Да, курьер не приехал в указанное время',
      role: 'USER',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: '1-7',
      content: 'Приносим извинения за задержку. Курьер будет у вас через 15 минут. В качестве компенсации мы добавим к вашему заказу комплимент.',
      role: 'BOT',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '1-8',
      content: 'Спасибо за понимание!',
      role: 'USER',
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: '2-1',
      content: 'Здравствуйте, можно узнать статус заказа?',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2-2',
      content: 'Добрый день! Конечно, подскажите номер заказа',
      role: 'BOT',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '2-3',
      content: 'Заказ №67890',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '2-4',
      content: 'Ваш заказ уже в пути, ожидайте доставку в течение часа',
      role: 'BOT',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '2-5',
      content: 'Заказ доставлен?',
      role: 'USER',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2-6',
      content: 'Да, заказ успешно доставлен',
      role: 'BOT',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '2-7',
      content: 'Все было отлично, большое спасибо!',
      role: 'USER',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '2-8',
      content: 'Спасибо за помощь!',
      role: 'USER',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    }
  ],
  '3': [
    {
      id: '3-1',
      content: 'Здравствуйте, когда будет доставка заказа №54321?',
      role: 'USER',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3-2',
      content: 'Добрый день! Ваш заказ будет доставлен сегодня с 14:00 до 16:00',
      role: 'BOT',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '3-3',
      content: 'А можно уточнить адрес доставки?',
      role: 'USER',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '3-4',
      content: 'Конечно, доставка будет по адресу: ул. Абая, 42, кв. 15',
      role: 'BOT',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '3-5',
      content: 'Это правильный адрес. А можно оплатить картой при получении?',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3-6',
      content: 'Да, при получении можно оплатить картой или наличными',
      role: 'BOT',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '3-7',
      content: 'Отлично, спасибо!',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '3-8',
      content: 'Когда будет доставка?',
      role: 'USER',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  '4': [
    {
      id: '4-1',
      content: 'Здравствуйте! Можете подобрать букет на день рождения?',
      role: 'USER',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4-2',
      content: 'Добрый день! Конечно! Кому предназначен букет и какой у вас бюджет?',
      role: 'BOT',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '4-3',
      content: 'Для мамы, бюджет около 10000 тенге',
      role: 'USER',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '4-4',
      content: 'Отличный выбор! Для мамы можем предложить красивый букет из роз и хризантем. Также можем добавить орхидею для особого акцента.',
      role: 'BOT',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '4-5',
      content: 'Звучит замечательно! Можно фото похожих букетов?',
      role: 'USER',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4-6',
      content: 'Конечно! Отправляю примеры. Какой вариант вам больше нравится?',
      role: 'BOT',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '4-7',
      content: 'Третий вариант очень красивый! Его и закажу.',
      role: 'USER',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '4-8',
      content: 'Отличный выбор! Оформляю заказ. На когда вам нужна доставка?',
      role: 'BOT',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
    },
    {
      id: '4-9',
      content: 'На завтра к 12:00, пожалуйста',
      role: 'USER',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString()
    }
  ],
  '5': [
    {
      id: '5-1',
      content: 'Добрый день! Мне нужен букет на свадьбу',
      role: 'USER',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5-2',
      content: 'Здравствуйте! Поздравляем с предстоящим торжеством! Какие цветы предпочитает невеста?',
      role: 'BOT',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '5-3',
      content: 'Она любит белые лилии и розы',
      role: 'USER',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '5-4',
      content: 'Отличный выбор! Можем создать элегантный свадебный букет из белых лилий и роз с зеленью и декоративными элементами.',
      role: 'BOT',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '5-5',
      content: 'Сколько это будет стоить?',
      role: 'USER',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
    },
    {
      id: '5-6',
      content: 'Свадебный букет из белых лилий и роз будет стоить 25000 тенге',
      role: 'BOT',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString()
    },
    {
      id: '5-7',
      content: 'Хорошо, я заказываю',
      role: 'USER',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5-8',
      content: 'Отлично! Ваш заказ принят. Букет будет готов к указанной дате. Спасибо за доверие!',
      role: 'BOT',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '5-9',
      content: 'Заказ успешно доставлен! Спасибо.',
      role: 'USER',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    }
  ],
  '6': [
    {
      id: '6-1',
      content: 'Добрый день! Подскажите адрес вашего магазина',
      role: 'USER',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: '6-2',
      content: 'Здравствуйте! Наш магазин находится по адресу: ул. Достык, 128, ТЦ "Цветочный"',
      role: 'BOT',
      timestamp: new Date(Date.now() - 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '6-3',
      content: 'А какой у вас режим работы?',
      role: 'USER',
      timestamp: new Date(Date.now() - 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '6-4',
      content: 'Мы работаем ежедневно с 9:00 до 20:00 без перерывов',
      role: 'BOT',
      timestamp: new Date(Date.now() - 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '6-5',
      content: 'Спасибо! А есть ли у вас парковка?',
      role: 'USER',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: '6-6',
      content: 'Да, возле ТЦ есть бесплатная парковка для посетителей',
      role: 'BOT',
      timestamp: new Date(Date.now() - 45 * 60 * 1000 + 5 * 60 * 1000).toISOString()
    },
    {
      id: '6-7',
      content: 'Отлично! Планирую заехать сегодня',
      role: 'USER',
      timestamp: new Date(Date.now() - 45 * 60 * 1000 + 10 * 60 * 1000).toISOString()
    },
    {
      id: '6-8',
      content: 'Будем рады вас видеть! Если нужна будет консультация, наши флористы с удовольствием помогут.',
      role: 'BOT',
      timestamp: new Date(Date.now() - 45 * 60 * 1000 + 15 * 60 * 1000).toISOString()
    },
    {
      id: '6-9',
      content: 'Подскажите адрес магазина',
      role: 'USER',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ],
  '7': Array.from({length: 9}, (_, i) => ({
    id: `7-${i+1}`,
    content: i % 2 === 0 
      ? `Это сообщение от пользователя номер ${i+1}` 
      : `Это ответ бота на сообщение номер ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (9-i) * 10 * 60 * 1000).toISOString()
  })),
  '8': Array.from({length: 8}, (_, i) => ({
    id: `8-${i+1}`,
    content: i % 2 === 0 
      ? `Вопрос пользователя о букетах ${i+1}` 
      : `Ответ флориста с информацией о букете ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000).toISOString()
  })),
  '9': Array.from({length: 8}, (_, i) => ({
    id: `9-${i+1}`,
    content: i % 2 === 0 
      ? `Запрос клиента о наличии цветов ${i+1}` 
      : `Информация о доступных цветах ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (8-i) * 30 * 60 * 1000).toISOString()
  })),
  '10': Array.from({length: 9}, (_, i) => {
    if (i === 8) {
      return {
        id: `10-9`,
        content: "Букет за 12000 ₸",
        role: "BOT",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        product: {
          id: "prod-1",
          imageUrl: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
          price: 12000
        }
      };
    }
    return {
      id: `10-${i+1}`,
      content: i % 2 === 0 
        ? `Вопрос о премиальных букетах ${i+1}` 
        : `Описание премиального букета ${i}`,
      role: i % 2 === 0 ? 'USER' : 'BOT',
      timestamp: new Date(Date.now() - (3 * 24 - i) * 60 * 60 * 1000).toISOString()
    };
  }),
  '11': Array.from({length: 8}, (_, i) => ({
    id: `11-${i+1}`,
    content: i % 2 === 0 
      ? `Запрос о дополнительных услугах ${i+1}` 
      : `Информация о дополнительных услугах ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (12-i) * 60 * 60 * 1000).toISOString()
  })),
  '12': Array.from({length: 8}, (_, i) => ({
    id: `12-${i+1}`,
    content: i % 2 === 0 
      ? `Отзыв клиента о сервисе ${i+1}` 
      : `Благодарность за отзыв ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (6 * 24 - i) * 60 * 60 * 1000).toISOString()
  })),
  '13': Array.from({length: 9}, (_, i) => ({
    id: `13-${i+1}`,
    content: i % 2 === 0 
      ? `Вопрос о зоне доставки ${i+1}` 
      : `Информация о доставке ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (16-i) * 60 * 60 * 1000).toISOString()
  })),
  '14': Array.from({length: 8}, (_, i) => {
    if (i === 7) {
      return {
        id: `14-8`,
        content: "Букет за 5000 ₸",
        role: "BOT",
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        product: {
          id: "prod-2",
          imageUrl: "https://images.unsplash.com/photo-1561181286-d5c66c9a6dd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
          price: 5000
        }
      };
    }
    return {
      id: `14-${i+1}`,
      content: i % 2 === 0 
        ? `Вопрос о бюджетных вариантах ${i+1}` 
        : `Предложение бюджетного варианта ${i}`,
      role: i % 2 === 0 ? 'USER' : 'BOT',
      timestamp: new Date(Date.now() - (14-i) * 60 * 60 * 1000).toISOString()
    };
  }),
  '15': Array.from({length: 9}, (_, i) => ({
    id: `15-${i+1}`,
    content: i % 2 === 0 
      ? `Вопрос о статусе заказа ${i+1}` 
      : `Информация о статусе заказа ${i}`,
    role: i % 2 === 0 ? 'USER' : 'BOT',
    timestamp: new Date(Date.now() - (120-i*10) * 60 * 1000).toISOString()
  }))
};

// Добавляем тестовые данные для демо-чата
export const DEMO_MESSAGES = [
  {
    id: "demo-msg-1",
    content: "Здравствуйте! Чем я могу помочь вам сегодня?",
    role: "BOT",
    timestamp: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: "demo-msg-2",
    content: "Я хотел бы узнать о доставке цветов",
    role: "USER",
    timestamp: new Date(Date.now() - 3 * 60000).toISOString()
  },
  {
    id: "demo-msg-3",
    content: "Мы осуществляем доставку ежедневно с 9:00 до 21:00. Стандартная доставка занимает 2-3 часа с момента подтверждения заказа. Также доступна экспресс-доставка в течение 1 часа за дополнительную плату.",
    role: "BOT",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString()
  },
  {
    id: "demo-msg-4",
    content: "А сколько стоит доставка?",
    role: "USER",
    timestamp: new Date(Date.now() - 1 * 60000).toISOString()
  },
  {
    id: "demo-msg-5",
    content: "Стандартная доставка по городу стоит 1000 тенге. Экспресс-доставка в течение 1 часа - 2500 тенге. Доставка за город рассчитывается индивидуально в зависимости от расстояния.",
    role: "BOT",
    timestamp: new Date().toISOString()
  },
  {
    id: "demo-msg-6",
    content: "Спасибо за информацию!",
    role: "USER",
    timestamp: new Date(Date.now() + 10000).toISOString()
  },
  {
    id: "demo-msg-7",
    content: "Всегда рады помочь! Если у вас возникнут дополнительные вопросы, обращайтесь.",
    role: "BOT",
    timestamp: new Date(Date.now() + 20000).toISOString()
  }
];

