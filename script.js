// --- Функции для санитации и отправки данных в Telegram ---
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
      .trim()
      .replace(/[<>]/g, '') // Удаляем < и >
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Удаляем управляющие символы
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
}

function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  // Оставляем только цифры и плюс
  let cleaned = phone.replace(/[^0-9+]/g, '');
  // Если есть несколько плюсов, оставляем только первый
  if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
  } else {
      cleaned = cleaned.replace(/\+/g, '');
  }
  return cleaned;
}

function sendDataToTelegram(message) {
  const botToken = "7536370506:AAEPOydxeenoerj2vvf4IMNMwWL690nWTMI";
  const chatId = "-1001563047379";
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const params = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
  };
  return fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
  }).then(response => response.json());
}

async function handleFormData(data, form) {
  // Санитация данных
  const sanitizedData = {
    message: sanitizeInput(data.message)
  };

  const message = `\n📩 Новый вопрос:\n<b>Сообщение:</b> ${sanitizedData.message}`;
  console.log('message', message);

  const successDiv = document.getElementById('form-success');
  const errorDiv = document.getElementById('form-error');
  if (successDiv) successDiv.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';

  try {
      const result = await sendDataToTelegram(message);
      console.log('result', result);
      if (result.ok) {
          if (successDiv) successDiv.style.display = 'block';
          form.reset();
      } else {
          if (errorDiv) errorDiv.style.display = 'block';
      }
  } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      if (errorDiv) errorDiv.style.display = 'block';
  }
}

// --- Обработчик отправки формы ---
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const data = Object.fromEntries(formData.entries());
    await handleFormData(data, orderForm);
  });
}

// --- Автоматическое изменение высоты textarea ---
const textarea = document.getElementById('message');
if (textarea) {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
  // Инициализация при загрузке (если есть текст)
  textarea.style.overflow = 'hidden';
  textarea.style.height = textarea.scrollHeight + 'px';
}
