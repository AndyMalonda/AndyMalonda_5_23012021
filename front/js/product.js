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

let product = `http://localhost:3000/api/products/${id}` // identification du produit

// Réupération data du produit
fetch(product)
    .then((response) => response.json()
        .then((data) => {
            console.table(data);
            displayArticle(data); // appel display
        }))
    .catch((error) => {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
    });

// Affichage du produit
function displayArticle(data) {
    titleSection.innerHTML = `${data.name}`;
    imgSection.innerHTML = `<img src="${data.imageUrl}" alt ="${data.altTxt}">`;
    priceSection.innerHTML = `${data.price}`;
    descriptionSection.innerHTML = `${data.description}`;
    for (let color of data.colors) {
        colorsSection.innerHTML += `<option value="${color}">${color}</option>`
    };
}

// Construction de l'objet Product
class Product {
    constructor(id, qty, col) {
        this.id = id;
        this.qty = Number(qty);
        this.col = col;
    }
}

// Gestion localStorage
let data = localStorage.getItem("data"); // obtention de la data du localStorage actuel

let productData = data ? JSON.parse(data) : [] // si data existante, création d'un nouvel array

addToCartBtn.addEventListener('click', addNewProduct)

function addNewProduct() {
    if (quantity.value > 0 && quantity.value <= 100 && colorsSection.value != "") {

        let productToStore = new Product(id, quantity.value, colorsSection.value); // création d'un nouvel objet Product

        console.table(productToStore);

        let dataToCompare = JSON.parse(data); // on crée une copie du localStorage pour comparer les données
        console.log(`current data in localStorage:${dataToCompare}`);

        if (dataToCompare != null) { // si le localStorage est vide, on ajoute le produit sans vérification

            const searchExisting = dataToCompare.findIndex(
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

function replaceQty(dataToCompare, searchExisting, productToStore) {
    console.log(dataToCompare[searchExisting].qty);
    let newQty = Number(dataToCompare[searchExisting].qty) + Number(quantity.value);
    productToStore.qty = newQty; // on remplace la valeur de quantité
    console.log(newQty);
    storeProduct(productToStore); // on ajoute le produit
    deleteDuplicateProduct(searchExisting); // on supprime l'ancien objet situé à l'index correspondant
    console.log(`Matching product found, replaced with new qty: ${newQty}`);
}

function storeProduct(productToStore) {
    productData.push(productToStore); // ajout du nouvel objet dans le nouvel array
    localStorage.setItem('data', JSON.stringify(productData)); // ajoute le nouvel array dans le localStorage
    console.log('Current storage:');
    console.table(productData);
    location.reload(); // rafraichit la page (temporaire)
}

function deleteDuplicateProduct(searchExisting) {
    let getItem = JSON.parse(localStorage.getItem('data'));
    getItem.splice(searchExisting, 1);
    localStorage.setItem('data', JSON.stringify(getItem))
}