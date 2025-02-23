const authCookieName = 'auth_cookie';
let user;
function init() {
    let cookieName = getCookie(authCookieName);
    if (cookieName != null) {
        user = {
            name: cookieName
        };
        document.getElementById('enter').classList.remove('hidden');
        document.getElementById('enter').innerText = user.name;
        window.location.href ='index.html'
    }
}

//Перевести страницу авторизации в режим регистрации
function switchToRegister() {
    let divReg = document.querySelector('.regBlock');
    let divAuth = document.querySelector('.authBlock');

    divAuth.style.display = "none";
    divReg.style.display = "flex";
}

//Перевести страницу регистрации в режим авторизации
function switchToLogin() {
    let divReg = document.querySelector('.regBlock');
    let divAuth = document.querySelector('.authBlock');

    divAuth.style.display = "flex"; 
    divReg.style.display = "none";
}

//Вход
function login() {
    const addEmailTextbox = document.getElementById('loginEmail'); 
    const addPassTextbox = document.getElementById('loginPass'); 

    const user = {
        Email: addEmailTextbox.value.trim(),
        PasswordHash: addPassTextbox.value.trim()
    }

    fetch("auth/user", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(setCookie(authCookieName, user.Email, 1))
        .then(window.location.href = 'auth.html')
        .catch(error => console.error('Unable to login.', error));
}

//Регистрация
function register() {
    const registerEmailTextbox = document.getElementById('registerEmail');
    const registerPassTextbox = document.getElementById('registerPassword');
    const repeatRegisterPassTextbox = document.getElementById('repeatRegisterPassword');

    if (registerPassTextbox.value.trim() != repeatRegisterPassTextbox.value.trim()) {
        alert("Пароли должны совпадать!");
    }
    else {
        const user = {
            Email: registerEmailTextbox.value.trim(),
            PasswordHash: registerPassTextbox.value.trim()
        }

        fetch("register/user", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .catch(error => console.error('Unable to register.', error));
    }
}

//Добавить куки на сайт
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//Удалить куки с сайта для выхода
function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Получить куки с сайта, чтобы проверить авторизован ли еще чел
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

//Шифрование куки
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}