let storedProductList = JSON.parse(localStorage.getItem('data')); // obtention des produits du localStorage
console.log('storedProductList:');
console.table(storedProductList);

let displaySection = document.getElementById('cart__items');
let deleteBtns = [];
let articleCount = 0;
let totalPrice = 0;


// affiche le panier
function displayCart() {
  if (storedProductList == null) {
    displaySection.innerHTML = "Votre panier est vide";
  } else {

    for (let i = 0; i < storedProductList.length; i++) { // itération des objets dans l'array obtenu
      storedProduct = storedProductList[i];
      console.log('storedProduct ' + i);
      console.table(storedProduct);

      let storedId = storedProduct.id;
      let storedQty = storedProduct.qty;
      let storedCol = storedProduct.col;

      product = `http://localhost:3000/api/products/${storedId}`; // identification du produit itéré

      fetch(product)
        .then((response) => response.json()
          .then((data) => {

            displayArticle(storedId, storedCol, storedQty, data, i);
          }))
        .catch((error) => {
          console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        });
    }
  }
}

// affiche l'article
function displayArticle(storedId, storedCol, storedQty, data, i) {

  // Attributs généraux
  let cartItem = document.createElement('article'); // création nouvel article
  document.querySelector('#cart__items').appendChild(cartItem); // nouvel article devient enfant de displaySection
  cartItem.className = 'cart__item'; // attribution du nom de la classe
  cartItem.setAttribute('data-id', storedId); // attributs
  cartItem.setAttribute('data-color', storedCol);

  // Image et alt txt 
  let imgDiv = document.createElement('div');
  imgDiv.className = 'cart__item__img';
  cartItem.appendChild(imgDiv);
  let imgEl = document.createElement('img');
  imgDiv.appendChild(imgEl);
  imgEl.setAttribute('src', data.imageUrl);
  imgEl.setAttribute('alt', data.altTxt);

  // Div pour la description
  let contentDiv = document.createElement('div');
  contentDiv.className = 'cart__item__content';
  cartItem.appendChild(contentDiv);
  let contentSubDiv = document.createElement('div');
  contentSubDiv.className = 'cart__item__content__description';
  contentDiv.appendChild(contentSubDiv);

  // Nom de l'article
  let nameEl = document.createElement('h2');
  contentSubDiv.appendChild(nameEl);
  nameEl.innerHTML = data.name;

  // Couleur selectionnée
  let colEl = document.createElement('p');
  contentSubDiv.appendChild(colEl);
  colEl.innerHTML = storedCol;

  // Prix de l'article
  let priceEl = document.createElement('p');
  contentSubDiv.appendChild(priceEl);
  priceEl.innerHTML = data.price;

  // getTotalPrice(data, storedQty);

  // Quantité
  let qtyDiv = document.createElement('div');
  qtyDiv.className = 'cart__item__content__settings';
  contentDiv.appendChild(qtyDiv);

  let qtySubDiv = document.createElement('div');
  qtySubDiv.className = 'cart__item__content__settings__quantity';
  qtyDiv.appendChild(qtySubDiv);

  let qtyTxt = document.createElement('p');
  qtySubDiv.appendChild(qtyTxt);
  qtyTxt.innerHTML = "Qté : ";

  // Quantité input
  let qtyInput = document.createElement('input');
  qtySubDiv.appendChild(qtyInput);
  qtyInput.setAttribute('type', 'number');
  qtyInput.className = 'itemQuantity';
  qtyInput.setAttribute('name', 'itemQuantity');
  qtyInput.setAttribute('min', '1');
  qtyInput.setAttribute('max', '100');
  qtyInput.setAttribute('value', storedQty);
  // Indiquer le prix à l'arrivée sur la page
  getTotalPriceOnLoad(data, storedQty)
  // Modification quantité
  qtyInput.addEventListener('change', (e) => {
    let getItem = JSON.parse(localStorage.getItem('data'));
    getItem[i].qty = e.target.value;
    localStorage.setItem('data', JSON.stringify(getItem));
    getTotalQty();
    getTotalPrice(data)
  });

  // Suppression
  let deleteDiv = document.createElement('div');
  qtyDiv.appendChild(deleteDiv);
  deleteDiv.className = 'cart__item__content__settings__delete';
  let deleteEl = document.createElement('p');
  deleteDiv.appendChild(deleteEl);
  deleteEl.className = 'deleteItem'; // éléments selectionnés avec querySelectorAll
  deleteEl.innerHTML = 'Supprimer';
  // Attributions et appel de la fonction de suppression
  deleteEl.addEventListener('click', deleteTarget);
  deleteEl.setAttribute('data-productid', storedId);
  deleteEl.setAttribute('data-productcolor', storedCol);
}

// Affichage de la quantité totale d'articles
function getTotalQty() {
  const array = JSON.parse(localStorage.getItem('data'));
  let sumQty = 0;

  for (let i = 0; i < array.length; i++) {
    sumQty += Number(array[i].qty); // remplacer array par array[i] une fois le prix obtenu dans data
  }
  let totalQtyEl = document.querySelector('#totalQuantity');
  totalQtyEl.innerHTML = sumQty;
}

// Total prix à l'arrivée sur la page
function getTotalPriceOnLoad(data, storedQty) {
  let articlesPrice = data.price * storedQty;
  totalPrice += articlesPrice;
  let totalPriceEl = document.querySelector('#totalPrice');
  totalPriceEl.innerHTML = totalPrice;
}

// Total prix sur modfification de la quantité
function getTotalPrice() {
  const basket = JSON.parse(localStorage.getItem('data'));
  let sumPrice = 0;

  for (let j = 0; j < basket.length; j++) {
    sumPrice += (Number(basket[j].qty)) * basket[j].price;
  }
  let totalpriceEl = document.querySelector('#totalPrice');
  totalpriceEl.innerHTML = sumPrice;
}

// Supprimer un article

function deleteTarget(e) {
  let getItem = JSON.parse(localStorage.getItem('data'));
  const indexOfExisting = getItem.findIndex(
    (el) => el.id === e.target.dataset.productid && el.col == e.target.dataset.productcolor);
  getItem.splice(indexOfExisting, 1);
  localStorage.setItem('data', JSON.stringify(getItem));
  e.path[4].remove(); // supprime le parent à l'index 4 de path: le <article> correspondant au produit
  alert('Article supprimé');
  location.reload();
}

// Vider le panier
document.getElementById('delete-all').addEventListener('click', deleteAll)

function deleteAll() {
  localStorage.clear();
  location.reload();
}


// Page flow
displayCart();
getTotalQty();