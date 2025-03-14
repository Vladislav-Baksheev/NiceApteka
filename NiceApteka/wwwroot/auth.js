const authCookieName = 'auth_cookie';
let user;
var tokenKey = "accessToken";

function init() {
    document.getElementById('exitBtn').classList.add('hidden');
    document.getElementById('linkToProfile').classList.add('hidden');
    document.getElementById('enter').classList.remove('hidden');
    const email = sessionStorage.getItem("email");
    if (email != null) {
        user = {
            name: email
        };
        document.getElementById('enter').classList.remove('hidden');
        document.getElementById('enter').innerText = user.name;
        
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
async function login() {
    const addEmailTextbox = document.getElementById('loginEmail'); 
    const addPassTextbox = document.getElementById('loginPass'); 

    const user = {
        Email: addEmailTextbox.value.trim(),
        PasswordHash: addPassTextbox.value.trim()
    }

    const response = await fetch("auth/user", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: user.Email,
            PasswordHash: user.PasswordHash
        })
    });
    if (response.ok === true) {
        // получаем данные
        const data = await response.json();
        // изменяем содержимое и видимость блоков на странице
        document.getElementById('exitBtn').classList.remove('hidden');
        document.getElementById('enter').classList.add('hidden');
        document.getElementById('linkToProfile').classList.remove('hidden');
        document.getElementById('linkToProfile').innerText = user.Email;
        
        // сохраняем в хранилище sessionStorage токен доступа
        sessionStorage.setItem(tokenKey, data.access_token);
        sessionStorage.setItem("email", user.Email);
        window.location.href = 'index.html';
    }
    else  // если произошла ошибка, получаем код статуса
        console.log("Status: ", response.status);
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

//Добавить куки на сайт (МОЖНО УДАЛИТЬ, УЖЕ НЕ ИСПОЛЬЗУЕТСЯ!!!)
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//Удалить куки с сайта для выхода (МОЖНО УДАЛИТЬ, УЖЕ НЕ ИСПОЛЬЗУЕТСЯ!!!)
function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Получить куки с сайта, чтобы проверить авторизован ли еще чел (МОЖНО УДАЛИТЬ, УЖЕ НЕ ИСПОЛЬЗУЕТСЯ!!!)
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

//Шифрование куки (МОЖНО УДАЛИТЬ, УЖЕ НЕ ИСПОЛЬЗУЕТСЯ!!!)
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}