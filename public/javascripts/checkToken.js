if (!localStorage.getItem('token')) {
    window.location.href = '/users/login';
}

(async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/users/profile', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            alert('Invalid token!');
            window.location.href = '/users/login';
        }

        localStorage.setItem('userDate', JSON.stringify(result.user));
    } catch (error) {
        alert('Invalid token!');
        window.location.href = '/users/login';
    }
})();


// === DOM Elements ===
let confirmActionBtn = document.getElementById('confirmActionBtn');
const getAllBtn = document.getElementById('getAllBtn');
const getByIdBtn = document.getElementById('getByIdBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const addPostBtn = document.getElementById('addPostBtn');

const postIdInput = document.getElementById('postIdInput');
const updateTitleInput = document.getElementById('updateTitleInput');
const updateContentInput = document.getElementById('updateContentInput');

const addTitleInput = document.getElementById('addTitleInput');
const addContentInput = document.getElementById('addContentInput');

const postsContainer = document.getElementById('postsContainer');
const errorBox = document.getElementById('errorBox');

const userNameEl = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');
const userIdEl = document.getElementById('userId');
const userAgeEl = document.getElementById('userAge');

// === Загрузка пользователя ===
function loadUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameEl.textContent = `Имя: ${user.name}`;
        userEmailEl.textContent = `Email: ${user.email}`;
        userIdEl.textContent = `ID: ${user.id}`;
        userAgeEl.textContent = `Возраст: ${user.age || 'не указан'}`;
    }
}

// === Универсальная функция: скрывает всё, кроме нужного ===
function showOnly(...elements) {
    // Скрываем все возможные поля
    [postIdInput, updateTitleInput, updateContentInput, confirmActionBtn].forEach(el => {
        el.classList.add('hidden');
        if (el.value !== undefined) el.value = '';
    });
    errorBox.classList.add('hidden');

    // Показываем только нужные
    elements.forEach(el => el.classList.remove('hidden'));
}

// === Загрузка постов ===
async function loadPosts() {
    try {
        const response = await fetch('/posts');
        if (!response.ok) throw new Error('Не удалось загрузить посты');
        const {posts: allPosts} = await response.json();


        postsContainer.innerHTML = '';
        allPosts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post-card';
            postEl.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="post-meta">
              ID: ${post.id}<br>
              От: ${post.userId}<br>
              ${new Date(post.createdAt).toLocaleString()}
            </div>
          `;
            postsContainer.appendChild(postEl);
        });
    } catch (err) {
        showError('Ошибка загрузки постов: ' + err.message);
    }
}

// === Показать ошибку ===
function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
}

// === Установка обработчика без дублей ===
function setConfirmHandler(handler) {
    const newBtn = confirmActionBtn.cloneNode(true);
    confirmActionBtn.replaceWith(newBtn);
    confirmActionBtn = newBtn;
    confirmActionBtn.onclick = handler;
}

// === Кнопки ===

// Взять все посты — просто загружает, ничего не показывает
getAllBtn.addEventListener('click', () => {
    showOnly(); // скрываем всё
    loadPosts();
});

// Взять по ID — только ID + кнопка
getByIdBtn.addEventListener('click', () => {
    showOnly(postIdInput, confirmActionBtn);
    confirmActionBtn.textContent = 'Загрузить';

    setConfirmHandler(async () => {
        const id = postIdInput.value.trim();
        if (!id) return showError('Введите ID поста');

        try {
            const response = await fetch(`/posts/${id}`);
            if (!response.ok) throw new Error('Пост не найден');
            const post = await response.json();

            postsContainer.innerHTML = '';
            const postEl = document.createElement('div');
            postEl.className = 'post-card';
            postEl.innerHTML = `
            <h3>${post.post[0].title}</h3>
            <p>${post.post[0].content}</p>
            <div class="post-meta">
              ID: ${post.post[0].id}<br>
              От: ${post.post[0].userId}<br>
              ${new Date(post.post[0].createdAt).toLocaleString()}
            </div>
          `;
            postsContainer.appendChild(postEl);
        } catch (err) {
            showError('Ошибка: ' + err.message);
        }
    });
});

// Обновить пост — ID, заголовок, содержание
updateBtn.addEventListener('click', () => {
    showOnly(postIdInput, updateTitleInput, updateContentInput, confirmActionBtn);
    confirmActionBtn.textContent = 'Обновить';

    setConfirmHandler(async () => {
        const id = postIdInput.value.trim();
        const title = updateTitleInput.value.trim();
        const content = updateContentInput.value.trim();
        if (!id || !title || !content) return showError('Заполните все поля');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },

                body: JSON.stringify({title, content})
            });

            if (!response.ok) throw new Error('Не удалось обновить');
            alert('Пост обновлён!');
            loadPosts();
            showOnly(); // скрываем все инпуты
        } catch (err) {
            showError('Ошибка: ' + err.message);
        }
    });
});

// Удалить пост — только ID
deleteBtn.addEventListener('click', () => {
    showOnly(postIdInput, confirmActionBtn);
    confirmActionBtn.textContent = 'Удалить';

    setConfirmHandler(async () => {
        const id = postIdInput.value.trim();
        if (!id) return showError('Введите ID');
        const token = localStorage.getItem('token');

        if (!confirm('Удалить пост?')) return;

        try {
            const response = await fetch('/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) throw new Error('Не удалось удалить');
            alert('Пост удалён');
            loadPosts();
            showOnly();
        } catch (err) {
            showError('Ошибка: ' + err.message);
        }
    });
});

// Добавить пост
addPostBtn.addEventListener('click', async () => {
    const title = addTitleInput.value.trim();
    const content = addContentInput.value.trim();
    if (!title || !content) return showError('Заполните заголовок и содержание');
    console.log(title)

    const token = localStorage.getItem('token');


    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({"title": title, "content": content})
        });

        if (!response.ok) throw new Error('Не удалось добавить пост');
        alert('Пост добавлен!');
        addTitleInput.value = '';
        addContentInput.value = '';
        loadPosts();
    } catch (err) {
        showError('Ошибка: ' + err.message);
    }
});

// === Инициализация ===
loadUser();
loadPosts();
