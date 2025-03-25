let products = [];
let user = [];
let tokenKey = "accessToken";
let categories = [];

let allProducts = []; // Исходный список товаров
let filteredProducts = []; // Отфильтрованные товары

let ProductId;
let UserID;

let modal = document.getElementById('profileModal');
let modalProduct = document.getElementById('productModal');
let modalAddProduct = document.getElementById('productAddModal');
let span = document.getElementById("closeModal");
let spanProduct = document.getElementById("closeModalProduct");
let spanAddProduct = document.getElementById("closeModalAddProduct");

function init() {
    getCategories()
        .then(() => getProducts())
        .catch(error => {
            console.error('Error loading data:', error);

            document.getElementById('products-container').innerHTML = '<div class="error">Ошибка загрузки данных</div>';
        });

    const email = sessionStorage.getItem("email");
    if (email != null) {
        user = {
            name: email
        };
        document.getElementById('exitBtn').classList.remove('hidden');
        document.getElementById('enter').classList.add('hidden');
        document.getElementById('linkToProfile').innerText = user.name;
        if (user.name === 'admin') {
            let menu = document.getElementById('menuBlock');

            let addProductBtn = document.createElement('button');

            addProductBtn.addEventListener("click", openAddProduct, false);
            addProductBtn.textContent = "Создать товар";

            menu.appendChild(addProductBtn);
        }
        getUserId();
    } else {
        document.getElementById('enter').classList.remove('hidden');
        document.getElementById('exitBtn').classList.add('hidden');
        document.getElementById('linkToProfile').classList.add('hidden');
    }
}

//Получить товары
function getProducts() {
    document.getElementById('products-container').innerHTML = '<div class="loader">Загрузка...</div>';

    return fetch("products")
        .then(response => response.json())
        .then(data => {
            allProducts = data; // Сохраняем исходные данные
            filteredProducts = [...allProducts]; // Копируем для отображения
            _displayProducts(filteredProducts); // Отображаем все товары
        })
        .catch(error => console.error('Unable to get products.', error));
}

function getOrders() {
    if (user.name === undefined) {
        console.log("Email пользователя не определен");
        return;
    }

    fetch(`order/${user.name}`)
        .then(response => response.json())
        .then(data => _displayOrders(data))
        .catch(error => console.error('Unable to get orders.', error));
}

function getCategories() {

    return fetch("categories")
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function getUser() {
    fetch("userByEmail/" + user.name)
        .then(response => response.json())
        .then(data => _displayUserFields(data))
        .catch(error => console.error('Unable to get user.', error));
}

function getUserId() {
    fetch("userByEmail/" + user.name)
        .then(response => response.json())
        .then(data => {
            UserID = data.userId;
            console.log('User ID установлен:', UserID);
        })
        .catch(error => console.error('Ошибка при получении ID пользователя:', error));
}

function _displayCategories(data) {
    const container = document.getElementById('categories');

    data.forEach(category => {
        let categoryName = document.createElement('a');
        let li = document.createElement('li');

        categoryName.textContent = category.name;

        categoryName.dataset.categoryId = category.categoryId;
        categoryName.addEventListener("click", filterByCategory, false);

        li.appendChild(categoryName);
        container.appendChild(li);
    });
    categories = data;
}

function _displayOrders(data) {
    const container = document.getElementById('orders-container');

    // Очищаем контейнер перед добавлением новых элементов
    container.innerHTML = '';

    data.forEach(order => {
        const product = products.find(p => p.productId === order.productId);

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
        payButton.addEventListener("click", () => payOrder(order.orderId));

        // Кнопка "Удалить"
        const deleteButton = document.createElement("button");
        deleteButton.className = "pay-button";
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener("click", () => deleteOrder(order.orderId));

        // Добавляем элементы в контейнер заказа
        orderDiv.appendChild(productName);
        orderDiv.appendChild(productPrice);
        orderDiv.appendChild(orderStatus);
        orderDiv.appendChild(payButton);
        orderDiv.appendChild(deleteButton);

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
        //div
        let divCard = document.createElement("div");
        let divPhoto = document.createElement("div");
        let divButtons = document.createElement("div");
        let divCardItems = document.createElement("div");
        let divDescription = document.createElement("div");

        //elements in div
        let img = document.createElement("img");

        let productName = document.createElement("h2");
        let productCategory = document.createElement("h4");
        let productPrice = document.createElement("h1");
        let productDescription = document.createElement("p");
        let addToCartBtn = document.createElement("button");
        let editProductBtn = document.createElement("button");
        let deleteProductBtn = document.createElement("button");


        divCard.className = "card";
        divPhoto.className = "photo";
        divDescription.className = "description";
        divCardItems.className = "cardItems";
        divButtons.className = "descriptionButtons";

        img.src = product.imageUrl;

        productName.textContent = product.name;
        productPrice.textContent = product.price + ' ₽';
        let category = categories.find(category => category.categoryId === product.categoryId);
        productCategory.textContent = category.name;
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
        divDescription.appendChild(productCategory);
        divDescription.appendChild(productDescription);
        divButtons.appendChild(addToCartBtn);

        if (user.name === "admin") {
            editProductBtn.textContent = "Изменить товар";
            deleteProductBtn.textContent = "Удалить товар";

            divButtons.appendChild(editProductBtn);
            divButtons.appendChild(deleteProductBtn);
        }
        divDescription.appendChild(divButtons);
        divCardItems.appendChild(divPhoto);
        divCardItems.appendChild(divDescription);
        divCard.appendChild(divCardItems);


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
    const token = sessionStorage.getItem(tokenKey);
    if (!product) {
        console.error('Товар не найден');
        return;
    }

    const order = {
        userId: UserID, // ID пользователя
        productId: productId, // ID товара
        quantity: 1, // Количество
        price: product.price, // Цена товара
        status: "Ожидает оплаты" // Статус заказа
    };

    fetch(`/order/add`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify(order)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка добавления товара в корзину');
            return response.json();
        })
        .then(() => {
            console.log('Товар успешно добавлен в корзину!');
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Ошибка при добавлении товара в корзину: ' + error.message);
        });
}

function filterByCategory(event) {
    const categoryId = event.target.dataset.categoryId; // Получаем ID категории

    const newProducts = allProducts.filter(product =>
        product.categoryId == categoryId
    );
    _displayProducts(newProducts);
}

// ВСЕ ЧТО КАСАЕТСЯ МОДАЛЬНЫХ, ОКОН НАЧИНАЕТСЯ ТУТ
function openAddProduct() {
    modalAddProduct.style.display = 'block';
    let categorySelect = document.getElementById('productCategory');
    while (categorySelect.options.length > 0) {
        categorySelect.remove(0);
    }

    categories.forEach(category => {
        const newOption = new Option(category.name, category.name);

        categorySelect.options.add(newOption);
    });
}

function addProduct() {
    let index = document.getElementById('productCategory').selectedIndex;
    const token = sessionStorage.getItem(tokenKey);
    let category = categories[index];

    const product = {
        name: document.getElementById('productName').value,
        categoryId: category.categoryId,
        price: document.getElementById('productPrice').value,
        description: document.getElementById('productDescription').value,
        imageUrl: document.getElementById('productPhoto').value
    };

    fetch(`product/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
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

    let categorySelect = document.getElementById('productCategoryEdit');
    while (categorySelect.options.length > 0) {
        categorySelect.remove(0);
    }
    categories.forEach(category => {
        const newOption = new Option(category.name, category.name);

        categorySelect.options.add(newOption);
    });

    document.getElementById('productNameEdit').value = product.name;
    document.getElementById('productPriceEdit').value = product.price;
    document.getElementById('productDescriptionEdit').value = product.description;
    document.getElementById('productPhotoEdit').value = product.imageUrl;

    modalProduct.style.display = 'block';

    ProductId = productId;
}

function deleteProduct(event) {
    if (!confirm('Вы уверены, что хотите удалить товар?')) return;
    const token = sessionStorage.getItem(tokenKey);
    const productId = event.target.dataset.productId;

    fetch(`/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': "Bearer " + token
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка удаления');
            products = [];
            getProducts(); // Обновляем список товаров
        })
        .catch(error => alert(error.message));
}

function saveProductChanges() {
    let index = document.getElementById('productCategoryEdit').selectedIndex;
    const token = sessionStorage.getItem(tokenKey);
    let category = categories[index];

    const productData = {
        productId: ProductId,
        categoryId: category.categoryId,
        name: document.getElementById('productNameEdit').value,
        price: document.getElementById('productPriceEdit').value,
        description: document.getElementById('productDescriptionEdit').value,
        imageUrl: document.getElementById('productPhotoEdit').value
    };

    fetch(`/product/edit/${productData.productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify(productData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сохранения');
            modalProduct.style.display = 'none';
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
    if (event.target === modal) {
        modal.style.display = "none"; // Закрываем окно вместо открытия
    }
    if (event.target === modalProduct) {
        modalProduct.style.display = "none";
    }
    if (event.target === modalAddProduct) {
        modalAddProduct.style.display = "none";
    }
};

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
        .then(() => {
            console.log('Изменения сохранены!');
            modal.style.display = "none"; // Закрываем модальные окна
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Ошибка при сохранении: ' + error.message);
        });
}

// ВСЕ, ЧТО КАСАЕТСЯ МОДАЛЬНЫХ ОКОН, ЗАКАНЧИВАЕТСЯ ТУТ

function payOrder(orderId) {
    if (!confirm("Вы уверены, что хотите оплатить этот заказ?")) return;

    fetch(`/order/pay/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка оплаты заказа');
            return response.json();
        })
        .then(() => {
            alert('Заказ успешно оплачен!');
            getOrders(); // Обновляем список заказов
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при оплате заказа: ' + error.message);
        });
}

function deleteOrder(orderId) {
    if (!confirm('Вы уверены, что хотите удалить товар?')) return;

    fetch(`/order/delete/${orderId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка удаления');

            getOrders(); // Обновляем список товаров
        })
        .catch(error => alert(error.message));
}

//Выйти с аккаунта
function exit() {
    document.getElementById('enter').classList.remove('hidden');
    document.getElementById('exitBtn').classList.add('hidden');
    document.getElementById('linkToProfile').classList.add('hidden');
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem("email");
    window.location.href = 'index.html';
}

// Показываем каталог
function showCatalog() {
    document.getElementById('wrapper').style.display = 'flex';
    document.getElementById('cart-page').style.display = 'none';
    getProducts(); // Загружаем товары
}

// Показываем корзину
function showCart() {
    document.getElementById('wrapper').style.display = 'none';
    document.getElementById('cart-page').style.display = 'block';
    getOrders(); // Загружаем заказы
}