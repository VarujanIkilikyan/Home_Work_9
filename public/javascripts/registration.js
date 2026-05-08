const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); // ❌ Не отправляем стандартно

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    successMessage.style.display = 'none';

    // Собираем данные
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        age: parseInt(document.getElementById('age').value, 10)
    };

    // Фронтенд-валидация (опционально, можно убрать, если бэкенд делает всё)
    // const errors = {};
    //
    // if (!formData.name) errors.name = 'Имя обязательно';
    // if (!formData.email) {
    //     errors.email = 'Email обязателен';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //     errors.email = 'Введите корректный email';
    // }
    // if (!formData.password || formData.password.length < 6) {
    //     errors.password = 'Пароль должен быть не менее 6 символов';
    // }
    // if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
    //     errors.age = 'Возраст должен быть от 1 до 120';
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
    submitBtn.textContent = 'Отправка...';

    try {
        const response = await fetch('/users/registration', {
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
            form.reset();
            successMessage.style.display = 'block';
            setTimeout(() => {
                window.location.href = '/users/login'; // или куда нужно
            }, 1500);
        } else {
            // Ошибки с бэкенда (например, email уже занят)
            if (result.errors) {
                for (const [field, message] of Object.entries(result.errors)) {
                    const span = document.querySelector(`[data-error="${field}"]`);
                    if (span) {
                        span.textContent = message;
                        span.style.display = 'block';
                    }
                }
            } else {
                alert(result.message || 'Ошибка регистрации');
            }
        }
    } catch (err) {
        console.error('Ошибка сети:', err);
        alert('Не удалось подключиться к серверу. Попробуйте позже.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зарегистрироваться';
    }
});