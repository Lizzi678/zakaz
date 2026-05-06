/**
 * Логика квиза и интеграция с Telegram для NEON54
 * Файл: quiz-logic.js
 */

// Объект для хранения ответов пользователя
let answers = {
    start: "",
    Location: "",
    phone: "",
    desc: ""
};

// Функция переключения шагов
function nextStep(currentId, nextId, key, value) {
    answers[key] = value;
    document.getElementById(currentId).classList.remove('active');
    document.getElementById(nextId).classList.add('active');
    console.log("Текущие ответы:", answers);
}

// Финальная функция сбора данных и отправки
function handleFinalSubmit() {
    // Собираем данные из текстовых полей
    answers.phone = document.getElementById('phoneInput').value;
    answers.desc = document.getElementById('descInput').value;

    if (!answers.phone) {
        alert("Пожалуйста, введите номер телефона!");
        return;
    }

    sendToTelegram();
}

// Отправка данных в Telegram
function sendToTelegram() {
    // Данные твоего бота (Проверено по твоим скринам)
    const BOT_TOKEN = '8398950025:AAE-h96zFWswk8VcWgDNkDIbe6Fhdvng4FQ';
    const CHAT_ID = '1949742643';

    // Формируем сообщение
    const message = `🚀 <b>НОВАЯ ЗАЯВКА NEON54</b>\n\n` +
                    `📦 <b>Тип:</b> ${answers.start}\n` +
                    `📍 <b>Место:</b> ${answers.Location}\n` +
                    `📞 <b>Телефон:</b> <code>${answers.phone}</code>\n` +
                    `💬 <b>Описание:</b> ${answers.desc || 'Нет'}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    console.log("Отправка в Telegram...");

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => {
        if (response.ok) {
            alert("✅ Успех! Заявка отправлена в Telegram.");
            // Можно обнулить форму или перенаправить на главную
            location.reload(); 
        } else {
            return response.json().then(data => {
                console.error("Ошибка API:", data);
                alert("Ошибка Telegram: " + data.description);
            });
        }
    })
    .catch(error => {
        console.error("Ошибка сети:", error);
        alert("🚨 Не удалось отправить. Проверьте интернет или выключите VPN.");
    });
}