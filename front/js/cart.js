let storedProductList = JSON.parse(localStorage.getItem("data")); // obtention des produits du localStorage
console.table(storedProductList);

let displaySection = document.getElementById("cart__items");
let deleteBtns = [];
let productPrice = 0;
let articleCount = 0;
let totalPrice = 0;

// affiche le panier
function displayCart() {
  if (storedProductList == null) {
    displaySection.innerHTML = "Votre panier est vide";
  } else {
    for (let i = 0; i < storedProductList.length; i++) {
      // itération des objets dans l'array obtenu
      storedProduct = storedProductList[i];

      let storedId = storedProduct.id;
      let storedQty = storedProduct.qty;
      let storedCol = storedProduct.col;

      init(storedId, storedQty, storedCol, i);
    }
  }
}

async function init(storedId, storedQty, storedCol, i) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${storedId}`
    );
    const data = await response.json();
    displayArticle(storedId, storedCol, storedQty, data, i);
    productPrice = data.price;
  } catch (error) {
    return console.log(error);
  }
}

// affiche l'article
function displayArticle(storedId, storedCol, storedQty, data, i) {
  // Attributs généraux
  let cartItem = document.createElement("article"); // création nouvel article
  document.querySelector("#cart__items").appendChild(cartItem); // nouvel article devient enfant de displaySection
  cartItem.className = "cart__item"; // attribution du nom de la classe
  cartItem.setAttribute("data-id", storedId); // attributs
  cartItem.setAttribute("data-color", storedCol);

  // Image et alt txt
  let imgDiv = document.createElement("div");
  imgDiv.className = "cart__item__img";
  cartItem.appendChild(imgDiv);
  let imgEl = document.createElement("img");
  imgDiv.appendChild(imgEl);
  imgEl.setAttribute("src", data.imageUrl);
  imgEl.setAttribute("alt", data.altTxt);

  // Div pour la description
  let contentDiv = document.createElement("div");
  contentDiv.className = "cart__item__content";
  cartItem.appendChild(contentDiv);
  let contentSubDiv = document.createElement("div");
  contentSubDiv.className = "cart__item__content__description";
  contentDiv.appendChild(contentSubDiv);

  // Nom de l'article
  let nameEl = document.createElement("h2");
  contentSubDiv.appendChild(nameEl);
  nameEl.innerHTML = data.name;

  // Couleur selectionnée
  let colEl = document.createElement("p");
  contentSubDiv.appendChild(colEl);
  colEl.innerHTML = storedCol;

  // Prix de l'article
  let priceEl = document.createElement("p");
  contentSubDiv.appendChild(priceEl);
  priceEl.innerHTML = data.price;

  // Quantité
  let qtyDiv = document.createElement("div");
  qtyDiv.className = "cart__item__content__settings";
  contentDiv.appendChild(qtyDiv);
  let qtySubDiv = document.createElement("div");
  qtySubDiv.className = "cart__item__content__settings__quantity";
  qtyDiv.appendChild(qtySubDiv);
  let qtyTxt = document.createElement("p");
  qtySubDiv.appendChild(qtyTxt);
  qtyTxt.innerHTML = "Qté : ";

  // Quantité input
  let qtyInput = document.createElement("input");
  qtySubDiv.appendChild(qtyInput);
  qtyInput.setAttribute("type", "number");
  qtyInput.className = "itemQuantity";
  qtyInput.setAttribute("name", "itemQuantity");
  qtyInput.setAttribute("min", "1");
  qtyInput.setAttribute("max", "100");
  qtyInput.setAttribute("value", storedQty);
  // Indique le prix total à l'arrivée sur la page
  getTotalPriceOnLoad(data, storedQty);
  // Modification quantité
  qtyInput.addEventListener("change", (e) => {
    let getItem = JSON.parse(localStorage.getItem("data"));
    getItem[i].qty = e.target.value;
    localStorage.setItem("data", JSON.stringify(getItem)); // refresh quantité dans localStorage
    storedProductList = JSON.parse(localStorage.getItem("data"));
    console.table(storedProductList);
    getTotalQty(); // affichage de la quantité totale
    getTotalPrice(data); // affichage du prix total
  });

  // Suppression
  let deleteDiv = document.createElement("div");
  qtyDiv.appendChild(deleteDiv);
  deleteDiv.className = "cart__item__content__settings__delete";
  let deleteEl = document.createElement("p");
  deleteDiv.appendChild(deleteEl);
  deleteEl.className = "deleteItem"; // éléments selectionnés avec querySelectorAll
  deleteEl.innerHTML = "Supprimer";

  // Attributions et appel de la fonction de suppression
  deleteEl.addEventListener("click", deleteTarget);
  deleteEl.setAttribute("data-productid", storedId);
  deleteEl.setAttribute("data-productcolor", storedCol);
}

// Affichage de la quantité totale d'articles
function getTotalQty() {
  const array = JSON.parse(localStorage.getItem("data"));
  let sumQty = 0;

  for (let i = 0; i < array.length; i++) {
    sumQty += Number(array[i].qty); // remplacer array par array[i] une fois le prix obtenu dans data
  }
  let totalQtyEl = document.querySelector("#totalQuantity");
  totalQtyEl.innerHTML = sumQty;
}

// Total prix à l'arrivée sur la page
function getTotalPriceOnLoad(data, storedQty) {
  let articlesPrice = productPrice * storedQty;
  totalPrice += articlesPrice;
  let totalPriceEl = document.querySelector("#totalPrice");
  totalPriceEl.innerHTML = totalPrice;
}

// Total prix sur modfification de la quantité
function getTotalPrice() {
  const basket = JSON.parse(localStorage.getItem("data"));
  let sumPrice = 0;

  for (let j = 0; j < basket.length; j++) {
    let id = basket[j].id;
    fetchPrice(id);
    console.log("ProductPrice in func" + productPrice);

    sumPrice += Number(basket[j].qty) * productPrice;
  }
  let totalpriceEl = document.querySelector("#totalPrice");
  totalpriceEl.innerHTML = sumPrice;
}

// Obtenir prix d'un article
async function fetchPrice(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    const productFetched = await response.json();
    productPrice = productFetched.price;
    console.log("ProductPrice in fetch" + productPrice);
  } catch (error) {
    return console.log(error);
  }
}

// Supprimer un article
function deleteTarget(e) {
  let getItem = JSON.parse(localStorage.getItem("data"));
  const indexOfExisting = getItem.findIndex(
    // recherche du produit correspondant dans le localStorage
    (el) =>
      el.id === e.target.dataset.productid &&
      el.col == e.target.dataset.productcolor
  );
  getItem.splice(indexOfExisting, 1);
  localStorage.setItem("data", JSON.stringify(getItem));
  storedProductList = JSON.parse(localStorage.getItem("data"));
  console.table(storedProductList);
  e.path[4].remove(); // supprime le parent à l'index 4 de path: le <article> correspondant au produit
  alert("Article supprimé");
  getTotalPrice();
  getTotalQty();
}

// Vider le panier
document.getElementById("delete-all").addEventListener("click", deleteAll);

function deleteAll(e) {
  e.preventDefault();
  localStorage.clear();
}

// Formulaire

const form = document.querySelector(".cart__order__form");
const genericRegex = /^[A-Z][A-Za-z\é\è\ê\-]+$/;
const addressRegex = /[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Validation prénom
form.firstName.addEventListener("change", checkFirstName);

function checkFirstName() {
  if (genericRegex.test(form.firstName.value)) {
    document.querySelector("#firstNameErrorMsg").innerHTML = "";
    return true;
  } else {
    document.querySelector("#firstNameErrorMsg").innerHTML =
      "Prénom incorrect, caractères acceptés: A-Z - , .";
    return false;
  }
}

// Validation nom
form.lastName.addEventListener("change", checkLastName);

function checkLastName() {
  if (genericRegex.test(form.lastName.value)) {
    document.querySelector("#lastNameErrorMsg").innerHTML = "";
    return true;
  } else {
    document.querySelector("#lastNameErrorMsg").innerHTML =
      "Nom incorrect, caractères acceptés: A-Z - , .";
    return false;
  }
}

// Validation adresse
form.address.addEventListener("change", checkAddress);

function checkAddress() {
  if (addressRegex.test(form.address.value)) {
    document.querySelector("#addressErrorMsg").innerHTML = "";
    return true;
  } else {
    document.querySelector("#addressErrorMsg").innerHTML =
      "Adresse incorrecte, certains caractères non acceptés";
    return false;
  }
}

// Validation ville
form.city.addEventListener("change", checkCity);

function checkCity() {
  if (genericRegex.test(form.city.value)) {
    document.querySelector("#cityErrorMsg").innerHTML = "";
    return true;
  } else {
    document.querySelector("#cityErrorMsg").innerHTML =
      "Ville incorrect, caractères acceptés: A-Z - , .";
    return false;
  }
}

// Validation email
form.email.addEventListener("change", checkEmail);

function checkEmail() {
  if (emailRegex.test(form.email.value)) {
    document.querySelector("#emailErrorMsg").innerHTML = "";
    return true;
  } else {
    document.querySelector("#emailErrorMsg").innerHTML =
      "Adresse email incorrecte";
    return false;
  }
}

document
  .querySelector(".cart__order__form__submit")
  .addEventListener("click", submitForm);

function submitForm(e) {
  e.preventDefault(); // empêche l'event submit par défaut (refresh) de se déclencher

  if (storedProductList == null) {
    alert("Votre panier est vide");
  } else if (
    checkFirstName() && // on vérifie que les champs sont tous renseignés
    checkLastName() &&
    checkAddress() &&
    checkCity() &&
    checkEmail()
  ) {
    const contactData = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    };
    const productIds = [];

    for (let k = 0; k < storedProductList.length; k++) {
      productIds.push(storedProductList[k].id);
    }
    const order = {
      contact: contactData,
      products: productIds,
    };
    confirmOrder(order);
  } else {
    alert("Champs manquants ou incorrects");
  }
}

// fonction POST
async function confirmOrder(order) {
  try {
    const response = await fetch("http://localhost:3000/api/products/order", {
      // on fetch l'url
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order), // on attribue les données de produit et de contact au contenu
    });
    const data = await response.json();
    localStorage.clear(); // on efface l'ancien localStorage
    document.location.href = "confirmation.html?id=" + data.orderId; // on va à la page confirmation
  } catch (error) {
    console.log(error);
  }
}

// Page flow
displayCart();

if (storedProductList != null) {
  getTotalQty();
}
