// Main JavaScript for WhatsApp Dashboard
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatList = document.getElementById('chat-list');
  const chatSearch = document.getElementById('chat-search');
  const messagesContainer = document.getElementById('messages-container');
  const messageInput = document.getElementById('message-input');
  const messageInputContainer = document.getElementById('message-input-container');
  const sendButton = document.getElementById('send-button');
  const chatTitle = document.getElementById('chat-title');
  const tabButtons = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const addExampleButton = document.getElementById('add-example-button');
  const exampleModal = document.getElementById('example-modal');
  const closeModalButton = document.querySelector('.close');
  const cancelButton = document.getElementById('cancel-button');
  const exampleForm = document.getElementById('example-form');
  const examplesList = document.getElementById('examples-list');
  const searchExample = document.getElementById('search-example');
  const categoryFilter = document.getElementById('category-filter');
  
  // State
  let currentChatId = null;
  let chats = [];
  let messages = [];
  let trainingExamples = [];
  let aiEnabled = true;
  
  // API Endpoints
  // Используем конфигурацию из config.js
  const API_URL = window.APP_CONFIG?.API_URL || '/api';
  const CHATS_ENDPOINT = API_URL + '/chats';
  const MESSAGES_ENDPOINT = API_URL + '/messages';
  const TRAINING_EXAMPLES_ENDPOINT = API_URL + '/training-examples';
  const CATEGORIES_ENDPOINT = API_URL + '/categories';
  
  console.log('Используем API URL:', API_URL);
  
  // Helper Functions
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString();
    }
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Toast notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<div class="toast-message">' + message + '</div>';
    document.body.appendChild(toast);
    
    setTimeout(function() {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Delete confirmation dialog
  function showDeleteConfirmation(message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'delete-dialog';
    dialog.innerHTML = '<div class="delete-dialog-content"><h3>Подтверждение удаления</h3><p>' + message + '</p><div class="delete-dialog-actions"><button class="secondary-button" id="cancel-delete">Отмена</button><button class="primary-button danger" id="confirm-delete">Удалить</button></div></div>';
    document.body.appendChild(dialog);
    
    setTimeout(function() {
      dialog.classList.add('show');
    }, 10);
    
    document.getElementById('cancel-delete').addEventListener('click', function() {
      dialog.classList.remove('show');
      setTimeout(function() {
        document.body.removeChild(dialog);
      }, 300);
    });
    
    document.getElementById('confirm-delete').addEventListener('click', function() {
      onConfirm();
      dialog.classList.remove('show');
      setTimeout(function() {
        document.body.removeChild(dialog);
      }, 300);
    });
  }
  
  // Fetch Functions
  async function fetchChats() {
    try {
      chatList.innerHTML = '<li class="chat-loading">Загрузка чатов...</li>';
      
      const response = await fetch(CHATS_ENDPOINT);
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      const data = await response.json();
      chats = data;
      
      if (chats.length === 0) {
        chatList.innerHTML = '<li class="no-chats">Нет активных чатов</li>';
        return;
      }
      
      renderChatList(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      chatList.innerHTML = '<li class="chat-error">Ошибка загрузки чатов</li>';
    }
  }
  
  async function fetchMessages(chatId) {
    try {
      const response = await fetch(MESSAGES_ENDPOINT + '/' + chatId);
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      const data = await response.json();
      messages = data;
      
      renderMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      messagesContainer.innerHTML = '<div class="message-error">Ошибка загрузки сообщений</div>';
    }
  }
  
  async function sendMessage(chatId, content) {
    try {
      const response = await fetch(MESSAGES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          content: content,
          aiEnabled: aiEnabled
        }),
      });
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      // Сразу же обновляем сообщения после отправки
      messageInput.value = '';
      await fetchMessages(chatId);
      await updateChatPreview(chatId);
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Ошибка при отправке сообщения', 'error');
    }
  }
  
  async function updateChatPreview(chatId) {
    try {
      // Обновляем только список чатов, чтобы обновить предпросмотр сообщения
      await fetchChats();
      
      // Сохраняем выбранный чат
      if (currentChatId) {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(function(item) {
          if (item.dataset.id === currentChatId) {
            item.classList.add('active');
          }
        });
      }
    } catch (error) {
      console.error('Error updating chat preview:', error);
    }
  }
  
  async function fetchTrainingExamples() {
    try {
      examplesList.innerHTML = '<div class="loading">Загрузка примеров...</div>';
      
      // Получаем категории для выпадающего списка
      const categoriesResponse = await fetch(CATEGORIES_ENDPOINT);
      
      if (!categoriesResponse.ok) {
        throw new Error('HTTP Error: ' + categoriesResponse.status);
      }
      
      const categoriesData = await categoriesResponse.json();
      updateCategoryOptions(categoriesData);
      
      // Получаем примеры обучения
      const examplesResponse = await fetch(TRAINING_EXAMPLES_ENDPOINT);
      
      if (!examplesResponse.ok) {
        throw new Error('HTTP Error: ' + examplesResponse.status);
      }
      
      const examplesData = await examplesResponse.json();
      trainingExamples = examplesData;
      
      if (trainingExamples.length === 0) {
        examplesList.innerHTML = '<div class="no-examples">Нет обучающих примеров</div>';
        return;
      }
      
      renderTrainingExamples(trainingExamples);
    } catch (error) {
      console.error('Error fetching training examples:', error);
      examplesList.innerHTML = '<div class="loading">Ошибка загрузки примеров</div>';
    }
  }
  
  async function createExample(example) {
    try {
      const response = await fetch(TRAINING_EXAMPLES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(example),
      });
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      await fetchTrainingExamples();
      showToast('Пример успешно добавлен');
    } catch (error) {
      console.error('Error creating example:', error);
      showToast('Ошибка при добавлении примера', 'error');
    }
  }
  
  async function updateExample(id, example) {
    try {
      const response = await fetch(TRAINING_EXAMPLES_ENDPOINT + '/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(example),
      });
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      await fetchTrainingExamples();
      showToast('Пример успешно обновлен');
    } catch (error) {
      console.error('Error updating example:', error);
      showToast('Ошибка при обновлении примера', 'error');
    }
  }
  
  async function deleteExample(id) {
    try {
      const response = await fetch(TRAINING_EXAMPLES_ENDPOINT + '/' + id, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('HTTP Error: ' + response.status);
      }
      
      await fetchTrainingExamples();
      showToast('Пример успешно удален');
    } catch (error) {
      console.error('Error deleting example:', error);
      showToast('Ошибка при удалении примера', 'error');
    }
  }
  
  // Render Functions
  function renderChatList(chats) {
    chatList.innerHTML = '';
    
    chats.forEach(function(chat) {
      const chatItem = document.createElement('li');
      chatItem.classList.add('chat-item');
      chatItem.dataset.id = chat.id;
      chatItem.dataset.name = chat.name;
      
      if (chat.id === currentChatId) {
        chatItem.classList.add('active');
      }
      
      // Форматируем дату последнего сообщения
      const lastMessageTime = chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : '';
      
      chatItem.innerHTML = '<div class="chat-details"><span class="chat-name">' + escapeHtml(chat.name) + '</span><span class="chat-preview">' + (chat.lastMessage ? escapeHtml(chat.lastMessage.content.substring(0, 50)) + (chat.lastMessage.content.length > 50 ? '...' : '') : 'Нет сообщений') + '</span></div><div class="chat-meta"><span class="chat-time">' + lastMessageTime + '</span><label class="ai-toggle"><input type="checkbox" class="ai-toggle-input" ' + (chat.aiEnabled ? 'checked' : '') + '><span class="ai-toggle-slider"></span></label></div>';
      
      chatList.appendChild(chatItem);
      
      // Добавляем обработчик для переключателя AI
      const toggle = chatItem.querySelector('.ai-toggle-input');
      toggle.addEventListener('change', async function(e) {
        e.stopPropagation(); // Предотвращаем выбор чата при клике на переключатель
        
        const isChecked = this.checked;
        
        try {
          const response = await fetch(CHATS_ENDPOINT + '/' + chat.id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aiEnabled: isChecked }),
          });
          
          if (!response.ok) {
            throw new Error('HTTP Error: ' + response.status);
          }
          
          // Если это текущий чат, обновляем глобальное состояние
          if (chat.id === currentChatId) {
            aiEnabled = isChecked;
          }
          
          showToast('AI ' + (isChecked ? 'включен' : 'выключен') + ' для чата ' + chat.name);
        } catch (error) {
          console.error('Error updating AI status:', error);
          this.checked = !isChecked; // Возвращаем переключатель в предыдущее состояние
          showToast('Ошибка при обновлении статуса AI', 'error');
        }
      });
      
      // Добавляем обработчик для выбора чата
      chatItem.addEventListener('click', function(e) {
        // Игнорируем клик на переключатель
        if (e.target.classList.contains('ai-toggle-input') || 
            e.target.classList.contains('ai-toggle-slider') ||
            e.target.classList.contains('ai-toggle')) {
          return;
        }
        
        const chatId = this.dataset.id;
        const chatName = this.dataset.name;
        
        // Устанавливаем класс active для выбранного чата
        document.querySelectorAll('.chat-item').forEach(function(item) {
          item.classList.remove('active');
        });
        this.classList.add('active');
        
        // Обновляем текущий чат
        currentChatId = chatId;
        chatTitle.textContent = chatName;
        
        // Проверяем статус AI для данного чата
        aiEnabled = this.querySelector('.ai-toggle-input').checked;
        
        // Загружаем сообщения
        fetchMessages(chatId);
        
        // Отображаем поле ввода
        messageInputContainer.style.display = 'flex';
      });
    });
  }
  
  function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
      messagesContainer.innerHTML = '<div class="empty-state">Нет сообщений</div>';
      return;
    }
    
    // Группируем сообщения по датам
    const messagesByDate = groupMessagesByDate(messages);
    
    // Отображаем сообщения по группам
    Object.keys(messagesByDate).forEach(function(date) {
      const dateHeader = document.createElement('div');
      dateHeader.className = 'date-header';
      dateHeader.textContent = date;
      messagesContainer.appendChild(dateHeader);
      
      messagesByDate[date].forEach(function(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(message.role === 'USER' ? 'user-message' : 'bot-message');
        
        messageElement.innerHTML = '<div class="message-bubble">' + formatMessageContent(message.content) + '</div><div class="message-time">' + formatTime(message.timestamp) + '</div>';
        
        messagesContainer.appendChild(messageElement);
      });
    });
    
    // Прокручиваем к последнему сообщению
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function formatMessageContent(content) {
    // Заменяем переносы строк на <br>
    content = escapeHtml(content).replace(/\n/g, '<br>');
    
    // Заменяем URL на ссылки
    content = content.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank">$1</a>'
    );
    
    return content;
  }
  
  function groupMessagesByDate(messages) {
    const groups = {};
    
    messages.forEach(function(message) {
      const date = formatDate(message.timestamp);
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(message);
    });
    
    return groups;
  }
  
  function renderTrainingExamples(examples) {
    examplesList.innerHTML = '';
    
    const filteredExamples = filterExamples(examples);
    
    if (filteredExamples.length === 0) {
      examplesList.innerHTML = '<div class="no-examples">Нет примеров, соответствующих фильтрам</div>';
      return;
    }
    
    filteredExamples.forEach(function(example) {
      const exampleCard = document.createElement('div');
      exampleCard.classList.add('example-card');
      
      exampleCard.innerHTML = '<div class="example-header"><div class="example-category">' + getCategoryName(example.category) + '</div><div class="example-actions"><button class="action-button edit-button" data-id="' + example.id + '">Редактировать</button><button class="action-button delete-button" data-id="' + example.id + '">Удалить</button></div></div><div class="example-content"><div class="example-query"><h4>Запрос пользователя:</h4><p>' + escapeHtml(example.query) + '</p></div><div class="example-response"><h4>Ответ бота:</h4><p>' + escapeHtml(example.response) + '</p></div></div>';
      
      examplesList.appendChild(exampleCard);
      
      // Добавляем обработчики для кнопок редактирования и удаления
      exampleCard.querySelector('.edit-button').addEventListener('click', function() {
        openEditExampleModal(example);
      });
      
      exampleCard.querySelector('.delete-button').addEventListener('click', function() {
        showDeleteConfirmation(
          'Вы уверены, что хотите удалить этот пример?',
          function() {
            deleteExample(example.id);
          }
        );
      });
    });
  }
  
  function filterExamples(examples) {
    const searchQuery = searchExample.value.toLowerCase();
    const category = categoryFilter.value;
    
    return examples.filter(function(example) {
      const matchesSearch = example.query.toLowerCase().includes(searchQuery) || 
                          example.response.toLowerCase().includes(searchQuery);
      const matchesCategory = category === '' || example.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }
  
  function updateCategoryOptions(categories) {
    const exampleCategory = document.getElementById('example-category');
    const filterCategory = document.getElementById('category-filter');
    
    // Сохраняем текущие выбранные значения
    const selectedFilter = filterCategory.value;
    const selectedExample = exampleCategory.value;
    
    // Очищаем и добавляем дефолтные опции
    filterCategory.innerHTML = '<option value="">Все категории</option>';
    exampleCategory.innerHTML = '<option value="">Выберите категорию</option>';
    
    // Добавляем категории
    categories.forEach(function(category) {
      const filterOption = document.createElement('option');
      filterOption.value = category.id;
      filterOption.textContent = category.name;
      filterCategory.appendChild(filterOption);
      
      const exampleOption = document.createElement('option');
      exampleOption.value = category.id;
      exampleOption.textContent = category.name;
      exampleCategory.appendChild(exampleOption);
    });
    
    // Восстанавливаем выбранные значения, если они существуют
    if (selectedFilter) {
      filterCategory.value = selectedFilter;
    }
    
    if (selectedExample) {
      exampleCategory.value = selectedExample;
    }
  }
  
  function getCategoryName(categoryId) {
    const option = document.querySelector('#category-filter option[value="' + categoryId + '"]');
    return option ? option.textContent : categoryId;
  }
  
  // Modal Functions
  function openAddExampleModal() {
    exampleForm.reset();
    exampleForm.dataset.mode = 'add';
    document.querySelector('.modal-header h3').textContent = 'Добавить пример';
    exampleModal.style.display = 'block';
  }
  
  function openEditExampleModal(example) {
    exampleForm.reset();
    exampleForm.dataset.mode = 'edit';
    document.querySelector('.modal-header h3').textContent = 'Редактировать пример';
    
    document.getElementById('example-id').value = example.id;
    document.getElementById('example-category').value = example.category;
    document.getElementById('example-user-query').value = example.query;
    document.getElementById('example-response').value = example.response;
    
    exampleModal.style.display = 'block';
  }
  
  function closeModal() {
    exampleModal.style.display = 'none';
  }
  
  // Обработчики событий
  function setupEventListeners() {
    // Переключение между вкладками
    tabButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const tab = button.dataset.tab;
        
        // Удаляем active класс у всех табов
        tabButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        tabContents.forEach(function(content) {
          content.classList.remove('active');
        });
        
        // Добавляем active класс нужному табу
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
        
        // Загружаем данные в зависимости от выбранной вкладки
        if (tab === 'chat-tab') {
          fetchChats();
        } else if (tab === 'examples-tab') {
          fetchTrainingExamples();
        }
      });
    });
    
    // Поиск чатов
    chatSearch.addEventListener('input', function() {
      const query = chatSearch.value.toLowerCase();
      
      const filteredChats = chats.filter(function(chat) {
        return chat.name.toLowerCase().includes(query) || 
               (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(query));
      });
      
      renderChatList(filteredChats);
    });
    
    // Отправка сообщения
    sendButton.addEventListener('click', function() {
      const content = messageInput.value.trim();
      
      if (content && currentChatId) {
        sendMessage(currentChatId, content);
      }
    });
    
    // Отправка по Enter (Shift+Enter для переноса строки)
    messageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
      }
    });
    
    // Модальное окно для добавления примера
    addExampleButton.addEventListener('click', openAddExampleModal);
    closeModalButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    
    // Закрытие модального окна при клике вне него
    window.addEventListener('click', function(e) {
      if (e.target === exampleModal) {
        closeModal();
      }
    });
    
    // Обработка формы примера
    exampleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const id = document.getElementById('example-id').value;
      const example = {
        category: document.getElementById('example-category').value,
        query: document.getElementById('example-user-query').value,
        response: document.getElementById('example-response').value
      };
      
      if (exampleForm.dataset.mode === 'add') {
        createExample(example);
      } else {
        updateExample(id, example);
      }
      
      closeModal();
    });
    
    // Фильтрация примеров
    searchExample.addEventListener('input', function() {
      renderTrainingExamples(trainingExamples);
    });
    
    categoryFilter.addEventListener('change', function() {
      renderTrainingExamples(trainingExamples);
    });
  }
  
  // Инициализация
  async function init() {
    setupEventListeners();
    
    // Скрываем поле ввода сообщения, пока не выбран чат
    messageInputContainer.style.display = 'none';
    
    // Загружаем чаты при инициализации
    fetchChats();
  }
  
  // Запускаем приложение
  init();
});
