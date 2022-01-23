const products = "http://localhost:3000/api/products";

let displaySection = document.getElementById("items")

// Fetching des différents objets de l'API
fetch(products)
    .then((response) => response.json()
        .then((data) => {
            console.table(data);
            displayData(data);
        }))
    .catch((error) => {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
    });

// Affichage des produits
function displayData(data) {
    let content = "";
    for (let product of data) {
        content += `
    <a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt ="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
        </article>
    </a>
    `;
    }
    displaySection.innerHTML = content;
}