let parsedUrl = new URL(window.location.href); // récupération de l'URL actuelle
let id = parsedUrl.searchParams.get("id"); // recherche de l'ID dans l'URL récupérée

const titleSection = document.getElementById('title');
const imgSection = document.querySelectorAll('.item__img')[0];
const priceSection = document.getElementById('price');
const descriptionSection = document.getElementById('description');
const colorsSection = document.getElementById('colors');
// querySelector + querySelectorAll pour tous les éléments ?

const quantity = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

let url = `http://localhost:3000/api/products/${id}` // identification du produit

let product;

let data = localStorage.getItem("data"); // obtention de la data du localStorage actuel

let productData = data ? JSON.parse(data) : []; // si data existante, création d'un nouvel array

async function init() {
    try {
        const response = await fetch(url);
        const responseData = await response.json();
        product = responseData;
        displayArticle();
    } catch (error) {
        return console.log(error);
    }
}

init()

// Affichage du produit
function displayArticle() {
    titleSection.innerHTML = `${product.name}`;
    imgSection.innerHTML = `<img src="${product.imageUrl}" alt ="${product.altTxt}">`;
    priceSection.innerHTML = `${product.price}`;
    descriptionSection.innerHTML = `${product.description}`;
    for (let color of product.colors) {
        colorsSection.innerHTML += `<option value="${color}">${color}</option>`
    };
}

// Construction de l'objet Product
class Product {
    constructor(id, qty, col, price) {
        this.id = id;
        this.qty = Number(qty);
        this.col = col;
        this.price = Number(price);
    }
}

// Gestion localStorage

addToCartBtn.addEventListener('click', () => {
    addNewProduct()
})


function addNewProduct() {

    if (quantity.value > 0 && quantity.value <= 100 && colorsSection.value != "") {

        let productToStore = new Product(id, quantity.value, colorsSection.value, product.price); // création d'un nouvel objet Product

        console.table(productToStore);

        let dataToCompare = JSON.parse(data); // on crée une copie du localStorage pour comparer les données
        console.log(`current data in localStorage:${dataToCompare}`);

        if (dataToCompare != null) { // si le localStorage est vide, on ajoute le produit sans vérification

            const searchExisting = dataToCompare.findIndex( // si le localStorage contient au moins un élément, on vérifie un potentiel doublon
                (el) => el.id === productToStore.id && el.col == colorsSection.value); // on recherche l'index d'un objet déjà existant
            console.log(`Index of existing product: ${searchExisting}`);


            if (searchExisting == -1) { // si pas de produit identique, on l'ajoute
                storeProduct(productToStore);
                console.log('No match in localStorage: store new product');

            } else {
                replaceQty(dataToCompare, searchExisting, productToStore);
            }

        } else {

            storeProduct(productToStore);
            console.log('No data in localStorage: store new product');
        }

    } else {
        alert('Sélectionnez une quantité (1-100) et une couleur')
    }
}


// Fonctions gestion du panier
function replaceQty(dataToCompare, searchExisting, productToStore) {
    let newQty = Number(dataToCompare[searchExisting].qty) + Number(quantity.value);
    productToStore.qty = newQty; // on remplace la valeur de quantité
    storeProduct(productToStore); // on ajoute le produit
    deleteDuplicateProduct(searchExisting); // on supprime l'ancien objet situé à l'index correspondant
    console.log(`Matching product found, replaced with new qty: ${newQty}`);
}

function storeProduct(productToStore) {
    if (confirm('Commande prise en compte, aller au panier ?') == true) {
        goToCart(productToStore);
    } else {
        location.reload()
    }
}

function goToCart(productToStore) {
    productData.push(productToStore); // ajout du nouvel objet dans le nouvel array
    localStorage.setItem('data', JSON.stringify(productData)); // ajoute le nouvel array dans le localStorage
    window.location.href = 'cart.html';
}

function deleteDuplicateProduct(searchExisting) {
    let getItem = JSON.parse(localStorage.getItem('data'));
    getItem.splice(searchExisting, 1);
    localStorage.setItem('data', JSON.stringify(getItem))
}