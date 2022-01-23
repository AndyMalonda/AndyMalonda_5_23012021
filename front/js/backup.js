// Création d'une promesse

const promiseTest = new Promise(function (resolve, reject) { // possibilité de faire une fonction flechée à la place
    if (typeof products != 'undefined') {
        resolve(products);
    } else {
        reject('Produits indisponibles');
    }
});

promiseTest
    .then(function (u) {
        console.log(u);
    })
    .catch(function (e) {
        console.log(e);
    });

promiseTest
    .then(u => console.log(u))
    .catch(e => console.log(e)); // exemple de fonction flechée

/////////////////////////////////////////////////////////////////////////////////////

//ça non :
for (let element of tab) {
    container.innerHTML += "<div>" + element.name + "</div>";
}
//ça pourquoi pas, mais c'est pas optimisé (rechargement de l'affichage à chaque modification du innerHTML) :
for (let element of tab) {
    container.innerHTML += `<div>${element.name}</div>`;
}
//ça c'est mieux (un seul rechargement du innerHTML):
let content = "";
for (let element of tab) {
    content += `<div>${element.name}</div>`;
}
container.innerHTML = content;
//ça c'est encore mieux (car on évite de toucher directement au innerHTML, mais ça fait pareil) :
let content = "";
for (let element of tab) {
    content += `<div>${element.name}</div>`;
}
container.insertAdjacentElement('beforeend', content);

// push array dans le local storage ///////////////////////////////////////////////////////////////////////////////////

let data = localStorage.getItem("data");
let productData = data ? JSON.parse(data) : []

document.getElementById('btn').addEventListener('click', addNewProduct)

function addNewProduct() {
    let product = new Product(id, quantity.value, colorsSection.value);
    productData.push(product);
    localStorage.setItem('data', JSON.stringify(productData))
}

console.log(localStorage)

// Ajouter au panier ///////////////////////////////////////////////////////////////////////////////////

function addToCart() {
    if (quantity.value > 0 && quantity.value <= 100 && colorsSection.value != "") {

        let productParams = {
            'id': id,
            'qty': quantity.value,
            'col': colorsSection.value
        }

        let currentData = localStorage.getItem("productParams");
        let productParams = currentData ? JSON.parse(currentData) : [];

        localStorage.productParams = JSON.stringify(productParams);

        console.log(productParams + 'added');

    } else {
        alert('Sélectionnez une quantité (1-100) et une couleur');
    }
}

addToCartBtn.addEventListener("click", addToCart);

// Backup avant appendChild cart.js ///////////////////////////////////////////////////////////////////////////////////

let content = "";
content +=
    `
      <article class="cart__item" data-id="${storedId}" data-color="${storedCol}">
      <div class="cart__item__img">
        <img src="${data.imageUrl}" alt="${data.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${data.name}</h2>
          <p>${storedCol}</p>
          <p>${data.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storedQty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>
    `
displaySection.innerHTML += content;