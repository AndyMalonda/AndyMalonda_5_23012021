let parsedUrl = new URL(window.location.href); // récupération de l'URL actuelle
let id = parsedUrl.searchParams.get("id"); // recherche de l'ID dans l'URL récupérée
let url = `http://localhost:3000/api/products/${id}`; // identification du produit

const titleSection = document.getElementById("title");
const imgSection = document.querySelectorAll(".item__img")[0];
const priceSection = document.getElementById("price");
const descriptionSection = document.getElementById("description");
const colorsSection = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const addToCartBtn = document.getElementById("addToCart");

let product; // on déclare product car on fera passer la data du localStorage dans le scope global

let data = localStorage.getItem("data"); // obtention de la data du localStorage actuel
let productArray = data ? JSON.parse(data) : []; // si data existante, création d'un nouvel array

// Fetch et display de la data du produit stocké dans l'API
async function init() {
  try {
    const response = await fetch(url);
    product = await response.json();
    displayArticle();
  } catch (error) {
    return console.log(error);
  }
}

// Affichage du produit
function displayArticle() {
  titleSection.innerHTML = `${product.name}`;
  imgSection.innerHTML = `<img src="${product.imageUrl}" alt ="${product.altTxt}">`;
  priceSection.innerHTML = `${product.price}`;
  descriptionSection.innerHTML = `${product.description}`;
  for (let color of product.colors) {
    colorsSection.innerHTML += `<option value="${color}">${color}</option>`;
  }
}

// Confirmation de la sélection et envoi dans le panier
addToCartBtn.addEventListener("click", () => {
  if (
    quantity.value > 0 &&
    quantity.value <= 100 &&
    colorsSection.value != ""
  ) {
    // on vérifie que les champs soient correctement renseignés

    let productToStore = {
      // création d'un nouvel objet Product
      id: id,
      qty: quantity.value,
      col: colorsSection.value,
      price: product.price,
    };

    let getData = JSON.parse(data);

    if (getData != null) {
      // si le localStorage n'est pas vide, on va rechercher un potentiel doublon

      const dupIndex = getData.findIndex(
        (el) => el.id === productToStore.id && el.col == colorsSection.value
      ); // recherche d'un objet avec la même id et la même couleur

      if (dupIndex == -1) {
        // si pas de produit identique (index -1), on l'ajoute
        confirmSelection(productToStore);
      } else {
        // sinon, on prend l'index du doublon et on va modifier la quantité
        replaceQty(dupIndex, productToStore);
      }
    } else {
      // si le localStorage est vide, on va ajouter le produit
      confirmSelection(productToStore);
    }
  } else {
    alert("Sélectionnez une quantité (1-100) et une couleur");
  }
});

// Remplace la quantité si index existant
function replaceQty(dupIndex, productToStore) {
  productToStore.qty =
    Number(JSON.parse(data)[dupIndex].qty) + Number(quantity.value); // calcul de la nouvelle quantité
  confirmSelection(productToStore); // on ajoute le produit
  let getItem = JSON.parse(localStorage.getItem("data")); // on sélectionne le localStorage
  getItem.splice(dupIndex, 1); // on supprime l'objet à l'index trouvé
  localStorage.setItem("data", JSON.stringify(getItem)); // on remet le localStorage en place
}

// Ouverture de la fenêtre confirmer/annuler
function confirmSelection(productToStore) {
  if (confirm("Sélection confirmée, aller au panier ou annuler ?") == true) {
    goToCart(productToStore);
  } else {
    location.reload();
  }
}

// Ajout de la sélection au localStorage et direction panier
function goToCart(productToStore) {
  productArray.push(productToStore); // ajout du nouvel objet dans le nouvel array
  localStorage.setItem("data", JSON.stringify(productArray)); // ajoute le nouvel array dans le localStorage
  window.location.href = "cart.html"; // on va au panier
}

init();
