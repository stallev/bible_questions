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
  const botToken = "7311009873:AAEzy-c1HrbXlvmcOJxCnDeyUZN0ApIzypE";
  const chatId = "-4914480902";
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

try {
    const result = await sendDataToTelegram(message);
    console.log('result', result);
    if (result.ok) {
        alert('Спасибо! Ваш вопрос принят. Мы свяжемся с вами в ближайшее время.');
        closeModal();
        form.reset();
    } else {
        alert('Ошибка при отправке сообщения. Пожалуйста, попробуйте ещё раз.');
    }
} catch (error) {
    console.error('Ошибка при отправке формы:', error);
    alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
}
}

// --- Обработчик отправки формы ---
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());
  
  await handleFormData(data, orderForm);
});
