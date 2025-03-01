let products = [];
const authCookieName = 'auth_cookie';
let user = []; 

let ProductId;

let UserID;

var modal = document.getElementById('profileModal');
var modalProduct = document.getElementById('productModal');
var modalAddProduct = document.getElementById('productAddModal');
var span = document.getElementById("closeModal");
var spanProduct = document.getElementById("closeModalProduct");
var spanAddProduct = document.getElementById("closeModalAddProduct");

function init(){
    getProducts();
    let cookieName = getCookie(authCookieName);
    if (cookieName != null) {
        user = {
            name: cookieName
        };
        document.getElementById('exitBtn').classList.remove('hidden');
        document.getElementById('enter').classList.add('hidden');
        document.getElementById('linkToProfile').innerText = user.name;
        if (user.name == 'admin') {
            let menu = document.getElementById('menuBlock');

            var addProductBtn = document.createElement('button');

            addProductBtn.addEventListener("click", openAddProduct, false);
            addProductBtn.textContent = "Создать товар";

            menu.appendChild(addProductBtn);
        }
        getUserId();
    }
    else {
        document.getElementById('enter').classList.remove('hidden');
        document.getElementById('exitBtn').classList.add('hidden');
        document.getElementById('linkToProfile').classList.add('hidden');
    }
}

//Получить товары
function getProducts() {
    document.getElementById('products-container').innerHTML = '<div class="loader">Загрузка...</div>';

    fetch("products")
        .then(reponse => reponse.json())
        .then(data => _displayProducts(data))
        .catch(error => console.error('Unable to get products.', error));
}

function getOrders() {
    if (user.name == undefined) {
        console.log("Email пользователя не определен");
        return;
    }

    fetch(`order/${user.name}`)
        .then(reponse => reponse.json())
        .then(data => _displayOrders(data))
        .catch(error => console.error('Unable to get orders.', error));
}

function getUser() {
    fetch("userByEmail/" + user.name)
        .then(reponse => reponse.json())
        .then(data => _displayUserFields(data))
        .catch(error => console.error('Unable to get user.', error));
}

function getUserId() {
    fetch("userByEmail/" + user.name)
        .then(response => response.json())
        .then(data => {
            if (true) {
                UserID = data.userId; 
                console.log('User ID установлен:', UserID); 
            } else {
                console.error('ID пользователя не найден в ответе сервера');
            }
        })
        .catch(error => console.error('Ошибка при получении ID пользователя:', error));
}

function _displayOrders(data) {
    const container = document.getElementById('orders-container');

    // Очищаем контейнер перед добавлением новых элементов
    container.innerHTML = '';

    data.forEach(order => {
        const product = products.find(p => p.productId == order.productId);

        // Создаем элементы для каждого заказа
        const orderDiv = document.createElement("div");
        orderDiv.className = "order-item";

        // Название товара
        const productName = document.createElement("div");
        productName.className = "product-name";
        productName.textContent = product.name || "Название товара не указано";

        // Цена товара
        const productPrice = document.createElement("div");
        productPrice.className = "product-price";
        productPrice.textContent = `Цена: ${order.price || 0} руб.`;

        // Статус заказа
        const orderStatus = document.createElement("div");
        orderStatus.className = "order-status";
        orderStatus.textContent = `Статус: ${order.status || "Не указан"}`;

        // Кнопка "Оплатить"
        const payButton = document.createElement("button");
        payButton.className = "pay-button";
        payButton.textContent = "Оплатить";
        //payButton.addEventListener("click", () => payOrder(order.orderId));

        // Добавляем элементы в контейнер заказа
        orderDiv.appendChild(productName);
        orderDiv.appendChild(productPrice);
        orderDiv.appendChild(orderStatus);
        orderDiv.appendChild(payButton);

        // Добавляем заказ в общий контейнер
        container.appendChild(orderDiv);


    });
}

//Вывести товары на сайт
function _displayProducts(data) {

    const container = document.getElementById('products-container');

    // Очищаем контейнер перед добавлением новых элементов
    container.innerHTML = '';

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
        var editProductBtn = document.createElement("button");
        var addProductBtn = document.createElement("button");
        var deleteProductBtn = document.createElement("button");


        divCard.className = "card";
        divPhoto.className = "photo";
        divDescription.className = "description";

        img.src = product.imageUrl;

        productName.textContent = product.name;
        /*productCategory.textContent = ;*/
        productPrice.textContent = product.price;
        productDescription.textContent = product.description;
        addToCartBtn.textContent = "Добавить в корзину";
        addToCartBtn.dataset.productId = product.productId;
        addToCartBtn.addEventListener("click", addToCart, false);
        editProductBtn.addEventListener("click", editProduct, false);
        deleteProductBtn.addEventListener("click", deleteProduct, false);

        editProductBtn.dataset.productId = product.productId;
        deleteProductBtn.dataset.productId = product.productId;

        divPhoto.appendChild(img);
        divDescription.appendChild(productName);
        divDescription.appendChild(productPrice);
        divDescription.appendChild(productDescription);
        divDescription.appendChild(addToCartBtn);
        if (user.name == "admin") {
            editProductBtn.textContent = "Изменить товар";
            deleteProductBtn.textContent = "Удалить товар";

            divDescription.appendChild(editProductBtn);
            divDescription.appendChild(deleteProductBtn);
        }
        divCard.appendChild(divPhoto);
        divCard.appendChild(divDescription);

        container.appendChild(divCard);
    });
    products = data;
}

function _displayUserFields(userData) {
    // Убедимся, что данные есть и это объект
    if (!userData) {
        console.error('User data is undefined');
        return;
    }

    let address = document.getElementById("userAddressEdit");
    let phone = document.getElementById("userPhoneEdit");

    // Проверяем существование элементов в DOM
    if (!address || !phone) {
        console.error('Address or phone elements not found');
        return;
    }

    address.value = userData.address || ''; // Используем value для input или textContent для других элементов
    phone.value = userData.phoneNumber || '';
}

function addToCart(event) {
    const productId = event.target.dataset.productId; // Получаем ID товара
    const product = products.find(p => p.productId == productId); // Находим товар

    if (!product) {
        console.error('Товар не найден');
        return;
    }

    const order = {
        userId: UserID, // ID пользователя
        productId: productId, // ID товара
        quantity: 1, // Количество
        price: product.price, // Цена товара
        status: "pending" // Статус заказа
    };

    fetch(`/order/add`, { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка добавления товара в корзину');
            return response.json();
        })
        .then(data => {
            console.log('Товар успешно добавлен в корзину!');
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Ошибка при добавлении товара в корзину: ' + error.message);
        });
}


// ВСЕ ЧТО КАСАЕТСЯ МОДАЛЬНЫХ ОКОН НАЧИНАЕТСЯ ТУТ
function openAddProduct() {
    modalAddProduct.style.display = 'block';
}

function addProduct() {
    const product = {
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        description: document.getElementById('productDescription').value,
        imageUrl: document.getElementById('productPhoto').value
    };

    fetch(`product/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сохранения');
            modalAddProduct.style.display = 'none';
            getProducts(); // Обновляем список товаров
        })
        .catch(error => alert(error.message));
}

function editProduct(event) {
    const productId = event.target.dataset.productId;
    //document.getElementById('productId').value = productId;
    const product = products.find(p => p.productId == productId);

    document.getElementById('productNameEdit').value = product.name;
    document.getElementById('productPriceEdit').value = product.price;
    document.getElementById('productDescriptionEdit').value = product.description;
    document.getElementById('productPhotoEdit').value = product.imageUrl;

    modalProduct.style.display = 'block';

    ProductId = productId;
}

function deleteProduct(event) {
    if (!confirm('Вы уверены, что хотите удалить товар?')) return;

    const productId = event.target.dataset.productId;

    fetch(`/product/delete/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка удаления');
            products = [];
            getProducts(); // Обновляем список товаров
        })
        .catch(error => alert(error.message));
}

function saveProductChanges() {
    const productData = {
        productId: ProductId,
        name: document.getElementById('productNameEdit').value,
        price: document.getElementById('productPriceEdit').value,
        description: document.getElementById('productDescriptionEdit').value,
        imageUrl: document.getElementById('productPhotoEdit').value
    };

    fetch(`/product/edit/${productData.productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сохранения');
            productModal.style.display = 'none';
            getProducts(); // Обновляем список товаров
        })
        .catch(error => alert(error.message));
}
function openEditUser() {
    modal.style.display = "block";

    getUser();
}

span.onclick = function () {
    modal.style.display = "none";
}

spanProduct.onclick = function () {
    modalProduct.style.display = "none";
}
spanAddProduct.onclick = function () {
    modalAddProduct.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal || event.target == modalProduct || modalAddProduct) {
        modal.style.display = "none";
        modalProduct.style.display = "none";
    }
}

function saveChangesUser() {
    const address = document.getElementById("userAddressEdit").value;
    const phone = document.getElementById("userPhoneEdit").value;
    // Формируем объект для отправки
    const userData = {
        email: user.name, // Предполагая, что user.name содержит email
        address: address,
        phoneNumber: phone
    };

    // Отправляем PUT-запрос
    fetch(`user/edit/${user.name}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сохранения');
            return response.json();
        })
        .then(data => {
            console.log('Изменения сохранены!');
            modal.style.display = "none"; // Закрываем модалку
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Ошибка при сохранении: ' + error.message);
        });
}

// ВСЕ ЧТО КАСАЕТСЯ МОДАЛЬНЫХ ОКОН ЗАКАНЧИВАЕТСЯ ТУТ

function initCart() {
    let cookieName = getCookie(authCookieName);
    if (cookieName != null) {
        user = {
            name: cookieName
        };
        document.getElementById('exitBtn').classList.remove('hidden');
        document.getElementById('enter').classList.add('hidden');
        document.getElementById('linkToProfile').innerText = user.name;
        
        getUserId(); // todo: дожидаться выполнения функции
        getOrders();
    }
    else {
        document.getElementById('enter').classList.remove('hidden');
        document.getElementById('exitBtn').classList.add('hidden');
        document.getElementById('linkToProfile').classList.add('hidden');
    }
    
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

// Показываем каталог
function showCatalog() {
    document.getElementById('catalog-page').style.display = 'block';
    document.getElementById('cart-page').style.display = 'none';
    getProducts(); // Загружаем товары
}

// Показываем корзину
function showCart() {
    document.getElementById('catalog-page').style.display = 'none';
    document.getElementById('cart-page').style.display = 'block';
    getOrders(); // Загружаем заказы
}