let products = [];
const authCookieName = 'auth_cookie';
let user = []; 

let ProductId;

let UserID;

var modal = document.getElementById('profileModal');
var modalProduct = document.getElementById('productModal');
var span = document.getElementById("closeModal");
var spanProduct = document.getElementById("closeModalProduct");

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


window.onclick = function (event) {
    if (event.target == modal || event.target == modalProduct) {
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