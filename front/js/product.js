let parsedUrl = new URL(window.location.href); // récupération de l'URL actuelle
let id = parsedUrl.searchParams.get("id"); // recherche de l'ID dans l'URL récupérée
let url = `http://localhost:3000/api/products/${id}` // identification du produit

const titleSection = document.getElementById('title');
const imgSection = document.querySelectorAll('.item__img')[0];
const priceSection = document.getElementById('price');
const descriptionSection = document.getElementById('description');
const colorsSection = document.getElementById('colors');
const quantity = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

let product; // on déclare product car on fera passer la data du localStorage dans le scope global

let data = localStorage.getItem("data"); // obtention de la data du localStorage actuel
let productData = data ? JSON.parse(data) : []; // si data existante, création d'un nouvel array

// Fetch et display de la data du produit stocké dans l'API
async function init() {
    try {
        const response = await fetch(url);
        const responseData = await response.json();
        product = responseData;
        displayArticle();
    } catch (error) {
        return console.log(error);
    }
};

// Affichage du produit
function displayArticle() {
    titleSection.innerHTML = `${product.name}`;
    imgSection.innerHTML = `<img src="${product.imageUrl}" alt ="${product.altTxt}">`;
    priceSection.innerHTML = `${product.price}`;
    descriptionSection.innerHTML = `${product.description}`;
    for (let color of product.colors) {
        colorsSection.innerHTML += `<option value="${color}">${color}</option>`
    };
};

// Confirmation de la sélection et envoi dans le panier
addToCartBtn.addEventListener('click', () => {

    if (quantity.value > 0 && quantity.value <= 100 && colorsSection.value != "") { // on vérifie que les champs soient correctement renseignés

        let productToStore = { // création d'un nouvel objet Product
            'id': id,
            'qty': quantity.value,
            'col': colorsSection.value,
            'price': product.price
        };

        let dataToCompare = JSON.parse(data); // on consulte le localStorage pour comparer les données

        if (dataToCompare != null) { // si le localStorage n'est pas vide, on va rechercher un potentiel doublon

            const existingDuplicate = dataToCompare.findIndex(
                (el) => el.id === productToStore.id && el.col == colorsSection.value); // recherche d'un objet avec la même id et la même couleur

            if (existingDuplicate == -1) { // si pas de produit identique (index -1), on l'ajoute
                storeProduct(productToStore);

            } else { // sinon, on prend l'index du doublon et on va modifier la quantité
                replaceQty(dataToCompare, existingDuplicate, productToStore);
            }

        } else { // si le localStorage est vide, on va ajouter le produit
            storeProduct(productToStore);
        }

    } else {
        alert('Sélectionnez une quantité (1-100) et une couleur');
    }
});

// Remplace la quantité si index existant
function replaceQty(dataToCompare, existingDuplicate, productToStore) {
    let newQty = Number(dataToCompare[existingDuplicate].qty) + Number(quantity.value); // calcul de la nouvelle quantité
    productToStore.qty = newQty; // on remplace la valeur de quantité
    storeProduct(productToStore); // on ajoute le produit
    deleteDuplicateProduct(existingDuplicate); // on supprime l'ancien objet situé à l'index correspondant
}

// Ouverture de la fenêtre confirmer/annuler
function storeProduct(productToStore) {
    if (confirm('Sélection confirmée, aller au panier ou annuler ?') == true) {
        goToCart(productToStore);
    } else {
        location.reload()
    }
};

// Ajout de la sélction au localStorage et direction panier
function goToCart(productToStore) {
    productData.push(productToStore); // ajout du nouvel objet dans le nouvel array
    localStorage.setItem('data', JSON.stringify(productData)); // ajoute le nouvel array dans le localStorage
    window.location.href = 'cart.html'; // on va au panier
};

// Suppression du doublon
function deleteDuplicateProduct(existingDuplicate) {
    let getItem = JSON.parse(localStorage.getItem('data')); // on sélectionne le localStorage
    getItem.splice(existingDuplicate, 1); // on supprime l'objet à l'index trouvé
    localStorage.setItem('data', JSON.stringify(getItem)); // on remet le localStorage en place
};

// Page flow
init();