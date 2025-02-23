let products = [];
const authCookieName = 'auth_cookie';
let user; 

function init(){
    getProducts();
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

//Получить товары
function getProducts() {
    fetch("products")
        .then(reponse => reponse.json())
        .then(data => _displayProducts(data))
        .catch(error => console.error('Unable to get products.', error));
}

//Вывести товары на сайт
function _displayProducts(data) {
    data.forEach(product => {
        //div's
        var divCard = document.createElement("div");
        var divPhoto = document.createElement("div");
        var divDescription = document.createElement("div");

        //    <h2>Название</h2>
        //    <h4>Категория</h4>
        //    <h1>Цена</h1>
        //    <p>Описание</p>
        //    <button>Добавить в корзину</button>

        //elements in div's
        var img = document.createElement("img");

        var productName = document.createElement("h2");
        var productCategory = document.createElement("h4");
        var productPrice = document.createElement("h1");
        var productDescription = document.createElement("p");
        var addToCartBtn = document.createElement("button");


        divCard.className = "card";
        divPhoto.className = "photo";
        divDescription.className = "description";

        img.src = product.imageUrl;

        productName.textContent = product.name;
        /*productCategory.textContent = ;*/
        productPrice.textContent = product.price;
        productDescription.textContent = product.description;
        addToCartBtn.textContent = "Добавить в корзину";

        divPhoto.appendChild(img);
        divDescription.appendChild(productName);
        divDescription.appendChild(productPrice);
        divDescription.appendChild(productDescription);
        divDescription.appendChild(addToCartBtn);
        divCard.appendChild(divPhoto);
        divCard.appendChild(divDescription);

        document.body.appendChild(divCard);
    });
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

//Выйти с аккаунта, удалив куки
function exit() {
    deleteCookie(authCookieName);
    window.location.href = 'auth.html'
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}