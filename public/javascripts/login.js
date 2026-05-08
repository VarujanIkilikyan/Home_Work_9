const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); // ❌ Отменяем стандартную отправку

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    successMessage.style.display = 'none';

    // Собираем данные
    const formData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };

    // Клиентская валидация (опционально)
    // const errors = {};
    //
    // if (!formData.email) {
    //     errors.email = 'Email обязателен';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //     errors.email = 'Введите корректный email';
    // }
    //
    // if (!formData.password) {
    //     errors.password = 'Пароль обязателен';
    // } else if (formData.password.length < 6) {
    //     errors.password = 'Пароль должен быть не менее 6 символов';
    // }
    //
    // if (Object.keys(errors).length > 0) {
    //     for (const [field, message] of Object.entries(errors)) {
    //         const span = document.querySelector(`[data-error="${field}"]`);
    //         if (span) {
    //             span.textContent = message;
    //             span.style.display = 'block';
    //         }
    //     }
    //     return;
    // }

    // Блокируем кнопку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result);


        if (response.ok) {
            // Успех
            successMessage.style.display = 'block';
            form.reset();
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Редирект через 1.5 секунды
            setTimeout(() => {
                window.location.href = '/'; // или главная
            }, 1500);
        } else {
            // Ошибки с бэкенда
            if (result.errors) {
                for (const [field, message] of Object.entries(result.errors)) {
                    const spans = document.querySelectorAll(`[data-error="${field}"]`);
                    spans.forEach(span => {
                        span.textContent = message;
                        span.style.display = 'block';
                    });
                }
            } else {
                alert(result.message || 'Ошибка входа');
            }
        }
    } catch (err) {
        console.error('Ошибка сети:', err);
        alert('Не удалось подключиться к серверу. Проверьте интернет или попробуйте позже.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
    }
});