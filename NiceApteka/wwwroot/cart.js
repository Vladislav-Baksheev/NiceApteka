let products = [];
const authCookieName = 'auth_cookie';
let user;

function init() {
    getOrders();
    let cookieName = getCookie(authCookieName);
    if (cookieName != null) {
        user = {
            name: cookieName
        };
        document.getElementById('exitBtn').classList.remove('hidden');
        document.getElementById('enter').innerText = user.name;
    }
    else {
        document.getElementById('exitBtn').classList.add('hidden');
    }
}